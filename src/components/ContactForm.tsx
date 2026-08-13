import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { StarMark } from './Logo'
import { Button, ArrowRight } from './Button'
import { SITE } from '../data/content'
import {
  EMPTY_FIELDS,
  buildMailto,
  buildPlainText,
  validate,
  type ContactFields,
  type FieldErrors,
} from '../lib/contactMessage'
import { cn } from '../lib/cn'

/**
 * Sätt VITE_FORM_ENDPOINT (Formspree, Web3Forms eller liknande) för att ta
 * emot förfrågningarna direkt i inkorgen.
 *
 * Utan endpoint öppnas i stället ett färdigskrivet mejlutkast till
 * anneli@stjernhem.se i besökarens egen e-postklient. Öppnas ingen klient –
 * eller vill besökaren skicka från något annat håll – visas hela meddelandet
 * med en kopiera-knapp. Formuläret gör alltså alltid något användbart, även
 * innan brevlådan är aktiverad.
 */
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT

type Status = 'idle' | 'sending' | 'drafted' | 'sent' | 'error'

export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const set = (key: keyof ContactFields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
    // Ta bort felet så fort besökaren börjar rätta det.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCopied(false)

    const found = validate(fields)
    setErrors(found)
    const firstBad = Object.keys(found)[0]
    if (firstBad) {
      setStatus('idle')
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
      return
    }

    if (FORM_ENDPOINT) {
      setStatus('sending')
      try {
        const body = new FormData()
        for (const [key, value] of Object.entries(fields)) body.append(key, value)
        body.append('_subject', `Förfrågan från ${fields.organisation || fields.namn}`)
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body,
        })
        if (!res.ok) throw new Error(String(res.status))
        setFields(EMPTY_FIELDS)
        setStatus('sent')
      } catch {
        setStatus('error')
      }
      return
    }

    // Öppna mejlutkastet via en riktig länk — mer tillförlitligt än att
    // skriva till window.location, som vissa webbläsare blockerar.
    const link = document.createElement('a')
    link.href = buildMailto(fields)
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setStatus('drafted')
  }

  const copy = async () => {
    const text = buildPlainText(fields)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Äldre webbläsare, eller sidan saknar behörighet: markera texten så
      // att besökaren kan kopiera själv.
      const area = formRef.current?.querySelector<HTMLTextAreaElement>('#kopiera-text')
      area?.select()
      setCopied(false)
    }
  }

  const showDraftPanel = status === 'drafted'

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-[1.75rem] border border-silver-400/15 bg-ink-800/90 p-7 sm:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
        style={{
          background: 'radial-gradient(120% 90% at 50% 0%, rgba(39,80,127,0.28), transparent 62%)',
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <StarMark className="size-5 opacity-85" detail="simple" />
          <h3 className="font-brand text-[0.68rem] leading-relaxed font-semibold tracking-[0.2em] text-gold-300 uppercase">
            Boka ett förutsättningslöst möte
          </h3>
        </div>

        <p className="mt-4 text-[0.9rem] leading-relaxed text-silver-400">
          Berätta kort om ert behov så återkommer vi med förslag på tid — digitalt eller på plats hos
          er.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field
            name="namn"
            label="Namn"
            autoComplete="name"
            required
            value={fields.namn}
            onChange={set('namn')}
            error={errors.namn}
          />
          <Field
            name="organisation"
            label="Kommun / organisation"
            autoComplete="organization"
            required
            value={fields.organisation}
            onChange={set('organisation')}
            error={errors.organisation}
          />
          <Field
            name="epost"
            label="E-post"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={fields.epost}
            onChange={set('epost')}
            error={errors.epost}
          />
          <Field
            name="telefon"
            label="Telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={fields.telefon}
            onChange={set('telefon')}
            error={errors.telefon}
          />
        </div>

        <div className="mt-5">
          <Field
            name="meddelande"
            label="Vad gäller det?"
            textarea
            required
            value={fields.meddelande}
            onChange={set('meddelande')}
            error={errors.meddelande}
          />
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
              className="text-[0.88rem] text-sage-300"
            >
              Tack! Vi hör av oss inom kort.
            </motion.p>
          )}
          {status === 'error' && (
            <p role="alert" className="text-[0.88rem] text-gold-300">
              Något gick fel. Ring{' '}
              <a href={`tel:${SITE.phoneHref}`} className="underline underline-offset-4">
                {SITE.phone}
              </a>{' '}
              så löser vi det.
            </p>
          )}
        </div>

        <AnimatePresence>
          {showDraftPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div
                role="status"
                className="mt-7 rounded-2xl border border-sage-400/30 bg-sage-400/[0.07] p-6"
              >
                <p className="font-brand text-[0.62rem] font-semibold tracking-[0.18em] text-sage-300 uppercase">
                  Ett mejlutkast har öppnats
                </p>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-silver-300">
                  Utkastet är adresserat till{' '}
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-silver-100 underline decoration-gold-400/50 underline-offset-4"
                  >
                    {SITE.email}
                  </a>
                  . Öppnades ingen e-postklient? Kopiera meddelandet här nedan och skicka det från
                  din vanliga e-post — eller ring{' '}
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="text-silver-100 underline decoration-gold-400/50 underline-offset-4"
                  >
                    {SITE.phone}
                  </a>
                  .
                </p>

                <label className="mt-5 block">
                  <span className="sr-only">Meddelandet i klartext</span>
                  <textarea
                    id="kopiera-text"
                    readOnly
                    rows={7}
                    value={buildPlainText(fields)}
                    className="w-full resize-y rounded-xl border border-silver-400/18 bg-ink-900/70 px-4 py-3.5 font-mono text-[0.78rem] leading-relaxed text-silver-300"
                  />
                </label>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={copy}
                    className="rounded-full border border-silver-400/30 px-5 py-2.5 font-brand text-[0.66rem] font-semibold tracking-[0.16em] text-silver-100 uppercase transition-colors duration-300 hover:border-gold-300/70 hover:text-white"
                  >
                    {copied ? 'Kopierat' : 'Kopiera meddelandet'}
                  </button>
                  <a
                    href={buildMailto(fields)}
                    className="py-2.5 font-brand text-[0.66rem] tracking-[0.16em] text-silver-400 uppercase underline underline-offset-4 transition-colors duration-300 hover:text-white"
                  >
                    Öppna utkastet igen
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
  value,
  onChange,
  error,
  type = 'text',
  inputMode,
  required = false,
  textarea = false,
  autoComplete,
}: {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  inputMode?: 'email' | 'tel' | 'text'
  required?: boolean
  textarea?: boolean
  autoComplete?: string
}) {
  const errorId = `${name}-fel`
  const shared = cn(
    'w-full rounded-xl border bg-ink-900/60 px-4 py-3.5 text-[0.95rem] text-silver-100',
    'placeholder:text-silver-600 transition-colors duration-300 focus:outline-none',
    error
      ? 'border-gold-400/70 hover:border-gold-400/80 focus:border-gold-300'
      : 'border-silver-400/18 hover:border-silver-400/32 focus:border-gold-400/60'
  )

  const shared_props = {
    name,
    value,
    required,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: shared,
  }

  return (
    <div>
      <label className="block">
        <span className="mb-2 block font-brand text-[0.6rem] font-semibold tracking-[0.18em] text-silver-500 uppercase">
          {label}
          {required && <span className="ml-1 text-gold-400/70">*</span>}
        </span>
        {textarea ? (
          <textarea {...shared_props} rows={4} className={cn(shared, 'resize-y')} />
        ) : (
          <input {...shared_props} type={type} inputMode={inputMode} />
        )}
      </label>
      {error && (
        <p id={errorId} className="mt-2 text-[0.78rem] text-gold-300">
          {error}
        </p>
      )}
    </div>
  )
}
