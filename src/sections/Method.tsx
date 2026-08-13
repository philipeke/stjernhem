import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Section, SectionHeading } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { Img } from '../components/Img'
import { StarMark } from '../components/Logo'
import { APPROACH, STATIONS, TIMELINE } from '../data/content'
import { useMotionEnabled } from '../lib/useMediaQuery'
import { cn } from '../lib/cn'

export function Method() {
  return (
    <Section id="metod" tone="darker" className="pb-0">
      <BackdropGlow />
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow={APPROACH.eyebrow}
              heading={APPROACH.heading}
              headingClassName="max-w-[15ch]"
            />
          </div>
          <div className="flex flex-col justify-end gap-6 lg:col-span-6 lg:pb-2">
            <Reveal delay={0.1} as="p" className="lead text-silver-300/90">
              {APPROACH.body}
            </Reveal>
            <Reveal delay={0.18} as="p" className="text-[1rem] leading-relaxed text-silver-400">
              {APPROACH.body2}
            </Reveal>
          </div>
        </div>

        <Stations />
        <Timeline />
      </div>
    </Section>
  )
}

function BackdropGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[8%] -left-[18%] size-[42rem] max-w-[90vw] rounded-full bg-[radial-gradient(circle,rgba(26,58,99,0.34),transparent_66%)] blur-2xl" />
      <div className="absolute right-[-14%] bottom-[16%] size-[38rem] max-w-[86vw] rounded-full bg-[radial-gradient(circle,rgba(79,107,90,0.22),transparent_66%)] blur-2xl" />
    </div>
  )
}

/* ---------------------------- Arbetsstationer ---------------------------- */

function Stations() {
  return (
    <div className="mt-24 sm:mt-32">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="display-3 max-w-[18ch] font-normal text-silver-50">
          Åtta till tio arbetsstationer, byggda för att visa det som inte syns i ett samtal
        </h3>
        <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-silver-500">
          Deltagaren provar praktiskt inom administration, IT, montering och hantverk. Vi observerar
          i aktivitet — dagligen, över tre veckor.
        </p>
      </Reveal>

      <Stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATIONS.map((station) => (
          <Stagger.Item as="li" key={station.title}>
            <article className="group relative h-full overflow-hidden rounded-2xl border border-silver-400/12 bg-ink-800/60">
              <div className="relative overflow-hidden">
                <Img
                  name={station.image}
                  alt={station.title}
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                  className="aspect-4/3 w-full"
                  imgClassName="transition-transform duration-[1100ms] ease-out-expo group-hover:scale-[1.07] saturate-[0.8]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/25 to-transparent"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2.5">
                  <StarMark className="size-3 opacity-70" detail="simple" />
                  <h4 className="font-brand text-[0.72rem] leading-relaxed font-semibold tracking-[0.16em] text-gold-300 uppercase">
                    {station.title}
                  </h4>
                </div>
                <p className="mt-3.5 text-[0.9rem] leading-relaxed text-silver-400">
                  {station.body}
                </p>
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition-[box-shadow,border-color] duration-500 group-hover:ring-gold-400/25"
              />
            </article>
          </Stagger.Item>
        ))}
      </Stagger>
    </div>
  )
}

/* -------------------------------- Tidslinje ------------------------------- */

function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const motionOk = useMotionEnabled()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 65%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <div className="relative mt-28 pb-24 sm:mt-36 sm:pb-32 lg:pb-40">
      <Reveal className="max-w-[46ch]">
        <span className="eyebrow text-silver-400">Tidsplan</span>
        <h3 className="mt-5 display-2 font-normal text-silver-50">Fem veckor, tydligt avgränsade</h3>
      </Reveal>

      <div ref={ref} className="relative mt-16 sm:mt-20">
        {/* Skenan med scrollstyrd fyllning. */}
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-[7px] w-px bg-silver-400/15 sm:left-[11px]"
        >
          <motion.div
            style={motionOk ? { scaleY } : { scaleY: 1 }}
            className="h-full w-full origin-top bg-gradient-to-b from-silver-200 via-gold-300 to-sage-400"
          />
        </div>

        <ol className="flex flex-col gap-20 sm:gap-24">
          {TIMELINE.map((step, i) => (
            <TimelineStep key={step.phase} step={step} index={i} />
          ))}
        </ol>
      </div>
    </div>
  )
}

function TimelineStep({
  step,
  index,
}: {
  step: (typeof TIMELINE)[number]
  index: number
}) {
  return (
    <li className="relative pl-9 sm:pl-16">
      <Reveal direction="none" duration={0.6}>
        <span
          aria-hidden
          className="absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full border border-gold-300/60 bg-ink-900 sm:size-[23px]"
        >
          <span className="size-1.5 rounded-full bg-gold-300 sm:size-2" />
        </span>
      </Reveal>

      <div
        className={cn(
          'grid items-center gap-8 lg:grid-cols-12 lg:gap-12',
          index % 2 === 1 && 'lg:[&>*:first-child]:order-2'
        )}
      >
        <Reveal className="lg:col-span-7">
          <span className="font-brand text-[0.68rem] font-semibold tracking-[0.22em] text-gold-300 uppercase">
            {step.phase}
          </span>
          <h4 className="mt-4 font-display text-[1.75rem] leading-tight font-normal text-silver-50 sm:text-[2.125rem]">
            {step.title}
          </h4>
          <p className="mt-5 max-w-[52ch] text-[1rem] leading-relaxed text-silver-400">
            {step.body}
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-3 gap-y-2.5">
            {step.marks.map((mark) => (
              <li
                key={mark}
                className="rounded-full border border-silver-400/18 bg-silver-400/[0.045] px-3.5 py-1.5 font-brand text-[0.62rem] tracking-[0.14em] text-silver-300 uppercase"
              >
                {mark}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal direction={index % 2 === 1 ? 'right' : 'left'} delay={0.1} className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-silver-400/12">
            <Img
              name={step.image}
              alt=""
              sizes="(min-width: 1024px) 34vw, 92vw"
              className="aspect-3/2 w-full"
              imgClassName="saturate-[0.75] opacity-90"
            />
          </div>
        </Reveal>
      </div>
    </li>
  )
}
