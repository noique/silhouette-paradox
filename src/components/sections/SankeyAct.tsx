'use client'

import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SANKEY_MOCK_DATA } from '@/lib/data/mockData'
import { useIsMobile } from '@/hooks/useMediaQuery'
import SankeyChart from '@/components/sankey/SankeyChart'

export default function SankeyAct() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const [revealProgress, setRevealProgress] = useState(0)
  const lastProgressRef = useRef(0)
  const isMobile = useIsMobile()

  // Throttle state updates — only re-render when progress changes by ≥2%
  const updateProgress = useCallback((progress: number) => {
    if (Math.abs(progress - lastProgressRef.current) > 0.02 || progress >= 0.99) {
      lastProgressRef.current = progress
      setRevealProgress(progress)
    }
  }, [])

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !chartRef.current || !pinRef.current) return

    // Title fade in
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Pin the chart and reveal it during scroll
    ScrollTrigger.create({
      trigger: pinRef.current,
      start: 'top 15%',
      end: '+=150%',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 1.5,
      onUpdate: (self) => {
        updateProgress(self.progress)
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Section header */}
      <div ref={titleRef} className="mx-auto max-w-[var(--max-content)] px-10 md:px-20 pt-40 md:pt-56 pb-16">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: 'var(--color-burgundy)' }}
        >
          Act III — The Hemorrhage of Value
        </p>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
        >
          Where $5M Goes to Die
        </h2>
        <p
          className="mt-6 text-base md:text-lg max-w-2xl"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          A typical DTC shapewear brand generating $5M in gross revenue. Follow the money as it
          flows through COGS, marketing, payment processing, returns, and fraud — until almost
          nothing remains.
        </p>
      </div>

      {/* Pinned chart container — needs own background so it's opaque when position:fixed */}
      <div ref={pinRef} className="relative w-full pb-20" style={{ background: 'var(--color-bg)' }}>
        <div
          ref={chartRef}
          className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12"
        >
          {/* Horizontally scrollable on mobile to preserve chart readability */}
          <div
            className="md:overflow-visible"
            style={{
              overflowX: isMobile ? 'auto' : undefined,
              WebkitOverflowScrolling: 'touch',
            }}
            data-lenis-prevent
          >
            <div style={{ minWidth: isMobile ? '900px' : undefined }}>
              <SankeyChart data={SANKEY_MOCK_DATA} revealProgress={revealProgress} />
            </div>
          </div>
        </div>

        {/* Mobile swipe hint */}
        {isMobile && (
          <div
            className="flex items-center justify-center gap-2 mt-3"
            style={{
              opacity: revealProgress > 0.1 ? 0.5 : 0,
              transition: 'opacity 0.5s ease-out',
            }}
          >
            <span
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-warm-gray-3)', fontFamily: 'var(--font-sans)' }}
            >
              ← Swipe to explore →
            </span>
          </div>
        )}

        {/* Scroll progress indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3"
          style={{
            opacity: revealProgress < 0.95 ? 0.5 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          <div className="w-24 h-[1px] bg-[var(--color-warm-gray-3)] relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[var(--color-peach)]"
              style={{ width: `${revealProgress * 100}%`, transition: 'width 0.1s linear' }}
            />
          </div>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'var(--color-warm-gray-3)', fontFamily: 'var(--font-sans)' }}
          >
            Scroll to reveal
          </span>
        </div>
      </div>

      {/* Spacer after pinned section */}
      <div className="h-32" />
    </section>
  )
}
