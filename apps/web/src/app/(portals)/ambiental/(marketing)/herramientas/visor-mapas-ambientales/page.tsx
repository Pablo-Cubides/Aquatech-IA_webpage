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

export default function VisorMapasAmbientalesPage() {
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
            rgba(0, 119, 182, 0.02) 100%
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
            rgba(0, 119, 182, 0.05) 100%
          );
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
                  Visualizador de Mapas
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--env-accent)] to-[var(--env-success)] text-white">
                    <MapIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl text-[var(--env-text-primary)] lg:text-4xl">
                      Visualizador de Mapas Ambientales
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="status-badge">
                        <CheckIcon className="h-4 w-4" />
                        Disponible
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        v3.2.1
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-6 max-w-3xl text-lg text-[var(--env-text-secondary)] leading-relaxed">
                  Herramienta avanzada para la exploración y análisis de datos
                  geoespaciales ambientales con una interfaz intuitiva y
                  potentes capacidades de visualización cartográfica.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                    🗺️ GIS
                  </span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    📊 Visualización
                  </span>
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700">
                    🌍 Datos Ambientales
                  </span>

                  <div className="ml-auto flex items-center gap-4 text-sm text-[var(--env-text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <UpdateIcon className="h-4 w-4" />
                      Actualizado: 15/08/2024
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DatabaseIcon className="h-4 w-4" />
                      ID: map_v3_2a7d
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-3">
                <Link
                  href="#visor-app"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--env-accent)]"
                >
                  <PlayIcon className="h-5 w-5" />
                  Abrir Herramienta
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

          {/* Features Grid */}
          <div className="mb-8 feature-grid">
            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <LayersIcon className="h-6 w-6 text-[var(--env-accent)]" />
                <h3 className="text-lg font-semibold">Capas Personalizables</h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Visualice múltiples capas de datos ambientales con controles de
                opacidad y filtros avanzados.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <AnalyticsIcon className="h-6 w-6 text-[var(--env-accent-secondary)]" />
                <h3 className="text-lg font-semibold">Análisis Espacial</h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Herramientas de proximidad, superposición y análisis de patrones
                geoespaciales.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <ImportIcon className="h-6 w-6 text-[var(--env-info)]" />
                <h3 className="text-lg font-semibold">Importación Múltiple</h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Compatible con KML, GeoJSON, Shapefile y conexión directa a APIs
                de datos.
              </p>
            </div>
          </div>

          {/* App Container */}
          <section
            id="visor-app"
            aria-label="Visualizador de Mapas Ambientales"
            className="mb-8"
          >
            <div className="app-container flex flex-col">
              <div className="flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--env-accent)] to-[var(--env-success)] text-white">
                    <MapIcon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-[var(--env-text-primary)]">
                    Visualizador de Mapas Ambientales
                  </h3>
                  <p className="max-w-md mx-auto text-[var(--env-text-secondary)] mb-6">
                    La herramienta de mapas se cargará aquí. Interfaz GIS
                    completa para análisis geoespacial ambiental.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <PlayIcon className="h-4 w-4" />
                      Cargar Mapa
                    </button>
                    <button className="btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <DocumentIcon className="h-4 w-4" />
                      Documentación
                    </button>
                  </div>
                </div>
              </div>

              {/* Placeholder for actual iframe/component */}
              {/*
              <iframe
                src="https://maps-app.aquatechia.vercel.app"
                className="absolute inset-0 h-full w-full rounded-2xl"
                loading="lazy"
                title="Visualizador de Mapas Ambientales"
                allow="geolocation"
              />
              */}
            </div>
          </section>

          {/* Technical Specs */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Especificaciones Técnicas
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-sm font-medium text-[var(--env-text-secondary)]">
                  Formatos Soportados
                </dt>
                <dd className="mt-1 text-sm text-[var(--env-text-primary)]">
                  KML, GeoJSON, SHP, WMS, WFS
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[var(--env-text-secondary)]">
                  Proyecciones
                </dt>
                <dd className="mt-1 text-sm text-[var(--env-text-primary)]">
                  WGS84, UTM, Web Mercator
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[var(--env-text-secondary)]">
                  Rendimiento
                </dt>
                <dd className="mt-1 text-sm text-[var(--env-text-primary)]">
                  Hasta 10M puntos, clustering automático
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[var(--env-text-secondary)]">
                  Exportación
                </dt>
                <dd className="mt-1 text-sm text-[var(--env-text-primary)]">
                  PNG, PDF, GeoJSON, CSV
                </dd>
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

function MapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" />
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

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 5v14l11-7-11-7z" />
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
      <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
    </svg>
  );
}

function AnalyticsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
    </svg>
  );
}

function ImportIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
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

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9h5v11H6V4h7v5z" />
    </svg>
  );
}
