'use client'

import { HERO_CONTENT } from '@/lib/data/mockData'

/**
 * Hero section — single div, single compositing layer, zero GPU cost.
 * All gradients merged into one background stack to avoid layer explosion.
 */
export default function HeroFabric() {
  return (
    <section
      id="act-1-hero"
      className="relative h-[130vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* All gradients in ONE div = ONE compositing layer */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 100% 90% at 50% 50%, transparent 55%, rgba(10,10,10,0.25) 100%),
              radial-gradient(ellipse 140% 130% at 50% 45%, transparent 50%, rgba(42,34,24,0.5) 80%, rgba(15,12,9,0.8) 100%),
              radial-gradient(ellipse 110% 100% at 48% 50%, rgba(196,168,130,0.3) 0%, rgba(196,168,130,0.08) 50%, transparent 80%),
              radial-gradient(ellipse 80% 70% at 58% 52%, rgba(224,196,152,0.4) 0%, rgba(224,196,152,0.1) 35%, transparent 65%),
              radial-gradient(ellipse 90% 80% at 42% 48%, rgba(245,196,160,0.55) 0%, rgba(245,196,160,0.15) 40%, transparent 70%),
              radial-gradient(ellipse 130% 120% at 50% 50%, #3D2E1E 0%, #1A1410 70%, #0F0C09 100%)
            `,
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
