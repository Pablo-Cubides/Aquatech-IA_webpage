import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedAmbientalTools } from "@/lib/ambiental-tools";
import { getLatestArticles } from "@/lib/new-ambiental-articles";

export const metadata: Metadata = {
  title: "Portal Ambiental - Gestión Ambiental con tecnología sostenible",
  description:
    "Mapas, normas y herramientas para proteger nuestros recursos naturales. Gestión ambiental con tecnología para un futuro sostenible.",
  keywords: [
    "gestión ambiental",
    "recursos naturales",
    "tecnología sostenible",
    "mapas ambientales",
    "normas ambientales",
    "EIA",
  ],
  openGraph: {
    title: "Portal Ambiental - Gestión Ambiental con tecnología sostenible",
    description:
      "Mapas, normas y herramientas para proteger nuestros recursos naturales. Gestión ambiental con tecnología para un futuro sostenible.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal Ambiental - Gestión Ambiental con tecnología sostenible",
    description:
      "Mapas, normas y herramientas para proteger nuestros recursos naturales. Gestión ambiental con tecnología para un futuro sostenible.",
  },
};

export default function AmbientalPage() {
  return (
    <main className="bg-white text-black">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen lg:h-screen flex items-center text-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/mountains-hero.jpg')" }}
        >
          {/* Light Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-white"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl">
            {/* Logo */}
            <div className="mb-12 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
              <img
                src="/images/Logo Aquatech - IA 512 - sin fondo.png"
                alt="Aquatech Ambiental Logo"
                className="h-32 w-auto sm:h-40 md:h-48 lg:h-64 object-contain drop-shadow-2xl"
              />
            </div>

            <h1
              className="text-5xl font-bold md:text-7xl text-gray-900 animate-in fade-in slide-in-from-top-6 duration-700 delay-150"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Gestión Ambiental con tecnología para un futuro sostenible
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-700 font-medium animate-in fade-in slide-in-from-top-8 duration-700 delay-300">
              Mapas, normas y herramientas para proteger nuestros recursos
              naturales.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <button className="rounded-lg bg-green-600 px-8 py-3 text-base font-bold text-white transition-all duration-300 ease-out hover:bg-green-700 hover:shadow-xl hover:shadow-green-500/50 hover:-translate-y-1 hover:scale-105 active:translate-y-0">
                Explorar herramientas
              </button>
              <button className="rounded-lg border-2 border-blue-600 px-8 py-3 text-base font-bold text-blue-600 backdrop-blur-sm bg-white/60 transition-all duration-300 ease-out hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 hover:scale-105 active:translate-y-0">
                Conocer más
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <div>
            <h2
              className="text-4xl font-bold text-black"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Nosotros
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Nuestra misión es aprovechar la tecnología para mejorar la gestión
              ambiental, fomentando un futuro sostenible a través de soluciones
              innovadoras y una toma de decisiones informada.
            </p>
            <button className="mt-8 rounded-lg border border-blue-600 px-6 py-2 font-medium text-blue-600 transition-all duration-300 ease-out hover:bg-blue-600 hover:text-white hover:-translate-y-1">
              Leer más
            </button>
          </div>

          <div className="flex justify-center">
            <img
              alt="Equipo de gestión ambiental"
              className="h-auto w-full max-w-md rounded-2xl object-cover shadow-lg transition-transform duration-300 hover:scale-105"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* HERRAMIENTAS */}
      <section id="herramientas" className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Herramientas Ambientales
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-700">
            Descubre nuestras herramientas especializadas para el análisis y
            gestión ambiental.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {getFeaturedAmbientalTools(3).map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <article className="rounded-2xl border border-[#E5EDF2] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer h-full flex flex-col">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <img
                      alt={tool.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      src={tool.image}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 flex-grow">
                    {tool.shortDescription}
                  </p>
                  <button className="mt-4 w-full rounded-lg bg-[#0077B6]/10 py-2 font-semibold text-[#0077B6] transition-colors hover:bg-[#0077B6]/15 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/50">
                    Abrir
                  </button>
                </article>
              </Link>
            ))}
          </div>

          {/* Botón Ver más */}
          <div className="mt-12 text-center">
            <a
              href="/ambiental/herramientas"
              className="inline-flex items-center gap-2 rounded-lg bg-[#10B981]/15 px-8 py-3 font-semibold text-[#10B981] transition-all duration-300 hover:bg-[#10B981]/25 hover:shadow-lg hover:shadow-[#10B981]/30 hover:-translate-y-1"
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

      {/* BLOG */}
      <section id="blog" className="py-24">
        <div className="container mx-auto px-4">
          <h2
            className="text-center text-4xl font-bold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Desde nuestro Blog
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-700">
            Artículos, noticias y análisis sobre medio ambiente y tecnología.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {getLatestArticles(3).map((article) => (
              <Link key={article.slug} href={`/ambiental/blog/${article.slug}`}>
                <article className="overflow-hidden rounded-2xl border border-[#E5EDF2] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                  <img
                    alt={article.title}
                    className="h-56 w-full object-cover"
                    src={article.heroImage}
                  />
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} ·{" "}
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-[#10B981]">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-[#0D161C]">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-700 flex-grow">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 font-semibold text-[#10B981] group-hover:text-[#0077B6]">
                      Leer <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Botón Ver más */}
          <div className="mt-12 text-center">
            <a
              href="/ambiental/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-[#10B981]/15 px-8 py-3 font-semibold text-[#10B981] transition-all duration-300 hover:bg-[#10B981]/25 hover:shadow-lg hover:shadow-[#10B981]/30 hover:-translate-y-1"
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

      {/* AUTHOR PROFILE - PABLO CUBIDES */}
      <section className="py-24 bg-[#E5F2F0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E5EDF2]">
            <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0">
              <div className="absolute inset-0 bg-[#009A8F] rounded-full opacity-10 scale-110"></div>
              <img
                src="/images/Portal ambiental/autor/Pablo Cubides.jpg"
                alt="Pablo Cubides"
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-[#009A8F] font-bold tracking-wide uppercase text-sm">
                Líder de Investigación
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0D161C] mt-2 mb-4 font-space-grotesk">
                Pablo Cubides
              </h2>
              <p className="text-xl text-gray-600 mb-6 font-medium">
                Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería
                Ambiental.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">
                Docente e investigador especializado en gestión integral del
                recurso hídrico. Apasionado por la tecnología para el bien
                ambiental, lidera la investigación y el desarrollo en Aquatech
                IA.
              </p>
              <Link
                href="/ambiental/autor"
                className="inline-flex items-center text-[#0D161C] font-semibold hover:text-[#009A8F] transition-colors group"
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
            className="text-center text-4xl font-bold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Productos y Formación
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-700">
            Amplía tus conocimientos con nuestros productos especializados en
            gestión ambiental.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-[#E5EDF2] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative">
                <img
                  alt="Producto de introducción a la ciencia ambiental"
                  className="aspect-[16/9] w-full rounded-xl object-cover"
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop&crop=center"
                />
                <span className="absolute right-2 top-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-[#0077B6]">
                  Próximamente
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0D161C]">
                Introducción a la Ciencia Ambiental
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Un producto fundamental que cubre conceptos ambientales clave y
                metodologías de investigación.
              </p>
            </article>

            <article className="rounded-2xl border border-[#E5EDF2] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                alt="Gestión avanzada de recursos hídricos"
                className="aspect-[16/9] w-full rounded-xl object-cover"
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=225&fit=crop&crop=center"
              />
              <h3 className="mt-4 text-lg font-semibold text-[#0D161C]">
                Gestión Avanzada de Recursos Hídricos
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Estudio en profundidad de técnicas avanzadas de gestión y
                conservación del agua.
              </p>
            </article>

            <article className="rounded-2xl border border-[#E5EDF2] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <img
                alt="Estrategias de desarrollo sostenible"
                className="aspect-[16/9] w-full rounded-xl object-cover"
                src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?w=400&h=225&fit=crop&crop=center"
              />
              <h3 className="mt-4 text-lg font-semibold text-[#0D161C]">
                Estrategias de Desarrollo Sostenible
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Estrategias integrales para alcanzar objetivos de desarrollo
                sostenible y preservación ambiental.
              </p>
            </article>
          </div>

          <div className="mt-12 text-center">
            <button className="rounded-lg bg-[#0077B6] px-8 py-3 text-base font-bold text-white transition-transform hover:scale-105">
              Ver todos los productos
            </button>
          </div>
        </div>
      </section> */}
    </main>
  );
}
