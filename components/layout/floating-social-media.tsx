"use client"
import { useState } from "react"
import { Facebook, Instagram, Mail, Phone, Share2, X } from "lucide-react"
import { useLockBodyScroll } from "@/hooks/use-scroll"

// TikTok doesn't have a lucide icon, so we use a simple SVG inline component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
)

const FloatingSocialIcons = () => {
  const [isOpen, setIsOpen] = useState(false)
  useLockBodyScroll(isOpen)

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/share/1b4YbMQfKw/?mibextid=wwXIfr",
      bgColor: "bg-blue-600 hover:bg-blue-700",
      ariaLabel: "Visit our Facebook page",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/g.limitstudioph?igsh=MXA3YzhuaTFmNnNudA==",
      bgColor: "bg-pink-600 hover:bg-pink-700",
      ariaLabel: "Visit our Instagram page",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      href: "https://www.tiktok.com/@glimit.studio?_r=1&_t=ZS-942cxTHnfFd",
      bgColor: "bg-black hover:bg-neutral-800",
      ariaLabel: "Visit our TikTok page",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:g.limitstudio@gmail.com",
      bgColor: "bg-red-600 hover:bg-red-700",
      ariaLabel: "Send us an email",
    },
    {
      name: "Phone",
      icon: Phone,
      href: "tel:096905373701",
      bgColor: "bg-blue-500 hover:bg-blue-600",
      ariaLabel: "Call us now",
    },
  ]

  return (
    <>
      {/* Desktop View - Right Side Vertical */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.name}
              href={social.href}
              target={social.name !== "Email" && social.name !== "Phone" ? "_blank" : undefined}
              rel={social.name !== "Email" && social.name !== "Phone" ? "noopener noreferrer" : undefined}
              aria-label={social.ariaLabel}
              className={`
                ${social.bgColor}
                w-12 h-12 rounded-full
                flex items-center justify-center
                text-white
                shadow-lg
                transition-all duration-300
                hover:scale-110 hover:shadow-xl
                active:scale-95
                group
              `}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          )
        })}
      </div>

      {/* Mobile View - Expandable Floating Button */}
      <div className="md:hidden fixed bottom-24 right-6 z-50">
        {/* Social Icons - Appear above the main button when open */}
        <div
          className={`
          flex flex-col-reverse gap-3 mb-3
          transition-all duration-300 origin-bottom
          ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-4 pointer-events-none"}
        `}
        >
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target={social.name !== "Email" && social.name !== "Phone" ? "_blank" : undefined}
                rel={social.name !== "Email" && social.name !== "Phone" ? "noopener noreferrer" : undefined}
                aria-label={social.ariaLabel}
                onClick={() => setIsOpen(false)}
                className={`
                  ${social.bgColor}
                  w-14 h-14 rounded-full
                  flex items-center justify-center
                  text-white
                  shadow-lg
                  transition-all duration-300
                  active:scale-95
                  animate-in slide-in-from-bottom-2
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <Icon className="w-6 h-6" />
              </a>
            )
          })}
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close social menu" : "Open social menu"}
          className={`
            w-16 h-16 rounded-full
            flex items-center justify-center
            text-white
            shadow-xl
            transition-all duration-300
            active:scale-95
            ${isOpen ? "bg-yellow-400 hover:bg-yellow-200 rotate-0" : "gold-glow rotate-0"}
          `}
        >
          {isOpen ? <X className="w-7 h-7 transition-transform duration-300" /> : <Share2 className="w-7 h-7 transition-transform duration-300" />}
        </button>

        {/* Backdrop overlay when open */}
        {isOpen && <div className="fixed inset-0 bg-black/20 -z-10" onClick={() => setIsOpen(false)} />}
      </div>
    </>
  )
}

export default FloatingSocialIcons
