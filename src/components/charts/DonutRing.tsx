'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Segment {
  label: string
  pct: number
  color: string
}

interface DonutRingProps {
  segments: readonly Segment[]
  totalLabel: string
  totalSublabel: string
  size?: number
  className?: string
}

export default function DonutRing({
  segments,
  totalLabel,
  totalSublabel,
  size = 280,
  className = '',
}: DonutRingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRefs = useRef<(SVGCircleElement | null)[]>([])

  const radius = (size - 48) / 2
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  useGSAP(
    () => {
      if (!containerRef.current) return

      const circles = circleRefs.current.filter(Boolean) as SVGCircleElement[]

      // Set initial state — all hidden
      circles.forEach((circle) => {
        gsap.set(circle, { strokeDashoffset: circumference })
      })

      // Animate each segment arc
      gsap.to(circles, {
        strokeDashoffset: (i: number) => {
          const seg = segments[i]
          return circumference - (circumference * seg.pct) / 100
        },
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      })

      // Fade in labels
      const labels = containerRef.current.querySelectorAll('.donut-label')
      gsap.fromTo(
        labels,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Center text
      const centerText = containerRef.current.querySelector('.donut-center')
      gsap.fromTo(
        centerText,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: containerRef }
  )

  // Calculate cumulative offsets for each segment
  let cumulativeOffset = 0

  return (
    <div ref={containerRef} className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-bg-card)"
          strokeWidth={strokeWidth}
          opacity={0.5}
        />

        {/* Segment arcs */}
        {segments.map((seg, i) => {
          const offset = cumulativeOffset
          cumulativeOffset += (circumference * seg.pct) / 100

          return (
            <circle
              key={i}
              ref={(el) => { circleRefs.current[i] = el }}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="butt"
              transform={`rotate(${-90 + (offset / circumference) * 360} ${center} ${center})`}
              style={{ transition: 'none' }}
            />
          )
        })}

        {/* Center text */}
        <g className="donut-center">
          <text
            x={center}
            y={center - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-cream)"
            fontSize={size > 240 ? 32 : 24}
            fontWeight={700}
            fontFamily="var(--font-serif)"
          >
            {totalLabel}
          </text>
          <text
            x={center}
            y={center + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text-secondary)"
            fontSize={11}
            fontFamily="var(--font-sans)"
            letterSpacing="0.05em"
          >
            {totalSublabel}
          </text>
        </g>
      </svg>

      {/* Legend labels below */}
      <div className="mt-6 space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="donut-label flex items-center gap-3 px-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: seg.color }}
            />
            <span
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {seg.label}
            </span>
            <span
              className="text-sm tabular-nums ml-auto"
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
