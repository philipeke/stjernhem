import { LogoLockup, StarMark } from './Logo'
import { NAV, SITE } from '../data/content'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative isolate overflow-hidden bg-ink pt-20 pb-10 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-silver-400/25 to-transparent"
      />
      <StarMark
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-32 -z-10 size-[28rem] opacity-[0.045]"
        detail="simple"
      />

      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <LogoLockup size="md" />
            <p className="mt-7 max-w-[38ch] text-[0.92rem] leading-relaxed text-silver-500">
              Arbetslivsinriktad rehabilitering och specialistutredningar för kommunala
              arbetsmarknadsenheter. Utredningen genomförs på plats i era egna lokaler.
            </p>
          </div>

          <nav aria-label="Sidfotsmeny" className="lg:col-span-3">
            <h2 className="font-brand text-[0.6rem] font-semibold tracking-[0.2em] text-silver-500 uppercase">
              Innehåll
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block py-1.5 text-[0.92rem] text-silver-300 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="font-brand text-[0.6rem] font-semibold tracking-[0.2em] text-silver-500 uppercase">
              Kontakt
            </h2>
            <ul className="mt-5 flex flex-col gap-3 text-[0.92rem]">
              <li className="py-1.5 text-silver-300">{SITE.contactPerson}</li>
              <li>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="inline-block py-1.5 text-silver-300 transition-colors duration-300 hover:text-white"
                >
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-block py-1.5 text-silver-300 transition-colors duration-300 hover:text-white"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="py-1.5 text-silver-500">
                {SITE.base} — {SITE.coverage}
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16" />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-brand text-[0.62rem] tracking-[0.14em] text-silver-600 uppercase">
            © {year} {SITE.legalName}
          </p>
          {SITE.underConstruction && (
            <p className="font-brand text-[0.62rem] tracking-[0.14em] text-gold-400/70 uppercase">
              Webbplatsen är under uppbyggnad
            </p>
          )}
          <a
            href="#top"
            className="group inline-flex items-center gap-2.5 py-1.5 font-brand text-[0.62rem] tracking-[0.14em] text-silver-500 uppercase transition-colors duration-300 hover:text-white"
          >
            Till toppen
            <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5 transition-transform duration-400 group-hover:-translate-y-0.5">
              <path
                d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
