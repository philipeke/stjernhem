import { motion } from 'motion/react'
import { SITE } from '../data/content'

/**
 * Smal list högst upp som säger att sidan fortfarande byggs.
 * Ligger fast och skymmer aldrig innehållet — headern startar under den.
 */
export function ConstructionBar() {
  return (
    <motion.div
      role="status"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-60 h-[var(--notice-h)] border-b border-gold-400/25 bg-[#0d1526]/95 backdrop-blur-xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-shimmer opacity-70 motion-reduce:animate-none"
        style={{
          backgroundImage:
            'linear-gradient(100deg, transparent 38%, rgba(201,169,106,0.13) 50%, transparent 62%)',
          backgroundSize: '220% 100%',
        }}
      />
      <div className="shell relative flex h-full items-center justify-center gap-3 text-center">
        <span aria-hidden className="relative flex size-1.5 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-300 opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-1.5 rounded-full bg-gold-300" />
        </span>
        <p className="font-brand text-[0.6rem] font-semibold tracking-[0.2em] text-gold-200 uppercase sm:text-[0.68rem] sm:tracking-[0.24em]">
          Webbplatsen är under uppbyggnad
          <span className="mx-2 hidden text-gold-400/50 sm:inline">·</span>
          <span className="hidden font-normal tracking-[0.16em] text-silver-300/85 normal-case sm:inline">
            Innehållet kompletteras löpande — kontakta oss gärna redan nu
          </span>
        </p>
      </div>
    </motion.div>
  )
}

/** Diskret märke som kan ligga i hero. */
export function ConstructionBadge({ className }: { className?: string }) {
  if (!SITE.underConstruction) return null
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border border-gold-400/30 bg-gold-400/[0.07] px-4 py-1.5 font-brand text-[0.6rem] font-semibold tracking-[0.2em] text-gold-200 uppercase backdrop-blur-sm ${className ?? ''}`}
    >
      <span aria-hidden className="size-1 rounded-full bg-gold-300" />
      Under uppbyggnad
    </span>
  )
}
