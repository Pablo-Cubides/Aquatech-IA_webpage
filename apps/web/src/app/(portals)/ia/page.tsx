import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedIATools } from "@/lib/ia-tools";
import { getLatestIAArticles } from "@/lib/new-blog-articles";

export const metadata: Metadata = {
  title: "IA Portal - Inteligencia Artificial aplicada al agua y al ambiente",
  description:
    "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.",
  keywords: [
    "inteligencia artificial",
    "agua",
    "medio ambiente",
    "modelos generativos",
    "visualizaciones",
    "herramientas IA",
  ],
  openGraph: {
    title: "IA Portal - Inteligencia Artificial aplicada al agua y al ambiente",
    description:
      "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA Portal - Inteligencia Artificial aplicada al agua y al ambiente",
    description:
      "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.",
  },
};

export default function IAPage() {
  const portalSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "IA Portal - AquatechIA",
    url: "https://aquatechia.com/ia",
    description: "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y medio ambiente.",
    publisher: {
      "@type": "Organization",
      name: "AquatechIA"
    }
  };

  return (
    <div className="bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portalSchema) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen lg:h-screen flex items-center text-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/technology-hero.jpg')" }}
        >
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl">
            {/* Logo */}
            <div className="mb-12 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
              <img
                src="/images/logo-aquatech.png"
                alt="Aquatech IA Logo"
                className="h-32 w-auto sm:h-40 md:h-48 lg:h-64 object-contain drop-shadow-[0_0_30px_rgba(0,239,255,0.7)]"
              />
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold text-white animate-in fade-in slide-in-from-top-6 duration-700 delay-150"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Inteligencia Artificial aplicada al agua y al ambiente
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[#E0E0E0] animate-in fade-in slide-in-from-top-8 duration-700 delay-300">
              Explora modelos generativos, visualizaciones y herramientas
              prácticas.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <Link href="/ia/herramientas" className="rounded-lg bg-cyan-400 px-8 py-3 text-base font-bold text-black transition-all duration-300 ease-out hover:bg-white hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 hover:scale-105 active:translate-y-0">
                Explorar herramientas
              </Link>
              <Link href="/ia/blog" className="rounded-lg border-2 border-cyan-400 px-8 py-3 text-base font-bold text-cyan-400 backdrop-blur-sm bg-black/30 transition-all duration-300 ease-out hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1 hover:scale-105 active:translate-y-0">
                Conocer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <div>
            <h2
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Nosotros
            </h2>
            <p className="mt-4 text-lg text-[#CCCCCC]">
              Aquatech IA se dedica a aprovechar la inteligencia artificial para
              abordar desafíos ambientales críticos. Nuestra misión es
              proporcionar soluciones innovadoras para la gestión del agua y el
              medio ambiente, fomentando un futuro sostenible a través de la
              tecnología.
            </p>
            <Link href="/ia/nosotros" aria-label="Conocer más sobre nosotros" className="mt-8 inline-block rounded-lg border border-cyan-400 px-6 py-2 font-medium text-cyan-400 transition-all duration-300 ease-out hover:bg-cyan-400 hover:text-black hover:-translate-y-1">
              Conoce más sobre nosotros
            </Link>
          </div>

          <div className="flex justify-center">
            <img
              alt="Innovación en IA Ambiental"
              className="h-auto w-full max-w-md rounded-2xl object-cover shadow-lg transition-transform duration-300 hover:scale-105"
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=400&fit=crop&crop=center"
            />
          </div>
        </div>
      </section>

      {/* Herramientas */}
      <section id="herramientas" className="bg-[#10111A] py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Herramientas (IA)
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {getFeaturedIATools(3).map((tool) => (
              <a
                key={tool.id}
                href={tool.href}
                className="rounded-2xl border border-cyan-500/30 bg-gray-900/50 p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <img
                    alt={tool.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    src={tool.image}
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-[#CCCCCC]">
                  {tool.shortDescription}
                </p>
                <span className="mt-4 block w-full text-center rounded-lg bg-cyan-500/15 py-2 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30">
                  Abrir
                </span>
              </a>
            ))}
          </div>

          {/* Botón Ver más */}
          <div className="mt-12 text-center">
            <a
              href="/ia/herramientas"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/15 px-8 py-3 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1"
            >
              Ver más herramientas
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Blog
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {getLatestIAArticles(3).map((article) => (
              <Link key={article.slug} href={`/ia/blog/${article.slug}`}>
                <article className="group overflow-hidden rounded-2xl border border-cyan-500/20 bg-gray-900/30 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 h-full flex flex-col">
                  <img
                    alt={article.title}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={article.heroImage}
                  />
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-xs text-[#CCCCCC]">
                      {new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#CCCCCC] flex-grow">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 inline-block font-semibold text-cyan-400 transition-all duration-300 group-hover:translate-x-1">
                      Leer →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Botón Ver más */}
          <div className="mt-12 text-center">
            <a
              href="/ia/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/15 px-8 py-3 font-semibold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1"
            >
              Ver más artículos
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Autor - Pablo Cubides */}
      <section id="autor" className="bg-[#10111A] py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-[#1A1B26] rounded-3xl p-8 md:p-12 shadow-lg border border-gray-800">
            <div className="relative flex-shrink-0 w-48 aspect-[3/4] md:w-64 overflow-hidden rounded-2xl border-4 border-[#10111A] shadow-[0_0_20px_rgba(0,239,255,0.3)]">
              <div className="absolute inset-0 bg-[#00EFFF] opacity-10 scale-110"></div>
              <Image
                src="/images/portal-ia/autor/pablo-cubides.png"
                alt="Pablo Cubides"
                fill
                className="object-cover relative z-10"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-[#00EFFF] font-bold tracking-wide uppercase text-sm">
                Líder de Investigación
              </span>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Pablo Cubides
              </h2>
              <p className="text-xl text-gray-300 mb-6 font-medium">
                Ingeniero Químico · M. Sc. en Ingeniería Ambiental
              </p>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl">
                Docente universitario y desarrollador en IA, redes neuronales y
                optimización. Lidera la investigación y el desarrollo de
                soluciones tecnológicas avanzadas en Aquatech IA.
              </p>
              <Link
                href="/ia/autor"
                className="inline-flex items-center text-white font-semibold hover:text-[#00EFFF] transition-colors group"
              >
                Conoce más sobre su trabajo
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Hidden for now */}
      {/* <section id="productos" className="py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold text-[#F3F6FF]"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Productos
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10111A] transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.15)]">
              <div className="relative">
                <img
                  alt="Producto IA para Gestión Hídrica"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=225&fit=crop&crop=center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#F3F6FF]">
                  IA para la Gestión de Recursos Hídricos
                </h3>
                <p className="mt-2 text-sm">
                  Aprenda a aplicar técnicas de IA para la gestión eficiente del
                  agua.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10111A] transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.15)]">
              <div className="relative">
                <img
                  alt="Producto Análisis de Datos Ambientales"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center"
                />
                <span className="absolute right-3 top-3 rounded-full bg-amber-400/80 px-3 py-1 text-xs font-semibold text-black">
                  Próximamente
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#F3F6FF]">
                  Análisis de Datos Ambientales con IA
                </h3>
                <p className="mt-2 text-sm">
                  Domine el análisis de datos ambientales utilizando
                  herramientas de IA.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10111A] transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.15)]">
              <div className="relative">
                <img
                  alt="Producto IA en Conservación"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=225&fit=crop&crop=center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#F3F6FF]">
                  IA en Biología de la Conservación
                </h3>
                <p className="mt-2 text-sm">
                  Explore el uso de la IA en la protección y conservación de la
                  biodiversidad.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="rounded-lg bg-[#00EFFF] px-8 py-3 text-base font-bold text-[#10111A] transition-transform hover:scale-105">
              Ver todos los productos
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
}
