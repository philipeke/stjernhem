import { Section, SectionHeading } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { SpotlightCard } from '../components/SpotlightCard'
import { Button, ArrowRight } from '../components/Button'
import { StarMark } from '../components/Logo'
import { SERVICES } from '../data/content'
import { cn } from '../lib/cn'

export function Services() {
  return (
    <Section id="tjanster" tone="light">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(70%_100%_at_50%_0%,rgba(133,164,143,0.13),transparent)]"
      />

      <div className="shell">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Våra tjänster"
          heading="Tre nivåer — samma kliniska skärpa"
          lead="Välj den omfattning som passar ärendet. Allt genomförs på plats hos er, av legitimerad arbetsterapeut."
        />

        <Stagger as="ul" className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:items-start">
          {SERVICES.map((service) => (
            <Stagger.Item as="li" key={service.id} className={cn(service.featured && 'lg:-mt-6')}>
              <SpotlightCard
                as="article"
                glow="rgba(133,164,143,0.16)"
                className={cn(
                  'flex h-full flex-col rounded-[1.5rem] border p-8 transition-shadow duration-500 sm:p-10',
                  service.featured
                    ? 'border-ink-700/15 bg-white shadow-[0_40px_90px_-48px_rgba(12,30,56,0.55)] hover:shadow-[0_46px_100px_-44px_rgba(12,30,56,0.6)]'
                    : 'border-ink-700/10 bg-white/55 hover:bg-white/80'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-brand text-[0.65rem] font-semibold tracking-[0.24em] text-sage-600 uppercase">
                    {service.number}
                  </span>
                  {service.featured && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink-700 px-3.5 py-1.5 font-brand text-[0.58rem] font-semibold tracking-[0.18em] text-gold-200 uppercase">
                      <StarMark className="size-2.5" detail="simple" />
                      Mest omfattande
                    </span>
                  )}
                </div>

                <p className="mt-6 font-brand text-[0.66rem] font-semibold tracking-[0.2em] text-ink-600/55 uppercase">
                  {service.kicker}
                </p>
                <h3 className="mt-3 font-display text-[1.625rem] leading-tight font-normal text-ink-700 sm:text-[1.875rem]">
                  {service.name}
                </h3>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-600/75">
                  {service.summary}
                </p>

                <ul className="mt-8 flex flex-col gap-3.5 border-t border-ink-700/10 pt-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-3.5 text-[0.9rem] leading-relaxed text-ink-600/85">
                      <Check />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-9">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-display text-[2.25rem] leading-none font-normal text-ink-700">
                      {service.price}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.82rem] text-ink-600/60">{service.priceUnit}</p>
                  {service.priceNote && (
                    <p className="mt-1 font-brand text-[0.62rem] tracking-[0.12em] text-ink-600/45 uppercase">
                      {service.priceNote}
                    </p>
                  )}

                  {service.discount && (
                    <div className="mt-6 rounded-xl border border-sage-400/35 bg-sage-100/60 p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-brand text-[0.6rem] font-semibold tracking-[0.18em] text-sage-800 uppercase">
                          {service.discount.label}
                        </span>
                        <span className="font-display text-[1.375rem] leading-none text-sage-800">
                          {service.discount.price}
                        </span>
                      </div>
                      <p className="mt-3 text-[0.84rem] leading-relaxed text-sage-800/80">
                        {service.discount.body}
                      </p>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </Stagger.Item>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-14 flex flex-col items-center gap-6 text-center">
          <p className="max-w-[54ch] text-[0.95rem] leading-relaxed text-ink-600/70">
            Osäkra på vilken nivå som passar ert ärende? Vi går igenom det tillsammans på ett
            förutsättningslöst möte — utan kostnad och utan åtagande.
          </p>
          <Button href="#kontakt" variant="dark" size="lg">
            Boka ett möte
            <ArrowRight />
          </Button>
        </Reveal>
      </div>
    </Section>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-[0.42em] size-3.5 shrink-0">
      <path
        d="M2.5 8.4 6 11.8 13.5 4.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-sage-500"
      />
    </svg>
  )
}
