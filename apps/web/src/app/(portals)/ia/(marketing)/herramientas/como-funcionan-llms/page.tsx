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

export default function LLMsPage() {
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
            var(--primary-cyan) 0%,
            #33f0ff 100%
          );
          color: var(--deep-blue);
          border: none;
          font-weight: 600;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 239, 255, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 239, 255, 0.5);
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
          border-color: rgba(0, 239, 255, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 239, 255, 0.1);
        }

        .status-badge {
          background: linear-gradient(
            135deg,
            var(--accent-green) 0%,
            #059669 100%
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
          border-color: rgba(0, 239, 255, 0.3);
          background: linear-gradient(
            145deg,
            rgba(26, 27, 46, 0.8) 0%,
            rgba(16, 17, 26, 0.8) 100%
          );
        }

        .tech-badge {
          background: linear-gradient(
            135deg,
            rgba(0, 239, 255, 0.15) 0%,
            rgba(0, 149, 255, 0.15) 100%
          );
          border: 1px solid rgba(0, 239, 255, 0.2);
          color: var(--primary-cyan);
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .hero-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(0, 239, 255, 0.1) 0%,
            transparent 70%
          );
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
                <li className="font-medium text-[var(--primary-cyan)]">
                  Cómo funcionan los LLMs
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--secondary-cyan)] text-[var(--deep-blue)]">
                    <BrainIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl text-[var(--text-primary)] lg:text-4xl">
                      Cómo funcionan los LLMs
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="status-badge">
                        <CheckIcon className="h-4 w-4" />
                        Disponible
                      </span>
                      <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-300">
                        v1.5.2
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-6 max-w-3xl text-lg text-[var(--text-secondary)] leading-relaxed">
                  Módulo interactivo que explora los componentes fundamentales
                  de los Grandes Modelos de Lenguaje (LLMs) y su proceso para
                  generar texto coherente y contextualmente relevante.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="tech-badge">🧠 LLM</span>
                  <span className="tech-badge">📚 Teoría</span>
                  <span className="tech-badge">🔄 Transformer</span>

                  <div className="ml-auto flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <UpdateIcon className="h-4 w-4" />
                      Actualizado: 08/09/2024
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CodeIcon className="h-4 w-4" />
                      ID: llm_v1_7f2a
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-3">
                <Link
                  href="#visor-app"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-cyan)]"
                >
                  <PlayIcon className="h-5 w-5" />
                  Explorar Módulo
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

          {/* Learning Path */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl panel p-4 text-center">
              <div className="text-2xl font-bold text-[var(--primary-cyan)] mb-1">
                01
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Arquitectura Base
              </div>
            </div>
            <div className="rounded-xl panel p-4 text-center">
              <div className="text-2xl font-bold text-[var(--secondary-cyan)] mb-1">
                02
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Entrenamiento
              </div>
            </div>
            <div className="rounded-xl panel p-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent-purple)] mb-1">
                03
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Tokenización
              </div>
            </div>
            <div className="rounded-xl panel p-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent-green)] mb-1">
                04
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                Generación
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8 feature-grid">
            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <NetworkIcon className="h-6 w-6 text-[var(--primary-cyan)]" />
                <h3 className="text-lg font-semibold">
                  Arquitectura Transformer
                </h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Comprenda los mecanismos de atención y cómo las capas
                transformer procesan secuencias de texto.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <TrainingIcon className="h-6 w-6 text-[var(--secondary-cyan)]" />
                <h3 className="text-lg font-semibold">
                  Pre-entrenamiento vs Fine-tuning
                </h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Explore las diferencias entre el entrenamiento inicial masivo y
                la especialización posterior.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <TokenIcon className="h-6 w-6 text-[var(--accent-purple)]" />
                <h3 className="text-lg font-semibold">Tokenización Avanzada</h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Descubra cómo los modelos dividen y procesan el texto en
                unidades manejables.
              </p>
            </div>
          </div>

          {/* App Container */}
          <section
            id="visor-app"
            aria-label="Módulo LLMs Interactivo"
            className="mb-8"
          >
            <div className="app-container flex flex-col">
              <div className="absolute inset-0 hero-glow"></div>
              <div className="relative flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--secondary-cyan)] text-[var(--deep-blue)]">
                    <BrainIcon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-[var(--text-primary)]">
                    Módulo Interactivo: LLMs
                  </h3>
                  <p className="max-w-md mx-auto text-[var(--text-secondary)] mb-6">
                    Exploración visual e interactiva de la arquitectura y
                    funcionamiento de los Grandes Modelos de Lenguaje.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <PlayIcon className="h-4 w-4" />
                      Iniciar Módulo
                    </button>
                    <button className="btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <BookIcon className="h-4 w-4" />
                      Documentación
                    </button>
                  </div>
                </div>
              </div>

              {/* Placeholder for actual iframe/component */}
              {/*
              <iframe
                src="https://llms-module.aquatechia.vercel.app"
                className="absolute inset-0 h-full w-full rounded-2xl"
                loading="lazy"
                title="Módulo Interactivo: Cómo funcionan los LLMs"
                allow="clipboard-read; clipboard-write"
              />
              */}
            </div>
          </section>

          {/* Technical Deep Dive */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl panel p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--primary-cyan)]">
                Conceptos Clave
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    term: "Attention Mechanism",
                    desc: "Sistema que permite al modelo enfocarse en partes relevantes del input",
                  },
                  {
                    term: "Embedding Layers",
                    desc: "Representaciones vectoriales densas de tokens de entrada",
                  },
                  {
                    term: "Multi-Head Attention",
                    desc: "Múltiples mecanismos de atención ejecutándose en paralelo",
                  },
                  {
                    term: "Position Encoding",
                    desc: "Información posicional añadida a los embeddings de entrada",
                  },
                  {
                    term: "Feed-Forward Networks",
                    desc: "Capas densas que procesan las representaciones de atención",
                  },
                ].map((concept) => (
                  <div
                    key={concept.term}
                    className="border-b border-[var(--border-color)] pb-3 last:border-0"
                  >
                    <div className="font-medium text-[var(--text-primary)] mb-1">
                      {concept.term}
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      {concept.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl panel p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--secondary-cyan)]">
                Especificaciones Técnicas
              </h3>
              <div className="grid gap-4 text-sm">
                <div>
                  <dt className="font-medium text-[var(--text-secondary)] mb-1">
                    Modelos Cubiertos
                  </dt>
                  <dd className="text-[var(--text-primary)]">
                    GPT, BERT, T5, LLaMA, Claude, Gemini
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--text-secondary)] mb-1">
                    Visualizaciones
                  </dt>
                  <dd className="text-[var(--text-primary)]">
                    Diagramas interactivos, animaciones 3D
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--text-secondary)] mb-1">
                    Ejercicios Prácticos
                  </dt>
                  <dd className="text-[var(--text-primary)]">
                    12 simulaciones hands-on
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--text-secondary)] mb-1">
                    Nivel de Detalle
                  </dt>
                  <dd className="text-[var(--text-primary)]">
                    Desde básico hasta implementación
                  </dd>
                </div>
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

function BrainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C8.69 2 6 4.69 6 8c0 1.89.87 3.58 2.23 4.69C7.34 13.5 7 14.21 7 15c0 2.76 2.24 5 5 5s5-2.24 5-5c0-.79-.34-1.5-1.23-2.31C17.13 11.58 18 9.89 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4 0 1.67-1.02 3.1-2.47 3.69-.42-.4-.93-.69-1.53-.69s-1.11.29-1.53.69C9.02 11.1 8 9.67 8 8c0-2.21 1.79-4 4-4z" />
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

function NetworkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function TrainingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm0 2.16L18.84 9 12 12.84 5.16 9 12 5.16zm5 8.26l-5 2.7-5-2.7V11l5 2.7L17 11v2.42z" />
    </svg>
  );
}

function TokenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
    </svg>
  );
}
