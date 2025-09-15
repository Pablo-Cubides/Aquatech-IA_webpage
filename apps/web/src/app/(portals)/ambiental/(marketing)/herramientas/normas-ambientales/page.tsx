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

export default function NormasAmbientalesPage() {
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
          --env-warning: #f59e0b;
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

        .country-badge {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.1) 0%,
            rgba(245, 158, 11, 0.05) 100%
          );
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: #d97706;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
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
                  Normas Ambientales
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--env-accent-secondary)] to-[var(--env-info)] text-white">
                    <DocumentIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl text-[var(--env-text-primary)] lg:text-4xl">
                      Normas Ambientales Latinoamericanas
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="status-badge">
                        <CheckIcon className="h-4 w-4" />
                        Disponible
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        v4.1.2
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-6 max-w-3xl text-lg text-[var(--env-text-secondary)] leading-relaxed">
                  Base de datos completa y actualizada de regulaciones
                  ambientales de América Latina. Búsquedas avanzadas,
                  comparativas legislativas y alertas automáticas de cambios
                  normativos.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    📋 Normativa
                  </span>
                  <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                    ✅ Cumplimiento
                  </span>
                  <span className="country-badge">🌎 LatAm</span>

                  <div className="ml-auto flex items-center gap-4 text-sm text-[var(--env-text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <UpdateIcon className="h-4 w-4" />
                      Actualizado: 12/09/2024
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DatabaseIcon className="h-4 w-4" />
                      ID: norm_v4_8c3f
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-3">
                <Link
                  href="#visor-app"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--env-accent)]"
                >
                  <SearchIcon className="h-5 w-5" />
                  Buscar Normas
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

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[var(--env-accent)]">
                18
              </div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Países Cubiertos
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[var(--env-accent-secondary)]">
                2,400+
              </div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Normas Indexadas
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[var(--env-info)]">
                15
              </div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Categorías
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[var(--env-success)]">
                24h
              </div>
              <div className="text-sm text-[var(--env-text-secondary)]">
                Actualización
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8 feature-grid">
            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <SearchIcon className="h-6 w-6 text-[var(--env-accent-secondary)]" />
                <h3 className="text-lg font-semibold">Búsqueda Avanzada</h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Filtre por país, sector, tipo de norma, fecha de publicación y
                palabras clave específicas.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <CompareIcon className="h-6 w-6 text-[var(--env-accent)]" />
                <h3 className="text-lg font-semibold">Comparativas</h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Compare legislaciones entre países y identifique diferencias en
                criterios ambientales.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <BellIcon className="h-6 w-6 text-[var(--env-warning)]" />
                <h3 className="text-lg font-semibold">Alertas Automáticas</h3>
              </div>
              <p className="text-[var(--env-text-secondary)]">
                Reciba notificaciones sobre nuevas publicaciones y cambios en la
                normativa de su interés.
              </p>
            </div>
          </div>

          {/* App Container */}
          <section
            id="visor-app"
            aria-label="Base de Datos de Normas Ambientales"
            className="mb-8"
          >
            <div className="app-container flex flex-col">
              <div className="flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--env-accent-secondary)] to-[var(--env-info)] text-white">
                    <DocumentIcon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-[var(--env-text-primary)]">
                    Base de Datos de Normas Ambientales
                  </h3>
                  <p className="max-w-md mx-auto text-[var(--env-text-secondary)] mb-6">
                    Sistema de búsqueda y consulta de regulaciones ambientales
                    latinoamericanas con funciones avanzadas de filtrado.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <SearchIcon className="h-4 w-4" />
                      Buscar Normas
                    </button>
                    <button className="btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <FilterIcon className="h-4 w-4" />
                      Filtros Avanzados
                    </button>
                  </div>
                </div>
              </div>

              {/* Placeholder for actual iframe/component */}
              {/*
              <iframe
                src="https://normas-app.aquatechia.vercel.app"
                className="absolute inset-0 h-full w-full rounded-2xl"
                loading="lazy"
                title="Base de Datos de Normas Ambientales"
              />
              */}
            </div>
          </section>

          {/* Coverage & Categories */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">
                Cobertura Geográfica
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  "🇦🇷 Argentina",
                  "🇧🇴 Bolivia",
                  "🇧🇷 Brasil",
                  "🇨🇱 Chile",
                  "🇨🇴 Colombia",
                  "🇨🇷 Costa Rica",
                  "🇪🇨 Ecuador",
                  "🇸🇻 El Salvador",
                  "🇬🇹 Guatemala",
                  "🇭🇳 Honduras",
                  "🇲🇽 México",
                  "🇳🇮 Nicaragua",
                  "🇵🇦 Panamá",
                  "🇵🇾 Paraguay",
                  "🇵🇪 Perú",
                  "🇩🇴 Rep. Dominicana",
                  "🇺🇾 Uruguay",
                  "🇻🇪 Venezuela",
                ].map((country) => (
                  <span
                    key={country}
                    className="text-[var(--env-text-secondary)]"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">
                Categorías Principales
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  "💧 Recursos Hídricos",
                  "🌬️ Calidad del Aire",
                  "🗑️ Gestión de Residuos",
                  "🏭 Emisiones Industriales",
                  "🌿 Biodiversidad",
                  "🏞️ Áreas Protegidas",
                  "⚡ Energías Renovables",
                  "🏗️ Evaluación Ambiental",
                  "🌡️ Cambio Climático",
                  "🐟 Recursos Marinos",
                  "🌾 Suelos Agrícolas",
                  "🏘️ Zonificación",
                  "📊 Monitoreo Ambiental",
                  "⚖️ Infracciones",
                  "🔬 Sustancias Químicas",
                ].map((category) => (
                  <div
                    key={category}
                    className="text-[var(--env-text-secondary)]"
                  >
                    {category}
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

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
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

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
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

function CompareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
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
