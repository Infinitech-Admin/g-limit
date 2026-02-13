'use client'
import { Card } from '@/components/ui/card'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Aperture, Focus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState, useMemo, memo } from 'react'

// Lazy load the particles component since it's decorative
const FloatingParticles = dynamic(
  () => import('@/components/home/animated-golden-particles'),
  { ssr: false }
)

interface CategoryImage {
  id: number
  category_id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  name: string
  description?: string
  images: CategoryImage[]
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

// Rotate through icons based on category index
const iconRotation = [Camera, Focus, Aperture, Camera]

// Simplified animations for better performance
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

const smoothTransition = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }

// Memoized category card component
const CategoryCard = memo(({ 
  category, 
  index, 
  imageUrl,
  shouldReduceMotion 
}: { 
  category: Category
  index: number
  imageUrl: string
  shouldReduceMotion: boolean
}) => {
  const IconComponent = iconRotation[index % iconRotation.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px', amount: 0.3 }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="group relative overflow-hidden border-0 bg-transparent cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          {/* Image container */}
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
              loading={index < 4 ? 'eager' : 'lazy'}
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Gold overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#d4a574]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Simplified corner brackets - only show on hover */}
          {!shouldReduceMotion && (
            <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Top-left corner */}
              <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-[#d4a574]">
                <div className="absolute top-0 left-0 w-2 h-2 bg-[#d4a574] rounded-full" />
              </div>

              {/* Top-right corner */}
              <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-[#d4a574]">
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#d4a574] rounded-full" />
              </div>

              {/* Bottom-left corner */}
              <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-[#d4a574]">
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#d4a574] rounded-full" />
              </div>

              {/* Bottom-right corner */}
              <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-[#d4a574]">
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#d4a574] rounded-full" />
              </div>

              {/* Simplified center focus point */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 border-2 border-[#d4a574] rounded-full opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#d4a574] rounded-full shadow-lg shadow-[#d4a574]/50" />
              </div>

              {/* Grid overlay - rule of thirds */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-[#d4a574]/40" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-[#d4a574]/40" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-[#d4a574]/40" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-[#d4a574]/40" />
              </div>
            </div>
          )}

          {/* Category info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            {/* Icon badge */}
            <div className="w-14 h-14 bg-gradient-to-br from-[#d4a574] to-[#c9944a] rounded-full flex items-center justify-center mb-4 border-2 border-black shadow-xl shadow-[#d4a574]/30 transition-transform duration-300 group-hover:scale-110">
              <IconComponent className="w-7 h-7 text-black" />
            </div>

            <h3 className="text-3xl font-serif font-light text-white mb-3 group-hover:text-[#d4a574] transition-colors duration-300">
              {category.name}
            </h3>

            {/* Animated gold line */}
            <div className="h-1 bg-gradient-to-r from-[#d4a574] to-transparent w-full" />

            {/* Explore text */}
            <p className="text-[#d4a574] text-sm font-bold mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
              EXPLORE
              <span>→</span>
            </p>
          </div>

          {/* Camera settings overlay */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-[#d4a574] px-3 py-1.5 rounded-full text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-[#d4a574]/30">
            <span>● REC</span>
          </div>

          {/* Border glow effect */}
          <div className="absolute inset-0 rounded-lg border-2 border-[#d4a574]/0 group-hover:border-[#d4a574]/50 transition-all duration-300 shadow-lg shadow-[#d4a574]/0 group-hover:shadow-[#d4a574]/30" />
        </div>
      </Card>
    </motion.div>
  )
})

CategoryCard.displayName = 'CategoryCard'

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?perPage=20', {
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const json = await response.json()
        const categoryData = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []
        setCategories(categoryData)
      } catch (error) {
        console.error('[v0] Failed to fetch categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getImageUrl = useMemo(() => {
    return (path: string) => {
      if (!path) return '/placeholder.png'
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      const cleanPath = path.startsWith('/') ? path.slice(1) : path
      return `${API_IMG}/${cleanPath}`
    }
  }, [])

  const categoryCards = useMemo(() => {
    return categories.map((category, index) => {
      const firstImage = category.images?.[0]
      const imageUrl = firstImage ? getImageUrl(firstImage.image_path) : '/placeholder.png'
      
      return (
        <CategoryCard
          key={category.id}
          category={category}
          index={index}
          imageUrl={imageUrl}
          shouldReduceMotion={!!shouldReduceMotion}
        />
      )
    })
  }, [categories, getImageUrl, shouldReduceMotion])

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Black to gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1410] to-[#2a1f15]" />

      {/* Radial gold glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl" />

      {/* Animated gold particles - lazy loaded */}
      {!shouldReduceMotion && <FloatingParticles count={15} />}

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px', amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} transition={smoothTransition} className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4a574]" />
            <p className="text-[#d4a574] font-black tracking-[0.3em] text-sm">OUR SERVICES</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4a574]" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            transition={smoothTransition}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-4"
          >
            What We <span className="bg-gradient-to-r from-[#d4a574] via-[#e0b584] to-[#d4a574] bg-clip-text text-transparent">Capture</span>
          </motion.h2>

          <motion.p variants={fadeInUp} transition={smoothTransition} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every frame tells a story. Explore our specialized photography services crafted with precision and passion.
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-400">Loading categories...</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-400">No categories available</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryCards}
          </div>
        )}
      </div>
    </section>
  )
}
