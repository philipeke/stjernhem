import { useEffect } from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

/**
 * Fryser sidans scroll — används när mobilmenyn är öppen.
 * Fungerar både med Lenis och när den är avstängd.
 */
export function setScrollLocked(locked: boolean) {
  if (locked) instance?.stop()
  else instance?.start()
  document.documentElement.classList.toggle('overflow-hidden', locked)
  document.body.classList.toggle('overflow-hidden', locked)
}

/**
 * Mjuk scroll för hela sidan, med ankarnavigering som landar under headern.
 * Hoppar över helt när användaren bett om reducerad rörelse — då ska
 * webbläsarens egen, direkta scroll gälla.
 */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    // Mäthook: scripts/measure-frames.mjs stänger av mjuk scroll för att
    // kunna jämföra bildrutetider med och utan den.
    if (typeof window !== 'undefined' && (window as { __utanLenis?: boolean }).__utanLenis) return

    const lenis = new Lenis({
      // Lerp i stället för duration: sidan följer hjulet direkt och glider
      // bara ut sista biten. En längre duration gav ett flytande efter-
      // släp som lätt uppfattas som att sidan hakar upp sig.
      lerp: 0.14,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      // Touch-scroll får bete sig som användaren förväntar sig på mobil.
      syncTouch: false,
    })
    instance = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    const headerOffset = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      const px = parseFloat(raw) * (raw.includes('rem') ? 16 : 1)
      return -(Number.isFinite(px) ? px : 72) - 16
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: headerOffset(), duration: 1.15 })
      history.replaceState(null, '', id)
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
      if (instance === lenis) instance = null
    }
  }, [enabled])
}
