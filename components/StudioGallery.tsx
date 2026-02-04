"use client"

import { useEffect, useState, useRef } from "react"
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

export function StudioShowcase() {
  const [allImages, setAllImages] = useState<StudioImage[]>([])
  const [currentBatch, setCurrentBatch] = useState<StudioImage[]>([])
  const [batchIndex, setBatchIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<StudioImage | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const BATCH_SIZE = 10
  const ROTATION_INTERVAL = 4500 // 4.5 seconds

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

  // Auto-rotate batches
  useEffect(() => {
    if (allImages.length === 0 || isPaused) return

    const interval = setInterval(() => {
      setBatchIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        const totalBatches = Math.ceil(allImages.length / BATCH_SIZE)
        
        // Loop back to start after showing all images
        const newIndex = nextIndex >= totalBatches ? 0 : nextIndex
        
        const startIdx = newIndex * BATCH_SIZE
        const endIdx = startIdx + BATCH_SIZE
        setCurrentBatch(allImages.slice(startIdx, endIdx))
        
        return newIndex
      })
    }, ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [allImages, isPaused])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png"
    if (path.startsWith("http")) return path
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `${API_IMG}/${cleanPath}`
  }

  const getBentoClass = (index: number) => {
    const patterns = [
      "md:col-span-2 md:row-span-2", // Large square
      "md:col-span-1 md:row-span-2", // Tall
      "md:col-span-2 md:row-span-1", // Wide
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-2 md:row-span-1", // Wide
      "md:col-span-1 md:row-span-2", // Tall
      "md:col-span-2 md:row-span-2", // Large square
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-1 md:row-span-1", // Small
    ]
    return patterns[index % patterns.length]
  }

  const totalBatches = Math.ceil(allImages.length / BATCH_SIZE)
  const progress = ((batchIndex + 1) / totalBatches) * 100

  if (loading) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-[120px] animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute w-20 h-20 border-4 border-amber-500/30 rounded-full animate-spin"></div>
            <div className="absolute w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin animation-reverse"></div>
          </div>
          <p className="text-amber-100 text-2xl font-light tracking-[0.3em]">LOADING</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section 
        ref={containerRef}
        className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Animated grain overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] animate-grain"></div>
        </div>

        {/* Parallax background elements */}
        <div 
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-full blur-[100px] pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            transition: "transform 0.3s ease-out"
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-yellow-600/10 to-amber-600/10 rounded-full blur-[100px] pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)`,
            transition: "transform 0.3s ease-out"
          }}
        ></div>

        <div className="max-w-[1800px] mx-auto relative z-10">
          {/* Header with Progress */}
          <div className="mb-16 text-center">
            <div className="inline-block relative">
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-200 mb-4 tracking-tight"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                  transition: "transform 0.2s ease-out"
                }}
              >
                STUDIO
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-8 space-y-3">
              <p className="text-amber-200/60 text-lg tracking-[0.2em] font-light">
                BATCH {batchIndex + 1} OF {totalBatches} • {allImages.length} TOTAL IMAGES
              </p>
              
              {/* Progress bar */}
              <div className="max-w-md mx-auto">
                <div className="h-1 bg-amber-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Pause indicator */}
              {isPaused && (
                <p className="text-amber-400/80 text-sm tracking-wider animate-pulse">
                  PAUSED - Move mouse away to continue
                </p>
              )}
            </div>
          </div>

          {/* Rotating Bento Grid Gallery */}
          <div 
            key={batchIndex} 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]"
          >
            {currentBatch.map((image, index) => (
              <div
                key={`${batchIndex}-${image.id}`}
                className={`group relative overflow-hidden rounded-2xl ${getBentoClass(index)} cursor-pointer`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.08}s backwards`
                }}
                onClick={() => setSelectedImage(image)}
              >
                {/* Image container with parallax */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={getImageUrl(image.image_path)}
                    alt={image.alt_text || `Image ${image.id}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Animated border */}
                <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/50 transition-all duration-500 rounded-2xl"></div>

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="space-y-2">
                    <div className="text-amber-400 font-mono text-sm tracking-wider">
                      #{String(image.id).padStart(4, "0")}
                    </div>
                    {image.alt_text && (
                      <p className="text-amber-100/90 text-sm font-light line-clamp-2">
                        {image.alt_text}
                      </p>
                    )}
                  </div>
                  
                  {/* View icon */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/30">
                    <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>

                {/* Batch change animation overlay */}
                <div 
                  className="absolute inset-0 bg-amber-500/20 pointer-events-none"
                  style={{
                    animation: `flash 0.4s ease-out ${index * 0.08}s backwards`
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalBatches }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setBatchIndex(index)
                  const startIdx = index * BATCH_SIZE
                  const endIdx = startIdx + BATCH_SIZE
                  setCurrentBatch(allImages.slice(startIdx, endIdx))
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === batchIndex 
                    ? 'bg-amber-500 w-8' 
                    : 'bg-amber-900/40 hover:bg-amber-700/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.3s ease-out" }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 w-14 h-14 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 flex items-center justify-center text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all z-10 group"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={getImageUrl(selectedImage.image_path)}
                alt={selectedImage.alt_text || `Image ${selectedImage.id}`}
                width={1920}
                height={1080}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl shadow-amber-900/20"
                priority
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 rounded-b-xl">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-amber-400 font-mono text-lg tracking-wider">
                      #{String(selectedImage.id).padStart(4, "0")}
                    </div>
                    {selectedImage.alt_text && (
                      <p className="text-amber-100/90 text-base font-light max-w-2xl">
                        {selectedImage.alt_text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes flash {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(12%, 9%); }
          70% { transform: translate(9%, 4%); }
          90% { transform: translate(-1%, 7%); }
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-reverse {
          animation-direction: reverse;
        }

        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }
      `}</style>
    </>
  )
}
