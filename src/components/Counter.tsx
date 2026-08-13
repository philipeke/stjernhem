import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import { useMotionEnabled } from '../lib/useMediaQuery'

/** Räknar upp till målvärdet första gången talet syns. */
export function Counter({
  to,
  prefix = '',
  suffix = '',
  duration = 1.5,
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const motionOk = useMotionEnabled()
  const [value, setValue] = useState(motionOk ? 0 : to)

  useEffect(() => {
    if (!inView || !motionOk) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, motionOk, to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
