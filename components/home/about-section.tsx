"use client"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Sparkles, Camera } from "lucide-react"
import { useRef, useMemo, memo } from "react"
import { CountingNumber } from "../ui/shadcn-io/counting-number"
import { useIsMobile, useIsTablet } from "@/hooks/use-device"
import dynamic from 'next/dynamic'

// Lazy load particles
const FloatingParticles = dynamic(
  () => import("../animated-golden-particles"),
  { ssr: false }
)

const stats = [
  { value: 20, suffix: "+", label: "Projects Completed" },
  { value: 1, suffix: "+", label: "Year Experience" },
  { value: 5, suffix: "K+", label: "Photos Delivered" },
]

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-4.22-5.78l1.42-1.42m-12.72 0l1.42 1.42m0 10.56l-1.42 1.42m12.72 0l-1.42-1.42" />
      </svg>
    ),
    title: "Expert Lighting",
    description: "Mastery of natural and studio lighting techniques",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    title: "Premium Equipment",
    description: "State-of-the-art cameras and professional gear",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Artistic Vision",
    description: "Unique creative perspective in every shot",
  },
]

// Memoized feature card component
const FeatureCard = memo(({ 
  feature, 
  index, 
  shouldReduceMotion 
}: { 
  feature: typeof features[0];
  index: number;
  shouldReduceMotion: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.1 + index * 0.1 }}
      className="flex items-start gap-4 group cursor-pointer"
      whileHover={shouldReduceMotion ? {} : { x: 12 }}
    >
      <div
        className="w-14 h-14 border-2 flex items-center justify-center shadow-lg shrink-0 transition-all duration-300"
        style={{
          background: "rgba(245, 217, 138, 0.1)",
          borderColor: "rgba(245, 217, 138, 0.4)",
          boxShadow: "0 4px 20px rgba(245, 217, 138, 0.2)",
          color: "#f5d98a",
        }}
      >
        {feature.icon}
      </div>
      <div>
        <h4 className="font-bold text-white mb-2 text-lg">{feature.title}</h4>
        <p className="text-gray-400 text-sm">{feature.description}</p>
      </div>
    </motion.div>
  )
})

FeatureCard.displayName = 'FeatureCard'

// Memoized stat card component
const StatCard = memo(({ 
  stat, 
  index, 
  shouldReduceMotion 
}: { 
  stat: typeof stats[0];
  index: number;
  shouldReduceMotion: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        delay: shouldReduceMotion ? 0 : 0.1 + index * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className="text-center"
      whileHover={shouldReduceMotion ? {} : { y: -10, scale: 1.05 }}
    >
      <div
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4"
        style={{
          background: "linear-gradient(to right, #f5d98a, #ecc84e, #f5d98a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 30px rgba(245, 217, 138, 0.5))",
        }}
      >
        <CountingNumber number={stat.value} />
        {stat.suffix}
      </div>
      <p className="text-sm sm:text-base md:text-lg uppercase tracking-widest font-bold" style={{ color: "#f5d98a" }}>
        {stat.label}
      </p>
    </motion.div>
  )
})

StatCard.displayName = 'StatCard'

// Memoized film perforation component
const FilmPerforation = memo(({ 
  index, 
  side, 
  shouldReduceMotion 
}: { 
  index: number;
  side: 'left' | 'right';
  shouldReduceMotion: boolean;
}) => {
  return (
    <motion.div
      className="w-8 h-5 rounded-sm"
      style={{
        background: "linear-gradient(to bottom, #f5d98a, #ecc84e)",
        boxShadow: "0 0 15px rgba(245, 217, 138, 0.6), inset 0 1px 2px rgba(255,255,255,0.3)",
      }}
      initial={{ opacity: 0, scale: 0, x: side === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ 
        delay: shouldReduceMotion ? 0 : index * 0.02, 
        duration: 0.3, 
        type: "spring", 
        stiffness: 200 
      }}
    />
  )
})

FilmPerforation.displayName = 'FilmPerforation'

export default function AboutSection() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  // Memoize perforation count
  const perforationCount = useMemo(() => {
    return isMobile ? 40 : 20
  }, [isMobile])

  const filmStripCount = useMemo(() => {
    return isMobile ? 4 : isTablet ? 12 : 24
  }, [isMobile, isTablet])

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden" style={{ backgroundColor: "#1a1610" }}>
      {/* Simplified gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a1610 0%, #241d0f 30%, #2e2410 60%, #1a1610 100%)",
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Animated light gold particles - lazy loaded, reduced count */}
      {!shouldReduceMotion && <FloatingParticles count={30} />}

      {/* Film perforations - simplified */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-black/95 to-transparent z-20">
        <div className="h-full flex flex-col justify-around items-center py-8">
          {[...Array(perforationCount)].map((_, i) => (
            <FilmPerforation key={i} index={i} side="left" shouldReduceMotion={!!shouldReduceMotion} />
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-black/95 to-transparent z-20">
        <div className="h-full flex flex-col justify-around items-center py-8">
          {[...Array(perforationCount)].map((_, i) => (
            <FilmPerforation key={i} index={i} side="right" shouldReduceMotion={!!shouldReduceMotion} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-18 lg:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="w-6 h-6" style={{ color: "#f5d98a" }} />
            <p className="font-black tracking-[0.3em] text-sm" style={{ color: "#f5d98a" }}>
              ABOUT US
            </p>
            <Sparkles className="w-6 h-6" style={{ color: "#f5d98a" }} />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
            <span className="text-white">Crafting Visual</span>
            <br />
            <span
              style={{
                background: "linear-gradient(to right, #f5d98a, #ecc84e, #f5d98a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Stories Since 2025
            </span>
          </h2>

          {/* Decorative line */}
          <div
            className="h-1 w-32 mx-auto mt-8"
            style={{
              background: "linear-gradient(to right, transparent, #f5d98a, transparent)",
            }}
          />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center justify-center mb-32">
          {/* Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative max-w-sm mx-auto">
              <div
                className="relative aspect-4/5 h-80 md:h-[420px] lg:h-[500px] overflow-hidden border-4 shadow-2xl"
                style={{
                  borderColor: "rgba(245, 217, 138, 0.5)",
                  boxShadow: "0 25px 70px rgba(245, 217, 138, 0.4)",
                }}
              >
                <Image
                  src="/photo/photographer-working-in-professional-studio-with-c.jpg"
                  alt="G-Limit Studio photographer"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 mix-blend-multiply"
                  style={{
                    background: "linear-gradient(to top, rgba(26, 22, 16, 0.9), transparent, rgba(26, 22, 16, 0.4))",
                  }}
                />

                {/* Simplified corner brackets */}
                <div className="absolute inset-4">
                  {[
                    { top: 0, left: 0, borderLeft: "3px solid #f5d98a", borderTop: "3px solid #f5d98a" },
                    { top: 0, right: 0, borderRight: "3px solid #f5d98a", borderTop: "3px solid #f5d98a" },
                    { bottom: 0, left: 0, borderLeft: "3px solid #f5d98a", borderBottom: "3px solid #f5d98a" },
                    { bottom: 0, right: 0, borderRight: "3px solid #f5d98a", borderBottom: "3px solid #f5d98a" },
                  ].map((style, i) => (
                    <div
                      key={i}
                      className="absolute w-8 h-8"
                      style={style}
                    />
                  ))}
                </div>
              </div>

              {/* Camera settings badge */}
              <div
                className="absolute top-1/4 -right-2 sm:-right-6 sm:top-1/3 md:-right-10 md:top-1/4 lg:-right-16 lg:top-1/4 text-black p-3 sm:p-4 md:p-6 font-mono text-xs sm:text-sm md:text-base font-bold space-y-2 shadow-xl border-2 border-black rounded-lg transition-transform duration-300 hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #f5d98a, #ecc84e)",
                  boxShadow: "0 10px 40px rgba(245, 217, 138, 0.5)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>PRO</span>
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
                <div className="text-black/90">f/1.4</div>
                <div className="text-black/90">1/250s</div>
                <div className="text-black/90">ISO 100</div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="space-y-8 mx-6">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-sm lg:text-xl leading-relaxed"
            >
              G-Limit Studio is dedicated to capturing life&apos;s precious moments with artistry and precision. Our team of experienced photographers
              brings a unique blend of technical expertise and creative vision to every project.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-sm lg:text-xl leading-relaxed"
            >
              From intimate portraits to grand celebrations, we approach each session with the same dedication to excellence and attention to detail
              that has made us a trusted name in photography.
            </motion.p>

            {/* Features */}
            <div className="space-y-6 pt-8">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={feature.title} 
                  feature={feature} 
                  index={index}
                  shouldReduceMotion={!!shouldReduceMotion}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6"
            >
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="group bg-transparent border-2 font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#f5d98a] hover:to-[#ecc84e] hover:text-black"
                  style={{
                    borderColor: "#f5d98a",
                    color: "#f5d98a",
                  }}
                >
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats section with film strip */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Film strip top border */}
          <div className="h-12 bg-black flex items-center justify-around mb-2 border-y-2" style={{ borderColor: "#f5d98a" }}>
            {[...Array(filmStripCount)].map((_, i) => (
              <div
                key={i}
                className="w-5 h-6 rounded-sm shadow-lg border"
                style={{
                  background: "linear-gradient(to bottom, #f5d98a, #ecc84e)",
                  boxShadow: "0 0 15px rgba(245, 217, 138, 0.6)",
                  borderColor: "#fae9a0",
                }}
              />
            ))}
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 py-10 sm:py-16 md:py-20 bg-black px-4 sm:px-8 md:px-12 backdrop-blur-sm border-x-2"
            style={{ borderColor: "#f5d98a" }}
          >
            {stats.map((stat, index) => (
              <StatCard 
                key={stat.label} 
                stat={stat} 
                index={index}
                shouldReduceMotion={!!shouldReduceMotion}
              />
            ))}
          </div>

          {/* Film strip bottom border */}
          <div className="h-12 bg-black flex items-center justify-around mt-2 border-y-2" style={{ borderColor: "#f5d98a" }}>
            {[...Array(filmStripCount)].map((_, i) => (
              <div
                key={i}
                className="w-5 h-6 rounded-sm shadow-lg border"
                style={{
                  background: "linear-gradient(to bottom, #f5d98a, #ecc84e)",
                  boxShadow: "0 0 15px rgba(245, 217, 138, 0.6)",
                  borderColor: "#fae9a0",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
