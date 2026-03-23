"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar, Clock, User, Mail, Phone, MessageSquare,
  CreditCard, Upload, X, Check, Camera, Loader2,
  Users, Sparkles, Star, MapPin
} from "lucide-react"
import dynamic from "next/dynamic"

const FloatingParticles = dynamic(
  () => import("@/components/animated-golden-particles"),
  { ssr: false }
)

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    facebook: "",
    referredBy: "",
    date: "",
    time: "",
    package: "",
    serviceType: [] as string[],
    shootType: "",
    shootTypeOther: "",
    location: "",
    locationAddress: "",
    message: "",
    addons: [] as string[],
    addonsOther: "",
    paymentMethod: "",
    paymentProof: null as File | null,
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const packages = [
    {
      id: "basic",
      name: "Basic Studio Session",
      price: "₱1,000",
      duration: "1 hour",
      photos: "20 professionally edited photos",
      features: [
        "Basic studio setup",
        "Choose additional 2 backdrop shoot",
        "FREE use of costumes & accessories",
      ],
      addons: [
        "Extra edited photo — ₱100 every 5 photos",
        "Extended session — ₱1,000 per additional hour",
        "Hair & Make Up Services — ₱1,999 only",
      ],
    },
    {
      id: "standard",
      name: "Standard Studio Session",
      price: "₱1,500",
      duration: "1 hour",
      photos: "30 professionally edited photos",
      features: [
        "Basic studio setup",
        "Choose additional 5 backdrop shoot",
        "FREE use of costumes & accessories",
      ],
      addons: [
        "Extra edited photo — ₱100 every 5 photos",
        "Extended session — ₱1,000 per additional hour",
        "Hair & Make Up Services — ₱1,999 only",
      ],
    },
    {
      id: "premium",
      name: "G-Limitless Premium Studio Session",
      price: "₱3,500",
      duration: "1 hour",
      photos: "Professionally edited digital photos with hair and make up services",
      features: [
        "Basic studio setup",
        "FREE use of 12 backdrop shoot",
        "FREE use of costumes & accessories",
        "FREE Hair & Make Up Services for 1 additional person",
      ],
      addons: ["Extended session — ₱1,000 per additional hour"],
    },
  ]

  const serviceTypes = [
    { id: "photoshoot", label: "Photoshoot" },
    { id: "videography", label: "Videography" },
    { id: "photo-video", label: "Photo & Video" },
    { id: "editing", label: "Editing Only" },
    { id: "event", label: "Event Coverage" },
  ]

  const shootTypes = [
    { id: "portrait", label: "Portrait" },
    { id: "birthday", label: "Birthday" },
    { id: "debut", label: "Debut" },
    { id: "wedding", label: "Wedding" },
    { id: "graduation", label: "Graduation" },
    { id: "product", label: "Product / Brand" },
    { id: "other", label: "Other" },
  ]

  const locations = [
    { id: "studio", label: "Studio" },
    { id: "outdoor", label: "Outdoor" },
    { id: "clients-venue", label: "Client's Venue" },
  ]

  const packageAddons = [
    { id: "extra-photos", label: "Extra Edited Photos" },
    { id: "extra-video", label: "Extra Video Highlights" },
    { id: "rush-editing", label: "Rush Editing" },
    { id: "other", label: "Others" },
  ]

  const paymentMethods = [
    {
      id: "bank",
      name: "Security Bank",
      value: "bank",
      details: "Account: 0000074264683",
      accountname: "INFINITECH ADVERTISING CORPORATION",
    },
    {
      id: "gcash",
      name: "GCash",
      value: "gcash",
      details: "Number: 0969 053 7370",
      accountname: "Jhoanna Mae M. Papio",
    },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceTypeChange = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(serviceId)
        ? prev.serviceType.filter((id) => id !== serviceId)
        : [...prev.serviceType, serviceId],
    }))
  }

  const handleAddonChange = (addonId: string) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter((id) => id !== addonId)
        : [...prev.addons, addonId],
    }))
  }

  const handleLocationChange = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      location: locationId,
      locationAddress: locationId === "studio" ? "" : prev.locationAddress,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, paymentProof: file }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, paymentProof: null }))
    setPreviewUrl(null)
  }

  const getPackagePrice = () => {
    const pkg = packages.find((p) => p.id === formData.package)
    return pkg ? parseInt(pkg.price.replace(/[₱,]/g, "")) : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)
    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("phone", formData.phone)
      data.append("facebook", formData.facebook)
      data.append("referred_by", formData.referredBy)
      data.append("date", formData.date)
      data.append("time", formData.time)
      data.append("package", formData.package)
      data.append("service_type", JSON.stringify(formData.serviceType))
      data.append("shoot_type", formData.shootType)
      data.append("shoot_type_other", formData.shootTypeOther)
      data.append("location", formData.location)
      data.append("location_address", formData.locationAddress)
      data.append("message", formData.message)
      data.append("addons", JSON.stringify(formData.addons))
      data.append("addons_other", formData.addonsOther)
      data.append("payment_method", formData.paymentMethod)
      if (formData.paymentProof) data.append("payment_proof", formData.paymentProof)

      const response = await fetch("/api/reservation-form", { method: "POST", body: data })
      const result = await response.json()

      if (result.success) {
        setSubmitMessage({
          type: "success",
          text: result.message || "Reservation submitted! We'll contact you within 24 hours.",
        })
        setFormData({
          name: "", email: "", phone: "", facebook: "", referredBy: "",
          date: "", time: "", package: "", serviceType: [], shootType: "",
          shootTypeOther: "", location: "", locationAddress: "",
          message: "", addons: [], addonsOther: "", paymentMethod: "", paymentProof: null,
        })
        setPreviewUrl(null)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        setSubmitMessage({ type: "error", text: result.message || "Failed to submit. Please try again." })
      }
    } catch {
      setSubmitMessage({ type: "error", text: "An error occurred. Please try again later." })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ─── design tokens ────────────────────────────────────────────────── */
  // Raised card surface: rich dark charcoal, lighter than pure black
  const cardBg    = "#1c1812"
  const cardBgLt  = "#231f18"   // slightly lighter for inner elements
  const cardBgLLt = "#2a2520"   // hover / selected states
  const goldBright  = "#e8c96a" // headline gold — very legible
  const goldMid     = "#c9a84c" // accent gold
  const goldDim     = "#8a6e30" // muted gold for borders
  const textPrimary = "#f0e8d5" // warm off-white — easy to read
  const textSub     = "#a89878" // secondary text
  const textMuted   = "#6b5c44" // muted/placeholder

  /* shared input */
  const inputBase = [
    "w-full border py-3.5 px-4 text-sm transition-all outline-none",
    `bg-[${cardBgLt}] border-[${goldDim}]/40`,
    `text-[${textPrimary}] placeholder:text-[${textMuted}]`,
    `focus:border-[${goldMid}] focus:ring-2 focus:ring-[${goldMid}]/15`,
  ].join(" ")

  /* Section header */
  const SectionHeader = ({ letter, title }: { letter: string; title: string }) => (
    <div className="flex items-center gap-4 mb-7">
      <div
        className="w-8 h-8 flex items-center justify-center flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${goldBright}, ${goldMid})` }}
      >
        <span className="text-black text-xs font-black">{letter}</span>
      </div>
      <h3 className="font-serif text-xl font-light tracking-wide" style={{ color: textPrimary }}>
        {title}
      </h3>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${goldDim}/60, transparent)` }} />
    </div>
  )

  /* Chip for service / shoot / location / addon selectors */
  const chipBase = (active: boolean) =>
    `flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${
      active
        ? `bg-[${cardBgLLt}] border-[${goldMid}] text-[${goldBright}] shadow-[0_0_12px_rgba(200,160,60,0.15)]`
        : `bg-[${cardBgLt}] border-[${goldDim}]/30 text-[${textSub}] hover:border-[${goldDim}]/70 hover:text-[${textPrimary}]`
    }`

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #12100c 0%, #1a1610 50%, #0e0c08 100%)" }}
    >
      {/* ── Ambient glow ─────────────────────────────────────────────── */}
      <div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,160,60,0.09) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,140,40,0.06) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(180,130,30,0.04) 0%, transparent 70%)" }} />

      {/* ── Subtle gold noise overlay ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' fill='%23c8a040'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${goldBright}, transparent)` }} />

      <FloatingParticles />

      {/* ── Decorative aperture rings ─────────────────────────────────── */}
      <div className="absolute left-8 top-32 pointer-events-none hidden lg:block" style={{ opacity: 0.07 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${80 + i * 30}px`, height: `${80 + i * 30}px`,
              top: `${-i * 15}px`, left: `${-i * 15}px`,
              border: `1px solid ${goldMid}`,
            }} />
        ))}
      </div>
      <div className="absolute right-8 bottom-32 pointer-events-none hidden lg:block" style={{ opacity: 0.07 }}>
        <div className="relative w-48 h-48">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute inset-0 flex justify-center"
              style={{ transform: `rotate(${(i * 360) / 8}deg)` }}>
              <div className="w-px h-full"
                style={{ background: `linear-gradient(to bottom, transparent, ${goldMid}, transparent)` }} />
            </div>
          ))}
          <div className="absolute inset-0 rounded-full" style={{ margin: "30%", border: `1px solid ${goldMid}` }} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24 max-w-6xl">

        {/* ══ Hero Header ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20 relative"
        >
          <div className="absolute top-0 left-0 w-10 h-10 hidden sm:block"
            style={{ borderLeft: `3px solid ${goldMid}`, borderTop: `3px solid ${goldMid}` }} />
          <div className="absolute top-0 right-0 w-10 h-10 hidden sm:block"
            style={{ borderRight: `3px solid ${goldMid}`, borderTop: `3px solid ${goldMid}` }} />

          {/* Brand pill */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 mb-6 mt-4 px-4 py-2"
            style={{
              background: "rgba(200,160,60,0.08)",
              border: `1px solid ${goldDim}`,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: goldBright }} />
            <span className="font-black tracking-[0.2em] text-xs" style={{ color: goldBright }}>
              G-LIMIT STUDIO
            </span>
            <span className="flex items-center gap-0.5 ml-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3" style={{ fill: goldMid, color: goldMid }} />
              ))}
            </span>
            <span className="text-xs font-bold ml-0.5" style={{ color: goldMid }}>5.0</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight"
            style={{ color: textPrimary }}
          >
            Book a session
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight"
            style={{ color: goldBright }}
          >
            with us.
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-px w-24 mx-auto mt-5 mb-6 origin-left"
            style={{ background: `linear-gradient(to right, ${goldMid}, transparent)` }}
          />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="text-base md:text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: textSub }}
          >
            Let's capture your special moments together. Fill in the form below and we'll confirm within 24 hours.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 font-mono text-xs"
            style={{ background: "rgba(200,160,60,0.06)", border: `1px solid ${goldDim}/40`, color: goldMid }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: goldBright }} />
            f/1.4 · 1/200s · ISO 100
          </motion.div>
        </motion.div>

        {/* ── Success / Error Banner ──────────────────────────────────── */}
        <AnimatePresence>
          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-4xl mx-auto mb-10 p-5 flex items-center gap-3"
              style={
                submitMessage.type === "success"
                  ? { background: "rgba(200,160,60,0.1)", border: `1px solid ${goldDim}`, color: goldBright }
                  : { background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.4)", color: "#f87171" }
              }
            >
              {submitMessage.type === "success"
                ? <Check className="w-5 h-5 flex-shrink-0" />
                : <X className="w-5 h-5 flex-shrink-0" />}
              <p className="text-sm font-semibold">{submitMessage.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ Packages ══════════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }} className="mb-16">

          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(to right, transparent, ${goldDim})` }} />
            <span className="font-black tracking-[0.2em] text-xs" style={{ color: goldMid }}>
              OUR PACKAGES
            </span>
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(to left, transparent, ${goldDim})` }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packages.map((pkg, index) => (
              <motion.div key={pkg.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                style={{
                  background: pkg.id === "premium"
                    ? `linear-gradient(145deg, #221c12 0%, #2c2210 100%)`
                    : cardBg,
                  border: pkg.id === "premium"
                    ? `1px solid ${goldMid}`
                    : `1px solid ${goldDim}/25`,
                  boxShadow: pkg.id === "premium"
                    ? `0 0 40px rgba(200,160,60,0.12), 0 4px 16px rgba(0,0,0,0.4)`
                    : `0 4px 16px rgba(0,0,0,0.3)`,
                }}
              >
                {/* Corner brackets */}
                {["tl","tr","bl","br"].map((pos) => (
                  <div key={pos} className="absolute w-4 h-4"
                    style={{
                      top: pos.startsWith("t") ? "10px" : "auto",
                      bottom: pos.startsWith("b") ? "10px" : "auto",
                      left: pos.endsWith("l") ? "10px" : "auto",
                      right: pos.endsWith("r") ? "10px" : "auto",
                      borderTop: pos.startsWith("t") ? `1.5px solid ${goldDim}` : undefined,
                      borderBottom: pos.startsWith("b") ? `1.5px solid ${goldDim}` : undefined,
                      borderLeft: pos.endsWith("l") ? `1.5px solid ${goldDim}` : undefined,
                      borderRight: pos.endsWith("r") ? `1.5px solid ${goldDim}` : undefined,
                    }}
                  />
                ))}

                <div className="p-7 relative">
                  {pkg.id === "premium" && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 mb-4 tracking-[0.15em] uppercase"
                      style={{ background: `linear-gradient(to right, ${goldBright}, ${goldMid})`, color: "#0e0c08" }}>
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </div>
                  )}

                  <h3 className="font-semibold text-base mb-2 leading-snug" style={{ color: textPrimary }}>
                    {pkg.name}
                  </h3>
                  <p className="text-3xl font-serif font-light mb-1" style={{ color: goldBright }}>
                    {pkg.price}
                  </p>
                  <p className="text-xs mb-5" style={{ color: textMuted }}>
                    {pkg.duration} · {pkg.photos}
                  </p>

                  <div className="h-px mb-4"
                    style={{ background: `linear-gradient(to right, ${goldDim}/50, transparent)` }} />

                  <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: goldMid }}>
                    Inclusions
                  </p>
                  <div className="space-y-2 mb-5">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ border: `1px solid ${goldDim}`, background: "rgba(200,160,60,0.08)" }}>
                          <Check className="w-2.5 h-2.5" style={{ color: goldMid }} />
                        </div>
                        <span className="text-xs leading-relaxed" style={{ color: textSub }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px mb-4"
                    style={{ background: `linear-gradient(to right, ${goldDim}/50, transparent)` }} />

                  <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: goldMid }}>
                    Add-Ons Available
                  </p>
                  <div className="space-y-1.5">
                    {pkg.addons.map((a, i) => (
                      <p key={i} className="text-xs" style={{ color: textMuted }}>· {a}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══ Booking Form ══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative"
          style={{
            background: `linear-gradient(160deg, ${cardBg} 0%, #181410 100%)`,
            border: `1px solid ${goldDim}/40`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,160,60,0.04)",
          }}
        >
          {/* Corner brackets */}
          {["tl","tr","bl","br"].map((pos) => (
            <div key={pos} className="absolute w-12 h-12 z-10"
              style={{
                top: pos.startsWith("t") ? "-1px" : "auto",
                bottom: pos.startsWith("b") ? "-1px" : "auto",
                left: pos.endsWith("l") ? "-1px" : "auto",
                right: pos.endsWith("r") ? "-1px" : "auto",
                borderTop: pos.startsWith("t") ? `3px solid ${goldBright}` : undefined,
                borderBottom: pos.startsWith("b") ? `3px solid ${goldBright}` : undefined,
                borderLeft: pos.endsWith("l") ? `3px solid ${goldBright}` : undefined,
                borderRight: pos.endsWith("r") ? `3px solid ${goldBright}` : undefined,
              }}
            >
              {/* Corner dot */}
              <div className="absolute w-2 h-2"
                style={{
                  top: pos.startsWith("t") ? 0 : "auto",
                  bottom: pos.startsWith("b") ? 0 : "auto",
                  left: pos.endsWith("l") ? 0 : "auto",
                  right: pos.endsWith("r") ? 0 : "auto",
                  background: goldBright,
                }} />
            </div>
          ))}

          {/* Top accent stripe */}
          <div className="h-0.5 w-full"
            style={{ background: `linear-gradient(to right, transparent, ${goldMid}, ${goldBright}, ${goldMid}, transparent)` }} />

          {/* Subtle viewfinder grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025 }}>
            <div className="absolute top-1/3 left-0 right-0 h-px" style={{ background: goldMid }} />
            <div className="absolute top-2/3 left-0 right-0 h-px" style={{ background: goldMid }} />
            <div className="absolute left-1/3 top-0 bottom-0 w-px" style={{ background: goldMid }} />
            <div className="absolute left-2/3 top-0 bottom-0 w-px" style={{ background: goldMid }} />
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-14 space-y-12">

            {/* ── A. Client Information ──────────────────────────────── */}
            <section>
              <SectionHeader letter="A" title="Client Information" />
              <div className="space-y-5">

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2"
                    style={{ color: textSub }}>
                    Full Name <span style={{ color: goldBright }}>*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: goldDim }} />
                    <input type="text" name="name" placeholder="Enter your full name" required
                      value={formData.name} onChange={handleChange}
                      className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                      style={{
                        background: cardBgLt, borderColor: `${goldDim}50`,
                        color: textPrimary,
                      }}
                      onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                      onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[
                    { name: "phone", label: "Contact Number", placeholder: "+63 XXX XXX XXXX", type: "tel", Icon: Phone },
                    { name: "email", label: "Email Address", placeholder: "your.email@example.com", type: "email", Icon: Mail },
                  ].map(({ name, label, placeholder, type, Icon }) => (
                    <div key={name}>
                      <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                        {label} <span style={{ color: goldBright }}>*</span>
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: goldDim }} />
                        <input type={type} name={name} placeholder={placeholder} required
                          value={(formData as any)[name]} onChange={handleChange}
                          className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                          onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                      Facebook / Instagram
                    </label>
                    <input type="text" name="facebook" placeholder="@yourusername"
                      value={formData.facebook} onChange={handleChange}
                      className="w-full border py-3.5 px-4 text-sm transition-all outline-none"
                      style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                      onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                      onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                      Referred By{" "}
                      <span className="font-normal normal-case tracking-normal" style={{ color: textMuted }}>
                        (optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: goldDim }} />
                      <input type="text" name="referredBy" placeholder="Name of referrer"
                        value={formData.referredBy} onChange={handleChange}
                        className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                        style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                        onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                        onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${goldDim}/40, transparent)` }} />

            {/* ── B. Service Details ────────────────────────────────── */}
            <section>
              <SectionHeader letter="B" title="Service Details" />
              <div className="space-y-7">

                {/* Service Type */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: textSub }}>
                    Type of Service <span style={{ color: goldBright }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {serviceTypes.map((s) => {
                      const active = formData.serviceType.includes(s.id)
                      return (
                        <label key={s.id} className="flex items-center gap-3 p-3.5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-all"
                            style={{
                              border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50`,
                              background: active ? `${goldMid}25` : "transparent",
                            }}>
                            {active && <Check className="w-2.5 h-2.5" style={{ color: goldBright }} />}
                          </div>
                          <input type="checkbox" checked={active}
                            onChange={() => handleServiceTypeChange(s.id)} className="hidden" />
                          <span className="text-sm">{s.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Shoot Type */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: textSub }}>
                    Shoot Type <span style={{ color: goldBright }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {shootTypes.map((s) => {
                      const active = formData.shootType === s.id
                      return (
                        <label key={s.id} className="flex items-center gap-3 p-3.5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50` }}>
                            {active && <div className="w-2 h-2 rounded-full" style={{ background: goldBright }} />}
                          </div>
                          <input type="radio" name="shootType" value={s.id}
                            checked={active} onChange={handleChange} className="hidden" required />
                          <span className="text-sm">{s.label}</span>
                        </label>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {formData.shootType === "other" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="mt-3.5 overflow-hidden">
                        <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                          Please specify <span style={{ color: goldBright }}>*</span>
                        </label>
                        <input type="text" name="shootTypeOther" placeholder="Enter shoot type"
                          required={formData.shootType === "other"} value={formData.shootTypeOther}
                          onChange={handleChange}
                          className="w-full border py-3.5 px-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                          onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: textSub }}>
                    Location <span style={{ color: goldBright }}>*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {locations.map((loc) => {
                      const active = formData.location === loc.id
                      return (
                        <label key={loc.id} className="flex items-center gap-3 p-3.5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50` }}>
                            {active && <div className="w-2 h-2 rounded-full" style={{ background: goldBright }} />}
                          </div>
                          <input type="radio" name="location" value={loc.id}
                            checked={active} onChange={() => handleLocationChange(loc.id)} className="hidden" required />
                          <span className="text-sm">{loc.label}</span>
                        </label>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {(formData.location === "outdoor" || formData.location === "clients-venue") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="mt-3.5 overflow-hidden">
                        <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                          {formData.location === "clients-venue" ? "Venue Address" : "Outdoor Location"}{" "}
                          <span style={{ color: goldBright }}>*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: goldDim }} />
                          <input type="text" name="locationAddress"
                            placeholder={formData.location === "clients-venue" ? "Enter full venue address" : "Enter outdoor location / area"}
                            required={formData.location === "outdoor" || formData.location === "clients-venue"}
                            value={formData.locationAddress} onChange={handleChange}
                            className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                            style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                            onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                            onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[
                    { name: "date", label: "Preferred Date", type: "date", Icon: Calendar },
                    { name: "time", label: "Preferred Time", type: "time", Icon: Clock },
                  ].map(({ name, label, type, Icon }) => (
                    <div key={name}>
                      <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                        {label} <span style={{ color: goldBright }}>*</span>
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: goldDim }} />
                        <input type={type} name={name} required
                          value={(formData as any)[name]} onChange={handleChange}
                          className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                          onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                    Additional Requests
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4 w-4 h-4" style={{ color: goldDim }} />
                    <textarea name="message" rows={4}
                      placeholder="Tell us about your special requirements, themes, or questions…"
                      value={formData.message} onChange={handleChange}
                      className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none resize-none"
                      style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                      onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                      onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${goldDim}/40, transparent)` }} />

            {/* ── C. Package & Add-ons ───────────────────────────────── */}
            <section>
              <SectionHeader letter="C" title="Package & Add-ons" />
              <div className="space-y-6">

                {/* Package select */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                    Chosen Package <span style={{ color: goldBright }}>*</span>
                  </label>
                  <select name="package" required value={formData.package} onChange={handleChange}
                    className="w-full border py-3.5 px-4 text-sm transition-all outline-none appearance-none cursor-pointer"
                    style={{
                      background: cardBgLt,
                      borderColor: `${goldDim}50`,
                      color: formData.package ? textPrimary : textMuted,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a6e30' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                    onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                    onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                  >
                    <option value="" disabled style={{ background: "#1c1812", color: textMuted }}>
                      Choose your package
                    </option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id} style={{ background: "#1c1812", color: textPrimary }}>
                        {p.name} — {p.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add-ons */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: textSub }}>
                    Add-ons{" "}
                    <span className="font-normal normal-case tracking-normal" style={{ color: textMuted }}>
                      (optional)
                    </span>
                  </label>
                  <div className="space-y-2.5">
                    {packageAddons.map((addon) => {
                      const active = formData.addons.includes(addon.id)
                      return (
                        <label key={addon.id} className="flex items-center gap-3 p-4 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                            style={{
                              border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50`,
                              background: active ? `${goldMid}25` : "transparent",
                            }}>
                            {active && <Check className="w-2.5 h-2.5" style={{ color: goldBright }} />}
                          </div>
                          <input type="checkbox" checked={active}
                            onChange={() => handleAddonChange(addon.id)} className="hidden" />
                          <span className="text-sm">{addon.label}</span>
                        </label>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {formData.addons.includes("other") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="mt-3.5 overflow-hidden">
                        <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                          Specify other add-ons <span style={{ color: goldBright }}>*</span>
                        </label>
                        <input type="text" name="addonsOther" placeholder="Describe add-ons"
                          required={formData.addons.includes("other")} value={formData.addonsOther}
                          onChange={handleChange}
                          className="w-full border py-3.5 px-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={e => { e.target.style.borderColor = goldMid; e.target.style.boxShadow = `0 0 0 2px ${goldMid}15` }}
                          onBlur={e => { e.target.style.borderColor = `${goldDim}50`; e.target.style.boxShadow = "none" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${goldDim}/40, transparent)` }} />

            {/* ── D. Payment Information ─────────────────────────────── */}
            <section>
              <SectionHeader letter="D" title="Payment Information" />
              <div className="space-y-6">

                {/* Price summary */}
                <div className="p-6 relative"
                  style={{
                    background: "linear-gradient(135deg, #201a0e 0%, #2a2010 100%)",
                    border: `1px solid ${goldDim}/50`,
                  }}
                >
                  {["tl","tr","bl","br"].map((pos) => (
                    <div key={pos} className="absolute w-5 h-5"
                      style={{
                        top: pos.startsWith("t") ? 0 : "auto", bottom: pos.startsWith("b") ? 0 : "auto",
                        left: pos.endsWith("l") ? 0 : "auto", right: pos.endsWith("r") ? 0 : "auto",
                        borderTop: pos.startsWith("t") ? `1.5px solid ${goldDim}` : undefined,
                        borderBottom: pos.startsWith("b") ? `1.5px solid ${goldDim}` : undefined,
                        borderLeft: pos.endsWith("l") ? `1.5px solid ${goldDim}` : undefined,
                        borderRight: pos.endsWith("r") ? `1.5px solid ${goldDim}` : undefined,
                      }}
                    />
                  ))}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm" style={{ color: textSub }}>Total Package Price</span>
                    <span className="font-semibold" style={{ color: textPrimary }}>
                      ₱{formData.package ? getPackagePrice().toLocaleString() : "0"}
                    </span>
                  </div>
                  <div className="h-px mb-3" style={{ background: `${goldDim}40` }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: textSub }}>Down Payment Required</span>
                    <span className="text-2xl font-serif font-light" style={{ color: goldBright }}>₱500</span>
                  </div>
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-4 p-5"
                  style={{ background: "rgba(200,160,60,0.06)", border: `1px solid ${goldDim}/50` }}>
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${goldBright}, ${goldMid})` }}>
                    <CreditCard className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: textPrimary }}>
                      Down Payment Required
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: textSub }}>
                      A{" "}
                      <span className="font-bold" style={{ color: goldBright }}>₱500 down payment</span>
                      {" "}is required to confirm your reservation and secure your time slot.
                      Transfer to one of the accounts below and upload your payment proof.
                    </p>
                  </div>
                </div>

                {/* Payment methods */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: textSub }}>
                    Select Payment Method <span style={{ color: goldBright }}>*</span>
                  </label>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const active = formData.paymentMethod === method.value
                      return (
                        <label key={method.id} className="flex items-start p-5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50` }}>
                            {active && <div className="w-2 h-2 rounded-full" style={{ background: goldBright }} />}
                          </div>
                          <input type="radio" name="paymentMethod" value={method.value}
                            checked={active} onChange={handleChange} className="hidden" required />
                          <div className="ml-4">
                            <div className="flex items-center gap-2 mb-1.5">
                              <CreditCard className="w-4 h-4" style={{ color: goldMid }} />
                              <span className="font-semibold text-sm" style={{ color: textPrimary }}>
                                {method.name}
                              </span>
                            </div>
                            <p className="text-xs font-mono font-semibold" style={{ color: goldBright }}>
                              {method.details}
                            </p>
                            {method.accountname && (
                              <p className="text-xs mt-0.5" style={{ color: textSub }}>{method.accountname}</p>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: textSub }}>
                    Upload Payment Proof <span style={{ color: goldBright }}>*</span>
                  </label>
                  {!previewUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed cursor-pointer transition-all group"
                      style={{
                        borderColor: `${goldDim}50`,
                        background: "rgba(200,160,60,0.02)",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = goldDim)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = `${goldDim}50`)}
                    >
                      <Upload className="w-9 h-9 mb-3 transition-colors" style={{ color: `${goldDim}` }} />
                      <p className="text-sm mb-1 font-medium" style={{ color: textSub }}>
                        Click to upload screenshot
                      </p>
                      <p className="text-xs" style={{ color: textMuted }}>PNG, JPG up to 2MB</p>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
                    </label>
                  ) : (
                    <div className="relative border overflow-hidden" style={{ borderColor: `${goldDim}50` }}>
                      <img src={previewUrl} alt="Payment proof" className="w-full h-64 object-cover" />
                      <button type="button" onClick={removeFile}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-colors"
                        style={{ background: "#ef4444" }}>
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ opacity: 0.15 }}>
                        <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: goldMid }} />
                        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: goldMid }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── Submit ────────────────────────────────────────────── */}
            <div className="pt-2">
              <motion.button
                type="submit" disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.005, y: isSubmitting ? 0 : -1 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.998 }}
                className="w-full font-black py-5 tracking-[0.2em] uppercase text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, ${goldBright}, ${goldMid}, ${goldBright})`,
                  backgroundSize: "200% auto",
                  color: "#0e0c08",
                  boxShadow: `0 8px 32px rgba(200,160,60,0.25), 0 2px 8px rgba(0,0,0,0.4)`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Submit Reservation Request
                  </>
                )}
              </motion.button>

              <div className="text-center mt-6 space-y-1.5">
                <p className="text-xs" style={{ color: textMuted }}>
                  By submitting, you agree to our reservation terms and conditions.
                </p>
                <p className="text-xs" style={{ color: textMuted }}>
                  We'll contact you within{" "}
                  <span className="font-semibold" style={{ color: goldMid }}>24 hours</span>
                  {" "}to confirm your reservation.
                </p>
              </div>
            </div>

          </form>
        </motion.div>
      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${goldBright}, transparent)` }} />
    </div>
  )
}
