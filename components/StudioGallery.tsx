"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
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

const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.png"
  if (path.startsWith("http")) return path
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${API_IMG}/${cleanPath}`
}

// ─── Memoized card — only re-renders if image changes ────────────────────────
const GalleryCard = memo(function GalleryCard({
  image,
  index,
  onSelect,
}: {
  image: StudioImage
  index: number
  onSelect: (img: StudioImage) => void
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className="group relative cursor-pointer"
      style={{
        opacity: 0,
        animation: `fadeSlideIn 0.35s ease-out ${index * 40}ms forwards`,
      }}
      onClick={() => onSelect(image)}
    >
      <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10">
        <div className="relative p-3">
          <div className="relative w-full bg-zinc-950 rounded-lg overflow-hidden">
            {/* Skeleton shimmer shown until image loads */}
            {!loaded && (
              <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg" style={{ minHeight: 180 }} />
            )}
            <Image
              src={getImageUrl(image.image_path)}
              alt={image.alt_text || `Image ${image.id}`}
              width={400}
              height={300}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className={`w-full h-auto object-contain transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
              loading={index < 6 ? "eager" : "lazy"}
              priority={index < 2}
              onLoad={() => setLoaded(true)}
            />
          </div>
        </div>

        {/* ID badge */}
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-black/60 backdrop-blur-md border border-zinc-700 rounded-lg px-3 py-1.5">
            <span className="text-white font-mono text-xs font-bold">
              {String(image.id).padStart(3, "0")}
            </span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          {image.alt_text && (
            <p className="text-white/90 text-sm font-light line-clamp-2">{image.alt_text}</p>
          )}
        </div>

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
})

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = memo(function Lightbox({
  image,
  onClose,
}: {
  image: StudioImage
  onClose: () => void
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-8 right-8 w-16 h-16 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all z-20 group"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-amber-400/10 to-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <Image
            src={getImageUrl(image.image_path)}
            alt={image.alt_text || `Image ${image.id}`}
            width={1920}
            height={1080}
            sizes="100vw"
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl"
            loading="eager"
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 font-mono text-xl font-bold">
              #{String(image.id).padStart(3, "0")}
            </div>
            {image.alt_text && (
              <p className="text-zinc-300 text-sm mt-1">{image.alt_text}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

// ─── Main Component ───────────────────────────────────────────────────────────
const BATCH_SIZE = 10
const ROTATION_INTERVAL = 5000

export function SpotlightGallery() {
  const [allImages, setAllImages] = useState<StudioImage[]>([])
  const [batchIndex, setBatchIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<StudioImage | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Derived — no useState needed, computed on render
  const totalBatches = Math.ceil(allImages.length / BATCH_SIZE)
  const currentBatch = allImages.slice(batchIndex * BATCH_SIZE, batchIndex * BATCH_SIZE + BATCH_SIZE)

  useEffect(() => {
    fetch("/api/film-strip?perPage=100")
      .then((r) => r.json())
      .then((json) => {
        setAllImages(Array.isArray(json.data) ? json.data : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Pause rotation while lightbox is open
  useEffect(() => {
    if (allImages.length === 0 || selectedImage) return
    intervalRef.current = setInterval(() => {
      setBatchIndex((prev) => (prev + 1 >= Math.ceil(allImages.length / BATCH_SIZE) ? 0 : prev + 1))
    }, ROTATION_INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [allImages, selectedImage])

  const goToBatch = useCallback((index: number) => {
    setBatchIndex(index)
  }, [])

  const handleSelect = useCallback((img: StudioImage) => {
    setSelectedImage(img)
  }, [])

  const handleClose = useCallback(() => setSelectedImage(null), [])

  if (loading) {
    return (
      <section className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-t-4 border-rose-500 rounded-full animate-spin" />
            <div className="absolute inset-3 border-t-4 border-amber-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <div className="absolute inset-6 border-t-4 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: "2s" }} />
          </div>
          <p className="text-zinc-400 text-xl font-light uppercase tracking-[0.5em]">Loading</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="min-h-screen bg-zinc-950 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(244,63,94,0.05),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.05),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(34,211,238,0.05),transparent_50%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "80px 80px" }}
        />

        <div className="max-w-[2000px] mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-block relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-rose-500" />
              <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-rose-500" />
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold relative px-8 py-4">
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 blur-xl opacity-50">GALLERY</span>
                <span className="relative text-white">GALLERY</span>
              </h1>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 text-zinc-500 text-sm uppercase tracking-widest">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-700" />
                <span>Collection {batchIndex + 1} / {totalBatches}</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-700" />
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalBatches }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToBatch(i)}
                    className={`transition-all duration-300 rounded-full ${i === batchIndex ? "w-12 h-2 bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400" : "w-2 h-2 bg-zinc-800 hover:bg-zinc-600"}`}
                    aria-label={`Go to batch ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Grid — no key on the grid itself; cards are keyed by image id */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {currentBatch.map((image, index) => (
              <GalleryCard
                key={image.id}
                image={image}
                index={index}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-600 text-sm uppercase tracking-wider">
              Showing {currentBatch.length} of {allImages.length} images
            </p>
          </div>
        </div>
      </section>

      {selectedImage && <Lightbox image={selectedImage} onClose={handleClose} />}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) }
          to   { opacity: 1; transform: scale(1) }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        .animate-fade-in  { animation: fadeIn 0.4s ease-out }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) }
      `}</style>
    </>
  )
}
