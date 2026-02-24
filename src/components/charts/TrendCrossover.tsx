'use client'

import { useRef, useEffect, useState } from 'react'

/**
 * Pure SVG dual-line chart showing CAC vs AOV crossover.
 * Uses strokeDasharray/strokeDashoffset for scroll-triggered line reveal.
 * Zero GSAP dependency — CSS transitions only.
 */

interface TrendCrossoverProps {
  years: readonly string[]
  cac: readonly number[]
  aov: readonly number[]
  crossoverNote: string
  /** 0-1 progress for line reveal (driven by IntersectionObserver in parent) */
  revealed: boolean
}

// Chart layout constants
const W = 720
const H = 400
const PAD = { top: 40, right: 60, bottom: 50, left: 55 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

export default function TrendCrossover({
  years,
  cac,
  aov,
  crossoverNote,
  revealed,
}: TrendCrossoverProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Compute scales
  const allVals = [...cac, ...aov]
  const yMin = Math.floor(Math.min(...allVals) / 10) * 10 - 5 // Round down, some padding
  const yMax = Math.ceil(Math.max(...allVals) / 10) * 10 + 5

  const xScale = (i: number) => PAD.left + (i / (years.length - 1)) * PLOT_W
  const yScale = (v: number) => PAD.top + ((yMax - v) / (yMax - yMin)) * PLOT_H

  // Build polyline points
  const cacPoints = cac.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')
  const aovPoints = aov.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')

  // Find crossover point (where CAC first exceeds AOV)
  let crossIdx = -1
  for (let i = 1; i < cac.length; i++) {
    if (cac[i] >= aov[i] && cac[i - 1] < aov[i - 1]) {
      crossIdx = i
      break
    }
  }

  // If exact crossover at an index, use that; otherwise interpolate
  const crossX = crossIdx >= 0 ? xScale(crossIdx) : xScale(3)
  const crossY = crossIdx >= 0 ? yScale(cac[crossIdx]) : yScale((cac[3] + aov[3]) / 2)

  // Build danger zone polygon (area between CAC and AOV after crossover, where CAC > AOV)
  let dangerPolygon = ''
  if (crossIdx >= 0) {
    const topPts: string[] = []
    const bottomPts: string[] = []
    for (let i = crossIdx; i < years.length; i++) {
      topPts.push(`${xScale(i)},${yScale(cac[i])}`)
      bottomPts.unshift(`${xScale(i)},${yScale(aov[i])}`)
    }
    dangerPolygon = [...topPts, ...bottomPts].join(' ')
  }

  // Approximate line lengths for dash animation
  const pathLength = 1200

  // Y-axis tick values
  const yTicks = []
  for (let v = Math.ceil(yMin / 10) * 10; v <= yMax; v += 10) {
    yTicks.push(v)
  }

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        style={{ maxHeight: '420px' }}
      >
        {/* Y-axis ticks and labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              y1={yScale(v)}
              x2={PAD.left + PLOT_W}
              y2={yScale(v)}
              stroke="var(--color-warm-gray-3)"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={yScale(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="var(--color-warm-gray-3)"
              fontSize={11}
              fontFamily="var(--font-sans)"
            >
              ${v}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {years.map((yr, i) => (
          <text
            key={yr}
            x={xScale(i)}
            y={H - 10}
            textAnchor="middle"
            fill="var(--color-warm-gray-3)"
            fontSize={12}
            fontFamily="var(--font-sans)"
          >
            {yr}
          </text>
        ))}

        {/* Danger zone fill */}
        {dangerPolygon && (
          <polygon
            points={dangerPolygon}
            fill="var(--color-burgundy)"
            style={{
              opacity: revealed ? 0.15 : 0,
              transition: 'opacity 1.2s ease-out 0.8s',
            }}
          />
        )}

        {/* AOV line */}
        <polyline
          points={aovPoints}
          fill="none"
          stroke="var(--color-warm-gray-2)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          style={{
            strokeDashoffset: revealed ? 0 : pathLength,
            transition: 'stroke-dashoffset 1.5s ease-out 0.2s',
          }}
        />

        {/* CAC line */}
        <polyline
          points={cacPoints}
          fill="none"
          stroke="var(--color-warning)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          style={{
            strokeDashoffset: revealed ? 0 : pathLength,
            transition: 'stroke-dashoffset 1.5s ease-out 0.2s',
          }}
        />

        {/* Data point dots — AOV */}
        {aov.map((v, i) => (
          <circle
            key={`aov-${i}`}
            cx={xScale(i)}
            cy={yScale(v)}
            r={4}
            fill="var(--color-bg)"
            stroke="var(--color-warm-gray-2)"
            strokeWidth={2}
            style={{
              opacity: revealed ? 1 : 0,
              transition: `opacity 0.4s ease-out ${0.3 + i * 0.15}s`,
            }}
          />
        ))}

        {/* Data point dots — CAC */}
        {cac.map((v, i) => (
          <circle
            key={`cac-${i}`}
            cx={xScale(i)}
            cy={yScale(v)}
            r={4}
            fill="var(--color-bg)"
            stroke="var(--color-warning)"
            strokeWidth={2}
            style={{
              opacity: revealed ? 1 : 0,
              transition: `opacity 0.4s ease-out ${0.3 + i * 0.15}s`,
            }}
          />
        ))}

        {/* End labels — CAC */}
        <text
          x={xScale(years.length - 1) + 10}
          y={yScale(cac[cac.length - 1])}
          dominantBaseline="middle"
          fill="var(--color-warning)"
          fontSize={12}
          fontWeight={600}
          fontFamily="var(--font-sans)"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.5s ease-out 1.2s',
          }}
        >
          CAC ${cac[cac.length - 1]}
        </text>

        {/* End labels — AOV */}
        <text
          x={xScale(years.length - 1) + 10}
          y={yScale(aov[aov.length - 1])}
          dominantBaseline="middle"
          fill="var(--color-warm-gray-2)"
          fontSize={12}
          fontWeight={600}
          fontFamily="var(--font-sans)"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.5s ease-out 1.2s',
          }}
        >
          AOV ${aov[aov.length - 1]}
        </text>

        {/* Crossover point annotation */}
        {crossIdx >= 0 && (
          <g
            style={{
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.6s ease-out 1.4s',
            }}
          >
            {/* Vertical dashed line at crossover */}
            <line
              x1={crossX}
              y1={PAD.top}
              x2={crossX}
              y2={PAD.top + PLOT_H}
              stroke="var(--color-burgundy)"
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            {/* Crossover dot */}
            <circle
              cx={crossX}
              cy={crossY}
              r={6}
              fill="var(--color-burgundy)"
              fillOpacity={0.8}
            />
            <circle
              cx={crossX}
              cy={crossY}
              r={10}
              fill="none"
              stroke="var(--color-burgundy)"
              strokeWidth={1.5}
              strokeOpacity={0.4}
            />
          </g>
        )}
      </svg>

      {/* Crossover callout below chart */}
      {crossoverNote && (
        <div
          className="mt-6 border-l-2 pl-5 max-w-xl"
          style={{
            borderColor: 'var(--color-burgundy)',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease-out 1.6s, transform 0.6s ease-out 1.6s',
          }}
        >
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: 'var(--color-warm-gray-1)', fontFamily: 'var(--font-serif)' }}
          >
            {crossoverNote}
          </p>
        </div>
      )}
    </div>
  )
}
