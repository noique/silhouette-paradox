'use client'

/**
 * Full-width horizontal proportion bar — segments with embedded labels.
 * Pure HTML/CSS, zero SVG, zero GSAP.
 * More impactful than donut rings for categorical proportions.
 */

interface Segment {
  label: string
  pct: number
  color: string
}

interface ProportionBarProps {
  title: string
  totalLabel: string
  totalSublabel: string
  segments: readonly Segment[]
}

export default function ProportionBar({
  title,
  totalLabel,
  totalSublabel,
  segments,
}: ProportionBarProps) {
  return (
    <div>
      {/* Title row */}
      <div className="flex items-baseline justify-between mb-4">
        <h3
          className="text-lg font-medium"
          style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl font-light tabular-nums"
            style={{ color: 'var(--color-cream)' }}
          >
            {totalLabel}
          </span>
          <span
            className="text-xs tracking-wider uppercase"
            style={{ color: 'var(--color-warm-gray-3)' }}
          >
            {totalSublabel}
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="flex h-10 md:h-12 rounded-sm overflow-hidden gap-[2px]">
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              width: `${seg.pct}%`,
              background: seg.color,
              opacity: 0.75,
            }}
          >
            {/* Embedded label — only show if segment is wide enough */}
            {seg.pct >= 12 && (
              <span
                className="text-[10px] md:text-xs font-medium tracking-wide truncate px-2"
                style={{
                  color: 'var(--color-bg)',
                  mixBlendMode: 'multiply',
                }}
              >
                {seg.pct}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend below */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: seg.color, opacity: 0.75 }}
            />
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {seg.label}
            </span>
            <span
              className="text-xs tabular-nums font-medium"
              style={{ color: 'var(--color-warm-gray-1)' }}
            >
              {seg.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
