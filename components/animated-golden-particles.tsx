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

// ✅ Safe polyfill — requestIdleCallback is not supported on ANY iOS Safari
const requestIdle = (cb: IdleRequestCallback, opts?: IdleRequestOptions): number => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return window.requestIdleCallback(cb, opts)
  }
  // Fallback: use setTimeout with a small delay
  const start = Date.now()
  return window.setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    })
  }, 1) as unknown as number
}

const cancelIdle = (id: number): void => {
  if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
    window.cancelIdleCallback(id)
  } else {
    clearTimeout(id)
  }
}

export default function FloatingParticles({ count = 40 }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const id = requestIdle(
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
    return () => cancelIdle(id)
  }, [count])

  return (
    <>
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
              "--x-move": `${p.xMove}px`,
              animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              willChange: "transform, opacity",
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  )
}
