"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Video, Calendar, AlertCircle, Play, X, Aperture } from "lucide-react";
import useSWR from "swr";

interface BlogVideo {
  id: number;
  title: string;
  description?: string;
  video_path: string;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogVideos() {
  const [selectedVideo, setSelectedVideo] = useState<BlogVideo | null>(null);

  const { data, error, isLoading } = useSWR<{
    data: BlogVideo[];
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }>("/api/blog-videos?page=1&perPage=100", fetcher);

  const videoItems = data?.data || [];

  const getVideoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${API_URL}/${cleanPath}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(160deg, #faf7f2 0%, #f5f0e8 40%, #ede8df 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border pointer-events-none"
          style={{ borderColor: "rgba(192,120,32,0.15)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full border pointer-events-none"
          style={{ borderColor: "rgba(192,120,32,0.1)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12" style={{ background: "#a06820" }} />
            <span
              className="text-xs tracking-[0.3em] font-sans font-semibold uppercase"
              style={{ color: "#a06820" }}
            >
              G-Limit Studio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-light leading-[0.95] mb-8"
            style={{ color: "#1a1612", letterSpacing: "-0.02em" }}
          >
            Our{" "}
            <em
              className="not-italic font-bold"
              style={{
                background: "linear-gradient(135deg, #c07820, #e8a030)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Blog
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl font-sans font-normal leading-relaxed max-w-xl"
            style={{ color: "#5c4f3a" }}
          >
            {isLoading
              ? "Loading video content..."
              : "Explore our latest video content and behind-the-scenes updates."}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="flex items-center gap-6 mt-12"
          >
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(to right, #c07820, transparent)" }}
            />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-6 h-6" style={{ color: "#c07820" }} />
            </motion.div>
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(to left, #c07820, transparent)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── ERROR ── */}
      {error && (
        <section className="px-6 pb-8 relative z-10">
          <div
            className="max-w-6xl mx-auto p-6 rounded-xl flex items-center gap-4 font-sans"
            style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#dc2626" }} />
            <div>
              <h3 className="font-semibold text-sm mb-0.5" style={{ color: "#dc2626" }}>
                Failed to load videos
              </h3>
              <p className="text-xs" style={{ color: "#b91c1c" }}>
                Please check your connection and try again
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── VIDEO GRID ── */}
      <section className="px-4 sm:px-6 md:px-10 pb-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            /* Skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: "#fff9f2", border: "1px solid #e2d5c0" }}
                >
                  <div className="aspect-video" style={{ background: "#ede0cc" }} />
                  <div className="p-6 space-y-3">
                    <div className="h-4 rounded" style={{ background: "#ede0cc", width: "35%" }} />
                    <div className="h-5 rounded" style={{ background: "#ede0cc", width: "88%" }} />
                    <div className="h-4 rounded" style={{ background: "#ede0cc", width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : videoItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <Video className="w-12 h-12" style={{ color: "#c0a070" }} />
              <p className="font-sans text-base" style={{ color: "#8a7560" }}>
                No videos available yet
              </p>
              <p className="font-sans text-sm" style={{ color: "#a09080" }}>
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {videoItems.map((video, index) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.07, duration: 0.5 }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div
                      className="h-full rounded-2xl overflow-hidden transition-all duration-400 flex flex-col"
                      style={{
                        background: "#fff9f2",
                        border: "1px solid #e2d5c0",
                        boxShadow: "0 2px 20px rgba(160,104,32,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 12px 40px rgba(160,104,32,0.15)";
                        (e.currentTarget as HTMLDivElement).style.borderColor = "#c07820";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 2px 20px rgba(160,104,32,0.06)";
                        (e.currentTarget as HTMLDivElement).style.borderColor = "#e2d5c0";
                      }}
                    >
                      {/* Top accent bar */}
                      <div
                        className="h-1 flex-shrink-0"
                        style={{
                          background: "linear-gradient(90deg, #c07820, #e8a030, #c07820)",
                        }}
                      />

                      {/* Video thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-stone-900 flex-shrink-0">
                        <video
                          src={getVideoUrl(video.video_path)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />

                        {/* Dark scrim */}
                        <div
                          className="absolute inset-0 transition-opacity duration-300"
                          style={{ background: "linear-gradient(to top, rgba(26,22,18,0.55) 0%, transparent 50%)" }}
                        />

                        {/* Play button — visible on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110"
                            style={{
                              background: "linear-gradient(135deg, #c07820, #e8a030)",
                            }}
                          >
                            <Play className="w-7 h-7 ml-1" fill="#1a1612" style={{ color: "#1a1612" }} />
                          </div>
                        </div>

                        {/* Date pill */}
                        <div
                          className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-xs font-semibold"
                          style={{ background: "rgba(26,22,18,0.85)", color: "#e8a030" }}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDate(video.created_at)}
                        </div>

                        {/* Video badge */}
                        <div
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-sans text-xs font-semibold"
                          style={{ background: "rgba(192,120,32,0.9)", color: "#1a1612" }}
                        >
                          <Video className="w-3 h-3" />
                          Video
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="p-6 flex flex-col gap-3 flex-1">
                        <h3
                          className="text-xl font-semibold leading-tight line-clamp-2"
                          style={{ color: "#1a1612", letterSpacing: "-0.01em" }}
                        >
                          {video.title}
                        </h3>

                        {video.description && (
                          <p
                            className="font-sans text-sm leading-relaxed line-clamp-3 flex-1"
                            style={{ color: "#6b5d4a" }}
                          >
                            {video.description}
                          </p>
                        )}

                        {/* Divider */}
                        <div className="h-px" style={{ background: "#ede0cc" }} />

                        {/* Watch now */}
                        <div
                          className="flex items-center gap-2 font-sans text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                          style={{ color: "#c07820" }}
                        >
                          <Play className="w-4 h-4" fill="currentColor" />
                          Watch Now
                        </div>
                      </div>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(26,22,18,0.9)", backdropFilter: "blur(14px)" }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{
                background: "#faf7f2",
                border: "1px solid #e2d5c0",
                boxShadow: "0 32px 80px rgba(26,22,18,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent */}
              <div
                className="h-1 rounded-t-2xl"
                style={{ background: "linear-gradient(90deg, #c07820, #e8a030, #c07820)" }}
              />

              {/* Close */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: "#1a1612", color: "#e8a030" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#c07820")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#1a1612")
                }
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video player */}
              <div className="relative aspect-video overflow-hidden rounded-t-xl bg-black">
                <video
                  src={getVideoUrl(selectedVideo.video_path)}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Meta */}
                <div className="flex items-center gap-5 mb-5 font-sans text-sm">
                  <div className="flex items-center gap-2" style={{ color: "#c07820" }}>
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedVideo.created_at)}
                  </div>
                  <div className="flex items-center gap-2" style={{ color: "#8a7a68" }}>
                    <Video className="w-4 h-4" />
                    Blog
                  </div>
                </div>

                <h2
                  className="text-3xl md:text-4xl font-semibold mb-6 leading-tight"
                  style={{ color: "#1a1612", letterSpacing: "-0.02em" }}
                >
                  {selectedVideo.title}
                </h2>

                {selectedVideo.description && (
                  <>
                    <div className="h-px mb-6" style={{ background: "#e2d5c0" }} />
                    <p
                      className="font-sans text-base leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#4a3d2a" }}
                    >
                      {selectedVideo.description}
                    </p>
                  </>
                )}

                {/* Footer meta */}
                <div
                  className="mt-8 pt-6 flex items-center justify-between font-sans text-xs"
                  style={{ borderTop: "1px solid #e2d5c0", color: "#a09080" }}
                >
                  <span>Published {formatDate(selectedVideo.created_at)}</span>
                  {selectedVideo.updated_at !== selectedVideo.created_at && (
                    <span>Updated {formatDate(selectedVideo.updated_at)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
