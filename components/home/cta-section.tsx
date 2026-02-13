"use client"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion } from "framer-motion"
import { Aperture, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function CTASection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden border-t-2 border-amber-500">
      {/* Static decorative circles - no rotation */}
      <div className="absolute -right-32 -top-32 w-96 h-96 border-[40px] border-amber-500/20 rounded-full" />
      <div className="absolute -left-32 -bottom-32 w-96 h-96 border-[40px] border-amber-500/10 rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Static aperture icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
          className="mb-8"
        >
          <Aperture className="w-20 h-20 text-amber-500 inline-block" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-serif font-light text-white mb-6"
        >
          Ready to Create Something{" "}
          <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">Beautiful</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.6 }}
          className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Let&apos;s discuss your vision and bring it to life through stunning photography and videography.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 font-bold shadow-xl shadow-amber-500/30 border-2 border-black transition-transform duration-300 hover:scale-105"
          >
            <Link href="/contact">
              <Camera className="w-5 h-5 mr-2" />
              Start Your Project
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black bg-transparent font-bold transition-all duration-300 hover:scale-105"
          >
            <Link href="/about">Learn About Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
