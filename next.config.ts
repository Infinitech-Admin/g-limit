import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Custom loader to bypass Next.js optimization
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
    
    // Modern image formats - now optimized order (AVIF first, smaller files)
    formats: ['image/avif', 'image/webp'],
    
    // Optimized device sizes - removed duplicates, sorted
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    
    // Optimized image sizes for thumbnails and small images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // PERFORMANCE: Increased cache TTL from 60s to 1 year for static images
    // This dramatically improves repeat visit performance
    minimumCacheTTL: 31536000, // 1 year (60 seconds was too short)
    
    remotePatterns: [
      // 🔹 Local development (Laravel / API) - All image paths
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/film-strip/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/post_images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/categories/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/news/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/portfolio/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/medical-assistance-documents/**',
      },
      
      // 🔹 Production API - All image paths
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/film-strip/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/post_images/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/categories/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/news/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/portfolio/**',
      },
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/medical-assistance-documents/**',
      },
      
      // 🔹 G-Limit Studio domains
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
  },
  
  // PERFORMANCE: Enable Gzip/Brotli compression
  compress: true,
  
  // PERFORMANCE: Generate ETags for better caching
  generateEtags: true,
  
  // PERFORMANCE: Disable source maps in production (faster builds, smaller files)
  productionBrowserSourceMaps: false,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // PERFORMANCE: Use SWC minifier (faster than Terser)
  swcMinify: true,
  
  // TURBOPACK: Empty config to silence the warning (Turbopack is enabled by default in Next.js 16)
  turbopack: {},
  
  // Security and caching headers
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http://localhost:8000 https://infinitech-api15.site https://g-limitstudio.com https://www.g-limitstudio.com; font-src 'self' data:; connect-src 'self' http://localhost:8000 https://infinitech-api15.site; media-src 'self' http://localhost:8000 https://infinitech-api15.site; frame-ancestors 'self';",
          },
        ],
      },
      // PERFORMANCE: Aggressive caching for static assets (1 year)
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // PERFORMANCE: Cache Next.js static files (1 year)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // PERFORMANCE: Preconnect to API
      {
        source: '/portfolio',
        headers: [
          {
            key: 'Link',
            value: '<http://localhost:8000>; rel=preconnect',
          },
        ],
      },
    ];
  },
  
  // Compiler options
  compiler: {
    // PERFORMANCE: Remove console.log in production (smaller bundle)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // PERFORMANCE: Experimental features for better performance
  experimental: {
    // Enable optimized package imports (tree-shaking)
    optimizePackageImports: [
      'lucide-react', 
      'react-icons',
      'framer-motion',
    ],
    
    // PERFORMANCE: Enable optimized CSS (removes unused CSS)
    optimizeCss: true,
  },
};

export default nextConfig;
