'use client'

import { useState, useEffect, useCallback } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'

/**
 * Floating right-side Act navigator.
 * Uses IntersectionObserver (zero GSAP, zero GPU cost).
 * Hidden on mobile.
 */

interface Act {
  id: string
  label: string
  sectionIds: string[]
  color: string
}

const ACTS: Act[] = [
  {
    id: 'act-1',
    label: 'The Illusion',
    sectionIds: ['act-1-hero', 'act-1-market'],
    color: 'var(--color-peach)',
  },
  {
    id: 'act-2',
    label: 'The Anatomy',
    sectionIds: ['act-2-exec', 'act-2-unit'],
    color: 'var(--color-gold)',
  },
  {
    id: 'act-3',
    label: 'The Hemorrhage',
    sectionIds: ['act-3-sankey'],
    color: 'var(--color-warning)',
  },
  {
    id: 'act-4',
    label: 'The Tax',
    sectionIds: ['act-4-return'],
    color: 'var(--color-burgundy)',
  },
  {
    id: 'act-5',
    label: 'The Reckoning',
    sectionIds: ['act-5-verdict', 'act-5-closing'],
    color: '#800000',
  },
]

export default function SectionNav() {
  const [activeAct, setActiveAct] = useState(0)
  const [visible, setVisible] = useState(false)
  const isMobile = useIsMobile()

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the section with the most visibility
    let bestAct = -1
    let bestRatio = 0

    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
        const sectionId = entry.target.id
        // Find which act this section belongs to
        const actIndex = ACTS.findIndex((act) =>
          act.sectionIds.includes(sectionId)
        )
        if (actIndex >= 0) {
          bestRatio = entry.intersectionRatio
          bestAct = actIndex
        }
      }
    })

    if (bestAct >= 0) {
      setActiveAct(bestAct)
    }
  }, [])

  useEffect(() => {
    if (isMobile) return

    // Observe all sections
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0.1, 0.3, 0.5],
      rootMargin: '-10% 0px -10% 0px',
    })

    // Collect all section elements
    const elements: Element[] = []
    ACTS.forEach((act) => {
      act.sectionIds.forEach((sid) => {
        const el = document.getElementById(sid)
        if (el) {
          observer.observe(el)
          elements.push(el)
        }
      })
    })

    // Show nav after hero scrolls away
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0.8 }
    )

    const hero = document.getElementById('act-1-hero')
    if (hero) heroObserver.observe(hero)

    return () => {
      observer.disconnect()
      heroObserver.disconnect()
    }
  }, [isMobile, handleIntersection])

  if (isMobile) return null

  return (
    <nav
      className="fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-5"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease-out',
      }}
      aria-label="Section navigation"
    >
      {ACTS.map((act, i) => {
        const isActive = i === activeAct
        return (
          <button
            key={act.id}
            onClick={() => {
              const target = document.getElementById(act.sectionIds[0])
              target?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group relative flex items-center gap-3"
            aria-label={`Navigate to Act ${i + 1}: ${act.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Label — only visible on active */}
            <span
              className="text-[10px] tracking-[0.2em] uppercase whitespace-nowrap"
              style={{
                color: act.color,
                opacity: isActive ? 0.8 : 0,
                transform: isActive ? 'translateX(0)' : 'translateX(8px)',
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
              }}
            >
              {act.label}
            </span>

            {/* Dot */}
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                background: isActive ? act.color : 'var(--color-warm-gray-3)',
                opacity: isActive ? 1 : 0.3,
                boxShadow: isActive ? `0 0 12px ${act.color}40` : 'none',
                transition: 'all 0.4s ease-out',
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}
