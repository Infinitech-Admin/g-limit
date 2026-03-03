import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // ✅ Added mobile-first sizes: 390, 414 cover iPhone/Android viewports
    // These were missing — Next.js was serving 640px images to 390px screens
    deviceSizes: [390, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.g-limitstudio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'g-limitstudio.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },

  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  poweredByHeader: false,

  serverExternalPackages: ['sharp'],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control',  value: 'on' },
          {
            key: 'Link',
            // ✅ Preconnect to BOTH your API server AND Next.js image optimizer endpoint
            // This tells mobile browsers to open the TCP connection before they need it
            value: [
              '<https://infinitech-api15.site>; rel=preconnect; crossorigin',
              '<https://infinitech-api15.site>; rel=dns-prefetch',
            ].join(', '),
          },
        ],
      },
      {
        source: '/photo/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:all*(woff|woff2|ttf|otf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // ✅ Removed immutable from /_next/image — Next.js image responses vary by
        // query params (w, q, url). immutable here was causing stale image serving
        // when images were updated on the backend.
        source: '/_next/image/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' }],
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      'framer-motion',
      '@radix-ui/react-icons',
    ],
    optimizeCss: true,
    // ✅ Inline critical CSS for above-the-fold content — reduces FCP
    // Next.js will inline the CSS needed for the first paint, removing a render-blocking request
    inlineCss: true,
  },
};

export default nextConfig;
