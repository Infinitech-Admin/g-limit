"use client"

import { useEffect, useState, useRef, memo, useCallback } from "react"
import Image from "next/image"

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------
interface FilmStripImage {
  id: number
  image_path: string
  alt_text?: string
  sort_order: number
  created_at: string
  updated_at: string
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000"
const BATCH_SIZE = 10
const SHUTTER_INTERVAL_MS = 5000

function getImageUrl(path: string) {
  if (!path) return "/placeholder.png"
  if (path.startsWith("http")) return path
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${API_IMG}/${cleanPath}`
}

// ---------------------------------------------------------------------------
// Sizes — max rowSpan 2, max colSpan 2. Mostly 1x1 so grid stays dense.
// ---------------------------------------------------------------------------
const SIZES: { rowSpan: number; colSpan: number }[] = [
  { rowSpan: 1, colSpan: 1 }, // square
  { rowSpan: 1, colSpan: 2 }, // wide
  { rowSpan: 2, colSpan: 1 }, // tall
  { rowSpan: 1, colSpan: 1 }, // square
  { rowSpan: 1, colSpan: 1 }, // square
  { rowSpan: 2, colSpan: 2 }, // feature (big) — rare
  { rowSpan: 1, colSpan: 1 }, // square
  { rowSpan: 1, colSpan: 1 }, // square
  { rowSpan: 1, colSpan: 2 }, // wide
  { rowSpan: 1, colSpan: 1 }, // square
]

function getSizeIndex(id: number): number {
  return ((id * 2654435761) >>> 0) % SIZES.length
}

// ---------------------------------------------------------------------------
// Single card
// ---------------------------------------------------------------------------
const GalleryCard = memo(({ image, index }: { image: FilmStripImage; index: number }) => {
  const size = SIZES[getSizeIndex(image.id)]
  const delayWithinBatch = (index % BATCH_SIZE) * 50

  return (
    <div
      className="gallery-card relative overflow-hidden rounded-md bg-gray-900 group cursor-pointer"
      style={{
        gridRow: `span ${size.rowSpan}`,
        gridColumn: `span ${size.colSpan}`,
        animationDelay: `${delayWithinBatch}ms`,
      }}
    >
      <Image
        src={getImageUrl(image.image_path)}
        alt={image.alt_text || ""}
        fill
        sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 20vw"
        style={{ objectFit: "cover" }}
        className="transition-transform duration-700 ease-out group-hover:scale-105"
        priority={index < 10}
        placeholder="blur"
        blurDataURL="/placeholder.png"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* ID badge */}
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-yellow-400 font-mono text-xs font-bold px-1.5 py-0.5 rounded">
        {String(image.id).padStart(3, "0")}
      </div>
    </div>
  )
})
GalleryCard.displayName = "GalleryCard"

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
export function FilmStripGallery() {
  const [visibleImages, setVisibleImages] = useState<FilmStripImage[]>([])
  const allImagesRef = useRef<FilmStripImage[]>([])
  const revealedCountRef = useRef(0)
  const prevIdsRef = useRef<Set<number>>(new Set())
  const hasData = useRef(false)

  const revealNextBatch = useCallback(() => {
    const all = allImagesRef.current
    const start = revealedCountRef.current
    if (start >= all.length) return
    const end = Math.min(start + BATCH_SIZE, all.length)
    revealedCountRef.current = end
    setVisibleImages(all.slice(0, end))
  }, [])

  // Polling
  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      try {
        const res = await fetch("/api/film-strip?perPage=66")
        const json = await res.json()
        const images: FilmStripImage[] = Array.isArray(json.data) ? json.data : []

        const newIds = new Set(images.map((img) => img.id))
        const changed =
          newIds.size !== prevIdsRef.current.size ||
          images.some((img) => !prevIdsRef.current.has(img.id))

        if (changed) {
          prevIdsRef.current = newIds
          allImagesRef.current = images
          if (!hasData.current && images.length > 0) {
            hasData.current = true
            revealedCountRef.current = 0
            revealNextBatch()
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    poll()
    const pollInterval = setInterval(poll, 3000)
    return () => {
      cancelled = true
      clearInterval(pollInterval)
    }
  }, [revealNextBatch])

  // Shutter timer
  useEffect(() => {
    const shutterInterval = setInterval(() => {
      if (hasData.current) revealNextBatch()
    }, SHUTTER_INTERVAL_MS)
    return () => clearInterval(shutterInterval)
  }, [revealNextBatch])

  return (
    <>
      <style>{`
        /* 6 columns, small rows — fills width, stays short */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 140px;
          gap: 10px;
          padding: 0 24px;
        }
        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(5, 1fr);
            grid-auto-rows: 120px;
          }
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 100px;
            gap: 8px;
          }
        }
        @media (max-width: 500px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 90px;
            gap: 6px;
            padding: 0 12px;
          }
        }

        .gallery-card {
          animation: shutterDrop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes shutterDrop {
          0% {
            opacity: 0;
            clip-path: inset(0 0 100% 0);
            transform: translateY(-6px);
          }
          100% {
            opacity: 1;
            clip-path: inset(0 0 0% 0);
            transform: translateY(0);
          }
        }
      `}</style>

      <section className="min-h-screen py-16 bg-gradient-to-b from-zinc-950 via-gray-950 to-black">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-amber-900/10 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="gallery-grid">
            {visibleImages.map((img, i) => (
              <GalleryCard key={img.id} image={img} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
