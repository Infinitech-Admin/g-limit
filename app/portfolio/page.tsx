"use client";
import { Button } from "@/components/ui/button";
import type React from "react";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Camera, Aperture, Focus, ZoomIn, Sparkles, AlertCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import FloatingParticles from "@/components/animated-golden-particles";
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

interface GroupedImages {
  title: string;
  images: GalleryImage[];
  coverImage: GalleryImage;
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Icon mapping for dynamic categories
const iconMap: Record<string, React.ReactNode> = {
  all: <Camera className="w-4 h-4" />,
  weddings: <Aperture className="w-4 h-4" />,
  portraits: <Focus className="w-4 h-4" />,
  events: <ZoomIn className="w-4 h-4" />,
  products: <Camera className="w-4 h-4" />,
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<GroupedImages | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);

  // Fetch categories from API
  const { data: categoriesData } = useSWR<{
    success: boolean;
    data: string[];
  }>("/api/portfolio/categories", fetcher);

  // Fetch gallery images
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

  // Build dynamic categories array
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

  // Group images by title
  const groupedImages: GroupedImages[] = useMemo(() => {
    const grouped = galleryImages.reduce((acc, image) => {
      const title = image.title;
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(image);
      return acc;
    }, {} as Record<string, GalleryImage[]>);

    return Object.entries(grouped).map(([title, images]) => ({
      title,
      images,
      coverImage: images[0], // Use first image as cover
    }));
  }, [galleryImages]);

  const openModal = (group: GroupedImages) => {
    setSelectedGroup(group);
    setModalImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setModalImageIndex(0);
    document.body.style.overflow = 'auto';
  };

  const handleModalPrev = () => {
    if (selectedGroup) {
      setModalImageIndex((prev) => 
        (prev - 1 + selectedGroup.images.length) % selectedGroup.images.length
      );
    }
  };

  const handleModalNext = () => {
    if (selectedGroup) {
      setModalImageIndex((prev) => 
        (prev + 1) % selectedGroup.images.length
      );
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `${API_IMG}/${path}`;
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .modal-overlay {
          animation: modalFadeIn 0.2s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated gold particles background */}
        <FloatingParticles count={40} />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 relative">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white mb-6">
                Our{" "}
                <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">
                  Portfolio
                </span>
              </h1>

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
            </div>
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200 ${
                    selectedCategory === category.value
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30"
                      : "bg-black text-amber-500 hover:bg-amber-500/10 border-2 border-amber-500/30"
                  }`}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid - Grouped by Title */}
        <section className="px-6 py-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-400">Loading portfolio items...</p>
              </div>
            ) : groupedImages.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-400">No items found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {groupedImages.map((group, index) => (
                  <div
                    key={group.title}
                    className="relative group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => openModal(group)}
                  >
                    {/* Gold frame with shadow */}
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-1 rounded-lg hover:shadow-xl hover:shadow-amber-500/20 transition-shadow duration-300 border-2 border-amber-500/30">
                      <div className="bg-black p-4 pb-20 rounded-lg relative overflow-hidden">
                        <div className="relative aspect-[4/5] overflow-hidden rounded">
                          <Image
                            src={getImageUrl(group.coverImage.image_path) || "/placeholder.svg"}
                            alt={group.coverImage.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Image count badge */}
                          {group.images.length > 1 && (
                            <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
                              {group.images.length} photos
                            </div>
                          )}

                          {/* Gold overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-50 group-hover:opacity-60 transition-opacity duration-300" />
                        </div>

                        {/* Caption area */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-serif text-xl text-white mb-1">
                            {group.title}
                          </h3>
                          <p className="text-sm text-amber-500 capitalize font-bold tracking-wider">
                            {group.coverImage.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Modal Gallery */}
        {selectedGroup && (
          <div
            className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={closeModal}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <FloatingParticles count={30} />
            </div>

            {/* Close button */}
            <button
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-amber-500 hover:bg-amber-600 rounded-full text-black transition-colors shadow-xl shadow-amber-500/50"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal content */}
            <div
              className="relative w-full max-w-6xl mx-auto px-6 py-20 animate-slide-down"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title and counter */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-serif text-white mb-2">
                  {selectedGroup.title}
                </h2>
                <p className="text-amber-500 font-bold">
                  {modalImageIndex + 1} / {selectedGroup.images.length}
                </p>
              </div>

              {/* Main image */}
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(selectedGroup.images[modalImageIndex].image_path)}
                    alt={selectedGroup.images[modalImageIndex].alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1536px) 90vw, 1536px"
                    loading="eager"
                    priority
                  />
                </div>

                {/* Navigation arrows */}
                {selectedGroup.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-amber-500 hover:bg-amber-600 rounded-full text-black transition-colors shadow-xl"
                      onClick={handleModalPrev}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-amber-500 hover:bg-amber-600 rounded-full text-black transition-colors shadow-xl"
                      onClick={handleModalNext}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {selectedGroup.images.length > 1 && (
                <div className="flex gap-4 justify-center overflow-x-auto pb-4 px-4">
                  {selectedGroup.images.map((image, idx) => (
                    <button
                      key={image.id}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === modalImageIndex
                          ? "border-amber-500 shadow-lg shadow-amber-500/50 scale-105"
                          : "border-amber-500/30 hover:border-amber-500/60"
                      }`}
                      onClick={() => setModalImageIndex(idx)}
                    >
                      <Image
                        src={getImageUrl(image.image_path)}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="96px"
                        loading="lazy"
                      />
                      {idx === modalImageIndex && (
                        <div className="absolute inset-0 bg-amber-500/20" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Image details */}
              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  {selectedGroup.images[modalImageIndex].camera && (
                    <span className="text-amber-500 font-semibold">
                      {selectedGroup.images[modalImageIndex].camera}
                    </span>
                  )}
                  {selectedGroup.images[modalImageIndex].camera && " • "}
                  <span className="capitalize">
                    {selectedGroup.images[modalImageIndex].category}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
