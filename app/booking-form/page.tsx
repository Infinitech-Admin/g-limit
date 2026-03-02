"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CreditCard, Upload, X, Check, Camera, Loader2, Users, Sparkles, Star, Aperture } from "lucide-react"
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
    message: "",
    addons: [] as string[],
    addonsOther: "",
    paymentMethod: "",
    paymentProof: null as File | null,
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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
        "FREE use of costumes & accessories"
      ],
      addons: [
        "Extra edited photo - ₱100 every 5 photos",
        "Extended session - ₱1,000 per additional hour",
        "Hair & Make Up Services - ₱1,999 only"
      ]
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
        "FREE use of costumes & accessories"
      ],
      addons: [
        "Extra edited photo - ₱100 every 5 photos",
        "Extended session - ₱1,000 per additional hour",
        "Hair & Make Up Services - ₱1,999 only"
      ]
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
        "FREE Hair & Make Up Services for 1 additional person"
      ],
      addons: [
        "Extended session - ₱1,000 per additional hour"
      ]
    }
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
      accountname: "INFINITECH ADVERTISING CORPORATION"
    },
    {
      id: "gcash",
      name: "GCash",
      value: "gcash",
      details: "Number: 09455837887"
    },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleServiceTypeChange = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceType: prev.serviceType.includes(serviceId)
        ? prev.serviceType.filter(id => id !== serviceId)
        : [...prev.serviceType, serviceId]
    }))
  }

  const handleAddonChange = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(id => id !== addonId)
        : [...prev.addons, addonId]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, paymentProof: file }))
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, paymentProof: null }))
    setPreviewUrl(null)
  }

  const getPackagePrice = () => {
    const pkg = packages.find(p => p.id === formData.package)
    return pkg ? parseInt(pkg.price.replace(/[₱,]/g, '')) : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('facebook', formData.facebook)
      data.append('referred_by', formData.referredBy)
      data.append('date', formData.date)
      data.append('time', formData.time)
      data.append('package', formData.package)
      data.append('service_type', JSON.stringify(formData.serviceType))
      data.append('shoot_type', formData.shootType)
      data.append('shoot_type_other', formData.shootTypeOther)
      data.append('message', formData.message)
      data.append('addons', JSON.stringify(formData.addons))
      data.append('addons_other', formData.addonsOther)
      data.append('payment_method', formData.paymentMethod)
      if (formData.paymentProof) data.append('payment_proof', formData.paymentProof)

      const response = await fetch('/api/reservation-form', { method: 'POST', body: data })
      const result = await response.json()

      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message || "Reservation submitted! We'll contact you within 24 hours." })
        setFormData({
          name: "", email: "", phone: "", facebook: "", referredBy: "",
          date: "", time: "", package: "", serviceType: [], shootType: "",
          shootTypeOther: "", message: "", addons: [], addonsOther: "",
          paymentMethod: "", paymentProof: null,
        })
        setPreviewUrl(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSubmitMessage({ type: 'error', text: result.message || 'Failed to submit. Please try again.' })
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Shared input classes
  const inputBase = "w-full bg-black/60 border border-amber-200/20 py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-200/60 focus:bg-black/80 transition-all text-sm"
  const inputWithIcon = `${inputBase} pl-12`

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #000000 0%, #0d0a04 50%, #1a0f00 100%)" }}>

      {/* Ambient gold orbs — same as HeroSection */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-yellow-100/8 rounded-full blur-3xl opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-3xl opacity-10 pointer-events-none" />

     <FloatingParticles />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

      {/* Decorative aperture rings — top left */}
      <div className="absolute left-8 top-32 opacity-10 pointer-events-none hidden lg:block">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-amber-200 rounded-full"
            style={{
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
              top: `${-i * 15}px`,
              left: `${-i * 15}px`,
            }}
          />
        ))}
      </div>

      {/* Decorative aperture blades — bottom right */}
      <div className="absolute right-8 bottom-32 opacity-10 pointer-events-none hidden lg:block">
        <div className="relative w-48 h-48">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 flex justify-center"
              style={{ transform: `rotate(${(i * 360) / 8}deg)` }}
            >
              <div className="w-px h-full bg-gradient-to-b from-transparent via-amber-200 to-transparent" />
            </div>
          ))}
          <div className="absolute inset-0 border border-amber-200 rounded-full" style={{ margin: "30%" }} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24 max-w-6xl">

        {/* ── Hero Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20 relative"
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-amber-200 hidden sm:block">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-amber-200" />
          </div>
          <div className="absolute top-0 right-0 w-10 h-10 border-r-4 border-t-4 border-amber-200 hidden sm:block">
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-200" />
          </div>

          {/* Studio label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6 mt-4"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <p className="text-amber-200 font-black tracking-widest text-sm">G-LIMIT STUDIO</p>
            <span className="flex items-center gap-0.5 text-amber-200">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-200 text-amber-200" />)}
              <span className="ml-1 font-bold text-xs">5.0</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white leading-tight"
          >
            Book a session
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.55 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent leading-tight"
          >
            with us.
          </motion.h1>

          <div className="h-px w-24 bg-gradient-to-r from-amber-200 to-transparent mx-auto mt-5 mb-6" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed"
          >
            Let's capture your special moments together. Fill in the form below and we'll confirm within 24 hours.
          </motion.p>

          <div className="inline-flex items-center gap-2 mt-5 bg-amber-200/10 border border-amber-200/20 text-amber-200 text-xs font-bold px-4 py-2">
            <span className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
            f/1.4 · 1/200s · ISO 100
          </div>
        </motion.div>

        {/* ── Success / Error Message ──────────────────────────────────── */}
        <AnimatePresence>
          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`max-w-4xl mx-auto mb-10 p-5 border flex items-center gap-3 ${
                submitMessage.type === 'success'
                  ? 'bg-amber-200/10 border-amber-200/30 text-amber-200'
                  : 'bg-red-900/20 border-red-500/30 text-red-400'
              }`}
            >
              {submitMessage.type === 'success'
                ? <Check className="w-5 h-5 flex-shrink-0" />
                : <X className="w-5 h-5 flex-shrink-0" />}
              <p className="text-sm font-semibold">{submitMessage.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Packages ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-200/30" />
            <h2 className="text-amber-200 font-black tracking-widest text-sm uppercase">Our Packages</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-200/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative group"
                style={{
                  background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
                  border: pkg.id === "premium" ? "1px solid rgba(212,168,67,0.6)" : "1px solid rgba(212,168,67,0.15)",
                  boxShadow: pkg.id === "premium" ? "0 0 40px rgba(212,168,67,0.12), inset 0 0 40px rgba(212,168,67,0.03)" : "none",
                }}
              >
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-amber-200/30" />
                <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-amber-200/30" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-amber-200/30" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-amber-200/30" />

                <div className="p-7">
                  {pkg.id === "premium" && (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-200 to-yellow-100 text-black text-xs font-black px-3 py-1 mb-4 tracking-widest uppercase">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </div>
                  )}

                  <h3 className="text-white font-semibold text-base mb-3 leading-snug">{pkg.name}</h3>
                  <p className="text-3xl font-serif font-light bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent mb-1">{pkg.price}</p>
                  <p className="text-gray-500 text-xs mb-5">{pkg.duration} · {pkg.photos}</p>

                  <div className="h-px bg-gradient-to-r from-amber-200/20 to-transparent mb-4" />

                  <p className="text-amber-200/60 text-xs font-bold tracking-widest uppercase mb-3">Inclusions</p>
                  <div className="space-y-2 mb-5">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 border border-amber-200/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-amber-200" />
                        </div>
                        <span className="text-gray-300 text-xs leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-gradient-to-r from-amber-200/20 to-transparent mb-4" />
                  <p className="text-amber-200/60 text-xs font-bold tracking-widest uppercase mb-3">Add-Ons Available</p>
                  <div className="space-y-1.5">
                    {pkg.addons.map((a, i) => (
                      <p key={i} className="text-gray-500 text-xs">· {a}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Booking Form ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative"
          style={{
            background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
            border: "1px solid rgba(212,168,67,0.2)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Corner brackets — large */}
          <div className="absolute -top-1 -left-1 w-12 h-12 border-l-4 border-t-4 border-amber-200">
            <div className="absolute top-0 left-0 w-3 h-3 bg-amber-200" />
          </div>
          <div className="absolute -top-1 -right-1 w-12 h-12 border-r-4 border-t-4 border-amber-200">
            <div className="absolute top-0 right-0 w-3 h-3 bg-amber-200" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-12 h-12 border-l-4 border-b-4 border-amber-200">
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-amber-200" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-12 h-12 border-r-4 border-b-4 border-amber-200">
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-200" />
          </div>

          {/* Viewfinder grid — subtle */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <div className="absolute top-1/3 left-0 right-0 h-px bg-amber-200" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-amber-200" />
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-amber-200" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-amber-200" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-14 space-y-12">

            {/* Section header helper */}
            {[
              { letter: "A", title: "Client Information" },
              { letter: "B", title: "Service Details" },
              { letter: "C", title: "Package & Add-ons" },
              { letter: "D", title: "Payment Information" },
            ].map((_, i) => null)}

            {/* ── A. Client Information ─────────────────────────────── */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-200 text-xs font-black">A</span>
                </div>
                <h3 className="text-white font-serif text-xl font-light tracking-wide">Client Information</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-200/30 to-transparent" />
              </div>

              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                  Full Name <span className="text-amber-200">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/40" />
                  <input type="text" name="name" placeholder="Enter your full name" required
                    value={formData.name} onChange={handleChange} className={inputWithIcon} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                    Contact Number <span className="text-amber-200">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/40" />
                    <input type="tel" name="phone" placeholder="+63 XXX XXX XXXX" required
                      value={formData.phone} onChange={handleChange} className={inputWithIcon} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                    Email Address <span className="text-amber-200">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/40" />
                    <input type="email" name="email" placeholder="your.email@example.com" required
                      value={formData.email} onChange={handleChange} className={inputWithIcon} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                    Facebook / Instagram
                  </label>
                  <input type="text" name="facebook" placeholder="@yourusername"
                    value={formData.facebook} onChange={handleChange} className={inputBase} />
                </div>
                <div>
                  <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                    Referred By <span className="text-gray-600 font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/40" />
                    <input type="text" name="referredBy" placeholder="Name of referrer"
                      value={formData.referredBy} onChange={handleChange} className={inputWithIcon} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── B. Service Details ───────────────────────────────── */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-200 text-xs font-black">B</span>
                </div>
                <h3 className="text-white font-serif text-xl font-light tracking-wide">Service Details</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-200/30 to-transparent" />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-3">
                  Type of Service <span className="text-amber-200">*</span>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {serviceTypes.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${
                        formData.serviceType.includes(s.id)
                          ? "bg-amber-200/15 border-amber-200/60 text-amber-200"
                          : "bg-black/40 border-amber-200/10 text-gray-400 hover:border-amber-200/30"
                      }`}
                    >
                      <div className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 ${
                        formData.serviceType.includes(s.id) ? "border-amber-200 bg-amber-200/20" : "border-gray-600"
                      }`}>
                        {formData.serviceType.includes(s.id) && <Check className="w-2.5 h-2.5 text-amber-200" />}
                      </div>
                      <input type="checkbox" checked={formData.serviceType.includes(s.id)}
                        onChange={() => handleServiceTypeChange(s.id)} className="hidden" />
                      <span className="text-sm">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shoot Type */}
              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-3">
                  Shoot Type <span className="text-amber-200">*</span>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {shootTypes.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${
                        formData.shootType === s.id
                          ? "bg-amber-200/15 border-amber-200/60 text-amber-200"
                          : "bg-black/40 border-amber-200/10 text-gray-400 hover:border-amber-200/30"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        formData.shootType === s.id ? "border-amber-200" : "border-gray-600"
                      }`}>
                        {formData.shootType === s.id && <div className="w-2 h-2 rounded-full bg-amber-200" />}
                      </div>
                      <input type="radio" name="shootType" value={s.id}
                        checked={formData.shootType === s.id} onChange={handleChange}
                        className="hidden" required />
                      <span className="text-sm">{s.label}</span>
                    </label>
                  ))}
                </div>

                <AnimatePresence>
                  {formData.shootType === "other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                        Please specify <span className="text-amber-200">*</span>
                      </label>
                      <input type="text" name="shootTypeOther" placeholder="Enter shoot type"
                        required={formData.shootType === "other"} value={formData.shootTypeOther}
                        onChange={handleChange} className={inputBase} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                    Preferred Date <span className="text-amber-200">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/40" />
                    <input type="date" name="date" required value={formData.date}
                      onChange={handleChange} className={inputWithIcon} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                    Preferred Time <span className="text-amber-200">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/40" />
                    <input type="time" name="time" required value={formData.time}
                      onChange={handleChange} className={inputWithIcon} />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                  Additional Requests
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-amber-200/40" />
                  <textarea name="message" placeholder="Tell us about your special requirements, themes, or questions…"
                    value={formData.message} onChange={handleChange} rows={4}
                    className={`${inputWithIcon} resize-none`} />
                </div>
              </div>
            </section>

            {/* ── C. Package & Add-ons ─────────────────────────────── */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-200 text-xs font-black">C</span>
                </div>
                <h3 className="text-white font-serif text-xl font-light tracking-wide">Package & Add-ons</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-200/30 to-transparent" />
              </div>

              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                  Chosen Package <span className="text-amber-200">*</span>
                </label>
                <select name="package" required value={formData.package} onChange={handleChange}
                  className={`${inputBase} appearance-none cursor-pointer`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d4a843' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
                >
                  <option value="" disabled>Choose your package</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id} className="bg-black">{p.name} — {p.price}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-3">
                  Add-ons (optional)
                </label>
                <div className="space-y-2.5">
                  {packageAddons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                        formData.addons.includes(addon.id)
                          ? "bg-amber-200/15 border-amber-200/60 text-amber-200"
                          : "bg-black/40 border-amber-200/10 text-gray-400 hover:border-amber-200/30"
                      }`}
                    >
                      <div className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 ${
                        formData.addons.includes(addon.id) ? "border-amber-200 bg-amber-200/20" : "border-gray-600"
                      }`}>
                        {formData.addons.includes(addon.id) && <Check className="w-2.5 h-2.5 text-amber-200" />}
                      </div>
                      <input type="checkbox" checked={formData.addons.includes(addon.id)}
                        onChange={() => handleAddonChange(addon.id)} className="hidden" />
                      <span className="text-sm">{addon.label}</span>
                    </label>
                  ))}
                </div>

                <AnimatePresence>
                  {formData.addons.includes("other") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-2">
                        Specify other add-ons <span className="text-amber-200">*</span>
                      </label>
                      <input type="text" name="addonsOther" placeholder="Describe add-ons"
                        required={formData.addons.includes("other")} value={formData.addonsOther}
                        onChange={handleChange} className={inputBase} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ── D. Payment Information ───────────────────────────── */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-200 text-xs font-black">D</span>
                </div>
                <h3 className="text-white font-serif text-xl font-light tracking-wide">Payment Information</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-200/30 to-transparent" />
              </div>

              {/* Price summary */}
              <div className="border border-amber-200/20 bg-black/40 p-6 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-amber-200/40" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-amber-200/40" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-amber-200/40" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-amber-200/40" />
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-sm">Total Package Price</span>
                  <span className="text-white font-semibold">
                    ₱{formData.package ? getPackagePrice().toLocaleString() : "0"}
                  </span>
                </div>
                <div className="h-px bg-amber-200/15 mb-3" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Down Payment Required</span>
                  <span className="text-2xl font-serif font-light bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent">₱500</span>
                </div>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-4 p-5 border border-amber-200/20 bg-amber-200/5">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-200 to-yellow-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4.5 h-4.5 text-black" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Down Payment Required</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    A <span className="text-amber-200 font-bold">₱500 down payment</span> is required to confirm your reservation and secure your time slot.
                    Transfer to one of the accounts below and upload your payment proof.
                  </p>
                </div>
              </div>

              {/* Payment method selection */}
              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-3">
                  Select Payment Method <span className="text-amber-200">*</span>
                </label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start p-5 border cursor-pointer transition-all ${
                        formData.paymentMethod === method.value
                          ? "bg-amber-200/15 border-amber-200/60"
                          : "bg-black/40 border-amber-200/10 hover:border-amber-200/30"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 ${
                        formData.paymentMethod === method.value ? "border-amber-200" : "border-gray-600"
                      }`}>
                        {formData.paymentMethod === method.value && <div className="w-2 h-2 rounded-full bg-amber-200" />}
                      </div>
                      <input type="radio" name="paymentMethod" value={method.value}
                        checked={formData.paymentMethod === method.value} onChange={handleChange}
                        className="hidden" required />
                      <div className="ml-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CreditCard className="w-4 h-4 text-amber-200" />
                          <span className="text-white font-semibold text-sm">{method.name}</span>
                        </div>
                        <p className="text-amber-200/70 text-xs font-mono">{method.details}</p>
                        {method.accountname && <p className="text-amber-200/70 text-xs font-mono">{method.accountname}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Upload */}
              <div>
                <label className="block text-xs text-amber-200/60 font-bold tracking-widest uppercase mb-3">
                  Upload Payment Proof <span className="text-amber-200">*</span>
                </label>
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-44 border border-dashed border-amber-200/20 cursor-pointer hover:border-amber-200/40 bg-black/40 transition-all group">
                    <Upload className="w-10 h-10 text-amber-200/30 mb-3 group-hover:text-amber-200/60 transition-colors" />
                    <p className="text-gray-400 text-sm mb-1 group-hover:text-gray-300 transition-colors">Click to upload screenshot</p>
                    <p className="text-gray-600 text-xs">PNG, JPG up to 2MB</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
                  </label>
                ) : (
                  <div className="relative border border-amber-200/20 overflow-hidden">
                    <img src={previewUrl} alt="Payment proof" className="w-full h-64 object-cover" />
                    <button type="button" onClick={removeFile}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors">
                      <X className="w-4 h-4 text-white" />
                    </button>
                    {/* Viewfinder overlay on image */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-200" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-200" />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ── Submit ───────────────────────────────────────────── */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                className="w-full bg-gradient-to-r from-amber-200 to-yellow-100 text-black font-black py-5 tracking-widest uppercase text-sm hover:from-amber-100 hover:to-yellow-50 transition-all shadow-2xl shadow-amber-200/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-gray-600 text-xs">By submitting, you agree to our reservation terms and conditions.</p>
                <p className="text-gray-600 text-xs">
                  We'll contact you within <span className="text-amber-200 font-semibold">24 hours</span> to confirm your reservation.
                </p>
              </div>
            </div>

          </form>
        </motion.div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
    </div>
  )
}
