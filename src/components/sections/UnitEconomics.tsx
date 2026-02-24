'use client'

import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UNIT_ECONOMICS_DATA } from '@/lib/data/mockData'
import { useIsMobile } from '@/hooks/useMediaQuery'
import SectionHeader from '@/components/ui/SectionHeader'
import WaterfallBar from '@/components/charts/WaterfallBar'

export default function UnitEconomics() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const [revealProgress, setRevealProgress] = useState(0)
  const lastProgressRef = useRef(0)
  const isMobile = useIsMobile()

  const updateProgress = useCallback((progress: number) => {
    if (Math.abs(progress - lastProgressRef.current) > 0.02 || progress >= 0.99) {
      lastProgressRef.current = progress
      setRevealProgress(progress)
    }
  }, [])

  useGSAP(
    () => {
      if (!headerRef.current || !pinRef.current) return

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

      // Pinned waterfall chart
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top 15%',
        end: '+=200%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1.5,
        onUpdate: (self) => {
          updateProgress(self.progress)
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ background: 'var(--color-bg)' }}
    >
      <SectionHeader
        ref={headerRef}
        label={UNIT_ECONOMICS_DATA.sectionLabel}
        title={UNIT_ECONOMICS_DATA.title}
        subtitle={UNIT_ECONOMICS_DATA.subtitle}
      />

      {/* Pinned chart container */}
      <div ref={pinRef} className="relative w-full pb-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12">
          <div
            className="md:overflow-visible"
            style={{
              overflowX: isMobile ? 'auto' : undefined,
              WebkitOverflowScrolling: 'touch',
            }}
            data-lenis-prevent
          >
            <div style={{ minWidth: isMobile ? '700px' : undefined }}>
              <WaterfallBar
                steps={UNIT_ECONOMICS_DATA.steps}
                revealProgress={revealProgress}
                annotations={UNIT_ECONOMICS_DATA.annotations}
              />
            </div>
          </div>
        </div>

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

      <div className="h-32" />
    </section>
  )
}
