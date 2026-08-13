import { useState } from 'react'
import { motion } from 'motion/react'
import { Section } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { Img } from '../components/Img'
import { StarMark } from '../components/Logo'
import { Button, ArrowRight } from '../components/Button'
import { CONTACT, SITE } from '../data/content'
import { cn } from '../lib/cn'

/**
 * Sätt VITE_FORM_ENDPOINT (t.ex. en Formspree- eller Web3Forms-adress) för att
 * ta emot formuläret direkt i inkorgen. Utan endpoint öppnas i stället ett
 * färdigskrivet mejlutkast i besökarens e-postklient — fungerar överallt och
 * kräver ingen extern tjänst.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined

export function Contact() {
  return (
    <Section id="kontakt" tone="darker">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <Img
          name="coast"
          alt=""
          sizes="100vw"
          className="h-full w-full"
          imgClassName="opacity-[0.16] saturate-[0.45]"
          objectPosition="center 60%"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,13,24,0.94) 0%, rgba(6,13,24,0.82) 45%, rgba(4,9,15,0.98) 100%)',
          }}
        />
      </div>

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

type Status = 'idle' | 'sending' | 'sent' | 'error'

function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (!FORM_ENDPOINT) {
      // Fallback: öppna ett färdigskrivet mejl i besökarens e-postklient.
      const body = [
        `Namn: ${data.get('namn')}`,
        `Kommun/organisation: ${data.get('organisation')}`,
        `E-post: ${data.get('epost')}`,
        `Telefon: ${data.get('telefon') || '—'}`,
        '',
        String(data.get('meddelande') ?? ''),
      ].join('\n')
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        `Förfrågan från ${data.get('organisation') || data.get('namn')}`
      )}&body=${encodeURIComponent(body)}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-[1.75rem] border border-silver-400/15 bg-ink-800/70 p-7 backdrop-blur-xl sm:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(39,80,127,0.28), transparent 62%)',
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <StarMark className="size-5 opacity-85" detail="simple" />
          <h3 className="font-brand text-[0.68rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">
            Boka ett förutsättningslöst möte
          </h3>
        </div>

        <p className="mt-4 text-[0.9rem] leading-relaxed text-silver-400">
          Berätta kort om ert behov så återkommer vi med förslag på tid — digitalt eller på plats hos
          er.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field name="namn" label="Namn" autoComplete="name" required />
          <Field name="organisation" label="Kommun / organisation" autoComplete="organization" required />
          <Field name="epost" label="E-post" type="email" autoComplete="email" required />
          <Field name="telefon" label="Telefon" type="tel" autoComplete="tel" />
        </div>

        <div className="mt-5">
          <Field name="meddelande" label="Vad gäller det?" textarea required />
        </div>

        {/* Enkel honungsfälla mot robotar. */}
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Lämna tomt
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Button type="submit" size="lg" magnetic={false}>
            {status === 'sending' ? 'Skickar …' : 'Skicka förfrågan'}
            <ArrowRight />
          </Button>

          {status === 'sent' && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              className="text-[0.85rem] text-sage-300"
            >
              {FORM_ENDPOINT
                ? 'Tack! Vi hör av oss inom kort.'
                : 'Ett mejlutkast har öppnats i din e-postklient.'}
            </motion.p>
          )}
          {status === 'error' && (
            <p role="alert" className="text-[0.85rem] text-gold-300">
              Något gick fel. Mejla oss gärna direkt på {SITE.email}.
            </p>
          )}
        </div>

        <p className="mt-6 text-[0.75rem] leading-relaxed text-silver-500">
          Vi behandlar era uppgifter enbart för att besvara förfrågan och sparar dem inte längre än
          nödvändigt.
        </p>
      </div>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  required = false,
  textarea = false,
  autoComplete,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  textarea?: boolean
  autoComplete?: string
}) {
  const shared = cn(
    'w-full rounded-xl border border-silver-400/18 bg-ink-900/60 px-4 py-3.5 text-[0.95rem] text-silver-100',
    'placeholder:text-silver-600 transition-colors duration-300',
    'hover:border-silver-400/32 focus:border-gold-400/60 focus:outline-none'
  )

  return (
    <label className="block">
      <span className="mb-2 block font-brand text-[0.6rem] font-semibold tracking-[0.18em] text-silver-500 uppercase">
        {label}
        {required && <span className="ml-1 text-gold-400/70">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} rows={4} className={cn(shared, 'resize-y')} />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={shared}
        />
      )}
    </label>
  )
}
