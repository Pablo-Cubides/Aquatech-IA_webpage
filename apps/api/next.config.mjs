/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  // Turbopack is default in Next.js 16, set empty config to silence warning
  turbopack: {},

  // Transpile packages from the monorepo
  transpilePackages: ["@ia-next/database"],

  // Only needed for API routes
  async rewrites() {
    return [
      {
        source: "/health",
        destination: "/api/health",
      },
    ];
  },
};

export default nextConfig;
