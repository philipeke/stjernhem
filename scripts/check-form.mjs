/**
 * Provkör kontaktformuläret: tom inskickning ska ge felmeddelanden, ifylld
 * ska ge mejlutkast och kopieringsruta med rätt mottagare.
 *
 *   node scripts/check-form.mjs [bas-url]
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = (process.argv[2] ?? 'http://localhost:4173').replace(/\/$/, '')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
await page.goto(`${BASE}/kontakt/`, { waitUntil: 'networkidle0', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)

const problems = []
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 1. Tom inskickning
await page.evaluate(() => document.querySelector('form button[type="submit"]').click())
await sleep(500)
const empty = await page.evaluate(() => ({
  errors: [...document.querySelectorAll('[id$="-fel"]')].map((e) => e.textContent.trim()),
  invalid: document.querySelectorAll('[aria-invalid="true"]').length,
  focused: document.activeElement?.getAttribute('name'),
  navigated: location.pathname,
}))
console.log(`Tom inskickning → ${empty.errors.length} fel, fokus på "${empty.focused}"`)
for (const e of empty.errors) console.log(`   • ${e}`)
if (empty.errors.length < 4) problems.push('för få felmeddelanden vid tom inskickning')
if (empty.invalid < 4) problems.push('aria-invalid saknas på fälten')
if (empty.focused !== 'namn') problems.push(`fokus hamnade på "${empty.focused}", inte första fältet`)

// 2. Ogiltig e-post
await page.type('[name="namn"]', 'Karin Andersson')
await page.type('[name="organisation"]', 'Uddevalla kommun')
await page.type('[name="epost"]', 'karin.andersson')
await page.type('[name="meddelande"]', 'Vi har åtta deltagare och vill veta mer om upplägget.')
await page.evaluate(() => document.querySelector('form button[type="submit"]').click())
await sleep(400)
const badMail = await page.evaluate(() =>
  [...document.querySelectorAll('[id$="-fel"]')].map((e) => e.textContent.trim())
)
console.log(`Ogiltig e-post → ${badMail.join(' | ') || 'inget fel (fel!)'}`)
if (!badMail.length) problems.push('ogiltig e-postadress släpptes igenom')

// 3. Giltig inskickning — mailto får inte navigera bort från sidan
await page.evaluate(() => {
  const el = document.querySelector('[name="epost"]')
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(el, 'karin.andersson@uddevalla.se')
  el.dispatchEvent(new Event('input', { bubbles: true }))
})
await sleep(200)
await page.evaluate(() => document.querySelector('form button[type="submit"]').click())
await sleep(900)

const sent = await page.evaluate(() => {
  const panel = document.querySelector('[role="status"]')
  const area = document.getElementById('kopiera-text')
  const again = [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.href)
  return {
    panel: panel ? panel.textContent.replace(/\s+/g, ' ').trim().slice(0, 90) : null,
    text: area ? area.value : null,
    mailtos: again,
    stillHere: location.pathname,
  }
})

console.log(`\nEfter inskickning: ${sent.panel ?? 'ingen bekräftelse (fel!)'}`)
if (!sent.panel) problems.push('ingen bekräftelse visades')
if (!sent.text) problems.push('kopieringsrutan saknas')
else {
  console.log('\nMeddelandet som kan kopieras:\n' + sent.text.split('\n').map((l) => '   ' + l).join('\n'))
  if (!sent.text.includes('anneli@stjernhem.se')) problems.push('fel mottagare i meddelandet')
  if (!sent.text.includes('Uddevalla kommun')) problems.push('organisationen kom inte med')
  if (!sent.text.includes('karin.andersson@uddevalla.se')) problems.push('avsändarens e-post kom inte med')
}
if (!sent.mailtos.some((m) => m.includes('anneli%40stjernhem.se') || m.includes('anneli@stjernhem.se'))) {
  problems.push('ingen mailto-länk till anneli@stjernhem.se')
}
if (sent.stillHere !== '/kontakt/') problems.push(`sidan navigerade bort till ${sent.stillHere}`)

await browser.close()

console.log('')
if (problems.length) {
  console.log(`${problems.length} anmärkningar:`)
  for (const p of problems) console.log(' - ' + p)
  process.exitCode = 1
} else {
  console.log('Formuläret fungerar som det ska.')
}
