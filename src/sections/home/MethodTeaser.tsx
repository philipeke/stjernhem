import { Section, SectionHeading } from '../../components/Section'
import { Reveal, Stagger } from '../../components/Reveal'
import { Img } from '../../components/Img'
import { StarMark } from '../../components/Logo'
import { Button, ArrowRight } from '../../components/Button'
import { APPROACH, TIMELINE } from '../../data/content'

/** Kort översikt av metoden på startsidan. Djupet ligger på /metod/. */
export function MethodTeaser() {
  return (
    <Section tone="darker">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(80% 60% at 15% 0%, rgba(26,58,99,0.34), transparent 62%)' }}
      />

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
            <Reveal delay={0.16}>
              <Button href="/metod/" variant="ghost">
                Läs om metoden
                <ArrowRight />
              </Button>
            </Reveal>
          </div>
        </div>

        <Stagger as="ol" className="mt-16 grid gap-5 md:grid-cols-3">
          {TIMELINE.map((step, i) => (
            <Stagger.Item as="li" key={step.phase}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-silver-400/12 bg-ink-800/60">
                <div className="relative">
                  <Img
                    name={step.image}
                    alt=""
                    sizes="(min-width: 768px) 31vw, 92vw"
                    className="aspect-16/9 w-full"
                    imgClassName="saturate-[0.7] opacity-85 transition-transform duration-[1100ms] ease-out-expo group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-ink-900/80 px-3 py-1.5 font-brand text-[0.58rem] font-semibold tracking-[0.18em] text-gold-300 uppercase">
                    Steg {i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2.5">
                    <StarMark className="size-3 opacity-70" detail="simple" />
                    <span className="font-brand text-[0.62rem] font-semibold tracking-[0.18em] text-silver-500 uppercase">
                      {step.phase}
                    </span>
                  </div>
                  <h3 className="mt-3.5 font-display text-[1.3rem] leading-snug font-normal text-silver-50">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-silver-400">{step.body}</p>
                </div>
              </article>
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
