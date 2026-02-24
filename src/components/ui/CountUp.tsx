'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CountUpProps {
  end: number
  duration?: number
  decimals?: number
}

export default function CountUp({ end, duration = 1.8, decimals }: CountUpProps) {
  const [display, setDisplay] = useState('0')
  const elementRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef({ val: 0 })

  // Auto-detect decimal places from the end value
  const decimalPlaces = decimals ?? (end % 1 !== 0 ? (end.toString().split('.')[1]?.length ?? 1) : 0)

  useGSAP(() => {
    if (!elementRef.current) return

    ScrollTrigger.create({
      trigger: elementRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(valueRef.current, {
          val: end,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplay(valueRef.current.val.toFixed(decimalPlaces))
          },
        })
      },
    })
  })

  return <span ref={elementRef}>{display}</span>
}
