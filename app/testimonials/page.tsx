import type { Metadata } from "next";
import { motion } from "framer-motion";
import TestimonialsForm from "@/components/home/testimonials-form";

export const metadata: Metadata = {
  title: "Client Feedback",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-black">
      <section className="pt-24 pb-10 md:pt-32 md:pb-14 overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-6 md:mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
              How was your{" "}
              <span className="bg-gradient-to-r from-[#d4a574] via-[#e0b584] to-[#d4a574] bg-clip-text text-transparent italic pr-1">
                G-Limit Studio
              </span>{" "}
              experience?
            </h1>
          </div>

          <div className="max-w-2xl mx-auto">
            <TestimonialsForm />
          </div>
        </div>
      </section>
    </main>
  );
}
