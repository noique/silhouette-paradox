'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics/umami'

// Section DOM id -> label sent to Umami as { section }. Ids match SectionNav.
const SECTIONS: Record<string, string> = {
  'act-1-hero': 'hero',
  'act-1-market': 'market-pulse',
  'act-2-exec': 'executive-summary',
  'act-2-unit': 'unit-economics',
  'act-3-sankey': 'sankey',
  'act-4-return': 'return-fraud',
  'act-5-verdict': 'verdict',
  'act-5-closing': 'closing',
}

/**
 * Fires a Umami `section-reached` event the first time each act-section scrolls
 * into view — the one report-specific metric default tracking can't give (how
 * far readers actually get). IntersectionObserver only (no GSAP/GPU cost),
 * mirrors SectionNav. No-ops when Umami isn't loaded.
 *
 * Most sections are lazy-mounted (next/dynamic ssr:false), so we poll briefly
 * for their elements to appear and observe each once it exists.
 */
export default function SectionTracking() {
  useEffect(() => {
    const seen = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          observer.unobserve(entry.target)
          if (seen.has(id)) continue
          seen.add(id)
          trackEvent('section-reached', { section: SECTIONS[id] ?? id })
        }
      },
      // Fire when a section crosses the vertical CENTER of the viewport. A
      // height-ratio threshold (e.g. 0.5) can never trigger here: every act is
      // 1.3×–6.5× the viewport height, so <50% of it is ever on screen at once.
      // Collapsing the root to a center line with rootMargin makes "reached"
      // height-independent.
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    const observed = new Set<string>()
    const observeReady = () => {
      for (const id of Object.keys(SECTIONS)) {
        if (observed.has(id)) continue
        const el = document.getElementById(id)
        if (el) {
          observer.observe(el)
          observed.add(id)
        }
      }
    }

    observeReady()
    // Catch lazily-mounted sections; stop once all observed or after ~10s.
    let tries = 0
    const interval = window.setInterval(() => {
      observeReady()
      if (observed.size === Object.keys(SECTIONS).length || ++tries > 40) {
        window.clearInterval(interval)
      }
    }, 250)

    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [])

  return null
}
