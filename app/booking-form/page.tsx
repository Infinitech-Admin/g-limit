"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  Upload,
  X,
  Check,
  Camera,
  Loader2,
  Users,
  Sparkles,
  Star,
  MapPin,
  Crown,
} from "lucide-react"
import dynamic from "next/dynamic"
import { useBookingStore } from "@/store/useBookingStore"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const FloatingParticles = dynamic(() => import("@/components/animated-golden-particles"), { ssr: false })

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
  const [showPackages, setShowPackages] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null)
  const packagesRef = useRef<HTMLDivElement>(null)
  const selectedService = useBookingStore((state) => state.selectedService)

  useEffect(() => {
    if (!selectedService) return

    setFormData((prev) => ({
      ...prev,
      shootType: selectedService,
    }))
  }, [selectedService])

  const studio_weekdays = [
    {
      id: "starter_weekday",
      title: "Starter Package",
      duration: "1 hour",
      price: "1,388.00",
      promo: "weekday",
      features: [
        "FREE One (1) VOUCHER - 30mins Self-Portrait - 11 Concepts",
        "Two (2) pcs SOLO printed edited photos",
        "One (1) pc COLLAGE printed photo",
        "1 Hour professional-grade Photoshoot",
        "FREE Fifteen (15) pcs edited professional-grade photos",
        "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE One (1) Makeup service (Light Makeup)",
      ],
    },
    {
      id: "premium_weekday",
      title: "Premium Package",
      duration: "1 Hour and 30 Minutes",
      price: "1,588.00",
      promo: "weekday",
      popular: true,
      features: [
        "FREE One (1) pc VOUCHER - 30mins Self-portrait - 11 Concepts",
        "FOUR (4) pcs SOLO printed edited photos",
        "Two (2) pcs COLLAGE printed photo",
        "FREE 1h & 30mins professional-grade photoshoot",
        "FREE Twenty (20) pcs edited professional-grade photos",
        "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
        "One (1) Spin the wheel game",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE One (1) Hair & Makeup service (Light Makeup)",
      ],
    },
    {
      id: "vip_weekday",
      title: "VIP Package",
      duration: "1 Hour and 30 Minutes",
      price: "1,888.00",
      promo: "weekday",
      features: [
        "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
        "FREE SIX (6) pcs SOLO printed edited photos",
        "FREE Four (4) pcs COLLAGE printed photo",
        "FREE Unlimited professional-grade photoshoot",
        "FREE 1h & 30mins - 11 Concepts with low light setup & Photographer",
        "FREE Thirty (30) pcs edited professional-grade photos",
        "One (1) Spin the wheel game",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE One (1) pc Contact Lens",
        "FREE One (1) Hair & Makeup service (LUXURY GLAM)",
        "FREE Unlimited makeup retouch",
        "FREE Unlimited use of Attire/Costumes",
      ],
    },
    {
      id: "vvip_weekday",
      title: "VVIP Package",
      duration: "Unlimited",
      price: "2,488.00",
      promo: "weekday",
      features: [
        "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
        "TEN (10) pcs SOLO printed edited photos",
        "Four (4) pcs COLLAGE printed photo",
        "FREE Unlimited professional-grade photoshoot (with concept setup)",
        "FREE Unlimited - 11 Concepts with low light setup & Photographer",
        "FREE Unlimited edited professional-grade photos",
        "FREE BTR & Set Card photoshoot",
        "Two (2) Spin the wheel game",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE Two (2) pcs Contact Lens",
        "FREE Personal Assistant (PA) - One (1) person",
        "One (1) pc FREE VOUCHER - EMSCULPT - Tummy",
        'FREE Edited "Behind the Scene" BTS Video (Makeup to Photoshoot)',
        "FREE Unlimited Makeup retouch",
        "FREE Unlimited use of Attire/Costumes",
      ],
    },
  ]

  const studio_weekends = [
    {
      id: "starter_weekend",
      title: "Starter Package",
      duration: "1 hour",
      price: "1,588.00",
      promo: "weekend",
      features: [
        "FREE One (1) pc VOUCHER - 30mins Self-portrait - 11 Concepts",
        "Two (2) pcs SOLO printed edited photos",
        "One (1) pc COLLAGE printed photo",
        "1 Hour professional-grade photoshoot by G-limit Photographer",
        "FREE Fifteen (15) pcs edited professional-grade photos",
        "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE One (1) Makeup service (Light Makeup)",
      ],
    },
    {
      id: "premium_weekend",
      title: "Premium Package",
      duration: "1 Hour and 30 Minutes",
      price: "1,788.00",
      promo: "weekend",
      popular: true,
      features: [
        "FREE One (1) pc VOUCHER - 30mins Self-portrait - 11 Concepts",
        "FOUR (4) pcs SOLO printed edited photos",
        "Two (2) pcs COLLAGE printed photo",
        "FREE 1h & 30mins professional-grade photoshoot",
        "FREE Twenty (20) pcs edited professional-grade photos",
        "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
        "One (1) Spin the wheel game",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE One (1) Hair & Makeup service (Light Makeup)",
      ],
    },
    {
      id: "vip_weekend",
      title: "VIP Package",
      duration: "1 Hour and 30 Minutes",
      price: "2,088.00",
      promo: "weekend",
      features: [
        "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
        "FREE SIX (6) pcs SOLO printed edited photos",
        "FREE Four (4) pcs COLLAGE printed photo",
        "FREE Unlimited professional-grade photoshoot",
        "FREE 1h & 30mins - 11 Concepts with low light setup & Photographer",
        "FREE Thirty (30) pcs edited professional-grade photos",
        "One (1) Spin the wheel game",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE One (1) pc Contact Lens",
        "FREE One (1) Hair & Makeup service (LUXURY GLAM)",
        "FREE Unlimited Makeup retouch",
        "FREE Unlimited use of Attire/Costumes",
      ],
    },
    {
      id: "vvip_weekend",
      title: "VVIP Package",
      duration: "Unlimited",
      price: "2,688.00",
      promo: "weekend",
      features: [
        "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
        "TEN (10) pcs SOLO printed edited photos",
        "Four (4) pcs COLLAGE printed photo",
        "FREE Unlimited professional-grade photoshoot (with concept setup)",
        "FREE Unlimited - 11 Concepts with low light setup & Photographer",
        "FREE Unlimited edited professional-grade photos",
        "FREE BTR & Set Card photoshoot",
        "Two (2) Spin the wheel game",
        "Within 24 hours output (edited photos) release",
      ],
      addons: [
        "FREE Two (2) pcs Contact Lens",
        "FREE Personal Assistant (PA) - One (1) person",
        "One (1) pc FREE VOUCHER - EMSCULPT (Tummy)",
        "FREE One (1) Hair & Makeup service (LUXURY GLAM)",
        'FREE Edited "Behind the Scene" BTS Video (Makeup to Photoshoot)',
        "FREE Unlimited Makeup retouch",
        "FREE Unlimited use of Attire/Costumes",
      ],
    },
  ]

  const outdoor_packages = [
    {
      id: "outdoor_basic",
      title: "Basic Outdoor Session",
      price: "2,500",
      duration: "Minimum 2 hours",
      photos: "20 professionally edited photos",
      features: ["Basic studio setup", "Choose additional 2 backdrop shoot", "FREE use of costumes & accessories"],
      addons: [
        "Extra edited photo — ₱100 every 5 photos",
        "Extended session — ₱1,500 per additional hour",
        "Hair & Make Up Services — ₱1,999+ only",
        "Transportation — depends on the location",
      ],
    },
    {
      id: "outdoor_standard",
      title: "Standard Outdoor Session",
      price: "5,500",
      duration: "Minimum 4-5 hours",
      photos: "30 professionally edited photos",
      features: ["Basic studio setup", "Choose additional 5 backdrop shoot", "FREE use of costumes & accessories"],
      addons: [
        "Extra edited photo — ₱100 every 5 photos",
        "Extended session — ₱1,500 per additional hour",
        "Hair & Make Up Services — ₱1,999+ only",
        "Transportation — depends on the location",
      ],
    },
    {
      id: "outdoor_premium",
      title: "G-Limitless Premium Outdoor Session",
      price: "8,000",
      duration: "Up to 8 Hours",
      photos: "Professionally edited digital photos with hair and make up services",
      features: [
        "Basic studio setup",
        "FREE use of 12 backdrop shoot",
        "FREE use of costumes & accessories",
        "FREE Hair & Make Up Services for 1 additional person",
      ],
      addons: ["Extended session — ₱1,000 per additional hour", "Transportation — depends on the location"],
    },
  ]

  const studio_rental_weekdays = [
    {
      id: "rental_gold_weekdays",
      title: "Gold Package",
      duration: "1 hour",
      description: "",
      price: "1,488.00",
      promo: "weekdays",
      features: [
        "Two (2) pcs printed photos per model",
        "One (1) pc group photo with photographer",
        "One (1) pc VOUCHER - 30mins Free Studio Use",
        "One (1) spin the Wheel Game - Photographer",
        "FREE Unlimited use of attire/costumes/wardrobe",
      ],
    },
    {
      id: "rental_platinum_weekdays",
      title: "Platinum Package",
      duration: "3 hours",
      description: "",
      price: "3,988.00",
      promo: "weekdays",
      popular: true,
      features: [
        "Three (3) pcs printed photos per model (1 to 3) - Total: 9 pcs",
        "Three (3) pcs group photo with photographer",
        "One (1) pc VOUCHER - 45mins Free Studio Use",
        "FREE Two (2) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "One (1) spin the Wheel Game - Model",
        "One (1) spin the Wheel Game - Photographer",
      ],
    },
    {
      id: "rental_diamond_weekdays",
      title: "Diamond Package",
      duration: "4 hours",
      description: "",
      price: "5,488.00",
      promo: "weekdays",
      features: [
        "Four (4) pcs printed photos per model (1 to 4) - Total: 16 pcs",
        "Four (4) pcs group photo with photographer",
        "One (1) pc VOUCHER - 45mins Free Studio Use",
        "One (1) pc DISCOUNT VOUCHERS - 30% off",
        "FREE Four (4) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "Four (4) spin the Wheel Game - Model",
        "One (1) spin the Wheel Game - Photographer",
      ],
    },
    {
      id: "rental_onyx_weekdays",
      title: "Onyx Package",
      duration: "5 hours",
      description: "Studio / Party Shoot (Exclusive)",
      price: "7,488.00",
      promo: "weekdays",
      features: [
        "Five (5) pcs printed photos per model (1 to 5) - Total: 25 pcs",
        "Five (5) pcs group photo with photographer",
        "Three (3) pcs Collage Photos (Model/Photographer)",
        "FREE 30mins studio party shoot extension",
        "FREE One (1) H&MU - One (1) Model",
        "FREE Four (4) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "Four (4) spin the Wheel Game - Model",
        "One (1) spin the Wheel Game - Photographer",
        "FREE Complimentary Red Wine - One (1) pc Bottle",
        "FREE Complimentary Snack - One (1) pc Platter",
        "One (1) pc FREE VOUCHER - One (1) hour Studio Use",
        "Two (2) pcs DISCOUNT VOUCHERS - 30% off",
        "One (1) pc FREE VOUCHER - Whitening Facial",
        "One (1) pc FREE VOUCHER - UA Carbon Laser",
        "One (1) pc FREE VOUCHER - EMSCULPT - Tummy",
        "One (1) pc FREE VOUCHER - EMSCULPT - Butt",
        "One (1) pc Photographer VIC Card - 10% Discount (1 year)",
      ],
    },
    {
      id: "rental_luxury_weekdays",
      title: "Luxury Package",
      duration: "12 hours",
      description: "Party / Competition / Event Shoot (Exclusive)",
      price: "16,888.00",
      promo: "weekdays",
      features: [
        "Eighty (80) pcs printed photos per model (1 to 5) - Total: 25 pcs",
        "Twenty (20) pcs group photo with photographer",
        "Ten (10) pcs Collage Photos (Model/Photographer)",
        "FREE 30mins studio party shoot extension",
        "FREE Three (3) H&MU Service",
        "FREE Ten (10) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "Ten (10) spin the Wheel Game - Model",
        "Five (5) spin the Wheel Game - Photographer",
        "FREE Complimentary Red Wine - Three (3) pcs Bottle",
        "FREE Complimentary Snack - Three (3) pcs Platter",
        "Five (5) pcs FREE VOUCHER - One (1) hour Studio Use",
        "Five (5) pcs FREE VOUCHER - Three (3) hour Studio Use",
        "Four (4) pcs DISCOUNT VOUCHERS - 30% off",
        "Two (2) pcs FREE VOUCHER - Whitening Facial",
        "Two (2) pcs FREE VOUCHER - UA Carbon Laser",
        "Two (2) pcs FREE VOUCHER - EMSCULPT - Tummy",
        "Two (2) pcs FREE VOUCHER - EMSCULPT - Butt",
        "Two (2) pcs Photographer VIC Card - 10% Discount (1 year)",
        "Four (4) G-Limit Employees (for assistance)",
        "FREE 11 Concepts with light setup",
      ],
    },
  ]

  const studio_rental_weekends = [
    {
      id: "rental_gold_weekends",
      title: "Gold Package",
      duration: "1 hour",
      description: "",
      price: "1,988.00",
      promo: "weekends",
      features: [
        "Two (2) pcs printed photos per model",
        "One (1) pc group photo with photographer",
        "One (1) pc VOUCHER - 30mins Free Studio Use",
        "One (1) spin the Wheel Game - Photographer",
        "FREE Unlimited use of attire/costumes/wardrobe",
      ],
    },
    {
      id: "rental_platinum_weekends",
      title: "Platinum Package",
      duration: "3 hours",
      description: "",
      price: "5,488.00",
      promo: "weekends",
      popular: true,
      features: [
        "Three (3) pcs printed photos per model (1 to 3) - Total: 9 pcs",
        "Three (3) pcs group photo with photographer",
        "One (1) pc VOUCHER - 45mins Free Studio Use",
        "FREE Two (2) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "One (1) spin the Wheel Game - Model",
        "One (1) spin the Wheel Game - Photographer",
      ],
    },
    {
      id: "rental_diamond_weekends",
      title: "Diamond Package",
      duration: "4 hours",
      description: "",
      price: "7,488.00",
      promo: "weekends",
      features: [
        "Four (4) pcs printed photos per model (1 to 4) - Total: 16 pcs",
        "Four (4) pcs group photo with photographer",
        "One (1) pc VOUCHER - 45mins Free Studio Use",
        "One (1) pc DISCOUNT VOUCHERS - 30% off",
        "FREE Four (4) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "Four (4) spin the Wheel Game - Model",
        "One (1) spin the Wheel Game - Photographer",
      ],
    },
    {
      id: "rental_onyx_weekends",
      title: "Onyx Package",
      duration: "5 hours",
      description: "Studio / Party Shoot (Exclusive)",
      price: "9,988.00",
      promo: "weekends",
      features: [
        "Five (5) pcs printed photos per model (1 to 5) - Total: 25 pcs",
        "Five (5) pcs group photo with photographer",
        "Three (3) pcs Collage Photos (Model/Photographer)",
        "FREE 30mins studio party shoot extension",
        "FREE One (1) H&MU - One (1) Model",
        "FREE Four (4) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "Four (4) spin the Wheel Game - Model",
        "One (1) spin the Wheel Game - Photographer",
        "FREE Complimentary Red Wine - One (1) pc Bottle",
        "FREE Complimentary Snack - One (1) pc Platter",
        "One (1) pc FREE VOUCHER - One (1) hour Studio Use",
        "Two (2) pcs DISCOUNT VOUCHERS - 30% off",
        "One (1) pc FREE VOUCHER - Whitening Facial",
        "One (1) pc FREE VOUCHER - UA Carbon Laser",
        "One (1) pc FREE VOUCHER - EMSCULPT - Tummy",
        "One (1) pc FREE VOUCHER - EMSCULPT - Butt",
        "One (1) pc Photographer VIC Card - 10% Discount (1 year)",
      ],
    },
    {
      id: "rental_luxury_weekends",
      title: "Luxury Package",
      duration: "12 hours",
      description: "Party / Competition / Event Shoot (Exclusive)",
      price: "18,888.00",
      promo: "weekends",
      features: [
        "Eighty (80) pcs printed photos per model (1 to 5) - Total: 25 pcs",
        "Twenty (20) pcs group photo with photographer",
        "Ten (10) pcs Collage Photos (Model/Photographer)",
        "FREE 30mins studio party shoot extension",
        "FREE Three (3) H&MU Service",
        "FREE Ten (10) pcs Contact Lens",
        "FREE Unlimited use of attire/costumes/wardrobe",
        "Ten (10) spin the Wheel Game - Model",
        "Five (5) spin the Wheel Game - Photographer",
        "FREE Complimentary Red Wine - Three (3) pcs Bottle",
        "FREE Complimentary Snack - Three (3) pcs Platter",
        "Five (5) pcs FREE VOUCHER - One (1) hour Studio Use",
        "Five (5) pcs FREE VOUCHER - Three (3) hour Studio Use",
        "Four (4) pcs DISCOUNT VOUCHERS - 30% off",
        "Two (2) pcs FREE VOUCHER - Whitening Facial",
        "Two (2) pcs FREE VOUCHER - UA Carbon Laser",
        "Two (2) pcs FREE VOUCHER - EMSCULPT - Tummy",
        "Two (2) pcs FREE VOUCHER - EMSCULPT - Butt",
        "Two (2) pcs Photographer VIC Card - 10% Discount (1 year)",
        "Four (4) G-Limit Employees (for assistance)",
        "FREE 11 Concepts with light setup",
      ],
    },
  ]

  // Helper function to check if selected date is a weekend
  const isWeekend = (dateString: string): boolean => {
    if (!dateString) return false
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday = 0, Saturday = 6
  }

  // Get appropriate studio packages based on selected date
  const studioPackages = formData.date && isWeekend(formData.date) ? studio_weekends : studio_weekdays

  // All packages combined for price lookup
  const allPackages = [...studio_weekdays, ...studio_weekends, ...outdoor_packages, ...studio_rental_weekdays, ...studio_rental_weekends]

  const getStudioRentalPackages = () => {
    if (!formData.date) return studio_rental_weekdays
    return isWeekend(formData.date) ? studio_rental_weekends : studio_rental_weekdays
  }

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
    { id: "studio-rental", label: "Studio Rental" },
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
    setFormData((prev) => {
      // Reset package when date changes (as studio packages differ for weekdays/weekends)
      if (name === "date" && prev.location !== "outdoor" && prev.location !== "clients-venue") {
        const wasWeekend = isWeekend(prev.date)
        const isNowWeekend = isWeekend(value)
        if (wasWeekend !== isNowWeekend) {
          return { ...prev, [name]: value, package: "" }
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleServiceTypeChange = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(serviceId) ? prev.serviceType.filter((id) => id !== serviceId) : [...prev.serviceType, serviceId],
    }))
  }

  const handleAddonChange = (addonId: string) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addonId) ? prev.addons.filter((id) => id !== addonId) : [...prev.addons, addonId],
    }))
  }

  const handleLocationChange = (locationId: string) => {
    setFormData((prev) => ({
      ...prev,
      location: locationId,
      locationAddress: locationId === "studio" || locationId === "studio-rental" ? "" : prev.locationAddress,
      // Reset package if switching between different location types (studio, studio-rental, outdoor)
      package: locationId !== prev.location ? "" : prev.package,
    }))
    setShowPackages(Boolean(locationId))

    if (locationId) {
      setTimeout(() => {
        packagesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 500)
    }
  }

  // Filter packages based on selected location and date
  const getFilteredPackages = () => {
    if (formData.location === "studio" || formData.location === "clients-venue") {
      return studioPackages
    } else if (formData.location === "studio-rental") {
      return getStudioRentalPackages()
    } else if (formData.location === "outdoor") {
      return outdoor_packages
    }
    return []
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

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPackageId = e.target.value

    setFormData((prev) => ({
      ...prev,
      package: selectedPackageId,
    }))
  }

  const getPackagePrice = () => {
    const pkg = allPackages.find((p) => p.id === formData.package)
    return pkg ? Number(pkg.price.replace(/[₱,]/g, "")) : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // VALIDATION FIRST
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return
    }

    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required")
      return
    }

    if (!formData.date || !formData.time) {
      toast.error("Please select a schedule (date and time)")
      return
    }

    if (!formData.package) {
      toast.error("Please select a package")
      return
    }

    if (!formData.paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    if (formData.paymentMethod !== "cash" && !formData.paymentProof) {
      toast.error("Please upload payment proof")
      return
    }

    setIsSubmitting(true)

    try {
      const data = new FormData()

      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("phone", formData.phone)
      data.append("facebook", formData.facebook)
      data.append("referred_by", formData.referredBy)
      data.append("preferred_date", formData.date)
      data.append("preferred_time", formData.time)
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

      if (formData.paymentProof) {
        data.append("payment_proof", formData.paymentProof)
      }

      const response = await fetch("/api/reservation-form", {
        method: "POST",
        body: data,
      })

      const result = await response.json()

      if (result.success) {
        setSubmittedData({ ...formData })
        setShowConfirmation(true)

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
          location: "",
          locationAddress: "",
          message: "",
          addons: [],
          addonsOther: "",
          paymentMethod: "",
          paymentProof: null,
        })

        setPreviewUrl(null)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        toast.error(result.message || "Failed to submit. Please try again.")
      }
    } catch {
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ─── design tokens ────────────────────────────────────────────────── */
  // Raised card surface: rich dark charcoal, lighter than pure black
  const cardBg = "#1c1812"
  const cardBgLt = "#231f18" // slightly lighter for inner elements
  const cardBgLLt = "#2a2520" // hover / selected states
  const goldBright = "#e8c96a" // headline gold — very legible
  const goldMid = "#c9a84c" // accent gold
  const goldDim = "#8a6e30" // muted gold for borders
  const textPrimary = "#f0e8d5" // warm off-white — easy to read
  const textSub = "#a89878" // secondary text
  const textMuted = "#6b5c44" // muted/placeholder

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
    `flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${active
      ? `bg-[${cardBgLLt}] border-[${goldMid}] text-[${goldBright}] shadow-[0_0_12px_rgba(200,160,60,0.15)]`
      : `bg-[${cardBgLt}] border-[${goldDim}]/30 text-[${textSub}] hover:border-[${goldDim}]/70 hover:text-[${textPrimary}]`
    }`

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(160deg, #12100c 0%, #1a1610 50%, #0e0c08 100%)" }}>
      {/* ── Ambient glow ─────────────────────────────────────────────── */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,160,60,0.09) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,140,40,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(180,130,30,0.04) 0%, transparent 70%)" }}
      />

      {/* ── Subtle gold noise overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' fill='%23c8a040'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Top gold rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${goldBright}, transparent)` }}
      />

      <FloatingParticles />

      {/* ── Decorative aperture rings ─────────────────────────────────── */}
      <div className="absolute left-8 top-32 pointer-events-none hidden lg:block" style={{ opacity: 0.07 }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
              top: `${-i * 15}px`,
              left: `${-i * 15}px`,
              border: `1px solid ${goldMid}`,
            }}
          />
        ))}
      </div>
      <div className="absolute right-8 bottom-32 pointer-events-none hidden lg:block" style={{ opacity: 0.07 }}>
        <div className="relative w-48 h-48">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${(i * 360) / 8}deg)` }}>
              <div className="w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${goldMid}, transparent)` }} />
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
          <div
            className="absolute top-0 left-0 w-10 h-10 hidden sm:block"
            style={{ borderLeft: `3px solid ${goldMid}`, borderTop: `3px solid ${goldMid}` }}
          />
          <div
            className="absolute top-0 right-0 w-10 h-10 hidden sm:block"
            style={{ borderRight: `3px solid ${goldMid}`, borderTop: `3px solid ${goldMid}` }}
          />

          {/* Brand pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
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
            <span className="text-xs font-bold ml-0.5" style={{ color: goldMid }}>
              5.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight"
            style={{ color: textPrimary }}
          >
            Book a session
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight"
            style={{ color: goldBright }}
          >
            with us.
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-px w-24 mx-auto mt-5 mb-6 origin-left"
            style={{ background: `linear-gradient(to right, ${goldMid}, transparent)` }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-base md:text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: textSub }}
          >
            Let&apos;s capture your special moments together. Fill in the form below and we&apos;ll confirm within 24 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
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
              {submitMessage.type === "success" ? <Check className="w-5 h-5 flex-shrink-0" /> : <X className="w-5 h-5 flex-shrink-0" />}
              <p className="text-sm font-semibold">{submitMessage.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ Booking Form ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative"
          style={{
            background: `linear-gradient(160deg, ${cardBg} 0%, #181410 100%)`,
            border: `1px solid ${goldDim}/40`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,160,60,0.04)",
          }}
        >
          {/* Corner brackets */}
          {["tl", "tr", "bl", "br"].map((pos) => (
            <div
              key={pos}
              className="absolute w-12 h-12 z-10"
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
              <div
                className="absolute w-2 h-2"
                style={{
                  top: pos.startsWith("t") ? 0 : "auto",
                  bottom: pos.startsWith("b") ? 0 : "auto",
                  left: pos.endsWith("l") ? 0 : "auto",
                  right: pos.endsWith("r") ? 0 : "auto",
                  background: goldBright,
                }}
              />
            </div>
          ))}

          {/* Top accent stripe */}
          <div
            className="h-0.5 w-full"
            style={{ background: `linear-gradient(to right, transparent, ${goldMid}, ${goldBright}, ${goldMid}, transparent)` }}
          />

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
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                    Full Name <span style={{ color: goldBright }}>*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: goldDim }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                      style={{
                        background: cardBgLt,
                        borderColor: `${goldDim}50`,
                        color: textPrimary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = goldMid
                        e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${goldDim}50`
                        e.target.style.boxShadow = "none"
                      }}
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
                        <input
                          type={type}
                          name={name}
                          placeholder={placeholder}
                          required
                          value={(formData as any)[name]}
                          onChange={handleChange}
                          className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={(e) => {
                            e.target.style.borderColor = goldMid
                            e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${goldDim}50`
                            e.target.style.boxShadow = "none"
                          }}
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
                    <input
                      type="text"
                      name="facebook"
                      placeholder="@yourusername"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full border py-3.5 px-4 text-sm transition-all outline-none"
                      style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                      onFocus={(e) => {
                        e.target.style.borderColor = goldMid
                        e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${goldDim}50`
                        e.target.style.boxShadow = "none"
                      }}
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
                      <input
                        type="text"
                        name="referredBy"
                        placeholder="Name of referrer"
                        value={formData.referredBy}
                        onChange={handleChange}
                        className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                        style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                        onFocus={(e) => {
                          e.target.style.borderColor = goldMid
                          e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = `${goldDim}50`
                          e.target.style.boxShadow = "none"
                        }}
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
                        <label
                          key={s.id}
                          className="flex items-center gap-3 p-3.5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div
                            className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-all"
                            style={{
                              border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50`,
                              background: active ? `${goldMid}25` : "transparent",
                            }}
                          >
                            {active && <Check className="w-2.5 h-2.5" style={{ color: goldBright }} />}
                          </div>
                          <input type="checkbox" checked={active} onChange={() => handleServiceTypeChange(s.id)} className="hidden" />
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
                        <label
                          key={s.id}
                          className="flex items-center gap-3 p-3.5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50` }}
                          >
                            {active && <div className="w-2 h-2 rounded-full" style={{ background: goldBright }} />}
                          </div>
                          <input type="radio" name="shootType" value={s.id} checked={active} onChange={handleChange} className="hidden" required />
                          <span className="text-sm">{s.label}</span>
                        </label>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {formData.shootType === "other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3.5 overflow-hidden"
                      >
                        <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                          Please specify <span style={{ color: goldBright }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="shootTypeOther"
                          placeholder="Enter shoot type"
                          required={formData.shootType === "other"}
                          value={formData.shootTypeOther}
                          onChange={handleChange}
                          className="w-full border py-3.5 px-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={(e) => {
                            e.target.style.borderColor = goldMid
                            e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${goldDim}50`
                            e.target.style.boxShadow = "none"
                          }}
                        />
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
                        <input
                          type={type}
                          name={name}
                          required
                          value={(formData as any)[name]}
                          onChange={handleChange}
                          className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={(e) => {
                            e.target.style.borderColor = goldMid
                            e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${goldDim}50`
                            e.target.style.boxShadow = "none"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: textSub }}>
                    Location <span style={{ color: goldBright }}>*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    {locations.map((loc) => {
                      const active = formData.location === loc.id
                      return (
                        <label
                          key={loc.id}
                          className="flex items-center gap-3 p-3.5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50` }}
                          >
                            {active && <div className="w-2 h-2 rounded-full" style={{ background: goldBright }} />}
                          </div>
                          <input
                            type="radio"
                            name="location"
                            value={loc.id}
                            checked={active}
                            onChange={() => handleLocationChange(loc.id)}
                            className="hidden"
                            required
                          />
                          <span className="text-sm">{loc.label}</span>
                        </label>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {(formData.location === "outdoor" || formData.location === "clients-venue") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 20 }} // start slightly below
                        animate={{ opacity: 1, height: "auto", y: 0 }} // slide up to position
                        exit={{ opacity: 0, height: 0, y: 20 }} // slide down on exit
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mt-3.5 overflow-hidden"
                      >
                        <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                          {formData.location === "clients-venue" ? "Venue Address" : "Outdoor Location"} <span style={{ color: goldBright }}>*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: goldDim }} />
                          <input
                            type="text"
                            name="locationAddress"
                            placeholder={formData.location === "clients-venue" ? "Enter full venue address" : "Enter outdoor location / area"}
                            required={formData.location === "outdoor" || formData.location === "clients-venue"}
                            value={formData.locationAddress}
                            onChange={handleChange}
                            className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none"
                            style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                            onFocus={(e) => {
                              e.target.style.borderColor = goldMid
                              e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = `${goldDim}50`
                              e.target.style.boxShadow = "none"
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                    Additional Requests
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4 w-4 h-4" style={{ color: goldDim }} />
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us about your special requirements, themes, or questions…"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border py-3.5 pl-11 pr-4 text-sm transition-all outline-none resize-none"
                      style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                      onFocus={(e) => {
                        e.target.style.borderColor = goldMid
                        e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${goldDim}50`
                        e.target.style.boxShadow = "none"
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ══ Packages ══════════════════════════════════════════════════ */}
            <AnimatePresence>
              {showPackages && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.5 }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div ref={packagesRef} className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${goldDim})` }} />
                    <span className="font-black tracking-[0.2em] text-xs" style={{ color: goldMid }}>
                      OUR PACKAGES
                    </span>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${goldDim})` }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {getFilteredPackages().map((pkg, index) => {
                      const isSelected = formData.package === pkg.id
                      const isPopular = pkg.id === "premium_weekday" || pkg.id === "premium_weekend" || pkg.id === "rental_platinum_weekdays" || pkg.id === "rental_platinum_weekends"
                      return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        onClick={() => setFormData((prev) => ({ ...prev, package: pkg.id }))}
                        className="relative cursor-pointer transition-all"
                        style={{
                          background:
                            isPopular
                              ? "linear-gradient(145deg, #2a2316 0%, #3a2f1a 100%)"
                              : "linear-gradient(145deg, #3a2f1f 0%, #4f3d25 100%)",
                          border: isSelected ? `2px solid ${goldBright}` : isPopular ? `1px solid ${goldMid}` : `1px solid ${goldDim}/25`,
                          boxShadow: isSelected
                            ? `0 0 30px rgba(232,201,106,0.25), 0 4px 20px rgba(0,0,0,0.4)`
                            : isPopular
                              ? `0 0 40px rgba(200,160,60,0.12), 0 4px 16px rgba(0,0,0,0.4)` 
                              : `0 4px 16px rgba(0,0,0,0.3)`,
                        }}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div
                            className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 tracking-[0.15em] uppercase z-20"
                            style={{ background: `linear-gradient(to right, ${goldBright}, ${goldMid})`, color: "#0e0c08" }}
                          >
                            <Check className="w-3 h-3" /> Selected
                          </div>
                        )}

                        {/* Most Popular Badge - positioned at top border */}
                        {isPopular && !isSelected && (
                          <div
                            className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 tracking-[0.15em] uppercase z-10"
                            style={{ background: `linear-gradient(to right, ${goldBright}, ${goldMid})`, color: "#0e0c08" }}
                          >
                            <Sparkles className="w-3 h-3" /> Most Popular
                          </div>
                        )}

                        {/* Corner brackets */}
                        {["tl", "tr", "bl", "br"].map((pos) => (
                          <div
                            key={pos}
                            className="absolute w-4 h-4"
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

                        <div className="p-7 relative pt-9">

                          <h3 className="font-semibold text-base mb-2 leading-snug" style={{ color: textPrimary }}>
                            {pkg.title}
                          </h3>
                          <p className="text-3xl font-serif font-light mb-1" style={{ color: goldBright }}>
                            ₱{pkg.price}
                          </p>
                          <p className="text-sm mb-5 text-white/80">
                            {pkg.duration}
                            {(pkg as any).description && (
                              <span className="text-xs text-white/60 ml-2">
                                — {(pkg as any).description}
                              </span>
                            )}
                          </p>

                          <div className="h-px mb-4" style={{ background: `linear-gradient(to right, ${goldDim}/50, transparent)` }} />

                          <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: goldMid }}>
                            Inclusions
                          </p>
                          <div className="space-y-2 mb-5">
                            {pkg.features.map((f: string, i: number) => (
                              <div key={i} className="flex items-start gap-2.5">
                                <div
                                  className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"
                                  style={{ border: `1px solid ${goldDim}`, background: "rgba(200,160,60,0.08)" }}
                                >
                                  <Check className="w-2.5 h-2.5" style={{ color: goldMid }} />
                                </div>
                                <span className="text-xs leading-relaxed text-white/80">{f}</span>
                              </div>
                            ))}
                          </div>

                          {(pkg as any).addons && (pkg as any).addons.length > 0 && (
                            <>
                              <div className="h-px mb-4" style={{ background: `linear-gradient(to right, ${goldDim}/50, transparent)` }} />

                              <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: goldMid }}>
                                Add-Ons Available
                              </p>
                              <div className="space-y-1.5">
                                {(pkg as any).addons.map((a: string, i: number) => (
                                  <p key={i} className="text-xs text-white/60">
                                    · {a}
                                  </p>
                                ))}
                              </div>
                            </>
                          )}


                          {/* Selection overlay */}
                          {isSelected && (
                            <div 
                              className="absolute inset-0 pointer-events-none z-10"
                              style={{ 
                                background: `linear-gradient(145deg, rgba(232,201,106,0.08) 0%, transparent 50%)`,
                              }}
                            >
                              <div 
                                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ background: goldBright }}
                              >
                                <Check className="w-4 h-4 text-[#0e0c08]" />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )})}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── C. Package & Add-ons ───────────────────────────────── */}
            <section>
              <SectionHeader letter="C" title="Package & Add-ons" />
              <div className="space-y-6">
                {/* Package select */}
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                    Chosen Package <span style={{ color: goldBright }}>*</span>
                  </label>
                  <select
                    name="package"
                    required
                    value={formData.package}
                    onChange={handlePackageChange}
                    disabled={!formData.location}
                    className="w-full border py-3.5 px-4 text-sm transition-all outline-none appearance-none cursor-pointer"
                    style={{
                      background: cardBgLt,
                      borderColor: `${goldDim}50`,
                      color: formData.package ? textPrimary : textMuted,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a6e30' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = goldMid
                      e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${goldDim}50`
                      e.target.style.boxShadow = "none"
                    }}
                  >
                    <option value="" disabled style={{ background: "#1c1812", color: textMuted }}>
                      {formData.location ? "Choose your package" : "Select location first"}
                    </option>

                    {(formData.location === "studio" || formData.location === "clients-venue") && (
                      <optgroup label={formData.date && isWeekend(formData.date) ? "Studio Packages (Weekend)" : "Studio Packages (Weekday)"}>
                        {studioPackages.map((p) => (
                          <option key={p.id} value={p.id} style={{ background: "#1c1812", color: textPrimary }}>
                            {p.title} - ₱{p.price}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {formData.location === "studio-rental" && (
                      <optgroup label={formData.date && isWeekend(formData.date) ? "Studio Rental Packages (Weekend)" : "Studio Rental Packages (Weekday)"}>
                        {getStudioRentalPackages().map((p) => (
                          <option key={p.id} value={p.id} style={{ background: "#1c1812", color: textPrimary }}>
                            {p.title} - ₱{p.price}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {formData.location === "outdoor" && (
                      <optgroup label="Outdoor Packages">
                        {outdoor_packages.map((p) => (
                          <option key={p.id} value={p.id} style={{ background: "#1c1812", color: textPrimary }}>
                            {p.title} — {p.price}
                          </option>
                        ))}
                      </optgroup>
                    )}
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
                        <label
                          key={addon.id}
                          className="flex items-center gap-3 p-4 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            color: active ? goldBright : textSub,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div
                            className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                            style={{
                              border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50`,
                              background: active ? `${goldMid}25` : "transparent",
                            }}
                          >
                            {active && <Check className="w-2.5 h-2.5" style={{ color: goldBright }} />}
                          </div>
                          <input type="checkbox" checked={active} onChange={() => handleAddonChange(addon.id)} className="hidden" />
                          <span className="text-sm">{addon.label}</span>
                        </label>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {formData.addons.includes("other") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3.5 overflow-hidden"
                      >
                        <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: textSub }}>
                          Specify other add-ons <span style={{ color: goldBright }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="addonsOther"
                          placeholder="Describe add-ons"
                          required={formData.addons.includes("other")}
                          value={formData.addonsOther}
                          onChange={handleChange}
                          className="w-full border py-3.5 px-4 text-sm transition-all outline-none"
                          style={{ background: cardBgLt, borderColor: `${goldDim}50`, color: textPrimary }}
                          onFocus={(e) => {
                            e.target.style.borderColor = goldMid
                            e.target.style.boxShadow = `0 0 0 2px ${goldMid}15`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${goldDim}50`
                            e.target.style.boxShadow = "none"
                          }}
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
                <div
                  className="p-6 relative"
                  style={{
                    background: "linear-gradient(135deg, #201a0e 0%, #2a2010 100%)",
                    border: `1px solid ${goldDim}/50`,
                  }}
                >
                  {["tl", "tr", "bl", "br"].map((pos) => (
                    <div
                      key={pos}
                      className="absolute w-5 h-5"
                      style={{
                        top: pos.startsWith("t") ? 0 : "auto",
                        bottom: pos.startsWith("b") ? 0 : "auto",
                        left: pos.endsWith("l") ? 0 : "auto",
                        right: pos.endsWith("r") ? 0 : "auto",
                        borderTop: pos.startsWith("t") ? `1.5px solid ${goldDim}` : undefined,
                        borderBottom: pos.startsWith("b") ? `1.5px solid ${goldDim}` : undefined,
                        borderLeft: pos.endsWith("l") ? `1.5px solid ${goldDim}` : undefined,
                        borderRight: pos.endsWith("r") ? `1.5px solid ${goldDim}` : undefined,
                      }}
                    />
                  ))}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm" style={{ color: textSub }}>
                      Total Package Price
                    </span>
                    <span className="font-semibold" style={{ color: textPrimary }}>
                      ₱{formData.package ? getPackagePrice().toLocaleString() : "0"}
                    </span>
                  </div>
                  <div className="h-px mb-3" style={{ background: `${goldDim}40` }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: textSub }}>
                      Down Payment Required
                    </span>
                    <span className="text-2xl font-serif font-light" style={{ color: goldBright }}>
                      ₱500
                    </span>
                  </div>
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-4 p-5" style={{ background: "rgba(200,160,60,0.06)", border: `1px solid ${goldDim}/50` }}>
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${goldBright}, ${goldMid})` }}
                  >
                    <CreditCard className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: textPrimary }}>
                      Down Payment Required
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: textSub }}>
                      A{" "}
                      <span className="font-bold" style={{ color: goldBright }}>
                        ₱500 down payment
                      </span>{" "}
                      is required to confirm your reservation and secure your time slot. Transfer to one of the accounts below and upload your payment
                      proof.
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
                        <label
                          key={method.id}
                          className="flex items-start p-5 border cursor-pointer transition-all"
                          style={{
                            background: active ? cardBgLLt : cardBgLt,
                            borderColor: active ? goldMid : `${goldDim}35`,
                            boxShadow: active ? `0 0 12px rgba(200,160,60,0.12)` : "none",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ border: active ? `1px solid ${goldMid}` : `1px solid ${goldDim}50` }}
                          >
                            {active && <div className="w-2 h-2 rounded-full" style={{ background: goldBright }} />}
                          </div>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={active}
                            onChange={handleChange}
                            className="hidden"
                            required
                          />
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
                              <p className="text-xs mt-0.5" style={{ color: textSub }}>
                                {method.accountname}
                              </p>
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
                    <label
                      className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed cursor-pointer transition-all group"
                      style={{
                        borderColor: `${goldDim}50`,
                        background: "rgba(200,160,60,0.02)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = goldDim)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${goldDim}50`)}
                    >
                      <Upload className="w-9 h-9 mb-3 transition-colors" style={{ color: `${goldDim}` }} />
                      <p className="text-sm mb-1 font-medium" style={{ color: textSub }}>
                        Click to upload screenshot
                      </p>
                      <p className="text-xs" style={{ color: textMuted }}>
                        PNG, JPG up to 2MB
                      </p>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
                    </label>
                  ) : (
                    <div className="relative border overflow-hidden" style={{ borderColor: `${goldDim}50` }}>
                      <img src={previewUrl} alt="Payment proof" className="w-full h-64 object-cover" />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-colors"
                        style={{ background: "#ef4444" }}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.15 }}>
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
                type="submit"
                disabled={isSubmitting}
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
                  We&apos;ll contact you within{" "}
                  <span className="font-semibold" style={{ color: goldMid }}>
                    24 hours
                  </span>{" "}
                  to confirm your reservation.
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Bottom gold rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${goldBright}, transparent)` }}
      />

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-[#1c1812] rounded-sm">
          {/* Gold accent line top */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#c9a84c] via-[#e8c96a] via-[#c9a84c] to-transparent" />

          {submittedData && (
            <div className="bg-[#1c1812]">
              {/* HEADER */}
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-normal text-[#f0e8d5] tracking-wide">
                      Reservation Confirmed
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#a89878] mt-0.5">
                      We&apos;ll contact you within 24 hours to confirm
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* BODY - Two Column Layout */}
              <div className="px-6 pb-6">
                {/* Main Info Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {/* Schedule Card */}
                  <div className="col-span-2 bg-gradient-to-br from-[#231f18] to-[#1c1812] border border-[#2a2520] rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#c9a84c]" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[#c9a84c] font-semibold">Schedule</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg font-serif text-[#e8c96a]">{submittedData.date}</span>
                      <span className="text-sm text-[#a89878]">at</span>
                      <span className="text-lg font-serif text-[#e8c96a]">{submittedData.time}</span>
                    </div>
                  </div>

                  {/* Payment Card */}
                  <div className="bg-gradient-to-br from-[#231f18] to-[#1c1812] border border-[#2a2520] rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-[#c9a84c]" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[#c9a84c] font-semibold">Paid</span>
                    </div>
                    <p className="text-2xl font-serif text-[#e8c96a]">₱500</p>
                    <p className="text-[10px] text-[#a89878] uppercase">{submittedData.paymentMethod}</p>
                  </div>
                </div>

                {/* Package & Service Row */}
                <div className="bg-gradient-to-br from-[#231f18] to-[#1c1812] border border-[#2a2520] rounded-sm p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-4 h-4 text-[#c9a84c]" />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#c9a84c] font-semibold">Package & Service</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a6e30] mb-1">Package</p>
                      <p className="text-base text-[#f0e8d5] capitalize font-medium">
                        {submittedData.package?.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a6e30] mb-1">Shoot Type</p>
                      <p className="text-base text-[#f0e8d5] capitalize">
                        {submittedData.shootType === "other" ? submittedData.shootTypeOther : submittedData.shootType}
                      </p>
                    </div>
                    {submittedData.serviceType.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a6e30] mb-1">Services</p>
                        <div className="flex flex-wrap gap-1.5">
                          {submittedData.serviceType.map((service) => (
                            <span key={service} className="text-xs text-[#f0e8d5]">
                              {serviceTypes.find(s => s.id === service)?.label || service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Row */}
                <div className="bg-gradient-to-br from-[#231f18] to-[#1c1812] border border-[#2a2520] rounded-sm p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#c9a84c]" />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#c9a84c] font-semibold">Location</span>
                  </div>
                  <p className="text-base text-[#f0e8d5]">
                    {locations.find(l => l.id === submittedData.location)?.label}
                  </p>
                  {submittedData.locationAddress && (
                    <p className="text-sm text-[#a89878] mt-1">{submittedData.locationAddress}</p>
                  )}
                </div>

                {/* Client Info Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#181410] border border-[#2a2520]/50 rounded-sm p-3">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a6e30] mb-1">Client</p>
                    <p className="text-sm text-[#f0e8d5] truncate">{submittedData.name}</p>
                  </div>
                  <div className="bg-[#181410] border border-[#2a2520]/50 rounded-sm p-3">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a6e30] mb-1">Phone</p>
                    <p className="text-sm text-[#f0e8d5]">{submittedData.phone}</p>
                  </div>
                  <div className="bg-[#181410] border border-[#2a2520]/50 rounded-sm p-3">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#8a6e30] mb-1">Email</p>
                    <p className="text-sm text-[#a89878] truncate">{submittedData.email}</p>
                  </div>
                </div>

                {/* Add-ons */}
                {submittedData.addons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a6e30] mb-2">Add-ons</p>
                    <div className="flex flex-wrap gap-2">
                      {submittedData.addons.map((addon) => (
                        <span
                          key={addon}
                          className="px-3 py-1.5 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.25)] rounded-sm text-xs text-[#e8c96a]"
                        >
                          {packageAddons.find(a => a.id === addon)?.label || addon.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                {submittedData.message && (
                  <div className="bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.15)] rounded-sm p-4 mb-4">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#c9a84c] mb-2">Additional Requests</p>
                    <p className="text-sm text-[#a89878] italic">&ldquo;{submittedData.message}&rdquo;</p>
                  </div>
                )}

                {/* Important Note */}
                <div className="flex items-start gap-3 p-4 bg-[rgba(16,185,129,0.03)] border border-[rgba(16,185,129,0.15)] rounded-sm">
                  <div className="w-5 h-5 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#10b981] text-xs">!</span>
                  </div>
                  <p className="text-xs text-[#a89878] leading-relaxed">
                    Please arrive <strong className="text-[#f0e8d5]">10–15 minutes</strong> prior to your scheduled time. A confirmation email has been sent.
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="border-t border-[#2a2520] px-6 py-4 bg-[#181410]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-xs text-[#a89878]">Booking Reference: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                  </div>
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    className="text-xs bg-[#2a2520] hover:bg-[#3a3228] text-[#f0e8d5] border border-[#3a3228] px-6 py-2"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Gold accent line bottom */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#c9a84c] via-[#e8c96a] via-[#c9a84c] to-transparent" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
