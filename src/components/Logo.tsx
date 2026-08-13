import { useId } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/cn'

/* ------------------------------------------------------------------ *
 * Oktagrammet — en åttuddig kompassrosstjärna i stilrent linjemanér.
 * Fyra långa uddar (väderstrecken) och fyra kortare (däremellan).
 * I mitten en öppen takform: "hem" i Stjernhem.
 * ------------------------------------------------------------------ */

const C = 60 // centrum i viewBox 0 0 120 120
const R_CARDINAL = 56
const R_DIAGONAL = 39
const R_INNER = 12.5

function starPath(): string {
  const points: string[] = []
  for (let i = 0; i < 16; i++) {
    const angle = ((i * 22.5 - 90) * Math.PI) / 180
    const r = i % 2 === 1 ? R_INNER : i % 4 === 0 ? R_CARDINAL : R_DIAGONAL
    const x = C + r * Math.cos(angle)
    const y = C + r * Math.sin(angle)
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return `${points.join(' ')} Z`
}

/** Fasettlinjer från centrum ut till de fyra långa uddarna. */
function facetPaths(): string[] {
  return [0, 4, 8, 12].map((i) => {
    const angle = ((i * 22.5 - 90) * Math.PI) / 180
    const x = C + R_CARDINAL * 0.86 * Math.cos(angle)
    const y = C + R_CARDINAL * 0.86 * Math.sin(angle)
    return `M${C} ${C} L${x.toFixed(2)} ${y.toFixed(2)}`
  })
}

const STAR = starPath()
const FACETS = facetPaths()

/** Taket på ett skyddande hem — läses också som en öppen, stöttande hand. */
const ROOF = 'M52.4 61.6 L60 53.8 L67.6 61.6'
const HEARTH = 'M55.4 67.4 H64.6'

export type MarkProps = {
  className?: string
  /** 'full' ritar fasetter och hem-symbol, 'simple' bara stjärnan. */
  detail?: 'full' | 'simple'
  /** Ritar upp stjärnan slag för slag när den kommer in i vy. */
  animate?: boolean
  title?: string
}

export function StarMark({ className, detail = 'full', animate = false, title }: MarkProps) {
  const uid = useId().replace(/:/g, '')
  const silver = `silver-${uid}`
  const gold = `gold-${uid}`
  const glow = `glow-${uid}`

  const draw = animate
    ? {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, amount: 0.4 },
      }
    : {}

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={cn('block', className)}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={silver} x1="6%" y1="0%" x2="94%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="26%" stopColor="#cfdae7" />
          <stop offset="52%" stopColor="#8fa2b8" />
          <stop offset="74%" stopColor="#e8eff7" />
          <stop offset="100%" stopColor="#a5b5c8" />
        </linearGradient>
        <linearGradient id={gold} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ecdcb8" />
          <stop offset="55%" stopColor="#c9a96a" />
          <stop offset="100%" stopColor="#ad8c4e" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8f0f9" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#93a4b8" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#93a4b8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {detail === 'full' && <circle cx={C} cy={C} r="52" fill={`url(#${glow})`} />}

      {/* Yttre, tunn ring — sluter kompositionen. */}
      <motion.circle
        cx={C}
        cy={C}
        r="57.2"
        stroke={`url(#${silver})`}
        strokeOpacity={detail === 'full' ? 0.4 : 0}
        strokeWidth="0.9"
        {...(animate ? { ...draw, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } } : {})}
      />

      {/* Stjärnan. */}
      <motion.path
        d={STAR}
        stroke={`url(#${silver})`}
        strokeWidth="2.1"
        strokeLinejoin="round"
        strokeLinecap="round"
        {...(animate
          ? { ...draw, transition: { duration: 1.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 } }
          : {})}
      />

      {detail === 'full' && (
        <>
          {FACETS.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              stroke={`url(#${silver})`}
              strokeOpacity="0.34"
              strokeWidth="0.9"
              strokeLinecap="round"
              {...(animate
                ? {
                    ...draw,
                    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.07 },
                  }
                : {})}
            />
          ))}

          {/* Hem-symbolen. */}
          <motion.path
            d={ROOF}
            stroke={`url(#${gold})`}
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...(animate
              ? { ...draw, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.15 } }
              : {})}
          />
          <motion.path
            d={HEARTH}
            stroke={`url(#${gold})`}
            strokeWidth="2.3"
            strokeLinecap="round"
            {...(animate
              ? { ...draw, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1.4 } }
              : {})}
          />
        </>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Ordmärket
 * ------------------------------------------------------------------ */

export function Wordmark({
  className,
  size = 'md',
  sheen = false,
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  sheen?: boolean
}) {
  const scale = {
    sm: { name: 'text-[0.9rem] tracking-[0.3em]', sub: 'text-[0.5rem] tracking-[0.3em]' },
    md: { name: 'text-[1.15rem] tracking-[0.32em]', sub: 'text-[0.5625rem] tracking-[0.34em]' },
    lg: { name: 'text-[1.6rem] sm:text-[2rem] tracking-[0.34em]', sub: 'text-[0.6875rem] tracking-[0.4em]' },
  }[size]

  return (
    <span className={cn('flex flex-col font-brand leading-none', className)}>
      <span
        className={cn(
          'font-semibold uppercase',
          scale.name,
          sheen ? 'text-silver-sheen' : 'text-silver-50'
        )}
      >
        Stjernhem
      </span>
      <span
        className={cn(
          'mt-[0.45em] font-normal uppercase text-silver-400/85',
          scale.sub
        )}
      >
        Rehabilitering &amp; Hälsa
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Låsningar: liggande (meny, sidfot) och stående (hero, trycksaker)
 * ------------------------------------------------------------------ */

export function LogoLockup({
  className,
  orientation = 'horizontal',
  size = 'md',
  animate = false,
  sheen = false,
}: {
  className?: string
  orientation?: 'horizontal' | 'stacked'
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  sheen?: boolean
}) {
  const markSize = { sm: 'size-8', md: 'size-10', lg: 'size-20 sm:size-24' }[size]

  if (orientation === 'stacked') {
    return (
      <span className={cn('flex flex-col items-center gap-5', className)}>
        <StarMark className={markSize} animate={animate} />
        <Wordmark size={size} sheen={sheen} className="items-center text-center" />
      </span>
    )
  }

  return (
    <span className={cn('flex items-center gap-3', className)}>
      <StarMark className={cn(markSize, 'shrink-0')} animate={animate} />
      <Wordmark size={size} sheen={sheen} />
    </span>
  )
}
