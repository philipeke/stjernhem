import { Counter } from '../components/Counter'
import { Stagger } from '../components/Reveal'
import { STATS } from '../data/content'

export function Stats() {
  return (
    <section aria-label="Nyckeltal" className="relative isolate bg-ink-900 py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(18,41,74,0.55),transparent)]"
      />
      <Stagger
        as="ul"
        className="shell grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STATS.map((stat) => (
          <Stagger.Item as="li" key={stat.label} className="relative">
            <p className="font-display text-[3.25rem] leading-none font-normal text-silver-sheen sm:text-[3.75rem]">
              <Counter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-4 font-brand text-[0.7rem] font-semibold tracking-[0.16em] text-gold-300/90 uppercase">
              {stat.label}
            </p>
            <p className="mt-2.5 max-w-[34ch] text-[0.9rem] leading-relaxed text-silver-500">
              {stat.sub}
            </p>
          </Stagger.Item>
        ))}
      </Stagger>
    </section>
  )
}
