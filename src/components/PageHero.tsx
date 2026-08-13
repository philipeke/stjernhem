import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { StarMark } from './Logo'
import { Starfield } from './Starfield'
import { Img } from './Img'
import type { ImageName } from '../data/images.generated'
import { cn } from '../lib/cn'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Kompakt sidhuvud för undersidorna. Samma stjärnhimmel och djupblå ton som
 * startsidan, men i en lugnare höjd så att innehållet kommer fram direkt.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  children,
}: {
  eyebrow: string
  title: string
  lead?: string
  image?: ImageName
  children?: ReactNode
}) {
  return (
    <section className="grain relative isolate overflow-hidden bg-ink pt-[calc(var(--notice-h)+var(--header-h)+4.5rem)] pb-20 sm:pb-24">
      {image && (
        <div aria-hidden className="absolute inset-0 -z-30">
          <Img
            name={image}
            alt=""
            priority
            sizes="100vw"
            className="h-full w-full"
            imgClassName="opacity-[0.22] saturate-[0.35]"
            objectPosition="center 45%"
          />
        </div>
      )}

      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,9,15,0.9) 0%, rgba(9,20,38,0.72) 55%, rgba(6,13,24,0.98) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ background: 'radial-gradient(90% 70% at 50% 0%, rgba(18,41,74,0.55), transparent 62%)' }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
        <Starfield density={0.6} />
      </div>

      <div className="shell relative">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 text-silver-400"
        >
          <StarMark className="size-3.5 opacity-80" detail="simple" />
          <span className="eyebrow">{eyebrow}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}
          className="mt-6 display-2 max-w-[17ch] font-normal text-silver-sheen"
        >
          {title}
        </motion.h1>

        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.16 }}
            className="lead mt-7 max-w-[58ch] text-silver-300/90"
          >
            {lead}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.24 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}

/** Brödsmulor — visar var på sajten man befinner sig. */
export function Breadcrumbs({ current, className }: { current: string; className?: string }) {
  return (
    <nav aria-label="Brödsmulor" className={cn('font-brand text-[0.62rem] tracking-[0.16em] uppercase', className)}>
      <ol className="flex flex-wrap items-center gap-2 text-silver-500">
        <li>
          <a href="/" className="transition-colors duration-300 hover:text-silver-100">
            Start
          </a>
        </li>
        <li aria-hidden className="text-silver-600">
          /
        </li>
        <li className="text-silver-300" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  )
}
