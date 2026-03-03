"use client"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRef, useState, useEffect, useCallback, memo } from "react"
import { Camera, Award, Users, Heart, Aperture, Star, CheckCircle2, Sparkles } from "lucide-react"
import dynamic from 'next/dynamic'

const FloatingParticles = dynamic(
  () => import("../animated-golden-particles"),
  { ssr: false }
)

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

// ✅ Moved outside — pure function, no need to be inside component or useCallback
function getImageUrl(path: string): string {
  if (!path) return '/placeholder.svg'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${API_IMG}/${path.startsWith('/') ? path.slice(1) : path}`
}

interface HeroImage {
  id: number
  image_path: string | string[]
  image_urls?: string[]
  status: 'active' | 'inactive'
}

// ✅ Static fallbacks defined outside — never recreated
const FALLBACK_IMAGES = [
  "/photo/elegant-bride-in-white-wedding-dress-portrait-phot.jpg",
  "/photo/happy-couple-embracing-sunset-wedding-photography.jpg",
  "/photo/fashion-model-elegant-portrait-photography-studio.jpg",
  "/photo/newborn-baby-sleeping-peaceful-portrait-photograph.jpg",
]

const STATS = [
  { icon: Camera,  value: "500+", label: "Photo Sessions" },
  { icon: Users,   value: "300+", label: "Happy Clients"  },
  { icon: Award,   value: "15+",  label: "Awards Won"     },
  { icon: Heart,   value: "10",   label: "Years Experience"},
]

const SERVICES = ["Wedding Photography", "Portrait Sessions", "Event Coverage", "Commercial Shoots"]

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = memo(({ stat, index, shouldReduceMotion }: {
  stat: typeof STATS[0]
  index: number
  shouldReduceMotion: boolean
}) => {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : 0.3 + index * 0.1, duration: 0.5 }}
      className="text-center group"
      whileHover={shouldReduceMotion ? {} : { y: -5 }}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-amber-200/40 group-hover:to-yellow-200/40 transition-all border border-amber-200/30 shadow-lg shadow-amber-200/20">
        <Icon className="w-6 h-6 text-amber-200" />
      </div>
      <p className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent">
        {stat.value}
      </p>
      <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
    </motion.div>
  )
})
StatCard.displayName = 'StatCard'

// ─── Hero Image Slideshow ─────────────────────────────────────────────────────
// ✅ Extracted into its own component so the parent doesn't re-render on every image change
const HeroImageSlider = memo(({ images, shouldReduceMotion }: {
  images: string[]
  shouldReduceMotion: boolean
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlashing, setIsFlashing] = useState(false)
  const [showCaptured, setShowCaptured] = useState(false)

  const shoot = useCallback(() => {
    if (images.length === 0) return
    setIsFlashing(true)
    setShowCaptured(true)
    // ✅ Use CSS transition for flash — no AnimatePresence re-mount
    setTimeout(() => setIsFlashing(false), 150)
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
      setShowCaptured(false)
    }, 1500)
  }, [images.length])

  // ✅ Auto-advance every 4s (was 2s — too fast, caused constant re-renders)
  useEffect(() => {
    if (images.length <= 1 || shouldReduceMotion) return
    const id = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(id)
  }, [images.length, shouldReduceMotion])

  // Preload next image
  useEffect(() => {
    if (images.length <= 1) return
    const nextIndex = (currentIndex + 1) % images.length
    const img = new window.Image()
    img.src = images[nextIndex]
  }, [currentIndex, images])

  if (images.length === 0) return null

  return (
    <div className="relative">
      {/* Flash overlay — CSS opacity transition, no framer-motion */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-white pointer-events-none z-50 mix-blend-screen"
        style={{ opacity: isFlashing ? 0.8 : 0, transition: "opacity 150ms ease" }}
      />

      {/* Corner brackets */}
      <div className="absolute -top-6 -left-6 w-16 h-16 border-amber-200 border-l-4 border-t-4"><div className="absolute top-0 left-0 w-4 h-4 bg-amber-200" /></div>
      <div className="absolute -top-6 -right-6 w-16 h-16 border-amber-200 border-r-4 border-t-4"><div className="absolute top-0 right-0 w-4 h-4 bg-amber-200" /></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 border-amber-200 border-l-4 border-b-4"><div className="absolute bottom-0 left-0 w-4 h-4 bg-amber-200" /></div>
      <div className="absolute -bottom-6 -right-6 w-16 h-16 border-amber-200 border-r-4 border-b-4"><div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-200" /></div>

      <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 overflow-hidden shadow-2xl shadow-amber-900/50 border-4 border-amber-200/30">

        {/* ✅ Stack ALL images, show/hide with opacity — no AnimatePresence unmount/remount */}
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: i === currentIndex ? 1 : 0,
              transition: "opacity 400ms ease",
              // ✅ Only the active image is visible to screen readers
              visibility: i === currentIndex ? "visible" : "hidden",
            }}
          >
            <Image
              src={src}
              alt={i === 0 ? "Featured photography" : ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              // ✅ Only first 2 images are eager — rest lazy
              priority={i === 0}
              loading={i < 2 ? "eager" : "lazy"}
              quality={80}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 mix-blend-multiply" />
          </div>
        ))}

        {/* Viewfinder grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-amber-200" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-amber-200" />
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-amber-200" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-amber-200" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-amber-200 rounded-full opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-200 rounded-full shadow-lg shadow-amber-200/50" />
        </div>

        {/* Captured badge */}
        <AnimatePresence>
          {showCaptured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-200 to-yellow-100 text-black px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl z-20"
            >
              <CheckCircle2 className="w-5 h-5" /> CAPTURED!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shutter button */}
      <button
        onClick={shoot}
        aria-label="Next photo"
        className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-200 to-yellow-100 rounded-full flex items-center justify-center shadow-2xl shadow-amber-200/40 cursor-pointer hover:from-amber-100 hover:to-yellow-50 transition-all group border-4 border-black z-10"
      >
        <Aperture className="w-10 h-10 text-black group-hover:text-neutral-700 transition-colors" />
      </button>

      {/* Settings badge */}
      <div className="absolute -top-4 right-0 bg-gradient-to-r from-amber-200 to-yellow-100 text-black px-4 py-2 rounded-full text-xs font-black shadow-xl shadow-amber-200/30 flex items-center gap-2 border-2 border-black z-10">
        <span className="w-2 h-2 bg-black rounded-full" />
        f/1.4 · 1/200s · ISO 100
      </div>

      {/* Counter */}
      <div className="absolute top-16 right-0 bg-black/90 backdrop-blur-sm text-amber-200 px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-amber-200/30 z-10">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
})
HeroImageSlider.displayName = 'HeroImageSlider'

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  // ✅ fetch only once — no deps that could cause re-fetching
  useEffect(() => {
    let cancelled = false

    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-sections?status=active', {
          headers: { 'Accept': 'application/json' },
          // ✅ Cache for 1 hour in the browser too
          cache: 'force-cache',
        })
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()

        const heroSections: HeroImage[] = Array.isArray(data.data) ? data.data
          : Array.isArray(data) ? data : []

        const images: string[] = []
        heroSections.forEach(section => {
          if (section.status !== 'active') return
          if (Array.isArray(section.image_urls) && section.image_urls.length > 0) {
            images.push(...section.image_urls)
          } else if (Array.isArray(section.image_path)) {
            images.push(...section.image_path.map(getImageUrl))
          } else if (section.image_path) {
            images.push(getImageUrl(section.image_path as string))
          }
        })

        if (!cancelled) setHeroImages(images.length > 0 ? images : FALLBACK_IMAGES)
      } catch {
        if (!cancelled) setHeroImages(FALLBACK_IMAGES)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchHeroImages()
    return () => { cancelled = true }
  }, []) // ✅ empty deps — runs once

  if (loading) {
    return (
      <section ref={heroRef} className="relative flex items-center overflow-hidden pb-0 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-amber-950" />
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[calc(100dvh-6rem)]">
            <div className="relative order-1">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 bg-neutral-800 animate-pulse rounded-lg" />
            </div>
            <div className="space-y-6 order-2">
              <div className="h-8 w-48 bg-neutral-800 animate-pulse rounded" />
              <div className="h-16 w-full bg-neutral-800 animate-pulse rounded" />
              <div className="h-24 w-full bg-neutral-800 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={heroRef} className="relative flex items-center overflow-hidden pb-0 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-amber-950" />
      <div className="absolute inset-0 bg-gradient-to-t from-amber-300/10 via-transparent to-transparent" />

      {!shouldReduceMotion && <FloatingParticles count={15} />}

      {/* Gold orbs — pointer-events-none so they don't block clicks */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-yellow-100/10 rounded-full blur-3xl opacity-15 pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[calc(100dvh-6rem)] lg:min-h-0">

          {/* Image slider — isolated component, won't cause parent re-renders */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="relative order-1 lg:order-1 mb-8 lg:mb-0"
          >
            <HeroImageSlider images={heroImages} shouldReduceMotion={!!shouldReduceMotion} />
          </motion.div>

          {/* Text content — ✅ never re-renders from image changes */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-2">
            <div className="flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-amber-200" />
              <p className="text-amber-200 font-black tracking-widest text-sm">G-LIMIT STUDIO</p>
              <span className="flex items-center gap-1 text-xs text-amber-200">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-200 text-amber-200" />)}
                <span className="ml-1 font-bold">5.0</span>
              </span>
            </div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white"
              >
                We capture moments
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent"
              >
                that last forever.
              </motion.h1>
              <div className="h-1 w-32 bg-gradient-to-r from-amber-200 to-transparent" />
            </div>

            <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed">
              Professional photography and videography services for weddings, events, portraits, and commercial projects. We transform fleeting moments into timeless memories with artistic precision.
            </p>

            <div className="flex flex-wrap gap-3">
              {SERVICES.map((service) => (
                <span
                  key={service}
                  className="px-4 py-2 bg-gradient-to-r from-amber-200/10 to-yellow-100/10 border border-amber-200/30 rounded-full text-sm text-amber-200 font-medium backdrop-blur-sm hover:scale-105 transition-transform"
                >
                  {service}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/booking-form">
                <Button size="lg" className="bg-gradient-to-r from-amber-200 to-yellow-100 text-black hover:from-amber-100 hover:to-yellow-50 px-8 md:px-10 group font-bold shadow-xl shadow-amber-200/30 border-2 border-black">
                  <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book a Session
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="border-2 border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-black px-8 md:px-10 bg-black/50 backdrop-blur-sm font-bold">
                  View Portfolio
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-amber-200/20">
              {STATS.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} shouldReduceMotion={!!shouldReduceMotion} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

      {!shouldReduceMotion && (
        <div className="absolute bottom-12 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 hidden sm:block">
          <div className="w-7 h-12 border-2 border-amber-200 rounded-full flex justify-center pt-2 shadow-lg shadow-amber-200/30">
            <div className="w-1.5 h-3 bg-amber-200 rounded-full shadow-lg shadow-amber-200/50 animate-bounce" />
          </div>
        </div>
      )}
    </section>
  )
}
