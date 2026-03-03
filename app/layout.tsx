import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { PublicLayoutProvider } from "./providers/layout-context"
import PWARegister from "@/components/PWARegister"
import { Analytics } from "@vercel/analytics/next"
import ClientProviders from "@/components/ClientProviders"
import {
  defaultMetadata,
  organizationSchema,
  websiteSchema,
  serviceSchema,
} from "@/lib/metadata"

// ─── Fonts ────────────────────────────────────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  preload: false,
})

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL("https://g-limitstudio.com"),
  title: {
    default: "G-Limit Studio | Professional Photography & Videography Services in Makati",
    template: "%s | G-Limit Studio",
  },
  description:
    "Premier photography and videography studio in Makati City. Specializing in portraits, events, weddings, pre-nuptial shoots, maternity photography, and more.",
  keywords: [
    "photography studio Makati",
    "videography services Philippines",
    "wedding photographer Makati",
    "pre-nuptial photography",
    "maternity photography",
    "portrait photography",
    "event photography",
    "professional photographer",
    "G-Limit Studio",
    "Urban Avenue Makati",
    "wedding videography",
    "prenup shoot",
    "buntis photography",
    "corporate photography",
    "photography services Metro Manila",
  ],
  authors: [{ name: "G-Limit Studio" }],
  creator: "G-Limit Studio",
  publisher: "Infinitech Advertising Corporation",
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "G-Limit Studio",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://g-limitstudio.com",
    siteName: "G-Limit Studio",
    title: "G-Limit Studio | Professional Photography & Videography in Makati",
    description:
      "Premier photography and videography studio in Makati City. Weddings, portraits, events, pre-nuptial shoots, maternity photography.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "G-Limit Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "G-Limit Studio | Professional Photography & Videography",
    description: "Premier photography and videography studio in Makati City.",
    images: ["/twitter-image.jpg"],
    creator: "@glimitstudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "https://g-limitstudio.com" },
  verification: { google: "pFlfpGXFgh-F0fXiy-8Yd8KqjlbJq_dcbzrNUNxe" },
  category: "Photography & Videography",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://g-limitstudio.com/#business",
  name: "G-Limit Studio",
  alternateName: "Infinitech Advertising Corporation",
  image: "https://g-limitstudio.com/logo.png",
  logo: "https://g-limitstudio.com/logo.png",
  description:
    "Professional photography and videography studio specializing in portraits, events, weddings, pre-nuptial shoots, maternity photography, and corporate events in Makati City.",
  url: "https://g-limitstudio.com",
  telephone: "+63-XXX-XXX-XXXX",
  email: "info@g-limitstudio.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Urban Avenue",
    addressLocality: "Makati City",
    addressRegion: "Metro Manila",
    postalCode: "1200",
    addressCountry: "PH",
  },
  geo: { "@type": "GeoCoordinates", latitude: 14.5547, longitude: 121.0244 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "17:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "PHP",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  sameAs: [
    "https://facebook.com/infinitechadvertisingcorporation",
    "https://instagram.com/glimitstudio",
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://g-limitstudio.com" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What photography services does G-Limit Studio offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "G-Limit Studio offers professional photography and videography services including weddings, pre-nuptial shoots, maternity photography, portraits, events, and corporate photography in Makati City and Metro Manila.",
      },
    },
    {
      "@type": "Question",
      name: "Where is G-Limit Studio located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "G-Limit Studio is located at Urban Avenue, Makati City, Metro Manila, Philippines.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer pre-nuptial photography packages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer comprehensive pre-nuptial photography packages with various locations and styling options.",
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const API_IMG = process.env.NEXT_PUBLIC_API_IMG || ""

  return (
    <html lang="en-PH" suppressHydrationWarning>
      <head>
        {/* Preconnect to image API — saves 300–600ms on mobile */}
        {API_IMG && (
          <>
            <link rel="preconnect" href={API_IMG} />
            <link rel="dns-prefetch" href={API_IMG} />
          </>
        )}

        {/* Preconnect to Vercel Analytics */}
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="G-Limit Studio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="G-Limit Studio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Geo */}
        <meta name="geo.region" content="PH-NCR" />
        <meta name="geo.placename" content="Makati City" />
        <meta name="geo.position" content="14.5547;121.0244" />
        <meta name="ICBM" content="14.5547, 121.0244" />

        {/* All schemas in one script tag — fewer parser insertions = faster FCP */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                organizationSchema,
                websiteSchema,
                serviceSchema,
                localBusinessSchema,
                breadcrumbSchema,
                faqSchema,
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PWARegister />
        <PublicLayoutProvider>
          {children}
          <Toaster position="top-right" />
          {/*
            ClientProviders handles all ssr:false dynamic imports.
            Chatbot loads after hydration, never blocks first paint.
          */}
          <ClientProviders />
        </PublicLayoutProvider>
        <Analytics />
      </body>
    </html>
  )
}
