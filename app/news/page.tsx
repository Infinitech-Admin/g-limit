"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Newspaper, Calendar, AlertCircle, ChevronRight, Aperture } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";

interface NewsImage { id: number; image_path: string }
interface NewsItem { id: number; title: string; description: string; date: string; images: NewsImage[]; created_at: string; updated_at: string }

const API_IMG = process.env.NEXT_PUBLIC_API_IMG;
const apertureBlades = 8;
const ACCENT = "#f5d98a";
const ACCENT_GLOW = "#ecc84e";
const ACCENT_DIM = "rgba(245,217,138,0.12)";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function News() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { data, error, isLoading } = useSWR<{ data: NewsItem[] }>("/api/news?per_page=100", fetcher);
  const newsItems = data?.data || [];

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    return `${API_IMG}/${path.startsWith("/") ? path.slice(1) : path}`;
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
            Latest{" "}
            <span className="italic" style={{ background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              News
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base font-sans leading-relaxed max-w-xl" style={{ color: "rgba(245,217,138,0.5)" }}>
            {isLoading ? "Loading latest updates..." : "Stay updated with our latest announcements and stories."}
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
            <p className="text-sm" style={{ color: "#fca5a5" }}>Failed to load news. Please check your API configuration.</p>
          </div>
        </div>
      )}

      {/* ── NEWS GRID ── */}
      <section className="px-4 sm:px-6 md:px-10 pb-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                  style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid rgba(245,217,138,0.08)` }}>
                  <div className="aspect-[4/3]" style={{ background: "rgba(245,217,138,0.05)" }} />
                  <div className="p-6 space-y-3">
                    <div className="h-3 rounded" style={{ background: "rgba(245,217,138,0.06)", width: "40%" }} />
                    <div className="h-4 rounded" style={{ background: "rgba(245,217,138,0.06)", width: "90%" }} />
                    <div className="h-3 rounded" style={{ background: "rgba(245,217,138,0.06)", width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <Newspaper className="w-12 h-12" style={{ color: `${ACCENT}30` }} />
              <p className="font-sans text-sm" style={{ color: "rgba(245,217,138,0.3)" }}>No news articles found</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {newsItems.map((news, index) => (
                  <motion.div key={news.id} layout
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.07, duration: 0.5 }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group cursor-pointer relative" onClick={() => setSelectedNews(news)}
                  >
                    <div className="h-full rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative"
                      style={{ background: "linear-gradient(135deg, #1c1810 0%, #141008 60%, #1a1510 100%)", border: `1px solid rgba(245,217,138,0.1)`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${ACCENT}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px rgba(245,217,138,0.1)` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,217,138,0.1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)" }}
                    >
                      {/* Shimmer top */}
                      <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${ACCENT}50, transparent)` }} />

                      {/* Inner grid texture */}
                      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                        style={{ backgroundImage: `linear-gradient(${ACCENT}88 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}88 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
                      />

                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0" style={{ background: "#0f0c08" }}>
                        <Image src={news.images?.length > 0 ? getImageUrl(news.images[0].image_path) : "/placeholder.png"}
                          alt={news.title} fill sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,6,0.7) 0%, transparent 55%)" }} />

                        {/* Date pill */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-bold"
                          style={{ background: "rgba(10,8,6,0.88)", color: ACCENT, border: `1px solid ${ACCENT}25` }}>
                          <Calendar className="w-3 h-3" /> {formatDate(news.date)}
                        </div>

                        {/* Photo count */}
                        {news.images?.length > 1 && (
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full font-sans text-xs font-bold"
                            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, color: "#000" }}>
                            {news.images.length}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col gap-3 flex-1 relative">
                        <h3 className="text-lg font-serif font-semibold text-white line-clamp-2" style={{ letterSpacing: "-0.01em" }}>{news.title}</h3>
                        <p className="font-sans text-xs leading-relaxed line-clamp-3 flex-1" style={{ color: "rgba(245,217,138,0.45)" }}>{news.description}</p>
                        <div className="h-px" style={{ background: `${ACCENT}15` }} />
                        <div className="flex items-center gap-2 font-sans text-xs font-bold transition-all duration-300 group-hover:gap-3" style={{ color: ACCENT }}>
                          Read More <ChevronRight className="w-3.5 h-3.5" />
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

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,4,3,0.92)", backdropFilter: "blur(14px)" }}
            onClick={() => setSelectedNews(null)}
          >
            <motion.div initial={{ scale: 0.92, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid ${ACCENT}25`, boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(245,217,138,0.06)` }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-px rounded-t-2xl" style={{ background: `linear-gradient(to right, transparent, ${ACCENT}80, transparent)` }} />

              {/* Close */}
              <button onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30`, color: ACCENT }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`; (e.currentTarget as HTMLButtonElement).style.color = "#000" }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT_DIM; (e.currentTarget as HTMLButtonElement).style.color = ACCENT }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {/* Hero image */}
              {selectedNews.images?.length > 0 && (
                <div className="relative aspect-[16/9] overflow-hidden" style={{ background: "#0a0806" }}>
                  <Image src={getImageUrl(selectedNews.images[0].image_path)} alt={selectedNews.title} fill sizes="100vw" className="object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,22,18,0.7), transparent 60%)" }} />
                </div>
              )}

              {/* Extra images */}
              {selectedNews.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2 px-6 pt-4">
                  {selectedNews.images.slice(1).map((img, idx) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl" style={{ border: `1px solid ${ACCENT}20` }}>
                      <Image src={getImageUrl(img.image_path)} alt={`photo ${idx + 2}`} fill sizes="25vw" className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-5 mb-5 font-sans text-xs">
                  <div className="flex items-center gap-2" style={{ color: ACCENT }}><Calendar className="w-3.5 h-3.5" />{formatDate(selectedNews.date)}</div>
                  {selectedNews.images?.length > 0 && (
                    <div className="flex items-center gap-2" style={{ color: "rgba(245,217,138,0.4)" }}><Newspaper className="w-3.5 h-3.5" />{selectedNews.images.length} photos</div>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>{selectedNews.title}</h2>
                <div className="h-px mb-6" style={{ background: `${ACCENT}20` }} />
                <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(245,217,138,0.6)" }}>{selectedNews.description}</p>
                <div className="mt-8 pt-6 flex items-center justify-between font-sans text-xs" style={{ borderTop: `1px solid ${ACCENT}15`, color: "rgba(245,217,138,0.3)" }}>
                  <span>Published {formatDate(selectedNews.created_at)}</span>
                  {selectedNews.updated_at !== selectedNews.created_at && <span>Updated {formatDate(selectedNews.updated_at)}</span>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
