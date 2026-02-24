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

const SankeyAct = dynamic(() => import('@/components/sections/SankeyAct'), {
  ssr: false,
  loading: () => <section className="h-screen w-full" style={{ background: 'var(--color-bg)' }} />,
})

export default function Home() {
  return (
    <main>
      <HeroFabric />
      <ExecutiveSummary />
      <SankeyAct />
      <Closing />
    </main>
  )
}
