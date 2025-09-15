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

export default function ModelosDifusionPage() {
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
          --accent-orange: #f59e0b;
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

        .diffusion-step {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.1) 0%,
            rgba(245, 158, 11, 0.05) 100%
          );
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: var(--accent-orange);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
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
                  Modelos de Difusión
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] text-white">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl text-[var(--text-primary)] lg:text-4xl">
                      Cómo funcionan los Modelos de Difusión
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="status-badge">
                        <CheckIcon className="h-4 w-4" />
                        Disponible
                      </span>
                      <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-sm font-semibold text-purple-300">
                        v2.1.0
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-6 max-w-3xl text-lg text-[var(--text-secondary)] leading-relaxed">
                  Módulo interactivo que explora el proceso iterativo de los
                  modelos de difusión para generar imágenes de alta calidad a
                  partir de ruido gaussiano y prompts de texto.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="tech-badge">🎨 Difusión</span>
                  <span className="tech-badge">🖼️ Generación</span>
                  <span className="tech-badge">🔗 U-Net</span>

                  <div className="ml-auto flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <UpdateIcon className="h-4 w-4" />
                      Actualizado: 10/09/2024
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CodeIcon className="h-4 w-4" />
                      ID: diff_v2_3c8b
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-3">
                <Link
                  href="#visor-app"
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-purple)]"
                >
                  <SparklesIcon className="h-5 w-5" />
                  Explorar Difusión
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

          {/* Diffusion Process Steps */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="diffusion-step">
              <div className="text-lg font-bold mb-1">Paso 1</div>
              <div className="text-sm">Ruido Inicial</div>
            </div>
            <div className="diffusion-step">
              <div className="text-lg font-bold mb-1">Paso 2</div>
              <div className="text-sm">Predicción</div>
            </div>
            <div className="diffusion-step">
              <div className="text-lg font-bold mb-1">Paso 3</div>
              <div className="text-sm">Denoising</div>
            </div>
            <div className="diffusion-step">
              <div className="text-lg font-bold mb-1">Paso 4</div>
              <div className="text-sm">Refinamiento</div>
            </div>
            <div className="diffusion-step">
              <div className="text-lg font-bold mb-1">Paso 5</div>
              <div className="text-sm">Imagen Final</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8 feature-grid">
            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <NoiseIcon className="h-6 w-6 text-[var(--accent-purple)]" />
                <h3 className="text-lg font-semibold">Proceso de Ruido</h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Comprenda cómo se añade y elimina ruido de forma controlada
                durante el proceso iterativo.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <NetworkIcon className="h-6 w-6 text-[var(--accent-pink)]" />
                <h3 className="text-lg font-semibold">Arquitectura U-Net</h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Explore el rol de la red neuronal U-Net y el scheduler temporal
                en la generación.
              </p>
            </div>

            <div className="feature-card">
              <div className="mb-3 flex items-center gap-3">
                <TextIcon className="h-6 w-6 text-[var(--primary-cyan)]" />
                <h3 className="text-lg font-semibold">Guiado por Texto</h3>
              </div>
              <p className="text-[var(--text-secondary)]">
                Descubra cómo los prompts de texto dirigen el proceso de
                generación de imágenes.
              </p>
            </div>
          </div>

          {/* App Container */}
          <section
            id="visor-app"
            aria-label="Módulo Modelos de Difusión"
            className="mb-8"
          >
            <div className="app-container flex flex-col">
              <div className="absolute inset-0 hero-glow"></div>
              <div className="relative flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] text-white">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-[var(--text-primary)]">
                    Módulo Interactivo: Difusión
                  </h3>
                  <p className="max-w-md mx-auto text-[var(--text-secondary)] mb-6">
                    Visualización paso a paso del proceso de generación de
                    imágenes mediante modelos de difusión.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold">
                      <SparklesIcon className="h-4 w-4" />
                      Generar Imagen
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
                src="https://diffusion-module.aquatechia.vercel.app"
                className="absolute inset-0 h-full w-full rounded-2xl"
                loading="lazy"
                title="Módulo Interactivo: Modelos de Difusión"
                allow="clipboard-read; clipboard-write"
              />
              */}
            </div>
          </section>

          {/* Technical Details & Model Types */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl panel p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--accent-purple)]">
                Modelos Incluidos
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    name: "Stable Diffusion",
                    desc: "Modelo base para generación de imágenes de alta calidad",
                    version: "v2.1",
                  },
                  {
                    name: "DALL-E 2",
                    desc: "Arquitectura CLIP para generación guiada por texto",
                    version: "OpenAI",
                  },
                  {
                    name: "Midjourney",
                    desc: "Modelo especializado en arte y creatividad",
                    version: "v5",
                  },
                  {
                    name: "Imagen",
                    desc: "Modelo de Google para generación fotorrealística",
                    version: "Google",
                  },
                ].map((model) => (
                  <div
                    key={model.name}
                    className="border-b border-[var(--border-color)] pb-3 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-[var(--text-primary)]">
                        {model.name}
                      </div>
                      <div className="text-xs text-[var(--accent-purple)] bg-purple-500/10 px-2 py-1 rounded">
                        {model.version}
                      </div>
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      {model.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl panel p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--accent-pink)]">
                Conceptos Avanzados
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    concept: "Scheduler/Sampler",
                    desc: "Algoritmos que controlan el proceso de denoising (DDPM, DDIM, LMS)",
                  },
                  {
                    concept: "Guidance Scale",
                    desc: "Parámetro que controla la adherencia al prompt de texto",
                  },
                  {
                    concept: "Latent Space",
                    desc: "Espacio de menor dimensión donde ocurre la difusión",
                  },
                  {
                    concept: "VAE (Encoder/Decoder)",
                    desc: "Codifica imágenes a latents y decodifica de vuelta",
                  },
                  {
                    concept: "Cross-Attention",
                    desc: "Mecanismo que conecta texto con representaciones visuales",
                  },
                ].map((item) => (
                  <div
                    key={item.concept}
                    className="border-b border-[var(--border-color)] pb-3 last:border-0"
                  >
                    <div className="font-medium text-[var(--text-primary)] mb-1">
                      {item.concept}
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

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5l3.5-4.5 2.5 3.01L14.5 12l4.5 5.99V19z" />
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

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 11H7l1.5-4.5L10 11zM11 9l1.5-4.5L14 9h-3zM10 13l1.5 4.5L13 13h-3zM12 11l-1.5-4.5L9 11h3z" />
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

function NoiseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
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
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </svg>
  );
}

function TextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
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
