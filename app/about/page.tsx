"use client"
import { Award, Camera, Heart, Palette, Users, Zap, Aperture } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number"
import { TeamMember, TeamMemberDialog } from "@/components/about/modal/team-member-modal"

const apertureBlades = 8
const ACCENT = "#f5d98a"
const ACCENT_GLOW = "#ecc84e"
const ACCENT_DIM = "rgba(245,217,138,0.12)"

const values = [
  { icon: Camera, title: "Artistic Excellence", description: "Unique artistic vision creating meaningful, beautiful images." },
  { icon: Award, title: "Professional Quality", description: "Highest standards of professional photography guaranteed." },
  { icon: Heart, title: "Personal Connection", description: "Understanding your story, creating collaborative experiences." },
  { icon: Users, title: "Client Commitment", description: "Your satisfaction is priority. Expectations exceeded." },
]

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }

export default function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden" style={{ background: "#0a0806", fontFamily: "'Georgia', serif" }}>

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(245,217,138,0.06) 0%, transparent 55%)" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 80%, rgba(245,217,138,0.03) 0%, transparent 45%)" }} />

      {/* ── Grid texture ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(${ACCENT}55 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}55 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
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

            {/* Stats */}
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
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-4 h-4 border-l border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: `${ACCENT}60` }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      <TeamMemberDialog selectedMember={selectedMember} setSelectedMember={setSelectedMember} />

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
