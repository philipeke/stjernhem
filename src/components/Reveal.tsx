import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { cn } from '../lib/cn'

const EASE = [0.16, 1, 0.3, 1] as const

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 26 },
  down: { y: -26 },
  left: { x: 30 },
  right: { x: -30 },
  none: {},
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  amount = 0.3,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Direction
  amount?: number
  as?: 'div' | 'span' | 'li' | 'section' | 'header' | 'p'
}) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/** Barn animeras in i tur och ordning. Använd med <Stagger.Item>. */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

export function Stagger({
  children,
  className,
  amount = 0.18,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  amount?: number
  as?: 'div' | 'ul' | 'ol'
}) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  )
}

Stagger.Item = function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const Tag = motion[as]
  return (
    <Tag className={cn(className)} variants={itemVariants}>
      {children}
    </Tag>
  )
}
