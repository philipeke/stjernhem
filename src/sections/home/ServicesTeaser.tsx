import { Section, SectionHeading } from '../../components/Section'
import { Reveal, Stagger } from '../../components/Reveal'
import { SpotlightCard } from '../../components/SpotlightCard'
import { Button, ArrowRight } from '../../components/Button'
import { StarMark } from '../../components/Logo'
import { SERVICES } from '../../data/content'
import { cn } from '../../lib/cn'

/** Tre korta tjänstekort på startsidan. Fullständiga uppgifter på /tjanster/. */
export function ServicesTeaser() {
  return (
    <Section tone="light">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(70%_100%_at_50%_0%,rgba(133,164,143,0.13),transparent)]"
      />

      <div className="shell">
        <SectionHeading
          tone="light"
          align="center"
          eyebrow="Våra tjänster"
          heading="Tre nivåer — samma kliniska skärpa"
          lead="Välj den omfattning som passar ärendet. Allt genomförs på plats hos er, av legitimerad arbetsterapeut."
        />

        <Stagger as="ul" className="mt-16 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Stagger.Item as="li" key={service.id} className="h-full">
              <SpotlightCard
                as="article"
                glow="rgba(133,164,143,0.16)"
                className={cn(
                  'flex h-full flex-col rounded-[1.5rem] border p-8 transition-shadow duration-500',
                  service.featured
                    ? 'border-ink-700/15 bg-white shadow-[0_36px_80px_-48px_rgba(12,30,56,0.5)]'
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

                <h3 className="mt-6 font-display text-[1.5rem] leading-tight font-normal text-ink-700">
                  {service.name}
                </h3>
                <p className="mt-4 text-[0.93rem] leading-relaxed text-ink-600/75">
                  {service.summary}
                </p>

                <div className="mt-auto border-t border-ink-700/10 pt-7">
                  <p className="font-display text-[2rem] leading-none font-normal text-ink-700">
                    {service.price}
                  </p>
                  <p className="mt-2 text-[0.82rem] text-ink-600/60">{service.priceUnit}</p>
                </div>
              </SpotlightCard>
            </Stagger.Item>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-14 flex flex-col items-center gap-6 text-center">
          <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-600/70">
            Vad som ingår, hur lång tid det tar och vilka rabatter som finns — allt står på
            tjänstesidan.
          </p>
          <Button href="/tjanster/" variant="dark" size="lg">
            Se alla tjänster och priser
            <ArrowRight />
          </Button>
        </Reveal>
      </div>
    </Section>
  )
}
