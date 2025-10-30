/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable server actions if not using them yet
    serverActions: {
      allowedOrigins: [],
    },
  },
  typescript: {
    // Set to false to enable strict TypeScript checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set to false to enable ESLint during builds
    ignoreDuringBuilds: false,
  },

  // Transpile packages from the monorepo
  transpilePackages: ["@ia-next/ui", "@ia-next/database"],

  // Environment variables to expose to client (only non-sensitive)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image configuration with security
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security headers (additional to middleware)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ia/home",
        destination: "/ia",
        permanent: true,
      },
      {
        source: "/ambiental/home",
        destination: "/ambiental",
        permanent: true,
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
