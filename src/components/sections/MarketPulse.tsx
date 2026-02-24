'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MARKET_PULSE_DATA } from '@/lib/data/mockData'
import SectionHeader from '@/components/ui/SectionHeader'
import CountUp from '@/components/ui/CountUp'

export default function MarketPulse() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const insightRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!headerRef.current || !barsRef.current || !insightRef.current) return

      // Header fade in
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Metric rows stagger in
      const rows = barsRef.current.querySelectorAll('.metric-row')
      gsap.fromTo(
        rows,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: barsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Bar fills animate width
      const fills = barsRef.current.querySelectorAll('.bar-fill')
      gsap.fromTo(
        fills,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.0,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: barsRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Growth tags fade in after bars
      const tags = barsRef.current.querySelectorAll('.growth-tag')
      gsap.fromTo(
        tags,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: barsRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Insight text
      gsap.fromTo(
        insightRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: insightRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const { metrics, crossingInsight } = MARKET_PULSE_DATA

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ background: 'var(--color-bg-warm)' }}
    >
      <SectionHeader
        ref={headerRef}
        label={MARKET_PULSE_DATA.sectionLabel}
        title={MARKET_PULSE_DATA.title}
        subtitle={MARKET_PULSE_DATA.subtitle}
      />

      {/* Metric bars */}
      <div
        ref={barsRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-12 space-y-8"
      >
        {metrics.map((metric, i) => (
          <div key={i} className="metric-row">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-2xl md:text-3xl font-light tabular-nums"
                  style={{ color: 'var(--color-cream)' }}
                >
                  {metric.prefix}
                  <CountUp end={metric.value} decimals={metric.value % 1 !== 0 ? 2 : 0} />
                  {metric.suffix}
                </span>
                <span
                  className="text-sm md:text-base"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {metric.label}
                </span>
              </div>
              <div className="growth-tag flex items-center gap-2">
                <span
                  className="text-sm font-medium tabular-nums"
                  style={{
                    color: metric.growth.startsWith('-')
                      ? 'var(--color-warm-gray-3)'
                      : 'var(--color-warning)',
                  }}
                >
                  {metric.growth}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-warm-gray-3)' }}
                >
                  {metric.context}
                </span>
              </div>
            </div>
            {/* Bar track + fill */}
            <div
              className="h-8 md:h-10 rounded-sm overflow-hidden"
              style={{ background: 'var(--color-bg-card)' }}
            >
              <div
                className="bar-fill h-full rounded-sm origin-left"
                style={{
                  width: `${metric.barWidth}%`,
                  background: metric.color,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Crossing insight pull-quote */}
      <div
        ref={insightRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pt-8 pb-32 md:pb-48"
      >
        <div
          className="border-l-2 pl-6 md:pl-8 max-w-2xl"
          style={{ borderColor: 'var(--color-burgundy)' }}
        >
          <p
            className="text-base md:text-lg italic leading-relaxed"
            style={{ color: 'var(--color-warm-gray-1)', fontFamily: 'var(--font-serif)' }}
          >
            {crossingInsight}
          </p>
        </div>
      </div>
    </section>
  )
}
