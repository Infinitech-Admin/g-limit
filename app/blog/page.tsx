"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Video, Calendar, AlertCircle, Play, X, Aperture } from "lucide-react";
import useSWR from "swr";

interface BlogVideo { id: number; title: string; description?: string; video_path: string; created_at: string; updated_at: string }

const API_URL = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000";
const apertureBlades = 8;
const ACCENT = "#f5d98a";
const ACCENT_GLOW = "#ecc84e";
const ACCENT_DIM = "rgba(245,217,138,0.12)";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BlogVideos() {
  const [selectedVideo, setSelectedVideo] = useState<BlogVideo | null>(null);
  const { data, error, isLoading } = useSWR<{ data: BlogVideo[] }>("/api/blog-videos?page=1&perPage=100", fetcher);
  const videoItems = data?.data || [];

  const getVideoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_URL}/${path.startsWith("/") ? path.slice(1) : path}`;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0a0806", fontFamily: "'Georgia', serif" }}>

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(245,217,138,0.06) 0%, transparent 55%)" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 80%, rgba(245,217,138,0.03) 0%, transparent 45%)" }} />

      {/* ── Grid texture ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(${ACCENT}55 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}55 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
      />

      {/* ── Aperture deco left ── */}
      <div className="fixed left-[-8%] top-[20%] w-[360px] h-[360px] opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(apertureBlades)].map((_, i) => (
            <path key={i}
              d={`M100,100 L${100 + 80 * Math.cos((i * 2 * Math.PI) / apertureBlades)},${100 + 80 * Math.sin((i * 2 * Math.PI) / apertureBlades)} A80,80 0 0,1 ${100 + 80 * Math.cos(((i + 1) * 2 * Math.PI) / apertureBlades)},${100 + 80 * Math.sin(((i + 1) * 2 * Math.PI) / apertureBlades)} Z`}
              fill="none" stroke={ACCENT} strokeWidth="0.8" />
          ))}
          <circle cx="100" cy="100" r="55" fill="none" stroke={ACCENT} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="78" fill="none" stroke={ACCENT} strokeWidth="0.3" />
        </svg>
      </div>

      {/* ── Aperture deco right ── */}
      <div className="fixed right-[-5%] bottom-[12%] w-[240px] h-[240px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(6)].map((_, i) => <circle key={i} cx="100" cy="100" r={28 + i * 12} fill="none" stroke={ACCENT} strokeWidth="0.5" />)}
        </svg>
      </div>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${ACCENT})` }} />
            <p className="font-sans font-black tracking-[0.3em] text-[10px] uppercase" style={{ color: ACCENT }}>G-Limit Studio</p>
            <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${ACCENT})` }} />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-light text-white leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
            Our{" "}
            <span className="italic" style={{ background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Blog
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base font-sans leading-relaxed max-w-xl" style={{ color: "rgba(245,217,138,0.5)" }}>
            {isLoading ? "Loading video content..." : "Explore our latest video content and behind-the-scenes updates."}
          </motion.p>

          <div className="flex items-center gap-6 mt-10">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${ACCENT}60, transparent)` }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-5 h-5" style={{ color: `${ACCENT}70` }} />
            </motion.div>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${ACCENT}60, transparent)` }} />
          </div>
        </div>
      </section>

      {/* ── ERROR ── */}
      {error && (
        <div className="px-6 pb-8 relative z-10">
          <div className="max-w-6xl mx-auto p-5 rounded-xl flex items-center gap-4 font-sans"
            style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#f87171" }} />
            <p className="text-sm" style={{ color: "#fca5a5" }}>Failed to load videos. Please check your connection.</p>
          </div>
        </div>
      )}

      {/* ── VIDEO GRID ── */}
      <section className="px-4 sm:px-6 md:px-10 pb-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                  style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid rgba(245,217,138,0.08)` }}>
                  <div className="aspect-video" style={{ background: "rgba(245,217,138,0.05)" }} />
                  <div className="p-6 space-y-3">
                    <div className="h-3 rounded" style={{ background: "rgba(245,217,138,0.06)", width: "35%" }} />
                    <div className="h-4 rounded" style={{ background: "rgba(245,217,138,0.06)", width: "88%" }} />
                    <div className="h-3 rounded" style={{ background: "rgba(245,217,138,0.06)", width: "65%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : videoItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <Video className="w-12 h-12" style={{ color: `${ACCENT}30` }} />
              <p className="font-sans text-sm" style={{ color: "rgba(245,217,138,0.3)" }}>No videos available yet</p>
              <p className="font-sans text-xs" style={{ color: "rgba(245,217,138,0.2)" }}>Check back soon for new content!</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {videoItems.map((video, index) => (
                  <motion.div key={video.id} layout
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.07, duration: 0.5 }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group cursor-pointer relative" onClick={() => setSelectedVideo(video)}
                  >
                    <div className="h-full rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative"
                      style={{ background: "linear-gradient(135deg, #1c1810 0%, #141008 60%, #1a1510 100%)", border: `1px solid rgba(245,217,138,0.1)`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${ACCENT}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px rgba(245,217,138,0.1)` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,217,138,0.1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)" }}
                    >
                      <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${ACCENT}50, transparent)` }} />

                      {/* Inner grid texture */}
                      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                        style={{ backgroundImage: `linear-gradient(${ACCENT}88 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}88 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
                      />

                      {/* Video thumbnail */}
                      <div className="relative aspect-video overflow-hidden flex-shrink-0" style={{ background: "#050403" }}>
                        <video src={getVideoUrl(video.video_path)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted playsInline
                          onMouseEnter={e => e.currentTarget.play()}
                          onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,6,0.7) 0%, transparent 55%)" }} />

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, boxShadow: `0 0 32px ${ACCENT}50` }}>
                            <Play className="w-7 h-7 ml-1" fill="#000" style={{ color: "#000" }} />
                          </div>
                        </div>

                        {/* Date pill */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-bold"
                          style={{ background: "rgba(10,8,6,0.88)", color: ACCENT, border: `1px solid ${ACCENT}25` }}>
                          <Calendar className="w-3 h-3" /> {formatDate(video.created_at)}
                        </div>

                        {/* Video badge */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-sans text-xs font-bold"
                          style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, color: "#000" }}>
                          <Video className="w-3 h-3" /> Video
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col gap-3 flex-1 relative">
                        <h3 className="text-lg font-serif font-semibold text-white line-clamp-2" style={{ letterSpacing: "-0.01em" }}>{video.title}</h3>
                        {video.description && (
                          <p className="font-sans text-xs leading-relaxed line-clamp-3 flex-1" style={{ color: "rgba(245,217,138,0.45)" }}>{video.description}</p>
                        )}
                        <div className="h-px" style={{ background: `${ACCENT}15` }} />
                        <div className="flex items-center gap-2 font-sans text-xs font-bold transition-all duration-300 group-hover:gap-3" style={{ color: ACCENT }}>
                          <Play className="w-3.5 h-3.5" fill="currentColor" /> Watch Now
                        </div>
                      </div>

                      {/* Corner brackets */}
                      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
                      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,4,3,0.95)", backdropFilter: "blur(14px)" }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div initial={{ scale: 0.92, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid ${ACCENT}25`, boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(245,217,138,0.06)` }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-px rounded-t-2xl" style={{ background: `linear-gradient(to right, transparent, ${ACCENT}80, transparent)` }} />

              {/* Close */}
              <button onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30`, color: ACCENT }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`; (e.currentTarget as HTMLButtonElement).style.color = "#000" }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT_DIM; (e.currentTarget as HTMLButtonElement).style.color = ACCENT }}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Video player */}
              <div className="relative aspect-video overflow-hidden" style={{ background: "#000" }}>
                <video src={getVideoUrl(selectedVideo.video_path)} controls autoPlay className="w-full h-full object-contain" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-5 mb-5 font-sans text-xs">
                  <div className="flex items-center gap-2" style={{ color: ACCENT }}><Calendar className="w-3.5 h-3.5" />{formatDate(selectedVideo.created_at)}</div>
                  <div className="flex items-center gap-2" style={{ color: "rgba(245,217,138,0.4)" }}><Video className="w-3.5 h-3.5" />Blog</div>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>{selectedVideo.title}</h2>
                {selectedVideo.description && (
                  <>
                    <div className="h-px mb-6" style={{ background: `${ACCENT}20` }} />
                    <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(245,217,138,0.6)" }}>{selectedVideo.description}</p>
                  </>
                )}
                <div className="mt-8 pt-6 flex items-center justify-between font-sans text-xs" style={{ borderTop: `1px solid ${ACCENT}15`, color: "rgba(245,217,138,0.3)" }}>
                  <span>Published {formatDate(selectedVideo.created_at)}</span>
                  {selectedVideo.updated_at !== selectedVideo.created_at && <span>Updated {formatDate(selectedVideo.updated_at)}</span>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
