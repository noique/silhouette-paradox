'use client'

import dynamic from 'next/dynamic'
import ExecutiveSummary from '@/components/sections/ExecutiveSummary'
import Closing from '@/components/sections/Closing'

// Lazy load WebGL — no SSR, loaded only when needed
const HeroFabric = dynamic(() => import('@/components/sections/HeroFabric'), {
  ssr: false,
  loading: () => (
    <section className="h-screen w-full flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="font-[family-name:var(--font-serif)] text-2xl tracking-tight" style={{ color: 'var(--color-warm-gray-3)', opacity: 0.5 }}>
        Loading...
      </div>
    </section>
  ),
})

const MarketPulse = dynamic(() => import('@/components/sections/MarketPulse'), {
  ssr: false,
  loading: () => <section className="min-h-screen w-full" style={{ background: 'var(--color-bg-warm)' }} />,
})

const UnitEconomics = dynamic(() => import('@/components/sections/UnitEconomics'), {
  ssr: false,
  loading: () => <section className="min-h-screen w-full" style={{ background: 'var(--color-bg)' }} />,
})

const SankeyAct = dynamic(() => import('@/components/sections/SankeyAct'), {
  ssr: false,
  loading: () => <section className="min-h-screen w-full" style={{ background: 'var(--color-bg)' }} />,
})

const ReturnFraudDeepDive = dynamic(() => import('@/components/sections/ReturnFraudDeepDive'), {
  ssr: false,
  loading: () => <section className="min-h-screen w-full" style={{ background: 'var(--color-bg-warm)' }} />,
})

const TheVerdict = dynamic(() => import('@/components/sections/TheVerdict'), {
  ssr: false,
  loading: () => <section className="min-h-screen w-full" style={{ background: 'var(--color-bg)' }} />,
})

export default function Home() {
  return (
    <main>
      {/* Each section gets ascending z-index so later sections scroll OVER pinned ones cleanly */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeroFabric />
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <MarketPulse />
      </div>
      <div style={{ position: 'relative', zIndex: 3 }}>
        <ExecutiveSummary />
      </div>
      <div style={{ position: 'relative', zIndex: 4 }}>
        <UnitEconomics />
      </div>
      <div style={{ position: 'relative', zIndex: 5 }}>
        <SankeyAct />
      </div>
      <div style={{ position: 'relative', zIndex: 6 }}>
        <ReturnFraudDeepDive />
      </div>
      <div style={{ position: 'relative', zIndex: 7 }}>
        <TheVerdict />
      </div>
      <div style={{ position: 'relative', zIndex: 8 }}>
        <Closing />
      </div>
    </main>
  )
}
