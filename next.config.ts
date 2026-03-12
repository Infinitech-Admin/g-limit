import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = withPWA({
  // ─── IMAGES ─────────────────────────────────────────
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [390, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/**" },
      { protocol: "https", hostname: "infinitech-api15.site", pathname: "/**" },
      { protocol: "https", hostname: "www.g-limitstudio.com", pathname: "/**" },
      { protocol: "https", hostname: "g-limitstudio.com", pathname: "/**" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;",
    unoptimized: false,
  },

  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["sharp"],

  // ─── HEADERS ────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
          {
            key: "Link",
            value: [
              "<https://infinitech-api15.site>; rel=preconnect; crossorigin",
              "<https://infinitech-api15.site>; rel=dns-prefetch",
            ].join(", "),
          },
        ],
      },
      { source: "/photo/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/:all*(woff|woff2|ttf|otf)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/_next/static/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/_next/image/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000" }] },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" }] },
    ];
  },

  // ─── COMPILER ───────────────────────────────────────
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // ─── EXPERIMENTAL ───────────────────────────────────
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "framer-motion", "@radix-ui/react-icons"],
  },

  // ─── PWA CONFIG ────────────────────────────────────
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,   // immediately activate new SW
    clientsClaim: true,  // control all pages immediately
  },

  // ─── FORCE WEBPACK ──────────────────────────────────
  turbopack: {},  // prevents Turbopack from running -> avoids "Call retries were exceeded"
});

export default nextConfig;
