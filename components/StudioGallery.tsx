"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface StudioImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000"

export function SpotlightGallery() {
  const [allImages, setAllImages] = useState<StudioImage[]>([])
  const [currentBatch, setCurrentBatch] = useState<StudioImage[]>([])
  const [batchIndex, setBatchIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<StudioImage | null>(null)

  const BATCH_SIZE = 10
  const ROTATION_INTERVAL = 5000

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/film-strip?perPage=100")
        const json = await res.json()
        const fetchedImages: StudioImage[] = Array.isArray(json.data) ? json.data : []
        setAllImages(fetchedImages)
        setCurrentBatch(fetchedImages.slice(0, BATCH_SIZE))
      } catch (err) {
        console.error("Failed to fetch images:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    if (allImages.length === 0) return

    const interval = setInterval(() => {
      setBatchIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        const totalBatches = Math.ceil(allImages.length / BATCH_SIZE)
        const newIndex = nextIndex >= totalBatches ? 0 : nextIndex
        
        const startIdx = newIndex * BATCH_SIZE
        const endIdx = startIdx + BATCH_SIZE
        setCurrentBatch(allImages.slice(startIdx, endIdx))
        
        return newIndex
      })
    }, ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [allImages])

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png"
    if (path.startsWith("http")) return path
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  const totalBatches = Math.ceil(allImages.length / BATCH_SIZE)

  if (loading) {
    return (
      <section className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-t-4 border-rose-500 rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-t-4 border-amber-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-6 border-t-4 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
          <p className="text-zinc-400 text-xl font-light uppercase tracking-[0.5em]">Loading</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section 
        className="min-h-screen bg-zinc-950 py-16 px-4 relative overflow-hidden"
      >
        {/* Radial spotlight background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(244,63,94,0.05),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.05),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(34,211,238,0.05),transparent_50%)]"></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        ></div>

        <div className="max-w-[2000px] mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-block relative">
              {/* Decorative corners */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-rose-500"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-rose-500"></div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold relative px-8 py-4">
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 blur-xl opacity-50">
                  GALLERY
                </span>
                <span className="relative text-white">
                  GALLERY
                </span>
              </h1>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 text-zinc-500 text-sm uppercase tracking-widest">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-700"></div>
                <span>Collection {batchIndex + 1} / {totalBatches}</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-700"></div>
              </div>

              {/* Animated progress dots */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalBatches }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setBatchIndex(index)
                      const startIdx = index * BATCH_SIZE
                      const endIdx = startIdx + BATCH_SIZE
                      setCurrentBatch(allImages.slice(startIdx, endIdx))
                    }}
                    className={`transition-all duration-500 ${
                      index === batchIndex
                        ? 'w-12 h-2 bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400'
                        : 'w-2 h-2 bg-zinc-800 hover:bg-zinc-600'
                    } rounded-full`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Spotlight Gallery Grid */}
          <div 
            key={batchIndex}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
          >
            {currentBatch.map((image, index) => (
              <div
                key={`${batchIndex}-${image.id}`}
                className="group relative aspect-[3/4] cursor-pointer"
                style={{
                  animation: `spotlightIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s backwards`
                }}
                onClick={() => setSelectedImage(image)}
              >
                {/* Spotlight glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-rose-500/20 via-amber-400/20 to-cyan-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Card container */}
                <div className="relative h-full bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-all duration-500">
                  {/* Image */}
                  <div className="absolute inset-0 p-3">
                    <div className="relative w-full h-full bg-zinc-950 rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(image.image_path)}
                        alt={image.alt_text || `Image ${image.id}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    </div>
                  </div>

                  {/* Number badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="bg-black/60 backdrop-blur-md border border-zinc-700 rounded-lg px-3 py-1.5">
                      <span className="text-white font-mono text-xs font-bold">
                        {String(image.id).padStart(3, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    {image.alt_text && (
                      <p className="text-white/90 text-sm font-light line-clamp-2">
                        {image.alt_text}
                      </p>
                    )}
                  </div>

                  {/* Animated corner accents */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Batch info footer */}
          <div className="mt-16 text-center">
            <p className="text-zinc-600 text-sm uppercase tracking-wider">
              Showing {currentBatch.length} of {allImages.length} images
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-6"
          style={{ animation: "fadeIn 0.3s ease-out" }}
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-8 right-8 w-16 h-16 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all z-20 group"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image container */}
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            {/* Spotlight glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-amber-400/10 to-cyan-400/10 blur-3xl"></div>
            
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <div className="relative max-w-full max-h-full">
                <Image
                  src={getImageUrl(selectedImage.image_path)}
                  alt={selectedImage.alt_text || `Image ${selectedImage.id}`}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-8">
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 font-mono text-xl font-bold">
                    #{String(selectedImage.id).padStart(3, "0")}
                  </div>
                  {selectedImage.alt_text && (
                    <p className="text-zinc-300 text-sm">
                      {selectedImage.alt_text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spotlightIn {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}
