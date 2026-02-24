'use client'

import { forwardRef } from 'react'

interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  labelColor?: string
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ label, title, subtitle, labelColor = 'var(--color-peach)' }, ref) => {
    return (
      <div ref={ref} className="mx-auto max-w-[var(--max-content)] px-8 md:px-20 pt-32 md:pt-48 pb-12 md:pb-16">
        <p
          className="text-[11px] tracking-[0.4em] uppercase mb-4"
          style={{ color: labelColor }}
        >
          {label}
        </p>
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-5 text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    )
  }
)

SectionHeader.displayName = 'SectionHeader'
export default SectionHeader
