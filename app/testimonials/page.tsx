import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export const metadata: Metadata = {
  title: "Client Feedback",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-black">
      <TestimonialsSection />
    </main>
  );
}
