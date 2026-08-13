# stjernhem.se

Webbplats för **Stjernhem Rehabilitering & Hälsa AB** — arbetslivsinriktad
rehabilitering och specialistutredningar för kommunala arbetsmarknadsenheter.

En sida, byggd som en sammanhängande scrollupplevelse: hero med stjärnhimmel,
utmaningen, metoden, tjänster med priser, vad rapporten svarar på, om Anneli,
varför Stjernhem, vanliga frågor och kontakt.

## Stack

| | |
|---|---|
| Byggverktyg | Vite 8 |
| Ramverk | React 19 + TypeScript |
| Stilar | Tailwind CSS v4 (CSS-first, `src/index.css`) |
| Animation | Motion (`motion/react`) |
| Scroll | Lenis |
| Bilder | sharp → AVIF/WebP i flera bredder + LQIP |
| Publicering | GitHub Actions → GitHub Pages, egen domän via `public/CNAME` |

## Kom igång

```bash
npm install
npm run dev        # utvecklingsserver
npm run build      # produktionsbygge till dist/
npm run preview    # servera dist/ lokalt på :4173
```

## Vanliga ändringar

### Ändra text

**All text finns i [`src/data/content.ts`](src/data/content.ts).** Priser,
tjänstebeskrivningar, FAQ, kontaktuppgifter — allt ligger där, inte i
komponenterna. Ändra i den filen och sidan följer med.

### Lägg in porträttet av Anneli

Lägg filen här:

```
public/portratt/anneli.jpg
```

Platshållaren byts ut automatiskt när filen finns — ingen kodändring behövs.
Rekommenderat: **stående 4:5, minst 1200 × 1500 px**, gärna med lugn bakgrund.

### Ta bort "Under uppbyggnad"

Sätt `underConstruction: false` i `SITE` i
[`src/data/content.ts`](src/data/content.ts). Då försvinner både topplisten,
märket i hero och noten i sidfoten, och ankarlänkarnas offset justeras
automatiskt.

### Byt eller lägg till foton

Redigera listan `IMAGES` i [`scripts/fetch-images.mjs`](scripts/fetch-images.mjs)
och kör:

```bash
npm run images
```

Skriptet hämtar originalen, skriver AVIF/WebP i flera bredder till `public/img/`,
genererar `src/data/images.generated.ts` (mått + suddig placeholder) och
uppdaterar `CREDITS.md`. Originalen cachas i `scripts/.image-cache/` (ignoreras
av git); `--force` hämtar om dem.

### Logotyp, favicon och delningsbild

Symbolen är ritad i kod — se `StarMark` i
[`src/components/Logo.tsx`](src/components/Logo.tsx). Samma geometri används av
[`scripts/make-brand-assets.mjs`](scripts/make-brand-assets.mjs), som genererar
`favicon.svg`, app-ikoner och `og.jpg`:

```bash
node scripts/make-brand-assets.mjs
```

### Ta emot kontaktformuläret i inkorgen

Utan konfiguration öppnar formuläret ett färdigskrivet mejlutkast i besökarens
e-postklient. Vill ni i stället få in svaren direkt:

1. Skapa ett formulär hos t.ex. [Formspree](https://formspree.io) eller
   [Web3Forms](https://web3forms.com).
2. Lägg endpointen som repository-variabeln `VITE_FORM_ENDPOINT`
   (*Settings → Secrets and variables → Actions → Variables*).

Lokalt: skapa `.env.local` med `VITE_FORM_ENDPOINT=https://…`.

## Publicering

Push till `main` kör
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), som bygger och
publicerar till GitHub Pages.

**Engångsinställning:** *Settings → Pages → Build and deployment → Source* måste
stå på **GitHub Actions** (repot låg tidigare på *Deploy from a branch*).

`public/CNAME` gör att `stjernhem.se` fortsätter peka rätt efter varje bygge.

## Kvalitetskontroll

```bash
npm run preview                      # i ett fönster
node scripts/shoot.mjs               # skärmbilder desktop + mobil, konsolfel, overflow
node scripts/shoot-sections.mjs      # hela sektioner för visuell granskning
```

Kräver Chrome installerat (sökvägen står överst i skripten).

## Att göra före lansering

- [ ] Bekräfta e-postadressen — `info@stjernhem.se` är en platshållare i `SITE`.
- [ ] Lägg in porträttet, se ovan.
- [ ] Komplettera med organisationsnummer i sidfoten om det önskas.
- [ ] Överväg integritetspolicy om kontaktformuläret kopplas till en tjänst.
- [ ] Sätt `underConstruction: false`.
