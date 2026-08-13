import { Section } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { StarMark } from '../components/Logo'
import { Button, ArrowRight } from '../components/Button'
import { ContactForm } from '../components/ContactForm'
import { CONTACT, SITE } from '../data/content'

export function Contact() {
  return (
    <Section id="kontakt" tone="darker">
      {/* Fotografiet ligger redan i sidhuvudet ovanför — här räcker ljuset. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: 'radial-gradient(80% 60% at 20% 0%, rgba(26,58,99,0.4), transparent 62%)',
        }}
      />

      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal direction="none">
              <span className="inline-flex items-center gap-3 text-silver-400">
                <StarMark className="size-3 opacity-80" detail="simple" />
                <span className="eyebrow">{CONTACT.eyebrow}</span>
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="mt-5 display-2 max-w-[16ch] font-normal text-silver-50">
                {CONTACT.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="lead mt-7 max-w-[52ch] text-silver-300/90">{CONTACT.body}</p>
            </Reveal>

            <Stagger as="ul" className="mt-12 flex flex-col divide-y divide-silver-400/12 border-y border-silver-400/12">
              <ContactRow label="Företag" value={SITE.legalName} />
              <ContactRow label="Kontaktperson" value={`${SITE.contactPerson} · ${SITE.contactRole}`} />
              <ContactRow label="Telefon" value={SITE.phone} href={`tel:${SITE.phoneHref}`} />
              <ContactRow label="E-post" value={SITE.email} href={`mailto:${SITE.email}`} />
              <ContactRow label="Utgångspunkt" value={SITE.base} />
              <ContactRow label="Verksamma i" value={SITE.coverage} />
            </Stagger>

            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-4">
              <Button href={`tel:${SITE.phoneHref}`} size="lg">
                Ring {SITE.phone}
              </Button>
              <Button href={`mailto:${SITE.email}`} variant="ghost" size="lg">
                Mejla oss
                <ArrowRight />
              </Button>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal direction="left" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <Stagger.Item as="li" className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8">
      <span className="font-brand text-[0.62rem] font-semibold tracking-[0.2em] text-silver-500 uppercase sm:w-[10.5rem] sm:shrink-0">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          className="inline-block py-1 text-[1rem] text-silver-100 underline decoration-gold-400/40 underline-offset-[6px] transition-colors duration-300 hover:text-white hover:decoration-gold-300"
        >
          {value}
        </a>
      ) : (
        <span className="text-[1rem] text-silver-200">{value}</span>
      )}
    </Stagger.Item>
  )
}
