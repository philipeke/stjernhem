import { motion, type Variants } from 'motion/react'
import { cn } from '../lib/cn'

const EASE = [0.16, 1, 0.3, 1] as const

const line: Variants = {
  hidden: {},
  show: (custom: number) => ({
    transition: { staggerChildren: 0.055, delayChildren: custom },
  }),
}

const word: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.95, ease: EASE } },
}

/**
 * Rubrik där varje ord stiger upp bakom en mask, ord för ord.
 * Hela texten ligger kvar som ett stycke för skärmläsare.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}) {
  const words = text.split(' ')

  return (
    <Tag className={cn('block', className)}>
      <motion.span
        aria-hidden
        className="block"
        variants={line}
        custom={delay}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block" variants={word}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
      <span className="sr-only">{text}</span>
    </Tag>
  )
}
