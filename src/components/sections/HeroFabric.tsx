'use client'

import { HERO_CONTENT } from '@/lib/data/mockData'

/**
 * Hero section — pure CSS, zero GPU cost.
 *
 * The WebGL fabric shader was the #1 performance bottleneck,
 * running GLSL on every frame for ~200vh of scroll distance.
 * This CSS gradient produces a nearly identical luxury aesthetic
 * with literally zero GPU overhead.
 */
export default function HeroFabric() {
  return (
    <section
      id="hero-section"
      className="relative h-[130vh] w-full"
    >
      {/* Sticky container — stays on screen during parallax scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layered radial gradients mimicking the fabric shader */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 35% 45%, #F5C4A0 0%, transparent 55%),
              radial-gradient(ellipse at 65% 55%, #E0C498 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, #C4A882 0%, transparent 70%),
              linear-gradient(135deg, #2A2218 0%, #1A1410 40%, #0A0A0A 100%)
            `,
          }}
        />

        {/* Vignette edge darkening */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.3) 100%)',
          }}
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
          <h1
            className="text-5xl md:text-8xl font-bold tracking-tighter text-center"
            style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
          >
            {HERO_CONTENT.title}
          </h1>
          <p
            className="mt-4 md:mt-6 text-base md:text-xl tracking-wide max-w-lg text-center"
            style={{ color: 'var(--color-warm-gray-1)', opacity: 0.75 }}
          >
            {HERO_CONTENT.subtitle}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-warm-gray-3)' }}>
            Scroll
          </span>
          <div className="w-px h-8" style={{ background: 'var(--color-warm-gray-3)' }} />
        </div>
      </div>
    </section>
  )
}
