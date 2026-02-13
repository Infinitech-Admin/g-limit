'use client'
import { useEffect, useRef, useMemo } from 'react'

interface FloatingParticlesProps {
  count?: number
  color?: string // "r, g, b"
}

export default function FloatingParticles({
  count = 15,
  color = '212, 165, 116',
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true, // Better performance
    })
    if (!context) return

    const ctx: CanvasRenderingContext2D = context
    let width = window.innerWidth
    let height = window.innerHeight

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for performance
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }
    setCanvasSize()

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
      maxOpacity: number
      phaseOffset: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        // Slower movement for better performance
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.radius = Math.random() * 1.5 + 0.5
        this.opacity = Math.random() * 0.5 + 0.2
        this.maxOpacity = this.opacity
        this.phaseOffset = Math.random() * Math.PI * 2
      }

      update(deltaTime: number) {
        // Use deltaTime for consistent animation speed
        const speed = deltaTime / 16 // Normalize to 60fps
        
        this.x += this.vx * speed
        this.y += this.vy * speed

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1

        // Keep within bounds
        this.x = Math.max(0, Math.min(width, this.x))
        this.y = Math.max(0, Math.min(height, this.y))

        // Slower opacity pulse for better performance
        this.opacity = this.maxOpacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.0005 + this.phaseOffset))
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`
        ctx.fill()
      }
    }

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => new Particle())

    // Optimized animation loop with FPS throttling
    const animate = (currentTime: number) => {
      // Throttle to max 60fps
      const deltaTime = currentTime - lastTimeRef.current
      if (deltaTime < 16) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTimeRef.current = currentTime

      // Clear canvas efficiently
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        p.update(deltaTime)
        p.draw()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    lastTimeRef.current = performance.now()
    animate(lastTimeRef.current)

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth
        height = window.innerHeight
        setCanvasSize()
        // Reposition particles to new bounds
        particlesRef.current.forEach(p => {
          p.x = Math.min(p.x, width)
          p.y = Math.min(p.y, height)
        })
      }, 150) // Debounce resize
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [count, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ willChange: 'auto' }} // Remove will-change when not needed
    />
  )
}
