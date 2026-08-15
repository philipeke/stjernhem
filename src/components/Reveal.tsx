import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { observeReveal } from '../lib/reveal'
import { cn } from '../lib/cn'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

/** Startförskjutningen per riktning, som CSS-variabler. */
const offset: Record<Direction, CSSProperties> = {
  up: { '--rv-y': '24px' } as CSSProperties,
  down: { '--rv-y': '-24px' } as CSSProperties,
  left: { '--rv-x': '28px' } as CSSProperties,
  right: { '--rv-x': '-28px' } as CSSProperties,
  none: {},
}

type Tag = 'div' | 'span' | 'li' | 'section' | 'header' | 'p' | 'article' | 'ul' | 'ol'

/**
 * Tonar in innehållet när det kommer in i vy. Övergången ligger i CSS
 * (se `[data-reveal]` i index.css) och körs av kompositorn — inga
 * bildruteberäkningar på huvudtråden.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  direction = 'up',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** Sekunder, som tidigare. */
  duration?: number
  direction?: Direction
  /** Behålls för bakåtkompatibilitet men styr numera inget. */
  amount?: number
  as?: Tag
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => observeReveal(ref.current), [])

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      className={className}
      style={
        {
          ...offset[direction],
          '--rv-delay': `${Math.round(delay * 1000)}ms`,
          '--rv-duration': `${Math.round(duration * 1000)}ms`,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  )
}

/**
 * Tonar in sina barn i tur och ordning. Fördröjningen räknas ut här och
 * skickas ned som en CSS-variabel, så att hela gruppen sköts av en enda
 * observation.
 */
export function Stagger({
  children,
  className,
  as: Tag = 'div',
  step = 60,
}: {
  children: ReactNode
  className?: string
  amount?: number
  as?: 'div' | 'ul' | 'ol'
  /** Millisekunder mellan barnen. */
  step?: number
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => observeReveal(ref.current), [])

  let index = 0
  const items = Children.map(children, (child) => {
    if (!isValidElement<{ style?: CSSProperties }>(child)) return child
    const delay = 40 + index * step
    index += 1
    return cloneElement(child, {
      style: { ...(child.props.style ?? {}), '--rv-delay': `${delay}ms` } as CSSProperties,
    })
  })

  return (
    <Tag ref={ref as never} data-reveal-group="" className={className}>
      {items}
    </Tag>
  )
}

Stagger.Item = function StaggerItem({
  children,
  className,
  style,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'li' | 'article'
}) {
  return (
    <Tag data-reveal-child="" className={cn(className)} style={style}>
      {children}
    </Tag>
  )
}
