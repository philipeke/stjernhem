/**
 * All text på webbplatsen samlad på ett ställe.
 * Ändra här — inte i komponenterna — så håller sig sidan konsekvent.
 */

export const SITE = {
  name: 'Stjernhem',
  legalName: 'Stjernhem Rehabilitering & Hälsa AB',
  tagline: 'Rehabilitering & Hälsa',
  domain: 'stjernhem.se',
  url: 'https://stjernhem.se',
  /** OBS: bekräfta e-postadressen innan lansering. */
  email: 'info@stjernhem.se',
  phone: '073-825 79 35',
  phoneHref: '+46738257935',
  contactPerson: 'Anneli Magnusson',
  contactRole: 'Legitimerad arbetsterapeut',
  base: 'Uddevalla',
  coverage: 'Fyrbodal och Dalsland — och på förfrågan även andra områden',
  underConstruction: true,
} as const

export const NAV = [
  { label: 'Utmaningen', href: '#utmaningen' },
  { label: 'Metod', href: '#metod' },
  { label: 'Tjänster', href: '#tjanster' },
  { label: 'Rapporten', href: '#rapporten' },
  { label: 'Om oss', href: '#om-oss' },
  { label: 'Frågor', href: '#fragor' },
] as const

export const HERO = {
  eyebrow: 'Arbetslivsinriktad rehabilitering',
  headline: ['Rätt insats', 'från start'],
  headlineAccent: 'En hållbar väg mot egen försörjning',
  lead: 'Gedigen utredning av arbetsförutsättningar — dokumenterad i en rapport med konkreta rekommendationer och lämpliga anpassningar. Vi kommer till er kommun och genomför utredningen i era egna lokaler.',
  primaryCta: { label: 'Boka ett förutsättningslöst möte', href: '#kontakt' },
  secondaryCta: { label: 'Se hur metoden fungerar', href: '#metod' },
  badges: ['Utredning på plats hos er', 'Upp till 10 deltagare parallellt', 'Rapport inom 14 dagar'],
} as const

export const MARQUEE = [
  'Utredning av arbetsförutsättningar',
  'Legitimerad arbetsterapeut',
  'Kognitiva nedsättningar och fatigue',
  'Långvarig smärta',
  'Arbetsplatsanpassningar',
  'Underlag till Försäkringskassan',
  'Kommunala arbetsmarknadsenheter',
  'Fyrbodal · Dalsland',
] as const

export const STATS = [
  {
    value: 15,
    prefix: '',
    suffix: ' år',
    label: 'Specialistkompetens',
    sub: 'Arbetsförmedlingen, kommunal arbetsmarknadsavdelning, samordningsförbund och neurologisk rehabilitering.',
  },
  {
    value: 10,
    prefix: 'Upp till ',
    suffix: '',
    label: 'Deltagare parallellt',
    sub: 'Åtta till tio simulerade arbetsstationer, uppbyggda i era egna lokaler.',
  },
  {
    value: 5,
    prefix: '',
    suffix: ' veckor',
    label: 'Tidsbunden period',
    sub: 'Tre veckor på plats och två veckor för klinisk analys och återkoppling.',
  },
  {
    value: 14,
    prefix: '',
    suffix: ' dagar',
    label: 'Till beslutsunderlag',
    sub: 'Slutrapport på cirka 8 sidor per deltagare efter avslutad utredningsperiod.',
  },
] as const

export const CHALLENGE = {
  eyebrow: 'Utmaningen',
  heading: 'Nya krav. Samma frågor. Kortare tid.',
  body: [
    'Genom den nya socialtjänstlagen och det skärpta aktivitetskravet har pressen ökat på Sveriges kommuner att snabbt ge rätt stöd till individer som inte uppbär egen försörjning.',
    'När det råder osäkerhet kring en individs arbetsförmåga finns det en enorm ekonomisk och mänsklig vinst i att snabbt kartlägga rätt stödinsatser.',
  ],
  pull: 'Fel insats kostar mer än en utredning. Både i kronor och i förlorad tid för individen.',
  points: [
    {
      title: 'Osäkert underlag',
      body: 'Handläggaren saknar svar på vad personen faktiskt klarar i en arbetsliknande situation — och vad som skulle behöva anpassas.',
    },
    {
      title: 'Dolda hinder',
      body: 'Hjärntrötthet, nedsatt instruktionsförståelse och långvarig smärta syns sällan i ett samtal. De syns i aktivitet, över tid.',
    },
    {
      title: 'Insatser som inte håller',
      body: 'En placering som avbryts efter tre veckor kostar både förtroende och pengar. Rätt nivå från början håller längre.',
    },
  ],
} as const

export const APPROACH = {
  eyebrow: 'Vårt svar',
  heading: 'Vi flyttar specialistkompetensen till er',
  body: 'Stjernhem Rehabilitering & Hälsa AB är er trygga och kunniga partner inom arbetslivsinriktad rehabilitering. Vi erbjuder effektiva, humana och tidsbestämda specialistutredningar som utförs på plats i er kommuns egna lokaler.',
  body2:
    'Genom att testa olika arbetsuppgifter i en trygg miljö lär sig deltagaren mer om sina förmågor. Det bygger både självförtroende och självinsikt — samtidigt som rapporten ger er ett hållbart beslutsunderlag.',
} as const

export const STATIONS = [
  {
    image: 'station-computer',
    title: 'Administration & IT',
    body: 'Datorbaserade uppgifter som visar uthållighet, instruktionsförståelse, noggrannhet och hur länge koncentrationen håller.',
  },
  {
    image: 'station-sewing',
    title: 'Textil & symaskin',
    body: 'Finmotorik, sekvensminne och förmågan att följa ett arbetsmoment från början till slut — under tidspress och utan.',
  },
  {
    image: 'station-assembly',
    title: 'Montering',
    body: 'Repetitiva moment som synliggör arbetstempo, kvalitetsmedvetenhet och hur trötthet påverkar precisionen över en förmiddag.',
  },
  {
    image: 'station-craft',
    title: 'Hantverk',
    body: 'Praktiska uppgifter där ergonomi, kraft och rörelsemönster kan observeras och anpassningar prövas direkt på plats.',
  },
] as const

export const TIMELINE = [
  {
    phase: 'Vecka 1–3',
    title: 'På plats i era lokaler',
    body: 'Dagliga observationer och fördjupade samtal kl. 08.30–12.00 i en sluten, trygg miljö med 8–10 simulerade arbetsstationer. Här ingår även anpassade föreläsningar, miniutbildningar och tester.',
    marks: ['Observation i aktivitet', 'Fördjupade samtal', 'Föreläsningar och tester'],
    image: 'conversation',
  },
  {
    phase: 'Vecka 4–5',
    title: 'Klinisk analys och återkoppling',
    body: 'Fokus viks helt åt analysen. Vi levererar en djupt ingående slutrapport på cirka 8–10 sidor per deltagare och håller strukturerade återkopplingsmöten med remittenten.',
    marks: ['Slutrapport per deltagare', 'Genomgång med remittent', 'Gemensam utgångspunkt'],
    image: 'report',
  },
  {
    phase: '2–4 månader senare',
    title: 'Digital uppföljning',
    body: 'Uppföljning med varje deltagare och handläggare två till fyra månader efter avslutad utredning. Den sker digitalt och stämmer av att insatsen landat rätt.',
    marks: ['Deltagare och handläggare', 'Digitalt möte', 'Avstämning av insats'],
    image: 'feedback-meeting',
  },
] as const

export const SERVICES = [
  {
    id: 'utredning',
    number: '01',
    name: 'Utredning av förutsättningar för arbete',
    kicker: 'Vår mest omfattande tjänst',
    summary:
      'För grupper upp till 10 deltagare samtidigt. Vi flyttar specialistkompetensen till er, vilket minimerar deltagarnas restid och ger tydliga synergieffekter.',
    features: [
      '3 veckor på plats: dagliga observationer och fördjupade samtal, kl. 08.30–12.00',
      '8–10 simulerade arbetsstationer i en sluten och trygg miljö',
      'Anpassade föreläsningar, miniutbildningar och tester',
      '2 veckor klinisk analys och slutrapport på ca 8–10 sidor per deltagare',
      'Strukturerade återkopplingsmöten med remittenten',
      'Digital uppföljning 2–4 månader efter avslutad utredning',
    ],
    price: '38 500 kr',
    priceUnit: 'exkl. moms per deltagare',
    priceNote: 'Minsta debitering: 8 deltagare',
    discount: {
      price: '34 500 kr',
      label: 'Materialrabatt',
      body: 'Tillhandahåller ni grundutrustningen på plats — datorer, symaskin med mera — sänks priset till 34 500 kr exkl. moms per deltagare.',
    },
    featured: true,
  },
  {
    id: 'kortare',
    number: '02',
    name: 'Kortare specialistutredning',
    kicker: 'Individuellt eller i mindre grupp',
    summary:
      'Perfekt för enskilda, akuta ärenden eller för utredningar som kräver språktolk (som kommunen ombesörjer).',
    features: [
      '3 strukturerade tillfällen à 3,5 timmar vid våra arbetsstationer',
      'Observation och klinisk bedömning',
      'Arbetsterapeutisk slutrapport på 3–5 sidor',
      'Konkreta rekommendationer och anpassningsförslag',
      'Kan bakas in på eftermiddagarna under en pågående förmiddagsgrupp — upp till 3 stycken, helt utan extra resekostnad',
    ],
    price: '11 900 kr',
    priceUnit: 'exkl. moms per deltagare',
    priceNote: null,
    discount: null,
    featured: false,
  },
  {
    id: 'fordjupad',
    number: '03',
    name: 'Djupare testning och analys',
    kicker: 'Arbetspsykolog eller fysioterapeut',
    summary:
      'I syfte att säkerställa en skyndsam lösning och hög servicenivå i mer komplicerade fall finns tillgång till arbetspsykolog och fysioterapeut för fördjupad analys.',
    features: [
      'Kompletterande bedömning av arbetspsykolog',
      'Kompletterande bedömning av fysioterapeut',
      'Samordnas med pågående utredning',
      'Ger en obruten helhetsbild vid sammansatt problematik',
    ],
    price: 'Enligt taxa',
    priceUnit: 'kostnad tillkommer enligt gällande taxa',
    priceNote: null,
    discount: null,
    featured: false,
  },
] as const

export const ANSWERS = {
  eyebrow: 'Rapporten',
  heading: 'Vad utredningen svarar på',
  body: 'Vårt koncept fokuserar på hela människan och ger handläggaren svar på exakt vilka insatser och eventuella anpassningar som krävs för att hjälpa varje individ vidare. Rapporten visar tydligt om lämplig väg framåt är:',
  items: [
    { title: 'Arbete eller arbetsträning', body: 'Direkt arbete, arbetsträning eller arbetsprövning — och inom vilket område det är lämpligt att söka.' },
    { title: 'Studier', body: 'Komvux, folkhögskola, yrkesutbildning, YH-utbildning, högskola eller universitet.' },
    { title: 'Fortsatt rehabilitering', body: 'Fortsatt arbetslivsinriktad rehabilitering med tydlig riktning och rimlig omfattning.' },
    { title: 'Fördjupad utredning', body: 'Somatisk eller psykiatrisk utredning som vården behöver ombesörja.' },
    { title: 'Sjukersättning', body: 'Underlag för ansökan om sjukersättning — kliniskt grundat och juridiskt hållbart.' },
    { title: 'Omfattning i aktivitet', body: 'I vilken omfattning personen är redo att starta upp i aktivitet, och i vilket tempo.' },
  ],
  delivery: {
    title: 'Ett juridiskt hållbart beslutsunderlag',
    body: 'Inom 14 dagar efter avslutad utredningsperiod levererar vi en utförlig och kliniskt grundad slutrapport på cirka 8 sidor per deltagare. Våra rapporter håller högsta kvalitet och kan användas som underlag eller bilaga för ansökningar mot Försäkringskassan.',
  },
} as const

export const WHY = {
  eyebrow: 'Varför Stjernhem',
  heading: 'Specialistkompetens, inte generella insatser',
  items: [
    {
      title: '15 års specialistkompetens',
      body: 'Verksamheten leds av en legitimerad arbetsterapeut med bred erfarenhet från Arbetsförmedlingen, arbetsmarknadsavdelning inom kommun, samordningsförbund och neurologisk rehabilitering.',
    },
    {
      title: 'Hantering av komplexa hinder',
      body: 'Djupgående expertis inom dolda kognitiva nedsättningar såsom hjärntrötthet och fatigue, långvarig smärta och stora fysiska funktionsnedsättningar.',
    },
    {
      title: 'Färdiga anpassningar',
      body: 'Vi lyfter individens styrkor framför att bara se hindren, och levererar konkreta förslag på ergonomi, tekniska hjälpmedel och arbetsmiljöjusteringar för framtiden.',
    },
    {
      title: 'Ett komplett nätverk',
      body: 'Vid mycket komplex problematik har vi ett etablerat samarbete med arbetspsykolog och fysioterapeut för kompletterande bedömningar.',
    },
    {
      title: 'Juridisk tyngd',
      body: 'Våra kliniska rapporter håller högsta kvalitet och kan användas som underlag eller bilaga för ansökningar mot Försäkringskassan.',
    },
    {
      title: 'Humant och stöttande',
      body: 'Deltagaren bygger självinsikt och självförtroende i en sluten och trygg miljö. Utredningen ska lyfta människan, inte bara kartlägga den.',
    },
  ],
} as const

export const EXPERTISE = [
  {
    title: 'Kognitiva begränsningar',
    body: 'Fatigue, hjärntrötthet, nedsatt instruktionsförståelse och koncentration.',
  },
  {
    title: 'Fysiska hinder och långvarig smärta',
    body: 'Ergonomisk tolerans, rörelsemönster och uthållighet under fysisk aktivitet.',
  },
  {
    title: 'Arbetsplatsanpassningar',
    body: 'Vi testar justeringar direkt på plats och levererar färdiga förslag på tekniska hjälpmedel och ergonomiska anpassningar för framtida arbetsgivare.',
  },
] as const

export const ABOUT = {
  eyebrow: 'Om oss',
  heading: 'Anneli Magnusson',
  role: 'Legitimerad arbetsterapeut · Grundare',
  paragraphs: [
    'Stjernhem Rehabilitering & Hälsa AB leds av Anneli Magnusson, legitimerad arbetsterapeut med femton års erfarenhet från Arbetsförmedlingen, arbetsmarknadsavdelning inom kommun, samordningsförbund och neurologisk rehabilitering.',
    'Det är en erfarenhet som gett en särskild blick för det som inte syns direkt: hjärntröttheten som slår till efter nittio minuter, instruktionen som uppfattades men inte förstods, smärtan som gör att ett arbetsmoment fungerar på måndagen men inte på torsdagen.',
    'Den blicken är hela grunden för Stjernhems metod — att observera människor i verklig aktivitet, över tid, i en miljö där det är tryggt att både lyckas och misslyckas.',
  ],
  credentials: [
    'Legitimerad arbetsterapeut',
    'Arbetsförmedlingen',
    'Kommunal arbetsmarknadsavdelning',
    'Samordningsförbund',
    'Neurologisk rehabilitering',
  ],
  quote:
    'Vi fokuserar på att lyfta individens styrkor framför att bara utreda och se hindren.',
} as const

export const FAQ = [
  {
    q: 'Var genomförs utredningen?',
    a: 'På plats i era egna lokaler. Vi flyttar hela den arbetsterapeutiska testmiljön till er, vilket minimerar deltagarnas restid och ger tydliga synergieffekter. Vid behov kan vi också ta emot i egen regi — hör av er så löser vi det.',
  },
  {
    q: 'Vad behöver vi som kommun bidra med?',
    a: 'En lokal som går att stänga om under förmiddagarna, samt bord och stolar. Grundutrustning som datorer och symaskin kan ni antingen låta oss ta med, eller tillhandahålla själva — i det senare fallet sänks priset per deltagare från 38 500 kr till 34 500 kr exkl. moms.',
  },
  {
    q: 'Hur många deltagare krävs?',
    a: 'Minsta debitering för den stora utredningen är 8 deltagare, och vi tar emot upp till 10 parallellt. För enskilda eller akuta ärenden finns den kortare specialistutredningen, som också kan bakas in på eftermiddagarna under en pågående grupp.',
  },
  {
    q: 'Hur lång tid tar det innan vi har rapporten?',
    a: 'Utredningsperioden är fem veckor: tre veckor på plats och två veckor för klinisk analys. Slutrapporten levereras inom 14 dagar efter avslutad utredningsperiod, cirka 8–10 sidor per deltagare.',
  },
  {
    q: 'Kan rapporten användas mot Försäkringskassan?',
    a: 'Ja. Rapporterna är kliniskt grundade och håller en kvalitet som gör att de kan användas som underlag eller bilaga vid ansökan om sjukersättning.',
  },
  {
    q: 'Hur hanteras deltagare som behöver tolk?',
    a: 'Den kortare specialistutredningen passar särskilt bra för ärenden som kräver språktolk. Tolk ombesörjs av kommunen, och upplägget med tre strukturerade tillfällen à 3,5 timmar anpassas efter det.',
  },
  {
    q: 'Vilket område är ni verksamma i?',
    a: 'Vi utgår från Uddevalla och är verksamma i hela Fyrbodal och Dalsland. På förfrågan åtar vi oss uppdrag även i andra områden.',
  },
  {
    q: 'Vad händer efter utredningen?',
    a: 'Ni får en strukturerad genomgång av slutrapporten där alla parter samlas kring samma utgångspunkt. Två till fyra månader senare gör vi en digital uppföljning med både deltagare och handläggare.',
  },
] as const

export const CONTACT = {
  eyebrow: 'Kontakt',
  heading: 'Vill ni veta hur vi kan hjälpa er kommun att möta de nya kraven?',
  body: 'Välkommen att kontakta oss för att boka ett förutsättningslöst digitalt möte — eller ett besök på plats hos er, där vi visar hur våra arbetsstationer är uppbyggda.',
} as const
