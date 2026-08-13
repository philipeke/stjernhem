/**
 * Mäter hur jämnt sidan rullar: antal bildrutor per sekund under ett
 * kontrollerat svep, samt hur lång tid huvudtråden är upptagen.
 *
 *   node scripts/measure-perf.mjs [url]
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] ?? 'http://localhost:4173/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

// Simulera en långsammare maskin — där märks lagg först.
const client = await page.createCDPSession()
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2500))

// Nollpunkt: allt före det här är sidladdningens engångskostnad.
const before = await page.metrics()

const result = await page.evaluate(async () => {
  const frames = []
  let last = performance.now()
  let running = true

  const tick = (now) => {
    frames.push(now - last)
    last = now
    if (running) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  // Rulla ned genom hela sidan i jämn takt.
  const total = document.body.scrollHeight - window.innerHeight
  const startedAt = performance.now()
  const duration = 9000
  await new Promise((resolve) => {
    const step = () => {
      const t = (performance.now() - startedAt) / duration
      window.scrollTo(0, Math.min(1, t) * total)
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    step()
  })
  running = false

  const usable = frames.slice(5)
  usable.sort((a, b) => a - b)
  const mean = usable.reduce((a, b) => a + b, 0) / usable.length
  const p95 = usable[Math.floor(usable.length * 0.95)]
  const long = usable.filter((d) => d > 50).length
  return {
    frames: usable.length,
    fps: Math.round(1000 / mean),
    medianMs: +usable[Math.floor(usable.length / 2)].toFixed(1),
    p95Ms: +p95.toFixed(1),
    longFrames: long,
  }
})

const after = await page.metrics()
const delta = (key) => ((after[key] - before[key]) * 1000).toFixed(0)

console.log(`Bildrutor:        ${result.frames}`)
console.log(`Snitt-FPS:        ${result.fps}  (4× strypt CPU)`)
console.log(`Median bildruta:  ${result.medianMs} ms`)
console.log(`P95 bildruta:     ${result.p95Ms} ms`)
console.log(`Rutor över 50 ms: ${result.longFrames}`)
console.log('— under scrollen (9 s) —')
console.log(`Layout:           ${delta('LayoutDuration')} ms`)
console.log(`Stilberäkning:    ${delta('RecalcStyleDuration')} ms`)
console.log(`Skript:           ${delta('ScriptDuration')} ms`)
console.log(`Noder:            ${after.Nodes}`)

await browser.close()
