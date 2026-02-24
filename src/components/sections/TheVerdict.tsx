'use client'

import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VERDICT_DATA } from '@/lib/data/mockData'
import SectionHeader from '@/components/ui/SectionHeader'
import { useIsMobile } from '@/hooks/useMediaQuery'

export default function TheVerdict() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndexRef = useRef(0)
  const isMobile = useIsMobile()

  const { truths } = VERDICT_DATA
  const cardCount = truths.length

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
      const cards = cardsContainerRef.current.querySelectorAll('.verdict-card')

      // Set initial state: all cards invisible except first gets set by timeline
      gsap.set(cards, { opacity: 0, y: 80 })

      // Build GSAP timeline for card transitions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top 10%',
          end: isMobile ? '+=400%' : '+=500%',
          pin: true,
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
        const holdEnd = enterAt + segmentDuration * 0.75

        // Enter
        tl.to(card, { opacity: 1, y: 0, duration: segmentDuration * 0.2, ease: 'power3.out' }, enterAt)

        // Exit (except last card)
        if (i < cardCount - 1) {
          tl.to(
            card,
            { opacity: 0, y: -30, duration: segmentDuration * 0.15, ease: 'power2.in' },
            holdEnd
          )
        }
      })
    },
    { scope: sectionRef, dependencies: [isMobile] }
  )

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ background: 'var(--color-bg)' }}
    >
      <SectionHeader
        ref={headerRef}
        label={VERDICT_DATA.sectionLabel}
        title={VERDICT_DATA.title}
        subtitle={VERDICT_DATA.subtitle}
        labelColor="var(--color-burgundy)"
      />

      {/* Pinned card reveal container */}
      <div ref={pinRef} className="relative w-full min-h-[70vh]">
        {/* Cards stack */}
        <div
          ref={cardsContainerRef}
          className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 relative"
          style={{ minHeight: '50vh' }}
        >
          {truths.map((truth, i) => (
            <div
              key={i}
              className="verdict-card absolute top-0 left-0 right-0 px-8 md:px-20"
            >
              <div
                className="max-w-3xl rounded-sm p-8 md:p-12"
                style={{
                  background: 'var(--color-bg-card)',
                  border: `1px solid ${truth.accentColor}22`,
                }}
              >
                {/* Number + Metric row */}
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-5xl md:text-6xl font-light"
                    style={{ color: `${truth.accentColor}40`, fontFamily: 'var(--font-serif)' }}
                  >
                    {truth.number}
                  </span>
                  <div className="text-right">
                    <div
                      className="text-3xl md:text-4xl font-bold tabular-nums"
                      style={{ color: truth.accentColor }}
                    >
                      {truth.metric.value}
                    </div>
                    <div
                      className="text-xs tracking-[0.15em] uppercase mt-1"
                      style={{ color: 'var(--color-warm-gray-3)' }}
                    >
                      {truth.metric.label}
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <h3
                  className="text-xl md:text-2xl font-bold leading-tight mb-4"
                  style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
                >
                  {truth.headline}
                </h3>

                {/* Body */}
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {truth.body}
                </p>

                {/* Accent line bottom */}
                <div
                  className="mt-8 h-[2px] w-16"
                  style={{ background: truth.accentColor, opacity: 0.4 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots (right side) */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {truths.map((truth, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === activeIndex ? truth.accentColor : 'var(--color-warm-gray-3)',
                opacity: i === activeIndex ? 1 : 0.3,
                transform: i === activeIndex ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="h-32" />
    </section>
  )
}
