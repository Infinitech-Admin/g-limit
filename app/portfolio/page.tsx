"use client";
import type React from "react";
import Image from "next/image";
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  memo,
  Suspense,
} from "react";
import {
  Camera,
  Aperture,
  Focus,
  ZoomIn,
  Sparkles,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import useSWR from "swr";

// ─── Particles: lazy + only mounted once, not re-rendered ────────────────────
const FloatingParticles = dynamic(
  () => import("@/components/animated-golden-particles"),
  { ssr: false, loading: () => null }
);

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Constants ────────────────────────────────────────────────────────────────
const API_IMG = process.env.NEXT_PUBLIC_API_IMG || "http://localhost:8000";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function getImageUrl(path: string): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${API_IMG}/${path}`;
}

const iconMap: Record<string, React.ReactNode> = {
  all: <Camera className="w-4 h-4" />,
  weddings: <Sparkles className="w-4 h-4" />,
  portraits: <Focus className="w-4 h-4" />,
  events: <ZoomIn className="w-4 h-4" />,
  products: <Aperture className="w-4 h-4" />,
};

// ─── CARD: CSS-only hover, no framer-motion whileHover ───────────────────────
// whileHover with layout-affecting props (y) causes continuous reflow.
// CSS transform is GPU-composited and costs nothing.
const GalleryCard = memo(function GalleryCard({
  group,
  index,
  onClick,
}: {
  group: GroupedImages;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Cap stagger at 200ms — large grids staggered for 3+ seconds otherwise
      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.35 }}
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer card-hover-lift"
      style={{
        background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
        border: "1px solid rgba(212,168,67,0.2)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        // Use will-change only on hover via CSS (see global style below)
      }}
    >
      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-amber-200/40 z-10 pointer-events-none" />
      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-200/40 z-10 pointer-events-none" />
      <div className="absolute bottom-[4.5rem] left-3 w-6 h-6 border-l-2 border-b-2 border-amber-200/40 z-10 pointer-events-none" />
      <div className="absolute bottom-[4.5rem] right-3 w-6 h-6 border-r-2 border-b-2 border-amber-200/40 z-10 pointer-events-none" />

      {/* Crosshair overlay — CSS opacity, no JS */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-200/20" />
        <div className="absolute left-1/2 top-0 bottom-[4.5rem] w-px bg-amber-200/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+2rem)] w-8 h-8 border border-amber-200/40 rounded-full" />
      </div>

      {group.images.length > 1 && (
        <div className="absolute top-4 right-4 z-20 bg-black/70 border border-amber-200/30 text-amber-200 text-xs font-bold px-3 py-1 backdrop-blur-sm">
          {group.images.length} photos
        </div>
      )}

      <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
        <Image
          src={getImageUrl(group.coverImage.image_path)}
          alt={group.coverImage.alt || group.title}
          fill
          loading={index < 4 ? "eager" : "lazy"}
          priority={index < 2}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 group-hover:from-black/50 transition-all duration-500" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-amber-200/10 to-transparent" />
      </div>

      <div className="px-5 py-4 border-t border-amber-200/10">
        <p className="text-white font-semibold text-sm tracking-wide truncate">{group.title}</p>
        <p className="text-amber-200/60 text-xs uppercase tracking-widest mt-1">{group.coverImage.category}</p>
      </div>
    </motion.div>
  );
});

// ─── Modal ────────────────────────────────────────────────────────────────────
const ImageModal = memo(function ImageModal({
  selectedGroup,
  modalImageIndex,
  onClose,
  onPrev,
  onNext,
  onThumbnailClick,
}: {
  selectedGroup: GroupedImages;
  modalImageIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onThumbnailClick: (index: number) => void;
}) {
  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Preload adjacent images
  useEffect(() => {
    const imgs = selectedGroup.images;
    [
      (modalImageIndex + 1) % imgs.length,
      (modalImageIndex - 1 + imgs.length) % imgs.length,
    ].forEach((i) => {
      if (i !== modalImageIndex) {
        const el = new window.Image();
        el.src = getImageUrl(imgs[i].image_path);
      }
    });
  }, [modalImageIndex, selectedGroup.images]);

  const currentImage = selectedGroup.images[modalImageIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "min(94vw, 480px)",
          background: "linear-gradient(160deg, #1c1408 0%, #0d0a04 100%)",
          border: "1px solid rgba(212,168,67,0.28)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(212,168,67,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-amber-200/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-amber-200/80 text-xs">✦</span>
            <span className="text-white font-semibold text-sm tracking-wide truncate">{selectedGroup.title}</span>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
            {selectedGroup.images.length > 1 && (
              <span className="text-amber-200/45 text-xs tabular-nums">
                {modalImageIndex + 1} / {selectedGroup.images.length}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center border border-amber-200/20 text-amber-200/60 hover:text-amber-200 hover:border-amber-200/50 hover:bg-amber-200/10 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Image area — no AnimatePresence per image, just key swap */}
        <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
          <Image
            key={currentImage.id}
            src={getImageUrl(currentImage.image_path)}
            alt={currentImage.alt || selectedGroup.title}
            fill
            className="object-cover"
            sizes="480px"
            priority
          />
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-amber-200/30 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-r border-t border-amber-200/30 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-amber-200/30 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-amber-200/30 pointer-events-none" />

          {selectedGroup.images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center border border-amber-200/30 text-amber-200 bg-black/55 hover:bg-amber-200/15 backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center border border-amber-200/30 text-amber-200 bg-black/55 hover:bg-amber-200/15 backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {selectedGroup.images.length > 1 && (
          <div className="flex gap-1.5 px-3 py-2 border-t border-amber-200/10 overflow-x-auto">
            {selectedGroup.images.map((image, idx) => (
              <button
                key={image.id}
                onClick={() => onThumbnailClick(idx)}
                className="relative flex-shrink-0 w-10 h-10 overflow-hidden transition-all duration-150"
                style={{
                  border: idx === modalImageIndex ? "2px solid #d4a843" : "1px solid rgba(212,168,67,0.15)",
                  opacity: idx === modalImageIndex ? 1 : 0.42,
                }}
              >
                <Image
                  src={getImageUrl(image.image_path)}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="40px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-amber-200/10">
          <Camera className="w-3 h-3 text-amber-200/40 flex-shrink-0" />
          {currentImage.camera && (
            <>
              <span className="text-amber-200/55 text-xs">{currentImage.camera}</span>
              <span className="text-amber-200/20 text-xs">·</span>
            </>
          )}
          <span className="text-amber-200/35 text-xs uppercase tracking-widest">{currentImage.category}</span>
          <span className="ml-auto text-amber-200/20 text-xs hidden sm:block">f/1.4 · 1/200s · ISO 100</span>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────
function PortfolioInner() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedGroup, setSelectedGroup] = useState<GroupedImages | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);

  const { data: categoriesData } = useSWR<{ success: boolean; data: string[] }>(
    "/api/portfolio/categories",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300_000 }
  );

  const swrKey =
    selectedCategory === "all"
      ? `/api/portfolio?page=${page}&perPage=12`
      : `/api/portfolio?category=${selectedCategory}&page=${page}&perPage=12`;

  const { data, error, isLoading } = useSWR<{
    success: boolean;
    data: GalleryImage[];
    last_page: number;
    total: number;
  }>(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
    keepPreviousData: true,
  });

  // Reset on category change
  useEffect(() => {
    setPage(1);
    setAllImages([]);
  }, [selectedCategory]);

  // Accumulate pages
  useEffect(() => {
    if (!data?.data) return;
    if (page === 1) {
      setAllImages(data.data);
    } else {
      setAllImages((prev) => {
        const existingIds = new Set(prev.map((img) => img.id));
        return [...prev, ...data.data.filter((img) => !existingIds.has(img.id))];
      });
    }
  }, [data, page]);

  const categories: CategoryItem[] = useMemo(() => {
    const items: CategoryItem[] = [{ value: "all", label: "All Work", icon: iconMap.all }];
    (categoriesData?.data || []).forEach((cat) => {
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
    const map: Record<string, GalleryImage[]> = {};
    for (const img of allImages) {
      (map[img.title] ??= []).push(img);
    }
    return Object.entries(map).map(([title, images]) => ({
      title,
      images,
      coverImage: images[0],
    }));
  }, [allImages]);

  // Scroll lock — useLayoutEffect avoids the flicker that useEffect causes
  useLayoutEffect(() => {
    if (selectedGroup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedGroup]);

  const openModal = useCallback((group: GroupedImages) => {
    setSelectedGroup(group);
    setModalImageIndex(0);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedGroup(null);
    setModalImageIndex(0);
  }, []);

  const handleModalPrev = useCallback(() => {
    setModalImageIndex((prev) =>
      selectedGroup ? (prev - 1 + selectedGroup.images.length) % selectedGroup.images.length : prev
    );
  }, [selectedGroup]);

  const handleModalNext = useCallback(() => {
    setModalImageIndex((prev) =>
      selectedGroup ? (prev + 1) % selectedGroup.images.length : prev
    );
  }, [selectedGroup]);

  const hasMore = page < (data?.last_page ?? 1);
  const isFirstLoad = isLoading && page === 1 && allImages.length === 0;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #000000 0%, #0d0a04 50%, #1a0f00 100%)" }}
    >
      {/* Background blobs — pointer-events-none, no JS */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-yellow-100/8 rounded-full blur-3xl opacity-15 pointer-events-none" />

      {/* Particles — lazily loaded, isolated, won't block render */}
      <FloatingParticles count={12} />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 text-center">
        <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-amber-200 pointer-events-none">
          <div className="absolute top-0 left-0 w-3 h-3 bg-amber-200" />
        </div>
        <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-amber-200 pointer-events-none">
          <div className="absolute top-0 right-0 w-3 h-3 bg-amber-200" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          <p className="text-amber-200 font-black tracking-widest text-sm">G-LIMIT STUDIO</p>
          <span className="flex items-center gap-0.5 text-amber-200">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-200 text-amber-200" />
            ))}
            <span className="ml-1 font-bold text-xs">5.0</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="text-5xl md:text-7xl font-serif font-light text-white leading-tight"
        >
          Our finest
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="text-5xl md:text-7xl font-serif font-light bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent leading-tight"
        >
          work.
        </motion.h1>

        <div className="h-px w-24 bg-gradient-to-r from-amber-200 to-transparent mx-auto mt-4 mb-6" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed"
        >
          {isFirstLoad
            ? "Loading portfolio…"
            : `A curated collection across ${categories.length > 1 ? categories.length - 1 : "multiple"} categories — weddings, portraits, events, and more.`}
        </motion.p>

        <div className="inline-flex items-center gap-2 mt-6 bg-amber-200/10 border border-amber-200/20 text-amber-200 text-xs font-bold px-4 py-2">
          <span className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
          f/1.4 · 1/200s · ISO 100
        </div>
      </section>

      {/* Error */}
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

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 justify-center px-6 pb-10 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            whileTap={{ scale: 0.97 }}
            // ✅ No whileHover with layout-affecting props here
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

      {/* Grid */}
      <div className="px-6 pb-24 max-w-7xl mx-auto">
        {isFirstLoad ? (
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {groupedImages.map((group, index) => (
                <GalleryCard
                  key={group.title}
                  group={group}
                  index={index}
                  onClick={() => openModal(group)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-3 px-10 py-3 border border-amber-200/30 text-amber-200 text-xs font-bold tracking-widest uppercase hover:border-amber-200/60 hover:bg-amber-200/10 transition-all disabled:opacity-40"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-amber-200/40 border-t-amber-200 rounded-full animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      <span className="w-1 h-1 bg-amber-200 rounded-full" />
                      Load More
                      <span className="w-1 h-1 bg-amber-200 rounded-full" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent pointer-events-none" />

      <AnimatePresence>
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
      </AnimatePresence>

      {/* CSS-only card lift — GPU composited, zero JS ─────────────────────── */}
      <style jsx global>{`
        .card-hover-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card-hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.35);
          border-color: rgba(212,168,67,0.45);
          will-change: transform; /* only hint the compositor during hover */
        }
      `}</style>
    </div>
  );
}

export default function Portfolio() {
  return (
    <Suspense
      fallback={
        <div
          className="relative min-h-screen flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #000 0%, #0d0a04 50%, #1a0f00 100%)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
            <p className="text-amber-200/50 text-xs tracking-widest uppercase">Loading portfolio…</p>
          </div>
        </div>
      }
    >
      <PortfolioInner />
    </Suspense>
  );
}
