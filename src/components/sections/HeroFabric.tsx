'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_CONTENT } from '@/lib/data/mockData'

import vertexShader from '@/shaders/fabric/vertex.glsl'
import fragmentShader from '@/shaders/fabric/fragment.glsl'

function FabricMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uNoiseScale: { value: 1.5 },
    uBaseColor: { value: new THREE.Color('#FFBE98') },
    uHighlightColor: { value: new THREE.Color('#E8C57A') },
    uSheen: { value: 0.8 },
  }), [])

  // Animate time
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  // Bind scroll progress via GSAP ScrollTrigger
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
    <mesh ref={meshRef} scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}>
      <planeGeometry args={[1, 1, 128, 128]} />
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

export default function HeroFabric() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative h-[200vh] w-full"
    >
      {/* Sticky canvas container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          camera={{ position: [0, 0, 2], fov: 50 }}
        >
          <FabricMesh />
          <EffectComposer>
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
              mipmapBlur
              resolutionScale={0.5}
            />
            <Vignette darkness={0.5} offset={0.3} />
            <Noise opacity={0.03} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        </Canvas>

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <h1
            className="text-6xl md:text-8xl font-bold tracking-tighter"
            style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-serif)' }}
          >
            {HERO_CONTENT.title}
          </h1>
          <p
            className="mt-6 text-lg md:text-xl tracking-wide max-w-lg text-center"
            style={{ color: 'var(--color-warm-gray-2)' }}
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
