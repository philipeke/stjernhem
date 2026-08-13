import { useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { cn } from '../lib/cn'
import { useMotionEnabled } from '../lib/useMediaQuery'

/**
 * Kort med ett mjukt ljus som följer muspekaren, och en nästan omärklig
 * lutning i 3D. Bara mus — touch lämnas i fred.
 */
export function SpotlightCard({
  children,
  className,
  tilt = true,
  glow = 'rgba(201,169,106,0.16)',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  tilt?: boolean
  glow?: string
  as?: 'div' | 'article' | 'li'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const motionOk = useMotionEnabled()

  const px = useMotionValue(50)
  const py = useMotionValue(50)
  const opacity = useMotionValue(0)

  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 })
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 })

  const background = useMotionTemplate`radial-gradient(560px circle at ${px}% ${py}%, ${glow}, transparent 62%)`

  const onMove = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    px.set(x * 100)
    py.set(y * 100)
    opacity.set(1)
    if (tilt && motionOk) {
      ry.set((x - 0.5) * 6)
      rx.set((0.5 - y) * 6)
    }
  }

  const onLeave = () => {
    opacity.set(0)
    rx.set(0)
    ry.set(0)
  }

  const Tag = motion[as]

  return (
    <Tag
      ref={ref as never}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={
        tilt && motionOk
          ? { rotateX: rx, rotateY: ry, transformPerspective: 1200, transformStyle: 'preserve-3d' }
          : undefined
      }
      className={cn('group relative isolate', className)}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] transition-opacity duration-500"
        style={{ background, opacity }}
      />
      {children}
    </Tag>
  )
}
