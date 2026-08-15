/**
 * En enda delad IntersectionObserver för samtliga intoningar på sidan.
 *
 * Tidigare drev animationsbiblioteket ungefär 150 intoningar var för sig på
 * huvudtråden, vilket åt upp bildrutebudgeten under scroll. Nu sätter vi bara
 * ett attribut när elementet kommer in i vy och låter CSS sköta övergången —
 * opacity och transform hanteras då av kompositorn i stället.
 */

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        // Intoningen sker en gång; sedan slutar vi bevaka elementet.
        entry.target.setAttribute(
          entry.target.hasAttribute('data-reveal-group') ? 'data-reveal-group' : 'data-reveal',
          'in'
        )
        observer?.unobserve(entry.target)
      }
    },
    // Utlös strax innan elementet är helt framme, så rörelsen hinner kännas
    // som en del av scrollen i stället för som något som händer efteråt.
    { rootMargin: '0px 0px -10% 0px', threshold: 0.01 }
  )
  return observer
}

let pauseObserver: IntersectionObserver | null = null

/**
 * Pausar en löpande CSS-animation när elementet inte syns. Stjärnhimlens
 * band och de drivande ljusfälten ligger i hero men fortsätter annars att
 * animeras genom hela sidan, och tar kompositortid som scrollen behöver.
 */
export function observePause(element: Element | null): () => void {
  if (!element || typeof IntersectionObserver === 'undefined') return () => {}

  if (!pauseObserver) {
    pauseObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.removeAttribute('data-paused')
          else entry.target.setAttribute('data-paused', '')
        }
      },
      { rootMargin: '120px' }
    )
  }

  pauseObserver.observe(element)
  return () => pauseObserver?.unobserve(element)
}

/** Bevaka ett element. Returnerar en avregistrering för useEffect. */
export function observeReveal(element: Element | null): () => void {
  if (!element) return () => {}

  // Har användaren bett om reducerad rörelse visar vi allt direkt.
  if (
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    element.setAttribute(
      element.hasAttribute('data-reveal-group') ? 'data-reveal-group' : 'data-reveal',
      'in'
    )
    return () => {}
  }

  const io = getObserver()
  if (!io) {
    element.setAttribute(
      element.hasAttribute('data-reveal-group') ? 'data-reveal-group' : 'data-reveal',
      'in'
    )
    return () => {}
  }

  io.observe(element)
  return () => io.unobserve(element)
}
