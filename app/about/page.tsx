"use client"
import { Award, Camera, Heart, Palette, Users, Zap, Aperture, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number"

const apertureBlades = 8
const ACCENT = "#f5d98a"
const ACCENT_GLOW = "#ecc84e"
const ACCENT_DIM = "rgba(245,217,138,0.12)"
const GOLD = "#f5c842"

const values = [
  { icon: Camera, title: "Artistic Excellence", description: "Unique artistic vision creating meaningful, beautiful images." },
  { icon: Award, title: "Professional Quality", description: "Highest standards of professional photography guaranteed." },
  { icon: Heart, title: "Personal Connection", description: "Understanding your story, creating collaborative experiences." },
  { icon: Users, title: "Client Commitment", description: "Your satisfaction is priority. Expectations exceeded." },
]

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

// ── Org Chart Data ──
const orgData = {
  ceo: { name: "Angelle Sarmiento", title: "Chief Executive Officer", initials: "AS", color: "#f5c842" },
  ea: { name: "Maria Krissa Charez Bongon", title: "Executive Assistant", initials: "MK", color: "#f5c842" },
  branches: [
    {
      manager: { name: "Aizle Marie Atienza", title: "Admin Supervisor", initials: "AM", color: "#f5d98a" },
      dept: "Administration",
      deptColor: "#f5d98a",
      members: [],
    },
    {
      manager: { name: "Darlene Angel Fajarito", title: "Accounting Supervisor", initials: "DA", color: "#7dd3fc" },
      dept: "Finance",
      deptColor: "#7dd3fc",
      members: [],
    },
    {
      manager: { name: "Justin De Castro", title: "Junior IT Manager", initials: "JD", color: "#86efac" },
      dept: "IT Department",
      deptColor: "#86efac",
      members: [
        { name: "Eirene Grace Armilla", title: "Jr. Web Developer", initials: "EG", color: "#86efac" },
        { name: "Raiza Mae Habaña", title: "Jr. Web Developer", initials: "RM", color: "#86efac" },
        { name: "Hazel Anne Mendoza", title: "Jr. Web Developer", initials: "HA", color: "#86efac" },
      ],
    },
    {
      manager: { name: "Armand Cajucom", title: "Multimedia Manager", initials: "AC", color: "#d8b4fe" },
      dept: "Multimedia",
      deptColor: "#d8b4fe",
      members: [
        { name: "Margelle Lodovice", title: "Multimedia Editor", initials: "ML", color: "#d8b4fe" },
      ],
    },
    {
      manager: { name: "Jayvee Valeriano", title: "Studio Manager", initials: "JV", color: "#fda4af" },
      dept: "Studio",
      deptColor: "#fda4af",
      members: [
        { name: "Jhoanna Mae Papio", title: "Asst. Studio Manager", initials: "JM", color: "#fda4af" },
        { name: "Kate Perez", title: "Marketing / Admin Asst.", initials: "KP", color: "#fda4af" },
        { name: "Giselle Villasan", title: "Marketing Staff", initials: "GV", color: "#fda4af" },
      ],
    },
  ],
}

// ── Full Image Modal (original) ──
interface MemberInfo {
  name: string
  title: string
  image: string | null
  color: string
}

function FullImageModal({ member, onClose }: { member: MemberInfo | null; onClose: () => void }) {
  if (!member) return null
  const initials = member.name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("")
  return (
    <AnimatePresence>
      {member && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-2xl overflow-hidden flex flex-col items-center"
            style={{
              background: "linear-gradient(160deg, #1e1a0e, #130f07)",
              border: `1.5px solid ${member.color}55`,
              boxShadow: `0 0 80px ${member.color}20, 0 24px 60px rgba(0,0,0,0.7)`,
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 pointer-events-none" style={{ borderColor: `${member.color}70` }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 pointer-events-none" style={{ borderColor: `${member.color}70` }} />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: `${member.color}18`, border: `1px solid ${member.color}40`, color: member.color }}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full" style={{ aspectRatio: "1 / 1", background: `${member.color}08` }}>
              {member.image ? (
                <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-serif font-bold text-6xl select-none" style={{ color: `${member.color}80` }}>{initials}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to top, #130f07, transparent)" }} />
            </div>
            <div className="px-6 py-5 text-center w-full">
              <div className="h-px mb-4" style={{ background: `linear-gradient(to right, transparent, ${member.color}50, transparent)` }} />
              <p className="font-serif text-lg font-semibold text-white leading-tight">{member.name}</p>
              <p className="font-sans text-[11px] tracking-widest uppercase mt-1.5" style={{ color: `${member.color}70` }}>{member.title}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ══════════════════════════════════════════
// ── NEW ORG CHART COMPONENTS ──
// ══════════════════════════════════════════

function OrgApertureIcon({ size = 36, color = GOLD, spinning = false }: { size?: number; color?: string; spinning?: boolean }) {
  const blades = 8
  const [rotation, setRotation] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!spinning) return
    let start: number
    const animate = (ts: number) => {
      if (!start) start = ts
      setRotation(((ts - start) / 40) % 360)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [spinning])

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "none" : undefined }}>
      {Array.from({ length: blades }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / blades
        const nextAngle = ((i + 1) * 2 * Math.PI) / blades
        const x1 = 50 + 38 * Math.cos(angle)
        const y1 = 50 + 38 * Math.sin(angle)
        const x2 = 50 + 38 * Math.cos(nextAngle)
        const y2 = 50 + 38 * Math.sin(nextAngle)
        return (
          <path key={i} d={`M50,50 L${x1},${y1} A38,38 0 0,1 ${x2},${y2} Z`}
            fill={`${color}${i % 2 === 0 ? "22" : "15"}`} stroke={`${color}60`} strokeWidth="0.8" />
        )
      })}
      <circle cx="50" cy="50" r="14" fill="none" stroke={`${color}80`} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="7" fill={`${color}30`} />
      <circle cx="50" cy="50" r="36" fill="none" stroke={`${color}30`} strokeWidth="0.5" />
    </svg>
  )
}

interface OrgPerson {
  name: string
  title: string
  initials: string
  color: string
}

function ShutterCard({ person, size = "md", pulse = false }: { person: OrgPerson; size?: "lg" | "md" | "sm"; pulse?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const isLg = size === "lg"
  const isSm = size === "sm"

  const avatarSize = isLg ? 80 : isSm ? 48 : 54
  const fontSize = isLg ? 26 : isSm ? 15 : 17
  const nameFontSize = isLg ? 15 : isSm ? 10 : 11
  const titleFontSize = isLg ? 10 : isSm ? 8 : 8
  const padding = isLg ? 22 : isSm ? 10 : 12

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box" as const,
        background: hovered ? "linear-gradient(135deg, #1e1a0a, #251f0c)" : "linear-gradient(135deg, #17130a, #1a1508)",
        border: `1.5px solid ${hovered ? person.color + "90" : person.color + "40"}`,
        borderRadius: 14,
        padding,
        cursor: "default",
        boxShadow: hovered ? `0 0 30px ${person.color}25, 0 8px 32px rgba(0,0,0,0.5)` : "0 4px 16px rgba(0,0,0,0.4)",
        transition: "all 0.25s ease",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: 8,
        outline: pulse ? `2px solid ${person.color}` : "none",
        outlineOffset: pulse ? 3 : 0,
      }}
    >
      {/* Top film perforations */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "4px 6px", pointerEvents: "none" }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: 1, background: `${person.color}30`, border: `1px solid ${person.color}25` }} />
        ))}
      </div>

      {/* Aperture avatar */}
      <div style={{ position: "relative", width: avatarSize, height: avatarSize, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `1.5px solid ${person.color}50`, boxShadow: hovered ? `0 0 16px ${person.color}40` : "none", transition: "box-shadow 0.3s ease" }} />
        <div style={{ position: "absolute", inset: 0, opacity: hovered ? 0.6 : 0.25, transition: "opacity 0.3s" }}>
          <OrgApertureIcon size={avatarSize} color={person.color} />
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: `${person.color}15` }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize, fontWeight: 700, color: person.color, letterSpacing: "-0.02em" }}>{person.initials}</span>
        </div>
      </div>

      {/* Name & title */}
      <div style={{ textAlign: "center", lineHeight: 1.25, width: "100%" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: nameFontSize, fontWeight: 600, color: "#fff", marginBottom: 3, wordBreak: "break-word" }}>{person.name}</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: titleFontSize, color: `${person.color}80`, letterSpacing: "0.08em", textTransform: "uppercase", wordBreak: "break-word" }}>{person.title}</div>
      </div>

      {/* Bottom film perforations */}
      <div style={{ position: "absolute", bottom: 4, left: 6, right: 6, display: "flex", justifyContent: "space-between", pointerEvents: "none" }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: 1, background: `${person.color}25`, border: `1px solid ${person.color}20` }} />
        ))}
      </div>
    </div>
  )
}

function OrgConnectorV({ color = GOLD, length = 32 }: { color?: string; length?: number }) {
  return (
    <div style={{ width: 2, height: length, background: `linear-gradient(to bottom, ${color}80, ${color}30)`, margin: "0 auto", flexShrink: 0 }} />
  )
}

function DeptBadge({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700,
      letterSpacing: "0.2em", textTransform: "uppercase" as const,
      color, background: `${color}15`, border: `1px solid ${color}40`,
      borderRadius: 20, padding: "5px 16px", display: "inline-block", marginBottom: 14,
    }}>
      {label}
    </div>
  )
}

function OrgBranch({ branch }: { branch: typeof orgData.branches[0] }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      flex: "1 1 0", minWidth: 0,
    }}>
      <OrgConnectorV color={branch.deptColor} length={36} />
      <DeptBadge label={branch.dept} color={branch.deptColor} />
      <ShutterCard person={branch.manager} size="md" />
      {branch.members.length > 0 && (
        <>
          <OrgConnectorV color={branch.deptColor} length={28} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            {branch.members.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {i > 0 && <OrgConnectorV color={branch.deptColor} length={16} />}
                <ShutterCard person={m} size="sm" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ══════════════════════════════════════════

export default function About() {
  const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="min-h-screen pt-16 relative overflow-hidden"
      style={{ background: "#0a0806", fontFamily: "'Georgia', serif" }}
    >
      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(245,217,138,0.06) 0%, transparent 55%)" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 80%, rgba(245,217,138,0.03) 0%, transparent 45%)" }} />

      {/* ── Grid texture ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">

        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${ACCENT})` }} />
            <p className="font-sans font-black tracking-[0.3em] text-[10px] uppercase" style={{ color: ACCENT }}>G-Limit Studio</p>
            <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${ACCENT})` }} />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-white leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
            About{" "}
            <span className="italic" style={{ background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Us
            </span>
          </h1>
          <p className="text-base font-sans leading-relaxed max-w-xl" style={{ color: "rgba(245,217,138,0.5)" }}>
            Creating exceptional photography that tells your unique story with elegance, artistry, and professionalism.
          </p>
          <div className="flex items-center gap-6 mt-10">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${ACCENT}60, transparent)` }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-5 h-5" style={{ color: `${ACCENT}70` }} />
            </motion.div>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${ACCENT}60, transparent)` }} />
          </div>
        </motion.div>

        {/* ── STORY ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-20">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: ACCENT }} />
            <span className="text-[10px] font-sans font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>Our Story</span>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-serif font-light text-white mb-5" style={{ letterSpacing: "-0.01em" }}>
                Capturing life's <span className="italic" style={{ color: ACCENT }}>most meaningful</span> moments
              </h2>
              <div className="space-y-4 font-sans text-sm leading-relaxed" style={{ color: "rgba(245,217,138,0.5)" }}>
                <p>Founded with a passion for capturing life's most meaningful moments, our studio has grown into a trusted destination for professional photography.</p>
                <p>Every project begins with a simple belief: moments deserve to be preserved with care, intention, and beauty.</p>
                <p>We don't just take photos — we craft visual stories meant to last generations.</p>
              </div>
            </motion.div>
            <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-3">
              {[
                { number: 1, suffix: "+", label: "Year of Creative Excellence", icon: Award },
                { number: 50, suffix: "+", label: "Trusted Client Partnerships", icon: Users },
                { number: 5, suffix: "K+", label: "Moments Preserved", icon: Camera },
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className="flex items-center gap-5 p-5 rounded-xl transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid rgba(245,217,138,0.1)` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${ACCENT}35` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,217,138,0.1)" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}25`, color: ACCENT }}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      <CountingNumber number={stat.number} />{stat.suffix}
                    </div>
                    <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(245,217,138,0.45)" }}>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── VALUES ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-20">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: ACCENT }} />
            <span className="text-[10px] font-sans font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>What We Stand For</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl font-serif font-light text-white mb-2">
            Our <span className="italic" style={{ color: ACCENT }}>Values</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="font-sans text-xs mb-8" style={{ color: "rgba(245,217,138,0.4)" }}>
            Principles that guide every frame we create
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group p-6 rounded-xl transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid rgba(245,217,138,0.08)` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${ACCENT}35`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(245,217,138,0.07)` }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,217,138,0.08)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12"
                  style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}25`, color: ACCENT }}>
                  <value.icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-semibold mb-2 text-white text-sm">{value.title}</h4>
                <p className="font-sans text-xs leading-relaxed" style={{ color: "rgba(245,217,138,0.4)" }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── STUDIO ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-20">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: ACCENT }} />
            <span className="text-[10px] font-sans font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>Our Creative Space</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl font-serif font-light text-white mb-2">
            The G-Limit <span className="italic" style={{ color: ACCENT }}>Studio</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="font-sans text-sm mb-8 max-w-xl" style={{ color: "rgba(245,217,138,0.4)" }}>
            A thoughtfully designed environment that empowers creativity, precision, and artistic freedom.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Camera, title: "Professional Equipment", desc: "Industry-leading cameras and lighting for every shoot." },
              { icon: Zap, title: "Production Capabilities", desc: "High-end editing suites and seamless workflows." },
              { icon: Palette, title: "Creative Environment", desc: "Natural light, custom backdrops, and total freedom." },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group p-6 rounded-xl transition-all duration-300 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1c1810, #141008)", border: `1px solid rgba(245,217,138,0.1)` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${ACCENT}35`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(245,217,138,0.08)` }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,217,138,0.1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none" }}
              >
                <div className="h-px mb-5" style={{ background: `linear-gradient(to right, ${ACCENT}50, transparent)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12"
                  style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}25`, color: ACCENT }}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-semibold mb-2 text-white">{item.title}</h4>
                <p className="font-sans text-xs leading-relaxed" style={{ color: "rgba(245,217,138,0.4)" }}>{item.desc}</p>
                <div className="absolute top-3 left-3 w-4 h-4 border-l border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════
            ── NEW ORG CHART ──
        ══════════════════════════════════════════ */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-20">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: ACCENT }} />
            <span className="text-[10px] font-sans font-black tracking-[0.3em] uppercase" style={{ color: ACCENT }}>Our People</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl font-serif font-light text-white mb-2">
            Organizational <span className="italic" style={{ color: ACCENT }}>Structure</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="font-sans text-xs mb-10" style={{ color: "rgba(245,217,138,0.4)" }}>
            The talented team behind every captured moment
          </motion.p>

          {/* Film-strip bordered org chart container */}
          <motion.div variants={fadeInUp}
            style={{
              position: "relative",
              background: "linear-gradient(135deg, #0f0c07, #0c0a05)",
              border: `1px solid ${GOLD}20`,
              borderRadius: 16,
              padding: "48px 16px 60px",
              overflow: "hidden",
            }}
          >
            {/* Top film strip */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 24, background: "#09080433", borderBottom: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", overflow: "hidden" }}>
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} style={{ width: 12, height: 14, borderRadius: 2, flexShrink: 0, background: `${GOLD}18`, border: `1px solid ${GOLD}25` }} />
              ))}
            </div>
            {/* Bottom film strip */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 24, background: "#09080433", borderTop: `1px solid ${GOLD}20`, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", overflow: "hidden" }}>
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} style={{ width: 12, height: 14, borderRadius: 2, flexShrink: 0, background: `${GOLD}18`, border: `1px solid ${GOLD}25` }} />
              ))}
            </div>

            {/* Exposure counter */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "4px 16px",
                background: "#0d0b06", border: `1px solid ${GOLD}30`,
                borderRadius: 4,
                fontFamily: "'Courier New', monospace", fontSize: 11,
                color: `${GOLD}80`, letterSpacing: "0.15em",
              }}>
                <span style={{ color: `${GOLD}50` }}>EXPOSURE</span>
                <span>{String(tick).padStart(4, "0")}</span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e11d48", boxShadow: "0 0 8px #e11d48", animation: "blink 1s infinite" }} />
              </div>
            </div>

            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>

            {/* Spinning aperture header icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <OrgApertureIcon size={56} color={GOLD} spinning />
            </div>

            {/* EXIF metadata line */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD}30)` }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: `${GOLD}45`, letterSpacing: "0.3em" }}>f/1.8 · ISO 400 · 1/125s</span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD}30)` }} />
            </div>

            {/* CEO */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 280 }}>
                <ShutterCard person={orgData.ceo} size="lg" pulse />
              </div>
            </div>
            <OrgConnectorV color={GOLD} length={40} />

            {/* Executive Assistant */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 240 }}>
                <ShutterCard person={orgData.ea} size="md" />
              </div>
            </div>
            <OrgConnectorV color={GOLD} length={32} />

            {/* Horizontal branch bar */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "85%", height: 2, background: `linear-gradient(to right, transparent, ${GOLD}60, ${GOLD}80, ${GOLD}60, transparent)` }} />
            </div>

            {/* Branches */}
            <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: 8, paddingInline: 4 }}>
              {orgData.branches.map((branch, i) => (
                <OrgBranch key={i} branch={branch} />
              ))}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 36, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
              {orgData.branches.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: b.deptColor, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "rgba(245,200,66,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{b.dept}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        {/* ══ END ORG CHART ══ */}

      </div>

      {/* ── Full Image Modal ── */}
      <FullImageModal member={selectedMember} onClose={() => setSelectedMember(null)} />

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
            Ready to Create Something{" "}
            <span className="italic" style={{ background: `linear-gradient(to right, ${ACCENT}, #fae9a0, ${ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Beautiful?
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="font-sans text-sm mb-10" style={{ color: "rgba(245,217,138,0.45)" }}>
            Let's discuss your vision and bring it to life through stunning photography.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Link href="/booking-form"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-sans font-bold text-sm tracking-widest uppercase transition-all duration-300"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_GLOW})`, color: "#000", boxShadow: `0 8px 40px rgba(245,217,138,0.2)` }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 60px rgba(245,217,138,0.35)`}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 40px rgba(245,217,138,0.2)`}
            >
              <Camera className="w-4 h-4" /> Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
