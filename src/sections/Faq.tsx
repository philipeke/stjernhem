import { Section } from '../components/Section'
import { Accordion } from '../components/Accordion'
import { Reveal } from '../components/Reveal'
import { StarMark } from '../components/Logo'
import { Button, ArrowRight } from '../components/Button'
import { FAQ, SITE } from '../data/content'

export function Faq() {
  return (
    <Section id="fragor" tone="dark">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--notice-h)+var(--header-h)+3rem)]">
            <Reveal direction="none">
              <span className="inline-flex items-center gap-3 text-silver-400">
                <StarMark className="size-3 opacity-80" detail="simple" />
                <span className="eyebrow">Frågor och svar</span>
              </span>
            </Reveal>

            {/* Egen skala i stället för display-2: rubriken står i en smal
                kolumn, och sidans stora rubrik finns redan i sidhuvudet. */}
            <Reveal delay={0.06}>
              <h2 className="mt-5 max-w-[16ch] text-[clamp(1.75rem,2.6vw,2.25rem)] font-normal text-silver-50">
                Svaren vi oftast får ge
              </h2>
            </Reveal>

            <Reveal delay={0.12} className="mt-8">
              <p className="max-w-[36ch] text-[0.95rem] leading-relaxed text-silver-500">
                Hittar ni inte svaret? Ring eller mejla — ni får svar av arbetsterapeuten själv,
                inte av en säljare.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <Button href="/kontakt/" variant="ghost">
                  Ställ er fråga
                  <ArrowRight />
                </Button>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="inline-block py-1.5 font-brand text-[0.7rem] tracking-[0.14em] text-silver-400 uppercase transition-colors duration-300 hover:text-white"
                >
                  Eller ring {SITE.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Reveal>
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
