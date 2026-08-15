import { useEffect, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ConstructionBar } from './ConstructionNotice'
import { SITE } from '../data/content'
import { useLenis } from '../lib/useLenis'
import { useMotionEnabled } from '../lib/useMediaQuery'

/**
 * Gemensam ram för samtliga sidor: bygg-notis, header, innehåll och sidfot.
 * Varje sida är ett eget HTML-dokument med egen titel och beskrivning — det
 * ger riktiga adresser som /metod/ i stället för /#metod, och en egen
 * träff i sökresultaten per ämne.
 */
export function Shell({ children }: { children: ReactNode }) {
  const motionOk = useMotionEnabled()
  useLenis(motionOk && SITE.smoothScroll)

  useEffect(() => {
    document.documentElement.dataset.notice = SITE.underConstruction ? 'on' : 'off'
  }, [])

  // Gamla ankarlänkar (/#metod) ska fortfarande leda rätt.
  useEffect(() => {
    const moved: Record<string, string> = {
      '#metod': '/metod/',
      '#tjanster': '/tjanster/',
      '#rapporten': '/metod/#rapporten',
      '#om-oss': '/om-oss/',
      '#fragor': '/fragor/',
      '#kontakt': '/kontakt/',
    }
    if (window.location.pathname !== '/') return
    const target = moved[window.location.hash]
    if (target) window.location.replace(target)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-full focus:bg-silver-50 focus:px-5 focus:py-3 focus:font-brand focus:text-[0.7rem] focus:font-semibold focus:tracking-[0.16em] focus:text-ink-900 focus:uppercase"
      >
        Hoppa till innehållet
      </a>

      {SITE.underConstruction && <ConstructionBar />}
      <Header />

      <main id="innehall">{children}</main>

      <Footer />
    </MotionConfig>
  )
}
