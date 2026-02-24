'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EXECUTIVE_STATS } from '@/lib/data/mockData'
import { useIsMobile } from '@/hooks/useMediaQuery'

/**
 * Benchmark position data for the horizontal reference bar.
 * Positions are % of the bar width. "You" always sits at 100%.
 */
const BENCHMARK_SCALES = [
  { healthyVal: 400, industryVal: 743, maxVal: 849.9 },
  { healthyVal: 60, industryVal: 85, maxVal: 120 },
  { healthyVal: 40, industryVal: 61, maxVal: 72 },
  { healthyVal: 2.5, industryVal: 3.75, maxVal: 4.61 },
]

/** Accent colors per card — maps to severity gradient */
const CARD_ACCENTS = [
  'var(--color-peach)',
  'var(--color-gold)',
  'var(--color-warning)',
  'var(--color-burgundy)',
]

export default function ExecutiveSummary() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndexRef = useRef(0)
  const isMobile = useIsMobile()

  const cardCount = EXECUTIVE_STATS.length

  useGSAP(
    () => {
      if (!headerRef.current || !pinRef.current || !cardsContainerRef.current) return

      // Header fade
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

      // Get all card elements
      const cards = cardsContainerRef.current.querySelectorAll('.exec-card')

      // Set initial state: all cards invisible
      gsap.set(cards, { opacity: 0, y: 60 })

      // Build GSAP timeline for card transitions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: isMobile ? '+=300%' : '+=400%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          onUpdate: (self) => {
            const newIndex = Math.min(
              cardCount - 1,
              Math.floor(self.progress * cardCount)
            )
            if (newIndex !== lastIndexRef.current) {
              lastIndexRef.current = newIndex
              setActiveIndex(newIndex)
            }
          },
        },
      })

      // For each card: enter → hold → exit (except last)
      const segmentDuration = 1 / cardCount
      cards.forEach((card, i) => {
        const enterAt = i * segmentDuration

        // Enter
        tl.to(card, { opacity: 1, y: 0, duration: segmentDuration * 0.2, ease: 'power3.out' }, enterAt)

        // Exit (except last card)
        if (i < cardCount - 1) {
          const holdEnd = enterAt + segmentDuration * 0.75
          tl.to(
            card,
            { opacity: 0, y: -40, duration: segmentDuration * 0.15, ease: 'power2.in' },
            holdEnd
          )
        }
      })
    },
    { scope: sectionRef, dependencies: [isMobile] }
  )

  return (
    <section
      id="act-2-exec"
      ref={sectionRef}
      className="relative w-full"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Section header */}
      <div ref={headerRef} className="mx-auto max-w-[var(--max-content)] px-10 md:px-20 pt-40 md:pt-56 pb-16">
        <p
          className="text-[11px] tracking-[0.4em] uppercase mb-4"
          style={{ color: 'var(--color-peach)' }}
        >
          Executive Overview
        </p>
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
        >
          The Numbers They Don&apos;t Show You
        </h2>
        <p
          className="mt-5 text-base md:text-lg max-w-2xl leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Four metrics that expose the structural fragility beneath DTC apparel&apos;s growth narrative.
        </p>
      </div>

      {/* Pinned full-viewport card reveal */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        {/* Cards stack */}
        <div
          ref={cardsContainerRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          {EXECUTIVE_STATS.map((stat, i) => {
            const scale = BENCHMARK_SCALES[i]
            const healthyPct = (scale.healthyVal / scale.maxVal) * 100
            const industryPct = (scale.industryVal / scale.maxVal) * 100
            const accent = CARD_ACCENTS[i]

            return (
              <div
                key={stat.label}
                className="exec-card absolute inset-0 flex items-center"
              >
                <div className="w-full mx-auto max-w-[1200px] px-6 md:px-16 lg:px-24">
                  {/* Giant stat value */}
                  <div
                    className="tabular-nums text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter mb-2"
                    style={{ color: 'var(--color-cream)' }}
                  >
                    <span style={{ color: 'var(--color-warm-gray-3)' }}>{stat.prefix}</span>
                    {stat.value}
                    <span style={{ color: accent }}>{stat.suffix}</span>
                  </div>

                  {/* Label + sublabel */}
                  <h3
                    className="text-xl md:text-2xl font-medium tracking-tight mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {stat.label}
                  </h3>
                  <p
                    className="text-sm mb-10 md:mb-14"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {stat.sublabel}
                  </p>

                  {/* Benchmark reference bar */}
                  <div className="max-w-xl mb-10 md:mb-14">
                    {/* Bar track */}
                    <div className="relative h-[6px] rounded-full overflow-hidden mb-3">
                      {/* Background gradient — green to red */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, var(--color-peach) 0%, ${accent} 100%)`,
                          opacity: 0.25,
                        }}
                      />
                      {/* Fill to "You" position (100%) */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: '100%',
                          background: `linear-gradient(90deg, var(--color-peach) 0%, ${accent} 100%)`,
                          opacity: 0.6,
                        }}
                      />
                    </div>

                    {/* Marker positions */}
                    <div className="relative h-12">
                      {/* Healthy marker */}
                      <div
                        className="absolute flex flex-col items-center"
                        style={{ left: `${healthyPct}%`, transform: 'translateX(-50%)' }}
                      >
                        <div
                          className="w-px h-3 mb-1"
                          style={{ background: 'var(--color-peach)', opacity: 0.5 }}
                        />
                        <span
                          className="text-[9px] tracking-[0.15em] uppercase whitespace-nowrap"
                          style={{ color: 'var(--color-peach)', opacity: 0.7 }}
                        >
                          Healthy {stat.benchmark.healthy}
                        </span>
                      </div>

                      {/* Industry avg marker */}
                      <div
                        className="absolute flex flex-col items-center"
                        style={{ left: `${industryPct}%`, transform: 'translateX(-50%)' }}
                      >
                        <div
                          className="w-px h-3 mb-1"
                          style={{ background: 'var(--color-warm-gray-3)', opacity: 0.5 }}
                        />
                        <span
                          className="text-[9px] tracking-[0.15em] uppercase whitespace-nowrap"
                          style={{ color: 'var(--color-warm-gray-3)', opacity: 0.7 }}
                        >
                          Avg {stat.benchmark.industryAvg}
                        </span>
                      </div>

                      {/* "You" marker at 100% */}
                      <div
                        className="absolute flex flex-col items-center"
                        style={{ left: '100%', transform: 'translateX(-50%)' }}
                      >
                        <div
                          className="w-px h-3 mb-1"
                          style={{ background: accent }}
                        />
                        <span
                          className="text-[9px] tracking-[0.15em] uppercase font-semibold whitespace-nowrap"
                          style={{ color: accent }}
                        >
                          You
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Implication — serif italic */}
                  <p
                    className="text-base md:text-lg lg:text-xl italic leading-relaxed max-w-2xl mb-8"
                    style={{ color: 'var(--color-warm-gray-1)', fontFamily: 'var(--font-serif)' }}
                  >
                    {stat.implication}
                  </p>

                  {/* Source */}
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: 'var(--color-warm-gray-3)' }}
                  >
                    Source: {stat.source}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress dots — right edge */}
        <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
          {EXECUTIVE_STATS.map((stat, i) => (
            <button
              key={stat.label}
              aria-label={`Stat ${i + 1}: ${stat.label}`}
              className="group relative flex items-center"
            >
              {/* Active label */}
              {i === activeIndex && (
                <span
                  className="hidden md:block absolute right-6 text-[10px] tracking-[0.15em] uppercase whitespace-nowrap"
                  style={{ color: CARD_ACCENTS[i], opacity: 0.7 }}
                >
                  {stat.label}
                </span>
              )}
              <div
                className="rounded-full"
                style={{
                  width: i === activeIndex ? 12 : 6,
                  height: i === activeIndex ? 12 : 6,
                  background: i === activeIndex ? CARD_ACCENTS[i] : 'var(--color-warm-gray-3)',
                  opacity: i === activeIndex ? 1 : 0.25,
                  boxShadow: i === activeIndex ? `0 0 12px ${CARD_ACCENTS[i]}40` : 'none',
                  transition: 'all 0.4s ease-out',
                }}
              />
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
          style={{
            opacity: activeIndex < cardCount - 1 ? 0.35 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          <div className="w-16 h-[1px] relative overflow-hidden" style={{ background: 'var(--color-warm-gray-3)' }}>
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${((activeIndex + 1) / cardCount) * 100}%`,
                background: CARD_ACCENTS[activeIndex] || 'var(--color-peach)',
                transition: 'width 0.4s ease-out, background 0.4s ease-out',
              }}
            />
          </div>
          <span
            className="text-[10px] tracking-[0.3em] uppercase tabular-nums"
            style={{ color: 'var(--color-warm-gray-3)' }}
          >
            {activeIndex + 1} / {cardCount}
          </span>
        </div>
      </div>

      {/* Spacer after pinned section */}
      <div className="h-32" />
    </section>
  )
}
