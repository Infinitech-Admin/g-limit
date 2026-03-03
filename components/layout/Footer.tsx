import { Facebook, Instagram, Mail, MapPin, Phone, Sparkles, Star } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import Link from "next/link"

const Footer = () => {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #0d0a04 50%, #1a0f00 100%)",
      }}
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

      {/* Ambient orbs */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-amber-200/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-yellow-100/5 rounded-full blur-3xl opacity-15 pointer-events-none" />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-amber-200 pointer-events-none">
        <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-amber-200" />
      </div>
      <div className="absolute top-0 right-0 w-10 h-10 border-r-4 border-t-4 border-amber-200 pointer-events-none">
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-200" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-14">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h2 className="text-amber-200 font-black tracking-widest text-sm">
              G-LIMIT STUDIO
            </h2>
            <span className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-amber-200 text-amber-200"
                />
              ))}
            </span>
          </div>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-200 to-transparent mb-4" />
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            Capturing life's precious moments with artistic excellence and
            professional dedication.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-amber-200/10 border border-amber-200/20 text-amber-200 text-xs font-bold px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-amber-200 rounded-full" />
            f/1.4 · 1/200s · ISO 100
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 p-8 relative"
          style={{
            background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
            border: "1px solid rgba(212,168,67,0.2)",
          }}
        >
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs text-amber-200/60 font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-4 h-px bg-amber-200/40" /> Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About" },
                { href: "/news", label: "News" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-amber-200 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-amber-200 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs text-amber-200/60 font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-4 h-px bg-amber-200/40" /> Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-amber-200 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:09690537370"
                  className="text-gray-400 text-sm hover:text-amber-200 transition-colors"
                >
                  09690537370
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-amber-200 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:g.limitstudio@gmail.com"
                  className="text-gray-400 text-sm hover:text-amber-200 transition-colors"
                >
                  g.limitstudio@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-200 mt-0.5 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Unit+303+Campos+Rueda+Building+Urban+Ave+Makati+City+1230+Metro+Manila"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-amber-200 transition-colors"
                >
                  Unit 303, Campos Rueda Building,
                  <br />
                  Urban Ave, Makati City 1230
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours + Social */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs text-amber-200/60 font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-4 h-px bg-amber-200/40" /> Operating Hours
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between border-b border-amber-200/10 pb-1.5">
                  <span className="text-gray-400 text-xs">Mon – Fri</span>
                  <span className="text-amber-200 text-xs font-semibold">
                    9AM – 6PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Sat – Sun</span>
                  <span className="text-amber-200 text-xs font-semibold">
                    By Appointment
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-xs text-amber-200/60 font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-4 h-px bg-amber-200/40" /> Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  {
                    href: "https://www.instagram.com/g.limitstudioph?igsh=MXA3YzhuaTFmNnNudA==",
                    icon: Instagram,
                  },
                  {
                    href: "https://www.facebook.com/share/1b4YbMQfKw/?mibextid=wwXIfr",
                    icon: Facebook,
                  },
                  {
                    href: "https://www.tiktok.com/@glimit.studio?_r=1&_t=ZS-942cxTHnfFd",
                    icon: SiTiktok,
                  },
                ].map(({ href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 border border-amber-200/20 flex items-center justify-center text-amber-200/50 hover:text-amber-200 hover:border-amber-200/60 hover:bg-amber-200/10 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-amber-200/10 pt-6 text-center space-y-1">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} G-Limit Studio. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Designed & Developed by{" "}
            <a
              href="https://infinitechphil.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200/50 hover:text-amber-200 transition-colors underline decoration-amber-200/30 hover:decoration-amber-200"
            >
              Infinitech Advertising Corporation
            </a>
          </p>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
    </footer>
  )
}

export default Footer
