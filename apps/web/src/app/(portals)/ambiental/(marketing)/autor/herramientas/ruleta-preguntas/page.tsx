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

export default function RuletaPreguntasAmbientalPage() {
  return (
    <div
      className={`${space.variable} ${noto.variable} min-h-screen bg-[#F5F9F8] text-[#0D161C]`}
    >
      {/* Design System */}
      <style jsx global>{`
        :root {
          --primary-green: #10b981;
          --accent-blue: #3b82f6;
          --accent-teal: #14b8a6;
          --light-bg: #f5f9f8;
          --panel-bg: #ffffff;
          --text-primary: #0d161c;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
        }

        .container-app {
          background: var(--panel-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          min-height: 600px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
              rgba(59, 130, 246, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(20, 184, 166, 0.05) 0%,
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
                  href="/ambiental"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-green)]"
                >
                  Ambiental
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
              <li>
                <Link
                  href="/ambiental/autor/pablo-cubides"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-green)]"
                >
                  Pablo Cubides
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
              <li>
                <span className="text-[var(--primary-green)]">
                  Ruleta de Preguntas
                </span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Ruleta de Preguntas
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Herramienta estudiantil
                </p>
              </div>
            </div>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Genera preguntas aleatorias sobre ciencias ambientales, gestión
              del agua y sostenibilidad para estudiar y practicar tus
              conocimientos.
            </p>
          </div>

          {/* App Container */}
          <div className="container-app mb-12">
            <div className="app-content">
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                  <RotateCcw className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Aplicación en Desarrollo
                </h3>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                  Esta herramienta está siendo desarrollada. Pronto podrás
                  generar preguntas aleatorias para estudiar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Notificarme cuando esté lista
                  </button>
                  <Link
                    href="/ambiental/autor/pablo-cubides"
                    className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
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
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Múltiples Categorías
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Preguntas sobre gestión del agua, calidad ambiental, PTAP/PTAR y
                más
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-green)] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Niveles de Dificultad
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Desde básico hasta avanzado, adaptado a tu nivel de conocimiento
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--primary-green)] to-[var(--accent-blue)] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Explicaciones Detalladas
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Cada respuesta incluye explicaciones y recursos adicionales
              </p>
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-[var(--border-color)]">
            <h3 className="text-xl font-bold mb-6">
              Otras Herramientas Estudiantiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/ambiental/autor/herramientas/consulta-nota"
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-color)] bg-white hover:border-[var(--primary-green)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--primary-green)] to-[var(--accent-blue)] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-[var(--primary-green)]">
                    Consulta tu Nota
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Revisa tus calificaciones
                  </p>
                </div>
              </Link>
              <Link
                href="/ambiental/autor/herramientas/analisis-correlaciones"
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-color)] bg-white hover:border-[var(--accent-teal)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-green)] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-[var(--accent-teal)]">
                    Análisis de Correlaciones
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Visualiza datos y estadísticas
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

function Layers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function Target(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
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
