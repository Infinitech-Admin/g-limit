"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useLockBodyScroll } from "@/hooks/use-scroll"
import FloatingParticles from "../animated-golden-particles"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  useLockBodyScroll(isOpen)

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      return isStandalone || isIOSStandalone
    }

    if (checkInstalled()) {
      setIsInstalled(true)
      setShowInstallButton(false)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      setShowInstallButton(false)
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallButton(false)
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
    const active = isActive(href)
    return (
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="relative">
        <Link
          href={href}
          onClick={onClick}
          className={`relative text-sm font-medium transition-all duration-300 ${
            active ? "text-gold font-semibold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : "text-white/90 hover:text-gold"
          }`}
        >
          {children}
          {active && (
            <motion.div
              layoutId="activeLink"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/50 to-gold rounded-full"
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>
      </motion.div>
    )
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/60 backdrop-blur-xl shadow-2xl shadow-gold/20 border-b border-gold/20"
          : "bg-black/40 backdrop-blur-md border-b border-gold/10"
      }`}
    >
      <FloatingParticles />

      <div ref={menuRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-3 relative">
        <div className="flex items-center justify-between">

          {/* ── Logo ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/" className="flex items-center shrink-0 group">
              <div className="relative">
                {/* Glow behind logo */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gold to-gold/50 blur-2xl opacity-30 group-hover:opacity-60"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/glimitlogo.png"
                  alt="G-Limit Studio"
                  className="relative h-14 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] transition-all duration-300"
                />
              </div>
            </Link>
          </motion.div>

          {/* ── Desktop Nav Links ── */}
          <motion.div
            className="hidden lg:flex items-center gap-6 xl:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { href: "/", label: "Home" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/services", label: "Services" },
              { href: "/about", label: "About" },
              { href: "/news", label: "News" },
              { href: "/blog", label: "Blog" },
              { href: "/ambassador", label: "Ambassador" },
            ].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
              >
                <NavLink href={link.href}>{link.label}</NavLink>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Right Actions ── */}
          <motion.div
            className="flex items-center gap-2 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* PWA Install Button */}
            <AnimatePresence>
              {showInstallButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleInstallClick}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold/20 to-gold/10 text-gold hover:from-gold/30 hover:to-gold/20 border border-gold/30 rounded-lg transition-all shadow-lg shadow-gold/20"
                    variant="ghost"
                  >
                    <Download size={16} />
                    <span className="text-xs font-medium">Install App</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/booking-form"
                className="hidden lg:inline-flex items-center px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 font-bold text-sm rounded-lg shadow-lg shadow-amber-500/25 border border-amber-300/30 transition-all duration-200 whitespace-nowrap"
              >
                Book Now
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <Button
                className="lg:hidden p-2 text-white/90 hover:text-gold transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                variant="ghost"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Mobile Menu ── */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            height: isOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`lg:hidden overflow-hidden ${isOpen ? "mt-4 pb-4" : ""}`}
        >
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {[
              { href: "/", label: "Home" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/services", label: "Services" },
              { href: "/about", label: "About" },
              { href: "/news", label: "News" },
              { href: "/blog", label: "Blog" },
              { href: "/ambassador", label: "Ambassador" },
            ].map((link) => (
              <motion.div
                key={link.href}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <NavLink href={link.href} onClick={() => setIsOpen(false)}>
                  {link.label}
                </NavLink>
              </motion.div>
            ))}

            {/* Mobile Install Button */}
            {showInstallButton && (
              <motion.div
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="pt-2"
              >
                <button
                  onClick={() => { handleInstallClick(); setIsOpen(false) }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-gold/20 to-gold/10 text-gold hover:from-gold/30 hover:to-gold/20 border border-gold/30 rounded-lg transition-all shadow-lg shadow-gold/20 text-sm font-medium"
                >
                  <Download size={16} />
                  Install App
                </button>
              </motion.div>
            )}

            <motion.div
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              className="pt-2"
            >
              <Link
                href="/contact"
                className="block w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 font-bold shadow-xl shadow-amber-500/30 border-2 border-black rounded-lg transition-all text-center text-sm"
                onClick={() => setIsOpen(false)}
              >
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </nav>
  )
}
