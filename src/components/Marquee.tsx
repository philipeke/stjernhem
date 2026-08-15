import { useEffect, useRef } from 'react'
import { StarMark } from './Logo'
import { observePause } from '../lib/reveal'
import { cn } from '../lib/cn'

/**
 * Långsamt löpande band. Innehållet dubbleras så att slingan blir sömlös;
 * kopian döljs för skärmläsare.
 */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => observePause(ref.current), [])

  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
      aria-hidden={hidden || undefined}
    >
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex shrink-0 items-center gap-10 sm:gap-14">
          <span className="font-brand text-[0.7rem] font-medium uppercase tracking-[0.24em] whitespace-nowrap text-silver-400">
            {item}
          </span>
          <StarMark className="size-3 shrink-0 opacity-40" detail="simple" />
        </li>
      ))}
    </ul>
  )

  return (
    <div ref={ref} className={cn('fade-edges-x overflow-hidden', className)}>
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
