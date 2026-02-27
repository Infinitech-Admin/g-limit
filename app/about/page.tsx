"use client"
import { Card } from "@/components/ui/card"
import { Award, Camera, Heart, Palette, Users, Zap, Sparkles, Aperture } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number"
import { Button } from "@/components/ui/button"
import { TeamMember, TeamMemberDialog } from "@/components/about/modal/team-member-modal"

const values = [
  {
    icon: Camera,
    title: "Artistic Excellence",
    description: "Unique artistic vision creating meaningful, beautiful images.",
  },
  {
    icon: Award,
    title: "Professional Quality",
    description: "Highest standards of professional photography guaranteed.",
  },
  {
    icon: Heart,
    title: "Personal Connection",
    description: "Understanding your story, creating collaborative experiences.",
  },
  {
    icon: Users,
    title: "Client Commitment",
    description: "Your satisfaction is priority. Expectations exceeded.",
  },
]

const teamMembers = [
  {
    name: "Alexandra Sterling",
    role: "Founder & Creative Director",
    specialty: "Weddings & Portraits",
    image: "/professional-woman-photographer.png",
    bio: "Visionary leader documenting life's meaningful moments for over a decade.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
  {
    name: "Marcus Davidson",
    role: "Lead Photographer",
    specialty: "Events & Commercial",
    image: "/professional-photographer.png",
    bio: "Unmatched energy and attention to detail in every project.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
  {
    name: "Elena Vasquez",
    role: "Portrait Specialist",
    specialty: "Studio Portraits & Fashion",
    image: "/professional-latina-woman-photographer-portrait.jpg",
    bio: "High-end portrait and fashion, merging precision with creative expression.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
  {
    name: "James Liu",
    role: "Product & Commercial",
    specialty: "Product & E-commerce",
    image: "/professional-asian-man-photographer-portrait.jpg",
    bio: "Refined, technical mindset that elevates brands.",
    socials: {
      facebook: "https://www.facebook.com/alexandra.sterling.photography",
      instagram: "https://www.instagram.com/alexandra.sterling",
      linkedin: "https://www.linkedin.com/in/alexandra-sterling",
      website: "https://www.alexandrasterling.com",
    },
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export default function About() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  return (
    <div
      className="min-h-screen pt-16"
      style={{
        background: "linear-gradient(160deg, #faf7f2 0%, #f5f0e8 40%, #ede8df 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative circles */}
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border pointer-events-none"
          style={{ borderColor: "rgba(192,120,32,0.15)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full border pointer-events-none"
          style={{ borderColor: "rgba(192,120,32,0.1)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12" style={{ background: "#a06820" }} />
            <span
              className="text-xs tracking-[0.3em] font-sans font-semibold uppercase"
              style={{ color: "#a06820" }}
            >
              G-Limit Studio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-light leading-[0.95] mb-8"
            style={{ color: "#1a1612", letterSpacing: "-0.02em" }}
          >
            About{" "}
            <em
              className="not-italic font-bold"
              style={{
                background: "linear-gradient(135deg, #c07820, #e8a030)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Us
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl font-sans font-normal leading-relaxed max-w-xl"
            style={{ color: "#5c4f3a" }}
          >
            Creating exceptional photography that tells your unique story with elegance, artistry, and professionalism.
          </motion.p>

          {/* Divider with aperture */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="flex items-center gap-6 mt-12"
          >
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #c07820, transparent)" }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-6 h-6" style={{ color: "#c07820" }} />
            </motion.div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, #c07820, transparent)" }} />
          </motion.div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="pb-20 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Text */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: "#c07820" }} />
                <span className="text-xs font-sans tracking-[0.3em] uppercase" style={{ color: "#a06820" }}>
                  Our Story
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-light mb-6"
                style={{ color: "#1a1612", letterSpacing: "-0.01em" }}
              >
                Capturing life's{" "}
                <span className="font-bold" style={{ color: "#c07820" }}>
                  most meaningful
                </span>{" "}
                moments
              </h2>
              <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: "#5c4f3a" }}>
                <p>
                  Founded with a passion for capturing life's most meaningful moments, our studio has grown into a trusted destination for professional photography.
                </p>
                <p>
                  Every project begins with a simple belief: moments deserve to be preserved with care, intention, and beauty.
                </p>
                <p>We don't just take photos — we craft visual stories meant to last generations.</p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4">
              {[
                { number: 1, suffix: "+", label: "Year of Creative Excellence", icon: Award },
                { number: 50, suffix: "+", label: "Trusted Client Partnerships", icon: Users },
                { number: 5, suffix: "K+", label: "Moments Preserved", icon: Camera },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className="flex items-center gap-6 p-6 rounded-2xl transition-all duration-300"
                  style={{
                    background: "#fff9f2",
                    border: "1px solid #e2d5c0",
                    boxShadow: "0 2px 16px rgba(160,104,32,0.05)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#1a1612" }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: "#e8a030" }} />
                  </div>
                  <div>
                    <div
                      className="text-3xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #c07820, #e8a030)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      <CountingNumber number={stat.number} />
                      {stat.suffix}
                    </div>
                    <p className="font-sans text-sm" style={{ color: "#6b5d4a" }}>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── dark section for contrast ── */}
      <section
        className="py-20 px-4 sm:px-6 md:px-10 relative overflow-hidden"
        style={{ background: "#1a1612" }}
      >
        {/* Warm radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,130,40,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Corner accents */}
        <div className="absolute top-6 left-6 w-16 h-16 pointer-events-none" style={{ border: "1px solid rgba(200,130,40,0.25)", borderRight: "none", borderBottom: "none" }} />
        <div className="absolute bottom-6 right-6 w-16 h-16 pointer-events-none" style={{ border: "1px solid rgba(200,130,40,0.25)", borderLeft: "none", borderTop: "none" }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: "#c07820" }} />
              <span className="text-xs font-sans tracking-[0.3em] uppercase" style={{ color: "#a06820" }}>
                What We Stand For
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light" style={{ color: "#faf7f2" }}>
              Our{" "}
              <span className="font-bold" style={{ color: "#e8a030" }}>
                Values
              </span>
            </h2>
            <p className="mt-2 font-sans text-sm" style={{ color: "#8a7a68" }}>
              Principles that guide every frame we create
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: "rgba(255,249,242,0.04)",
                  border: "1px solid rgba(200,150,60,0.2)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,249,242,0.08)"
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,150,60,0.5)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,249,242,0.04)"
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,150,60,0.2)"
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(200,130,40,0.15)", color: "#e8a030" }}
                >
                  <value.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold mb-2 text-base" style={{ color: "#faf7f2" }}>{value.title}</h4>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#8a7a68" }}>{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STUDIO ── */}
      <section className="py-24 px-4 sm:px-6 md:px-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: "#c07820" }} />
              <span className="text-xs font-sans tracking-[0.3em] uppercase" style={{ color: "#a06820" }}>
                Our Creative Space
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light" style={{ color: "#1a1612" }}>
              The G-Limit{" "}
              <span className="font-bold" style={{ color: "#c07820" }}>
                Studio
              </span>
            </h2>
            <p className="mt-3 font-sans text-base max-w-xl" style={{ color: "#5c4f3a" }}>
              A thoughtfully designed environment that empowers creativity, precision, and artistic freedom.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-5"
          >
            {[
              { icon: Camera, title: "Professional Equipment", desc: "Industry-leading cameras and lighting for every shoot." },
              { icon: Zap, title: "Production Capabilities", desc: "High-end editing suites and seamless workflows." },
              { icon: Palette, title: "Creative Environment", desc: "Natural light, custom backdrops, and total freedom." },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-7 rounded-2xl transition-all duration-300"
                style={{
                  background: "#fff9f2",
                  border: "1px solid #e2d5c0",
                  boxShadow: "0 2px 16px rgba(160,104,32,0.05)",
                }}
              >
                {/* Top accent */}
                <div className="h-0.5 w-8 mb-5" style={{ background: "linear-gradient(90deg, #c07820, #e8a030)" }} />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "#1a1612", color: "#e8a030" }}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold mb-2" style={{ color: "#1a1612" }}>{item.title}</h4>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#6b5d4a" }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TeamMemberDialog selectedMember={selectedMember} setSelectedMember={setSelectedMember} />

      {/* ── CTA ── */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: "#1a1612" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,130,40,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8 inline-block"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
              <Aperture className="w-16 h-16 mx-auto" style={{ color: "#c07820" }} />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-light mb-5"
            style={{ color: "#faf7f2", letterSpacing: "-0.02em" }}
          >
            Ready to Create Something{" "}
            <em
              className="not-italic font-bold"
              style={{
                background: "linear-gradient(135deg, #c07820, #e8a030)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Beautiful?
            </em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-lg mb-10 max-w-xl mx-auto"
            style={{ color: "#8a7a68" }}
          >
            Let&apos;s discuss your vision and bring it to life through stunning photography.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/booking-form"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-sans font-bold text-base tracking-wide transition-all duration-300 hover:gap-4"
              style={{
                background: "linear-gradient(135deg, #c07820, #e8a030)",
                color: "#1a1612",
                boxShadow: "0 8px 40px rgba(200,130,40,0.35)",
              }}
            >
              <Camera className="w-5 h-5" />
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
