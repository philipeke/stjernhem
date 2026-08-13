import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../lib/cn'

type Item = { readonly q: string; readonly a: string }

export function Accordion({ items, className }: { items: readonly Item[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className={cn('divide-y divide-silver-400/15 border-y border-silver-400/15', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `faq-panel-${i}`
        const buttonId = `faq-button-${i}`
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-white sm:py-7"
              >
                <span className="font-display text-[1.0625rem] leading-snug text-silver-100 sm:text-[1.25rem]">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'relative mt-1 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-400',
                    isOpen
                      ? 'border-gold-400/70 bg-gold-400/10'
                      : 'border-silver-400/30 group-hover:border-silver-300/60'
                  )}
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span
                    className={cn(
                      'absolute h-3 w-px bg-current transition-transform duration-400 ease-out-expo',
                      isOpen && 'scale-y-0'
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] pb-7 pr-10 text-[0.975rem] leading-relaxed text-silver-400">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
