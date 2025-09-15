"use client";

import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";

// Metadata moved to layout or use dynamic title setting

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space",
});

export default function GeneradorMatricesPage() {
  return (
    <div
      className={`${inter.variable} ${space.variable} min-h-screen bg-[#F5F9F8]`}
    >
      {/* Design System */}
      <style jsx global>{`
        :root {
          --env-bg-base: #f5f9f8;
          --env-bg-panel: #ffffff;
          --env-text-primary: #0d161c;
          --env-text-secondary: #4b5563;
          --env-accent: #10b981;
          --env-accent-secondary: #0077b6;
          --env-border: #e5e7eb;
          --env-success: #059669;
          --env-info: #0ea5e9;
          --env-purple: #8b5cf6;
        }

        body {
          background-color: var(--env-bg-base);
          color: var(--env-text-primary);
          font-family:
            var(--font-inter),
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            "Helvetica Neue",
            Arial;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family:
            var(--font-space),
            var(--font-inter),
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            "Helvetica Neue",
            Arial;
          font-weight: 700;
        }

        .panel {
          background-color: var(--env-bg-panel);
          border-color: var(--env-border);
        }

        .btn-primary {
          background: linear-gradient(
            135deg,
            var(--env-accent) 0%,
            var(--env-success) 100%
          );
          border: none;
          color: white;
          transition: all 200ms ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .btn-secondary {
          background: rgba(0, 119, 182, 0.1);
          border: 1px solid var(--env-accent-secondary);
          color: var(--env-accent-secondary);
          transition: all 200ms ease;
        }

        .btn-secondary:hover {
          background: rgba(0, 119, 182, 0.2);
          transform: translateY(-1px);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: white;
          border: 1px solid var(--env-border);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 200ms ease;
        }

        .feature-card:hover {
          border-color: var(--env-accent);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.1);
          transform: translateY(-2px);
        }

        .status-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
            135deg,
            rgba(16, 185, 129, 0.02) 0%,
            rgba(139, 92, 246, 0.02) 100%
          );
          border: 2px dashed var(--env-border);
          border-radius: 16px;
          min-height: calc(100vh - 320px);
          position: relative;
          overflow: hidden;
        }

        .app-container:hover {
          border-color: var(--env-accent);
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.05) 0%,
            rgba(139, 92, 246, 0.05) 100%
          );
        }

        .matrix-type {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.1) 0%,
            rgba(139, 92, 246, 0.05) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.2);
          color: #7c3aed;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
        }
      `}</style>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header Panel */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 text-sm text-[var(--env-text-secondary)]"
            >
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/ambiental"
                    className="transition-colors hover:text-[var(--env-accent)]"
                  >
                    Portal Ambiental
                  </Link>
                </li>
                <li>
                  <ChevronRight className="text-gray-400" />
                </li>
                <li>
                  <Link
                    href="/ambiental/herramientas"
                    className="transition-colors hover:text-[var(--env-accent)]"
                  >
                    Herramientas
                  </Link>
                </li>
                <li>
                  <ChevronRight className="text-gray-400" />
                </li>
                <li className="font-medium text-[var(--env-text-primary)]">
                  Generador de Matrices
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--env-purple)] to-[var(--env-accent)] text-white">
                    <GridIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl text-[var(--env-text-primary)] lg:text-4xl">
                      Generador de Matrices Ambientales
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="status-badge">
                        <CheckIcon className="h-4 w-4" />
                        Disponible
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        v2.8.0
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-6 max-w-3xl text-lg text-[var(--env-text-secondary)] leading-relaxed">
                  Herramienta automatizada para crear matrices de Leopold y
                  otros tipos de matrices de impacto ambiental de forma
                  sistemática, con plantillas predefinidas y exportación a
                  formatos estándar.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700">
                    📊 Análisis de Impacto
                  </span>
                  <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                    🤖 Automatización
                  </span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    📋 Plantillas
                  </span>

                  <div className="ml-auto flex items-center gap-4 text-sm text-[var(--env-text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <UpdateIcon className="h-4 w-4" />
                      Actualizado: 05/09/2024
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DatabaseIcon className="h-4 w-4" />
                      ID: mtx_v2_9b4e
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-3">
                <Link
                  href="#visor-app"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--env-accent)]"
                >
                  <PlusIcon className="h-5 w-5" />
                  Crear Matriz
                </Link>
                <Link
                  href="/ambiental/herramientas"
                  className="btn-secondary ml-3 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Volver
                </Link>
              </div>
            </div>
          </div>

          {/* Matrix Types */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="matrix-type mb-2">Leopold</div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Matriz Clásica
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="matrix-type mb-2">Causa-Efecto</div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Análisis Detallado
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="matrix-type mb-2">Importancia</div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Ponderación
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="matrix-type mb-2">Personalizada</div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Configuración Libre
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8 feature-grid">
            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <TemplateIcon className="h-6 w-6 text-[var(--env-purple)]" />
                <h3 className="text-lg font-semibold">
                  Plantillas Predefinidas
                </h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Matrices preconfiguradas para diferentes tipos de proyectos:
                minería, hidroeléctricas, urbanismo, etc.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <CalculatorIcon className="h-6 w-6 text-[var(--env-accent)]" />
                <h3 className="text-lg font-semibold">
                  Cuantificación Automática
                </h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Sistemas de ponderación y scoring automático con criterios
                científicos establecidos.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <ExportIcon className="h-6 w-6 text-[var(--env-info)]" />
                <h3 className="text-lg font-semibold">
                  Exportación Profesional
                </h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Genera informes en PDF, Excel y Word con formato profesional
                listo para presentación.
              </p>
            </div>
          </div>

          {/* App Container */}
          <section
            id="visor-app"
            aria-label="Generador de Matrices Ambientales"
            className="mb-8"
          >
            <div className="app-container flex flex-col">
              <div className="flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--env-purple)] to-[var(--env-accent)] text-white">
                    <GridIcon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-[var(--env-text-primary)]">
                    Generador de Matrices de Impacto
                  </h3>
                  <p className="max-w-md mx-auto text-[var(--env-text-secondary)] mb-6">
                    Herramienta para crear matrices de Leopold y otros tipos de
                    análisis de impacto ambiental de forma automatizada.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <PlusIcon className="h-4 w-4" />
                      Nueva Matriz
                    </button>
                    <button className="btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <TemplateIcon className="h-4 w-4" />
                      Ver Plantillas
                    </button>
                  </div>
                </div>
              </div>

              {/* Placeholder for actual iframe/component */}
              {/*
              <iframe
                src="https://matrices-app.aquatechia.vercel.app"
                className="absolute inset-0 h-full w-full rounded-2xl"
                loading="lazy"
                title="Generador de Matrices Ambientales"
              />
              */}
            </div>
          </section>

          {/* Project Templates & Export Formats */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">
                Plantillas de Proyecto
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  {
                    icon: "⛏️",
                    name: "Minería a Cielo Abierto",
                    factors: "45 factores",
                  },
                  {
                    icon: "🏗️",
                    name: "Construcción Urbana",
                    factors: "38 factores",
                  },
                  {
                    icon: "⚡",
                    name: "Plantas Hidroeléctricas",
                    factors: "52 factores",
                  },
                  {
                    icon: "🏭",
                    name: "Industria Manufacturera",
                    factors: "41 factores",
                  },
                  {
                    icon: "🛣️",
                    name: "Infraestructura Vial",
                    factors: "34 factores",
                  },
                  {
                    icon: "🌾",
                    name: "Proyectos Agrícolas",
                    factors: "29 factores",
                  },
                ].map((template) => (
                  <div
                    key={template.name}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{template.icon}</span>
                      <span className="text-[var(--env-text-primary)]">
                        {template.name}
                      </span>
                    </span>
                    <span className="text-[var(--env-text-secondary)]">
                      {template.factors}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">
                Formatos de Exportación
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  {
                    icon: "📄",
                    name: "Informe PDF",
                    desc: "Documento profesional completo",
                  },
                  {
                    icon: "📊",
                    name: "Hoja Excel",
                    desc: "Matriz editable con fórmulas",
                  },
                  {
                    icon: "📝",
                    name: "Documento Word",
                    desc: "Template para informes EIA",
                  },
                  {
                    icon: "📈",
                    name: "Gráficos PNG",
                    desc: "Visualizaciones de alta resolución",
                  },
                  {
                    icon: "🔗",
                    name: "Enlace Compartible",
                    desc: "URL para revisión colaborativa",
                  },
                  {
                    icon: "💾",
                    name: "Backup JSON",
                    desc: "Respaldo de configuración",
                  },
                ].map((format) => (
                  <div
                    key={format.name}
                    className="py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{format.icon}</span>
                      <span className="text-[var(--env-text-primary)] font-medium">
                        {format.name}
                      </span>
                    </div>
                    <div className="text-[var(--env-text-secondary)] ml-7">
                      {format.desc}
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

function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
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

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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

function TemplateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9h5v11H6V4h7v5z" />
    </svg>
  );
}

function CalculatorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 2v2h1v14a4 4 0 004 4 4 4 0 004-4V4h1V2H7zm2 2h6v14a2 2 0 01-2 2 2 2 0 01-2-2V4zm2 2v2h2V6h-2zm0 4v2h2v-2h-2z" />
    </svg>
  );
}

function ExportIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
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

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C8 2 8 4 8 4s0 2 4 2 4-2 4-2-0-2-4-2zm4 4.5v3.5c0 1-1.8 2-4 2s-4-1-4-2V6.5C9.2 7.5 11 8 12 8s2.8-.5 4-1.5zm0 5v3.5c0 1-1.8 2-4 2s-4-1-4-2v-3.5C9.2 12.5 11 13 12 13s2.8-.5 4-1.5zm0 5v3.5c0 1-1.8 2-4 2s-4-1-4-2v-3.5C9.2 17.5 11 18 12 18s2.8-.5 4-1.5z" />
    </svg>
  );
}
