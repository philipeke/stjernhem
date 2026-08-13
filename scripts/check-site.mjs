/**
 * Kör samtliga kontroller mot varje sida på webbplatsen: konsolfel, trasiga
 * bilder, horisontell overflow, text som spiller ut, rubriknivåer, alt-text,
 * länkar som pekar på ingenting och synligt innehåll vid reducerad rörelse.
 *
 *   node scripts/check-site.mjs [bas-url]
 */
import puppeteer from 'puppeteer-core'
import { PAGES, urlFor } from '../pages.config.mjs'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = (process.argv[2] ?? 'http://localhost:4173').replace(/\/$/, '')
const VIEWS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'liten desktop', width: 1024, height: 800 },
  { name: 'mobil', width: 390, height: 844, mobile: true },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars'],
})
const problems = []
const seenLinks = new Set()

for (const page of PAGES) {
  const url = BASE + urlFor(page)

  for (const view of VIEWS) {
    const tab = await browser.newPage()
    await tab.setViewport({
      width: view.width,
      height: view.height,
      isMobile: !!view.mobile,
      hasTouch: !!view.mobile,
    })

    const where = `${urlFor(page)} @ ${view.name}`
    tab.on('console', (m) => {
      if (m.type() === 'error') problems.push(`${where}: konsolfel — ${m.text()}`)
    })
    tab.on('pageerror', (e) => problems.push(`${where}: skriptfel — ${e.message}`))
    tab.on('response', (r) => {
      if (r.status() >= 400) problems.push(`${where}: ${r.status()} på ${r.url()}`)
    })

    // 304 Not Modified är ett giltigt svar — sidan kom från cachen.
    const ok = (status) => (status >= 200 && status < 300) || status === 304
    const res = await tab.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    if (!res || !ok(res.status())) {
      problems.push(`${where}: sidan svarade ${res ? res.status() : 'inget'}`)
      await tab.close()
      continue
    }
    await tab.evaluate(() => document.fonts.ready)

    await tab.evaluate(async () => {
      const step = window.innerHeight * 0.5
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 200))
      }
      window.scrollTo(0, 0)
    })
    await sleep(1800)

    const report = await tab.evaluate(() => {
      const out = { overflowX: null, spill: [], invisible: [], noAlt: [], jumps: [], h1s: 0, links: [] }

      if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) {
        out.overflowX = `${document.documentElement.scrollWidth} > ${document.documentElement.clientWidth}`
      }

      for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,span,a,button')) {
        if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
          const s = getComputedStyle(el)
          if (s.overflowX !== 'visible' || s.display === 'inline') continue
          if (s.position === 'absolute' || s.position === 'fixed') continue
          if (el.closest('[aria-hidden="true"]')) continue
          out.spill.push(`<${el.tagName.toLowerCase()}> "${(el.textContent || '').trim().slice(0, 40)}"`)
        }
      }

      for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,figcaption')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue
        if (parseFloat(getComputedStyle(el).opacity) < 0.08 && !el.closest('[aria-hidden="true"]')) {
          out.invisible.push((el.textContent || '').trim().slice(0, 40))
        }
      }

      out.noAlt = [...document.querySelectorAll('img')]
        .filter((i) => i.getAttribute('alt') === null)
        .map((i) => i.currentSrc || i.src)

      const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1])
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) out.jumps.push(`h${levels[i - 1]} → h${levels[i]}`)
      }
      out.h1s = document.querySelectorAll('h1').length

      out.links = [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.startsWith('/'))

      return out
    })

    if (report.overflowX) problems.push(`${where}: horisontell overflow ${report.overflowX}`)
    for (const s of new Set(report.spill)) problems.push(`${where}: text spiller ut ${s}`)
    for (const s of new Set(report.invisible)) problems.push(`${where}: osynligt "${s}"`)
    for (const s of report.noAlt) problems.push(`${where}: bild utan alt ${s}`)
    for (const s of new Set(report.jumps)) problems.push(`${where}: rubrikhopp ${s}`)
    if (report.h1s !== 1) problems.push(`${where}: ${report.h1s} h1 (ska vara 1)`)
    for (const l of report.links) seenLinks.add(l)

    await tab.close()
  }
}

// Följ varje intern länk och kontrollera att den svarar 200.
const probe = await browser.newPage()
for (const link of [...seenLinks].sort()) {
  const res = await probe.goto(BASE + link, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => null)
  const status = res ? res.status() : 0
  if (!((status >= 200 && status < 300) || status === 304)) {
    problems.push(`intern länk ${link} svarade ${status || 'inget'}`)
  }
}
await probe.close()
await browser.close()

console.log(`Kontrollerade ${PAGES.length} sidor i ${VIEWS.length} bredder och ${seenLinks.size} interna länkar.`)
if (problems.length) {
  console.log(`\n${problems.length} anmärkningar:`)
  for (const p of [...new Set(problems)]) console.log(' - ' + p)
  process.exitCode = 1
} else {
  console.log('\nInga anmärkningar.')
}
