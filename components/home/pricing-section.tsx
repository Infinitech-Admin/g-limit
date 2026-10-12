"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { studioPackageList, lateFees, timeExtensions } from "@/lib/packages-data"
import { useBookingStore } from "@/store/useBookingStore"
import { PackageCard } from "@/components/PackageCard"

const ACCENT = "#f5d98a"

export function PricingSection() {
  const router = useRouter()
  const setSelectedService = useBookingStore((state) => state.setSelectedService)

  return (
    <section
      id="pricing"
      className="relative py-24 px-4 sm:px-6 md:px-10"
      style={{
        background: "linear-gradient(160deg, #0a0806 0%, #14100a 50%, #0a0806 100%)",
        borderTop: `1px solid ${ACCENT}12`,
        borderBottom: `1px solid ${ACCENT}12`,
      }}
    >
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,217,138,0.07) 0%, transparent 60%)" }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: `linear-gradient(to right, transparent, ${ACCENT})` }} />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>
              Pricing
            </span>
            <div className="h-px w-8" style={{ background: `linear-gradient(to left, transparent, ${ACCENT})` }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white" style={{ letterSpacing: "-0.02em" }}>
            Studio{" "}
            <span
              className="italic"
              style={{
                background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Packages
            </span>
          </h2>
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: "rgba(245,217,138,0.5)" }}>
            Portraits, creatives, birthday shoots and more. Choose the package that fits your shoot.
          </p>
        </motion.div>

        {/* Package cards */}
       <div className="grid grid-cols-1 items-stretch gap-6 pt-3 md:grid-cols-3">
          {studioPackageList.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={index}
              onBook={(p) => {
                setSelectedService(p.id)
                router.push("/booking-form")
              }}
            />
          ))}
        </div>

        {/* Late fee / Time extension */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {[
            { title: "Late Fee", rows: lateFees },
            { title: "Time Extension", rows: timeExtensions },
          ].map((block) => (
            <div
              key={block.title}
              className="rounded-xl p-5"
              style={{
                background: "linear-gradient(135deg, #1c1810, #141008)",
                border: "1px solid rgba(245,217,138,0.1)",
              }}
            >
              <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: ACCENT }}>
                {block.title}
              </p>
              <ul className="space-y-2">
                {block.rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between text-sm"
                    style={{ color: "rgba(245,217,138,0.65)" }}
                  >
                    <span>{row.label}</span>
                    <span className="font-black" style={{ color: ACCENT }}>
                      ₱{row.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Link to full price list */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{ color: ACCENT }}
          >
            View full price list (Rentals & Outdoor) →
          </Link>
        </div>
      </div>
    </section>
  )
}