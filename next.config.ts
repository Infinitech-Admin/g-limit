import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = withPWA({
  // ─── TRANSPILE PACKAGES FOR iOS 13 ────────────
  transpilePackages: ['motion', 'react-router-dom', '@radix-ui/react-icons'],

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [390, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/**' },
      { protocol: 'https', hostname: 'infinitech-api15.site', pathname: '/**' },
      { protocol: 'https', hostname: 'www.g-limitstudio.com', pathname: '/**' },
      { protocol: 'https', hostname: 'g-limitstudio.com', pathname: '/**' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy:
      "default-src 'self'; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;",
    unoptimized: false,
  },

  compress: true,
  generateEtags: true,
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['sharp'],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ];
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      'motion',
      '@radix-ui/react-icons',
    ],
  },

  // ─── PWA CONFIG ─────────────────────────────
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    clientsClaim: true,
  },

  // ─── FORCE WEBPACK (disable Turbopack) ────────
  turbopack: {},

  // ─── TRANSPILE PROBLEMATIC LIBS FOR iOS 13 ────
  webpack(config, { isServer }) {
    if (!isServer) {
      const es5Packages = [
        'motion',
        'react-router-dom',
        '@radix-ui/react-icons',
        '@radix-ui/react-accordion',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-navigation-menu',
        '@radix-ui/react-select',
        '@radix-ui/react-tabs',
        '@radix-ui/react-toast',
      ];

      es5Packages.forEach((pkg) => {
        config.module.rules.push({
          test: /\.js$/,
          include: new RegExp(`node_modules[\\/]${pkg.replace('/', '[\\/]')}`),
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'next/babel',
                  {
                    'preset-env': {
                      targets: {
                        ios: '13',
                      },
                      useBuiltIns: 'usage',
                      corejs: 3,
                    },
                  },
                ],
              ],
              compact: false,
            },
          },
        });
      });
    }

    return config;
  },
});

export default nextConfig;
