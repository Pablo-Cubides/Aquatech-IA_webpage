import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Herramientas Ambientales - Portal Ambiental | AquatechIA",
  description:
    "Soluciones innovadoras para la gestión y análisis de datos ambientales, diseñadas para un futuro sostenible.",
  keywords: [
    "herramientas ambientales",
    "GIS",
    "normas ambientales",
    "matrices de impacto",
    "gestión ambiental",
    "sostenibilidad",
    "datos ambientales",
  ],
  openGraph: {
    title: "Herramientas Ambientales - Portal Ambiental",
    description:
      "Soluciones innovadoras para la gestión y análisis de datos ambientales, diseñadas para un futuro sostenible.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Herramientas Ambientales - Portal Ambiental",
    description:
      "Soluciones innovadoras para la gestión y análisis de datos ambientales, diseñadas para un futuro sostenible.",
  },
};

export default function AmbientalHerramientasPage() {
  return (
    <div className="min-h-screen bg-[#F5F9F8] text-[#0D161C]">
      {/* Main */}
      <main className="flex-grow py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#023E8A] tracking-tight font-space-grotesk">
              Nuestras Herramientas
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Soluciones innovadoras para la gestión y análisis de datos
              ambientales, diseñadas para un futuro sostenible.
            </p>
          </div>

          {/* Tools list */}
          <div className="space-y-16">
            {/* Tool 1 - Visor de Mapas Ambientales */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-2 lg:gap-8 items-center hover:shadow-xl transition-shadow duration-300">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col order-2 lg:order-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    GIS
                  </span>
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    Visualización
                  </span>
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    Datos
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4 font-space-grotesk">
                  Visualizador de Mapas Ambientales
                </h2>
                <p className="text-gray-600 mb-6">
                  Explore y analice datos geoespaciales ambientales con una
                  interfaz intuitiva y potentes herramientas de visualización.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Capas de datos personalizables.</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Análisis de proximidad y superposición.</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Importación de datos de múltiples fuentes.</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <Link
                    href="/ambiental/herramientas/visor-mapas-ambientales"
                    className="bg-[#10B981] text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-[#059669] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:ring-offset-2"
                  >
                    Abrir herramienta
                  </Link>
                  <Link
                    href="/ambiental/herramientas/visor-mapas-ambientales"
                    className="border border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-lg font-medium text-center hover:bg-[#0077B6] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:ring-offset-2"
                  >
                    Ver demo
                  </Link>
                </div>
              </div>
              <div className="h-64 lg:h-full overflow-hidden order-1 lg:order-2">
                <img
                  alt="Imagen satelital de la Tierra mostrando ríos y zonas verdes"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="/images/mountains-hero.jpg"
                />
              </div>
            </article>

            {/* Tool 2 - Normas Ambientales */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-2 lg:gap-8 items-center hover:shadow-xl transition-shadow duration-300">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    Normativa
                  </span>
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    Cumplimiento
                  </span>
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    LatAm
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4 font-space-grotesk">
                  Normas Ambientales Latinoamericanas
                </h2>
                <p className="text-gray-600 mb-6">
                  Acceda a una base de datos completa y actualizada de las
                  regulaciones ambientales de toda América Latina.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Búsqueda por país, sector y tipo de norma.</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Comparativas entre legislaciones.</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Alertas sobre nuevas publicaciones y cambios.</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <Link
                    href="/ambiental/herramientas/normas-ambientales"
                    className="bg-[#10B981] text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-[#059669] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:ring-offset-2"
                  >
                    Abrir herramienta
                  </Link>
                  <Link
                    href="/ambiental/herramientas/normas-ambientales"
                    className="border border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-lg font-medium text-center hover:bg-[#0077B6] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:ring-offset-2"
                  >
                    Documentación
                  </Link>
                </div>
              </div>
              <div className="h-64 lg:h-full overflow-hidden">
                <img
                  alt="Documentos legales y libros de normativas ambientales"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="/images/technology-hero.jpg"
                />
              </div>
            </article>

            {/* Tool 3 - Generador de Matrices */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-2 lg:gap-8 items-center hover:shadow-xl transition-shadow duration-300">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col order-2 lg:order-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    Análisis de Impacto
                  </span>
                  <span className="bg-[#E6F3FF] text-[#023E8A] text-xs px-3 py-1 rounded-full font-medium">
                    Automatización
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4 font-space-grotesk">
                  Generador de Matrices Ambientales
                </h2>
                <p className="text-gray-600 mb-6">
                  Cree matrices de Leopold y otras matrices de impacto ambiental
                  de forma automatizada y sistemática.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Plantillas predefinidas para diferentes proyectos.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Cuantificación y ponderación de impactos.</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#10B981] mr-3 flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Exportación a formatos de informe estándar.</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <Link
                    href="/ambiental/herramientas/generador-matrices"
                    className="bg-[#10B981] text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-[#059669] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:ring-offset-2"
                  >
                    Abrir herramienta
                  </Link>
                  <Link
                    href="/ambiental/herramientas/generador-matrices"
                    className="border border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-lg font-medium text-center hover:bg-[#0077B6] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:ring-offset-2"
                  >
                    Ver demo
                  </Link>
                </div>
              </div>
              <div className="h-64 lg:h-full overflow-hidden order-1 lg:order-2">
                <img
                  alt="Gráfico de un diagrama de flujo con nodos y conexiones"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="/images/mountains-hero.jpg"
                />
              </div>
            </article>
          </div>

          {/* Call to Action */}
          <div className="mt-16 md:mt-24 text-center">
            <div className="bg-gradient-to-r from-[#0077B6] to-[#10B981] rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                ¿Necesitas una solución personalizada?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Trabajamos contigo para desarrollar herramientas específicas
                para tus necesidades ambientales.
              </p>
              <Link
                href="/ambiental/autor"
                className="bg-white text-[#0077B6] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Contactar al autor
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
