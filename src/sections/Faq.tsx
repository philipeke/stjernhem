import { Section, SectionHeading } from '../components/Section'
import { Accordion } from '../components/Accordion'
import { Reveal } from '../components/Reveal'
import { Button, ArrowRight } from '../components/Button'
import { FAQ } from '../data/content'

export function Faq() {
  return (
    <Section id="fragor" tone="dark">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--notice-h)+var(--header-h)+3rem)]">
            <SectionHeading
              eyebrow="Vanliga frågor"
              heading="Det ni brukar undra"
              headingClassName="max-w-[12ch]"
            />
            <Reveal delay={0.16} className="mt-9">
              <p className="max-w-[36ch] text-[0.95rem] leading-relaxed text-silver-500">
                Hittar ni inte svaret? Ring eller mejla — ni får svar av arbetsterapeuten själv, inte
                av en säljare.
              </p>
              <Button href="#kontakt" variant="ghost" className="mt-7">
                Ställ er fråga
                <ArrowRight />
              </Button>
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
