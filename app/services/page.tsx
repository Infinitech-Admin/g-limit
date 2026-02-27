"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Camera, Users, PartyPopper, Package, Building2, User,
  Clock, Sparkles, Check, Aperture, Film, Zap, MapPin
} from "lucide-react"
import { useBookingStore } from "@/store/useBookingStore"
import { useRouter } from "next/navigation"

const apertureBlades = 8
const ACCENT = "#f5d98a"
const ACCENT_GLOW = "#ecc84e"
const ACCENT_DIM = "rgba(245,217,138,0.12)"

const photographyServices = [
  {
    title: "Wedding Photography",
    description: "Celebrate your special day with timeless, artistic wedding photography. Full day coverage capturing every emotional moment.",
    features: ["8-10 hour coverage", "Two photographers", "Edited digital gallery", "Print releases included"],
    icon: <Users className="w-5 h-5" />, serviceType: "wedding", tag: "Most Popular",
  },
  {
    title: "Portrait Photography",
    description: "Professional portraits for headshots, families, couples, and personal brands. Captured in our studio or on location.",
    features: ["60-120 min session", "Professional styling", "50+ edited images", "Digital gallery + prints"],
    icon: <User className="w-5 h-5" />, serviceType: "portrait", tag: null,
  },
  {
    title: "Event Photography",
    description: "Document your corporate events, galas, conferences, and celebrations with professional coverage and storytelling.",
    features: ["Flexible hours", "Multiple photographers", "Candid + posed shots", "Same-day highlight reel"],
    icon: <PartyPopper className="w-5 h-5" />, serviceType: "event", tag: null,
  },
  {
    title: "Product Photography",
    description: "Showcase your products with stunning, professional imagery designed to elevate your brand and boost sales.",
    features: ["Professional styling", "Unlimited shots", "Photo retouching", "Various backgrounds"],
    icon: <Package className="w-5 h-5" />, serviceType: "product", tag: null,
  },
  {
    title: "Commercial & Branding",
    description: "Build your brand identity with cohesive, professional photography for websites, marketing, and social media.",
    features: ["Custom shoot planning", "Brand consultation", "Multiple deliverables", "Lifestyle shots"],
    icon: <Building2 className="w-5 h-5" />, serviceType: "commercial", tag: "Premium",
  },
  {
    title: "Headshots & Actors",
    description: "Professional headshots for actors, professionals, and performers. Industry-standard quality for casting.",
    features: ["30-min session", "Multiple looks", "Professional makeup", "Express turnaround"],
    icon: <Camera className="w-5 h-5" />, serviceType: "headshot", tag: null,
  },
]

const studioRentalServices = [
  { title: "Studio Space — Half Day", description: "4-hour rental with full access to our professional space.", icon: <Clock className="w-5 h-5" /> },
  { title: "Studio Space — Full Day", description: "8 hours of uninterrupted studio time for larger productions.", icon: <Clock className="w-5 h-5" /> },
  { title: "Video Production Suite", description: "Specialized setup for video production with lighting and audio.", icon: <Film className="w-5 h-5" /> },
  { title: "Makeup & Hair Station", description: "Premium makeup station with professional mirrors and lighting.", icon: <Sparkles className="w-5 h-5" /> },
  { title: "Equipment Rental", description: "Professional cameras, lenses, lighting, and more for rent.", icon: <Camera className="w-5 h-5" /> },
  { title: "Private Events", description: "Host your celebration in our elegant studio space.", icon: <PartyPopper className="w-5 h-5" /> },
]

const amenities = [
  "Professional lighting kits", "Multiple backdrops", "Green screen setup",
  "Studio-grade tripods", "Audio equipment", "Climate controlled", "Free WiFi", "Styling area",
]

export default function ServicesPage() {
  const setSelectedService = useBookingStore((state) => state.setSelectedService)
  const router = useRouter()

  const handleBooking = (serviceType: string) => {
    setSelectedService(serviceType)
    router.push("/booking-form")
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0a0806", fontFamily: "'Georgia', serif" }}>

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(245,217,138,0.06) 0%, transparent 55%)" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 80%, rgba(245,217,138,0.03) 0%, transparent 45%)" }} />

      {/* ── Grid texture ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(${ACCENT}55 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}55 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Aperture SVG left ── */}
      <div className="fixed left-[-8%] top-[20%] w-[360px] h-[360px] opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(apertureBlades)].map((_, i) => (
            <path key={i}
              d={`M100,100 L${100 + 80 * Math.cos((i * 2 * Math.PI) / apertureBlades)},${100 + 80 * Math.sin((i * 2 * Math.PI) / apertureBlades)} A80,80 0 0,1 ${100 + 80 * Math.cos(((i + 1) * 2 * Math.PI) / apertureBlades)},${100 + 80 * Math.sin(((i + 1) * 2 * Math.PI) / apertureBlades)} Z`}
              fill="none" stroke={ACCENT} strokeWidth="0.8"
            />
          ))}
          <circle cx="100" cy="100" r="55" fill="none" stroke={ACCENT} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="78" fill="none" stroke={ACCENT} strokeWidth="0.3" />
        </svg>
      </div>

      {/* ── Aperture SVG right ── */}
      <div className="fixed right-[-5%] bottom-[12%] w-[240px] h-[240px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx="100" cy="100" r={28 + i * 12} fill="none" stroke={ACCENT} strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${ACCENT})` }} />
            <p className="font-sans font-black tracking-[0.3em] text-[10px] uppercase" style={{ color: ACCENT }}>G-Limit Studio</p>
            <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${ACCENT})` }} />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-light text-white leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}
          >
            Our{" "}
            <span className="italic" style={{ background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Services
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base font-sans leading-relaxed max-w-xl" style={{ color: "rgba(245,217,138,0.5)" }}
          >
            From professional photography sessions to studio rentals — everything you need to bring your creative vision to life.
          </motion.p>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6 }}
            className="flex items-center gap-6 mt-10"
          >
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${ACCENT}60, transparent)` }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-5 h-5" style={{ color: `${ACCENT}70` }} />
            </motion.div>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${ACCENT}60, transparent)` }} />
          </motion.div>
        </div>
      </section>

      {/* ── PHOTOGRAPHY SERVICES ── */}
      <section className="pb-24 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: ACCENT }} />
              <span className="text-[10px] font-sans font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>Photography</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white">
              Our <span className="italic" style={{ color: ACCENT }}>Packages</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {photographyServices.map((service, index) => (
              <motion.div key={service.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }} transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative"
              >
                <div
                  className="h-full rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative"
                  style={{ background: "linear-gradient(135deg, #1c1810 0%, #141008 60%, #1a1510 100%)", border: `1px solid rgba(245,217,138,0.1)`, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${ACCENT}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px rgba(245,217,138,0.1)` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,217,138,0.1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)" }}
                >
                  {/* Top shimmer line */}
                  <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${ACCENT}50, transparent)` }} />

                  {/* Inner grid texture */}
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(${ACCENT}88 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}88 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
                  />

                  <div className="p-6 flex flex-col gap-4 flex-1 relative">
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12"
                        style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30`, color: ACCENT }}>
                        {service.icon}
                      </div>
                      {service.tag && (
                        <span className="text-[10px] font-sans font-black tracking-widest uppercase px-3 py-1 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, color: "#000" }}>
                          {service.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-serif font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>{service.title}</h3>
                    <p className="text-sm font-sans leading-relaxed" style={{ color: "rgba(245,217,138,0.45)" }}>{service.description}</p>

                    <div className="h-px" style={{ background: `${ACCENT}15` }} />

                    <ul className="space-y-2">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5 font-sans text-xs" style={{ color: "rgba(245,217,138,0.65)" }}>
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30` }}>
                            <Check className="w-2.5 h-2.5" style={{ color: ACCENT }} />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-2">
                      <button onClick={() => handleBooking(service.serviceType)}
                        className="w-full py-3 rounded-xl font-sans font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
                        style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30`, color: ACCENT }}
                        onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`; b.style.color = "#000"; b.style.borderColor = "transparent"; b.style.boxShadow = `0 0 24px ${ACCENT}40` }}
                        onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = ACCENT_DIM; b.style.color = ACCENT; b.style.borderColor = `${ACCENT}30`; b.style.boxShadow = "none" }}
                      >
                        <Zap className="w-3.5 h-3.5" /> Book Now
                      </button>
                    </div>
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-l border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDIO RENTALS ── */}
      <section className="py-20 px-4 sm:px-6 md:px-10 relative z-10" style={{ borderTop: `1px solid ${ACCENT}12`, borderBottom: `1px solid ${ACCENT}12` }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: ACCENT }} />
              <span className="text-[10px] font-sans font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>Facilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white">
              Studio <span className="italic" style={{ color: ACCENT }}>Rentals</span>
            </h2>
            <p className="mt-2 font-sans text-sm" style={{ color: "rgba(245,217,138,0.4)" }}>Access our fully equipped, professional studio for your creative projects.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studioRentalServices.map((service, index) => (
              <motion.div key={service.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.07 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 rounded-xl transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid rgba(245,217,138,0.08)` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${ACCENT}35`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(245,217,138,0.07)` }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,217,138,0.08)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none" }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12"
                  style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}25`, color: ACCENT }}>
                  {service.icon}
                </div>
                <h3 className="font-serif font-semibold mb-2 text-white">{service.title}</h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(245,217,138,0.4)" }}>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDIO AMENITIES ── */}
      <section className="py-24 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-sans font-black tracking-widest uppercase"
                  style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}25`, color: ACCENT }}>
                  <MapPin className="w-3.5 h-3.5" /> Studio Facilities
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
                Fully Equipped{" "}
                <span className="italic" style={{ color: ACCENT }}>Professional Space</span>
              </h2>
              <p className="font-sans text-sm leading-relaxed mb-10 max-w-md" style={{ color: "rgba(245,217,138,0.45)" }}>
                Our studio features equipment and professional amenities designed for photographers, videographers, and creative professionals.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {amenities.map((amenity, i) => (
                  <motion.div key={amenity}
                    initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 font-sans text-sm" style={{ color: "rgba(245,217,138,0.7)" }}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30` }}>
                      <Check className="w-3 h-3" style={{ color: ACCENT }} />
                    </div>
                    {amenity}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl pointer-events-none" style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}12` }} />
              <div className="absolute -top-4 -left-4 w-10 h-10 pointer-events-none" style={{ borderLeft: `1px solid ${ACCENT}50`, borderTop: `1px solid ${ACCENT}50` }}>
                <div className="absolute top-0 left-0 w-2 h-2 rounded-full" style={{ background: ACCENT }} />
              </div>
              <div className="absolute -bottom-4 -right-4 w-10 h-10 pointer-events-none" style={{ borderRight: `1px solid ${ACCENT}50`, borderBottom: `1px solid ${ACCENT}50` }}>
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full" style={{ background: ACCENT }} />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden" style={{ border: `1px solid ${ACCENT}25` }}>
                <Image src="/studio.jpg" alt="G-Limit Studio" fill sizes="w-full h-full" className="object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,6,0.6), transparent 60%)" }} />
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${ACCENT}80, transparent)` }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 relative z-10" style={{ borderTop: `1px solid ${ACCENT}12` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,217,138,0.04) 0%, transparent 70%)` }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100 }} className="mb-8 inline-block">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-14 h-14 mx-auto" style={{ color: `${ACCENT}60` }} />
            </motion.div>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif font-light text-white mb-5" style={{ letterSpacing: "-0.02em" }}>
            Ready to Get{" "}
            <span className="italic" style={{ background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Started?
            </span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="font-sans text-sm mb-10" style={{ color: "rgba(245,217,138,0.45)" }}>
            Contact us today to discuss your project and book your session.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Link href="/booking-form"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-sans font-bold text-sm tracking-widest uppercase transition-all duration-300"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, color: "#000", boxShadow: `0 8px 40px rgba(245,217,138,0.2)` }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 60px rgba(245,217,138,0.35)`}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 40px rgba(245,217,138,0.2)`}
            >
              <Camera className="w-4 h-4" /> Book a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
