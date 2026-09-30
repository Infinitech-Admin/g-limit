"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Feedback = {
  id?: string | number;
  name: string;
  title?: string | null; // package name
  rating: number;
  message: string;
  created_at?: string;
};

const SLIDE_INTERVAL = 5000; // ms per testimonial

// Accepts [..], { data: [..] } or { feedback: [..] }
const normalize = (json: unknown): Feedback[] => {
  if (Array.isArray(json)) return json;
  const obj = json as { data?: Feedback[]; feedback?: Feedback[] };
  return obj?.data ?? obj?.feedback ?? [];
};

export function TestimonialsList({ refreshKey = 0 }: { refreshKey?: number }) {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch("/api/feedback", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        // Only public fields are used; "improvement" is never displayed
        setItems(normalize(json).filter((f) => f?.message));
        setIndex(0);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [refreshKey]);

  const next = useCallback(
    () => setIndex((i) => (items.length ? (i + 1) % items.length : 0)),
    [items.length],
  );

  // Auto-slide
  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [items.length, paused, next, index]); // `index` resets the timer after manual dot click

  if (loading) {
    return (
      <div className="h-56 rounded border border-amber-500/20 bg-amber-500/5 animate-pulse" />
    );
  }

  if (error) {
    return (
      <p className="text-center text-sm text-gray-400">
        Unable to load feedback right now.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400">
        No feedback yet. Be the first to share your experience!
      </p>
    );
  }

  const f = items[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fixed min-height so the layout doesn't jump between slides */}
      <div className="relative min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={f.id ?? index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="rounded border border-amber-500/30 bg-amber-500/5 p-6 flex flex-col min-h-[240px]"
          >
            <div
              className="flex gap-0.5 text-lg mb-3"
              aria-label={`${f.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={
                    f.rating >= s ? "text-yellow-400" : "text-gray-600"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <blockquote className="text-sm md:text-base text-gray-300 leading-relaxed flex-1">
              “{f.message}”
            </blockquote>

            <figcaption className="mt-4 pt-3 border-t border-amber-500/20">
              <span className="block text-white font-semibold text-sm">
                {f.name}
              </span>
              {f.title && (
                <span className="block text-xs text-yellow-400">{f.title}</span>
              )}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-yellow-400"
                  : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
