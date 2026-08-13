/** Mobilkontroller: träffytor, laddade bilder, meny som går att öppna. */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] ?? 'http://localhost:4173/'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)

await page.evaluate(async () => {
  const step = window.innerHeight * 0.6
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 130))
  }
  window.scrollTo(0, 0)
})
await new Promise((r) => setTimeout(r, 800))

const report = await page.evaluate(() => {
  const small = []
  for (const el of document.querySelectorAll('a[href], button, input, textarea')) {
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    if (rect.height < 40) {
      small.push(`${(el.textContent || '').trim().slice(0, 34) || el.tagName} ${Math.round(rect.width)}×${Math.round(rect.height)}`)
    }
  }
  const broken = [...document.querySelectorAll('img')]
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => i.currentSrc || i.src)
  return {
    small: [...new Set(small)],
    broken,
    navDisplay: getComputedStyle(document.querySelector('header nav')).display,
    height: document.body.scrollHeight,
  }
})

console.log('Sidhöjd (mobil):', report.height, 'px')
console.log('Desktopnav på mobil:', report.navDisplay)
console.log('Trasiga bilder:', report.broken.length ? report.broken.join(', ') : 'inga')
console.log(
  'Träffytor under 40 px höjd:',
  report.small.length ? '\n  ' + report.small.join('\n  ') : 'inga'
)

// Öppna mobilmenyn och kontrollera att den syns.
await page.click('button[aria-controls="mobilmeny"]')
await new Promise((r) => setTimeout(r, 700))
const menu = await page.evaluate(() => {
  const el = document.getElementById('mobilmeny')
  if (!el) return 'menyn renderades inte'
  const links = el.querySelectorAll('a').length
  return `synlig, ${links} länkar, opacity ${getComputedStyle(el).opacity}`
})
console.log('Mobilmeny:', menu)

await browser.close()
