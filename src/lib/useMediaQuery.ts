import { useSyncExternalStore } from 'react'

function subscribe(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }
}

export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => serverValue
  )
}

/** true när användaren inte har bett om reducerad rörelse. */
export function useMotionEnabled(): boolean {
  return !useMediaQuery('(prefers-reduced-motion: reduce)')
}
