'use client'

import dynamic from 'next/dynamic'
import HeroFabric from '@/components/sections/HeroFabric'
import ExecutiveSummary from '@/components/sections/ExecutiveSummary'
import Closing from '@/components/sections/Closing'

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
      <HeroFabric />
      <MarketPulse />
      <ExecutiveSummary />
      <UnitEconomics />
      <SankeyAct />
      <ReturnFraudDeepDive />
      <TheVerdict />
      <Closing />
    </main>
  )
}
