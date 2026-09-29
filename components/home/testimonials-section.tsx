"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight, Star, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import TestimonialsForm from "./testimonials-form";
import { Testimonial } from "@/lib/types/types";

// Lazy load particles
const FloatingParticles = dynamic(
  () => import("../animated-golden-particles"),
  { ssr: false },
);

// Memoized star rating component
const StarRating = memo(
  ({
    rating,
    shouldReduceMotion,
  }: {
    rating: number;
    shouldReduceMotion: boolean;
  }) => {
    return (
      <div className="flex justify-center gap-1.5 mb-6 sm:mb-8">
        {[...Array(rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.1 + i * 0.05,
              duration: 0.3,
            }}
          >
            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-[#d4a574] text-[#d4a574]" />
          </motion.div>
        ))}
      </div>
    );
  },
);

StarRating.displayName = "StarRating";

// Memoized dot navigation component
const DotNavigation = memo(
  ({
    currentIndex,
    totalCount,
    onDotClick,
    shouldReduceMotion,
  }: {
    currentIndex: number;
    totalCount: number;
    onDotClick: (index: number, direction: number) => void;
    shouldReduceMotion: boolean;
  }) => {
    const maxDots = 5;
    const half = Math.floor(maxDots / 2);
    let start = currentIndex - half;
    let end = currentIndex + half;

    if (start < 0) {
      start = 0;
      end = Math.min(maxDots - 1, totalCount - 1);
    }
    if (end >= totalCount) {
      end = totalCount - 1;
      start = Math.max(0, totalCount - maxDots);
    }

    const indices = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i,
    );

    return (
      <div className="flex gap-2 items-center px-2 sm:px-4">
        {indices.map((index) => (
          <button
            key={index}
            onClick={() => onDotClick(index, index > currentIndex ? 1 : -1)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 sm:w-10 h-2.5 sm:h-3 bg-gradient-to-r from-[#d4a574] to-[#c9944a]"
                : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-[#d4a574]/30 hover:bg-[#d4a574]/60"
            }`}
            aria-label={`Go to feedback ${index + 1}`}
          />
        ))}
      </div>
    );
  },
);

DotNavigation.displayName = "DotNavigation";

export function TestimonialsSection() {
  const [feedback, setFeedback] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch("/api/feedback", {
          next: { revalidate: 3600 }, // Cache for 1 hour
        });
        const json = await res.json();
        // Laravel returns { data: [...] }
        setFeedback(Array.isArray(json) ? json : (json?.data ?? []));
      } catch (e) {
        console.error("Failed to load feedback", e);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, []);

  useEffect(() => {
    if (!feedback.length || shouldReduceMotion) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % feedback.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [feedback, shouldReduceMotion]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % feedback.length);
  }, [feedback.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + feedback.length) % feedback.length);
  }, [feedback.length]);

  const handleDotClick = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrentIndex(index);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-black overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading feedback...</div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!feedback.length) {
    return (
      <section className="py-20 md:py-28 bg-black overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">No feedback available</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-black overflow-hidden relative">
      {/* Animated gold particles - lazy loaded, reduced count */}
      {!shouldReduceMotion && <FloatingParticles count={15} />}

      {/* Simplified floating decorative circles - CSS only */}
      <div className="absolute top-20 left-[10%] w-32 h-32 border-2 border-[#d4a574]/20 rounded-full opacity-20" />
      <div className="absolute bottom-32 right-[15%] w-40 h-40 border-2 border-[#d4a574]/15 rounded-full opacity-15" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#d4a574]/10 border border-[#d4a574]/30 text-[#d4a574] px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase">
              Client Stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
            How was your{" "}
            <span className="bg-gradient-to-r from-[#d4a574] via-[#e0b584] to-[#d4a574] bg-clip-text text-transparent italic">
              G-Limit Studio
            </span>{" "}
            experience?
          </h2>

          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real experiences from clients who trusted us to capture their most
            precious moments
          </p>
        </motion.div>

        {/* Main feedback display */}
        <div className="flex flex-col lg:flex-row w-full min-h-screen gap-6">
          {/* Feedback */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-full overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-black rounded-2xl shadow-2xl shadow-[#d4a574]/20 border-2 border-[#d4a574]/30 p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center min-h-[420px] sm:min-h-[460px] md:min-h-[500px]">
                    {/* Quote Icon */}
                    <div className="flex justify-center my-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#d4a574] to-[#c9944a] flex items-center justify-center shadow-lg shadow-[#d4a574]/50 transition-transform duration-300 hover:scale-110">
                        <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                      </div>
                    </div>

                    {/* Rating stars */}
                    <StarRating
                      rating={feedback[currentIndex]?.rating || 5}
                      shouldReduceMotion={!!shouldReduceMotion}
                    />

                    {/* Feedback Content */}
                    <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed text-center mb-8 sm:mb-10 max-w-3xl mx-auto font-light relative z-10 px-2">
                      &ldquo;{feedback[currentIndex]?.message}&rdquo;
                    </blockquote>

                    {/* Client Info */}
                    <div className="flex flex-col items-center gap-5 sm:gap-6">
                      <div className="text-center mb-2 sm:mb-4">
                        <p className="font-serif text-xl sm:text-2xl text-white mb-1">
                          {feedback[currentIndex]?.name}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {feedback[currentIndex]?.title}
                        </p>
                      </div>
                    </div>

                    {/* Corner Decorations */}
                    <div className="absolute top-3 left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-[#d4a574]/50" />
                    <div className="absolute top-3 right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2 border-[#d4a574]/50" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2 border-[#d4a574]/50" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-[#d4a574]/50" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-12 sm:mt-20">
              {/* Prev Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#d4a574]/40 hover:bg-[#d4a574]/20 hover:border-[#d4a574] bg-black/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous feedback"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-[#d4a574]" />
              </Button>

              {/* Dots */}
              <DotNavigation
                currentIndex={currentIndex}
                totalCount={feedback.length}
                onDotClick={handleDotClick}
                shouldReduceMotion={!!shouldReduceMotion}
              />

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#d4a574]/40 hover:bg-[#d4a574]/20 hover:border-[#d4a574] bg-black/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next feedback"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#d4a574]" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-1/2 flex items-center justify-center mt-4 lg:my-auto">
            <TestimonialsForm />
          </div>
        </div>
      </div>
    </section>
  );
}
