import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // IMPORTANT: Remove custom loader to enable Next.js image optimization
    // Custom loaders bypass Next.js optimization which is causing your 20MB image problem
    // loader: 'custom', // ❌ REMOVED - This was preventing optimization
    // loaderFile: './lib/imageLoader.ts', // ❌ REMOVED
    
    // Modern image formats - AVIF first for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Optimized device sizes - tailored to your actual breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    
    // Optimized image sizes for thumbnails and small images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // PERFORMANCE: 1 year cache for static images
    minimumCacheTTL: 31536000, // 1 year
    
    remotePatterns: [
      // 🔹 Local development (Laravel / API)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**', // Simplified - covers all paths
      },
      
      // 🔹 Production API - Consolidated patterns
      {
        protocol: 'https',
        hostname: 'infinitech-api15.site',
        pathname: '/**', // Simplified - covers all paths
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
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // CRITICAL: Disable unoptimized images - forces Next.js optimization
    unoptimized: false,
  },
  
  // PERFORMANCE: Enable compression
  compress: true,
  
  // PERFORMANCE: Generate ETags for better caching
  generateEtags: true,
  
  // PERFORMANCE: Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // PERFORMANCE: PoweredByHeader adds unnecessary bytes
  poweredByHeader: false,
  
  // Security and caching headers
  async headers() {
    return [
      // Preconnect to API domain for faster requests
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '<https://infinitech-api15.site>; rel=preconnect; crossorigin',
          },
        ],
      },
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
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      // PERFORMANCE: Aggressive caching for static assets (1 year)
      {
        source: '/photo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // PERFORMANCE: Cache fonts (1 year)
      {
        source: '/:all*(woff|woff2|ttf|otf)',
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
      // PERFORMANCE: Cache optimized images (1 year)
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes - short cache with revalidation
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  
  // Compiler options
  compiler: {
    // PERFORMANCE: Remove console.log in production
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
      '@radix-ui/react-icons',
    ],
    
    // PERFORMANCE: Enable optimized CSS (removes unused CSS)
    optimizeCss: true,
    
    // PERFORMANCE: Optimize server components
    serverComponentsExternalPackages: ['sharp'],
  },
};

export default nextConfig;
