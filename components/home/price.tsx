"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Aperture,
  Check,
  Sparkles,
  Zap,
  Clock,
  Image as ImageIcon,
} from "lucide-react"
import { useBookingStore } from "@/store/useBookingStore"
import { useRouter } from "next/navigation"
import {
  packages,
  type Package,
  type PackageCategory,
} from "@/lib/packages-data"

const ACCENT = "#f5d98a"
const ACCENT_GLOW = "#ecc84e"
const ACCENT_DIM = "rgba(245,217,138,0.12)"

// ============================================
// CATEGORY CONFIG
// ============================================

type ViewCategory = "studio" | "studio-rental" | "outdoor"

const categoryTabs: { key: ViewCategory; label: string; sub: string }[] = [
  {
    key: "studio",
    label: "Studio Sessions",
    sub: "Portrait shoots, self-portrait & more",
  },
  {
    key: "studio-rental",
    label: "Studio Rentals",
    sub: "Group, party & event bookings",
  },
  { key: "outdoor", label: "Outdoor Sessions", sub: "On-location shoots" },
]

// promo keys differ in plurality between categories, normalize here
function getDayFilteredPackages(
  all: Package[],
  category: ViewCategory,
  isWeekend: boolean,
): Package[] {
  if (category === "outdoor") {
    return all.filter((p) => p.category === "outdoor")
  }
  const promoTarget =
    category === "studio"
      ? isWeekend
        ? "weekend"
        : "weekday"
      : isWeekend
        ? "weekends"
        : "weekdays"

  return all.filter((p) => p.category === category && p.promo === promoTarget)
}

export default function PriceList() {
  const setSelectedService = useBookingStore(
    (state) => state.setSelectedService,
  )
  const router = useRouter()

  const [activeCategory, setActiveCategory] = useState<ViewCategory>("studio")
  const [isWeekend, setIsWeekend] = useState(false)

  const visiblePackages = useMemo(
    () => getDayFilteredPackages(packages, activeCategory, isWeekend),
    [activeCategory, isWeekend],
  )

  const showDayToggle = activeCategory !== "outdoor"

  const handleBooking = (pkg: Package) => {
    setSelectedService(pkg.id)
    router.push("/booking-form")
  }

  return (
    <div className="bg-gradient-to-br from-black via-neutral-900 to-amber-950 pt-6">
      <section className='py-6 px-7'>
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-light text-white leading-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Price{" "}
            <span
              className="italic"
              style={{
                background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              List
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base font-sans leading-relaxed max-w-xl"
            style={{ color: "rgba(245,217,138,0.5)" }}
          >
            Transparent rates for every package — from a quick solo session to a
            full-day studio takeover.
          </motion.p>
        </div>
      </section>

      {/* ── CATEGORY TABS ── */}
      <section className="px-4 sm:px-6 md:px-10 relative z-10 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {categoryTabs.map((tab) => {
              const active = activeCategory === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className="text-left px-5 py-3 rounded-xl font-sans transition-all duration-300 flex-1 min-w-[200px]"
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`
                      : "linear-gradient(135deg, #1c1810, #141008)",
                    border: `1px solid ${active ? "transparent" : "rgba(245,217,138,0.12)"}`,
                    boxShadow: active
                      ? `0 8px 32px rgba(245,217,138,0.18)`
                      : "none",
                  }}
                >
                  <p
                    className="text-sm font-bold tracking-wide"
                    style={{ color: active ? "#000" : "white" }}
                  >
                    {tab.label}
                  </p>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{
                      color: active
                        ? "rgba(0,0,0,0.6)"
                        : "rgba(245,217,138,0.4)",
                    }}
                  >
                    {tab.sub}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── DAY TOGGLE ── */}
      {showDayToggle && (
        <section className="px-4 sm:px-6 md:px-10 relative z-10 mb-10">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div
              className="inline-flex p-1 rounded-full"
              style={{
                background: "rgba(245,217,138,0.06)",
                border: `1px solid ${ACCENT}20`,
              }}
            >
              {[
                { key: false, label: "Weekdays" },
                { key: true, label: "Weekends" },
              ].map((opt) => {
                const active = isWeekend === opt.key
                return (
                  <button
                    key={String(opt.key)}
                    onClick={() => setIsWeekend(opt.key)}
                    className="px-5 py-2 rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300"
                    style={{
                      background: active
                        ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`
                        : "transparent",
                      color: active ? "#000" : "rgba(245,217,138,0.55)",
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            <span
              className="font-sans text-xs"
              style={{ color: "rgba(245,217,138,0.35)" }}
            >
              Rates vary by day of the week
            </span>
          </div>
        </section>
      )}

      {/* ── PACKAGE GRID ── */}
      <section className="pb-28 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${isWeekend}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {visiblePackages.map((pkg, index) => {
                const hasAddons = !!pkg.addons?.length

                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group relative"
                  >
                    <div
                      className="h-full rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative"
                      style={{
                        background:
                          "linear-gradient(135deg, #1c1810 0%, #141008 60%, #1a1510 100%)",
                        border: pkg.popular
                          ? `1px solid ${ACCENT}45`
                          : "1px solid rgba(245,217,138,0.1)",
                        boxShadow: pkg.popular
                          ? `0 8px 40px rgba(245,217,138,0.12)`
                          : "0 4px 24px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        className="h-px"
                        style={{
                          background: `linear-gradient(to right, transparent, ${ACCENT}50, transparent)`,
                        }}
                      />

                      <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                          backgroundImage: `linear-gradient(${ACCENT}88 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}88 1px, transparent 1px)`,
                          backgroundSize: "20px 20px",
                        }}
                      />

                      <div className="p-6 flex flex-col gap-4 flex-1 relative">
                        <div className="flex items-start justify-between">
                          <div
                            className="flex items-center gap-2 font-sans text-xs"
                            style={{ color: "rgba(245,217,138,0.5)" }}
                          >
                            <Clock
                              className="w-3.5 h-3.5"
                              style={{ color: ACCENT }}
                            />
                            {pkg.duration}
                          </div>
                          {pkg.popular && (
                            <span
                              className="text-[10px] font-sans font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1"
                              style={{
                                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`,
                                color: "#000",
                              }}
                            >
                              <Sparkles className="w-2.5 h-2.5" /> Popular
                            </span>
                          )}
                        </div>

                        <div>
                          <h3
                            className="text-xl font-serif font-semibold text-white mb-1"
                            style={{ letterSpacing: "-0.01em" }}
                          >
                            {pkg.title}
                          </h3>
                          {pkg.description && (
                            <p
                              className="text-xs font-sans"
                              style={{ color: "rgba(245,217,138,0.4)" }}
                            >
                              {pkg.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span
                            className="text-2xl font-sans font-black"
                            style={{ color: ACCENT }}
                          >
                            ₱{pkg.price}
                          </span>
                        </div>

                        {pkg.photos && (
                          <div
                            className="flex items-center gap-2 font-sans text-xs"
                            style={{ color: "rgba(245,217,138,0.55)" }}
                          >
                            <ImageIcon
                              className="w-3.5 h-3.5"
                              style={{ color: ACCENT }}
                            />
                            {pkg.photos}
                          </div>
                        )}

                        <div
                          className="h-px"
                          style={{ background: `${ACCENT}15` }}
                        />

                        <ul className="space-y-2">
                          {pkg.features.map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 font-sans text-xs"
                              style={{ color: "rgba(245,217,138,0.65)" }}
                            >
                              <div
                                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{
                                  background: ACCENT_DIM,
                                  border: `1px solid ${ACCENT}30`,
                                }}
                              >
                                <Check
                                  className="w-2.5 h-2.5"
                                  style={{ color: ACCENT }}
                                />
                              </div>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        {hasAddons && (
                          <div>
                            <p
                              className="font-sans text-[11px] font-bold tracking-widest uppercase py-1"
                              style={{ color: ACCENT }}
                            >
                              Add-ons
                            </p>
                            <ul className="space-y-2">
                              {pkg.addons!.map((a, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2.5 font-sans text-xs pt-1"
                                  style={{ color: "rgba(245,217,138,0.5)" }}
                                >
                                  <div
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                                    style={{ background: ACCENT, opacity: 0.6 }}
                                  />
                                  <span>{a}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-auto pt-2">
                          <button
                            onClick={() => handleBooking(pkg)}
                            className="w-full py-3 rounded-xl font-sans font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
                            style={{
                              background: ACCENT_DIM,
                              border: `1px solid ${ACCENT}30`,
                              color: ACCENT,
                            }}
                            onMouseEnter={(e) => {
                              const b = e.currentTarget as HTMLButtonElement
                              b.style.background = `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`
                              b.style.color = "#000"
                              b.style.borderColor = "transparent"
                              b.style.boxShadow = `0 0 24px ${ACCENT}40`
                            }}
                            onMouseLeave={(e) => {
                              const b = e.currentTarget as HTMLButtonElement
                              b.style.background = ACCENT_DIM
                              b.style.color = ACCENT
                              b.style.borderColor = `${ACCENT}30`
                              b.style.boxShadow = "none"
                            }}
                          >
                            <Zap className="w-3.5 h-3.5" /> Book This Package
                          </button>
                        </div>
                      </div>

                      <div
                        className="absolute top-3 left-3 w-4 h-4 border-l border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ borderColor: `${ACCENT}60` }}
                      />
                      <div
                        className="absolute bottom-3 right-3 w-4 h-4 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ borderColor: `${ACCENT}60` }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {visiblePackages.length === 0 && (
            <div
              className="text-center py-20 font-sans"
              style={{ color: "rgba(245,217,138,0.4)" }}
            >
              No packages found for this selection.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
