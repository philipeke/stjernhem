import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ConstructionBar } from './components/ConstructionNotice'
import { Hero } from './sections/Hero'
import { Stats } from './sections/Stats'
import { Challenge } from './sections/Challenge'
import { Method } from './sections/Method'
import { Services } from './sections/Services'
import { Answers } from './sections/Answers'
import { About } from './sections/About'
import { Why } from './sections/Why'
import { Faq } from './sections/Faq'
import { Contact } from './sections/Contact'
import { SITE } from './data/content'
import { useLenis } from './lib/useLenis'
import { useMotionEnabled } from './lib/useMediaQuery'

export default function App() {
  const motionOk = useMotionEnabled()
  useLenis(motionOk)

  useEffect(() => {
    document.documentElement.dataset.notice = SITE.underConstruction ? 'on' : 'off'
  }, [])

  return (
    // reducedMotion="user" låter Motion släcka förflyttningar och skalningar
    // för den som bett om det i systeminställningarna — intoningar behålls,
    // så inget innehåll blir osynligt.
    <MotionConfig reducedMotion="user">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-full focus:bg-silver-50 focus:px-5 focus:py-3 focus:font-brand focus:text-[0.7rem] focus:font-semibold focus:tracking-[0.16em] focus:text-ink-900 focus:uppercase"
      >
        Hoppa till innehållet
      </a>

      {SITE.underConstruction && <ConstructionBar />}
      <Header />

      <main id="innehall">
        <Hero />
        <Stats />
        <Challenge />
        <Method />
        <Services />
        <Answers />
        <About />
        <Why />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  )
}
