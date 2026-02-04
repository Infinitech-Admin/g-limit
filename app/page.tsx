import { HeroSection } from "@/components/home/hero-section"
import { StudioShowcase } from "@/components/StudioGallery"
import { CategoriesSection } from "@/components/home/categories-section"
import  AboutSection  from "@/components/home/about-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <HeroSection />
      <StudioShowcase />
      <CategoriesSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
