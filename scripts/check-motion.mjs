/**
 * Kontrollerar att rörelsen faktiskt lever: att det löpande bandet rör sig,
 * att intoningarna utlöses när man scrollar förbi, att stjärnhimlen ritas,
 * och att pausen utanför vy släpper när man kommer tillbaka.
 *
 *   node scripts/check-motion.mjs [bas-url]
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = (process.argv[2] ?? 'http://localhost:4173').replace(/\/$/, '')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: false, args: ['--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 90000 })
// Chrome stryper animationer i fönster som ligger bakom andra.
await page.bringToFront()
await page.evaluate(() => document.fonts.ready)
await sleep(2500)

const problems = []

// 1. Löpande bandet ska röra sig när det syns — men först när det syns.
// Hero är högre än fönstret, så bandet ligger under vikningen vid start.
const marquee = await page.evaluate(async () => {
  const el = document.querySelector('.animate-marquee')
  if (!el) return { finns: false }

  const pausadFore = el.closest('[data-paused]') !== null
  el.scrollIntoView({ block: 'center', behavior: 'instant' })
  await new Promise((r) => setTimeout(r, 600))

  const before = el.getBoundingClientRect().left
  await new Promise((r) => setTimeout(r, 800))
  return {
    finns: true,
    pausadFore,
    pausadEfter: el.closest('[data-paused]') !== null,
    rorelse: Math.abs(el.getBoundingClientRect().left - before),
  }
})
console.log(
  `Löpande band: pausat under vikningen = ${marquee.pausadFore}, ` +
    `efter att det scrollats fram = ${marquee.pausadEfter}, rörelse ${marquee.rorelse?.toFixed(1)} px/0,8 s`
)
if (!marquee.finns) problems.push('löpande bandet hittades inte')
else {
  if (!marquee.pausadFore) problems.push('bandet pausades inte medan det låg utanför vy')
  if (marquee.pausadEfter) problems.push('bandet förblev pausat trots att det syns')
  if (marquee.rorelse < 1) problems.push('bandet rör sig inte när det syns')
}

// 2. Stjärnhimlen ska rita något.
const stars = await page.evaluate(() => {
  const c = document.querySelector('canvas')
  if (!c) return null
  const ctx = c.getContext('2d')
  const data = ctx.getImageData(0, 0, c.width, Math.min(c.height, 400)).data
  let lit = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] > 8) lit++
  return lit
})
console.log(`Stjärnhimmel: ${stars === null ? 'ingen canvas' : `${stars} tända bildpunkter`}`)
if (!stars) problems.push('stjärnhimlen ritar ingenting')

// 3. Intoningar ska utlösas när man scrollar förbi.
const before = await page.evaluate(() => document.querySelectorAll('[data-reveal=""], [data-reveal-child]:not([data-reveal-group="in"] [data-reveal-child])').length)
await page.evaluate(async () => {
  const step = window.innerHeight * 0.5
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 200))
  }
})
await sleep(1500)
const after = await page.evaluate(() => ({
  intonade: document.querySelectorAll('[data-reveal="in"], [data-reveal-group="in"]').length,
  kvar: document.querySelectorAll('[data-reveal=""]').length,
  osynliga: [...document.querySelectorAll('[data-reveal], [data-reveal-child]')].filter(
    (e) => parseFloat(getComputedStyle(e).opacity) < 0.08
  ).length,
}))
console.log(`Intoningar: ${after.intonade} utlösta, ${after.kvar} ej utlösta, ${after.osynliga} fortfarande osynliga`)
if (after.intonade < 10) problems.push('för få intoningar utlöstes')
if (after.osynliga > 0) problems.push(`${after.osynliga} element förblev osynliga`)
console.log(`  (${before} väntade innan scrollen)`)

// 4. De drivande ljusfälten i hero ska pausa när hero rullat ur bild och
//    starta igen när man kommer tillbaka.
const aurora = await page.evaluate(async () => {
  const el = document.querySelector('.aurora')?.parentElement
  if (!el) return null
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
  await new Promise((r) => setTimeout(r, 700))
  const pausadLangtNer = el.hasAttribute('data-paused')
  window.scrollTo({ top: 0, behavior: 'instant' })
  await new Promise((r) => setTimeout(r, 700))
  return { pausadLangtNer, pausadUppe: el.hasAttribute('data-paused') }
})
console.log(
  aurora
    ? `Ljusfält i hero: pausade längst ned = ${aurora.pausadLangtNer}, pausade uppe = ${aurora.pausadUppe}`
    : 'Ljusfält i hero: hittades inte'
)
if (!aurora) problems.push('ljusfälten i hero hittades inte')
else {
  if (!aurora.pausadLangtNer) problems.push('ljusfälten pausades inte när hero rullat ur bild')
  if (aurora.pausadUppe) problems.push('ljusfälten förblev pausade uppe i hero')
}

await browser.close()

console.log('')
if (problems.length) {
  console.log(`${problems.length} anmärkningar:`)
  for (const p of problems) console.log(' - ' + p)
  process.exitCode = 1
} else {
  console.log('All rörelse lever, och pausen utanför vy släpper som den ska.')
}
