import type { Metadata } from 'next';

// Site Configuration
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glimitstudio.com';
const siteName = 'G-Limit Studio';
const companyName = 'Infinitech Advertising Corporation';
const siteDescription = 'Professional photography and videography studio in Makati City, Metro Manila. Specializing in weddings, pre-nuptial shoots, maternity photography (buntis), portraits, events, and corporate photography. Capturing your special moments with elegance and creativity.';

export const siteConfig = {
  name: siteName,
  company: companyName,
  description: siteDescription,
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.jpg`,
  links: {
    facebook: 'https://www.facebook.com/people/G-Limit-Studio/61587225507593/#',
    instagram: 'https://www.instagram.com/g.limitstudioph?igsh=MXA3YzhuaTFmNnNudA%3D%3D',
    twitter: '@glimitstudio',
  },
  contact: {
    phone: '+63-945-675-4591',
    email: 'g.limitstudio@gmail.com',
    address: {
      street: 'Urban Avenue',
      city: 'Makati City',
      region: 'Metro Manila',
      postal: '1200',
      country: 'Philippines',
    },
    coordinates: {
      lat: 14.5547,
      lng: 121.0244,
    },
  },
};

// Default Metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Professional Photography & Videography in Makati`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    // Location-based keywords
    'photography studio Makati',
    'photographer Makati City',
    'videography Makati',
    'photography services Metro Manila',
    'photographer Philippines',
    
    // Service-based keywords
    'wedding photography',
    'wedding photographer Makati',
    'prenuptial photography',
    'prenup photoshoot',
    'pre-nuptial photography Manila',
    'maternity photography',
    'buntis photography',
    'pregnancy photoshoot',
    'portrait photography',
    'family portraits',
    'event photography',
    'corporate photography',
    'product photography',
    'professional photographer',
    
    // Specific services
    'wedding videography',
    'same day edit',
    'church wedding photography',
    'garden wedding photography',
    'debut photography',
    'birthday photography',
    'corporate events photography',
    
    // Quality indicators
    'professional photography services',
    'affordable photographer Makati',
    'best photographer Metro Manila',
    'photography packages',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: companyName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: siteUrl,
    siteName,
    title: `${siteName} | Professional Photography & Videography in Makati`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Professional Photography & Videography Services`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Professional Photography & Videography`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
  },
  // ✅ FIXED: Correct Google verification code. Yandex removed (not relevant for PH market).
  verification: {
    google: 'pFIfpGXFgh-F0fXiy-8Yd8KqjlbJq_dcbzrNUNxexlw',
  },
  category: 'Photography & Videography',
};

// JSON-LD Structured Data for Organization
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  alternateName: companyName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/og-image.jpg`,
  description: siteDescription,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.contact.address.street,
    addressLocality: siteConfig.contact.address.city,
    addressRegion: siteConfig.contact.address.region,
    postalCode: siteConfig.contact.address.postal,
    addressCountry: 'PH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: siteConfig.contact.coordinates.lat,
    longitude: siteConfig.contact.coordinates.lng,
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
  sameAs: [
    siteConfig.links.facebook,
    siteConfig.links.instagram,
    `https://twitter.com/${siteConfig.links.twitter.replace('@', '')}`,
  ].filter(Boolean),
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Makati City',
    },
    {
      '@type': 'City',
      name: 'Metro Manila',
    },
    {
      '@type': 'Country',
      name: 'Philippines',
    },
  ],
};

// JSON-LD for Local Business (more specific than ProfessionalService)
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#localbusiness`,
  name: siteName,
  alternateName: companyName,
  image: `${siteUrl}/logo.png`,
  logo: `${siteUrl}/logo.png`,
  description: siteDescription,
  url: siteUrl,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.contact.address.street,
    addressLocality: siteConfig.contact.address.city,
    addressRegion: siteConfig.contact.address.region,
    postalCode: siteConfig.contact.address.postal,
    addressCountry: 'PH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: siteConfig.contact.coordinates.lat,
    longitude: siteConfig.contact.coordinates.lng,
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
  paymentAccepted: 'Cash, Credit Card, Bank Transfer, GCash',
  sameAs: [
    siteConfig.links.facebook,
    siteConfig.links.instagram,
  ].filter(Boolean),
};

// JSON-LD for Website
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: siteDescription,
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
  inLanguage: 'en-PH',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// JSON-LD for Breadcrumb List (use on specific pages)
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.url}`,
  })),
});

// Enhanced Service Schema with all photography services
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Photography & Videography',
  provider: {
    '@id': `${siteUrl}/#organization`,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Makati City',
    },
    {
      '@type': 'City',
      name: 'Metro Manila',
    },
    {
      '@type': 'Country',
      name: 'Philippines',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography & Videography Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Wedding Photography & Videography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Wedding Photography Package',
              description: 'Full-day wedding coverage with professional photographers',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Wedding Videography Package',
              description: 'Cinematic wedding videos with same-day edit',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Pre-Nuptial Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Pre-Nuptial Photography Session',
              description: 'Creative and romantic pre-wedding photoshoots',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Maternity Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Maternity Photography Session',
              description: 'Beautiful pregnancy and maternity photography',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Portrait Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Portrait Photography Session',
              description: 'Professional portraits for individuals and families',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Event Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Event Photography Coverage',
              description: 'Corporate events, birthdays, debuts, and celebrations',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Corporate Photography',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Corporate Photography Services',
              description: 'Headshots, team photos, and corporate events',
            },
          },
        ],
      },
    ],
  },
};

// FAQ Schema for rich snippets
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What photography services does G-Limit Studio offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'G-Limit Studio offers professional photography and videography services including wedding photography and videography, pre-nuptial shoots, maternity photography (buntis), portrait photography, event photography, and corporate photography in Makati City and throughout Metro Manila.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is G-Limit Studio located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'G-Limit Studio is located at Urban Avenue, Makati City, Metro Manila, Philippines. We serve clients throughout Metro Manila and surrounding areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer pre-nuptial photography packages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer comprehensive pre-nuptial photography packages with various locations, styling options, and creative concepts to capture your love story beautifully before your wedding day.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas do you serve for photography services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We primarily serve Makati City and Metro Manila, including Manila, Quezon City, Pasig, Taguig, Mandaluyong, and surrounding areas. We also accommodate bookings in nearby provinces.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide maternity photography services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we specialize in maternity photography (buntis photography), creating beautiful and memorable photos during your pregnancy journey. We offer studio and outdoor sessions with various styling options.',
      },
    },
  ],
};

// Helper function to generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  path = '',
  images,
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;
  
  return {
    title,
    description,
    keywords: keywords || defaultMetadata.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: images || [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_PH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images?.map((img) => img.url) || [`${siteUrl}/og-image.jpg`],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

// Helper function to generate service-specific schema
export function generateServiceSchema(service: {
  name: string;
  description: string;
  price?: string;
  image?: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    provider: {
      '@type': 'LocalBusiness',
      name: siteName,
      image: `${siteUrl}/logo.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.contact.address.street,
        addressLocality: siteConfig.contact.address.city,
        addressRegion: siteConfig.contact.address.region,
        postalCode: siteConfig.contact.address.postal,
        addressCountry: 'PH',
      },
      telephone: siteConfig.contact.phone,
    },
    description: service.description,
    areaServed: [
      {
        '@type': 'City',
        name: 'Makati City',
      },
      {
        '@type': 'City',
        name: 'Metro Manila',
      },
    ],
    ...(service.url && {
      url: `${siteUrl}${service.url}`,
    }),
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'PHP',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(service.image && {
      image: service.image,
    }),
  };
}

// Helper to generate review/rating schema
export function generateReviewSchema(reviews: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${siteName} Photography Services`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: reviews.length.toString(),
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
      },
    })),
  };
}
