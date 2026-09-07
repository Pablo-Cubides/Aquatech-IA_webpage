import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import { ChevronRight, Cpu, Globe2, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { AuthoritativeReferences } from "@/components/seo/AuthoritativeReferences";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");

const homeAuthoritativeSources = [
  {
    title: "Ministerio de Ambiente y Desarrollo Sostenible de Colombia",
    url: "https://www.minambiente.gov.co/",
    source: "MinAmbiente (.gov.co)",
    description: "Normatividad, gobernanza y gestión integral del recurso hídrico en Colombia.",
  },
  {
    title: "Instituto de Hidrología, Meteorología y Estudios Ambientales",
    url: "http://www.ideam.gov.co/",
    source: "IDEAM (.gov.co)",
    description: "Datos científicos abiertos, calidad del agua y series temporales climáticas.",
  },
  {
    title: "U.S. Geological Survey - Water Resources Mission Area",
    url: "https://www.usgs.gov/",
    source: "USGS (.gov)",
    description: "Metodologías de análisis hidrográfico y monitoreo de cuencas en tiempo real.",
  },
  {
    title: "Stanford Artificial Intelligence & NLP Group",
    url: "https://nlp.stanford.edu/",
    source: "Stanford University (.edu)",
    description: "Investigación fundamental en modelos de lenguaje y arquitecturas de atención.",
  },
  {
    title: "United Nations Environment Programme (UNEP)",
    url: "https://www.unep.org/es",
    source: "UNEP (ONU)",
    description: "Directrices globales para la sostenibilidad hídrica y mitigación ambiental.",
  },
];

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-noto",
});

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
    locale: "es_ES",
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
    <main
      className={`${notoSans.variable} ${spaceGrotesk.variable} min-h-screen relative overflow-x-hidden bg-black text-white`}
    >
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
      <div className="relative z-20 flex flex-col items-center justify-center px-4 py-12 md:py-16">
        {/* Encabezado principal (H1 SEO + GEO Direct Answer) */}
        <div className="text-center mb-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1
            className="text-sm md:text-base text-gray-300 font-bold tracking-widest uppercase mb-3"
            style={{ fontFamily: "var(--font-space)" }}
          >
            AquatechIA — Inteligencia Artificial y Gestión Ambiental Sostenible
          </h1>
          <p
            className="text-sm md:text-base text-gray-300 leading-relaxed font-normal"
            data-geo-summary="true"
          >
            Plataforma integral y ecosistema tecnológico para la monitorización ambiental, recursos hídricos y modelos generativos de inteligencia artificial aplicados a la sostenibilidad global.
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
                className="object-contain drop-shadow-2xl animate-in zoom-in duration-700 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64"
                priority
              />
              {/* Glow effect alrededor del logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tarjetas de portales */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6">
          {/* Portal IA */}
          <Link
            href="/ia"
            aria-label="Ir al portal de Inteligencia Artificial"
            className="group relative h-48 sm:h-64 md:h-80 lg:h-[320px] overflow-hidden rounded-2xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-200"
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/technology-hero.jpg"
                alt="Tecnología e Inteligencia Artificial"
                fill
                quality={85}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/50 transition-all duration-500" />
              {/* Textura */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, transparent 2px, transparent 10px)`,
                }}
              />
            </div>

            {/* Contenido */}
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Inteligencia
                <br />
                Artificial
              </h2>

              <p className="text-gray-300 text-base mb-6 max-w-sm group-hover:text-gray-100 transition-colors duration-300">
                Modelos generativos e IA para transformar tu día a día
              </p>

              <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-4 transition-all duration-300">
                <span>Explorar portal</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Decoración */}
              <div className="absolute top-6 right-6 w-24 h-24 border border-cyan-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
              <div className="absolute bottom-6 left-6 w-20 h-20 border border-blue-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 delay-100" />
            </div>
          </Link>

          {/* Portal Ambiental */}
          <Link
            href="/ambiental"
            aria-label="Ir al portal de Gestión Ambiental"
            className="group relative h-48 sm:h-64 md:h-80 lg:h-[320px] overflow-hidden rounded-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-200"
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/mountains-hero.jpg"
                alt="Gestión Ambiental Sostenible"
                fill
                quality={85}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Overlay claro */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/40 to-white/20 group-hover:from-white/70 group-hover:via-white/50 transition-all duration-500" />
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
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors duration-300"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Gestión
                <br />
                Ambiental
              </h2>

              <p className="text-gray-700 text-base mb-6 max-w-sm group-hover:text-gray-900 transition-colors duration-300">
                Mapas, normas y herramientas para un planeta sostenible
              </p>

              <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all duration-300">
                <span>Explorar portal</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Decoración */}
              <div className="absolute top-6 left-6 w-24 h-24 border border-green-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
              <div className="absolute bottom-6 right-6 w-20 h-20 border border-blue-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 delay-100" />
            </div>
          </Link>
        </div>

        {/* Sección de Contenido Ecosistema Tecnológico (GEO + Content) */}
        <section
          aria-labelledby="ecosistema-heading"
          className="w-full max-w-6xl mx-auto mt-16 pt-12 border-t border-gray-800 animate-in fade-in duration-1000 delay-300"
        >
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2
              id="ecosistema-heading"
              className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-white to-emerald-400 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Convergencia entre Inteligencia Artificial y Gestión Hídrica Sostenible
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              AquatechIA nace como una iniciativa científico-tecnológica para cerrar la brecha entre la ciencia de datos avanzada y la toma de decisiones ambientales en el mundo real. Nuestro ecosistema articula herramientas de código abierto, visores cartográficos interactivos y módulos de machine learning aplicados a la modelación de cuencas, predicción de contaminantes y gobernanza de los recursos naturales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-950/70 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Modelos de IA Educativos y Productivos</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Visualizadores interactivos de mecanismos de atención en Transformers, exploración de hiperparámetros de muestreo (Temperatura, Top-k, Top-p) y arquitecturas de agentes autónomos que optimizan flujos técnicos y académicos.
              </p>
            </div>

            <div className="bg-gray-950/70 border border-emerald-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Geovisores y Analítica Ambiental Abierta</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Integración de macro-datos satelitales y de sensores en tiempo real (NASA FIRMS, USGS Earthquake Hazards, OpenAQ, GBIF y Water Quality Portal) para el diagnóstico territorial, monitoreo de cuencas y alertas tempranas.
              </p>
            </div>

            <div className="bg-gray-950/70 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Rigor Científico y Cumplimiento Normativo</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Calculadoras especializadas de calidad del agua (IRCA, ICA), matrices de evaluación de impacto ambiental (Leopold y Conesa) y compendio estructurado de normativas ambientales bajo estándares colombianos e internacionales.
              </p>
            </div>
          </div>

          {/* Fuentes y Referencias Autoritativas (GEO) */}
          <AuthoritativeReferences
            sources={homeAuthoritativeSources}
            title="Fuentes Científicas y Organismos Oficiales de Referencia"
            subtitle="El ecosistema AquatechIA alinea sus metodologías con las siguientes entidades y bases de datos institucionales:"
            theme="dark"
          />
        </section>

        {/* Footer minimalista */}
        <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500 w-full max-w-4xl">
          <p className="text-xs text-gray-500 mb-3">
            © 2025 Aquatech IA · Innovación en cada gota
          </p>
          <nav aria-label="Enlaces rápidos" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
            <Link href="/ia/herramientas" className="hover:text-cyan-400 transition-colors">Herramientas IA</Link>
            <Link href="/ia/blog" className="hover:text-cyan-400 transition-colors">Blog IA</Link>
            <Link href="/ambiental/herramientas" className="hover:text-green-500 transition-colors">Normas y Mapas</Link>
            <Link href="/ambiental/blog" className="hover:text-green-500 transition-colors">Blog Ambiental</Link>
            <Link href="/ambiental/productos" className="hover:text-green-500 transition-colors">Recursos Ambientales</Link>
            <span className="text-gray-600">|</span>
            <Link href="/ia/privacy" className="hover:text-cyan-400 transition-colors">Políticas de Privacidad</Link>
            <Link href="/ia/terms" className="hover:text-cyan-400 transition-colors">Términos de Servicio</Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
