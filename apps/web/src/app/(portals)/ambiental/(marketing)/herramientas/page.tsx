"use client";

import Link from "next/link";
import { Noto_Sans, Space_Grotesk } from "next/font/google";

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-sans",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

export default function AmbientalHerramientasPage() {
  return (
    <div
      className={`${noto.variable} ${space.variable} min-h-screen bg-white text-black`}
    >
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,119,182,0.05)] via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-black to-[#0077B6] bg-clip-text text-transparent mb-6">
              Herramientas Ambientales
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explora nuestras herramientas especializadas para análisis ambiental, evaluación de impacto y gestión de regulaciones.
            </p>

            {/* Breadcrumb */}
            <nav className="flex justify-center mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/ambiental"
                    className="hover:text-[#0077B6] transition-colors duration-300"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <svg
                    className="w-4 h-4 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
                <li className="text-[#0077B6] font-medium">
                  Herramientas
                </li>
              </ol>
            </nav>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                <div className="text-3xl font-bold text-[#0077B6] mb-2">
                  3
                </div>
                <div className="text-gray-600">
                  Herramientas Disponibles
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                <div className="text-3xl font-bold text-[#10B981] mb-2">
                  100%
                </div>
                <div className="text-gray-600">Interactivas</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                <div className="text-3xl font-bold text-black mb-2">24/7</div>
                <div className="text-gray-600">Acceso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 md:space-y-20">
            {/* Herramienta 1: Visor de Mapas */}
            <article className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10 hover:border-[#0077B6]/30 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col order-2 lg:order-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Mapas
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Visualización
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      SIG
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black leading-tight">
                    Visor de Mapas Ambientales
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Visualiza datos ambientales geoespaciales con capas interactivas para análisis territorial y monitoreo de proyectos.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Capas geoespaciales personalizables
                    </ListItem>
                    <ListItem>
                      Análisis de cobertura y uso del suelo
                    </ListItem>
                    <ListItem>
                      Exportación de datos en múltiples formatos
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/ambiental/herramientas/visor-mapas-ambientales" className="btn btn-primary focus-ring">
                      <PlayIcon />
                      Abrir herramienta
                    </Link>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary focus-ring">
                      <DocIcon />
                      Documentación
                    </Link>
                  </div>
                </div>
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden order-1 lg:order-2 relative">
                  <img
                    alt="Visualización interactiva de mapas ambientales"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Herramienta 2: Generador de Matrices */}
            <article className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10 hover:border-[#0077B6]/30 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden relative">
                  <img
                    alt="Herramienta de generación de matrices de EIA"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1516321318423-f06f70d504d0?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      EIA
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Matrices
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Impacto
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black leading-tight">
                    Generador de Matrices de EIA
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Crea matrices de evaluación de impacto ambiental (Leopold, Conesa, Battelle) automáticamente según tu proyecto.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Múltiples metodologías de EIA
                    </ListItem>
                    <ListItem>
                      Cálculos automatizados de impacto
                    </ListItem>
                    <ListItem>
                      Generación de reportes y exportación
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/ambiental/herramientas/generador-matrices" className="btn btn-primary focus-ring">
                      <PlayIcon />
                      Abrir herramienta
                    </Link>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary focus-ring">
                      <DocIcon />
                      Documentación
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Herramienta 3: Normas Ambientales */}
            <article className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10 hover:border-[#0077B6]/30 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col order-2 lg:order-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Regulaciones
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Normas
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,119,182,0.15)] to-[rgba(16,185,129,0.15)] border border-[#0077B6]/20 text-[#0077B6] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Cumplimiento
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black leading-tight">
                    Normas Ambientales por País
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Accede a la base de datos actualizada de regulaciones ambientales por país y sector, con análisis comparativo.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Base de datos de normas actualizada
                    </ListItem>
                    <ListItem>
                      Búsqueda por país, sector y tema
                    </ListItem>
                    <ListItem>
                      Análisis comparativo de regulaciones
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/ambiental/herramientas/normas-ambientales" className="btn btn-primary focus-ring">
                      <PlayIcon />
                      Abrir herramienta
                    </Link>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary focus-ring">
                      <DocIcon />
                      Documentación
                    </Link>
                  </div>
                </div>
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden order-1 lg:order-2 relative">
                  <img
                    alt="Base de datos de normas ambientales internacionales"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Call to Action */}
          <section className="mt-20 md:mt-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 md:p-12 text-center border border-blue-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0077B6]/5 to-[#10B981]/5"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
                ¿Necesitas una herramienta personalizada?
              </h2>
              <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
                Nuestro equipo puede desarrollar soluciones específicas para tus necesidades de análisis ambiental.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ambiental/contacto" className="btn btn-primary">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z"
                    />
                  </svg>
                  Contactar Ahora
                </Link>
                <Link href="/ambiental/nosotros" className="btn btn-secondary">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Conocer al Equipo
                </Link>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mt-20 md:mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                ¿Por qué elegir nuestras herramientas?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Análisis ambiental profesional con tecnología de vanguardia
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🌍",
                  title: "Datos Actualizados",
                  description:
                    "Base de datos de normas y datos ambientales actualizada constantemente",
                },
                {
                  icon: "⚙️",
                  title: "Metodologías Probadas",
                  description:
                    "Basado en estándares internacionales de evaluación ambiental",
                },
                {
                  icon: "📊",
                  title: "Análisis Profundo",
                  description:
                    "Herramientas completas para evaluación y monitoreo ambiental",
                },
                {
                  icon: "🎯",
                  title: "Aplicación Práctica",
                  description:
                    "Diseñado para profesionales del sector ambiental y agua",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center group hover:border-[#0077B6]/30 transition-all backdrop-blur-sm"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#0077B6] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------- UI Components ---------- */
function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <svg
        className="w-6 h-6 text-[#0077B6] mr-4 flex-shrink-0 mt-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-gray-600 text-lg">{children}</span>
    </li>
  );
}

function PlayIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9h5v11H6V4h7v5z" />
    </svg>
  );
}
