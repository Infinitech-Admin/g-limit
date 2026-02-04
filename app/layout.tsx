import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { PublicLayoutProvider } from "./providers/layout-context"
import PWARegister from "@/components/PWARegister"
import Chatbot from "@/components/Chatbot"
import { Analytics } from '@vercel/analytics/next'
import {
  defaultMetadata,
  organizationSchema,
  websiteSchema,
  serviceSchema,
} from "@/lib/metadata"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
})

// Enhanced Metadata with comprehensive SEO
export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL('https://g-limitstudio.com'),
  title: {
    default: 'G-Limit Studio | Professional Photography & Videography Services in Makati',
    template: '%s | G-Limit Studio',
  },
  description: 'Premier photography and videography studio in Makati City. Specializing in portraits, events, weddings, pre-nuptial shoots, maternity photography, and more. Professional photography services for all your special moments.',
  keywords: [
    'photography studio Makati',
    'videography services Philippines',
    'wedding photographer Makati',
    'pre-nuptial photography',
    'maternity photography',
    'portrait photography',
    'event photography',
    'professional photographer',
    'G-Limit Studio',
    'Urban Avenue Makati',
    'wedding videography',
    'prenup shoot',
    'buntis photography',
    'corporate photography',
    'photography services Metro Manila',
  ],
  authors: [{ name: 'G-Limit Studio' }],
  creator: 'G-Limit Studio',
  publisher: 'Infinitech Advertising Corporation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'G-Limit Studio',
    startupImage: [
      '/icons/icon-192x192.png',
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://g-limitstudio.com',
    siteName: 'G-Limit Studio',
    title: 'G-Limit Studio | Professional Photography & Videography in Makati',
    description: 'Premier photography and videography studio in Makati City. Specializing in portraits, events, weddings, pre-nuptial shoots, maternity photography, and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'G-Limit Studio - Professional Photography Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'G-Limit Studio | Professional Photography & Videography',
    description: 'Premier photography and videography studio in Makati City. Weddings, portraits, events, and more.',
    images: ['/twitter-image.jpg'],
    creator: '@glimitstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://g-limitstudio.com',
  },
  verification: {
    google: 'pFlfpGXFgh-F0fXiy-8Yd8KqjlbJq_dcbzrNUNxe', // Updated with your verification code
  },
  category: 'Photography & Videography',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

// Enhanced Local Business Schema
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://g-limitstudio.com/#business',
  name: 'G-Limit Studio',
  alternateName: 'Infinitech Advertising Corporation',
  image: 'https://g-limitstudio.com/logo.png',
  logo: 'https://g-limitstudio.com/logo.png',
  description: 'Professional photography and videography studio specializing in portraits, events, weddings, pre-nuptial shoots, maternity photography, and corporate events in Makati City.',
  url: 'https://g-limitstudio.com',
  telephone: '+63-XXX-XXX-XXXX', // Add your phone number
  email: 'info@g-limitstudio.com', // Add your email
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Urban Avenue',
    addressLocality: 'Makati City',
    addressRegion: 'Metro Manila',
    postalCode: '1200', // Add your postal code
    addressCountry: 'PH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 14.5547, // Add your exact coordinates
    longitude: 121.0244,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
  currenciesAccepted: 'PHP',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 14.5547,
      longitude: 121.0244,
    },
    geoRadius: '50000', // 50km radius
  },
  sameAs: [
    'https://facebook.com/infinitechadvertisingcorporation',
    'https://instagram.com/glimitstudio', // Add your social media
    // Add other social media profiles
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography & Videography Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Photography',
          description: 'Professional wedding photography and videography services',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Pre-Nuptial Photography',
          description: 'Creative and romantic pre-wedding photoshoots',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Maternity Photography',
          description: 'Beautiful maternity and pregnancy photography sessions',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Portrait Photography',
          description: 'Professional portrait photography for individuals and families',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Event Photography',
          description: 'Comprehensive event coverage and documentation',
        },
      },
    ],
  },
}

// Breadcrumb Schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://g-limitstudio.com',
    },
  ],
}

// FAQ Schema (add your common questions)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What photography services does G-Limit Studio offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'G-Limit Studio offers professional photography and videography services including weddings, pre-nuptial shoots, maternity photography, portraits, events, and corporate photography in Makati City and Metro Manila.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is G-Limit Studio located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'G-Limit Studio is located at Urban Avenue, Makati City, Metro Manila, Philippines.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer pre-nuptial photography packages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer comprehensive pre-nuptial photography packages with various locations and styling options to capture your love story beautifully.',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-PH" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="G-Limit Studio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="G-Limit Studio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Additional SEO Meta Tags */}
        <link rel="canonical" href="https://g-limitstudio.com" />
        
        {/* Geographic Tags */}
        <meta name="geo.region" content="PH-NCR" />
        <meta name="geo.placename" content="Makati City" />
        <meta name="geo.position" content="14.5547;121.0244" />
        <meta name="ICBM" content="14.5547, 121.0244" />
        
        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.facebook.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PWARegister />
        <PublicLayoutProvider>
          {children}
          <Toaster position="top-right" />
          <Chatbot />
        </PublicLayoutProvider>
        <Analytics />
      </body>
    </html>
  )
}
