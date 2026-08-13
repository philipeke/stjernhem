import { useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from './Reveal'
import { StarMark } from './Logo'
import { SITE } from '../data/content'

/**
 * Porträttet är förberett men ännu inte inlagt: lägg filen
 * `public/portratt/anneli.jpg` i repot så byts platshållaren ut automatiskt.
 * Rekommenderat format: stående 4:5, minst 1200 × 1500 px.
 *
 * Sökvägen bestäms vid byggtid (se vite.config.ts) så att webbläsaren aldrig
 * behöver fråga efter en bild som inte finns.
 */
const PORTRAIT_SRC = __PORTRAIT_SRC__

export function Portrait() {
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>(
    PORTRAIT_SRC ? 'loading' : 'missing'
  )

  return (
    <Reveal direction="right" duration={0.8}>
      <figure className="relative">
        {/* Dekorativ stjärna som tittar fram bakom ramen. */}
        <StarMark
          className="pointer-events-none absolute -top-10 -right-8 z-0 size-40 opacity-[0.16] sm:size-52"
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
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
