/**
 * Kontroller som är lätta att missa: att inget innehåll blir osynligt vid
 * reducerad rörelse, att rubriknivåerna hänger ihop, att bilder har alt-text
 * och att alla ankarlänkar pekar på något som finns.
 *
 *   node scripts/check-a11y.mjs [url]
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] ?? 'http://localhost:4173/'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const problems = []

for (const reduced of [false, true]) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  if (reduced) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 180))
    }
  })
  await new Promise((r) => setTimeout(r, 2500))

  const report = await page.evaluate(() => {
    const invisible = []
    for (const el of document.querySelectorAll('h1, h2, h3, h4, p, li, figcaption')) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) continue
      const s = getComputedStyle(el)
      if (parseFloat(s.opacity) < 0.08 && el.closest('[aria-hidden="true"]') === null) {
        invisible.push(`${el.tagName}: ${(el.textContent || '').trim().slice(0, 50)}`)
      }
    }

    const imgsNoAlt = [...document.querySelectorAll('img')]
      .filter((i) => i.getAttribute('alt') === null)
      .map((i) => i.currentSrc || i.src)

    const anchors = [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h && h !== '#')
    const broken = [...new Set(anchors)].filter((h) => !document.querySelector(h))

    const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) =>
      Number(h.tagName[1])
    )
    const jumps = []
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) jumps.push(`h${headings[i - 1]} → h${headings[i]}`)
    }

    const h1s = document.querySelectorAll('h1').length

    return { invisible: invisible.slice(0, 10), imgsNoAlt, broken, jumps, h1s }
  })

  const tag = reduced ? 'reducerad rörelse' : 'normal'
  if (report.invisible.length) {
    problems.push(`[${tag}] osynligt innehåll (opacity ~0):\n    ` + report.invisible.join('\n    '))
  }
  if (report.imgsNoAlt.length) problems.push(`[${tag}] bild utan alt: ` + report.imgsNoAlt.join(', '))
  if (report.broken.length) problems.push(`[${tag}] trasiga ankarlänkar: ` + report.broken.join(', '))
  if (report.jumps.length) problems.push(`[${tag}] hopp i rubriknivå: ` + report.jumps.join(', '))
  if (report.h1s !== 1) problems.push(`[${tag}] antal h1 = ${report.h1s} (ska vara 1)`)

  await page.close()
}

await browser.close()

if (problems.length) {
  console.log(`${problems.length} anmärkningar:`)
  for (const p of problems) console.log(' - ' + p)
  process.exitCode = 1
} else {
  console.log('Inga anmärkningar.')
}
