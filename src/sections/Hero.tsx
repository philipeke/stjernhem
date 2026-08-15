import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { observePause } from '../lib/reveal'
import { Starfield } from '../components/Starfield'
import { StarMark } from '../components/Logo'
import { SplitText } from '../components/SplitText'
import { Button, ArrowRight } from '../components/Button'
import { Marquee } from '../components/Marquee'
import { ConstructionBadge } from '../components/ConstructionNotice'
import { Img } from '../components/Img'
import { HERO, MARQUEE } from '../data/content'
import { useMotionEnabled } from '../lib/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const auroraRef = useRef<HTMLDivElement>(null)
  const motionOk = useMotionEnabled()
  useEffect(() => observePause(auroraRef.current), [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Bara förflyttning, ingen skalning: att skala fotografiet under scroll
  // tvingade fram en omritning av en 2560 px bred bild varje bildruta.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
    >
      {/* Lager 1 — fotografiet, avdämpat till nästan monokromt. */}
      <motion.div
        aria-hidden
        style={motionOk ? { y: bgY, willChange: 'transform' } : undefined}
        className="absolute inset-0 -z-30 scale-[1.18] origin-top"
      >
        <Img
          name="hero-forest"
          alt=""
          priority
          sizes="100vw"
          className="h-full w-full"
          imgClassName="opacity-[0.34] saturate-[0.35] contrast-[1.06]"
          objectPosition="center 42%"
        />
      </motion.div>

      {/* Lager 2 — djupblå toning som binder ihop bilden med varumärkesfärgen. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,9,15,0.86) 0%, rgba(6,13,24,0.68) 28%, rgba(9,20,38,0.72) 62%, rgba(4,9,15,0.97) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(120% 76% at 50% 32%, rgba(18,41,74,0.5) 0%, transparent 62%)',
        }}
      />

      {/* Lager 3 — långsamt drivande ljus. Pausas när hero rullat ur bild. */}
      <div ref={auroraRef} aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="aurora absolute -top-[26%] left-[6%] size-[46rem] max-w-[92vw] animate-drift rounded-full bg-[radial-gradient(circle,rgba(39,80,127,0.34),transparent_66%)] blur-2xl motion-reduce:animate-none" />
        <div className="aurora absolute -right-[12%] bottom-[-18%] size-[40rem] max-w-[88vw] animate-drift-slow rounded-full bg-[radial-gradient(circle,rgba(107,139,118,0.24),transparent_66%)] blur-2xl motion-reduce:animate-none" />
      </div>

      {/* Lager 4 — stjärnhimlen. */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-90">
        <Starfield />
      </div>

      <motion.div
        style={motionOk ? { y: contentY, opacity: contentOpacity } : undefined}
        className="shell relative flex flex-1 flex-col items-center justify-center pt-[calc(var(--notice-h)+var(--header-h)+3rem)] pb-14 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
          className="relative"
        >
          <StarMark className="size-24 sm:size-32" animate />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 animate-pulse-soft rounded-full bg-[radial-gradient(circle,rgba(180,203,228,0.24),transparent_68%)] blur-2xl motion-reduce:animate-none"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="eyebrow mt-9 text-silver-400"
        >
          {HERO.eyebrow}
        </motion.p>

        <h1 className="mt-6 max-w-[18ch] font-display display-1 font-normal text-transparent">
          <span className="sr-only">
            {HERO.headline.join(' ')} — {HERO.headlineAccent}
          </span>
          <span aria-hidden className="block">
            {HERO.headline.map((linePart, i) => (
              <SplitText
                key={linePart}
                text={linePart}
                delay={1.0 + i * 0.14}
                className="text-silver-sheen"
              />
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.55 }}
          aria-hidden
          className="mt-7 max-w-[24ch] font-display text-[1.35rem] leading-tight font-light text-sage-300 italic sm:max-w-none sm:text-[1.75rem]"
        >
          {HERO.headlineAccent}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.7 }}
          className="lead mt-8 max-w-[62ch] text-silver-300/90"
        >
          {HERO.lead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.85 }}
          className="mt-11 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
        >
          <Button href={HERO.primaryCta.href} size="lg" className="w-full sm:w-auto">
            {HERO.primaryCta.label}
            <ArrowRight />
          </Button>
          <Button href={HERO.secondaryCta.href} variant="ghost" size="lg" className="w-full sm:w-auto">
            {HERO.secondaryCta.label}
          </Button>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 2.05 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          {HERO.badges.map((badge) => (
            <li
              key={badge}
              className="flex items-center gap-2.5 font-brand text-[0.66rem] tracking-[0.16em] text-silver-400/90 uppercase"
            >
              <StarMark className="size-2.5 shrink-0 opacity-70" detail="simple" />
              {badge}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.25 }}
          className="mt-10"
        >
          <ConstructionBadge />
        </motion.div>
      </motion.div>

      <div className="relative z-10 pb-6">
        <ScrollCue />
        <div className="hairline mt-8" />
        <Marquee items={MARQUEE} className="mt-6" />
      </div>
    </section>
  )
}

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2.4 }}
      className="flex flex-col items-center gap-3"
      aria-hidden
    >
      <span className="font-brand text-[0.58rem] tracking-[0.3em] text-silver-500 uppercase">
        Scrolla
      </span>
      <span className="relative block h-10 w-px overflow-hidden bg-silver-400/20">
        <span className="absolute inset-x-0 top-0 h-4 animate-scroll-hint bg-gradient-to-b from-transparent via-gold-300 to-transparent motion-reduce:animate-none" />
      </span>
    </motion.div>
  )
}
