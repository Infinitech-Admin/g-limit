"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react"
import FloatingParticles from "@/components/animated-golden-particles"

// ─── Types ──────────────────────────────────────────────────────────────────
interface Ambassador {
  id: number
  name: string
  image_paths: string[]
  created_at: string
  updated_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000"

function getImageUrl(path: string): string {
  if (!path) return "/placeholder.svg"
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const clean = path.startsWith("/") ? path.slice(1) : path
  return `${API_IMG}/${clean}`
}

// Per-ambassador accent colours (cycled by index)
const ACCENTS = [
  { accent: "#f5d98a", accentDim: "rgba(245,217,138,0.12)", accentGlow: "#ecc84e" },
  { accent: "#fae9a0", accentDim: "rgba(250,233,160,0.12)", accentGlow: "#f5d98a" },
  { accent: "#f0c060", accentDim: "rgba(240,192,96,0.12)",  accentGlow: "#d4a030" },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

const apertureBlades = 8

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-xl animate-pulse"
      style={{ background: "rgba(245,217,138,0.05)", border: "1px solid rgba(245,217,138,0.08)" }}
    />
  )
}

export default function AmbassadorPage() {
  const [ambassadors, setAmbassadors]   = useState<Ambassador[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [activeId, setActiveId]         = useState<number | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // ── Fetch all ambassadors (no pagination — we want them all for the gallery)
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
        const list: Ambassador[] = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : []
        setAmbassadors(list)
        if (list.length > 0) setActiveId(list[0].id)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ambassadors")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const current     = ambassadors.find((a) => a.id === activeId) ?? null
  const accentTheme = current
    ? ACCENTS[ambassadors.indexOf(current) % ACCENTS.length]
    : ACCENTS[0]

  // Lightbox helpers
  const images      = current?.image_paths ?? []
  const openLightbox  = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
  const nextImage = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <FloatingParticles />

      {/* ── Aperture deco ── */}
      <div className="absolute left-[-8%] top-[20%] w-[360px] h-[360px] opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(apertureBlades)].map((_, i) => (
            <path
              key={i}
              d={`M100,100 L${100 + 80 * Math.cos((i * 2 * Math.PI) / apertureBlades)},${
                100 + 80 * Math.sin((i * 2 * Math.PI) / apertureBlades)
              } A80,80 0 0,1 ${100 + 80 * Math.cos(((i + 1) * 2 * Math.PI) / apertureBlades)},${
                100 + 80 * Math.sin(((i + 1) * 2 * Math.PI) / apertureBlades)
              } Z`}
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
            <circle key={i} cx="100" cy="100" r={28 + i * 12} fill="none" stroke="#f5d98a" strokeWidth="0.5" />
          ))}
        </svg>
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(245,217,138,0.06) 0%, transparent 55%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

        {/* ── Page heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#f5d98a]" />
            <p className="font-sans mt-10 font-black tracking-[0.3em] text-[10px] uppercase" style={{ color: "#f5d98a" }}>
              G-Limit Studio
            </p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#f5d98a]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-light text-white leading-tight">
            Our{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(to right, #f5d98a, #fae9a0, #f5d98a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ambassadors
            </span>
          </h1>
        </motion.div>

        {/* ── Error state ── */}
        {error && (
          <div
            className="mb-8 px-5 py-4 rounded-xl text-sm font-sans"
            style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.25)", color: "#f87171" }}
          >
            {error}
          </div>
        )}

        {/* ── Ambassador selector buttons ── */}
        {loading ? (
          <div className="flex gap-4 mb-10">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-12 w-44 rounded-full animate-pulse"
                style={{ background: "rgba(245,217,138,0.06)", border: "1px solid rgba(245,217,138,0.12)" }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {ambassadors.map((amb, idx) => {
              const theme   = ACCENTS[idx % ACCENTS.length]
              const isActive = activeId === amb.id
              return (
                <button
                  key={amb.id}
                  onClick={() => { setActiveId(amb.id); setLightboxIndex(null) }}
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
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(120deg, transparent 30%, rgba(245,217,138,0.08) 50%, transparent 70%)" }}
                    />
                  )}
                  {/* Initials circle */}
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    style={{
                      background: isActive ? "rgba(0,0,0,0.18)" : "rgba(245,217,138,0.1)",
                      border: `1px solid ${isActive ? "rgba(0,0,0,0.2)" : "rgba(245,217,138,0.25)"}`,
                    }}
                  >
                    {getInitials(amb.name)}
                  </span>
                  {amb.name}
                  <span className="ml-1 text-[10px] font-sans font-normal opacity-70">
                    {amb.image_paths.length} photos
                  </span>
                </button>
              )
            })}

            {ambassadors.length === 0 && !loading && !error && (
              <p className="font-sans text-sm" style={{ color: "rgba(245,217,138,0.4)" }}>
                No ambassadors found.
              </p>
            )}
          </motion.div>
        )}

        {/* ── Active ambassador label ── */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-4 mb-6"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${accentTheme.accent}, ${accentTheme.accentGlow})`,
                  color: "#000",
                  boxShadow: `0 0 20px ${accentTheme.accent}40`,
                }}
              >
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

        {/* ── Photo grid ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3"
            >
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : current && current.image_paths.length > 0 ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3"
            >
              {current.image_paths.map((path, i) => (
                <motion.div
                  key={`${current.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group relative overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => openLightbox(i)}
                  style={{ border: "1px solid rgba(245,217,138,0.08)" }}
                >
                  {/* Placeholder background */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(135deg, #2a2318 0%, #1c1810 50%, #252015 100%)" }}
                  />
                  {/* Grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: `linear-gradient(${accentTheme.accent}88 1px, transparent 1px), linear-gradient(90deg, ${accentTheme.accent}88 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Fallback camera icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 group-hover:opacity-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: `rgba(245,217,138,0.08)`, border: `1px solid ${accentTheme.accent}40` }}
                    >
                      <Camera className="w-5 h-5" style={{ color: `${accentTheme.accent}90` }} />
                    </div>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-center px-2" style={{ color: `${accentTheme.accent}60` }}>
                      Photo {i + 1}
                    </p>
                  </div>
                  {/* Actual image */}
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(path)}
                      alt={`${current.name} photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {/* Hover info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <p className="text-white font-serif text-sm font-light">{current.name}</p>
                    <p className="font-sans text-[10px] uppercase tracking-widest mt-0.5" style={{ color: accentTheme.accent }}>
                      Photo {i + 1} of {current.image_paths.length}
                    </p>
                  </div>

                  {/* Hover corner brackets */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-l border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" style={{ borderColor: accentTheme.accent }} />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" style={{ borderColor: accentTheme.accent }} />

                  {/* Gold glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5]"
                    style={{ boxShadow: `inset 0 0 0 1px ${accentTheme.accent}30` }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : !loading && current && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,217,138,0.06)", border: "1px solid rgba(245,217,138,0.15)" }}
              >
                <Camera className="w-7 h-7" style={{ color: "rgba(245,217,138,0.3)" }} />
              </div>
              <p className="font-sans text-sm" style={{ color: "rgba(245,217,138,0.35)" }}>
                No photos uploaded yet
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && current && images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Image container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative max-w-4xl max-h-[80vh] w-full mx-16"
              onClick={(e) => e.stopPropagation()}
              style={{ border: `1px solid ${accentTheme.accent}25`, borderRadius: "16px", overflow: "hidden" }}
            >
              <div className="relative w-full aspect-[4/3] bg-[#0a0806] flex items-center justify-center">
                {/* Placeholder behind image */}
                <Camera className="w-12 h-12 opacity-10 absolute" style={{ color: accentTheme.accent }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(images[lightboxIndex])}
                  alt={`${current.name} photo ${lightboxIndex + 1}`}
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                />
              </div>

              {/* Caption */}
              <div
                className="px-6 py-4"
                style={{ background: "rgba(10,8,6,0.95)", borderTop: `1px solid ${accentTheme.accent}20` }}
              >
                <p className="text-white font-serif font-light text-sm">{current.name}</p>
                <p className="font-sans text-[10px] uppercase tracking-widest mt-0.5" style={{ color: accentTheme.accent }}>
                  Photo {lightboxIndex + 1} of {images.length}
                </p>
              </div>

              {/* Gold top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, transparent, ${accentTheme.accent}, transparent)` }}
              />
            </motion.div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.2)", color: "#f5d98a" }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.2)", color: "#f5d98a" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.2)", color: "#f5d98a" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full font-sans text-xs"
              style={{ background: "rgba(245,217,138,0.08)", border: "1px solid rgba(245,217,138,0.15)", color: "#f5d98a" }}
            >
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
