import { HeroSection } from "@/components/home/hero-section"
import { SpotlightGallery } from "@/components/StudioGallery"
import { CategoriesSection } from "@/components/home/categories-section"
import { PricingSection } from "@/components/home/pricing-section" // NEW
import AboutSection from "@/components/home/about-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <SpotlightGallery />
      </ErrorBoundary>
      <ErrorBoundary>
        <CategoriesSection />
      </ErrorBoundary>
      {/* NEW: pricing section */}
      <ErrorBoundary>
        <PricingSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <AboutSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <TestimonialsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <CTASection />
      </ErrorBoundary>
    </div>
  )
}
