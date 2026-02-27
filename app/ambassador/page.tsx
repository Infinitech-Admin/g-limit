"use client"

import { Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react"
import FloatingParticles from "@/components/animated-golden-particles"

// ─── Types ────────────────────────────────────────────────────────────────────
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
  { accent: "#f0c060", accentDim: "rgba(240,192,96,0.12)", accentGlow: "#d4a030" },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

function toSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-")
}

function fromSlug(slug: string): string {
  return slug.replace(/-/g, " ")
}

const apertureBlades = 8

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-white/5 animate-pulse aspect-[3/4]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
    </div>
  )
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────
function AmbassadorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // ── Fetch all ambassadors
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/ambassadors?perPage=100`, {
          headers: { Accept: "application/json" },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()

        const raw: Ambassador[] = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : []

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
          const match = urlSlug
            ? merged.find((a) => toSlug(a.name) === urlSlug)
            : null
          setActiveId(toSlug(match ? match.name : merged[0].name))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ambassadors")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const current = ambassadors.find((a) => toSlug(a.name) === activeId) ?? null
  const accentTheme = current
    ? ACCENTS[ambassadors.indexOf(current) % ACCENTS.length]
    : ACCENTS[0]

  const images = current?.image_paths ?? []
  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    )
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    )

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d0d0d 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <FloatingParticles />

      {/* ── Aperture deco ── */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
        {[...Array(apertureBlades)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: "60vw",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #f5d98a, transparent)",
              transform: `rotate(${(i * 180) / apertureBlades}deg)`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>

      {/* ── Corner decorations ── */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-0"
          style={{
            width: "200px",
            height: "200px",
            border: "1px solid rgba(245,217,138,0.05)",
            borderRadius: "50%",
            top: `${10 + i * 15}%`,
            left: `${5 + i * 12}%`,
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* ── Page heading ── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div
            className="inline-block text-xs font-bold uppercase tracking-[0.4em] mb-4 px-4 py-2 rounded-full"
            style={{
              color: "#f5d98a",
              border: "1px solid rgba(245,217,138,0.2)",
              background: "rgba(245,217,138,0.05)",
            }}
          >
            G-Limit Studio
          </div>
          <h1
            className="text-5xl md:text-7xl font-black mb-6"
            style={{
              background: "linear-gradient(135deg, #f5d98a 0%, #ecc84e 50%, #f5d98a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Our{" "}
            <span style={{ fontStyle: "italic" }}>Ambassadors</span>
          </h1>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "rgba(245,217,138,0.5)" }}
          >
            Meet the faces behind the lens — our brand ambassadors captured in
            their finest moments.
          </p>
        </motion.div>

        {/* ── Error state ── */}
        {error && (
          <div
            className="text-center py-8 px-6 rounded-2xl mb-8"
            style={{
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.2)",
              color: "#ff8080",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Ambassador selector buttons ── */}
        {loading ? (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-12 w-40 rounded-full animate-pulse"
                style={{ background: "rgba(245,217,138,0.08)" }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {ambassadors.map((amb, idx) => {
              const theme = ACCENTS[idx % ACCENTS.length]
              const slug = toSlug(amb.name)
              const isActive = activeId === slug

              return (
                <motion.button
                  key={amb.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setActiveId(slug)
                    setLightboxIndex(null)
                    router.push(`?ambassador=${slug}`, { scroll: false })
                  }}
                  className="relative group flex items-center gap-3 px-7 py-3.5 rounded-full font-sans font-bold text-sm uppercase tracking-widest transition-all duration-300 overflow-hidden"
                  style={{
                    border: `2px solid ${isActive ? theme.accent : "rgba(245,217,138,0.2)"}`,
                    background: isActive
                      ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentGlow})`
                      : "rgba(245,217,138,0.04)",
                    color: isActive ? "#000" : theme.accent,
                    boxShadow: isActive ? `0 0 28px ${theme.accent}45` : "none",
                  }}
                >
                  {!isActive && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${theme.accentDim}, transparent)` }}
                    />
                  )}
                  {/* Initials circle */}
                  <span
                    className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                    style={{
                      background: isActive ? "rgba(0,0,0,0.2)" : theme.accentDim,
                      color: isActive ? "#000" : theme.accent,
                    }}
                  >
                    {getInitials(amb.name)}
                  </span>
                  <span className="relative z-10">{amb.name}</span>
                  <span
                    className="relative z-10 text-xs font-normal opacity-70"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {amb.image_paths.length} photos
                  </span>
                </motion.button>
              )
            })}

            {ambassadors.length === 0 && !loading && !error && (
              <p style={{ color: "rgba(245,217,138,0.4)" }}>No ambassadors found.</p>
            )}
          </motion.div>
        )}

        {/* ── Active ambassador label ── */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 mb-8"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black"
                style={{
                  background: `linear-gradient(135deg, ${accentTheme.accent}, ${accentTheme.accentGlow})`,
                  color: "#000",
                  boxShadow: `0 0 20px ${accentTheme.accent}40`,
                }}
              >
                {getInitials(current.name)}
              </div>
              <div>
                <h2
                  className="text-2xl font-black"
                  style={{ color: accentTheme.accent }}
                >
                  {current.name}
                </h2>
                <p className="text-sm" style={{ color: "rgba(245,217,138,0.4)" }}>
                  {current.image_paths.length} photos · Ambassador
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Photo grid ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : current && current.image_paths.length > 0 ? (
            <motion.div
              key={activeId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {current.image_paths.map((path, i) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4]"
                  onClick={() => openLightbox(i)}
                  style={{ border: "1px solid rgba(245,217,138,0.08)" }}
                >
                  {/* Placeholder background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #1a1a1a 0%, #111 50%, #1a1a1a 100%)",
                    }}
                  />
                  {/* Grid texture */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(245,217,138,0.03) 20px,rgba(245,217,138,0.03) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(245,217,138,0.03) 20px,rgba(245,217,138,0.03) 21px)",
                    }}
                  />
                  {/* Fallback camera icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
                    <Camera size={32} color="#f5d98a" />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#f5d98a" }}
                    >
                      Photo {i + 1}
                    </span>
                  </div>

                  {/* Actual image */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(path)}
                      alt={`${current.name} photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = "none"
                      }}
                    />
                  </div>

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                    }}
                  />

                  {/* Hover info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p
                      className="font-bold text-sm"
                      style={{ color: accentTheme.accent }}
                    >
                      {current.name}
                    </p>
                    <p className="text-xs text-white/60">
                      Photo {i + 1} of {current.image_paths.length}
                    </p>
                  </div>

                  {/* Hover corner brackets */}
                  <div
                    className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ borderColor: accentTheme.accent }}
                  />
                  <div
                    className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ borderColor: accentTheme.accent }}
                  />

                  {/* Gold glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 30px ${accentTheme.accent}15`,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : !loading && current ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
              style={{ color: "rgba(245,217,138,0.3)" }}
            >
              <Camera size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-bold">No photos uploaded yet</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && current && images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={closeLightbox}
          >
            {/* Image container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{
                border: `1px solid ${accentTheme.accent}25`,
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[60vh]">
                {/* Placeholder behind image */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #111 0%, #0a0a0a 100%)",
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(images[lightboxIndex])}
                  alt={`${current.name} photo ${lightboxIndex + 1}`}
                  className="relative z-10 max-h-[75vh] max-w-full object-contain"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = "none"
                  }}
                />
              </div>

              {/* Caption */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: "rgba(10,10,10,0.95)" }}
              >
                <div>
                  <p className="font-bold" style={{ color: accentTheme.accent }}>
                    {current.name}
                  </p>
                  <p className="text-sm text-white/40">
                    Photo {lightboxIndex + 1} of {images.length}
                  </p>
                </div>
              </div>

              {/* Gold top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentTheme.accent}, transparent)`,
                }}
              />

              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(245,217,138,0.1)",
                  border: "1px solid rgba(245,217,138,0.2)",
                  color: "#f5d98a",
                }}
              >
                <X size={18} />
              </button>

              {/* Prev */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(245,217,138,0.08)",
                  border: "1px solid rgba(245,217,138,0.2)",
                  color: "#f5d98a",
                }}
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(245,217,138,0.08)",
                  border: "1px solid rgba(245,217,138,0.2)",
                  color: "#f5d98a",
                }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Counter pill */}
              <div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(245,217,138,0.1)",
                  border: "1px solid rgba(245,217,138,0.2)",
                  color: "#f5d98a",
                }}
              >
                {lightboxIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Default export wrapped in Suspense ───────────────────────────────────────
export default function AmbassadorPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#0a0a0a" }}
        >
          <div
            className="text-sm font-bold uppercase tracking-widest animate-pulse"
            style={{ color: "rgba(245,217,138,0.4)" }}
          >
            Loading Ambassadors...
          </div>
        </div>
      }
    >
      <AmbassadorContent />
    </Suspense>
  )
}
