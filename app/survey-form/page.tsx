"use client"
import Link from "next/link"
import { motion } from "motion/react"
import FloatingParticles from "@/components/animated-golden-particles"
import { useInView } from "react-intersection-observer"
import SurveyForm from "@/components/survey/survey-form"

export default function BookingPage() {
  const { ref } = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  }

  const apertureBlades = 8

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <motion.section
        className="py-24 md:py-32 px-6 relative z-10 min-h-[50vh] flex items-center bg-linear-to-br from-black via-black to-amber-950"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 w-full">
          <motion.p className="text-xs md:text-sm uppercase tracking-widest text-amber-500 font-semibold" variants={itemVariants}>
            Client Satisfaction Survey
          </motion.p>

          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight" variants={itemVariants}>
            Share Your <span className="bg-linear-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">Experience</span>
          </motion.h1>

          <motion.p className="text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed" variants={itemVariants}>
            Thank you for choosing our studio! We value your feedback and would love to hear about your experience with us.
          </motion.p>
        </div>
      </motion.section>

      <section ref={ref} className="py-10 px-6">
        <div className="absolute  bg-linear-to-br from-black via-[#0a0a0a] to-[#1a1408]" />
        <motion.section variants={containerVariants} initial="hidden" animate="visible">
          {/* Aperture rings - left */}
          <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50">
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ rotate: 0, opacity: 0 }}
              whileInView={{ rotate: 15, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {[...Array(apertureBlades)].map((_, i) => (
                <motion.path
                  key={i}
                  d={`M100,100 L${100 + 80 * Math.cos((i * 2 * Math.PI) / apertureBlades)},${
                    100 + 80 * Math.sin((i * 2 * Math.PI) / apertureBlades)
                  } A80,80 0 0,1 ${100 + 80 * Math.cos(((i + 1) * 2 * Math.PI) / apertureBlades)},${
                    100 + 80 * Math.sin(((i + 1) * 2 * Math.PI) / apertureBlades)
                  } Z`}
                  fill="none"
                  stroke="hsl(43 96% 56%)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
              ))}
              <circle cx="100" cy="100" r="40" fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.3" />
              <circle cx="100" cy="100" r="78" fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.3" />
            </motion.svg>
          </div>

          {/* Aperture rings - right */}
          <div className="absolute right-[-5%] bottom-[10%] w-[300px] h-[300px] opacity-50">
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              initial={{ rotate: 0, opacity: 0 }}
              whileInView={{ rotate: -10, opacity: 1 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              {[...Array(6)].map((_, i) => (
                <circle key={i} cx="100" cy="100" r={30 + i * 12} fill="none" stroke="hsl(43 96% 56%)" strokeWidth="0.5" />
              ))}
            </motion.svg>
          </div>

          {/* Flare top-right */}
          <motion.div
            className="absolute top-[20%] right-[20%] w-32 h-32 pointer-events-none z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: "radial-gradient(circle, rgba(212,165,116,0.2), rgba(212,165,116,0.05), transparent)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: "rgba(212,165,116,0.6)" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-16 bg-linear-to-b from-transparent via-amber-400/40 to-transparent" />
          </motion.div>

          {/* Flare bottom-left */}
          <motion.div
            className="absolute bottom-[15%] left-[15%] w-24 h-24 pointer-events-none z-20"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: "radial-gradient(circle, rgba(212,165,116,0.25), rgba(212,165,116,0.1), transparent)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: "rgba(212,165,116,0.6)" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-12 bg-linear-to-b from-transparent via-amber-400/40 to-transparent" />
          </motion.div>

          {/* Survey Form - REPLACED BookingForm */}
          <SurveyForm />
        </motion.section>

       
    </div>
  )
}
