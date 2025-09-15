"use client";

import Link from "next/link";
import { Noto_Sans, Space_Grotesk } from "next/font/google";

// Metadata moved to layout or use dynamic title setting

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

export default function FiltradoIAPage() {
  return (
    <div
      className={`${noto.variable} ${space.variable} min-h-screen bg-[#10111A] text-white`}
    >
      {/* Design System */}
      <style jsx global>{`
        :root {
          --primary-cyan: #00efff;
          --secondary-cyan: #0095ff;
          --deep-blue: #10111a;
          --panel-bg: #1a1b2e;
          --text-primary: #ffffff;
          --text-secondary: #b0bec5;
          --border-color: rgba(0, 239, 255, 0.1);
          --accent-purple: #8b5cf6;
          --accent-pink: #ec4899;
          --accent-red: #ef4444;
          --accent-green: #10b981;
        }

        body {
          font-family:
            var(--font-noto-sans),
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            "Helvetica Neue",
            Arial;
          background-color: var(--deep-blue);
          color: var(--text-primary);
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family:
            var(--font-space-grotesk),
            var(--font-noto-sans),
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            "Helvetica Neue",
            Arial;
          color: var(--text-primary);
        }

        .panel {
          background: linear-gradient(
            145deg,
            var(--panel-bg) 0%,
            var(--deep-blue) 100%
          );
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
        }

        .btn-primary {
          background: linear-gradient(
            135deg,
            var(--accent-purple) 0%,
            var(--accent-pink) 100%
          );
          color: white;
          border: none;
          font-weight: 600;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
        }

        .btn-secondary {
          background: rgba(0, 149, 255, 0.1);
          border: 1px solid var(--secondary-cyan);
          color: var(--secondary-cyan);
          backdrop-filter: blur(10px);
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover {
          background: rgba(0, 149, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 149, 255, 0.3);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: linear-gradient(
            145deg,
            var(--panel-bg) 0%,
            var(--deep-blue) 100%
          );
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .feature-card:hover {
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.1);
        }

        .status-badge {
          background: linear-gradient(
            135deg,
            var(--accent-purple) 0%,
            var(--accent-pink) 100%
          );
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .app-container {
          background: linear-gradient(
            145deg,
            var(--panel-bg) 0%,
            var(--deep-blue) 100%
          );
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          min-height: calc(100vh - 320px);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .app-container:hover {
          border-color: rgba(139, 92, 246, 0.3);
          background: linear-gradient(
            145deg,
            rgba(26, 27, 46, 0.8) 0%,
            rgba(16, 17, 26, 0.8) 100%
          );
        }

        .tech-badge {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.15) 0%,
            rgba(236, 72, 153, 0.15) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.2);
          color: var(--accent-purple);
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .hero-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(139, 92, 246, 0.1) 0%,
            transparent 70%
          );
        }

        .filter-level {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.1) 0%,
            rgba(239, 68, 68, 0.05) 100%
          );
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--accent-red);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
        }

        .filter-level.moderate {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.1) 0%,
            rgba(245, 158, 11, 0.05) 100%
          );
          border-color: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .filter-level.safe {
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.1) 0%,
            rgba(16, 185, 129, 0.05) 100%
          );
          border-color: rgba(16, 185, 129, 0.2);
          color: var(--accent-green);
        }
      `}</style>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header Panel */}
          <div className="mb-8 rounded-2xl panel p-6 shadow-2xl md:p-8">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 text-sm text-[var(--text-secondary)]"
            >
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/ia"
                    className="transition-colors hover:text-[var(--primary-cyan)]"
                  >
                    Portal IA
                  </Link>
                </li>
                <li>
                  <ChevronRight className="text-gray-500" />
                </li>
                <li>
                  <Link
                    href="/ia/herramientas"
                    className="transition-colors hover:text-[var(--primary-cyan)]"
                  >
                    Herramientas
                  </Link>
                </li>
                <li>
                  <ChevronRight className="text-gray-500" />
                </li>
                <li className="font-medium text-[var(--accent-purple)]">
                  Filtrado de Respuestas IA
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] text-white">
                    <ShieldIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl text-[var(--text-primary)] lg:text-4xl">
                      Cómo la IA filtra las respuestas
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="status-badge">
                        <CheckIcon className="h-4 w-4" />
                        Disponible
                      </span>
                      <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-sm font-semibold text-purple-300">
                        v3.0.1
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-6 max-w-3xl text-lg text-[var(--text-secondary)] leading-relaxed">
                  Módulo interactivo que explora los sistemas de filtrado,
                  moderación de contenido y mecanismos de seguridad que utilizan
                  los modelos de IA para generar respuestas apropiadas.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="tech-badge">🛡️ Safety</span>
                  <span className="tech-badge">🔍 Moderation</span>
                  <span className="tech-badge">⚡ RLHF</span>

                  <div className="ml-auto flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <UpdateIcon className="h-4 w-4" />
                      Actualizado: 12/09/2024
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CodeIcon className="h-4 w-4" />
                      ID: filter_v3_9a2d
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-3">
                <Link
                  href="#visor-app"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-purple)]"
                >
                  <FilterIcon className="h-5 w-5" />
                  Explorar Filtros
                </Link>
                <Link
                  href="/ia/herramientas"
                  className="btn-secondary ml-3 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Volver
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Levels */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="filter-level">
              <div className="text-lg font-bold mb-1">Alto Riesgo</div>
              <div className="text-sm">Contenido Bloqueado</div>
            </div>
            <div className="filter-level moderate">
              <div className="text-lg font-bold mb-1">Riesgo Medio</div>
              <div className="text-sm">Revisar y Reformular</div>
            </div>
            <div className="filter-level safe">
              <div className="text-lg font-bold mb-1">Bajo Riesgo</div>
              <div className="text-sm">Contenido Seguro</div>
            </div>
            <div className="filter-level safe">
              <div className="text-lg font-bold mb-1">Pre-Filtros</div>
              <div className="text-sm">Análisis Previo</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8 feature-grid">
            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <ScanIcon className="h-6 w-6 text-[var(--accent-purple)]" />
                <h3 className="text-lg font-semibold">Análisis de Contexto</h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Comprenda cómo la IA analiza el contexto y la intención detrás
                de cada prompt.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <RobotIcon className="h-6 w-6 text-[var(--accent-pink)]" />
                <h3 className="text-lg font-semibold">RLHF Training</h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Explore el entrenamiento con retroalimentación humana para
                alinear respuestas.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <LayersIcon className="h-6 w-6 text-[var(--primary-cyan)]" />
                <h3 className="text-lg font-semibold">Filtros Multicapa</h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Descubra las múltiples capas de filtrado que operan en tiempo
                real.
              </p>
            </div>
          </div>

          {/* App Container */}
          <section
            id="visor-app"
            aria-label="Módulo Filtrado de Respuestas IA"
            className="mb-8"
          >
            <div className="app-container flex flex-col">
              <div className="absolute inset-0 hero-glow"></div>
              <div className="relative flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] text-white">
                    <ShieldIcon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-[var(--text-primary)]">
                    Módulo Interactivo: Filtrado IA
                  </h3>
                  <p className="max-w-md mx-auto text-[var(--text-secondary)] mb-6">
                    Simulador interactivo de sistemas de moderación y filtrado
                    de contenido en modelos de IA.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <FilterIcon className="h-4 w-4" />
                      Probar Filtros
                    </button>
                    <button className="btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <SettingsIcon className="h-4 w-4" />
                      Configurar
                    </button>
                  </div>
                </div>
              </div>

              {/* Placeholder for actual iframe/component */}
              {/*
              <iframe
                src="https://ai-filters-module.aquatechia.vercel.app"
                className="absolute inset-0 h-full w-full rounded-2xl"
                loading="lazy"
                title="Módulo Interactivo: Filtrado de Respuestas IA"
                allow="clipboard-read; clipboard-write"
              />
              */}
            </div>
          </section>

          {/* Technical Details & Safety Measures */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl panel p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--accent-purple)]">
                Técnicas de Filtrado
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    name: "Constitutional AI",
                    desc: "Principios éticos codificados en el entrenamiento del modelo",
                    type: "Training",
                  },
                  {
                    name: "Content Classifiers",
                    desc: "Modelos especializados que clasifican el tipo de contenido",
                    type: "Inference",
                  },
                  {
                    name: "RLHF (Reinforcement Learning)",
                    desc: "Entrenamiento con retroalimentación humana para alineación",
                    type: "Training",
                  },
                  {
                    name: "Red Team Testing",
                    desc: "Pruebas adversariales para identificar vulnerabilidades",
                    type: "Testing",
                  },
                ].map((technique) => (
                  <div
                    key={technique.name}
                    className="border-b border-[var(--border-color)] pb-3 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-[var(--text-primary)]">
                        {technique.name}
                      </div>
                      <div className="text-xs text-[var(--accent-purple)] bg-purple-500/10 px-2 py-1 rounded">
                        {technique.type}
                      </div>
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      {technique.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl panel p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--accent-pink)]">
                Categorías de Riesgo
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    category: "Violencia y Daño",
                    desc: "Contenido que promueve violencia física o psicológica",
                    level: "Alto",
                  },
                  {
                    category: "Contenido Sexual",
                    desc: "Material sexualmente explícito o inapropiado",
                    level: "Alto",
                  },
                  {
                    category: "Información Médica",
                    desc: "Consejos médicos sin respaldo profesional",
                    level: "Medio",
                  },
                  {
                    category: "Información Personal",
                    desc: "Datos personales identificables de terceros",
                    level: "Alto",
                  },
                  {
                    category: "Desinformación",
                    desc: "Información factualmente incorrecta o engañosa",
                    level: "Medio",
                  },
                ].map((item) => (
                  <div
                    key={item.category}
                    className="border-b border-[var(--border-color)] pb-3 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-[var(--text-primary)]">
                        {item.category}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          item.level === "Alto"
                            ? "text-red-400 bg-red-500/10"
                            : "text-yellow-400 bg-yellow-500/10"
                        }`}
                      >
                        {item.level}
                      </div>
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Icons */
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707A1 1 0 118.707 5.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.1V11.1C15.4,11.1 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11.1 9,11.1V10.1C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10.1V11.1H13.8V10.1C13.8,8.7 12.8,8.2 12,8.2Z" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
    </svg>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function ScanIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M4,4H10V6H4A2,2 0 0,0 2,8V14H4V8H10V10H4V14A2,2 0 0,0 6,16H10V14H16V16H10V18H16A2,2 0 0,0 18,16V10H16V14H10V10A2,2 0 0,0 8,8V4A2,2 0 0,0 10,2H16V4H20A2,2 0 0,0 22,6V10H20V6H16V8H20V10H22V16A2,2 0 0,0 20,18V14H18V16H16V20A2,2 0 0,0 14,22H8A2,2 0 0,0 6,20V16H4A2,2 0 0,0 2,14V8A2,2 0 0,0 4,6V4M8,6V8H6V6H8M16,8V10H18V8H16Z" />
    </svg>
  );
}

function RobotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
    </svg>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z" />
    </svg>
  );
}

function UpdateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 6V3L8 7l4 4V8a4 4 0 11-4 4H6a6 6 0 106-6z" />
    </svg>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
    </svg>
  );
}
