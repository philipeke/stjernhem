import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Section, SectionHeading } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { Img } from '../components/Img'
import { StarMark } from '../components/Logo'
import { CHALLENGE } from '../data/content'
import { useMotionEnabled } from '../lib/useMediaQuery'

export function Challenge() {
  const ref = useRef<HTMLDivElement>(null)
  const motionOk = useMotionEnabled()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  return (
    <Section id="utmaningen" tone="light">
      {/* Diskret rutnät i bakgrunden — ger yta utan att ta plats. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(12,30,56,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,30,56,0.055) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
          maskImage: 'radial-gradient(100% 70% at 50% 30%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(100% 70% at 50% 30%, #000, transparent)',
        }}
      />

      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              tone="light"
              eyebrow={CHALLENGE.eyebrow}
              heading={CHALLENGE.heading}
              headingClassName="max-w-[16ch]"
            />

            <div className="mt-9 max-w-[56ch] space-y-6">
              {CHALLENGE.body.map((paragraph, i) => (
                <Reveal key={paragraph} delay={0.1 + i * 0.06} as="p" className="lead text-ink-600/85">
                  {paragraph}
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-12">
              <blockquote className="relative border-l-2 border-sage-400/60 pl-7">
                <p className="font-display text-[1.5rem] leading-[1.28] font-normal text-ink-700 sm:text-[1.875rem]">
                  {CHALLENGE.pull}
                </p>
              </blockquote>
            </Reveal>
          </div>

          <div ref={ref} className="lg:col-span-5">
            <Reveal direction="left" duration={1} className="relative">
              <div className="relative overflow-hidden rounded-[1.75rem] bg-ink-800 shadow-[0_38px_90px_-40px_rgba(12,30,56,0.6)]">
                <motion.div style={motionOk ? { y: imageY } : undefined} className="scale-[1.12]">
                  <Img
                    name="reflection"
                    alt="Person som sitter vid ett fönster i eftertanke"
                    sizes="(min-width: 1024px) 38vw, 92vw"
                    className="aspect-4/5 w-full"
                    objectPosition="center 30%"
                  />
                </motion.div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 42%, rgba(6,13,24,0.78) 100%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                  <StarMark className="size-6 opacity-80" detail="simple" />
                  <p className="mt-4 max-w-[26ch] font-display text-[1.05rem] leading-snug text-silver-100 sm:text-[1.2rem]">
                    Bakom varje ärende finns en människa som vill veta vad hon faktiskt klarar.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Stagger as="ul" className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-ink-700/12 sm:mt-24 md:grid-cols-3">
          {CHALLENGE.points.map((point, i) => (
            <Stagger.Item
              as="li"
              key={point.title}
              className="group relative bg-paper p-8 transition-colors duration-500 hover:bg-paper-warm sm:p-10"
            >
              <span className="font-brand text-[0.65rem] font-semibold tracking-[0.24em] text-sage-500 uppercase">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-display text-[1.375rem] font-normal text-ink-700">
                {point.title}
              </h3>
              <p className="mt-3.5 text-[0.95rem] leading-relaxed text-ink-600/75">{point.body}</p>
              <span
                aria-hidden
                className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-sage-400/70 transition-transform duration-600 ease-out-expo group-hover:scale-x-100 sm:inset-x-10"
              />
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
