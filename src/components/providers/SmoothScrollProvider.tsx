'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.08,
      duration: 1.4,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    // Bind Lenis scroll to ScrollTrigger update
    lenis.on('scroll', ScrollTrigger.update)

    // GSAP ticker drives Lenis RAF — single animation loop owner
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000) // GSAP ticker uses seconds, Lenis expects ms
    }
    gsap.ticker.add(tickerCallback)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
