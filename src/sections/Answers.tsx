import { Section, SectionHeading } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { Img } from '../components/Img'
import { StarMark } from '../components/Logo'
import { ANSWERS, EXPERTISE } from '../data/content'

export function Answers() {
  return (
    <Section id="rapporten" tone="dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(90% 60% at 82% 8%, rgba(26,58,99,0.42), transparent 62%)',
        }}
      />

      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow={ANSWERS.eyebrow}
              heading={ANSWERS.heading}
              lead={ANSWERS.body}
              headingClassName="max-w-[13ch]"
            />

            <Reveal delay={0.2} className="mt-12">
              <figure className="overflow-hidden rounded-2xl border border-silver-400/12 bg-ink-900/70">
                <div className="relative">
                  <Img
                    name="report"
                    alt="Uppslagen anteckningsbok och penna på ett mörkt skrivbord"
                    sizes="(min-width: 1024px) 38vw, 92vw"
                    className="aspect-16/9 w-full"
                    imgClassName="saturate-[0.7]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent"
                  />
                </div>
                <figcaption className="p-7">
                  <p className="font-brand text-[0.62rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">
                    {ANSWERS.delivery.title}
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-silver-400">
                    {ANSWERS.delivery.body}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Stagger as="ul" className="grid gap-px overflow-hidden rounded-2xl bg-silver-400/12 sm:grid-cols-2">
              {ANSWERS.items.map((item, i) => (
                <Stagger.Item
                  as="li"
                  key={item.title}
                  className="group relative bg-ink-800 p-7 transition-colors duration-500 hover:bg-ink-700/70 sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <StarMark className="size-3.5 shrink-0 opacity-75 transition-transform duration-700 ease-out-expo group-hover:rotate-45" />
                    <span className="font-brand text-[0.6rem] font-semibold tracking-[0.2em] text-silver-500 uppercase">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[1.25rem] leading-snug font-normal text-silver-50">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-silver-400">{item.body}</p>
                </Stagger.Item>
              ))}
            </Stagger>

            <Reveal delay={0.15} className="mt-10">
              <h3 className="display-3 max-w-[20ch] font-normal text-silver-50">
                Arbetsterapeutisk spetskompetens
              </h3>
              <p className="mt-5 max-w-[56ch] text-[1rem] leading-relaxed text-silver-400">
                Med femton års erfarenhet inom stat, kommun och neurologisk rehabilitering har vi
                djupgående kunskap om dolda funktionshinder. Vi utreder vilka
                aktivitetsbegränsningar de faktiskt ger.
              </p>
            </Reveal>

            <Stagger as="ul" className="mt-9 flex flex-col divide-y divide-silver-400/12 border-y border-silver-400/12">
              {EXPERTISE.map((item) => (
                <Stagger.Item as="li" key={item.title} className="py-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                    <h4 className="font-brand text-[0.72rem] leading-relaxed font-semibold tracking-[0.14em] text-gold-300 uppercase sm:w-[15rem] sm:shrink-0">
                      {item.title}
                    </h4>
                    <p className="text-[0.92rem] leading-relaxed text-silver-400">{item.body}</p>
                  </div>
                </Stagger.Item>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </Section>
  )
}
