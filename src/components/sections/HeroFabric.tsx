'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_CONTENT } from '@/lib/data/mockData'
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

import vertexShader from '@/shaders/fabric/vertex.glsl'
import fragmentShader from '@/shaders/fabric/fragment.glsl'

function FabricMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uNoiseScale: { value: 1.5 },
    uBaseColor: { value: new THREE.Color('#F5C4A0') },
    uHighlightColor: { value: new THREE.Color('#E0C498') },
    uSheen: { value: 0.65 },
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      // Slow down time progression — no need for 60fps precision on fabric sway
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5
    }
  })

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: '#hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uScrollProgress.value = self.progress
        }
      },
    })
  })

  return (
    <mesh scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}>
      {/* Reduced from 128x128 to 48x48 — 7x fewer vertices, visually identical */}
      <planeGeometry args={[1, 1, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** Static CSS gradient fallback for mobile / reduced-motion */
function FabricFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse at 35% 45%, #F5C4A0 0%, transparent 55%),
          radial-gradient(ellipse at 65% 55%, #E0C498 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, #C4A882 0%, transparent 70%),
          linear-gradient(135deg, #2A2218 0%, #1A1410 40%, #0A0A0A 100%)
        `,
      }}
    />
  )
}

export default function HeroFabric() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()

  // Use static fallback on mobile or when user prefers reduced motion
  const useStaticFallback = isMobile || prefersReducedMotion

  // Pause Canvas rendering when hero is off-screen
  useEffect(() => {
    if (useStaticFallback) return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [useStaticFallback])

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative h-[200vh] w-full"
    >
      {/* Sticky canvas container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {useStaticFallback ? (
          <FabricFallback />
        ) : (
          <Canvas
            dpr={1}
            gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
            camera={{ position: [0, 0, 2], fov: 50 }}
            frameloop={isVisible ? 'always' : 'never'}
          >
            <FabricMesh />
          </Canvas>
        )}

        {/* CSS vignette replacement — zero GPU cost */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.3) 100%)',
          }}
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
          <h1
            className="text-5xl md:text-8xl font-bold tracking-tighter text-center"
            style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
          >
            {HERO_CONTENT.title}
          </h1>
          <p
            className="mt-4 md:mt-6 text-base md:text-xl tracking-wide max-w-lg text-center"
            style={{ color: 'var(--color-warm-gray-1)', opacity: 0.75 }}
          >
            {HERO_CONTENT.subtitle}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-warm-gray-3)' }}>
            Scroll
          </span>
          <div className="w-px h-8" style={{ background: 'var(--color-warm-gray-3)' }} />
        </div>
      </div>
    </section>
  )
}
