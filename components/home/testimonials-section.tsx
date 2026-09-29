"use client";
import { motion } from "framer-motion";
import TestimonialsForm from "./testimonials-form";

export function TestimonialsSection() {
  return (
    <section className="py-10 md:py-14 bg-black overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            How was your{" "}
            <span className="bg-gradient-to-r from-[#d4a574] via-[#e0b584] to-[#d4a574] bg-clip-text text-transparent italic">
              G-Limit Studio
            </span>{" "}
            experience?
          </h2>
        </motion.div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <TestimonialsForm />
        </div>
      </div>
    </section>
  );
}
