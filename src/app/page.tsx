'use client'

import dynamic from 'next/dynamic'
import HeroFabric from '@/components/sections/HeroFabric'
import ExecutiveSummary from '@/components/sections/ExecutiveSummary'
import Closing from '@/components/sections/Closing'
import SectionNav from '@/components/ui/SectionNav'

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

/** 1px act divider — subtle warm-gray line between major acts */
function ActDivider() {
  return (
    <div
      className="w-full h-px"
      style={{ background: 'var(--color-warm-gray-3)', opacity: 0.12 }}
    />
  )
}

export default function Home() {
  return (
    <main>
      <SectionNav />

      {/* Act I — The Illusion */}
      <HeroFabric />
      <MarketPulse />

      <ActDivider />

      {/* Act II — The Anatomy */}
      <ExecutiveSummary />
      <UnitEconomics />

      {/* Act III — The Hemorrhage */}
      <SankeyAct />

      <ActDivider />

      {/* Act IV — The Tax */}
      <ReturnFraudDeepDive />

      <ActDivider />

      {/* Act V — The Reckoning */}
      <TheVerdict />
      <Closing />
    </main>
  )
}
