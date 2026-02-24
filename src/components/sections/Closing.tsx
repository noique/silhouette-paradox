'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CLOSING_DATA } from '@/lib/data/mockData'

export default function Closing() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const recsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!contentRef.current) return

    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Recommendations stagger — separate trigger for later in scroll
    if (recsRef.current) {
      const recCards = recsRef.current.querySelectorAll('.rec-card')
      gsap.fromTo(
        recCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: recsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section
      id="act-5-closing"
      ref={sectionRef}
      className="relative w-full py-40 md:py-64"
      style={{ background: 'var(--color-bg-warm)' }}
    >
      <div
        ref={contentRef}
        className="mx-auto max-w-[var(--max-content)] px-10 md:px-20"
      >
        {/* Epilogue label */}
        <p
          className="text-[11px] tracking-[0.4em] uppercase mb-8"
          style={{ color: 'var(--color-burgundy)' }}
        >
          Epilogue
        </p>

        {/* The devastating number, one final time */}
        <div className="flex items-baseline gap-3 mb-16">
          <span
            className="text-6xl md:text-7xl font-light tabular-nums"
            style={{ color: 'var(--color-cream)' }}
          >
            0.12
          </span>
          <span
            className="text-2xl"
            style={{ color: 'var(--color-peach)' }}
          >
            %
          </span>
          <span
            className="text-sm ml-2"
            style={{ color: 'var(--color-warm-gray-3)' }}
          >
            net margin on $5M GMV
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-16 h-px mb-16"
          style={{ background: 'var(--color-peach)', opacity: 0.4 }}
        />

        {/* Contrarian insight */}
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight max-w-3xl mb-8"
          style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
        >
          The antidote to rising CAC is not cheaper channels.
          <br />
          <span style={{ color: 'var(--color-peach)' }}>
            It&apos;s radical SKU rationalization.
          </span>
        </h2>

        <p
          className="text-base md:text-lg max-w-2xl leading-relaxed mb-24"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Every additional SKU multiplies your return surface area. Every return
          triggers a chain reaction of costs that most operators never trace to
          their origin. The brands that survive the DTC margin squeeze won&apos;t be
          the ones who found cheaper traffic — they&apos;ll be the ones who
          eliminated the products that were silently destroying their unit
          economics.
        </p>
      </div>

      {/* Structured recommendations */}
      <div
        ref={recsRef}
        className="mx-auto max-w-[var(--max-content)] px-10 md:px-20"
      >
        <div className="space-y-16 md:space-y-20 mb-32">
          {CLOSING_DATA.recommendations.map((rec) => (
            <div key={rec.number} className="rec-card max-w-3xl">
              {/* Number line */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-px"
                  style={{ background: 'var(--color-peach)', opacity: 0.4 }}
                />
                <span
                  className="text-[11px] tracking-[0.4em] uppercase tabular-nums"
                  style={{ color: 'var(--color-peach)', opacity: 0.7 }}
                >
                  {rec.number}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-2xl md:text-3xl font-bold tracking-tight mb-5"
                style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
              >
                {rec.title}
              </h3>

              {/* Body */}
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {rec.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA + Footer */}
      <div className="mx-auto max-w-[var(--max-content)] px-10 md:px-20">
        {/* CTA — luxury book colophon style */}
        <div
          className="pt-16 border-t"
          style={{ borderColor: 'var(--color-warm-gray-3)', opacity: 0.2 }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: 'var(--color-warm-gray-3)' }}
          >
            Produced with AI-augmented research and visualization
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            For consulting inquiries or custom data reports for your brand,
            reach out.
          </p>
        </div>

        {/* Footer mark */}
        <div className="mt-32 flex items-center gap-3">
          <div
            className="w-8 h-px"
            style={{ background: 'var(--color-warm-gray-3)' }}
          />
          <span
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{ color: 'var(--color-warm-gray-3)' }}
          >
            The Silhouette Paradox — 2026
          </span>
        </div>

        {/* Attribution */}
        <div className="mt-12">
          <a
            href="https://milamaren.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.2em] transition-opacity hover:opacity-100"
            style={{ color: 'var(--color-warm-gray-3)', opacity: 0.5 }}
          >
            By MilaMaren
          </a>
        </div>
      </div>
    </section>
  )
}
