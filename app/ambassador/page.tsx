"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback, useRef, memo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react"
import FloatingParticles from "@/components/animated-golden-particles"

// ─── Types ───────────────────────────────────────────────────────────────────
interface Ambassador {
  id: number
  name: string
  image_paths: string[]
  created_at: string
  updated_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000"

function getImageUrl(path: string): string {
  if (!path) return "/placeholder.svg"
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const clean = path.startsWith("/") ? path.slice(1) : path
  return `${API_IMG}/${clean}`
}

const ACCENTS = [
  { accent: "#f5d98a", accentDim: "rgba(245,217,138,0.12)", accentGlow: "#ecc84e" },
  { accent: "#fae9a0", accentDim: "rgba(250,233,160,0.12)", accentGlow: "#f5d98a" },
  { accent: "#f0c060", accentDim: "rgba(240,192,96,0.12)",  accentGlow: "#d4a030" },
]

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("")
}

function toSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-")
}

const apertureBlades = 8

// ─── PAGE_SIZE: how many photos to show per "load more" ──────────────────────
const PAGE_SIZE = 12

// ─── Lazy image component — only loads when scrolled into view ───────────────
const LazyPhoto = memo(function LazyPhoto({
  src,
  alt,
  index,
  accent,
  name,
  total,
  onClick,
}: {
  src: string
  alt: string
  index: number
  accent: string
  name: string
  total: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(index < 4) // first 4 load immediately
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    if (inView) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-xl cursor-pointer"
      style={{ border: "1px solid rgba(245,217,138,0.08)" }}
      onClick={onClick}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #2a2318, #1c1810)" }} />

      {/* Skeleton shimmer while loading */}
      {!loaded && !errored && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(245,217,138,0.06) 50%, transparent 100%)",
              animation: "shimmer 1.6s infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      )}

      {/* Fallback icon when no image */}
      {(!inView || errored) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `rgba(245,217,138,0.06)`, border: `1px solid ${accent}30` }}
          >
            <Camera className="w-4 h-4" style={{ color: `${accent}60` }} />
          </div>
          <p className="font-sans text-[9px] uppercase tracking-widest" style={{ color: `${accent}40` }}>
            {index + 1}
          </p>
        </div>
      )}

      {/* Actual image — only rendered when in viewport */}
      {inView && !errored && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease, transform 0.5s ease" }}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Hover info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <p className="text-white font-serif text-xs font-light">{name}</p>
        <p className="font-sans text-[9px] uppercase tracking-widest mt-0.5" style={{ color: accent }}>
          {index + 1} / {total}
        </p>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" style={{ borderColor: accent }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" style={{ borderColor: accent }} />
    </div>
  )
})

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = memo(function Lightbox({
  images,
  index,
  name,
  accent,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  index: number
  name: string
  accent: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-4xl max-h-[80vh] w-full mx-16"
        onClick={(e) => e.stopPropagation()}
        style={{ border: `1px solid ${accent}25`, borderRadius: 16, overflow: "hidden" }}
      >
        <div className="relative w-full aspect-[4/3] bg-[#0a0806] flex items-center justify-center">
          <Camera className="w-12 h-12 opacity-10 absolute" style={{ color: accent }} />
          <img
            src={getImageUrl(images[index])}
            alt={`${name} photo ${index + 1}`}
            className="w-full h-full object-cover absolute inset-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
          />
        </div>
        <div className="px-6 py-4" style={{ background: "rgba(10,8,6,0.95)", borderTop: `1px solid ${accent}20` }}>
          <p className="text-white font-serif font-light text-sm">{name}</p>
          <p className="font-sans text-[10px] uppercase tracking-widest mt-0.5" style={{ color: accent }}>
            Photo {index + 1} of {images.length}
          </p>
        </div>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }} />
      </motion.div>

      <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.2)", color: "#f5d98a" }}>
        <X className="w-4 h-4" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.2)", color: "#f5d98a" }}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.2)", color: "#f5d98a" }}>
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full font-sans text-xs"
        style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.15)", color: "#f5d98a" }}>
        {index + 1} / {images.length}
      </div>
    </motion.div>
  )
})

// ─── Main Page (inner — uses useSearchParams) ─────────────────────────────────
function AmbassadorPageInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [ambassadors, setAmbassadors]     = useState<Ambassador[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [activeId, setActiveId]           = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount]   = useState(PAGE_SIZE)

  // ── Fetch — only once on mount ─────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`/api/ambassadors?perPage=100`, {
          headers: { Accept: "application/json" },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const raw: Ambassador[] = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []

        // Deduplicate by name
        const mergedMap = raw.reduce<Record<string, Ambassador>>((acc, amb) => {
          const key = amb.name.trim().toLowerCase()
          if (acc[key]) {
            const existing = new Set(acc[key].image_paths)
            amb.image_paths.forEach((p) => existing.add(p))
            acc[key].image_paths = Array.from(existing)
          } else {
            acc[key] = { ...amb, image_paths: [...amb.image_paths] }
          }
          return acc
        }, {})

        const merged = Object.values(mergedMap)
        setAmbassadors(merged)

        if (merged.length > 0) {
          const urlSlug = searchParams.get("ambassador")
          const match   = urlSlug ? merged.find((a) => toSlug(a.name) === urlSlug) : null
          setActiveId(toSlug(match ? match.name : merged[0].name))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ambassadors")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, []) // intentionally no deps — fetch once

  const current     = ambassadors.find((a) => toSlug(a.name) === activeId) ?? null
  const accentTheme = current ? ACCENTS[ambassadors.indexOf(current) % ACCENTS.length] : ACCENTS[0]

  // Reset visible count when switching ambassador
  const selectAmbassador = useCallback((slug: string) => {
    setActiveId(slug)
    setLightboxIndex(null)
    setVisibleCount(PAGE_SIZE)
    router.push(`?ambassador=${slug}`, { scroll: false })
  }, [router])

  // Lightbox handlers — stable references with useCallback
  const openLightbox  = useCallback((i: number) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage     = useCallback(() =>
    setLightboxIndex((prev) => prev !== null ? (prev - 1 + (current?.image_paths.length ?? 1)) % (current?.image_paths.length ?? 1) : null),
    [current?.image_paths.length]
  )
  const nextImage     = useCallback(() =>
    setLightboxIndex((prev) => prev !== null ? (prev + 1) % (current?.image_paths.length ?? 1) : null),
    [current?.image_paths.length]
  )

  const visibleImages = current?.image_paths.slice(0, visibleCount) ?? []
  const hasMore       = (current?.image_paths.length ?? 0) > visibleCount

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
      `}</style>

      <FloatingParticles />

      {/* Aperture deco */}
      <div className="absolute left-[-8%] top-[20%] w-[360px] h-[360px] opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(apertureBlades)].map((_, i) => (
            <path key={i}
              d={`M100,100 L${100+80*Math.cos(i*2*Math.PI/apertureBlades)},${100+80*Math.sin(i*2*Math.PI/apertureBlades)} A80,80 0 0,1 ${100+80*Math.cos((i+1)*2*Math.PI/apertureBlades)},${100+80*Math.sin((i+1)*2*Math.PI/apertureBlades)} Z`}
              fill="none" stroke="#f5d98a" strokeWidth="0.8"
            />
          ))}
          <circle cx="100" cy="100" r="55" fill="none" stroke="#f5d98a" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="78" fill="none" stroke="#f5d98a" strokeWidth="0.3" />
        </svg>
      </div>
      <div className="absolute right-[-5%] bottom-[12%] w-[240px] h-[240px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx="100" cy="100" r={28+i*12} fill="none" stroke="#f5d98a" strokeWidth="0.5" />
          ))}
        </svg>
      </div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(245,217,138,0.06) 0%, transparent 55%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#f5d98a]" />
            <p className="font-sans font-black tracking-[0.3em] text-[10px] uppercase" style={{ color: "#f5d98a" }}>G-Limit Studio</p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#f5d98a]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-light text-white leading-tight">
            Our{" "}
            <span className="italic" style={{ background: "linear-gradient(to right, #f5d98a, #fae9a0, #f5d98a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Ambassadors
            </span>
          </h1>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-8 px-5 py-4 rounded-xl text-sm font-sans"
            style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.25)", color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* Selector buttons */}
        {loading ? (
          <div className="flex gap-4 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-44 rounded-full animate-pulse"
                style={{ background: "rgba(245,217,138,0.06)", border: "1px solid rgba(245,217,138,0.12)" }} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-10">
            {ambassadors.map((amb, idx) => {
              const theme    = ACCENTS[idx % ACCENTS.length]
              const slug     = toSlug(amb.name)
              const isActive = activeId === slug
              return (
                <button key={amb.name} onClick={() => selectAmbassador(slug)}
                  className="relative group flex items-center gap-3 px-7 py-3.5 rounded-full font-sans font-bold text-sm uppercase tracking-widest transition-all duration-300 overflow-hidden"
                  style={{
                    border: `2px solid ${isActive ? theme.accent : "rgba(245,217,138,0.2)"}`,
                    background: isActive ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentGlow})` : "rgba(245,217,138,0.04)",
                    color: isActive ? "#000" : theme.accent,
                    boxShadow: isActive ? `0 0 28px ${theme.accent}45` : "none",
                  }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    style={{ background: isActive ? "rgba(0,0,0,0.18)" : "rgba(245,217,138,0.1)", border: `1px solid ${isActive ? "rgba(0,0,0,0.2)" : "rgba(245,217,138,0.25)"}` }}>
                    {getInitials(amb.name)}
                  </span>
                  {amb.name}
                  <span className="ml-1 text-[10px] font-sans font-normal opacity-70">{amb.image_paths.length} photos</span>
                </button>
              )
            })}
            {ambassadors.length === 0 && !loading && !error && (
              <p className="font-sans text-sm" style={{ color: "rgba(245,217,138,0.4)" }}>No ambassadors found.</p>
            )}
          </motion.div>
        )}

        {/* Active ambassador label */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div key={current.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.3 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0"
                style={{ background: `linear-gradient(135deg, ${accentTheme.accent}, ${accentTheme.accentGlow})`, color: "#000", boxShadow: `0 0 20px ${accentTheme.accent}40` }}>
                {getInitials(current.name)}
              </div>
              <div>
                <p className="text-white font-serif text-lg font-light leading-none">{current.name}</p>
                <p className="font-sans text-[10px] uppercase tracking-widest mt-0.5" style={{ color: accentTheme.accent }}>
                  {current.image_paths.length} photos · Ambassador
                </p>
              </div>
              <div className="h-px flex-1 ml-2" style={{ background: `linear-gradient(to right, ${accentTheme.accent}40, transparent)` }} />
              <Camera className="w-4 h-4" style={{ color: `${accentTheme.accent}50` }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xl animate-pulse"
                  style={{ background: "rgba(245,217,138,0.05)", border: "1px solid rgba(245,217,138,0.08)" }} />
              ))}
            </motion.div>
          ) : current && current.image_paths.length > 0 ? (
            <motion.div key={current.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3">
              {visibleImages.map((path, i) => (
                <LazyPhoto
                  key={`${current.id}-${i}`}
                  src={getImageUrl(path)}
                  alt={`${current.name} photo ${i + 1}`}
                  index={i}
                  accent={accentTheme.accent}
                  name={current.name}
                  total={current.image_paths.length}
                  onClick={() => openLightbox(i)}
                />
              ))}
            </motion.div>
          ) : !loading && current ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,217,138,0.06)", border: "1px solid rgba(245,217,138,0.15)" }}>
                <Camera className="w-7 h-7" style={{ color: "rgba(245,217,138,0.3)" }} />
              </div>
              <p className="font-sans text-sm" style={{ color: "rgba(245,217,138,0.35)" }}>No photos uploaded yet</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Load more button */}
        {hasMore && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="px-8 py-3 rounded-full font-sans font-bold text-sm uppercase tracking-widest transition-all duration-300"
              style={{
                border: `1px solid ${accentTheme.accent}40`,
                background: "rgba(245,217,138,0.04)",
                color: accentTheme.accent,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,217,138,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(245,217,138,0.04)")}
            >
              Load more · {current!.image_paths.length - visibleCount} remaining
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && current && (
          <Lightbox
            images={current.image_paths}
            index={lightboxIndex}
            name={current.name}
            accent={accentTheme.accent}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Suspense wrapper — fixes Next.js prerender error with useSearchParams ────
export default function AmbassadorPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-pulse"
            style={{ background: "rgba(245,217,138,0.1)", border: "1px solid rgba(245,217,138,0.2)" }} />
          <p className="font-sans text-sm uppercase tracking-widest" style={{ color: "rgba(245,217,138,0.4)" }}>
            Loading…
          </p>
        </div>
      </div>
    }>
      <AmbassadorPageInner />
    </Suspense>
  )
}
