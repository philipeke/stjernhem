/**
 * Mäter tappade bildrutor i en riktig webbläsare med vsync — headless
 * Chrome ritar utan skärmuppdatering och ger därför alltid smickrande
 * siffror. Kör flera varianter efter varandra så att det går att se vad
 * som faktiskt kostar.
 *
 *   node scripts/measure-frames.mjs [url]
 *
 * Öppnar ett webbläsarfönster under mätningen.
 */
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.argv[2] ?? 'http://localhost:4173/'

/**
 * Varianter att jämföra. Enskilda körningar varierar kraftigt beroende på
 * vad maskinen annars gör, så varje variant körs flera gånger och
 * varvas med de andra. Det är medianen som betyder något.
 */
const VARIANTS = [
  { name: 'sidan som den är', setup: null },
  {
    name: 'all rörelse avstängd',
    reduced: true,
  },
]

const REPEATS = 5
const SCROLL_MS = 7000

async function run(browser, variant) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  if (variant.reduced) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  if (variant.setup) await variant.setup(page)

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 })
  // Chrome stryper animationer och rAF i fönster som ligger bakom andra.
  // Utan detta mäter vi en sida som knappt ritar något alls.
  await page.bringToFront()
  // Sidan har scroll-behavior: smooth för ankarhopp. Harnessen flyttar
  // scrollpositionen varje bildruta, och då skulle varje anrop starta en
  // egen mjuk scroll som slåss med nästa. Mät på rå scroll i stället.
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })
  if (variant.css) await page.addStyleTag({ content: variant.css })
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
    // Skärmen går på 60 Hz → 16,7 ms. Allt över 20 ms är en tappad ruta.
    const dropped = usable.filter((g) => g > 20).length
    const bad = usable.filter((g) => g > 33).length
    return {
      frames: usable.length,
      fps: Math.round(1000 / (usable.reduce((a, b) => a + b, 0) / usable.length)),
      p50: +sorted[Math.floor(sorted.length * 0.5)].toFixed(1),
      p95: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
      worst: +sorted[sorted.length - 1].toFixed(1),
      dropped,
      bad,
      droppedPct: +((dropped / usable.length) * 100).toFixed(1),
    }
  }, SCROLL_MS)

  await page.close()
  return result
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  defaultViewport: null,
  args: ['--window-size=1460,980', '--hide-scrollbars'],
})

console.log(
  `Mäter ${URL} — ${SCROLL_MS / 1000} s scroll, ${REPEATS} körningar per variant, 60 Hz\n`
)

const median = (values) => {
  const s = [...values].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

const results = new Map(VARIANTS.map((v) => [v.name, []]))

// Varva varianterna så att en tillfällig belastning inte råkar drabba
// bara den ena.
for (let round = 0; round < REPEATS; round++) {
  for (const variant of VARIANTS) {
    results.get(variant.name).push(await run(browser, variant))
  }
  process.stdout.write(`  körning ${round + 1}/${REPEATS} klar\n`)
}

console.log('\nvariant                        FPS   p95      värsta   tappade (median)')
console.log('─'.repeat(74))

for (const variant of VARIANTS) {
  const runs = results.get(variant.name)
  const fps = median(runs.map((r) => r.fps))
  const p95 = median(runs.map((r) => r.p95))
  const worst = median(runs.map((r) => r.worst))
  const pct = median(runs.map((r) => r.droppedPct))
  const spread = runs.map((r) => r.droppedPct)
  console.log(
    `${variant.name.padEnd(30)} ${String(fps).padStart(3)}   ` +
      `${String(p95).padStart(5)}   ${String(worst).padStart(6)}   ` +
      `${String(pct).padStart(5)} %   [${spread.join(', ')}]`
  )
}

await browser.close()
