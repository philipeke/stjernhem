# stjernhem.se

Webbplats för **Stjernhem Rehabilitering & Hälsa AB** — arbetslivsinriktad
rehabilitering och specialistutredningar för kommunala arbetsmarknadsenheter.

## Sidor

| Adress | Innehåll |
|---|---|
| `/` | Hero, nyckeltal, utmaningen, översikt av metod, tjänster och Anneli |
| `/metod/` | Arbetsstationerna, femveckorstidslinjen, vad rapporten svarar på |
| `/tjanster/` | De tre tjänsterna med priser och vad som ingår |
| `/om-oss/` | Anneli Magnusson och varför Stjernhem |
| `/fragor/` | Vanliga frågor |
| `/kontakt/` | Kontaktuppgifter och formulär |

Varje sida är ett eget HTML-dokument med egen titel, beskrivning och
strukturdata. Det ger riktiga adresser i stället för `/#metod`, en 200-svarande
URL per ämne som går att indexera var för sig, och mindre att rendera per sida.

## Stack

| | |
|---|---|
| Byggverktyg | Vite 8 (flersidigt bygge) |
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
npm run build      # genererar sidorna, typkollar och bygger till dist/
npm run preview    # servera dist/ lokalt på :4173
```

## Vanliga ändringar

### Ändra text

**All text finns i [`src/data/content.ts`](src/data/content.ts).** Priser,
tjänstebeskrivningar, FAQ, kontaktuppgifter — allt ligger där, inte i
komponenterna.

### Lägga till en sida

1. Skapa `src/pages/<namn>.tsx` efter mönstret från de befintliga.
2. Lägg till en post i [`pages.config.mjs`](pages.config.mjs) med adress,
   titel och beskrivning.
3. `npm run build` — HTML-filen, menyposten och sitemapen följer med.

### Lägg in porträttet av Anneli

Lägg filen här:

```
public/portratt/anneli.jpg
```

Platshållaren byts ut vid nästa bygge — ingen kodändring behövs. Rekommenderat:
**stående 4:5, minst 1200 × 1500 px**. Även `.png`, `.webp` och `.avif` funkar.

### Ta bort "Under uppbyggnad"

Sätt `underConstruction: false` i `SITE` i
[`src/data/content.ts`](src/data/content.ts). Då försvinner topplisten, märket i
hero och noten i sidfoten, och ankarlänkarnas offset justeras automatiskt.

### Byt eller lägg till foton

Redigera listan `IMAGES` i [`scripts/fetch-images.mjs`](scripts/fetch-images.mjs)
och kör `npm run images`. Skriptet skriver AVIF/WebP i flera bredder till
`public/img/`, genererar `src/data/images.generated.ts` och uppdaterar
`CREDITS.md`. Originalen cachas i `scripts/.image-cache/`; `--force` hämtar om dem.

### Logotyp, favicon och delningsbild

Symbolen är ritad i kod — se `StarMark` i
[`src/components/Logo.tsx`](src/components/Logo.tsx). Samma geometri används av
`npm run brand`, som genererar `favicon.svg`, app-ikoner och `og.jpg`.

### Kontaktformuläret

Utan konfiguration öppnar formuläret ett färdigskrivet mejlutkast till
`anneli@stjernhem.se` i besökarens e-postklient, och visar dessutom hela
meddelandet med en kopiera-knapp om ingen klient öppnas. Det fungerar alltså
även innan brevlådan är aktiverad.

Vill ni få in svaren direkt i en inkorg:

1. Skapa ett formulär hos t.ex. [Formspree](https://formspree.io) eller
   [Web3Forms](https://web3forms.com).
2. Lägg endpointen som repository-variabeln `VITE_FORM_ENDPOINT`
   (*Settings → Secrets and variables → Actions → Variables*).

Lokalt: skapa `.env.local` med `VITE_FORM_ENDPOINT=https://…`.

## Publicering

Push till `main` kör
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), som bygger och
publicerar till GitHub Pages. Pages-källan står på **GitHub Actions**, och
`public/CNAME` håller kvar `stjernhem.se`.

## Kvalitetskontroll

```bash
npm run preview     # i ett fönster
npm run qa          # alla sidor × tre bredder: konsolfel, 404, overflow,
                    # text som spiller ut, rubriknivåer, alt-text, döda länkar,
                    # och synligt innehåll vid reducerad rörelse
npm run qa:perf     # bildrutetid under scroll med 4× strypt CPU
npm run qa:shots    # skärmbilder per sektion för visuell granskning
```

Kräver Chrome installerat (sökvägen står överst i skripten).

## Att göra före lansering

- [ ] Aktivera brevlådan `anneli@stjernhem.se`.
- [ ] Lägg in porträttet, se ovan.
- [ ] Komplettera med organisationsnummer i sidfoten om det önskas.
- [ ] Överväg integritetspolicy om kontaktformuläret kopplas till en tjänst.
- [ ] Sätt `underConstruction: false`.
