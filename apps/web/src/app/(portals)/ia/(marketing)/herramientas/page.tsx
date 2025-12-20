"use client";

import Link from "next/link";
import { Noto_Sans, Space_Grotesk } from "next/font/google";

// TODO: Move metadata to layout.tsx file

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

export default function IAHerramientasPage() {
  return (
    <div
      className={`${noto.variable} ${space.variable} min-h-screen bg-[#000000] text-white`}
    >
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(0,239,255,0.1)] via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img
                src="/images/Portal IA/Aquatech-ia logo light 512.png"
                alt="Aquatech IA"
                className="h-40 w-auto object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-[#00efff] bg-clip-text text-transparent mb-6">
              Herramientas de IA
            </h1>
            <p className="text-lg md:text-xl text-[#CCCCCC] mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore nuestros módulos de inteligencia artificial diseñados para
              potenciar la gestión y el análisis en el sector del agua.
            </p>

            {/* Breadcrumb */}
            <nav className="flex justify-center mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-[#CCCCCC]">
                <li>
                  <Link
                    href="/ia"
                    className="hover:text-[#00efff] transition-colors"
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
                <li className="text-[#00efff] font-medium">Herramientas</li>
              </ol>
            </nav>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-[#1a1b2e]/50 backdrop-blur-sm rounded-xl p-6 border border-[rgba(0,239,255,0.1)]">
                <div className="text-3xl font-bold text-[#00efff] mb-2">4</div>
                <div className="text-[#CCCCCC]">Módulos Disponibles</div>
              </div>
              <div className="bg-[#1a1b2e]/50 backdrop-blur-sm rounded-xl p-6 border border-[rgba(0,239,255,0.1)]">
                <div className="text-3xl font-bold text-[#0095FF] mb-2">
                  100%
                </div>
                <div className="text-[#CCCCCC]">Interactivos</div>
              </div>
              <div className="bg-[#1a1b2e]/50 backdrop-blur-sm rounded-xl p-6 border border-[rgba(0,239,255,0.1)]">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-[#CCCCCC]">Acceso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 md:space-y-20">
            {/* Herramienta 1: LLMs */}
            <article className="bg-gradient-to-br from-[#1a1b2e] to-[#10111a] border border-[rgba(0,239,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,239,255,0.1),0_8px_10px_-6px_rgba(0,239,255,0.1),0_0_0_1px_rgba(0,239,255,0.2)] hover:border-[rgba(0,239,255,0.3)] backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col order-2 lg:order-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      LLM
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Teoría
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Transformer
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                    Cómo funcionan los LLMs
                  </h2>
                  <p className="text-[#CCCCCC] mb-8 text-lg leading-relaxed">
                    Descubra los componentes fundamentales de los Grandes
                    Modelos de Lenguaje (LLMs) y su proceso para generar texto
                    coherente y relevante.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Arquitectura Transformer y mecanismos de atención
                    </ListItem>
                    <ListItem>
                      Pre-entrenamiento vs. Fine-tuning detallado
                    </ListItem>
                    <ListItem>
                      Tokenización y gestión eficiente del contexto
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/ia/herramientas/como-funcionan-llm"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
                    >
                      <PlayIcon />
                      Abrir módulo
                    </Link>
                    <Link
                      href="https://github.com/Pablo-Cubides/Como_funcionan_llm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <DocIcon />
                      Ver en GitHub
                    </Link>
                  </div>
                </div>
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden order-1 lg:order-2 relative">
                  <img
                    alt="Diagrama claro y detallado de la arquitectura de un modelo Transformer"
                    className="w-full h-full object-cover tool-image"
                    src="/images/Portal IA/Herramientas/como-funcionan-llm.png"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Herramienta 2: Parámetros de Decodificación (Top-k / Top-p) */}
            <article className="bg-gradient-to-br from-[#1a1b2e] to-[#10111a] border border-[rgba(0,239,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,239,255,0.1),0_8px_10px_-6px_rgba(0,239,255,0.1),0_0_0_1px_rgba(0,239,255,0.2)] hover:border-[rgba(0,239,255,0.3)] backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden relative">
                  <img
                    alt="Secuencia visual del proceso de difusión"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Decodificación
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Top-k
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Top-p
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                    Explorador de Parámetros de Decodificación
                  </h2>
                  <p className="text-[#CCCCCC] mb-8 text-lg leading-relaxed">
                    Aprende cómo parámetros como Temperature, Top-k y Top-p
                    afectan la generación de texto en modelos de lenguaje y
                    prueba combinaciones en un playground interactivo.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Visualice el efecto de Temperature, Top-k y Top-p
                    </ListItem>
                    <ListItem>
                      Simulador interactivo para entender trade-offs entre
                      control y diversidad
                    </ListItem>
                    <ListItem>
                      Descargue ejemplos y compare salidas para distintos
                      parámetros
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/ia/herramientas/parametros-decodificacion"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
                    >
                      <PlayIcon />
                      Abrir módulo
                    </Link>
                    <Link
                      href="https://github.com/Pablo-Cubides/modelos-difusion"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <DocIcon />
                      Ver en GitHub
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Herramienta 3: Filtrado IA */}
            <article className="bg-gradient-to-br from-[#1a1b2e] to-[#10111a] border border-[rgba(0,239,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,239,255,0.1),0_8px_10px_-6px_rgba(0,239,255,0.1),0_0_0_1px_rgba(0,239,255,0.2)] hover:border-[rgba(0,239,255,0.3)] backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col order-2 lg:order-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Seguridad
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Filtrado
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      RLHF
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                    Cómo la IA filtra las respuestas
                  </h2>
                  <p className="text-[#CCCCCC] mb-8 text-lg leading-relaxed">
                    Comprenda los mecanismos de seguridad y moderación que
                    utiliza la IA para analizar y clasificar las entradas del
                    usuario.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Pipeline de moderación y políticas de uso detalladas
                    </ListItem>
                    <ListItem>
                      Clasificación de riesgo y RLHF (Reinforcement Learning
                      from Human Feedback)
                    </ListItem>
                    <ListItem>
                      Manejo de contenido sensible y protocolos de seguridad
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/ia/herramientas/filtrado-ia"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
                    >
                      <PlayIcon />
                      Abrir módulo
                    </Link>
                    <Link
                      href="https://github.com/Pablo-Cubides/filtrado-ia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <DocIcon />
                      Ver en GitHub
                    </Link>
                  </div>
                </div>
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden order-1 lg:order-2 relative">
                  <img
                    alt="Diagrama de flujo del pipeline de moderación de IA"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Herramienta 4: Visor de Difusión */}
            <article className="bg-gradient-to-br from-[#1a1b2e] to-[#10111a] border border-[rgba(0,239,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,239,255,0.1),0_8px_10px_-6px_rgba(0,239,255,0.1),0_0_0_1px_rgba(0,239,255,0.2)] hover:border-[rgba(0,239,255,0.3)] backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden relative">
                  <img
                    alt="Visor interactivo para visualizar el proceso de difusión y resultados"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Visualizador
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Difusión
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Interactivo
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                    Visor de Difusión
                  </h2>
                  <p className="text-[#CCCCCC] mb-8 text-lg leading-relaxed">
                    Visualice paso a paso cómo los modelos de difusión generan
                    imágenes y explore parámetros e iteraciones en una interfaz
                    interactiva.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Reproduzca la secuencia de denoising y observe cambios por
                      paso
                    </ListItem>
                    <ListItem>
                      Ajuste parámetros como guía por texto y ruido inicial
                    </ListItem>
                    <ListItem>
                      Compare resultados con diferentes schedulers y seeds
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/ia/herramientas/visor-difusion"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
                    >
                      <PlayIcon />
                      Abrir módulo
                    </Link>
                    <Link
                      href="https://github.com/Pablo-Cubides/visor-difusion"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <DocIcon />
                      Ver en GitHub
                    </Link>
                  </div>
                </div>
              </div>
            </article>
            {/* Herramienta 5: Papers IA */}
            <article className="bg-gradient-to-br from-[#1a1b2e] to-[#10111a] border border-[rgba(0,239,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,239,255,0.1),0_8px_10px_-6px_rgba(0,239,255,0.1),0_0_0_1px_rgba(0,239,255,0.2)] hover:border-[rgba(0,239,255,0.3)] backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col order-2 lg:order-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Investigación
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Recursos
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Papers
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                    Papers y Recursos
                  </h2>
                  <p className="text-[#CCCCCC] mb-8 text-lg leading-relaxed">
                    Acceda a una colección centralizada de papers técnicos,
                    investigaciones y recursos académicos fundamentales para el
                    aprendizaje de IA.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Biblioteca curada de literatura técnica
                    </ListItem>
                    <ListItem>
                      Recursos de implementación y guías de estudio
                    </ListItem>
                    <ListItem>
                      Referencias académicas clave y estado del arte
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/ia/herramientas/papers-ia"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
                    >
                      <PlayIcon />
                      Explorar recursos
                    </Link>
                    <Link
                      href="https://github.com/Pablo-Cubides/papers-ia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <DocIcon />
                      Ver en GitHub
                    </Link>
                  </div>
                </div>
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden order-1 lg:order-2 relative">
                  <img
                    alt="Biblioteca de recursos y papers de investigación"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Herramienta 6: Modelos de Tendencia */}
            <article className="bg-gradient-to-br from-[#1a1b2e] to-[#10111a] border border-[rgba(0,239,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,239,255,0.1),0_8px_10px_-6px_rgba(0,239,255,0.1),0_0_0_1px_rgba(0,239,255,0.2)] hover:border-[rgba(0,239,255,0.3)] backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="h-64 lg:h-full min-h-[400px] overflow-hidden relative">
                  <img
                    alt="Análisis de tendencias y modelos predictivos"
                    className="w-full h-full object-cover tool-image"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
                      ✓ Disponible
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 lg:p-16 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Predicción
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Series de Tiempo
                    </span>
                    <span className="bg-gradient-to-br from-[rgba(0,239,255,0.15)] to-[rgba(0,149,255,0.15)] border border-[rgba(0,239,255,0.2)] text-[#00efff] text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                      Análisis
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                    Modelos de Tendencia
                  </h2>
                  <p className="text-[#CCCCCC] mb-8 text-lg leading-relaxed">
                    Explore herramientas no paramétricas para la detección y
                    análisis de tendencias en series temporales ambientales,
                    como el test de Mann-Kendall.
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <ListItem>
                      Detección robusta de tendencias monóticas
                    </ListItem>
                    <ListItem>
                      Estimación de la magnitud de cambio (Pendiente de Sen)
                    </ListItem>
                    <ListItem>
                      Aplicación en datos hidrológicos y climáticos
                    </ListItem>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/ia/herramientas/modelos-tendencia"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
                    >
                      <PlayIcon />
                      Abrir módulo
                    </Link>
                    <Link
                      href="https://github.com/Pablo-Cubides/modelos-tendencia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <DocIcon />
                      Ver en GitHub
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Call to Action */}
          <section className="mt-20 md:mt-32 bg-[#000000] rounded-2xl p-8 md:p-12 text-center border border-[rgba(0,239,255,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,239,255,0.05)] to-[rgba(0,149,255,0.05)]"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                ¿Interesado en desarrollar IA personalizada?
              </h2>
              <p className="text-xl mb-8 text-[#CCCCCC] max-w-2xl mx-auto">
                Nuestro equipo puede crear soluciones de IA específicas para sus
                necesidades en el sector acuático.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ia/contacto"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
                >
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
                <Link
                  href="/ia/nosotros"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                ¿Por qué elegir nuestros módulos de IA?
              </h2>
              <p className="text-lg text-[#CCCCCC] max-w-3xl mx-auto">
                Tecnología de vanguardia aplicada al aprendizaje y comprensión
                de la inteligencia artificial
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🧠",
                  title: "Contenido Experto",
                  description:
                    "Desarrollado por especialistas en IA y machine learning",
                },
                {
                  icon: "⚡",
                  title: "Interactividad Real",
                  description:
                    "Módulos completamente funcionales con ejemplos prácticos",
                },
                {
                  icon: "🔬",
                  title: "Rigor Científico",
                  description:
                    "Basado en las últimas investigaciones y papers académicos",
                },
                {
                  icon: "🎯",
                  title: "Aplicación Práctica",
                  description:
                    "Enfocado en casos de uso reales del sector acuático",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#10111A]/50 p-6 rounded-xl border border-[rgba(0,239,255,0.1)] text-center group hover:border-[rgba(0,239,255,0.3)] transition-all backdrop-blur-sm"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00efff] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#CCCCCC]">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#10111A] border-t border-[rgba(0,239,255,0.1)] mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#00efff]">
                AquatechIA
              </h3>
              <p className="text-[#CCCCCC]">
                Democratizando el conocimiento de IA para el sector acuático.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2 text-[#CCCCCC]">
                <li>
                  <Link
                    href="/ia"
                    className="hover:text-[#00efff] transition-colors"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ia/blog"
                    className="hover:text-[#00efff] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ia/nosotros"
                    className="hover:text-[#00efff] transition-colors"
                  >
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ia/contacto"
                    className="hover:text-[#00efff] transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Módulos</h3>
              <ul className="space-y-2 text-[#CCCCCC]">
                <li>
                  <Link
                    href="/ia/herramientas/como-funcionan-llm"
                    className="hover:text-[#00efff] transition-colors text-sm"
                  >
                    Cómo funcionan los LLMs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ia/herramientas/parametros-decodificacion"
                    className="hover:text-[#00efff] transition-colors text-sm"
                  >
                    Parámetros de Decodificación
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ia/herramientas/filtrado-ia"
                    className="hover:text-[#00efff] transition-colors text-sm"
                  >
                    Filtrado de IA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ia/herramientas/visor-difusion"
                    className="hover:text-[#00efff] transition-colors text-sm"
                  >
                    Visor de Difusión
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[rgba(0,239,255,0.1)] mt-8 pt-8 text-center">
            <p className="text-[#CCCCCC]">
              © 2024 AquatechIA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- UI Components ---------- */
function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <svg
        className="w-6 h-6 text-[#00efff] mr-4 flex-shrink-0 mt-1"
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
      <span className="text-[#CCCCCC] text-lg">{children}</span>
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
