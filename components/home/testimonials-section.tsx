"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import TestimonialsForm from "./testimonials-form";
import { TestimonialsList } from "./testimonials-list";

type Props = {
  /** true = feedback cards on the left + form on the right (home page).
   *  false = form only, no fetching (testimonials page). */
  showFeedback?: boolean;
};

export function TestimonialsSection({ showFeedback = true }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section
      id="testimonials"
      className="pt-24 pb-10 md:pt-32 md:pb-14 bg-black overflow-hidden relative scroll-mt-24"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
            How was your{" "}
            <span className="bg-gradient-to-r from-[#d4a574] via-[#e0b584] to-[#d4a574] bg-clip-text text-transparent italic pr-1">
              G-Limit Studio
            </span>{" "}
            experience?
          </h2>
        </motion.div>

        <div
          className={
            showFeedback
              ? "max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 lg:items-start"
              : "max-w-2xl mx-auto"
          }
        >
          {/* LEFT: feedback cards (only mounted / fetched when enabled) */}
          {showFeedback && (
            <div className="order-2 lg:order-1">
              <TestimonialsList refreshKey={refreshKey} />
            </div>
          )}

          {/* RIGHT: form */}
          <div className="order-1 lg:order-2">
            <TestimonialsForm
              onSubmitted={
                showFeedback ? () => setRefreshKey((k) => k + 1) : undefined
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
