import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
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
    // ✅ Keep false — you want Next.js image optimization (avif/webp conversion + resizing)
    // Setting true would bypass optimization and serve raw originals = larger files = slower
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
        // ✅ Preconnect to API on ALL pages, not just "/"
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options',       value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // ✅ Added preconnect for API on every page (was only on "/" before)
          {
            key: 'Link',
            value: '<https://infinitech-api15.site>; rel=preconnect; crossorigin',
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
        source: '/_next/image/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // ✅ Reduced stale-while-revalidate — 86400s (24h) is too long for ambassador data
        // that might be updated. 300s revalidation is safer.
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
  },
};

export default nextConfig;
