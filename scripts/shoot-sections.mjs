/** Fångar hela sektioner (inte bara vyporten) för visuell granskning. */
import puppeteer from 'puppeteer-core'
import path from 'node:path'
import fs from 'node:fs/promises'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] ?? 'http://localhost:4173/'
const OUT = process.argv[3] ?? 'C:\\Users\\phiek\\AppData\\Local\\Temp\\shots-full'
const WIDTH = Number(process.argv[4] ?? 1440)

const IDS = ['utmaningen', 'metod', 'tjanster', 'rapporten', 'om-oss', 'fragor', 'kontakt']

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await fs.mkdir(OUT, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: WIDTH, height: 1000, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)

// Rulla igenom hela sidan så att alla inview-animationer har spelat.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 200))
  }
})
await sleep(1500)

for (const id of IDS) {
  const el = await page.$(`#${id}`)
  if (!el) {
    console.log('saknas:', id)
    continue
  }
  await el.screenshot({ path: path.join(OUT, `${id}.png`), captureBeyondViewport: true })
  console.log('✓', id)
}

const footer = await page.$('footer')
if (footer) await footer.screenshot({ path: path.join(OUT, 'footer.png') })

await browser.close()
console.log('→', OUT)
