'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RETURN_FRAUD_DATA } from '@/lib/data/mockData'
import SectionHeader from '@/components/ui/SectionHeader'
import ProportionBar from '@/components/charts/ProportionBar'

export default function ReturnFraudDeepDive() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const costRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)

  const {
    returnDonut,
    fraudDonut,
    costPerReturn,
    costPerReturnTotal,
    costComparison,
  } = RETURN_FRAUD_DATA

  useGSAP(
    () => {
      if (!headerRef.current || !barsRef.current || !costRef.current) return

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

      // Proportion bars stagger
      const barBlocks = barsRef.current.querySelectorAll('.proportion-block')
      gsap.fromTo(
        barBlocks,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: barsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Cost breakdown stagger
      const costItems = costRef.current.querySelectorAll('.cost-item')
      gsap.fromTo(
        costItems,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: costRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Comparison callout
      if (comparisonRef.current) {
        gsap.fromTo(
          comparisonRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: comparisonRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    },
    { scope: sectionRef }
  )

  const maxCost = Math.max(...costPerReturn.map((c) => c.value))

  return (
    <section
      id="act-4-return"
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

      {/* Proportion bars */}
      <div
        ref={barsRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-16 space-y-14"
      >
        <div className="proportion-block">
          <ProportionBar
            title={returnDonut.title}
            totalLabel={returnDonut.totalLabel}
            totalSublabel={returnDonut.totalSublabel}
            segments={returnDonut.segments}
          />
        </div>

        <div className="proportion-block">
          <ProportionBar
            title={fraudDonut.title}
            totalLabel={fraudDonut.totalLabel}
            totalSublabel={fraudDonut.totalSublabel}
            segments={fraudDonut.segments}
          />
        </div>
      </div>

      {/* Cost breakdown — waterfall style */}
      <div
        ref={costRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-12"
      >
        <h3
          className="text-base tracking-[0.2em] uppercase mb-8"
          style={{ color: 'var(--color-warm-gray-3)' }}
        >
          True Cost Per Return
        </h3>

        <div className="space-y-3 max-w-2xl">
          {costPerReturn.map((item, i) => (
            <div key={item.label} className="cost-item">
              <div className="flex justify-between mb-1.5">
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
                className="h-6 rounded-sm overflow-hidden"
                style={{ background: 'var(--color-bg-card)' }}
              >
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(item.value / maxCost) * 100}%`,
                    background:
                      i === 0
                        ? 'var(--color-warm-gray-2)'
                        : 'var(--color-burgundy)',
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Total line */}
          <div className="cost-item pt-4 border-t border-[var(--color-warm-gray-3)]/20">
            <div className="flex justify-between items-baseline">
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-cream)' }}
              >
                Total Cost Per Return
              </span>
              <span
                className="text-2xl tabular-nums font-semibold"
                style={{ color: 'var(--color-warning)' }}
              >
                ${costPerReturnTotal.toFixed(2)}
              </span>
            </div>
            <p
              className="text-xs mt-1 tabular-nums"
              style={{ color: 'var(--color-warning)', opacity: 0.7 }}
            >
              = {costComparison.multiplier} of original order value
            </p>
          </div>
        </div>
      </div>

      {/* Comparison callout — the devastating math */}
      <div
        ref={comparisonRef}
        className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pb-32 md:pb-48"
      >
        <div
          className="max-w-2xl p-8 md:p-12 rounded-sm border"
          style={{
            background: 'var(--color-bg-card)',
            borderColor: 'var(--color-burgundy)',
            borderWidth: '1px',
            borderLeftWidth: '3px',
          }}
        >
          {/* Visual comparison */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div
                className="text-3xl md:text-4xl font-light tabular-nums"
                style={{ color: 'var(--color-cream)' }}
              >
                ${costComparison.orderValue}
              </div>
              <p
                className="text-[10px] tracking-[0.15em] uppercase mt-1"
                style={{ color: 'var(--color-warm-gray-3)' }}
              >
                Customer Paid
              </p>
            </div>

            <div
              className="text-lg"
              style={{ color: 'var(--color-warm-gray-3)' }}
            >
              vs
            </div>

            <div className="text-center">
              <div
                className="text-3xl md:text-4xl font-light tabular-nums"
                style={{ color: 'var(--color-warning)' }}
              >
                ${costComparison.returnCost}
              </div>
              <p
                className="text-[10px] tracking-[0.15em] uppercase mt-1"
                style={{ color: 'var(--color-warm-gray-3)' }}
              >
                Return Cost
              </p>
            </div>

            <div className="text-center ml-auto">
              <div
                className="text-3xl md:text-4xl font-bold tabular-nums"
                style={{ color: 'var(--color-burgundy)' }}
              >
                -${costComparison.overage}
              </div>
              <p
                className="text-[10px] tracking-[0.15em] uppercase mt-1"
                style={{ color: 'var(--color-burgundy)' }}
              >
                Net Loss
              </p>
            </div>
          </div>

          {/* Devastating framing */}
          <p
            className="text-base md:text-lg italic leading-relaxed"
            style={{ color: 'var(--color-warm-gray-1)', fontFamily: 'var(--font-serif)' }}
          >
            {costComparison.framing}
          </p>
        </div>
      </div>
    </section>
  )
}
