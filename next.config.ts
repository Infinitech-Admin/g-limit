import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 🔹 Local development (Laravel / API)
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

      // 🔹 Production API
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
    ],

    // Disable image optimization only in development
    unoptimized: process.env.NODE_ENV === 'development',

    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
