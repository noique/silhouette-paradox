'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EXECUTIVE_STATS } from '@/lib/data/mockData'
import CountUp from '@/components/ui/CountUp'

export default function ExecutiveSummary() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useGSAP(() => {
    if (!sectionRef.current) return

    const cards = cardsRef.current.filter(Boolean)

    // Fade in cards with stagger
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-40 md:py-56"
      style={{ background: 'var(--color-bg-warm)' }}
    >
      {/* Section title */}
      <div className="mx-auto max-w-[var(--max-content)] px-10 md:px-20 mb-24">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: 'var(--color-peach)' }}
        >
          Executive Overview
        </p>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
        >
          The Numbers They Don&apos;t Show You
        </h2>
      </div>

      {/* KPI Cards Grid */}
      <div className="mx-auto max-w-[var(--max-content)] px-10 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {EXECUTIVE_STATS.map((stat, i) => (
          <div
            key={stat.label}
            ref={(el) => { if (el) cardsRef.current[i] = el }}
            className="group relative p-10 md:p-12 border border-[var(--color-warm-gray-3)]/10 rounded-sm"
            style={{ background: 'var(--color-bg-card)' }}
          >
            {/* Accent line */}
            <div
              className="absolute top-0 left-0 w-full h-px"
              style={{
                background: `linear-gradient(90deg, var(--color-peach) 0%, transparent 60%)`,
                opacity: 0.4,
              }}
            />

            {/* Number */}
            <div className="tabular-nums text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-4"
              style={{ color: 'var(--color-cream)' }}
            >
              <span style={{ color: 'var(--color-warm-gray-3)' }}>{stat.prefix}</span>
              <CountUp end={stat.value} duration={1.8} />
              <span style={{ color: 'var(--color-peach)' }}>{stat.suffix}</span>
            </div>

            {/* Label */}
            <h3
              className="text-lg font-medium tracking-tight mb-1"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
            >
              {stat.label}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {stat.sublabel}
            </p>

            {/* Source */}
            <p className="mt-6 text-[10px] tracking-wider uppercase" style={{ color: 'var(--color-warm-gray-3)' }}>
              Source: {stat.source}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
