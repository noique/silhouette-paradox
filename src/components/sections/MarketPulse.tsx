'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MARKET_PULSE_DATA } from '@/lib/data/mockData'
import SectionHeader from '@/components/ui/SectionHeader'
import CountUp from '@/components/ui/CountUp'
import TrendCrossover from '@/components/charts/TrendCrossover'

export default function MarketPulse() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const [chartRevealed, setChartRevealed] = useState(false)

  useGSAP(
    () => {
      if (!headerRef.current || !chartRef.current || !metricsRef.current) return

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

      // Chart reveal trigger
      ScrollTrigger.create({
        trigger: chartRef.current,
        start: 'top 70%',
        onEnter: () => setChartRevealed(true),
        onLeaveBack: () => setChartRevealed(false),
      })

      // Metric strip stagger
      const strips = metricsRef.current.querySelectorAll('.metric-strip')
      gsap.fromTo(
        strips,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: metricsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const { metrics, trendData } = MARKET_PULSE_DATA

  return (
    <section
      id="act-1-market"
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

      {/* Trend crossover chart — full width */}
      <div
        ref={chartRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-16"
      >
        <TrendCrossover
          years={trendData.years}
          cac={trendData.cac}
          aov={trendData.aov}
          crossoverNote={trendData.crossoverNote}
          revealed={chartRevealed}
        />
      </div>

      {/* 4-column metric strip */}
      <div
        ref={metricsRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-32 md:pb-48"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              className="metric-strip border-t pt-5"
              style={{ borderColor: `${metric.color}30` }}
            >
              {/* Value */}
              <div
                className="text-2xl md:text-3xl font-light tabular-nums mb-1"
                style={{ color: 'var(--color-cream)' }}
              >
                {metric.prefix}
                <CountUp end={metric.value} decimals={metric.value % 1 !== 0 ? 2 : 0} />
                {metric.suffix}
              </div>

              {/* Label */}
              <p
                className="text-sm mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {metric.label}
              </p>

              {/* Growth tag */}
              <div className="flex items-center gap-2">
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
                  className="text-[10px] tracking-wider uppercase"
                  style={{ color: 'var(--color-warm-gray-3)' }}
                >
                  {metric.context}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
