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
      {/* 1. Hero — "Something is wrong in DTC fashion." */}
      <HeroFabric />
      {/* 2. Market Pulse — "The market looks like a goldmine..." */}
      <MarketPulse />
      {/* 3. Executive Summary — "...but the numbers tell a different story." */}
      <ExecutiveSummary />
      {/* 4. Unit Economics — "Zoom in on a single $68 order." */}
      <UnitEconomics />
      {/* 5. Sankey — "Now multiply by 73,529 orders." */}
      <SankeyAct />
      {/* 6. Return & Fraud — "Here is exactly where the money goes." */}
      <ReturnFraudDeepDive />
      {/* 7. The Verdict — "Five truths no one will say out loud." */}
      <TheVerdict />
      {/* 8. Closing — "There is one way out." */}
      <Closing />
    </main>
  )
}
