/**
 * Kontrollerar rubrikerna på varje sida i ett brett spann av skärmbredder:
 * ingen automatisk avstavning (inga "bru-kar" mitt i ett ord) och inget som
 * spiller ut ur sin kolumn.
 *
 *   node scripts/check-headings.mjs [bas-url]
 */
import puppeteer from 'puppeteer-core'
import { PAGES, urlFor } from '../pages.config.mjs'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = (process.argv[2] ?? 'http://localhost:4173').replace(/\/$/, '')
const WIDTHS = [1920, 1600, 1440, 1366, 1280, 1180, 1100, 1024, 900, 768, 390]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const problems = []

for (const width of WIDTHS) {
  for (const page of PAGES) {
    const tab = await browser.newPage()
    await tab.setViewport({ width, height: 900, isMobile: width < 700 })
    await tab.goto(BASE + urlFor(page), { waitUntil: 'networkidle0', timeout: 60000 })
    await tab.evaluate(() => document.fonts.ready)
    await tab.evaluate(async () => {
      const step = window.innerHeight * 0.5
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 110))
      }
    })
    await new Promise((r) => setTimeout(r, 500))

    const found = await tab.evaluate(() => {
      const out = []
      for (const h of document.querySelectorAll('h1, h2, h3, h4')) {
        const label = (h.textContent || '').trim().slice(0, 38)
        const style = getComputedStyle(h)
        if (style.hyphens !== 'manual' && style.hyphens !== 'none') {
          out.push(`avstavning på "${label}" (hyphens: ${style.hyphens})`)
        }
        if (h.scrollWidth > h.clientWidth + 1 && h.clientWidth > 0) {
          out.push(`"${label}" spiller ut: ${h.scrollWidth}px i ${h.clientWidth}px`)
        }
      }
      return out
    })

    for (const f of found) problems.push(`[${width}px ${urlFor(page)}] ${f}`)
    await tab.close()
  }
}

await browser.close()

console.log(`Kontrollerade rubrikerna på ${PAGES.length} sidor i ${WIDTHS.length} bredder.`)
if (problems.length) {
  console.log(`\n${problems.length} anmärkningar:`)
  for (const p of [...new Set(problems)]) console.log(' - ' + p)
  process.exitCode = 1
} else {
  console.log('\nInga rubriker avstavas, och ingen spiller ut ur sin kolumn.')
}
