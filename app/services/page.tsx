"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Camera, Users, PartyPopper, Package, Building2, User,
  Clock, MapPin, Sparkles, Check, Aperture, Film, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBookingStore } from "@/store/useBookingStore"
import { useRouter } from "next/navigation"

const photographyServices = [
  {
    title: "Wedding Photography",
    description: "Celebrate your special day with timeless, artistic wedding photography. Full day coverage capturing every emotional moment.",
    features: ["8-10 hour coverage", "Two photographers", "Edited digital gallery", "Print releases included"],
    icon: <Users className="w-5 h-5" />,
    serviceType: "wedding",
    tag: "Most Popular",
  },
  {
    title: "Portrait Photography",
    description: "Professional portraits for headshots, families, couples, and personal brands. Captured in our studio or on location.",
    features: ["60-120 min session", "Professional styling", "50+ edited images", "Digital gallery + prints"],
    icon: <User className="w-5 h-5" />,
    serviceType: "portrait",
    tag: null,
  },
  {
    title: "Event Photography",
    description: "Document your corporate events, galas, conferences, and celebrations with professional coverage and storytelling.",
    features: ["Flexible hours", "Multiple photographers", "Candid + posed shots", "Same-day highlight reel"],
    icon: <PartyPopper className="w-5 h-5" />,
    serviceType: "event",
    tag: null,
  },
  {
    title: "Product Photography",
    description: "Showcase your products with stunning, professional imagery designed to elevate your brand and boost sales.",
    features: ["Professional styling", "Unlimited shots", "Photo retouching", "Various backgrounds"],
    icon: <Package className="w-5 h-5" />,
    serviceType: "product",
    tag: null,
  },
  {
    title: "Commercial & Branding",
    description: "Build your brand identity with cohesive, professional photography for websites, marketing, and social media.",
    features: ["Custom shoot planning", "Brand consultation", "Multiple deliverables", "Lifestyle shots"],
    icon: <Building2 className="w-5 h-5" />,
    serviceType: "commercial",
    tag: "Premium",
  },
  {
    title: "Headshots & Actors",
    description: "Professional headshots for actors, professionals, and performers. Industry-standard quality for casting.",
    features: ["30-min session", "Multiple looks", "Professional makeup", "Express turnaround"],
    icon: <Camera className="w-5 h-5" />,
    serviceType: "headshot",
    tag: null,
  },
]

const studioRentalServices = [
  {
    title: "Studio Space — Half Day",
    description: "4-hour rental with full access to our professional space.",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    title: "Studio Space — Full Day",
    description: "8 hours of uninterrupted studio time for larger productions.",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    title: "Video Production Suite",
    description: "Specialized setup for video production with lighting and audio.",
    icon: <Film className="w-5 h-5" />,
  },
  {
    title: "Makeup & Hair Station",
    description: "Premium makeup station with professional mirrors and lighting.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    title: "Equipment Rental",
    description: "Professional cameras, lenses, lighting, and more for rent.",
    icon: <Camera className="w-5 h-5" />,
  },
  {
    title: "Private Events",
    description: "Host your celebration in our elegant studio space.",
    icon: <PartyPopper className="w-5 h-5" />,
  },
]

const amenities = [
  "Professional lighting kits",
  "Multiple backdrops",
  "Green screen setup",
  "Studio-grade tripods",
  "Audio equipment",
  "Climate controlled",
  "Free WiFi",
  "Styling area",
]

export default function ServicesPage() {
  const setSelectedService = useBookingStore((state) => state.setSelectedService)
  const router = useRouter()

  const handleBooking = (serviceType: string) => {
    setSelectedService(serviceType)
    router.push("/booking-form")
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(160deg, #faf7f2 0%, #f5f0e8 40%, #ede8df 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative large circle */}
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-amber-300/40 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full border border-amber-400/20 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-amber-700" />
            <span
              className="text-xs tracking-[0.3em] font-sans font-semibold uppercase"
              style={{ color: "#a06820" }}
            >
              G-Limit Studio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-light leading-[0.95] mb-8"
            style={{ color: "#1a1612", letterSpacing: "-0.02em" }}
          >
            Our{" "}
            <em
              className="not-italic font-bold"
              style={{
                background: "linear-gradient(135deg, #c07820, #e8a030)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Services
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl font-sans font-normal leading-relaxed max-w-xl"
            style={{ color: "#5c4f3a" }}
          >
            From professional photography sessions to studio rentals — everything you need to bring your creative vision to life.
          </motion.p>

          {/* Horizontal rule with aperture icon */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="flex items-center gap-6 mt-12"
          >
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #c07820, transparent)" }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-6 h-6" style={{ color: "#c07820" }} />
            </motion.div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, #c07820, transparent)" }} />
          </motion.div>
        </div>
      </section>

      {/* ── PHOTOGRAPHY SERVICES ── */}
      <section className="pb-24 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-baseline gap-6">
              <h2
                className="text-3xl md:text-4xl font-light"
                style={{ color: "#1a1612" }}
              >
                Photography{" "}
                <span
                  className="font-bold"
                  style={{ color: "#c07820" }}
                >
                  Packages
                </span>
              </h2>
              <div className="hidden md:block h-px flex-1 max-w-xs" style={{ background: "#d4b896" }} />
              <span
                className="hidden md:block text-xs font-sans tracking-widest uppercase"
                style={{ color: "#8a7560" }}
              >
                {photographyServices.length} services
              </span>
            </div>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {photographyServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative"
              >
                {/* Card */}
                <div
                  className="h-full rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    background: "#fff9f2",
                    border: "1px solid #e2d5c0",
                    boxShadow: "0 2px 20px rgba(160,104,32,0.06)",
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1 w-full"
                    style={{ background: "linear-gradient(90deg, #c07820, #e8a030, #c07820)" }}
                  />

                  <div className="p-6 md:p-8">
                    {/* Tag + Icon row */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12"
                        style={{
                          background: "linear-gradient(135deg, #1a1612, #2d2419)",
                          color: "#e8a030",
                        }}
                      >
                        {service.icon}
                      </div>
                      {service.tag && (
                        <span
                          className="text-xs font-sans font-semibold tracking-wider uppercase px-3 py-1 rounded-full"
                          style={{ background: "#1a1612", color: "#e8a030" }}
                        >
                          {service.tag}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-semibold mb-3"
                      style={{ color: "#1a1612", letterSpacing: "-0.01em" }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm font-sans leading-relaxed mb-6"
                      style={{ color: "#6b5d4a" }}
                    >
                      {service.description}
                    </p>

                    {/* Divider */}
                    <div className="h-px mb-5" style={{ background: "#ede0cc" }} />

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 font-sans text-sm" style={{ color: "#4a3d2a" }}>
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "#fef0d6" }}
                          >
                            <Check className="w-3 h-3" style={{ color: "#c07820" }} />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handleBooking(service.serviceType)}
                      className="w-full py-3 rounded-xl font-sans font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      style={{
                        background: "linear-gradient(135deg, #1a1612, #2d2419)",
                        color: "#e8a030",
                        border: "1px solid #2d2419",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #c07820, #e8a030)"
                        ;(e.currentTarget as HTMLButtonElement).style.color = "#1a1612"
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1a1612, #2d2419)"
                        ;(e.currentTarget as HTMLButtonElement).style.color = "#e8a030"
                      }}
                    >
                      <Zap className="w-4 h-4" />
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDIO RENTALS ── */}
      <section
        className="py-20 px-4 sm:px-6 md:px-10 relative overflow-hidden"
        style={{ background: "#1a1612" }}
      >
        {/* Decorative grain overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Corner decoration */}
        <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none">
          <div className="absolute top-6 left-6 w-20 h-20" style={{ border: "1px solid rgba(200,130,40,0.3)", borderRight: "none", borderBottom: "none" }} />
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none">
          <div className="absolute bottom-6 right-6 w-20 h-20" style={{ border: "1px solid rgba(200,130,40,0.3)", borderLeft: "none", borderTop: "none" }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8" style={{ background: "#c07820" }} />
              <span className="text-xs font-sans tracking-[0.3em] uppercase" style={{ color: "#a06820" }}>
                Facilities
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light" style={{ color: "#faf7f2" }}>
              Studio{" "}
              <span className="font-bold" style={{ color: "#e8a030" }}>
                Rentals
              </span>
            </h2>
            <p className="mt-3 font-sans text-base max-w-xl" style={{ color: "#a09080" }}>
              Access our fully equipped, professional studio for your creative projects.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studioRentalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl cursor-default transition-all duration-300"
                style={{
                  background: "rgba(255,249,242,0.04)",
                  border: "1px solid rgba(200,150,60,0.2)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,249,242,0.08)"
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,150,60,0.5)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,249,242,0.04)"
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,150,60,0.2)"
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "rgba(200,130,40,0.15)", color: "#e8a030" }}
                >
                  {service.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "#faf7f2" }}>
                  {service.title}
                </h3>
                <p className="text-sm font-sans leading-relaxed" style={{ color: "#8a7a68" }}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDIO AMENITIES ── */}
      <section className="py-24 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-widest uppercase"
                  style={{ background: "#1a1612", color: "#e8a030" }}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Studio Facilities
                </div>
              </div>

              <h2
                className="text-4xl md:text-5xl font-light leading-tight mb-6"
                style={{ color: "#1a1612", letterSpacing: "-0.02em" }}
              >
                Fully Equipped
                <br />
                <span className="font-bold" style={{ color: "#c07820" }}>
                  Professional Space
                </span>
              </h2>

              <p className="font-sans text-base leading-relaxed mb-10 max-w-md" style={{ color: "#5c4f3a" }}>
                Our studio features equipment and professional amenities designed for photographers, videographers, and creative professionals.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {amenities.map((amenity, i) => (
                  <motion.div
                    key={amenity}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 font-sans text-sm"
                    style={{ color: "#3d3020" }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#1a1612" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "#e8a030" }} />
                    </div>
                    {amenity}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Offset decorative block */}
              <div
                className="absolute -top-4 -right-4 w-full h-full rounded-2xl"
                style={{ background: "#1a1612", zIndex: 0 }}
              />
              <div className="relative z-10 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl" style={{ border: "3px solid #e8a030" }}>
                <Image
                  src="/studio.jpg"
                  alt="G-Limit Studio professional space"
                  fill
                  sizes="w-full h-full"
                  className="object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,22,18,0.5), transparent 60%)" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: "#1a1612" }}>
        {/* Warm radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,130,40,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8 inline-block"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-16 h-16 mx-auto" style={{ color: "#c07820" }} />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-light mb-5"
            style={{ color: "#faf7f2", letterSpacing: "-0.02em" }}
          >
            Ready to Get{" "}
            <em
              className="not-italic font-bold"
              style={{
                background: "linear-gradient(135deg, #c07820, #e8a030)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Started?
            </em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-lg mb-10"
            style={{ color: "#8a7a68" }}
          >
            Contact us today to discuss your project and book your session.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/booking-form"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-sans font-bold text-base tracking-wide transition-all duration-300 hover:gap-4"
              style={{
                background: "linear-gradient(135deg, #c07820, #e8a030)",
                color: "#1a1612",
                boxShadow: "0 8px 40px rgba(200,130,40,0.35)",
              }}
            >
              <Camera className="w-5 h-5" />
              Book a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
