'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register at module level — MUST happen before any useGSAP calls
gsap.registerPlugin(ScrollTrigger, useGSAP)
gsap.ticker.lagSmoothing(0)

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
