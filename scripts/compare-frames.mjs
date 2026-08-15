/**
 * Jämför två byggen sida vid sida med samma harness, varvade körningar och
 * median. Används för att kunna säga något ärligt om en optimering i stället
 * för att jämföra två mätningar tagna vid olika tillfällen.
 *
 *   node scripts/compare-frames.mjs <url-före> <url-efter>
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TARGETS = [
  { name: 'före', url: process.argv[2] ?? 'http://localhost:4174/' },
  { name: 'efter', url: process.argv[3] ?? 'http://localhost:4173/' },
]
const REPEATS = 5
const SCROLL_MS = 7000

async function run(browser, url) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 })
  await page.bringToFront()
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 2500))

  const result = await page.evaluate(async (duration) => {
    const gaps = []
    let last = performance.now()
    let running = true
    const tick = (now) => {
      gaps.push(now - last)
      last = now
      if (running) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    const total = document.body.scrollHeight - window.innerHeight
    const started = performance.now()
    await new Promise((resolve) => {
      const step = () => {
        const t = (performance.now() - started) / duration
        window.scrollTo(0, Math.min(1, t) * total)
        if (t < 1) requestAnimationFrame(step)
        else resolve()
      }
      step()
    })
    running = false

    const usable = gaps.slice(10)
    const sorted = [...usable].sort((a, b) => a - b)
    // Absolut gräns, inte relativ till körningens egen median: en ruta som
    // tar över 25 ms motsvarar under 40 bilder i sekunden och syns som hack.
    const slow = usable.filter((g) => g > 25).length
    return {
      fps: Math.round(1000 / (usable.reduce((a, b) => a + b, 0) / usable.length)),
      p95: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
      worst: +sorted[sorted.length - 1].toFixed(1),
      slowPct: +((slow / usable.length) * 100).toFixed(1),
    }
  }, SCROLL_MS)

  await page.close()
  return result
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  args: ['--window-size=1460,980', '--hide-scrollbars'],
})

const results = new Map(TARGETS.map((t) => [t.name, []]))
for (let i = 0; i < REPEATS; i++) {
  for (const target of TARGETS) results.get(target.name).push(await run(browser, target.url))
  process.stdout.write(`  körning ${i + 1}/${REPEATS} klar\n`)
}

console.log('\n            FPS   p95      värsta   rutor > 25 ms (median)')
console.log('─'.repeat(64))
for (const target of TARGETS) {
  const runs = results.get(target.name)
  console.log(
    `${target.name.padEnd(10)} ${String(median(runs.map((r) => r.fps))).padStart(3)}   ` +
      `${String(median(runs.map((r) => r.p95))).padStart(5)}   ` +
      `${String(median(runs.map((r) => r.worst))).padStart(6)}   ` +
      `${String(median(runs.map((r) => r.slowPct))).padStart(5)} %   ` +
      `[${runs.map((r) => r.slowPct).join(', ')}]`
  )
}

await browser.close()
