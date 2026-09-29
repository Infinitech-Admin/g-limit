import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "Read real experiences from our clients and share your own testimonial.",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-black">
      <TestimonialsSection />
    </main>
  );
}
