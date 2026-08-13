import { Section } from '../../components/Section'
import { Reveal, Stagger } from '../../components/Reveal'
import { StarMark } from '../../components/Logo'
import { Button, ArrowRight } from '../../components/Button'
import { Portrait } from '../../components/Portrait'
import { ABOUT, SITE } from '../../data/content'

/** Kort presentation på startsidan. Hela berättelsen finns på /om-oss/. */
export function AboutTeaser() {
  return (
    <Section tone="light">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-paper-warm"
        style={{
          maskImage: 'linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)',
        }}
      />

      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
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
            <p className="mt-4 font-brand text-[0.72rem] leading-relaxed font-semibold tracking-[0.18em] text-sage-600 uppercase">
              {ABOUT.role}
            </p>
          </Reveal>

          <Reveal delay={0.12} as="p" className="lead mt-8 max-w-[56ch] text-ink-600/85">
            {ABOUT.paragraphs[0]}
          </Reveal>

          <Reveal delay={0.18} className="mt-9">
            <blockquote className="relative rounded-2xl border border-ink-700/10 bg-white/70 p-7">
              <p className="font-display text-[1.25rem] leading-snug font-normal text-ink-700 italic sm:text-[1.5rem]">
                “{ABOUT.quote}”
              </p>
              <footer className="mt-4 font-brand text-[0.64rem] tracking-[0.18em] text-ink-600/55 uppercase">
                {SITE.contactPerson}
              </footer>
            </blockquote>
          </Reveal>

          <Stagger as="ul" className="mt-8 flex flex-wrap gap-2.5">
            {ABOUT.credentials.slice(0, 3).map((credential) => (
              <Stagger.Item
                as="li"
                key={credential}
                className="rounded-full border border-ink-700/12 bg-white/60 px-4 py-2 font-brand text-[0.62rem] tracking-[0.14em] text-ink-600/75 uppercase"
              >
                {credential}
              </Stagger.Item>
            ))}
          </Stagger>

          <Reveal delay={0.16} className="mt-9">
            <Button href="/om-oss/" variant="dark">
              Mer om Stjernhem
              <ArrowRight />
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
