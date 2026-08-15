/**
 * Hämtar och optimerar fotografierna som används på stjernhem.se.
 *
 *   node scripts/fetch-images.mjs            # hämta (cachat) + optimera
 *   node scripts/fetch-images.mjs --force    # ladda om original
 *
 * Källa: Unsplash. Unsplash-licensen tillåter fri kommersiell användning
 * utan attribution — vi krediterar ändå fotograferna i CREDITS.md.
 *
 * Utdata per bild i public/img/:
 *   <namn>-<bredd>.avif / .webp   responsiva varianter
 *   <namn>.jpg                    fallback i störst bredd
 * samt src/data/images.generated.ts med mått + LQIP-placeholder.
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = path.join(ROOT, 'scripts', '.image-cache')
const OUT = path.join(ROOT, 'public', 'img')
const FORCE = process.argv.includes('--force')

/** @type {{name:string, id:string, credit:string, widths?:number[], ar?:number}[]} */
const IMAGES = [
  // Hero — dimmig granskog, nordisk, kylig. Ligger under en mörk gradient.
  { name: 'hero-forest', id: 'photo-1517782520350-a197eca44965', credit: 'Jachan DeVol', widths: [960, 1440, 1920], ar: 16 / 9 },
  // Dimmiga skogslager — parallax-avdelare.
  { name: 'forest-layers', id: 'photo-1663951489655-763bac01f770', credit: 'Sergey Pesterev', widths: [960, 1440, 1800], ar: 16 / 9 },
  // Sol genom dimma över vatten — "en hållbar väg framåt".
  { name: 'lake-dawn', id: 'photo-1636555269095-c7d28d705e58', credit: 'Marek Piwnicki', widths: [960, 1440, 1800], ar: 16 / 9 },
  // Människa vid fönster — sektionen om individen.
  { name: 'reflection', id: 'photo-1559433804-f883aa33026a', credit: 'Anthony Tran', widths: [640, 960, 1400], ar: 4 / 5 },
  // Arbetsstationer.
  { name: 'station-sewing', id: 'photo-1739117441029-9f2a8e59e8b2', credit: 'Bruno Cervera', widths: [640, 960, 1400], ar: 4 / 3 },
  { name: 'station-computer', id: 'photo-1729714055320-4d1c5d5e213d', credit: 'Christin Hume', widths: [640, 960, 1400], ar: 4 / 3 },
  { name: 'station-assembly', id: 'photo-1586969779380-316ecd14fc9b', credit: 'Xavi Cabrera', widths: [640, 960, 1400], ar: 4 / 3 },
  { name: 'station-craft', id: 'photo-1497218770144-3fea6dbc33fe', credit: 'Nathan Dumlao', widths: [640, 960, 1400], ar: 4 / 3 },
  { name: 'station-precision', id: 'photo-1741543591099-9b5b067241ac', credit: 'Nikita Ivanov', widths: [640, 960, 1400], ar: 4 / 3 },
  // Samtal och återkoppling.
  { name: 'conversation', id: 'photo-1573496546038-82f9c39f6365', credit: 'Christina @ wocintechchat.com', widths: [640, 960, 1400], ar: 3 / 2 },
  { name: 'feedback-meeting', id: 'photo-1573497620053-ea5300f94f21', credit: 'Christina @ wocintechchat.com', widths: [640, 960, 1400], ar: 3 / 2 },
  // Rapporten.
  { name: 'report', id: 'photo-1722929309984-c6b3e55dd6e5', credit: 'Kelly Sikkema', widths: [640, 960, 1400], ar: 4 / 3 },
  // Bohuslän — upptagningsområdet.
  { name: 'coast', id: 'photo-1586716938030-3ae3b95a606b', credit: 'Mikael Kristenson', widths: [960, 1440, 1800], ar: 16 / 9 },
]

const QUALITY = { avif: 52, webp: 74, jpg: 80 }

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function download(image) {
  const file = path.join(CACHE, `${image.name}.jpg`)
  if (!FORCE) {
    try {
      await fs.access(file)
      return file
    } catch {
      /* hämta nedan */
    }
  }
  const url = `https://images.unsplash.com/${image.id}?w=2800&q=85&fm=jpg&fit=max`
  process.stdout.write(`  ⤓ ${image.name} … `)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${image.name}: HTTP ${res.status}`)
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()))
  console.log('klart')
  return file
}

/** Liten suddig placeholder som base64 — visas medan bilden laddas. */
async function lqip(pipelineSource, ar) {
  const w = 20
  const h = Math.max(1, Math.round(w / ar))
  const buf = await sharp(pipelineSource)
    .resize(w, h, { fit: 'cover', position: 'attention' })
    .blur(1.2)
    .webp({ quality: 30, alphaQuality: 0 })
    .toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

async function process_(image) {
  const src = await download(image)
  const ar = image.ar ?? 3 / 2
  const widths = image.widths ?? [640, 960, 1400]
  const maxWidth = Math.max(...widths)

  for (const w of widths) {
    const h = Math.round(w / ar)
    const base = sharp(src).resize(w, h, { fit: 'cover', position: 'attention' })
    await base.clone().avif({ quality: QUALITY.avif, effort: 6 }).toFile(path.join(OUT, `${image.name}-${w}.avif`))
    await base.clone().webp({ quality: QUALITY.webp, effort: 5 }).toFile(path.join(OUT, `${image.name}-${w}.webp`))
  }
  await sharp(src)
    .resize(maxWidth, Math.round(maxWidth / ar), { fit: 'cover', position: 'attention' })
    .jpeg({ quality: QUALITY.jpg, mozjpeg: true })
    .toFile(path.join(OUT, `${image.name}.jpg`))

  const placeholder = await lqip(src, ar)
  console.log(`  ✓ ${image.name} (${widths.join('/')})`)
  return { name: image.name, widths, ar, placeholder, credit: image.credit }
}

async function main() {
  await ensureDir(CACHE)
  await ensureDir(OUT)
  console.log('Bygger bildbibliotek …')

  const manifest = []
  for (const image of IMAGES) manifest.push(await process_(image))

  const ts = `// GENERERAD FIL – redigera inte för hand.
// Kör \`npm run images\` för att bygga om (se scripts/fetch-images.mjs).

export type ImageAsset = {
  readonly name: string
  readonly widths: readonly number[]
  readonly ar: number
  readonly placeholder: string
  readonly credit: string
}

export const IMAGES = {
${manifest
  .map(
    (m) =>
      `  '${m.name}': {\n    name: '${m.name}',\n    widths: [${m.widths.join(', ')}],\n    ar: ${m.ar},\n    placeholder: '${m.placeholder}',\n    credit: ${JSON.stringify(m.credit)},\n  },`
  )
  .join('\n')}
} as const satisfies Record<string, ImageAsset>

export type ImageName = keyof typeof IMAGES
`
  await fs.writeFile(path.join(ROOT, 'src', 'data', 'images.generated.ts'), ts, 'utf8')

  const credits = `# Bildkrediter

Fotografierna på stjernhem.se kommer från [Unsplash](https://unsplash.com/license).
Unsplash-licensen tillåter fri användning, även kommersiellt, utan att attribution
krävs. Vi listar ändå fotograferna här.

${manifest.map((m) => `- \`${m.name}\` — ${m.credit} (Unsplash)`).join('\n')}

Logotyp, oktagram-symbol och all övrig grafik är originalarbete framtaget för
Stjernhem Rehabilitering & Hälsa AB.
`
  await fs.writeFile(path.join(ROOT, 'CREDITS.md'), credits, 'utf8')

  console.log(`\nKlart: ${manifest.length} bilder → public/img/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
