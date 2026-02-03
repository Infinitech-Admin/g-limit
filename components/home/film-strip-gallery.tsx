"use client"

import { useEffect, useState, useRef, memo } from "react"

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
const PER_ROW = 22

function getImageUrl(path: string) {
  if (!path) return "/placeholder.png"
  if (path.startsWith("http")) return path
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${API_IMG}/${cleanPath}`
}

// ---------------------------------------------------------------------------
// Seeded shuffle — each row gets a different order from the same pool
// ---------------------------------------------------------------------------
function seededShuffle(arr: FilmStripImage[], seed: number): FilmStripImage[] {
  const out = [...arr]
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    return s / 0x7fffffff
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// ---------------------------------------------------------------------------
// Single image card — plain <img>, no Next/Image overhead or config issues
// ---------------------------------------------------------------------------
const FilmStripImageItem = memo(({ image, rowIndex }: { image: FilmStripImage; rowIndex: number }) => (
  <div className="relative flex-shrink-0 w-64 h-64 bg-gray-900 border-4 border-gray-800 overflow-hidden mr-2">
    <img
      src={getImageUrl(image.image_path)}
      alt={image.alt_text || ""}
      width={256}
      height={256}
      loading={rowIndex === 0 ? "eager" : "lazy"}
      decoding="async"
      className="w-full h-full object-cover"
    />
    <div className="absolute top-2 left-2 text-yellow-500 font-mono text-xs font-bold">
      {String(image.id).padStart(3, "0")}
    </div>
  </div>
))
FilmStripImageItem.displayName = "FilmStripImageItem"

// ---------------------------------------------------------------------------
// Film strip row
// ---------------------------------------------------------------------------
const FilmStripRow = memo(
  ({
    images,
    reverse = false,
    speed = 40,
    rowIndex,
  }: {
    images: FilmStripImage[]
    reverse?: boolean
    speed?: number
    rowIndex: number
  }) => {
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
              {images.map((img) => (
                <FilmStripImageItem key={img.id} image={img} rowIndex={rowIndex} />
              ))}
              {/* Duplicate for seamless loop */}
              {images.map((img) => (
                <FilmStripImageItem key={`dup-${img.id}`} image={img} rowIndex={rowIndex} />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rotate-90 z-20">
          G-LIMIT
        </div>
      </div>
    )
  },
  (prev, next) => {
    if (prev.images.length !== next.images.length) return false
    for (let i = 0; i < prev.images.length; i++) {
      if (prev.images[i].id !== next.images[i].id) return false
    }
    return true
  }
)
FilmStripRow.displayName = "FilmStripRow"

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
export function FilmStripGallery() {
  const [rows, setRows] = useState<[FilmStripImage[], FilmStripImage[], FilmStripImage[]]>([[], [], []])
  const prevFingerprintRef = useRef<string>("")

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      try {
        const res = await fetch(`/api/film-strip?perPage=${PER_ROW * 3}`)
        const json = await res.json()
        const images: FilmStripImage[] = Array.isArray(json.data) ? json.data : []

        // 🐛 DEBUG — check browser console to see what the API actually returns
        console.log("[FilmStripGallery] API returned", images.length, "images | IDs:", images.map(i => i.id))

        // Fingerprint — skip update if nothing changed
        const fingerprint = images.map((img) => img.id).join(",")
        if (fingerprint === prevFingerprintRef.current) return
        prevFingerprintRef.current = fingerprint

        if (images.length <= PER_ROW) {
          // Not enough for 3 distinct rows — shuffle differently per row
          setRows([
            seededShuffle(images, 1).slice(0, PER_ROW),
            seededShuffle(images, 2).slice(0, PER_ROW),
            seededShuffle(images, 3).slice(0, PER_ROW),
          ])
        } else if (images.length <= PER_ROW * 2) {
          setRows([
            images.slice(0, PER_ROW),
            images.slice(PER_ROW, PER_ROW * 2),
            seededShuffle(images, 3).slice(0, PER_ROW),
          ])
        } else {
          setRows([
            images.slice(0, PER_ROW),
            images.slice(PER_ROW, PER_ROW * 2),
            images.slice(PER_ROW * 2, PER_ROW * 3),
          ])
        }
      } catch (err) {
        console.error("[FilmStripGallery] fetch error:", err)
      }
    }

    poll()
    const interval = setInterval(poll, 3000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-black overflow-hidden min-h-screen space-y-4">
      <FilmStripRow images={rows[0]} reverse={false} speed={40} rowIndex={0} />
      <FilmStripRow images={rows[1]} reverse={true}  speed={50} rowIndex={1} />
      <FilmStripRow images={rows[2]} reverse={false} speed={35} rowIndex={2} />
    </section>
  )
}
