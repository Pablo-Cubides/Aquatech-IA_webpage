"use client";

import Link from "next/link";
import { Space_Grotesk, Noto_Sans } from "next/font/google";

// TODO: Move metadata to layout.tsx file

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-sans",
});

export default function AnalisisCorrelacionesIAPage() {
  return (
    <div
      className={`${space.variable} ${noto.variable} min-h-screen bg-[#000000] text-white`}
    >
      {/* Design System */}
      <style jsx global>{`
        :root {
          --primary-cyan: #00efff;
          --accent-purple: #8b5cf6;
          --accent-pink: #ec4899;
          --accent-orange: #f59e0b;
          --deep-blue: #000000;
          --panel-bg: #10111a;
          --text-primary: #ffffff;
          --text-secondary: #CCCCCC;
          --border-color: rgba(0, 239, 255, 0.1);
        }

        .container-app {
          background: linear-gradient(
            145deg,
            var(--panel-bg) 0%,
            var(--deep-blue) 100%
          );
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          min-height: 600px;
          position: relative;
          overflow: hidden;
        }

        .container-app::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(236, 72, 153, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(245, 158, 11, 0.1) 0%,
              transparent 50%
            );
          pointer-events: none;
        }

        .app-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <main className="px-4 md:px-8 py-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  href="/ia"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-cyan)]"
                >
                  IA
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
              <li>
                <Link
                  href="/ia/autor/pablo-cubides"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-cyan)]"
                >
                  Pablo Cubides
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
              <li>
                <span className="text-[var(--primary-cyan)]">
                  Análisis de Correlaciones
                </span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-orange)] flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Análisis de Correlaciones
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Herramienta estudiantil
                </p>
              </div>
            </div>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Visualiza y analiza correlaciones entre variables con gráficos
              interactivos y estadísticas para proyectos de IA y ciencia de
              datos.
            </p>
          </div>

          {/* App Container */}
          <div className="container-app mb-12">
            <div className="app-content">
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-orange)] flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Aplicación en Desarrollo
                </h3>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                  Esta herramienta está siendo desarrollada. Pronto podrás
                  analizar correlaciones y visualizar datos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-orange)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Notificarme cuando esté lista
                  </button>
                  <Link
                    href="/ia/autor/pablo-cubides"
                    className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Volver al perfil
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-orange)] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Gráficos Interactivos
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Visualizaciones dinámicas con zoom, filtros y múltiples vistas
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-purple)] flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Matrices de Correlación
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Heatmaps y matrices completas con coeficientes de correlación
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--accent-purple)] to-[var(--primary-cyan)] flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exportar Análisis</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Descarga gráficos en alta resolución y reportes estadísticos
              </p>
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-[var(--panel-bg)] rounded-2xl p-8 border border-[var(--border-color)]">
            <h3 className="text-xl font-bold mb-6">
              Otras Herramientas Estudiantiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/ia/autor/herramientas/consulta-nota"
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--primary-cyan)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--primary-cyan)] to-[var(--accent-purple)] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-[var(--primary-cyan)]">
                    Consulta tu Nota
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Revisa tus calificaciones
                  </p>
                </div>
              </Link>
              <Link
                href="/ia/autor/herramientas/ruleta-preguntas"
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-purple)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-[var(--accent-purple)]">
                    Ruleta de Preguntas
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Practica con preguntas aleatorias
                  </p>
                </div>
              </Link>
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

function TrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
    </svg>
  );
}

function BarChart3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function Grid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function Download(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function RotateCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
