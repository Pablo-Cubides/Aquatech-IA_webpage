import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "AquatechIA - Inteligencia Artificial + Gestión Ambiental Sostenible",
  description:
    "Plataforma educativa de inteligencia artificial y gestión ambiental. Herramientas, cursos y recursos especializados. Modelos generativos, análisis ambiental, sostenibilidad para profesionales.",
  keywords: [
    "inteligencia artificial",
    "gestión ambiental",
    "IA",
    "sostenibilidad",
    "herramientas IA",
    "modelos generativos",
    "agua sostenible",
    "tecnología ambiental",
    "cursos ambientales",
  ],
  openGraph: {
    title: "AquatechIA - IA + Gestión Ambiental",
    description:
      "Plataforma educativa de inteligencia artificial para la gestión ambiental sostenible. Herramientas, cursos y recursos.",
    type: "website",
    locale: "es_CO",
    url: baseUrl,
    siteName: "AquatechIA",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "AquatechIA - IA + Gestión Ambiental Sostenible",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AquatechIA - IA + Gestión Ambiental",
    description:
      "Inteligencia Artificial y Gestión Ambiental Sostenible. Herramientas y Cursos Educativos.",
    images: [`${baseUrl}/images/og-image.jpg`],
    creator: "@aquatechia",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function Home() {
  const currentYear = new Date().getFullYear();

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AquatechIA",
    url: baseUrl,
    description:
      "Plataforma educativa de inteligencia artificial y gestión ambiental sostenible.",
    datePublished: "2024-01-01",
    dateModified: "2026-09-06",
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo-aquatech.png`,
      },
    },
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-black text-white flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      {/* Fondo dividido con texturas - oculto en móvil */}
      <div className="absolute inset-0 hidden lg:flex pointer-events-none">
        {/* Lado Negro (IA) */}
        <div className="w-1/2 bg-black relative overflow-hidden">
          {/* Textura grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 40px),
                               repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 40px)`,
            }}
          />
          {/* Efectos de luz */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Lado Blanco (Ambiental) */}
        <div className="w-1/2 bg-white relative overflow-hidden">
          {/* Textura dots */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
          {/* Efectos de luz */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Fondo móvil: gradiente unificado */}
      <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-black via-gray-900 to-gray-950 pointer-events-none">
        {/* Efectos de luz sutiles para móvil */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Línea divisoria vertical central con efecto glow - oculta en móvil */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent transform -translate-x-1/2 z-10 hidden lg:block pointer-events-none">
        <div className="absolute inset-0 w-2 -ml-[3px] bg-gradient-to-b from-transparent via-white/50 to-transparent blur-sm" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-20 flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12">
        {/* Encabezado principal en contenedor glassmorphic para contraste perfecto en ambos lados */}
        <div className="text-center mb-6 max-w-2xl mx-auto px-6 py-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1
            className="text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase mb-2 bg-gradient-to-r from-cyan-400 via-white to-emerald-400 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-space)" }}
          >
            AquatechIA — Inteligencia Artificial y Gestión Ambiental
          </h1>
          <p
            className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal"
            data-geo-summary="true"
          >
            Ecosistema de soluciones tecnológicas aplicadas a la sostenibilidad, recursos hídricos y modelos generativos. Selecciona tu portal para comenzar.
          </p>
        </div>

        {/* Logo principal */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/images/logo-aquatech.png"
                alt="Aquatech IA"
                width={280}
                height={280}
                className="object-contain drop-shadow-2xl animate-in zoom-in duration-700 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-56 lg:h-56"
                priority
              />
              {/* Glow effect alrededor del logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tarjetas de selección de portales */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Portal IA */}
          <Link
            href="/ia"
            aria-label="Ingresar al portal de Inteligencia Artificial"
            className="group relative h-52 sm:h-64 md:h-72 lg:h-[300px] overflow-hidden rounded-2xl border border-cyan-500/30 hover:border-cyan-400 shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200"
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/technology-hero.jpg"
                alt="Tecnología e Inteligencia Artificial"
                fill
                quality={85}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30 group-hover:from-black/90 group-hover:via-black/60 transition-all duration-500" />
              {/* Textura */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, transparent 2px, transparent 10px)`,
                }}
              />
            </div>

            {/* Contenido */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400 mb-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                Portal Tecnológico
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Inteligencia
                <br />
                Artificial
              </h2>

              <p className="text-gray-300 text-sm mb-6 max-w-sm group-hover:text-gray-100 transition-colors duration-300">
                Modelos generativos, herramientas y formación aplicada a la analítica avanzada.
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-400 text-black font-semibold text-sm group-hover:bg-cyan-300 group-hover:shadow-[0_0_20px_rgba(0,239,255,0.4)] transition-all duration-300">
                <span>Explorar portal IA</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          {/* Portal Ambiental */}
          <Link
            href="/ambiental"
            aria-label="Ingresar al portal de Gestión Ambiental"
            className="group relative h-52 sm:h-64 md:h-72 lg:h-[300px] overflow-hidden rounded-2xl border border-emerald-500/40 hover:border-emerald-500 shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200"
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/mountains-hero.jpg"
                alt="Gestión Ambiental Sostenible"
                fill
                quality={85}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Overlay suave para legibilidad premium */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-white/60 group-hover:from-white/98 group-hover:via-white/85 transition-all duration-500" />
              {/* Textura */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,119,182,0.3) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Contenido */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300">
                Portal Sostenibilidad
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-950 group-hover:text-emerald-700 transition-colors duration-300"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Gestión
                <br />
                Ambiental
              </h2>

              <p className="text-gray-700 text-sm mb-6 max-w-sm group-hover:text-gray-900 transition-colors duration-300">
                Mapas interactivos, normas, matrices de impacto y calidad del agua.
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold text-sm group-hover:bg-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                <span>Explorar portal Ambiental</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer minimalista unificado */}
      <footer className="relative z-20 py-6 text-center border-t border-gray-800/80 bg-black/60 backdrop-blur-sm w-full">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs text-gray-400 mb-3 font-medium">
            © {currentYear} AquatechIA · Inteligencia Artificial y Gestión Ambiental Sostenible
          </p>
          <nav aria-label="Enlaces rápidos" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
            <Link href="/ia/herramientas" className="hover:text-cyan-400 transition-colors">Herramientas IA</Link>
            <Link href="/ia/blog" className="hover:text-cyan-400 transition-colors">Blog IA</Link>
            <Link href="/ambiental/herramientas" className="hover:text-emerald-400 transition-colors">Normas y Mapas</Link>
            <Link href="/ambiental/blog" className="hover:text-emerald-400 transition-colors">Blog Ambiental</Link>
            <Link href="/ambiental/productos" className="hover:text-emerald-400 transition-colors">Recursos Ambientales</Link>
            <span className="text-gray-600">|</span>
            <Link href="/ia/privacy" className="hover:text-cyan-400 transition-colors">Políticas de Privacidad</Link>
            <Link href="/ia/terms" className="hover:text-cyan-400 transition-colors">Términos de Servicio</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
