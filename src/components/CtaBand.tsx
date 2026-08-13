import { Reveal } from './Reveal'
import { StarMark } from './Logo'
import { Button, ArrowRight } from './Button'
import { SITE } from '../data/content'

/**
 * Avslutande uppmaning längst ned på undersidorna. Håller vägen till ett
 * samtal kort oavsett var besökaren landar.
 */
export function CtaBand({
  heading = 'Vill ni veta hur det skulle se ut hos er?',
  body = 'Boka ett förutsättningslöst möte — digitalt eller på plats hos er, där vi visar hur arbetsstationerna är uppbyggda.',
}: {
  heading?: string
  body?: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(70% 100% at 50% 0%, rgba(26,58,99,0.42), transparent 62%)' }}
      />
      <StarMark
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-24 -z-10 size-[24rem] opacity-[0.05]"
        detail="simple"
      />

      <div className="shell flex flex-col items-center text-center">
        <Reveal direction="none">
          <StarMark className="size-9 opacity-85" />
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-7 display-2 max-w-[18ch] font-normal text-silver-50">{heading}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lead mt-6 max-w-[52ch] text-silver-400">{body}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href="/kontakt/" size="lg">
              Boka ett möte
              <ArrowRight />
            </Button>
            <Button href={`tel:${SITE.phoneHref}`} variant="ghost" size="lg">
              Ring {SITE.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
