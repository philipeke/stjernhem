import { Section } from '../components/Section'
import { Reveal, Stagger } from '../components/Reveal'
import { StarMark } from '../components/Logo'
import { WHY } from '../data/content'

export function Why() {
  return (
    <Section tone="darker">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(80% 55% at 12% 0%, rgba(26,58,99,0.38), transparent 60%)',
        }}
      />

      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--notice-h)+var(--header-h)+3rem)]">
            <Reveal direction="none">
              <span className="inline-flex items-center gap-3 text-silver-400">
                <StarMark className="size-3 opacity-80" detail="simple" />
                <span className="eyebrow">{WHY.eyebrow}</span>
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 display-2 max-w-[13ch] font-normal text-silver-50">
                {WHY.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-9 hidden lg:block">
                <StarMark className="size-28 opacity-25" animate />
              </div>
            </Reveal>
          </div>
        </div>

        <Stagger
          as="ul"
          className="flex flex-col divide-y divide-silver-400/12 border-t border-silver-400/12 lg:col-span-8"
        >
          {WHY.items.map((item, i) => (
            <Stagger.Item as="li" key={item.title} className="group py-8 sm:py-9">
              <div className="flex gap-6 sm:gap-9">
                <span className="mt-1 font-brand text-[0.68rem] font-semibold tracking-[0.2em] text-gold-300/70 tabular-nums transition-colors duration-500 group-hover:text-gold-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-[1.375rem] leading-snug font-normal text-silver-50 transition-colors duration-500 group-hover:text-white sm:text-[1.625rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3.5 max-w-[58ch] text-[0.975rem] leading-relaxed text-silver-400">
                    {item.body}
                  </p>
                </div>
              </div>
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
