"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CreditCard, Upload, X, Check, Camera, Loader2, Users } from "lucide-react"

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
    setFormData(prev => {
      const isSelected = prev.serviceType.includes(serviceId)
      return {
        ...prev,
        serviceType: isSelected
          ? prev.serviceType.filter(id => id !== serviceId)
          : [...prev.serviceType, serviceId]
      }
    })
  }

  const handleAddonChange = (addonId: string) => {
    setFormData(prev => {
      const isSelected = prev.addons.includes(addonId)
      return {
        ...prev,
        addons: isSelected
          ? prev.addons.filter(id => id !== addonId)
          : [...prev.addons, addonId]
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, paymentProof: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, paymentProof: null }))
    setPreviewUrl(null)
  }

  const getPackagePrice = () => {
    const selectedPackage = packages.find(pkg => pkg.id === formData.package)
    if (!selectedPackage) return 0
    return parseInt(selectedPackage.price.replace(/[₱,]/g, ''))
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
      data.append('referred_by', formData.referredBy)   // ← new field (nullable)
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
      
      if (formData.paymentProof) {
        data.append('payment_proof', formData.paymentProof)
      }

      const response = await fetch('/api/reservation-form', {
        method: 'POST',
        body: data,
      })

      const result = await response.json()

      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message || 'Reservation submitted successfully! We\'ll contact you within 24 hours.' })
        
        setFormData({
          name: "",
          email: "",
          phone: "",
          facebook: "",
          referredBy: "",
          date: "",
          time: "",
          package: "",
          serviceType: [],
          shootType: "",
          shootTypeOther: "",
          message: "",
          addons: [],
          addonsOther: "",
          paymentMethod: "",
          paymentProof: null,
        })
        setPreviewUrl(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSubmitMessage({ type: 'error', text: result.message || 'Failed to submit reservation. Please try again.' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const apertureBlades = 8

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            animate={{
              x: [Math.random() * 1920, Math.random() * 1920],
              y: [Math.random() * 1080, Math.random() * 1080],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Aperture Design Elements */}
      <div className="absolute left-10 top-20 opacity-20 pointer-events-none hidden lg:block">
        <div className="relative w-64 h-64">
          {[...Array(apertureBlades)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{ transform: `rotate(${(i * 360) / apertureBlades}deg)` }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
            >
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute right-10 bottom-20 opacity-20 pointer-events-none hidden lg:block">
        <div className="relative w-48 h-48">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-amber-400 rounded-full"
              style={{ transform: `scale(${1 + i * 0.15})` }}
              animate={{ rotate: [0, 360], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <Camera className="w-16 h-16 mt-10 lg:w-20 lg:h-20 text-amber-400" />
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Studio Booking Form
          </h1>
          <p className="text-lg lg:text-xl text-gray-400">
            Let's capture your special moments together!
          </p>
        </motion.div>

        {/* Success/Error Message */}
        {submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-4xl mx-auto mb-8 p-4 rounded-xl border ${
              submitMessage.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <p className="text-center font-semibold">{submitMessage.text}</p>
          </motion.div>
        )}

        {/* Packages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 text-center mb-8">
            Our Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`bg-black/60 backdrop-blur-sm border rounded-xl p-6 lg:p-8 hover:border-amber-400 transition-all duration-300 ${
                  pkg.id === "premium" ? "border-amber-400" : "border-amber-400/30"
                }`}
              >
                {pkg.id === "premium" && (
                  <div className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-4">{pkg.price}</div>
                <div className="text-gray-400 mb-6">
                  <p className="mb-1">{pkg.duration} session</p>
                  <p>{pkg.photos}</p>
                </div>
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-amber-400">Inclusions:</p>
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-amber-400/20 pt-4">
                  <p className="text-sm font-semibold text-amber-400 mb-2">Optional Add-Ons:</p>
                  {pkg.addons.map((addon, i) => (
                    <p key={i} className="text-xs text-gray-400 mb-1">• {addon}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto bg-black/60 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 lg:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">

            {/* A. Client Information */}
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-bold text-amber-400">A. Client Information</h3>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Contact Number <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+63 XXX XXX XXXX"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Facebook / Instagram Name
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    placeholder="@yourusername"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* ── NEW: Referred By ── */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Referred By
                    <span className="ml-2 text-xs text-gray-500">(optional)</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                      type="text"
                      name="referredBy"
                      placeholder="Name of person who referred you"
                      value={formData.referredBy}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* B. Service Details */}
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-bold text-amber-400">B. Service Details</h3>

              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Type of Service <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {serviceTypes.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-center gap-3 p-3 lg:p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.serviceType.includes(service.id)
                          ? "bg-amber-400/20 border-amber-400"
                          : "bg-black/40 border-amber-400/30 hover:border-amber-400/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.serviceType.includes(service.id)}
                        onChange={() => handleServiceTypeChange(service.id)}
                        className="w-4 h-4 text-amber-400 rounded focus:ring-amber-400"
                      />
                      <span className="text-sm text-white">{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Shoot Type <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {shootTypes.map((shoot) => (
                    <label
                      key={shoot.id}
                      className={`flex items-center gap-3 p-3 lg:p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.shootType === shoot.id
                          ? "bg-amber-400/20 border-amber-400"
                          : "bg-black/40 border-amber-400/30 hover:border-amber-400/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shootType"
                        value={shoot.id}
                        checked={formData.shootType === shoot.id}
                        onChange={handleChange}
                        className="w-4 h-4 text-amber-400 focus:ring-amber-400"
                        required
                      />
                      <span className="text-sm text-white">{shoot.label}</span>
                    </label>
                  ))}
                </div>

                {formData.shootType === "other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <label className="block text-sm text-gray-300 mb-2">
                      Please specify <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="shootTypeOther"
                      placeholder="Enter shoot type"
                      required={formData.shootType === "other"}
                      value={formData.shootTypeOther}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Preferred Date <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Preferred Time <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Additional Requests
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-amber-400/60" />
                  <textarea
                    name="message"
                    placeholder="Tell us about your special requirements, themes, or any questions..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* C. Package & Add-ons */}
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-bold text-amber-400">C. Package & Add-ons</h3>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Chosen Package <span className="text-amber-400">*</span>
                </label>
                <select
                  name="package"
                  required
                  value={formData.package}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 px-4 text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Choose your package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id} className="bg-black">
                      {pkg.name} - {pkg.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Add-ons (if any)
                </label>
                <div className="space-y-3">
                  {packageAddons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.addons.includes(addon.id)
                          ? "bg-amber-400/20 border-amber-400"
                          : "bg-black/40 border-amber-400/30 hover:border-amber-400/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.addons.includes(addon.id)}
                        onChange={() => handleAddonChange(addon.id)}
                        className="w-4 h-4 text-amber-400 rounded focus:ring-amber-400"
                      />
                      <span className="text-sm text-white">{addon.label}</span>
                    </label>
                  ))}
                </div>

                {formData.addons.includes("other") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <label className="block text-sm text-gray-300 mb-2">
                      Please specify other add-ons <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="addonsOther"
                      placeholder="Specify other add-ons"
                      required={formData.addons.includes("other")}
                      value={formData.addonsOther}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-amber-400/30 rounded-lg py-3 lg:py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* D. Payment Information */}
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-bold text-amber-400">D. Payment Information</h3>

              <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 lg:p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Package Price:</span>
                    <span className="text-xl font-bold text-white">
                      ₱ {formData.package ? getPackagePrice().toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-amber-400/20">
                    <span className="text-gray-300">Down Payment Amount:</span>
                    <span className="text-2xl font-bold text-amber-400">₱ 500</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 lg:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Down Payment Required</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      A <span className="text-amber-400 font-bold">₱500 down payment</span> is required to confirm your reservation.
                      This secures your time slot and allows us to deliver a smooth scheduling experience.
                    </p>
                    <p className="text-xs text-gray-400">
                      Please transfer to one of the accounts below and upload your payment proof.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Select Payment Method <span className="text-amber-400">*</span>
                </label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start p-4 lg:p-5 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === method.value
                          ? "bg-amber-400/20 border-amber-400"
                          : "bg-black/40 border-amber-400/30 hover:border-amber-400/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-amber-400 focus:ring-amber-400"
                        required
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="w-5 h-5 text-amber-400" />
                          <span className="font-semibold text-white text-base lg:text-lg">{method.name}</span>
                        </div>
                        <p className="text-sm text-amber-400 font-mono">{method.details}</p>
                        {method.accountname && (
                          <p className="text-sm text-amber-400 font-mono">{method.accountname}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Upload Payment Proof <span className="text-amber-400">*</span>
                </label>

                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 lg:h-48 border-2 border-dashed border-amber-400/30 rounded-xl cursor-pointer hover:border-amber-400/50 transition-colors bg-black/40 group">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="w-10 h-10 lg:w-12 lg:h-12 text-amber-400/60 mb-3 group-hover:text-amber-400 transition-colors" />
                      <p className="text-sm lg:text-base text-gray-300 mb-1">Click to upload screenshot</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-amber-400/30">
                    <img
                      src={previewUrl}
                      alt="Payment proof"
                      className="w-full h-64 lg:h-80 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 lg:py-5 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Reservation Request'
              )}
            </motion.button>

            <div className="text-center space-y-2">
              <p className="text-xs lg:text-sm text-gray-400">
                By submitting this form, you agree to our reservation terms and conditions.
              </p>
              <p className="text-xs lg:text-sm text-gray-400">
                We'll contact you within <span className="text-amber-400 font-semibold">24 hours</span> to confirm your reservation.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
