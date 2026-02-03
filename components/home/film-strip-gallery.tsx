"use client"

import { useEffect, useState, useRef } from "react"
import Marquee from "react-fast-marquee"

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

// Single image card — plain <img> with native lazy loading, no Next/Image overhead
function FilmStripImageItem({ image, eager }: { image: FilmStripImage; eager: boolean }) {
  return (
    <div className="relative flex-shrink-0 w-64 h-64 bg-gray-900 border-4 border-gray-800 overflow-hidden mr-2">
      <img
        src={getImageUrl(image.image_path)}
        alt={image.alt_text || ""}
        width={256}
        height={256}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="w-full h-full object-cover"
        style={{ willChange: "auto" }}
      />
      <div className="absolute top-2 left-2 text-yellow-500 font-mono text-xs font-bold">
        {String(image.id).padStart(3, "0")}
      </div>
    </div>
  )
}

function FilmStripRow({
  images,
  reverse = false,
  speed = 10,
  isFirst,
}: {
  images: FilmStripImage[]
  reverse?: boolean
  speed?: number
  isFirst: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(isFirst) // first row starts playing immediately

  useEffect(() => {
    if (isFirst) return // already visible, no observer needed

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true)
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isFirst])

  return (
    <div ref={containerRef} className={`relative ${reverse ? "-rotate-2" : "rotate-2"} my-8`}>
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

        {/* Marquee — GPU-accelerated via translate3d (handled internally by react-fast-marquee) */}
        <div className="relative h-64" style={{ willChange: "transform" }}>
          <Marquee
            gradient={false}
            speed={speed}
            direction={reverse ? "right" : "left"}
            play={isVisible}
          >
            {images.map((img) => (
              <FilmStripImageItem key={img.id} image={img} eager={isFirst} />
            ))}
          </Marquee>
        </div>
      </div>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rotate-90 z-20">
        G-LIMIT
      </div>
    </div>
  )
}

export function FilmStripGallery() {
  const [rowImages, setRowImages] = useState<FilmStripImage[][]>([[], [], []])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchAll = async () => {
      try {
        const res = await fetch("/api/film-strip?perPage=21", {
          // ✅ Next.js will cache this and revalidate every 60s
          next: { revalidate: 60 },
        })
        const json = await res.json()
        const images: FilmStripImage[] = Array.isArray(json.data) ? json.data : []

        if (!cancelled) {
          // 7 per row is plenty — Marquee duplicates them internally anyway
          setRowImages([
            images.slice(0, 7),
            images.slice(7, 14),
            images.slice(14, 21),
          ])
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-amber-900/40 via-amber-950/60 to-black overflow-hidden min-h-screen space-y-4">
      {loading ? (
        <div className="text-[#d4a574] text-center">Loading Gallery...</div>
      ) : (
        rowImages.map((images, i) => (
          <FilmStripRow
            key={i}
            images={images}
            reverse={i % 2 === 1}
            speed={[20, 30, 15][i]}
            isFirst={i === 0}
          />
        ))
      )}
    </section>
  )
}
