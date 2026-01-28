import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Option 1: Use a custom loader to bypass Next.js optimization entirely
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
    
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
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
