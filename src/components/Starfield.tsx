import { useEffect, useRef } from 'react'
import { cn } from '../lib/cn'
import { useMotionEnabled } from '../lib/useMediaQuery'

type Star = {
  x: number
  y: number
  size: number
  alpha: number
  twinkle: number
  phase: number
  drift: number
  sparkle: boolean
}

/** Storleken på den förritade stjärnbrickan, i CSS-pixlar. */
const SPRITE = 48

/**
 * Ritar stjärnan en enda gång till en egen canvas. Att bygga en
 * radialgradient per stjärna och bildruta kostade mer än allt annat på
 * sidan tillsammans — nu kopieras en färdig bricka i stället.
 */
function makeSprite(dpr: number, sparkle: boolean): HTMLCanvasElement {
  const px = Math.ceil(SPRITE * dpr)
  const canvas = document.createElement('canvas')
  canvas.width = px
  canvas.height = px
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.scale(dpr, dpr)

  const c = SPRITE / 2
  const glow = ctx.createRadialGradient(c, c, 0, c, c, c)
  glow.addColorStop(0, 'rgba(247,251,255,1)')
  glow.addColorStop(0.16, 'rgba(233,241,250,0.72)')
  glow.addColorStop(0.42, 'rgba(190,206,224,0.2)')
  glow.addColorStop(1, 'rgba(190,206,224,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(c, c, c, 0, Math.PI * 2)
  ctx.fill()

  if (sparkle) {
    ctx.strokeStyle = 'rgba(219,230,242,0.55)'
    ctx.lineWidth = 0.7
    ctx.beginPath()
    ctx.moveTo(c - c * 0.86, c)
    ctx.lineTo(c + c * 0.86, c)
    ctx.moveTo(c, c - c * 0.86)
    ctx.lineTo(c, c + c * 0.86)
    ctx.stroke()
  }

  return canvas
}

/**
 * Stjärnhimmel på canvas bakom hero. Stjärnorna blinkar långsamt och driver
 * uppåt i olika takt. Ritas som en stillbild vid reducerad rörelse, och
 * pausas helt när hero rullat ur bild.
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
    let plain: HTMLCanvasElement
    let sparkly: HTMLCanvasElement
    let w = 0
    let h = 0
    let frame = 0
    let visible = true
    let start = performance.now()

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      // 1.5 räcker gott för mjuka ljuspunkter och halverar antalet pixlar
      // att fylla jämfört med 2 på en telefonskärm.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      plain = makeSprite(dpr, false)
      sparkly = makeSprite(dpr, true)

      const count = Math.round(Math.min(150, (w * h) / 11000) * density)
      stars = Array.from({ length: count }, () => {
        const sparkle = Math.random() < 0.07
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: (sparkle ? 9 : 3.5 + Math.random() * 6) + Math.random() * 3,
          alpha: 0.2 + Math.random() * 0.6,
          twinkle: 0.25 + Math.random() * 0.9,
          phase: Math.random() * Math.PI * 2,
          drift: 0.9 + Math.random() * 5,
          sparkle,
        }
      })
    }

    const render = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        const alpha = motionOk
          ? s.alpha * (0.45 + 0.55 * Math.abs(Math.sin(t * s.twinkle + s.phase)))
          : s.alpha
        const y = motionOk ? (((s.y - t * (s.drift / 6)) % h) + h) % h : s.y

        ctx.globalAlpha = alpha
        ctx.drawImage(
          s.sparkle ? sparkly : plain,
          s.x - s.size / 2,
          y - s.size / 2,
          s.size,
          s.size
        )
      }
      ctx.globalAlpha = 1

      if (motionOk && visible) frame = requestAnimationFrame(render)
    }

    build()
    start = performance.now()
    frame = requestAnimationFrame(render)

    let resizeTimer = 0
    const resize = new ResizeObserver(() => {
      // Adressfältet på mobil får canvasen att ändra höjd hela tiden —
      // bygg inte om stjärnorna för varje pixel.
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        build()
        if (!motionOk) render(performance.now())
      }, 180)
    })
    resize.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        cancelAnimationFrame(frame)
        if (visible && motionOk) frame = requestAnimationFrame(render)
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && motionOk && visible) frame = requestAnimationFrame(render)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      resize.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [motionOk, density])

  return <canvas ref={ref} aria-hidden className={cn('h-full w-full', className)} />
}
