/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

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
