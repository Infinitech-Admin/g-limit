'use client'
import { Card } from '@/components/ui/card'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Camera, Aperture, Focus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState, useMemo, memo, useCallback } from 'react'

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
const iconRotation = [Camera, Focus, Aperture, Camera]

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}
const smoothTransition = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }

// ── Modal ──────────────────────────────────────────────────────────────────
function CategoryModal({
  category,
  imageUrl,
  onClose,
}: {
  category: Category
  imageUrl: string
  onClose: () => void
}) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = category.images ?? []
  const hasMultiple = images.length > 1

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const prev = () => setImgIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setImgIndex(i => (i + 1) % images.length)

  const currentUrl = images[imgIndex]
    ? (images[imgIndex].image_path.startsWith('http')
        ? images[imgIndex].image_path
        : `${API_IMG}/${images[imgIndex].image_path.replace(/^\//, '')}`)
    : imageUrl

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-4xl rounded-xl overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ background: '#0e0e0e', border: '1px solid rgba(201,168,76,0.25)' }}
      >
        {/* Image area */}
        <div className="relative w-full" style={{ aspectRatio: "4/3", maxHeight: "75vh" }}>
          <Image
            src={currentUrl}
            alt={category.name}
            fill
            className="object-cover object-top"
            quality={90}
            unoptimized
            sizes="(max-width: 768px) 100vw, 900px"
          />

          {/* Gold gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200"
            style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c' }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Prev / Next */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Category name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-serif font-semibold text-white mb-1">{category.name}</h3>
            {category.description && (
              <p className="text-sm" style={{ color: '#a89070' }}>{category.description}</p>
            )}
          </div>
        </div>

        {/* Footer: thumbnail strip + counter */}
        {hasMultiple && (
          <div className="px-4 py-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
            <span className="text-xs font-mono ml-auto" style={{ color: 'rgba(201,168,76,0.5)' }}>
              {imgIndex + 1} / {images.length}
            </span>
            <div className="flex gap-1.5">
              {images.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: i === imgIndex ? '#c9a84c' : 'rgba(201,168,76,0.25)',
                    transform: i === imgIndex ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────
const CategoryCard = memo(({
  category,
  index,
  imageUrl,
  shouldReduceMotion,
  onClick,
}: {
  category: Category
  index: number
  imageUrl: string
  shouldReduceMotion: boolean
  onClick: () => void
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
      <Card
        className="group relative overflow-hidden border-0 bg-transparent cursor-pointer"
        onClick={onClick}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png" }}
              loading={index < 4 ? 'eager' : 'lazy'}
              quality={85}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f5d98a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {!shouldReduceMotion && (
            <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-[#f5d98a]">
                <div className="absolute top-0 left-0 w-2 h-2 bg-[#f5d98a] rounded-full" />
              </div>
              <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-[#f5d98a]">
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#f5d98a] rounded-full" />
              </div>
              <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-[#f5d98a]">
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#f5d98a] rounded-full" />
              </div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-[#f5d98a]">
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#f5d98a] rounded-full" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 border-2 border-[#f5d98a] rounded-full opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#f5d98a] rounded-full shadow-lg shadow-[#f5d98a]/50" />
              </div>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-[#f5d98a]/40" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-[#f5d98a]/40" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-[#f5d98a]/40" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-[#f5d98a]/40" />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#f5d98a] to-[#ecc84e] rounded-full flex items-center justify-center mb-4 border-2 border-black shadow-xl shadow-[#f5d98a]/30 transition-transform duration-300 group-hover:scale-110">
              <IconComponent className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-3xl font-serif font-light text-white mb-3 group-hover:text-[#f5d98a] transition-colors duration-300">
              {category.name}
            </h3>
            <div className="h-1 bg-gradient-to-r from-[#f5d98a] to-transparent w-full" />
            <p className="text-[#f5d98a] text-sm font-bold mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
              VIEW GALLERY <span>→</span>
            </p>
          </div>

          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-[#f5d98a] px-3 py-1.5 rounded-full text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-[#f5d98a]/30">
            <span>● REC</span>
          </div>
          <div className="absolute inset-0 rounded-lg border-2 border-[#f5d98a]/0 group-hover:border-[#f5d98a]/50 transition-all duration-300 shadow-lg shadow-[#f5d98a]/0 group-hover:shadow-[#f5d98a]/30" />
        </div>
      </Card>
    </motion.div>
  )
})

CategoryCard.displayName = 'CategoryCard'

// ── Section ────────────────────────────────────────────────────────────────
export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<{ category: Category; imageUrl: string } | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?perPage=20', {
          headers: { 'Accept': 'application/json' },
        })
        if (!response.ok) throw new Error('Failed to fetch categories')
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

  const getImageUrl = useCallback((path: string) => {
    if (!path) return '/placeholder.png'
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `${API_IMG}/${path.replace(/^\//, '')}`
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
          onClick={() => setSelected({ category, imageUrl })}
        />
      )
    })
  }, [categories, getImageUrl, shouldReduceMotion])

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1610] to-[#241d0f]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f5d98a]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f5d98a]/10 rounded-full blur-3xl" />
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
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#f5d98a]" />
            <p className="text-[#f5d98a] font-black tracking-[0.3em] text-sm">OUR SERVICES</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#f5d98a]" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            transition={smoothTransition}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-4"
          >
            What We <span className="bg-gradient-to-r from-[#f5d98a] via-[#fae9a0] to-[#f5d98a] bg-clip-text text-transparent">Capture</span>
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

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <CategoryModal
            category={selected.category}
            imageUrl={selected.imageUrl}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
