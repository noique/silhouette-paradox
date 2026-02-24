'use client'

import { useMemo } from 'react'

interface WaterfallStep {
  readonly label: string
  readonly value: number
  readonly type: 'positive' | 'negative' | 'loss' | 'loss_critical' | 'final'
  readonly running: number
}

interface WaterfallBarProps {
  steps: readonly WaterfallStep[]
  revealProgress: number
  annotations: Record<string, string>
}

const MARGIN = { top: 40, right: 260, bottom: 40, left: 170 }
const INNER_WIDTH = 420
const INNER_HEIGHT = 500
const FULL_WIDTH = INNER_WIDTH + MARGIN.left + MARGIN.right
const FULL_HEIGHT = INNER_HEIGHT + MARGIN.top + MARGIN.bottom

const TYPE_COLORS: Record<string, string> = {
  positive: '#FFBE98',
  negative: '#A9A9A9',
  loss: '#722F37',
  loss_critical: '#8B0000',
  final: '#808080',
}

function getStepOpacity(index: number, total: number, progress: number): number {
  const stepProgress = index / total
  const fadeStart = progress * 1.3 - 0.05
  return Math.min(1, Math.max(0, (fadeStart - stepProgress) * 6))
}

export default function WaterfallBar({
  steps,
  revealProgress,
  annotations,
}: WaterfallBarProps) {
  const maxValue = 68 // Order revenue
  const barHeight = INNER_HEIGHT / steps.length - 8
  const xScale = (value: number) => (Math.abs(value) / maxValue) * INNER_WIDTH

  return (
    <svg
      viewBox={`0 0 ${FULL_WIDTH} ${FULL_HEIGHT}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Waterfall chart showing $68 order cost breakdown"
    >
      <defs>
        <filter id="waterfall-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {steps.map((step, i) => {
        const opacity = getStepOpacity(i, steps.length, revealProgress)
        const y = MARGIN.top + i * (INNER_HEIGHT / steps.length)
        const barW = Math.max(2, xScale(step.value))
        const isFinal = step.type === 'final'
        const color = TYPE_COLORS[step.type] || '#A9A9A9'

        // For the waterfall cascade: positive starts from left,
        // negative bars show the deduction amount
        const barX = MARGIN.left

        // Annotation for this step
        const annotation = annotations[step.label]

        return (
          <g
            key={i}
            style={{
              opacity,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            {/* Step label (left side) */}
            <text
              x={MARGIN.left - 12}
              y={y + barHeight / 2}
              dy="0.35em"
              textAnchor="end"
              fill={isFinal ? 'var(--color-cream)' : 'var(--color-text-secondary)'}
              fontSize={isFinal ? 12 : 11}
              fontWeight={isFinal ? 600 : 400}
              fontFamily="var(--font-sans)"
            >
              {step.label}
            </text>

            {/* Bar */}
            <rect
              x={barX}
              y={y}
              width={barW}
              height={barHeight}
              fill={color}
              rx={2}
              opacity={isFinal ? 1 : 0.7}
              filter={isFinal ? 'url(#waterfall-glow)' : undefined}
            />

            {/* Value label (on bar or next to it) */}
            <text
              x={barX + barW + 10}
              y={y + barHeight / 2}
              dy="0.35em"
              fill={
                isFinal
                  ? '#FFBE98'
                  : step.type === 'loss_critical'
                    ? '#FF6B6B'
                    : step.type === 'loss'
                      ? '#A05050'
                      : 'var(--color-warm-gray-1)'
              }
              fontSize={11}
              fontWeight={isFinal ? 700 : 400}
              fontFamily="var(--font-sans)"
              className="tabular-nums"
            >
              {step.value >= 0 ? '' : ''}{step.value >= 0 ? '+' : ''}
              ${Math.abs(step.value).toFixed(2)}
            </text>

            {/* Running total */}
            <text
              x={barX + barW + 10}
              y={y + barHeight / 2 + 14}
              dy="0.35em"
              fill="var(--color-warm-gray-3)"
              fontSize={9}
              fontFamily="var(--font-sans)"
              className="tabular-nums"
            >
              → ${step.running.toFixed(2)} remaining
            </text>

            {/* Annotation (right side, if exists) */}
            {annotation && (
              <text
                x={MARGIN.left + INNER_WIDTH + 40}
                y={y + barHeight / 2}
                dy="0.35em"
                fill={isFinal ? '#FFBE98' : 'var(--color-warm-gray-3)'}
                fontSize={isFinal ? 11 : 10}
                fontWeight={isFinal ? 500 : 400}
                fontFamily="var(--font-sans)"
                fontStyle={isFinal ? 'normal' : 'italic'}
              >
                {annotation}
              </text>
            )}

            {/* Connector line to next step */}
            {i < steps.length - 1 && (
              <line
                x1={barX + Math.min(barW, xScale(steps[i + 1].value))}
                y1={y + barHeight}
                x2={barX + Math.min(barW, xScale(steps[i + 1].value))}
                y2={y + barHeight + 8}
                stroke="var(--color-warm-gray-3)"
                strokeWidth={0.5}
                strokeDasharray="2,2"
                opacity={0.3}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}
