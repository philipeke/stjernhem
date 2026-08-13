import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '../lib/cn'
import { useMotionEnabled } from '../lib/useMediaQuery'

type Variant = 'primary' | 'dark' | 'ghost' | 'quiet'

const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-brand text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 will-change-transform'

const sizes = {
  md: 'px-6 py-3.5',
  lg: 'px-8 py-4.5',
}

const variants: Record<Variant, string> = {
  primary: 'bg-silver-50 text-ink-900 hover:bg-white',
  // För ljusa sektioner — mörk knapp mot papper.
  dark: 'bg-ink-700 text-silver-50 hover:bg-ink-600',
  ghost:
    'border border-silver-400/35 text-silver-100 hover:border-gold-300/70 hover:text-white',
  quiet: 'text-silver-300 hover:text-white',
}

/**
 * Knapp som dras svagt mot muspekaren. Effekten stängs av vid
 * reducerad rörelse och rörs aldrig på touch.
 */
export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  magnetic = true,
  type = 'button',
  'aria-label': ariaLabel,
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  size?: keyof typeof sizes
  className?: string
  magnetic?: boolean
  type?: 'button' | 'submit'
  'aria-label'?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const motionOk = useMotionEnabled()
  const pull = magnetic && motionOk

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 240, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 240, damping: 18, mass: 0.4 })
  const labelX = useTransform(sx, (v) => v * 0.35)
  const labelY = useTransform(sy, (v) => v * 0.35)

  const onMove = (event: React.PointerEvent) => {
    if (!pull || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((event.clientX - (rect.left + rect.width / 2)) * 0.34)
    my.set((event.clientY - (rect.top + rect.height / 2)) * 0.42)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const content = (
    <>
      <motion.span
        className="relative z-10 flex items-center gap-2.5"
        style={pull ? { x: labelX, y: labelY } : undefined}
      >
        {children}
      </motion.span>
      {(variant === 'primary' || variant === 'dark') && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(120% 160% at 50% 120%, rgba(201,169,106,0.28), transparent 62%)',
          }}
        />
      )}
    </>
  )

  const shared = {
    className: cn(base, sizes[size], variants[variant], className),
    onPointerMove: onMove,
    onPointerLeave: reset,
    style: pull ? { x: sx, y: sy } : undefined,
  }

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        {...shared}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      {...shared}
    >
      {content}
    </motion.button>
  )
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={cn('size-4 transition-transform duration-400 group-hover:translate-x-1', className)}
    >
      <path
        d="M3.5 10h13M11.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
