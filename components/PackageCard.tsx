"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, Clock, Image as ImageIcon, Info } from "lucide-react"
import type { Package as PricePackage } from "@/lib/packages-data"

const ACCENT = "#f5d98a"
const ACCENT_GLOW = "#ecc84e"

const COLLAPSED_COUNT = 6

type Props = {
  pkg: PricePackage
  index?: number
  onBook: (pkg: PricePackage) => void
}

export function PackageCard({ pkg, index = 0, onBook }: Props) {
  const [open, setOpen] = useState(false)

  // "Note: ..." lines are not inclusions, so show them separately
  const notes = pkg.features.filter((f) => f.trim().toLowerCase().startsWith("note"))
  const inclusions = pkg.features.filter((f) => !f.trim().toLowerCase().startsWith("note"))

  const visible = open ? inclusions : inclusions.slice(0, COLLAPSED_COUNT)
  const hidden = inclusions.length - COLLAPSED_COUNT

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="relative flex h-full flex-col rounded-2xl"
      style={{
        background: "#15110a",
        border: pkg.popular ? `1px solid ${ACCENT}` : "1px solid rgba(245,217,138,0.14)",
        boxShadow: pkg.popular ? "0 10px 40px rgba(245,217,138,0.12)" : "none",
      }}
    >
      {/* Popular tag sits on the border so it never pushes the content down */}
      {pkg.popular && (
        <span
          className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, color: "#1a1204" }}
        >
          Most booked
        </span>
      )}

      {/* Header: same structure on every card so titles and prices line up */}
      <div className="px-6 pt-7 pb-5">
        <h3 className="font-serif text-xl font-semibold leading-snug text-white">{pkg.title}</h3>

        <div className="mt-2 flex items-center gap-4 text-sm" style={{ color: "rgba(245,217,138,0.7)" }}>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" style={{ color: ACCENT }} />
            {pkg.duration}
          </span>
          {pkg.photos && (
            <span className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" style={{ color: ACCENT }} />
              {pkg.photos}
            </span>
          )}
        </div>

        <p className="mt-5 font-serif text-4xl font-light" style={{ color: ACCENT }}>
          ₱{pkg.price.replace(".00", "")}
        </p>
        {pkg.description && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(245,217,138,0.55)" }}>
            {pkg.description}
          </p>
        )}
      </div>

      <div className="mx-6 h-px" style={{ background: "rgba(245,217,138,0.14)" }} />

      {/* Inclusions */}
      <div className="flex-1 px-6 py-5">
        <ul className="space-y-3">
          {visible.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-[13px] leading-snug" style={{ color: "rgba(255,244,214,0.85)" }}>
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-4 flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ color: ACCENT, outlineColor: ACCENT }}
          >
            {open ? "Show less" : `Show ${hidden} more inclusions`}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex">
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
        )}

        {/* Notes / add-ons */}
        <AnimatePresence initial={false}>
          {(open || hidden <= 0) && (notes.length > 0 || pkg.addons?.length) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 space-y-2 rounded-lg p-3 text-xs leading-relaxed"
              style={{ background: "rgba(245,217,138,0.06)", color: "rgba(245,217,138,0.75)" }}
            >
              {notes.map((n, i) => (
                <p key={`n${i}`} className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                  <span>{n.replace(/^note:\s*/i, "")}</span>
                </p>
              ))}
              {pkg.addons?.map((a, i) => (
                <p key={`a${i}`} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: ACCENT }} />
                  <span>{a}</span>
                </p>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Button */}
      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={() => onBook(pkg)}
          className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: pkg.popular ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})` : "transparent",
            color: pkg.popular ? "#1a1204" : ACCENT,
            border: pkg.popular ? "1px solid transparent" : `1px solid ${ACCENT}55`,
            outlineColor: ACCENT,
          }}
          onMouseEnter={(e) => {
            if (pkg.popular) return
            e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`
            e.currentTarget.style.color = "#1a1204"
          }}
          onMouseLeave={(e) => {
            if (pkg.popular) return
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = ACCENT
          }}
        >
          Book this package
        </button>
      </div>
    </motion.article>
  )
}