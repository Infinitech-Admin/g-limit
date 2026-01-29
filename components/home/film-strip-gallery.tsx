"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"

interface GalleryImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || 'http://localhost:8000'

export function FilmStripGallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    fetch('/api/film-strip?perPage=12')
      .then(res => res.json())
      .then(json => {
        const images = Array.isArray(json.data) ? json.data : []
        setGalleryImages(images)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.svg'
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  if (loading) {
    return (
      <section className="py-20 bg-[#0a0a0a] min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#d4a574] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        <div className="text-[#d4a574] text-xl relative z-10">Loading gallery...</div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20 bg-[#0a0a0a] min-h-screen relative overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#d4a574] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-[#d4a574] mb-4">
              Gallery
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Capturing moments that matter
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.map((image, index) => {
              // Create varied sizes for visual interest
              const isLarge = index === 0 || index === 5 || index === 8
              const isTall = index === 2 || index === 7
              
              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  onClick={() => setSelectedImage(image)}
                  className={`
                    relative group overflow-hidden rounded-xl cursor-pointer
                    ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                    ${isTall ? 'md:row-span-2' : ''}
                    ${!isLarge && !isTall ? 'aspect-square' : ''}
                    bg-gradient-to-br from-[#1a1a1a] to-black
                    border border-[#d4a574]/20
                    hover:border-[#d4a574]
                    transition-all duration-500
                  `}
                >
                  {/* Image */}
                  <div className="relative w-full h-full min-h-[200px]">
                    <Image 
                      src={getImageUrl(image.image_path)} 
                      alt={image.alt_text || `Gallery image ${image.id}`} 
                      fill 
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    {/* Hover Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#d4a574]/20 backdrop-blur-sm flex items-center justify-center border border-[#d4a574]/50">
                          <svg className="w-6 h-6 text-[#d4a574]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                        <p className="text-white text-sm font-medium">View Image</p>
                      </div>
                    </div>

                    {/* Frame number */}
                    <div className="absolute top-3 left-3 text-[#d4a574] font-mono text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                      #{String(image.id).padStart(3, '0')}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-[#d4a574]/20 backdrop-blur-sm flex items-center justify-center border border-[#d4a574]/50 hover:bg-[#d4a574]/30 transition-colors"
            >
              <X className="w-6 h-6 text-[#d4a574]" />
            </button>

            {/* Image container - centered and fully visible */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-auto h-auto max-w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src={getImageUrl(selectedImage.image_path)}
                  alt={selectedImage.alt_text || `Gallery image ${selectedImage.id}`}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                  quality={90}
                />
              </div>

              {/* Image info */}
              {selectedImage.alt_text && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg"
                >
                  <p className="text-white text-lg font-medium">{selectedImage.alt_text}</p>
                  <p className="text-[#d4a574] text-sm font-mono mt-1">
                    Image #{String(selectedImage.id).padStart(3, '0')}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Navigation hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
              Click outside to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
