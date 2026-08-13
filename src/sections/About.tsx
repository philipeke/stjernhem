import { Section } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { StarMark } from '../components/Logo'
import { Portrait } from '../components/Portrait'
import { ABOUT, SITE } from '../data/content'

export function About() {
  return (
    <Section id="anneli" tone="light">
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
              <p className="mt-4 font-brand text-[0.72rem] leading-relaxed font-semibold tracking-[0.18em] text-sage-600 uppercase">
                {ABOUT.role}
              </p>
            </Reveal>

            <div className="mt-9 max-w-[58ch] space-y-6">
              {ABOUT.paragraphs.map((paragraph, i) => (
                <Reveal
                  key={paragraph}
                  delay={0.1 + i * 0.05}
                  as="p"
                  className="text-[1.0625rem] leading-relaxed text-ink-600/85"
                >
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
