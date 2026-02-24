'use client'

import { useRef, useEffect } from 'react'

interface TooltipData {
  label: string
  amount: string
  pctOfGMV: string
  type: 'revenue' | 'expense' | 'loss' | 'loss_critical' | 'final'
  /** For links: source → target narrative */
  flow?: string
}

interface SankeyTooltipProps {
  data: TooltipData | null
  x: number
  y: number
  visible: boolean
}

const TYPE_LABELS: Record<string, string> = {
  revenue: 'Revenue Stream',
  expense: 'Operating Cost',
  loss: 'Return Drain',
  loss_critical: 'Fraud & Penalties',
  final: 'Net Outcome',
}

const TYPE_ACCENT: Record<string, string> = {
  revenue: '#FFBE98',
  expense: '#A9A9A9',
  loss: '#722F37',
  loss_critical: '#FF6B6B',
  final: '#E8C57A',
}

export default function SankeyTooltip({ data, x, y, visible }: SankeyTooltipProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Keep tooltip within viewport bounds
  useEffect(() => {
    if (!ref.current || !visible) return
    const el = ref.current
    const rect = el.getBoundingClientRect()
    const pad = 16

    if (rect.right > window.innerWidth - pad) {
      el.style.transform = `translate(${x - rect.width - 16}px, ${y}px)`
    } else {
      el.style.transform = `translate(${x + 16}px, ${y}px)`
    }

    if (rect.bottom > window.innerHeight - pad) {
      const adjustedY = y - (rect.bottom - window.innerHeight) - pad
      el.style.transform = `translate(${x + 16}px, ${adjustedY}px)`
    }
  }, [x, y, visible, data])

  if (!data || !data.label) return null

  const accent = TYPE_ACCENT[data.type] || '#A9A9A9'
  const category = TYPE_LABELS[data.type] || ''

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-50 pointer-events-none"
      role="tooltip"
      aria-live="polite"
      aria-hidden={!visible}
      style={{
        transform: `translate(${x + 16}px, ${y}px)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s cubic-bezier(0.45, 0, 0.15, 1)',
      }}
    >
      <div
        className="rounded-sm px-5 py-4 min-w-[200px] max-w-[280px]"
        style={{
          background: 'rgba(18, 16, 14, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${accent}33`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)`,
        }}
      >
        {/* Category chip */}
        <div
          className="text-[9px] tracking-[0.25em] uppercase mb-2"
          style={{ color: accent }}
        >
          {category}
        </div>

        {/* Label */}
        <div
          className="text-sm font-medium mb-1"
          style={{ color: '#F5F0EB', fontFamily: 'var(--font-sans)' }}
        >
          {data.label}
        </div>

        {/* Flow narrative */}
        {data.flow && (
          <div
            className="text-[11px] mb-3"
            style={{ color: '#808080' }}
          >
            {data.flow}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px mb-3" style={{ background: `${accent}22` }} />

        {/* Amount + percentage row */}
        <div className="flex items-baseline justify-between gap-4">
          <span
            className="text-lg font-semibold tabular-nums"
            style={{ color: accent, fontFamily: 'var(--font-sans)' }}
          >
            {data.amount}
          </span>
          <span
            className="text-[11px] tabular-nums"
            style={{ color: '#808080' }}
          >
            {data.pctOfGMV} of GMV
          </span>
        </div>
      </div>
    </div>
  )
}

export type { TooltipData }
