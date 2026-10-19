import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trace files from monorepo root
  outputFileTracingRoot: path.join(__dirname, "../../"),

  // Exclude large client assets, coverage, and heavy media files from serverless functions
  outputFileTracingExcludes: {
    "*": [
      "./public/**",
      "./coverage/**",
      "**/.git/**",
      "**/coverage/**",
      "**/public/static/**",
      "**/public/images/**",
      "**/components/static/cases/**",
      "**/visor-cases/**",
      "**/*.gif",
      "**/*.png",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.mp3",
      "node_modules/@prisma/engines/**",
      "node_modules/prisma/**",
    ],
  },

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

  // Transpile packages from the monorepo
  // Note: '@ia-next/database' is intentionally NOT transpiled here because
  // it provides a runtime JS entry in packages/@ia-next/database/dist which
  // Next should import directly. Transpiling the package forces Next to
  // resolve TypeScript source which can cause module resolution errors.
  transpilePackages: ["@ia-next/ui"],

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
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "aquatechia.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentDispositionType: "inline",
    contentSecurityPolicy:
      "default-src 'self'; img-src 'self' https: data:; font-src 'self' https: data:;",
  },

  // Security headers (additional to middleware)
  async headers() {
    return [
      // Herramientas personales de clase (aula-score, consulta-nota, proyectos-investigacion, ruleta-academica): se usan por enlace
      // directo y existen una vez por portal con distinto tema, asi que no deben competir en Google (2026-10-19). Siguen
      // funcionando igual y sus visitas siguen contando en las estadisticas.
      {
        source: "/:portal(ia|ambiental)/autor/herramientas/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
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
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), payment=(self)",
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
      // Las guias de /guia/* eran paginas delgadas (150-360 palabras) que duplicaban la herramienta: ahora su texto vive en la
      // propia pagina de la herramienta y estas URL redirigen con 301 (2026-10-19).
      { source: "/guia/normas-ambientales", destination: "/ambiental/herramientas/normas-ambientales", permanent: true },
      { source: "/guia/indice-calidad-agua", destination: "/ambiental/herramientas/indice-calidad-agua", permanent: true },
      { source: "/guia/indice-calidad-aire", destination: "/ambiental/herramientas/indice-calidad-aire", permanent: true },
      { source: "/guia/generador-matrices", destination: "/ambiental/herramientas/generador-matrices", permanent: true },
      { source: "/guia/como-funcionan-llm", destination: "/ia/herramientas/como-funcionan-llm", permanent: true },
      { source: "/guia/parametros-decodificacion", destination: "/ia/herramientas/parametros-decodificacion", permanent: true },
      { source: "/guia/filtrado-ia", destination: "/ia/herramientas/filtrado-ia", permanent: true },
      { source: "/guia/visor-difusion", destination: "/ia/herramientas/visor-difusion", permanent: true },
      { source: "/guia/papers-ia", destination: "/ia/herramientas/papers-ia", permanent: true },
      { source: "/guia/modelos-tendencia", destination: "/ia/herramientas/modelos-tendencia", permanent: true },
      { source: "/guia/ecostats", destination: "/ambiental/herramientas/analisis-correlaciones", permanent: true },
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
      // Author tools - consolidate to IA portal (301 redirects)
      {
        source: "/ambiental/autor/herramientas/ruleta-academica",
        destination: "/ia/autor/herramientas/ruleta-academica",
        permanent: true,
      },
      {
        source: "/ambiental/autor/herramientas/genealogia-app",
        destination: "/ia/autor/herramientas/genealogia-app",
        permanent: true,
      },
      {
        source: "/ambiental/autor/herramientas/visualizador-notas",
        destination: "/ia/autor/herramientas/visualizador-notas",
        permanent: true,
      },
      // Coach Salud Personal (Integration in IA portal)
      {
        source: "/coach-salud",
        destination: "/ia/coach-salud",
        permanent: true,
      },
      {
        source: "/coach-salud/privacidad",
        destination: "/ia/coach-salud/privacidad",
        permanent: true,
      },
      {
        source: "/coach-salud/terminos",
        destination: "/ia/coach-salud/terminos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
