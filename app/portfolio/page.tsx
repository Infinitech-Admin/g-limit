"use client";
import { Button } from "@/components/ui/button";
import type React from "react";
import Image from "next/image";
import { useState, useMemo, useCallback, useEffect, memo } from "react";
import { Camera, Aperture, Focus, ZoomIn, Sparkles, AlertCircle, X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import useSWR from "swr";

// Lazy load particles - decorative only
const FloatingParticles = dynamic(
  () => import("@/components/animated-golden-particles"),
  { ssr: false }
);

type Category = string;

interface GalleryImage {
  id: number;
  title: string;
  alt: string;
  category: string;
  camera?: string;
  image_path: string;
}

interface CategoryItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface GroupedImages {
  title: string;
  images: GalleryImage[];
  coverImage: GalleryImage;
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const iconMap: Record<string, React.ReactNode> = {
  all: <Camera className="w-4 h-4" />,
  weddings: <Sparkles className="w-4 h-4" />,
  portraits: <Focus className="w-4 h-4" />,
  events: <ZoomIn className="w-4 h-4" />,
  products: <Aperture className="w-4 h-4" />,
};

// ─── Gallery Card ─────────────────────────────────────────────────────────────
const GalleryCard = memo(({ group, index, onClick }: {
  group: GroupedImages;
  index: number;
  onClick: () => void;
}) => {
  const getImageUrl = useCallback((path: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `${API_IMG}/${path}`;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer"
      whileHover={{ y: -4 }}
      style={{
        background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
        border: "1px solid rgba(212,168,67,0.2)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
      onHoverStart={() => {}}
    >
      {/* Corner brackets — amber gold */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-amber-200/40 z-10 pointer-events-none" />
      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-200/40 z-10 pointer-events-none" />
      <div className="absolute bottom-[4.5rem] left-3 w-6 h-6 border-l-2 border-b-2 border-amber-200/40 z-10 pointer-events-none" />
      <div className="absolute bottom-[4.5rem] right-3 w-6 h-6 border-r-2 border-b-2 border-amber-200/40 z-10 pointer-events-none" />

      {/* Viewfinder crosshair — on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-200/20" />
        <div className="absolute left-1/2 top-0 bottom-[4.5rem] w-px bg-amber-200/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+2rem)] w-8 h-8 border border-amber-200/40 rounded-full" />
      </div>

      {/* Photo count badge */}
      {group.images.length > 1 && (
        <div className="absolute top-4 right-4 z-20 bg-black/70 border border-amber-200/30 text-amber-200 text-xs font-bold px-3 py-1 backdrop-blur-sm">
          {group.images.length} photos
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
        <Image
          src={getImageUrl(group.coverImage.image_path)}
          alt={group.coverImage.alt || group.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark overlay with gold tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 group-hover:from-black/50 transition-all duration-500" />
        {/* Gold shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-amber-200/10 to-transparent" />
      </div>

      {/* Caption */}
      <div className="px-5 py-4 border-t border-amber-200/10">
        <p className="text-white font-semibold text-sm tracking-wide truncate">{group.title}</p>
        <p className="text-amber-200/60 text-xs uppercase tracking-widest mt-1">{group.coverImage.category}</p>
      </div>
    </motion.div>
  );
});
GalleryCard.displayName = "GalleryCard";

// ─── Image Modal ──────────────────────────────────────────────────────────────
const ImageModal = memo(({ selectedGroup, modalImageIndex, onClose, onPrev, onNext, onThumbnailClick }: {
  selectedGroup: GroupedImages;
  modalImageIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onThumbnailClick: (index: number) => void;
}) => {
  const getImageUrl = useCallback((path: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `${API_IMG}/${path}`;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-amber-200/30 text-amber-200 hover:border-amber-200/70 hover:bg-amber-200/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
            border: "1px solid rgba(212,168,67,0.25)",
            maxWidth: "900px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,168,67,0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200/10">
            <div className="flex items-center gap-3">
              <span className="text-amber-200">✦</span>
              <span className="text-white font-semibold text-sm tracking-wide">{selectedGroup.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-amber-200/50 text-xs tracking-widest">
                {modalImageIndex + 1} / {selectedGroup.images.length}
              </span>
              {/* Camera settings badge */}
              <div className="hidden sm:flex items-center gap-2 bg-amber-200/10 border border-amber-200/20 text-amber-200 text-xs px-3 py-1">
                <span className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
                f/1.4 · 1/200s · ISO 100
              </div>
            </div>
          </div>

          {/* Main image */}
          <div className="relative flex-1" style={{ minHeight: "400px", background: "#080604" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={modalImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={getImageUrl(selectedGroup.images[modalImageIndex].image_path)}
                  alt={selectedGroup.images[modalImageIndex].alt || selectedGroup.title}
                  fill
                  className="object-contain"
                  sizes="900px"
                />
              </motion.div>
            </AnimatePresence>

            {/* Viewfinder grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-amber-200" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-amber-200" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-amber-200" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-amber-200" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-amber-200 rounded-full" />
            </div>

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-200/30 pointer-events-none" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-200/30 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-200/30 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-200/30 pointer-events-none" />

            {selectedGroup.images.length > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-amber-200/30 text-amber-200 hover:bg-amber-200/10 transition-all backdrop-blur-sm bg-black/40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-amber-200/30 text-amber-200 hover:bg-amber-200/10 transition-all backdrop-blur-sm bg-black/40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {selectedGroup.images.length > 1 && (
            <div className="flex gap-2 px-4 py-3 border-t border-amber-200/10 overflow-x-auto">
              {selectedGroup.images.map((image, idx) => (
                <div
                  key={image.id}
                  onClick={() => onThumbnailClick(idx)}
                  className="relative flex-shrink-0 w-14 h-14 cursor-pointer overflow-hidden transition-all duration-200"
                  style={{
                    border: idx === modalImageIndex ? "2px solid #d4a843" : "1px solid rgba(212,168,67,0.2)",
                    opacity: idx === modalImageIndex ? 1 : 0.5,
                  }}
                >
                  <Image src={getImageUrl(image.image_path)} alt={image.alt} fill className="object-cover" sizes="56px" />
                </div>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 px-6 py-3 border-t border-amber-200/10">
            <Camera className="w-3.5 h-3.5 text-amber-200" />
            {selectedGroup.images[modalImageIndex].camera && (
              <>
                <span className="text-amber-200/60 text-xs tracking-wide">{selectedGroup.images[modalImageIndex].camera}</span>
                <span className="text-amber-200/30 text-xs">·</span>
              </>
            )}
            <span className="text-amber-200/60 text-xs tracking-widest uppercase">{selectedGroup.images[modalImageIndex].category}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
ImageModal.displayName = "ImageModal";

// ─── Main Portfolio Page ───────────────────────────────────────────────────────
export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedGroup, setSelectedGroup] = useState<GroupedImages | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const { data: categoriesData } = useSWR<{ success: boolean; data: string[] }>(
    "/api/portfolio/categories",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const { data, error, isLoading } = useSWR<{ success: boolean; data: GalleryImage[] }>(
    selectedCategory === "all" ? "/api/portfolio" : `/api/portfolio?category=${selectedCategory}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  const galleryImages = data?.data || [];

  const categories: CategoryItem[] = useMemo(() => {
    const apiCategories = categoriesData?.data || [];
    const items: CategoryItem[] = [{ value: "all", label: "All Work", icon: iconMap.all }];
    apiCategories.forEach((cat) => {
      const key = String(cat).toLowerCase();
      items.push({
        value: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        icon: iconMap[key] || <Camera className="w-4 h-4" />,
      });
    });
    return items;
  }, [categoriesData]);

  const groupedImages: GroupedImages[] = useMemo(() => {
    const grouped = galleryImages.reduce((acc, image) => {
      if (!acc[image.title]) acc[image.title] = [];
      acc[image.title].push(image);
      return acc;
    }, {} as Record<string, GalleryImage[]>);
    return Object.entries(grouped).map(([title, images]) => ({ title, images, coverImage: images[0] }));
  }, [galleryImages]);

  const openModal = useCallback((group: GroupedImages) => {
    setSelectedGroup(group);
    setModalImageIndex(0);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelectedGroup(null);
    setModalImageIndex(0);
    document.body.style.overflow = "auto";
  }, []);

  const handleModalPrev = useCallback(() => {
    setModalImageIndex((prev) => (!selectedGroup ? prev : (prev - 1 + selectedGroup.images.length) % selectedGroup.images.length));
  }, [selectedGroup]);

  const handleModalNext = useCallback(() => {
    setModalImageIndex((prev) => (!selectedGroup ? prev : (prev + 1) % selectedGroup.images.length));
  }, [selectedGroup]);

  useEffect(() => { return () => { document.body.style.overflow = "auto"; }; }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #000000 0%, #0d0a04 50%, #1a0f00 100%)" }}>

      {/* Ambient gold orbs — same as HeroSection */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-yellow-100/8 rounded-full blur-3xl opacity-15 pointer-events-none" />

      <FloatingParticles count={12} />

      {/* Top border — light gold */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 px-6 text-center">
        {/* Corner brackets */}
        <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-amber-200 pointer-events-none">
          <div className="absolute top-0 left-0 w-3 h-3 bg-amber-200" />
        </div>
        <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-amber-200 pointer-events-none">
          <div className="absolute top-0 right-0 w-3 h-3 bg-amber-200" />
        </div>

        {/* Studio label */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          <p className="text-amber-200 font-black tracking-widest text-sm">G-LIMIT STUDIO</p>
          <span className="flex items-center gap-0.5 text-amber-200">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-200 text-amber-200" />)}
            <span className="ml-1 font-bold text-xs">5.0</span>
          </span>
        </motion.div>

        {/* Titles */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="text-5xl md:text-7xl font-serif font-light text-white leading-tight"
        >
          Our finest
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="text-5xl md:text-7xl font-serif font-light bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent leading-tight"
        >
          work.
        </motion.h1>

        {/* Gold underline */}
        <div className="h-px w-24 bg-gradient-to-r from-amber-200 to-transparent mx-auto mt-4 mb-6" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed"
        >
          {isLoading
            ? "Loading portfolio…"
            : `A curated collection across ${categories.length > 1 ? categories.length - 1 : "multiple"} categories — weddings, portraits, events, and more.`}
        </motion.p>

        {/* f-stop badge */}
        <div className="inline-flex items-center gap-2 mt-6 bg-amber-200/10 border border-amber-200/20 text-amber-200 text-xs font-bold px-4 py-2">
          <span className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
          f/1.4 · 1/200s · ISO 100
        </div>
      </section>

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="max-w-xl mx-auto px-6 mb-8">
          <div className="flex items-start gap-3 p-4 border border-amber-200/20 bg-amber-200/5 text-amber-200">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Failed to load portfolio</p>
              <p className="text-amber-200/60 text-xs mt-1">Please check your API configuration.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 justify-center px-6 pb-10 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
              selectedCategory === cat.value
                ? "bg-gradient-to-r from-amber-200 to-yellow-100 text-black border-transparent shadow-lg shadow-amber-200/30"
                : "border-amber-200/20 text-amber-200/70 hover:border-amber-200/50 hover:text-amber-200 bg-transparent"
            }`}
          >
            {cat.icon}
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* ── Gallery Grid ─────────────────────────────────────────────────── */}
      <div className="px-6 pb-24 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-amber-200/50 text-xs tracking-widest uppercase">Loading portfolio…</p>
          </div>
        ) : groupedImages.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-10 h-10 text-amber-200/20 mx-auto mb-4" />
            <p className="text-amber-200/40 text-sm tracking-wide">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {groupedImages.map((group, index) => (
              <GalleryCard key={group.title} group={group} index={index} onClick={() => openModal(group)} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      {selectedGroup && (
        <ImageModal
          selectedGroup={selectedGroup}
          modalImageIndex={modalImageIndex}
          onClose={closeModal}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
          onThumbnailClick={setModalImageIndex}
        />
      )}
    </div>
  );
}
