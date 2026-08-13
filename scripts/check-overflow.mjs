/**
 * Letar efter text som spiller ut ur sin behållare — typiskt långa svenska
 * sammansättningar i smala kolumner, som inte kan brytas och därför lägger
 * sig över innehållet bredvid.
 *
 *   node scripts/check-overflow.mjs [url]
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] ?? 'http://localhost:4173/'
const WIDTHS = [1280, 1440, 1680, 1024, 768, 390]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const problems = []

for (const width of WIDTHS) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: 900 })
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.evaluate(() => document.fonts.ready)
  // Låt intoningarna spela klart först — annars mäts elementen medan de
  // fortfarande är förskjutna av sin startposition.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 2000))

  const found = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('h1, h2, h3, h4, p, li, span, a, button')) {
      // scrollWidth > clientWidth betyder att innehållet är bredare än rutan.
      if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
        const s = getComputedStyle(el)
        if (s.overflowX !== 'visible') continue // avsiktligt rullbart
        if (s.position === 'absolute' || s.position === 'fixed') continue
        if (el.closest('[aria-hidden="true"]')) continue
        // Hoppa över inline-element som helt enkelt radbryts.
        if (s.display === 'inline') continue
        out.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 46),
          content: el.scrollWidth,
          box: el.clientWidth,
        })
      }
    }
    return out
  })

  for (const f of found) {
    problems.push(`[${width}px] <${f.tag}> "${f.text}" — innehåll ${f.content}px i ${f.box}px ruta`)
  }
  await page.close()
}

await browser.close()

if (problems.length) {
  console.log(`${problems.length} överflöden:`)
  for (const p of [...new Set(problems)]) console.log(' - ' + p)
  process.exitCode = 1
} else {
  console.log('Ingen text spiller ut ur sin behållare.')
}
