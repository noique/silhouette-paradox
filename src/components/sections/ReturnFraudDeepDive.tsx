'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RETURN_FRAUD_DATA } from '@/lib/data/mockData'
import SectionHeader from '@/components/ui/SectionHeader'
import DonutRing from '@/components/charts/DonutRing'

export default function ReturnFraudDeepDive() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const donutsRef = useRef<HTMLDivElement>(null)
  const costRef = useRef<HTMLDivElement>(null)

  const { returnDonut, fraudDonut, costPerReturn, costPerReturnTotal, costInsight } =
    RETURN_FRAUD_DATA

  useGSAP(
    () => {
      if (!headerRef.current || !donutsRef.current || !costRef.current) return

      // Header
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

      // Donut titles
      const titles = donutsRef.current.querySelectorAll('.donut-title')
      gsap.fromTo(
        titles,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: donutsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Cost breakdown bars
      const bars = costRef.current.querySelectorAll('.cost-bar')
      gsap.fromTo(
        bars,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: costRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Cost insight
      const insight = costRef.current.querySelector('.cost-insight')
      gsap.fromTo(
        insight,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: insight as Element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const maxCost = Math.max(...costPerReturn.map((c) => c.value))

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ background: 'var(--color-bg-warm)' }}
    >
      <SectionHeader
        ref={headerRef}
        label={RETURN_FRAUD_DATA.sectionLabel}
        title={RETURN_FRAUD_DATA.title}
        subtitle={RETURN_FRAUD_DATA.subtitle}
        labelColor="var(--color-burgundy)"
      />

      {/* Two donut charts */}
      <div
        ref={donutsRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
      >
        {/* Return donut */}
        <div>
          <h3
            className="donut-title text-lg font-medium mb-6"
            style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
          >
            {returnDonut.title}
          </h3>
          <DonutRing
            segments={returnDonut.segments}
            totalLabel={returnDonut.totalLabel}
            totalSublabel={returnDonut.totalSublabel}
          />
        </div>

        {/* Fraud donut */}
        <div>
          <h3
            className="donut-title text-lg font-medium mb-6"
            style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
          >
            {fraudDonut.title}
          </h3>
          <DonutRing
            segments={fraudDonut.segments}
            totalLabel={fraudDonut.totalLabel}
            totalSublabel={fraudDonut.totalSublabel}
          />
        </div>
      </div>

      {/* Cost per return breakdown */}
      <div
        ref={costRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-32 md:pb-48"
      >
        <h3
          className="text-base tracking-[0.2em] uppercase mb-8"
          style={{ color: 'var(--color-warm-gray-3)' }}
        >
          True Cost Per Return
        </h3>

        <div className="space-y-4 max-w-xl">
          {costPerReturn.map((item, i) => (
            <div key={i} className="cost-bar">
              <div className="flex justify-between mb-1">
                <span
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.label}
                </span>
                <span
                  className="text-sm tabular-nums font-medium"
                  style={{ color: 'var(--color-cream)' }}
                >
                  ${item.value.toFixed(2)}
                </span>
              </div>
              <div
                className="h-3 rounded-sm overflow-hidden"
                style={{ background: 'var(--color-bg-card)' }}
              >
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(item.value / maxCost) * 100}%`,
                    background: i === 0 ? 'var(--color-warm-gray-2)' : 'var(--color-burgundy)',
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="pt-4 border-t border-[var(--color-warm-gray-3)]/20 flex justify-between">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--color-cream)' }}
            >
              Total
            </span>
            <span
              className="text-lg tabular-nums font-semibold"
              style={{ color: 'var(--color-warning)' }}
            >
              ${costPerReturnTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Insight */}
        <p
          className="cost-insight mt-8 text-base md:text-lg italic max-w-lg"
          style={{ color: 'var(--color-warm-gray-1)', fontFamily: 'var(--font-serif)' }}
        >
          {costInsight}
        </p>
      </div>
    </section>
  )
}
