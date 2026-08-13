import { useEffect, useRef } from 'react'
import { cn } from '../lib/cn'
import { useMotionEnabled } from '../lib/useMediaQuery'

type Star = {
  x: number
  y: number
  r: number
  alpha: number
  twinkle: number
  phase: number
  drift: number
  sparkle: boolean
}

/**
 * Stjärnhimmel på canvas bakom hero. Stjärnorna blinkar långsamt och
 * driver uppåt i olika takt. Ett fåtal ritas som små fyruddiga gnistor.
 * Ritas en enda gång som stillbild vid reducerad rörelse.
 */
export function Starfield({ className, density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const motionOk = useMotionEnabled()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let stars: Star[] = []
    let w = 0
    let h = 0
    let dpr = 1
    let frame = 0
    let visible = true
    let start = performance.now()

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round(Math.min(220, (w * h) / 7200) * density)
      stars = Array.from({ length: count }, () => {
        const sparkle = Math.random() < 0.07
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: sparkle ? 1.1 + Math.random() * 0.9 : 0.35 + Math.random() * 1.05,
          alpha: 0.18 + Math.random() * 0.6,
          twinkle: 0.25 + Math.random() * 0.9,
          phase: Math.random() * Math.PI * 2,
          drift: 0.9 + Math.random() * 5,
          sparkle,
        }
      })
    }

    const drawSparkle = (s: Star, x: number, y: number, a: number) => {
      const len = s.r * 4.6
      ctx.save()
      ctx.globalAlpha = a * 0.75
      ctx.strokeStyle = '#dbe6f2'
      ctx.lineWidth = 0.6
      ctx.beginPath()
      ctx.moveTo(x - len, y)
      ctx.lineTo(x + len, y)
      ctx.moveTo(x, y - len)
      ctx.lineTo(x, y + len)
      ctx.stroke()
      ctx.restore()
    }

    const render = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        const a = motionOk
          ? s.alpha * (0.45 + 0.55 * Math.abs(Math.sin(t * s.twinkle + s.phase)))
          : s.alpha
        // Långsam drift uppåt, med wrap.
        const y = motionOk ? (((s.y - t * (s.drift / 6)) % h) + h) % h : s.y

        const glow = ctx.createRadialGradient(s.x, y, 0, s.x, y, s.r * 3.4)
        glow.addColorStop(0, `rgba(233,241,250,${a})`)
        glow.addColorStop(0.4, `rgba(190,206,224,${a * 0.34})`)
        glow.addColorStop(1, 'rgba(190,206,224,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(s.x, y, s.r * 3.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(247,251,255,${Math.min(1, a * 1.15)})`
        ctx.beginPath()
        ctx.arc(s.x, y, s.r * 0.6, 0, Math.PI * 2)
        ctx.fill()

        if (s.sparkle) drawSparkle(s, s.x, y, a)
      }

      if (motionOk && visible) frame = requestAnimationFrame(render)
    }

    build()
    start = performance.now()
    frame = requestAnimationFrame(render)

    const resize = new ResizeObserver(() => {
      build()
      if (!motionOk) render(performance.now())
    })
    resize.observe(canvas)

    // Pausa när hero rullat ur bild — ingen anledning att rita i bakgrunden.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && motionOk) {
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(render)
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame)
      else if (motionOk && visible) frame = requestAnimationFrame(render)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [motionOk, density])

  return <canvas ref={ref} aria-hidden className={cn('h-full w-full', className)} />
}
