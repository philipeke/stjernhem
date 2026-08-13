/**
 * Genererar favicon, app-ikoner och delningsbild (Open Graph) ur
 * samma geometri som logotypen i src/components/Logo.tsx.
 *
 *   node scripts/make-brand-assets.mjs
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public')

const C = 60
const R_CARDINAL = 56
const R_DIAGONAL = 39
const R_INNER = 12.5

function starPath() {
  const pts = []
  for (let i = 0; i < 16; i++) {
    const a = ((i * 22.5 - 90) * Math.PI) / 180
    const r = i % 2 === 1 ? R_INNER : i % 4 === 0 ? R_CARDINAL : R_DIAGONAL
    pts.push(`${i === 0 ? 'M' : 'L'}${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`)
  }
  return `${pts.join(' ')} Z`
}

const STAR = starPath()
const ROOF = 'M52.4 61.6 L60 53.8 L67.6 61.6'
const HEARTH = 'M55.4 67.4 H64.6'

const SILVER = `
  <linearGradient id="silver" x1="6%" y1="0%" x2="94%" y2="100%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="26%" stop-color="#cfdae7"/>
    <stop offset="52%" stop-color="#8fa2b8"/>
    <stop offset="74%" stop-color="#e8eff7"/>
    <stop offset="100%" stop-color="#a5b5c8"/>
  </linearGradient>
  <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ecdcb8"/>
    <stop offset="55%" stop-color="#c9a96a"/>
    <stop offset="100%" stop-color="#ad8c4e"/>
  </linearGradient>`

/** @param {{bg?: string, home?: boolean, stroke?: number, pad?: number}} opts */
function markSvg({ bg = '#0c1e38', home = true, stroke = 3.4, pad = 8 } = {}) {
  const size = 120 + pad * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${size} ${size}" width="${size}" height="${size}">
  <defs>${SILVER}</defs>
  ${bg ? `<rect x="${-pad}" y="${-pad}" width="${size}" height="${size}" rx="${size * 0.22}" fill="${bg}"/>` : ''}
  <path d="${STAR}" fill="none" stroke="url(#silver)" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round"/>
  ${home ? `<path d="${ROOF}" fill="none" stroke="url(#gold)" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${HEARTH}" fill="none" stroke="url(#gold)" stroke-width="${stroke}" stroke-linecap="round"/>` : ''}
</svg>`
}

/** Delningsbild 1200 × 630. */
function ogSvg() {
  const W = 1200
  const H = 630
  // Enkla citattecken — strängen hamnar inuti ett dubbelciterat XML-attribut.
  const sans = "Montserrat, Arial, Helvetica, 'Liberation Sans', sans-serif"
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${SILVER}
    <linearGradient id="bg" x1="0%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#0a1526"/>
      <stop offset="52%" stop-color="#0c1e38"/>
      <stop offset="100%" stop-color="#050c18"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="34%" r="52%">
      <stop offset="0%" stop-color="#27507f" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#27507f" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>

  <g transform="translate(${W / 2} 168) scale(1.45) translate(-60 -60)">
    <circle cx="60" cy="60" r="57.2" fill="none" stroke="url(#silver)" stroke-opacity="0.3" stroke-width="0.8"/>
    <path d="${STAR}" fill="none" stroke="url(#silver)" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${ROOF}" fill="none" stroke="url(#gold)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${HEARTH}" fill="none" stroke="url(#gold)" stroke-width="2.3" stroke-linecap="round"/>
  </g>

  <text x="${W / 2}" y="322" text-anchor="middle" font-family="${sans}" font-size="62" font-weight="600"
        letter-spacing="21" fill="#eef3f9">STJERNHEM</text>
  <text x="${W / 2}" y="366" text-anchor="middle" font-family="${sans}" font-size="19" font-weight="400"
        letter-spacing="10" fill="#93a4b8">REHABILITERING &amp; HÄLSA</text>

  <line x1="${W / 2 - 160}" y1="418" x2="${W / 2 + 160}" y2="418" stroke="#c9a96a" stroke-opacity="0.45" stroke-width="1"/>

  <text x="${W / 2}" y="480" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="42" fill="#dfe8f2">Rätt insats från start</text>
  <text x="${W / 2}" y="530" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="27" font-style="italic" fill="#a9c0b0">En hållbar väg mot egen försörjning</text>

  <text x="${W / 2}" y="580" text-anchor="middle" font-family="${sans}" font-size="15" font-weight="500"
        letter-spacing="6" fill="#718398">ARBETSLIVSINRIKTAD REHABILITERING · UDDEVALLA</text>
</svg>`
}

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  // Favicon som SVG — skarp i alla storlekar.
  await fs.writeFile(path.join(OUT, 'favicon.svg'), markSvg({ stroke: 3.6, pad: 10 }), 'utf8')

  const icon = Buffer.from(markSvg({ stroke: 3.6, pad: 10 }))
  await sharp(icon, { density: 400 }).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'))
  await sharp(icon, { density: 400 }).resize(192, 192).png().toFile(path.join(OUT, 'icon-192.png'))
  await sharp(icon, { density: 400 }).resize(512, 512).png().toFile(path.join(OUT, 'icon-512.png'))
  await sharp(icon, { density: 400 }).resize(32, 32).png().toFile(path.join(OUT, 'favicon-32.png'))

  await sharp(Buffer.from(ogSvg()), { density: 200 })
    .resize(1200, 630)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, 'og.jpg'))

  console.log('Varumärkestillgångar skrivna till public/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
