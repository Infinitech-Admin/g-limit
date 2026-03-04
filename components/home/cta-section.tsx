"use client"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion } from "framer-motion"
import { Camera, Play, Pause } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export function CTASection() {
  const shouldReduceMotion = useReducedMotion()
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const duration = 12000 // ms for one full timeline loop

  useEffect(() => {
    if (!playing || shouldReduceMotion) return
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = (ts - startRef.current) % duration
      setProgress(elapsed / duration)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [playing, shouldReduceMotion])

  const togglePlay = () => {
    setPlaying(p => {
      if (!p) startRef.current = null
      return !p
    })
  }

  return (
    <section
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: "#0c0c0c" }}
    >
      <style>{`
        /* ── Light leak sweeps — transform+opacity only ── */
        @keyframes leakA {
          0%   { transform: translateX(-100%) rotate(-15deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.6; }
          100% { transform: translateX(160%) rotate(-15deg); opacity: 0; }
        }
        @keyframes leakB {
          0%   { transform: translateX(120%) rotate(20deg); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.4; }
          100% { transform: translateX(-80%) rotate(20deg); opacity: 0; }
        }
        @keyframes leakC {
          0%   { transform: translateY(-100%) rotate(5deg); opacity: 0; }
          25%  { opacity: 0.5; }
          75%  { opacity: 0.3; }
          100% { transform: translateY(120%) rotate(5deg); opacity: 0; }
        }

        /* ── Lens flare orb drift ── */
        @keyframes orbDrift {
          0%   { transform: translate(0px, 0px) scale(1);   opacity: 0.18; }
          33%  { transform: translate(30px, -20px) scale(1.15); opacity: 0.28; }
          66%  { transform: translate(-20px, 15px) scale(0.9);  opacity: 0.15; }
          100% { transform: translate(0px, 0px) scale(1);   opacity: 0.18; }
        }
        @keyframes orbDrift2 {
          0%   { transform: translate(0px, 0px) scale(1);   opacity: 0.12; }
          40%  { transform: translate(-25px, 18px) scale(1.2); opacity: 0.22; }
          70%  { transform: translate(15px, -12px) scale(0.85); opacity: 0.1; }
          100% { transform: translate(0px, 0px) scale(1);   opacity: 0.12; }
        }

        /* ── Anamorphic streak ── */
        @keyframes streakPulse {
          0%, 100% { opacity: 0.12; transform: scaleX(1); }
          50%       { opacity: 0.32; transform: scaleX(1.08); }
        }

        /* ── Subtle grain overlay ── */
        @keyframes grainShift {
          0%,100% { transform: translate(0,0); }
          20%     { transform: translate(-1px, 1px); }
          40%     { transform: translate(1px, -1px); }
          60%     { transform: translate(-1px, -1px); }
          80%     { transform: translate(1px, 1px); }
        }

        /* ── Playhead glow ── */
        @keyframes playheadGlow {
          0%, 100% { box-shadow: 0 0 6px 2px rgba(201,168,76,0.5); }
          50%       { box-shadow: 0 0 14px 4px rgba(201,168,76,0.9); }
        }

        .light-leak {
          pointer-events: none;
          position: absolute;
          will-change: transform, opacity;
        }
        .leak-a {
          width: 3px; height: 140%;
          top: -20%; left: 30%;
          background: linear-gradient(180deg, transparent, rgba(201,168,76,0.35) 30%, rgba(255,220,120,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent);
          filter: blur(6px);
          animation: leakA 9s ease-in-out infinite;
        }
        .leak-b {
          width: 2px; height: 130%;
          top: -15%; right: 25%;
          background: linear-gradient(180deg, transparent, rgba(255,200,80,0.25) 40%, rgba(255,240,160,0.4) 55%, rgba(255,200,80,0.25) 70%, transparent);
          filter: blur(8px);
          animation: leakB 13s ease-in-out infinite 2s;
        }
        .leak-c {
          width: 140%; height: 2px;
          left: -20%; top: 40%;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15) 40%, rgba(255,230,130,0.3) 55%, rgba(201,168,76,0.15) 70%, transparent);
          filter: blur(5px);
          animation: leakC 16s ease-in-out infinite 5s;
        }

        .lens-orb {
          pointer-events: none;
          position: absolute;
          border-radius: 50%;
          will-change: transform, opacity;
        }
        .orb-main {
          width: 380px; height: 380px;
          top: -80px; right: -60px;
          background: radial-gradient(circle, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.08) 45%, transparent 70%);
          animation: orbDrift 11s ease-in-out infinite;
        }
        .orb-secondary {
          width: 260px; height: 260px;
          bottom: -60px; left: -40px;
          background: radial-gradient(circle, rgba(180,140,50,0.18) 0%, rgba(180,140,50,0.06) 50%, transparent 70%);
          animation: orbDrift2 14s ease-in-out infinite 3s;
        }

        /* Anamorphic horizontal flare across center */
        .anamorphic-flare {
          pointer-events: none;
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          top: 50%;
          background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.08) 15%, rgba(255,235,150,0.35) 40%, rgba(255,245,180,0.5) 50%, rgba(255,235,150,0.35) 60%, rgba(201,168,76,0.08) 85%, transparent 100%);
          filter: blur(0.5px);
          animation: streakPulse 6s ease-in-out infinite;
          will-change: opacity, transform;
        }

        /* Film grain */
        .grain-layer {
          pointer-events: none;
          position: absolute;
          inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
          opacity: 0.06;
          animation: grainShift 0.15s steps(1) infinite;
          will-change: transform;
        }

        /* Timeline */
        .timeline-bar {
          position: relative;
          height: 3px;
          background: rgba(201,168,76,0.15);
          border-radius: 999px;
          overflow: visible;
        }
        .timeline-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #a07820, #c9a84c, #e8c96d);
          transition: width 0.1s linear;
        }
        .playhead {
          position: absolute;
          top: 50%;
          width: 12px; height: 12px;
          background: #e8c96d;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: playheadGlow 1.8s ease-in-out infinite;
          will-change: box-shadow;
        }

        /* Timeline tick marks */
        .tick {
          position: absolute;
          top: -6px;
          width: 1px;
          height: 6px;
          background: rgba(201,168,76,0.3);
        }

        /* Timecode font */
        .timecode {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(201,168,76,0.55);
        }
      `}</style>

      {/* Background layers */}
      <div className="grain-layer" />
      <div className="lens-orb orb-main" />
      <div className="lens-orb orb-secondary" />
      <div className="light-leak leak-a" />
      <div className="light-leak leak-b" />
      <div className="light-leak leak-c" />
      <div className="anamorphic-flare" />

      {/* Content */}
      <div className="max-w-3xl mx-auto text-center relative z-10">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="timecode">00:00:01:00 — SEQUENCE 01</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="font-serif font-semibold text-white leading-tight mb-3"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}
        >
          Ready to Create Something
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="font-serif font-semibold mb-10 leading-tight"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", color: "#c9a84c" }}
        >
          Truly Beautiful?
        </motion.p>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-10 origin-center"
          style={{ height: 1, width: 80, backgroundColor: "#c9a84c" }}
        />

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-base mb-12 max-w-xl mx-auto"
          style={{ color: "#8a7560", lineHeight: 1.75 }}
        >
          Let&apos;s discuss your vision and bring it to life through stunning photography and videography.
        </motion.p>

        {/* ── VIDEO TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12 px-2"
        >
          {/* Top row: play button + timecode */}
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
              style={{
                width: 32, height: 32,
                border: "1px solid rgba(201,168,76,0.5)",
                background: "rgba(201,168,76,0.08)",
                color: "#c9a84c",
              }}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing
                ? <Pause className="w-3.5 h-3.5" style={{ fill: "#c9a84c" }} />
                : <Play className="w-3.5 h-3.5" style={{ fill: "#c9a84c" }} />
              }
            </button>
            <span className="timecode">
              {String(Math.floor(progress * 12)).padStart(2, "0")}s / 12s
            </span>
            <span className="ml-auto timecode">4K · 24fps</span>
          </div>

          {/* Timeline bar */}
          <div className="timeline-bar">
            {/* Tick marks */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="tick" style={{ left: `${(i / 12) * 100}%` }} />
            ))}
            {/* Fill */}
            <div className="timeline-fill" style={{ width: `${progress * 100}%` }} />
            {/* Playhead */}
            {progress > 0 && (
              <div className="playhead" style={{ left: `${progress * 100}%` }} />
            )}
          </div>

          {/* Clip labels */}
          <div className="flex mt-3 gap-1">
            {["INTRO", "STORY", "MOMENTS", "REVEAL", "CTA"].map((label, i, arr) => (
              <div
                key={label}
                className="flex-1 text-center py-1 rounded-sm"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  color: progress * 5 >= i ? "#c9a84c" : "rgba(201,168,76,0.25)",
                  background: progress * 5 >= i ? "rgba(201,168,76,0.08)" : "rgba(201,168,76,0.03)",
                  border: "1px solid",
                  borderColor: progress * 5 >= i ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.08)",
                  transition: "color 0.3s, background 0.3s",
                  fontFamily: "monospace",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="font-bold transition-transform duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #b08830, #c9a84c, #e8c96d, #c9a84c)",
              color: "#0a0a0a",
              border: "none",
              boxShadow: "0 0 32px rgba(201,168,76,0.2), 0 4px 16px rgba(0,0,0,0.5)",
              letterSpacing: "0.04em",
            }}
          >
            <Link href="/booking-form">
              <Camera className="w-4 h-4 mr-2" />
              Start Your Project
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-bold transition-all duration-300 hover:scale-105 bg-transparent hover:bg-amber-500/10"
            style={{
              border: "1px solid rgba(201,168,76,0.5)",
              color: "#c9a84c",
              letterSpacing: "0.04em",
            }}
          >
            <Link href="/about">Learn About Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
