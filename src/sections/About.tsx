import { useState } from 'react'
import { motion } from 'motion/react'
import { Section } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { StarMark } from '../components/Logo'
import { ABOUT, SITE } from '../data/content'

/**
 * Porträttet är förberett men ännu inte inlagt: lägg filen
 * `public/portratt/anneli.jpg` i repot så byts platshållaren ut automatiskt.
 * Rekommenderat format: stående 4:5, minst 1200 × 1500 px.
 *
 * Sökvägen bestäms vid byggtid (se vite.config.ts) så att webbläsaren aldrig
 * behöver fråga efter en bild som inte finns.
 */
const PORTRAIT_SRC = __PORTRAIT_SRC__

export function About() {
  return (
    <Section id="om-oss" tone="light">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-paper-warm"
        style={{
          maskImage: 'linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)',
        }}
      />

      <div className="shell">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Portrait />
          </div>

          <div className="lg:col-span-7">
            <Reveal direction="none">
              <span className="inline-flex items-center gap-3 text-sage-600">
                <StarMark className="size-3 opacity-80" detail="simple" />
                <span className="eyebrow">{ABOUT.eyebrow}</span>
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="mt-5 display-2 font-normal text-ink-700">{ABOUT.heading}</h2>
              <p className="mt-4 font-brand text-[0.72rem] font-semibold tracking-[0.18em] text-sage-600 uppercase">
                {ABOUT.role}
              </p>
            </Reveal>

            <div className="mt-9 max-w-[58ch] space-y-6">
              {ABOUT.paragraphs.map((paragraph, i) => (
                <Reveal key={paragraph} delay={0.1 + i * 0.05} as="p" className="text-[1.0625rem] leading-relaxed text-ink-600/85">
                  {paragraph}
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-11">
              <blockquote className="relative rounded-2xl border border-ink-700/10 bg-white/70 p-8">
                <StarMark className="absolute -top-4 left-8 size-8 bg-paper px-1" detail="simple" />
                <p className="font-display text-[1.375rem] leading-snug font-normal text-ink-700 italic sm:text-[1.625rem]">
                  “{ABOUT.quote}”
                </p>
                <footer className="mt-5 font-brand text-[0.66rem] tracking-[0.18em] text-ink-600/55 uppercase">
                  {SITE.contactPerson} · {SITE.contactRole}
                </footer>
              </blockquote>
            </Reveal>

            <Stagger as="ul" className="mt-10 flex flex-wrap gap-2.5">
              {ABOUT.credentials.map((credential) => (
                <Stagger.Item
                  as="li"
                  key={credential}
                  className="rounded-full border border-ink-700/12 bg-white/60 px-4 py-2 font-brand text-[0.62rem] tracking-[0.14em] text-ink-600/75 uppercase"
                >
                  {credential}
                </Stagger.Item>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Portrait() {
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>(
    PORTRAIT_SRC ? 'loading' : 'missing'
  )

  return (
    <Reveal direction="right" duration={1}>
      <figure className="relative">
        {/* Dekorativ stjärna som tittar fram bakom ramen. */}
        <StarMark
          className="pointer-events-none absolute -top-10 -right-8 z-0 size-40 text-ink-700 opacity-[0.16] sm:size-52"
          detail="simple"
        />

        <div className="relative z-10 aspect-4/5 overflow-hidden rounded-[1.75rem] border border-ink-700/10 bg-gradient-to-b from-ink-700 to-ink-800 shadow-[0_40px_90px_-46px_rgba(12,30,56,0.6)]">
          {PORTRAIT_SRC && (
            <img
              src={PORTRAIT_SRC}
              alt={`${SITE.contactPerson}, ${SITE.contactRole}`}
              loading="lazy"
              decoding="async"
              className={
                state === 'ready'
                  ? 'h-full w-full object-cover opacity-100 transition-opacity duration-700'
                  : 'sr-only'
              }
              onLoad={() => setState('ready')}
              onError={() => setState('missing')}
            />
          )}

          {state !== 'ready' && <PortraitPlaceholder />}
        </div>

        <figcaption className="mt-5 flex items-baseline justify-between gap-4">
          <span className="font-display text-[1.125rem] text-ink-700">{SITE.contactPerson}</span>
          <span className="font-brand text-[0.6rem] tracking-[0.18em] text-ink-600/50 uppercase">
            Grundare
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
}

function PortraitPlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 34%, rgba(39,80,127,0.5), transparent 70%), linear-gradient(180deg, transparent, rgba(4,9,15,0.6))',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(214,222,232,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(214,222,232,0.35) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <StarMark className="size-20 opacity-90" />
        </motion.div>
        <div>
          <p className="font-brand text-[0.62rem] font-semibold tracking-[0.22em] text-gold-200 uppercase">
            Porträtt kommer
          </p>
          <p className="mt-3 max-w-[24ch] text-[0.85rem] leading-relaxed text-silver-400">
            Här kommer ett fotografi av Anneli. Platsen är reserverad och färdigformad.
          </p>
        </div>
      </div>
    </div>
  )
}
