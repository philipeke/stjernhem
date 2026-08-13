import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { StarMark } from './Logo'
import { cn } from '../lib/cn'

type Tone = 'dark' | 'darker' | 'light'

const toneClass: Record<Tone, string> = {
  dark: 'bg-ink-800 text-silver-200',
  darker: 'bg-ink-900 text-silver-200',
  light: 'bg-paper text-ink-700',
}

export function Section({
  id,
  tone = 'darker',
  className,
  children,
  bleed = false,
}: {
  id?: string
  tone?: Tone
  className?: string
  children: ReactNode
  bleed?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative isolate overflow-hidden',
        toneClass[tone],
        bleed ? '' : 'py-24 sm:py-32 lg:py-40',
        className
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  heading,
  lead,
  tone = 'dark',
  align = 'left',
  className,
  headingClassName,
  children,
}: {
  eyebrow?: string
  heading: ReactNode
  lead?: ReactNode
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
  className?: string
  headingClassName?: string
  children?: ReactNode
}) {
  const light = tone === 'light'
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className
      )}
    >
      {eyebrow && (
        <Reveal direction="none" duration={0.7}>
          <span
            className={cn(
              'inline-flex items-center gap-3',
              light ? 'text-sage-600' : 'text-silver-400'
            )}
          >
            <StarMark className="size-3 opacity-80" detail="simple" />
            <span className="eyebrow">{eyebrow}</span>
          </span>
        </Reveal>
      )}

      <Reveal delay={0.06}>
        <h2
          className={cn(
            'mt-5 display-2 max-w-[20ch] font-normal',
            light ? 'text-ink-700' : 'text-silver-50',
            align === 'center' && 'mx-auto',
            headingClassName
          )}
        >
          {heading}
        </h2>
      </Reveal>

      {lead && (
        <Reveal delay={0.14}>
          <div
            className={cn(
              'lead mt-7 max-w-[58ch]',
              light ? 'text-ink-600/80' : 'text-silver-400',
              align === 'center' && 'mx-auto'
            )}
          >
            {lead}
          </div>
        </Reveal>
      )}

      {children}
    </div>
  )
}

/** Mjuk övergång mellan en ljus och en mörk sektion. */
export function ToneEdge({
  from,
  className,
}: {
  from: 'dark-to-light' | 'light-to-dark'
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-x-0 h-24', className)}
      style={{
        background:
          from === 'dark-to-light'
            ? 'linear-gradient(180deg, rgba(6,13,24,0.5), transparent)'
            : 'linear-gradient(0deg, rgba(6,13,24,0.5), transparent)',
      }}
    />
  )
}
