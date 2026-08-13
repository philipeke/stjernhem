/**
 * QA-verktyg: kör igenom sidan i en riktig webbläsare, fångar skärmbilder
 * per sektion i både desktop- och mobilbredd och rapporterar
 * konsolfel samt horisontell overflow.
 *
 *   npm run preview          (i ett annat fönster)
 *   node scripts/shoot.mjs [url] [utmapp]
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs/promises'
import path from 'node:path'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] ?? 'http://localhost:4173/'
const OUT = process.argv[3] ?? 'C:\\Users\\phiek\\AppData\\Local\\Temp\\shots'

const VIEWS = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'mobile', width: 390, height: 844, dsf: 2, mobile: true },
]

const SECTIONS = [
  { id: 'top', label: '01-hero' },
  { id: 'utmaningen', label: '03-utmaningen' },
  { id: 'metod', label: '04-metod' },
  { id: 'tjanster', label: '05-tjanster' },
  { id: 'rapporten', label: '06-rapporten' },
  { id: 'om-oss', label: '07-om-oss' },
  { id: 'fragor', label: '08-fragor' },
  { id: 'kontakt', label: '09-kontakt' },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  await fs.mkdir(OUT, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
  })

  const problems = []

  for (const view of VIEWS) {
    const page = await browser.newPage()
    await page.setViewport({
      width: view.width,
      height: view.height,
      deviceScaleFactor: view.dsf,
      isMobile: !!view.mobile,
      hasTouch: !!view.mobile,
    })

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        problems.push(`[${view.name}] console.${msg.type()}: ${msg.text()}`)
      }
    })
    page.on('pageerror', (err) => problems.push(`[${view.name}] pageerror: ${err.message}`))
    page.on('requestfailed', (req) =>
      problems.push(`[${view.name}] requestfailed: ${req.url()} — ${req.failure()?.errorText}`)
    )

    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
    await page.evaluate(() => document.fonts.ready)
    await sleep(3200) // låt hero-sekvensen spela klart

    await page.screenshot({ path: path.join(OUT, `${view.name}-01-hero.png`) })

    // Rulla igenom hela sidan så att alla whileInView-animationer utlöses.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 260))
      }
      window.scrollTo(0, 0)
    })
    await sleep(900)

    for (const section of SECTIONS) {
      const found = await page.evaluate((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        el.scrollIntoView({ block: 'start', behavior: 'instant' })
        return true
      }, section.id)
      if (!found) {
        problems.push(`[${view.name}] saknar sektion #${section.id}`)
        continue
      }
      await sleep(1100)
      await page.screenshot({ path: path.join(OUT, `${view.name}-${section.label}.png`) })
    }

    // Sidfoten.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await sleep(900)
    await page.screenshot({ path: path.join(OUT, `${view.name}-10-footer.png`) })

    // Horisontell overflow?
    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth
      const offenders = []
      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0) continue
        if (rect.right > docWidth + 2 || rect.left < -2) {
          const style = getComputedStyle(el)
          if (style.position === 'fixed' || style.visibility === 'hidden') continue
          offenders.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)} → ${Math.round(rect.left)}..${Math.round(rect.right)} (doc ${docWidth})`
          )
        }
      }
      return {
        scrollW: document.documentElement.scrollWidth,
        clientW: docWidth,
        offenders: offenders.slice(0, 8),
      }
    })
    if (overflow.scrollW > overflow.clientW + 1) {
      problems.push(
        `[${view.name}] horisontell overflow: scrollWidth ${overflow.scrollW} > ${overflow.clientW}\n    ${overflow.offenders.join('\n    ')}`
      )
    }

    await page.close()
  }

  await browser.close()

  console.log(`Skärmbilder: ${OUT}`)
  if (problems.length) {
    console.log(`\n${problems.length} anmärkningar:`)
    for (const p of problems) console.log(' - ' + p)
  } else {
    console.log('\nInga anmärkningar.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
