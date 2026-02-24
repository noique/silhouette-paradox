'use client'

import { useRef, useState } from 'react'
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

      // Set initial state: all cards invisible
      gsap.set(cards, { opacity: 0, y: 60 })

      // Build GSAP timeline for card transitions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: isMobile ? '+=400%' : '+=500%',
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
        const holdEnd = enterAt + segmentDuration * 0.75

        // Enter
        tl.to(card, { opacity: 1, y: 0, duration: segmentDuration * 0.2, ease: 'power3.out' }, enterAt)

        // Exit (except last card)
        if (i < cardCount - 1) {
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
      id="act-5-verdict"
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

      {/* Pinned full-viewport card reveal — needs own background so it's opaque when position:fixed */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        {/* Cards stack — each card fills viewport */}
        <div
          ref={cardsContainerRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          {truths.map((truth, i) => (
            <div
              key={i}
              className="verdict-card absolute inset-0 flex items-center"
            >
              <div className="w-full mx-auto max-w-[1400px] px-6 md:px-16 lg:px-24">
                {/* Two-column layout: left = content, right = metric */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
                  {/* Left column — main content */}
                  <div className="flex-1 min-w-0">
                    {/* Number as giant watermark */}
                    <div className="relative mb-6 md:mb-8">
                      <span
                        className="absolute -left-2 md:-left-4 -top-16 md:-top-24 text-[120px] md:text-[180px] lg:text-[220px] font-bold leading-none select-none pointer-events-none"
                        style={{
                          color: truth.accentColor,
                          opacity: 0.07,
                          fontFamily: 'var(--font-serif)',
                        }}
                      >
                        {truth.number}
                      </span>

                      {/* Accent top line */}
                      <div
                        className="w-12 h-[3px] mb-6 md:mb-8"
                        style={{ background: truth.accentColor, opacity: 0.6 }}
                      />

                      {/* Headline — cinematic size */}
                      <h3
                        className="text-2xl md:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight"
                        style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
                      >
                        {truth.headline}
                      </h3>
                    </div>

                    {/* Body — comfortable reading size */}
                    <p
                      className="text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {truth.body}
                    </p>
                  </div>

                  {/* Right column — metric as hero stat */}
                  <div
                    className="mt-10 lg:mt-0 flex-shrink-0 lg:text-right"
                  >
                    <div
                      className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tabular-nums leading-none"
                      style={{ color: truth.accentColor }}
                    >
                      {truth.metric.value}
                    </div>
                    <div
                      className="text-xs md:text-sm tracking-[0.2em] uppercase mt-3"
                      style={{ color: 'var(--color-warm-gray-3)' }}
                    >
                      {truth.metric.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator — right edge */}
        <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
          {truths.map((truth, i) => (
            <button
              key={i}
              aria-label={`Truth ${i + 1}`}
              className="group relative flex items-center"
            >
              {/* Active label */}
              {i === activeIndex && (
                <span
                  className="hidden md:block absolute right-6 text-[10px] tracking-[0.2em] uppercase whitespace-nowrap"
                  style={{ color: truth.accentColor, opacity: 0.7 }}
                >
                  {truth.number}
                </span>
              )}
              <div
                className="rounded-full transition-all duration-400 ease-out"
                style={{
                  width: i === activeIndex ? 12 : 6,
                  height: i === activeIndex ? 12 : 6,
                  background: i === activeIndex ? truth.accentColor : 'var(--color-warm-gray-3)',
                  opacity: i === activeIndex ? 1 : 0.25,
                  boxShadow: i === activeIndex ? `0 0 12px ${truth.accentColor}40` : 'none',
                }}
              />
            </button>
          ))}
        </div>

        {/* Subtle scroll hint at bottom */}
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
                background: truths[activeIndex]?.accentColor || 'var(--color-peach)',
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
    </section>
  )
}
