"use client"

import { useEffect, useState, useRef, memo, useCallback } from "react"
import Image from "next/image"

// ---------------------------------------------------------------------------
// Types
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
const perforations = Array.from({ length: 5 }, (_, i) => i)

function getImageUrl(path: string) {
  if (!path) return "/placeholder.png"
  if (path.startsWith("http")) return path
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${API_IMG}/${cleanPath}`
}

// ---------------------------------------------------------------------------
// Single image card
// ---------------------------------------------------------------------------
const FilmStripImageItem = memo(({ image, rowIndex }: { image: FilmStripImage; rowIndex: number }) => (
  <div className="relative flex-shrink-0 w-64 h-64 bg-gray-900 border-4 border-gray-800 overflow-hidden mr-2">
    <Image
      src={getImageUrl(image.image_path)}
      alt={image.alt_text || ""}
      width={256}
      height={256}
      style={{ objectFit: "cover" }}
      placeholder="blur"
      blurDataURL="/placeholder.png"
      priority={rowIndex === 0}
      loading={rowIndex === 0 ? "eager" : "lazy"}
    />
    <div className="absolute top-2 left-2 text-yellow-500 font-mono text-xs font-bold">
      {String(image.id).padStart(3, "0")}
    </div>
  </div>
))
FilmStripImageItem.displayName = "FilmStripImageItem"

// ---------------------------------------------------------------------------
// CSS-only scrolling row
// Duplicates the image list once so the loop is seamless.
// translate3d keeps it on the GPU compositing layer — no layout/paint per frame.
// ---------------------------------------------------------------------------
function FilmStripRow({
  images,
  reverse = false,
  speed = 40,
  rowIndex,
}: {
  images: FilmStripImage[]
  reverse?: boolean
  speed?: number // seconds for one full loop
  rowIndex: number
}) {
  // Unique animation name per row so each can have its own duration / direction
  const animName = `scroll-row-${rowIndex}`

  if (images.length === 0) return null

  return (
    <div className={`relative ${reverse ? "-rotate-2" : "rotate-2"} my-8`}>
      <div className="relative bg-black border-y-8 border-black py-4 overflow-hidden">
        {/* Top perforations */}
        <div className="absolute top-0 left-0 right-0 flex justify-around px-4 z-10">
          {perforations.map((i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>

        {/* Bottom perforations */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 z-10">
          {perforations.map((i) => (
            <div key={i} className="w-4 h-6 bg-white rounded-sm" />
          ))}
        </div>

        {/* Scrolling track */}
        <div className="relative h-64 overflow-hidden">
          <style>{`
            @keyframes ${animName} {
              0%   { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
          `}</style>

          <div
            className="flex will-change-transform"
            style={{
              animation: `${animName} ${speed}s linear infinite`,
              animationDirection: reverse ? "reverse" : "normal",
            }}
          >
            {/* Original set */}
            {images.map((img) => (
              <FilmStripImageItem key={img.id} image={img} rowIndex={rowIndex} />
            ))}
            {/* Duplicate set — makes the loop seamless */}
            {images.map((img) => (
              <FilmStripImageItem key={`dup-${img.id}`} image={img} rowIndex={rowIndex} />
            ))}
          </div>
        </div>
      </div>

      {/* G-LIMIT badge */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rotate-90 z-20">
        G-LIMIT
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Gallery — polling, no loading screen
// ---------------------------------------------------------------------------
export function FilmStripGallery() {
  const [rowImages, setRowImages] = useState<FilmStripImage[][]>([[], [], []])
  const prevIdsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      try {
        const res = await fetch("/api/film-strip?perPage=66")
        const json = await res.json()
        const images: FilmStripImage[] = Array.isArray(json.data) ? json.data : []

        // Skip setState if nothing changed
        const newIds = new Set(images.map((img) => img.id))
        const changed =
          newIds.size !== prevIdsRef.current.size ||
          images.some((img) => !prevIdsRef.current.has(img.id))

        if (changed) {
          prevIdsRef.current = newIds
          setRowImages([
            images.slice(0, 22),
            images.slice(22, 44),
            images.slice(44, 66),
          ])
        }
      } catch (err) {
        console.error(err)
      }
    }

    poll() // immediate first hit
    const interval = setInterval(poll, 3000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-black overflow-hidden min-h-screen space-y-4">
      {rowImages.map((images, i) => (
        <FilmStripRow
          key={i}
          images={images}
          reverse={i % 2 === 1}
          speed={[40, 50, 35][i]}
          rowIndex={i}
        />
      ))}
    </section>
  )
}
