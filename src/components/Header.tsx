import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { LogoLockup, StarMark } from './Logo'
import { Button, ArrowRight } from './Button'
import { NAV, SITE } from '../data/content'
import { setScrollLocked } from '../lib/useLenis'
import { cn } from '../lib/cn'

/** Normaliserar sökvägen så att /metod och /metod/ jämförs lika. */
function normalise(path: string) {
  return path.endsWith('/') ? path : `${path}/`
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [path, setPath] = useState('/')

  useEffect(() => setPath(normalise(window.location.pathname)), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setScrollLocked(menuOpen)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
    }
  }, [menuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        className={cn(
          'fixed inset-x-0 top-[var(--notice-h)] z-50 h-[var(--header-h)] transition-[background-color,backdrop-filter,border-color] duration-500',
          // Måttlig backdrop-blur: filtret samplar om bakgrunden varje
          // bildruta under scroll, och 24 px kostade märkbart mer än 12 px
          // utan att se annorlunda ut bakom en nästan täckande yta.
          scrolled || menuOpen
            ? 'border-b border-silver-400/12 bg-ink-900/88 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <a
            href="/"
            className="flex min-h-11 shrink-0 items-center rounded-sm transition-opacity duration-300 hover:opacity-85"
            aria-label={`${SITE.legalName} — till startsidan`}
          >
            <LogoLockup size="sm" className="hidden sm:flex" />
            <StarMark className="size-10 sm:hidden" />
          </a>

          <nav aria-label="Huvudmeny" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = path === item.href
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative block px-3.5 py-2 font-brand text-[0.72rem] font-medium tracking-[0.14em] uppercase transition-colors duration-300 hover:text-white',
                        active ? 'text-white' : 'text-silver-300'
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-x-3.5 bottom-1 h-px origin-left bg-gold-300/80 transition-transform duration-400 ease-out-expo group-hover:scale-x-100',
                          active ? 'scale-x-100' : 'scale-x-0'
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Button href="/kontakt/" size="md">
                Boka möte
                <ArrowRight />
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobilmeny"
              aria-label={menuOpen ? 'Stäng meny' : 'Öppna meny'}
              className="relative grid size-11 place-items-center rounded-full border border-silver-400/25 text-silver-100 transition-colors duration-300 hover:border-silver-300/60 lg:hidden"
            >
              <span aria-hidden className="relative block h-3 w-5">
                <span
                  className={cn(
                    'absolute left-0 block h-px w-5 bg-current transition-all duration-400 ease-out-expo',
                    menuOpen ? 'top-1.5 rotate-45' : 'top-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 block h-px bg-current transition-all duration-400 ease-out-expo',
                    menuOpen ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3.5'
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        <ScrollProgress />
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu path={path} onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-silver-300 via-gold-300 to-sage-400"
    />
  )
}

function MobileMenu({ path, onClose }: { path: string; onClose: () => void }) {
  return (
    <motion.div
      id="mobilmeny"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 top-[calc(var(--notice-h)+var(--header-h))] z-40 bg-ink-900/97 backdrop-blur-2xl lg:hidden"
    >
      <div className="shell flex h-full flex-col justify-between overflow-y-auto py-10">
        <nav aria-label="Meny">
          <ul className="flex flex-col">
            {NAV.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-silver-400/12"
              >
                <a
                  href={item.href}
                  onClick={onClose}
                  aria-current={path === item.href ? 'page' : undefined}
                  className={cn(
                    'flex items-baseline justify-between gap-4 py-5 font-display text-3xl transition-colors duration-300 hover:text-white',
                    path === item.href ? 'text-white' : 'text-silver-100'
                  )}
                >
                  {item.label}
                  <span className="font-brand text-[0.62rem] tracking-[0.2em] text-silver-500">
                    {path === item.href ? '●' : String(i + 1).padStart(2, '0')}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-5"
        >
          <Button href="/kontakt/" size="lg" magnetic={false} className="w-full">
            Boka ett möte
            <ArrowRight />
          </Button>
          <div className="flex flex-col gap-1 font-brand text-[0.72rem] tracking-[0.1em] text-silver-400">
            <a href={`tel:${SITE.phoneHref}`} className="hover:text-white">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hover:text-white">
              {SITE.email}
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
