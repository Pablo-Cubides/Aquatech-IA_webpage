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

  // Environment variables to expose to client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image configuration
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
    ],
  },
};

export default nextConfig;
