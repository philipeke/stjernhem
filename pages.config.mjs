/**
 * Sidorna på stjernhem.se.
 *
 * En post här styr tre saker samtidigt: vilken HTML-fil som byggs, vilken
 * adress den får, och vad som står i sökresultatet. Lägg till en post och
 * kör `npm run pages` så finns sidan.
 */

export const SITE_URL = 'https://stjernhem.se'

export const PAGES = [
  {
    /** Katalog under roten. Tom sträng = startsidan. */
    dir: '',
    entry: 'src/pages/home.tsx',
    title: 'Stjernhem Rehabilitering & Hälsa AB — Utredning av arbetsförutsättningar',
    description:
      'Arbetslivsinriktad rehabilitering för kommuner. Specialistutredning av arbetsförutsättningar på plats i era egna lokaler, med kliniskt grundad slutrapport och konkreta anpassningsförslag. Uddevalla, Fyrbodal och Dalsland.',
    ogTitle: 'Rätt insats från start — Stjernhem Rehabilitering & Hälsa AB',
    ogDescription:
      'Gedigen utredning av arbetsförutsättningar, genomförd på plats i er kommuns lokaler. Kliniskt grundad rapport med rekommendationer och lämpliga anpassningar.',
    /** Bilden som förhandsladdas — den som syns först på sidan. */
    preload: 'hero-forest-1920.avif',
    priority: '1.0',
    breadcrumb: null,
  },
  {
    dir: 'metod',
    entry: 'src/pages/metod.tsx',
    title: 'Metod — så går utredningen till | Stjernhem Rehabilitering & Hälsa',
    description:
      'Fem veckor, tydligt avgränsade: tre veckor med dagliga observationer vid 8–10 simulerade arbetsstationer i era lokaler, två veckor klinisk analys, och digital uppföljning efter 2–4 månader.',
    ogTitle: 'Vi flyttar testmiljön till era lokaler',
    ogDescription:
      'Arbetsstationer inom administration, IT, montering och hantverk. Observation i aktivitet, dagligen, över tre veckor — sedan en kliniskt grundad slutrapport.',
    preload: 'forest-layers-1440.avif',
    priority: '0.9',
    breadcrumb: 'Metod',
  },
  {
    dir: 'tjanster',
    entry: 'src/pages/tjanster.tsx',
    title: 'Tjänster och priser — specialistutredning | Stjernhem Rehabilitering & Hälsa',
    description:
      'Utredning av förutsättningar för arbete från 34 500 kr exkl. moms per deltagare, kortare specialistutredning för 11 900 kr, samt fördjupad testning av arbetspsykolog eller fysioterapeut.',
    ogTitle: 'Tre nivåer av specialistutredning',
    ogDescription:
      'Från omfattande grupputredning över fem veckor till kort individuell bedömning. Allt genomförs på plats hos er av legitimerad arbetsterapeut.',
    preload: 'station-precision-960.avif',
    priority: '0.9',
    breadcrumb: 'Tjänster',
  },
  {
    dir: 'om-oss',
    entry: 'src/pages/om-oss.tsx',
    title: 'Om Stjernhem — Anneli Magnusson, legitimerad arbetsterapeut',
    description:
      'Femton års specialistkompetens från Arbetsförmedlingen, kommunal arbetsmarknadsavdelning, samordningsförbund och neurologisk rehabilitering. Djupgående expertis inom dolda kognitiva nedsättningar och långvarig smärta.',
    ogTitle: 'Femton år av att se det som inte syns',
    ogDescription:
      'Verksamheten leds av en legitimerad arbetsterapeut med bred erfarenhet från stat, kommun och neurologisk rehabilitering.',
    preload: 'lake-dawn-1440.avif',
    priority: '0.8',
    breadcrumb: 'Om oss',
  },
  {
    dir: 'fragor',
    entry: 'src/pages/fragor.tsx',
    title: 'Vanliga frågor om utredning av arbetsförutsättningar | Stjernhem',
    description:
      'Var genomförs utredningen, vad behöver kommunen bidra med, hur många deltagare krävs, hur lång tid tar rapporten och kan den användas mot Försäkringskassan? Svaren finns här.',
    ogTitle: 'Det ni brukar undra',
    ogDescription:
      'Lokaler, utrustning, antal deltagare, tidsplan och vad rapporten kan användas till.',
    preload: null,
    priority: '0.7',
    breadcrumb: 'Frågor',
    /** Lägger till FAQPage-strukturdata från FAQ-listan i content.ts. */
    faq: true,
  },
  {
    dir: 'kontakt',
    entry: 'src/pages/kontakt.tsx',
    title: 'Kontakt — boka ett förutsättningslöst möte | Stjernhem Rehabilitering & Hälsa',
    description:
      'Kontakta Anneli Magnusson, legitimerad arbetsterapeut. Telefon 073-825 79 35. Utgångspunkt Uddevalla, verksamma i hela Fyrbodal och Dalsland.',
    ogTitle: 'Boka ett förutsättningslöst möte',
    ogDescription:
      'Digitalt eller på plats hos er, där vi visar hur arbetsstationerna är uppbyggda.',
    preload: 'coast-1440.avif',
    priority: '0.8',
    breadcrumb: 'Kontakt',
  },
]

/** Adressen en sida får, med avslutande snedstreck. */
export function urlFor(page) {
  return page.dir ? `/${page.dir}/` : '/'
}

/** Filnamnet Vite bygger sidan från. */
export function htmlFor(page) {
  return page.dir ? `${page.dir}/index.html` : 'index.html'
}
