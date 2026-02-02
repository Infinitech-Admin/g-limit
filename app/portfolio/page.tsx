"use client";
import { Button } from "@/components/ui/button";
import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Camera, Aperture, Focus, ZoomIn, Sparkles, AlertCircle } from "lucide-react";
import FloatingParticles from "@/components/animated-golden-particles";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import useSWR from "swr";

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

const API_IMG = process.env.NEXT_PUBLIC_API_IMG;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const iconMap: Record<string, React.ReactNode> = {
  all: <Camera className="w-4 h-4" />,
  weddings: <Aperture className="w-4 h-4" />,
  portraits: <Focus className="w-4 h-4" />,
  events: <ZoomIn className="w-4 h-4" />,
  products: <Camera className="w-4 h-4" />,
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: categoriesData } = useSWR<{
    success: boolean;
    data: string[];
  }>("/api/portfolio/categories", fetcher);

  const { data, error, isLoading } = useSWR<{
    success: boolean;
    data: GalleryImage[];
  }>(
    selectedCategory === "all"
      ? "/api/portfolio"
      : `/api/portfolio?category=${selectedCategory}`,
    fetcher
  );

  const galleryImages = data?.data || [];

  const categories: CategoryItem[] = useMemo(() => {
    const apiCategories = categoriesData?.data || [];
    
    const categoryItems: CategoryItem[] = [
      { value: "all", label: "All Work", icon: iconMap.all },
    ];

    apiCategories.forEach((cat) => {
      const categoryStr = String(cat).toLowerCase();
      categoryItems.push({
        value: categoryStr,
        label: categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1),
        icon: iconMap[categoryStr] || <Camera className="w-4 h-4" />,
      });
    });

    return categoryItems;
  }, [categoriesData]);

  const filteredImages = useMemo(() => {
    return galleryImages;
  }, [galleryImages]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredImages.length) % filteredImages.length
    );
  };

  const handleNext = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % filteredImages.length
    );
  };

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    return `${API_IMG}/${path}`;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Reduced particle count */}
      <FloatingParticles count={15} />

      {/* Hero Section - SIMPLIFIED */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* SIMPLIFIED: Only 10 perforations instead of 50 */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black border-b-2 border-amber-500 flex items-center overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={{ x: [0, -100] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-7 bg-gradient-to-b from-amber-500 to-amber-600 rounded-sm shadow-lg shadow-amber-500/30 flex-shrink-0"
              />
            ))}
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto text-center pt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* SIMPLIFIED: Static corners instead of animated */}
            <div className="inline-block relative mb-8">
              <div className="absolute -top-6 -left-6 w-12 h-12 border-l-3 border-t-3 border-amber-500">
                <div className="absolute top-0 left-0 w-3 h-3 bg-amber-500 rounded-full" />
              </div>
              <div className="absolute -top-6 -right-6 w-12 h-12 border-r-3 border-t-3 border-amber-500">
                <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 border-l-3 border-b-3 border-amber-500">
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-amber-500 rounded-full" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border-r-3 border-b-3 border-amber-500">
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white px-12 py-6">
                Our{" "}
                <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">
                  Portfolio
                </span>
              </h1>
            </div>

            {/* SIMPLIFIED: Static sparkles */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <p className="text-lg text-gray-300 max-w-2xl">
                {isLoading
                  ? "Loading portfolio..."
                  : `A curated selection of our finest work${categories.length > 1 ? ` across ${categories.length - 1} categories` : ''}.`}
              </p>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>

            <div className="h-1 w-40 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto bg-red-500/10 border border-red-500/30 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-500 mb-1">Failed to load portfolio</h3>
              <p className="text-sm text-red-400">Please check your API configuration</p>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="px-6 py-8 sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-y border-amber-500/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-2xl shadow-amber-500/50 scale-110"
                    : "bg-black text-amber-500 hover:bg-amber-500/10 border-2 border-amber-500/30 hover:scale-105"
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - HEAVILY SIMPLIFIED */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400">Loading portfolio items...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400">No items found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="relative group cursor-pointer"
                  onClick={() => openLightbox(index)}
                  onMouseEnter={() => setHoveredId(image.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* SIMPLIFIED: Basic frame with hover effect */}
                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-1 rounded-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border-2 border-amber-500/30">
                    <div className="bg-black p-4 pb-20 rounded-lg relative overflow-hidden">
                      <div className="relative aspect-[4/5] overflow-hidden rounded">
                        <Image
                          src={getImageUrl(image.image_path) || "/placeholder.png"}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                          loading={index < 8 ? "eager" : "lazy"}
                          quality={85}
                        />

                        {/* Simple overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

                        {/* SIMPLIFIED: Only show focus corners on hover, no complex animations */}
                        {hoveredId === image.id && (
                          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
                            {/* Simple focus brackets */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-500" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-500" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-500" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-500" />

                            {/* Simple zoom icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <ZoomIn className="w-12 h-12 text-amber-500" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Caption */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-serif text-xl text-white mb-1">{image.title}</h3>
                        <p className="text-sm text-amber-500 capitalize font-bold tracking-wider">
                          {image.category}
                        </p>
                      </div>

                      {/* Simple corner glows */}
                      <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <GalleryLightbox
          image={filteredImages[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          imageUrl={getImageUrl(filteredImages[lightboxIndex].image_path)}
        />
      )}
    </div>
  );
}
