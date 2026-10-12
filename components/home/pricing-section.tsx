"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Clock, Sparkles, Zap } from "lucide-react"
import { studioPackageList, lateFees, timeExtensions } from "@/lib/packages-data"

const ACCENT = "#f5d98a"
const ACCENT_GLOW = "#ecc84e"
const ACCENT_DIM = "rgba(245,217,138,0.12)"

// On the home page we only show the first few inclusions per package,
// the rest are shown on the full price list page.
const MAX_FEATURES = 6

export function PricingSection() {
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
              Studio Packages
            </span>
            <div className="h-px w-8" style={{ background: `linear-gradient(to left, transparent, ${ACCENT})` }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white" style={{ letterSpacing: "-0.02em" }}>
            Simple{" "}
            <span
              className="italic"
              style={{
                background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pricing
            </span>
          </h2>
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: "rgba(245,217,138,0.5)" }}>
            Choose the package that fits your shoot. Same rates every day of the week.
          </p>
        </motion.div>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {studioPackageList.map((pkg, index) => {
            const shown = pkg.features.slice(0, MAX_FEATURES)
            const hiddenCount = pkg.features.length - shown.length

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative"
              >
                <div
                  className="h-full rounded-xl overflow-hidden flex flex-col relative transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #1c1810 0%, #141008 60%, #1a1510 100%)",
                    border: pkg.popular ? `1px solid ${ACCENT}55` : "1px solid rgba(245,217,138,0.1)",
                    boxShadow: pkg.popular ? "0 8px 40px rgba(245,217,138,0.14)" : "0 4px 24px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${ACCENT}50, transparent)` }} />

                  <div className="p-7 flex flex-col gap-5 flex-1 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(245,217,138,0.5)" }}>
                        <Clock className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                        {pkg.duration}
                      </div>
                      {pkg.popular && (
                        <span
                          className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1"
                          style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, color: "#000" }}
                        >
                          <Sparkles className="w-2.5 h-2.5" /> Popular
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-serif font-semibold text-white">{pkg.title}</h3>
                      <p className="mt-2 text-4xl font-serif font-light" style={{ color: ACCENT }}>
                        ₱{pkg.price.replace(".00", "")}
                      </p>
                    </div>

                    <div className="h-px" style={{ background: `${ACCENT}15` }} />

                    <ul className="space-y-2.5 flex-1">
                      {shown.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: "rgba(245,217,138,0.7)" }}>
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30` }}
                          >
                            <Check className="w-2.5 h-2.5" style={{ color: ACCENT }} />
                          </div>
                          <span>{f}</span>
                        </li>
                      ))}
                      {hiddenCount > 0 && (
                        <li className="text-xs pl-6" style={{ color: "rgba(245,217,138,0.45)" }}>
                          + {hiddenCount} more inclusions
                        </li>
                      )}
                    </ul>

                    <Link
                      href="/booking-form"
                      className="w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
                      style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}30`, color: ACCENT }}
                      onMouseEnter={(e) => {
                        const b = e.currentTarget as HTMLAnchorElement
                        b.style.background = `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`
                        b.style.color = "#000"
                        b.style.borderColor = "transparent"
                        b.style.boxShadow = `0 0 24px ${ACCENT}40`
                      }}
                      onMouseLeave={(e) => {
                        const b = e.currentTarget as HTMLAnchorElement
                        b.style.background = ACCENT_DIM
                        b.style.color = ACCENT
                        b.style.borderColor = `${ACCENT}30`
                        b.style.boxShadow = "none"
                      }}
                    >
                      <Zap className="w-3.5 h-3.5" /> Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
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
          {/* Adjust this href if your services page uses a different route */}
          <Link
            href="/services#pricing"
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