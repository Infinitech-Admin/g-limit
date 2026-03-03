"use client"
import { useEffect, useState } from "react"

interface Particle {
  size: number
  left: number
  top: number
  xMove: number
  duration: number
  delay: number
}

interface FloatingParticlesProps {
  count?: number
}

export default function FloatingParticles({ count = 40 }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Defer generation until the browser is idle — never blocks LCP or TTI
    const id = requestIdleCallback(
      () => {
        setParticles(
          Array.from({ length: count }, () => ({
            size: 1 + Math.random() * 4,
            left: Math.random() * 100,
            top: Math.random() * 100,
            xMove: Math.random() * 40 - 20,
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 5,
          }))
        )
      },
      { timeout: 3000 }
    )
    return () => cancelIdleCallback(id)
  }, [count])

  return (
    <>
      {/*
        All animation is CSS keyframes — runs on the compositor thread,
        zero JS per frame, zero Framer Motion overhead.
        opacity + transform are the only two GPU-composited properties,
        so no paint is triggered after the first render.
      */}
      <style>{`
        @keyframes particle-float {
          0%   { opacity: 0; transform: translateY(0px)   translateX(0px)   scale(0); }
          20%  { opacity: 0.8; }
          50%  { transform: translateY(-80px) translateX(var(--x-move)) scale(1.8); }
          80%  { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(0px)   translateX(0px)   scale(0); }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: "radial-gradient(circle, #FFD700, #FFA500)",
              // boxShadow removed — was forcing repaint on every frame
              // Use a CSS variable for the x offset per particle
              "--x-move": `${p.xMove}px`,
              animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              // opacity + transform only — both compositor-only, no layout, no paint
              willChange: "transform, opacity",
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  )
}
