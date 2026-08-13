/**
 * Skriver ett HTML-dokument per sida, plus sitemap.xml, utifrån
 * pages.config.mjs. Varje sida får egen titel, beskrivning, kanonisk adress
 * och strukturdata — det är det som ger riktiga adresser som /metod/ och en
 * egen träff i sökresultaten per ämne.
 *
 *   npm run pages
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGES, SITE_URL, urlFor, htmlFor } from '../pages.config.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const ORG_ID = `${SITE_URL}/#organisation`

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/** Verksamhetens strukturdata — ligger på alla sidor och pekar på samma id. */
function organisationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': ORG_ID,
    name: 'Stjernhem Rehabilitering & Hälsa AB',
    alternateName: 'Stjernhem',
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og.jpg`,
    logo: `${SITE_URL}/icon-512.png`,
    description:
      'Specialistutredningar inom arbetslivsinriktad rehabilitering för kommunala arbetsmarknadsenheter. Utredning av arbetsförutsättningar genomförs på plats i kommunens egna lokaler av legitimerad arbetsterapeut.',
    telephone: '+46738257935',
    email: 'anneli@stjernhem.se',
    medicalSpecialty: 'OccupationalTherapy',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Uddevalla',
      addressRegion: 'Västra Götalands län',
      addressCountry: 'SE',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Fyrbodal' },
      { '@type': 'AdministrativeArea', name: 'Dalsland' },
      { '@type': 'Country', name: 'Sverige' },
    ],
    founder: {
      '@type': 'Person',
      name: 'Anneli Magnusson',
      jobTitle: 'Legitimerad arbetsterapeut',
    },
    knowsAbout: [
      'Arbetslivsinriktad rehabilitering',
      'Utredning av arbetsförmåga',
      'Kognitiva nedsättningar och fatigue',
      'Långvarig smärta',
      'Arbetsplatsanpassningar',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tjänster',
      itemListElement: [
        {
          '@type': 'Offer',
          url: `${SITE_URL}/tjanster/`,
          itemOffered: {
            '@type': 'Service',
            name: 'Utredning av förutsättningar för arbete',
            description:
              'Femveckorsutredning för upp till 10 deltagare parallellt, genomförd i kommunens egna lokaler. Slutrapport på cirka 8–10 sidor per deltagare.',
          },
          price: '38500',
          priceCurrency: 'SEK',
          eligibleQuantity: { '@type': 'QuantitativeValue', minValue: 8, unitText: 'deltagare' },
        },
        {
          '@type': 'Offer',
          url: `${SITE_URL}/tjanster/`,
          itemOffered: {
            '@type': 'Service',
            name: 'Kortare specialistutredning',
            description:
              'Tre strukturerade tillfällen à 3,5 timmar med arbetsterapeutisk slutrapport på 3–5 sidor.',
          },
          price: '11900',
          priceCurrency: 'SEK',
        },
        {
          '@type': 'Offer',
          url: `${SITE_URL}/tjanster/`,
          itemOffered: {
            '@type': 'Service',
            name: 'Djupare testning och analys',
            description:
              'Kompletterande bedömning av arbetspsykolog eller fysioterapeut vid komplex problematik.',
          },
        },
      ],
    },
  }
}

function breadcrumbJsonLd(page) {
  if (!page.breadcrumb) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.breadcrumb, item: SITE_URL + urlFor(page) },
    ],
  }
}

/** Plockar FAQ-listan direkt ur content.ts så svaren aldrig glider isär. */
async function faqJsonLd() {
  const source = await fs.readFile(path.join(ROOT, 'src', 'data', 'content.ts'), 'utf8')
  const block = source.match(/export const FAQ = \[([\s\S]*?)\n\] as const/)
  if (!block) throw new Error('Hittade inte FAQ-listan i content.ts')
  const entries = [...block[1].matchAll(/\bq:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*a:\s*'((?:[^'\\]|\\.)*)',/g)]
  if (!entries.length) throw new Error('Kunde inte tolka FAQ-listan')
  const unescape = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\')
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map(([, q, a]) => ({
      '@type': 'Question',
      name: unescape(q),
      acceptedAnswer: { '@type': 'Answer', text: unescape(a) },
    })),
  }
}

function render(page, blocks) {
  const url = SITE_URL + urlFor(page)
  const depth = page.dir ? '../' : './'
  void depth // alla resurser refereras absolut från roten

  return `<!doctype html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

    <title>${escapeAttr(page.title)}</title>
    <meta name="description" content="${escapeAttr(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="theme-color" content="#0c1e38" />
    <meta name="color-scheme" content="dark" />
    <meta name="author" content="Stjernhem Rehabilitering &amp; Hälsa AB" />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="sv_SE" />
    <meta property="og:site_name" content="Stjernhem Rehabilitering &amp; Hälsa AB" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeAttr(page.ogTitle)}" />
    <meta property="og:description" content="${escapeAttr(page.ogDescription)}" />
    <meta property="og:image" content="${SITE_URL}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Stjernhem Rehabilitering &amp; Hälsa — Rätt insats från start" />
    <meta name="twitter:card" content="summary_large_image" />
${
  page.preload
    ? `
    <link rel="preload" as="image" href="/img/${page.preload}" type="image/avif" fetchpriority="high" />`
    : ''
}
${blocks.map((b) => `    <script type="application/ld+json">\n${JSON.stringify(b, null, 2)
      .split('\n')
      .map((l) => '      ' + l)
      .join('\n')}\n    </script>`).join('\n')}
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <div style="padding: 4rem 1.5rem; font-family: system-ui, sans-serif; color: #d3dde8">
        <h1 style="font-size: 1.75rem">Stjernhem Rehabilitering &amp; Hälsa AB</h1>
        <p style="max-width: 60ch; line-height: 1.6">
          Den här webbplatsen kräver JavaScript. Kontakta oss gärna direkt på
          <a href="tel:+46738257935" style="color: #ddc48c">073-825 79 35</a> eller
          <a href="mailto:anneli@stjernhem.se" style="color: #ddc48c">anneli@stjernhem.se</a>.
        </p>
      </div>
    </noscript>
    <script type="module" src="/${page.entry}"></script>
  </body>
</html>
`
}

async function main() {
  const org = organisationJsonLd()

  for (const page of PAGES) {
    const blocks = [org]
    const crumb = breadcrumbJsonLd(page)
    if (crumb) blocks.push(crumb)
    if (page.faq) blocks.push(await faqJsonLd())

    const file = path.join(ROOT, htmlFor(page))
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, render(page, blocks), 'utf8')
    console.log(`  ✓ ${htmlFor(page)}  →  ${urlFor(page)}`)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (p) => `  <url>
    <loc>${SITE_URL}${urlFor(p)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>`
).join('\n')}
</urlset>
`
  await fs.writeFile(path.join(ROOT, 'public', 'sitemap.xml'), sitemap, 'utf8')
  console.log(`  ✓ public/sitemap.xml (${PAGES.length} adresser)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
