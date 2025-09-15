"use client";

import Image from "next/image";
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

export default function ProductosIAPage() {
  const productos = [
    {
      id: "aquatech-framework",
      type: "Framework",
      category: "Full-Stack",
      title: "AquaTech Framework",
      description:
        "Framework completo para desarrollo de aplicaciones IA con FastAPI + Next.js + Tailwind v4",
      features: [
        "Authentication",
        "Database ORM",
        "AI Integrations",
        "Observability",
      ],
      image: "/images/products/aquatech-framework.jpg",
      price: "Gratis",
      status: "available",
      level: "Intermedio",
      duration: "Proyecto base",
      tech: ["FastAPI", "Next.js", "Prisma", "Tailwind"],
      href: "/ia/productos/aquatech-framework",
    },
    {
      id: "llm-toolkit",
      type: "Herramienta",
      category: "LLMs",
      title: "LLM Development Toolkit",
      description:
        "Kit de herramientas para integración y desarrollo con Large Language Models",
      features: [
        "RAG Pipeline",
        "Agent Orchestration",
        "Memory Management",
        "Prompt Engineering",
      ],
      image: "/images/products/llm-toolkit.jpg",
      price: "$49/mes",
      status: "available",
      level: "Avanzado",
      duration: "Acceso completo",
      tech: ["LangChain", "CrewAI", "OpenAI", "Ollama"],
      href: "/ia/productos/llm-toolkit",
    },
    {
      id: "vision-api",
      type: "API",
      category: "Computer Vision",
      title: "Vision AI API",
      description:
        "API para procesamiento de imágenes con modelos de difusión y ControlNet",
      features: [
        "Image Generation",
        "Style Transfer",
        "Object Detection",
        "Face Enhancement",
      ],
      image: "/images/products/vision-api.jpg",
      price: "$0.10/imagen",
      status: "beta",
      level: "Principiante",
      duration: "Pay-per-use",
      tech: ["Stable Diffusion", "ControlNet", "FLUX", "InstantID"],
      href: "/ia/productos/vision-api",
    },
    {
      id: "optimization-suite",
      type: "Suite",
      category: "Optimización",
      title: "AI Optimization Suite",
      description:
        "Suite de herramientas para optimización de procesos con redes neuronales",
      features: [
        "Process Modeling",
        "Neural Networks",
        "Statistical Analysis",
        "Real-time Monitoring",
      ],
      image: "/images/products/optimization-suite.jpg",
      price: "$199/mes",
      status: "coming-soon",
      level: "Experto",
      duration: "Licencia empresarial",
      tech: ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas"],
      href: "/ia/productos/optimization-suite",
    },
    {
      id: "rag-builder",
      type: "Plataforma",
      category: "RAG",
      title: "RAG Application Builder",
      description:
        "Plataforma no-code para crear aplicaciones RAG personalizadas",
      features: [
        "Document Processing",
        "Vector Database",
        "Query Interface",
        "Custom Embeddings",
      ],
      image: "/images/products/rag-builder.jpg",
      price: "$79/mes",
      status: "available",
      level: "Intermedio",
      duration: "Suscripción mensual",
      tech: ["ChromaDB", "Pinecone", "Embeddings", "FastAPI"],
      href: "/ia/productos/rag-builder",
    },
    {
      id: "ai-agents-platform",
      type: "Plataforma",
      category: "Agentes",
      title: "AI Agents Platform",
      description:
        "Plataforma para crear y desplegar agentes de IA inteligentes y colaborativos",
      features: [
        "Multi-Agent Systems",
        "Task Automation",
        "Workflow Builder",
        "API Integrations",
      ],
      image: "/images/products/ai-agents-platform.jpg",
      price: "$149/mes",
      status: "available",
      level: "Avanzado",
      duration: "Licencia completa",
      tech: ["CrewAI", "AutoGen", "LangChain", "n8n"],
      href: "/ia/productos/ai-agents-platform",
    },
  ];

  const categorias = [
    "Todos",
    "Framework",
    "LLMs",
    "Computer Vision",
    "Optimización",
    "RAG",
    "Agentes",
  ];
  const tipos = [
    "Todos",
    "Herramienta",
    "API",
    "Plataforma",
    "Suite",
    "Framework",
  ];

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
          --accent-green: #10b981;
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

        .hero-gradient {
          background: linear-gradient(
            135deg,
            var(--deep-blue) 0%,
            var(--panel-bg) 100%
          );
        }

        .product-card {
          background: linear-gradient(
            145deg,
            var(--panel-bg) 0%,
            var(--deep-blue) 100%
          );
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover {
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.1);
        }

        .status-available {
          background: linear-gradient(
            135deg,
            var(--accent-green) 0%,
            #059669 100%
          );
        }

        .status-beta {
          background: linear-gradient(
            135deg,
            var(--accent-orange) 0%,
            #d97706 100%
          );
        }

        .status-coming-soon {
          background: linear-gradient(
            135deg,
            var(--text-secondary) 0%,
            #6b7280 100%
          );
        }

        .tech-tag {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.15) 0%,
            rgba(236, 72, 153, 0.15) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.2);
          color: var(--accent-purple);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .filter-active {
          background: linear-gradient(
            135deg,
            var(--accent-purple) 0%,
            var(--accent-pink) 100%
          );
          color: white;
        }

        .filter-inactive {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .filter-inactive:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
          color: var(--text-primary);
        }
      `}</style>

      <main className="flex-grow">
        {/* Header/Hero */}
        <section className="hero-gradient py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--primary-cyan)] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--accent-purple)] rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] text-white">
                <Package className="w-4 h-4 mr-2" />
                Productos de IA
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Herramientas y Soluciones de IA
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8 leading-relaxed">
              Frameworks, APIs, herramientas y plataformas completas para
              desarrollar aplicaciones de inteligencia artificial modernas.
              Desde LLMs hasta computer vision, todo lo que necesitas para
              construir productos IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#productos"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <Zap className="w-5 h-5" />
                Explorar Productos
              </Link>
              <Link
                href="/ia/herramientas"
                className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-white/5 transition-colors"
              >
                <Tools className="w-5 h-5" />
                Ver Herramientas
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-[var(--border-color)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[var(--primary-cyan)] mb-2">
                  6+
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Productos Disponibles
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-purple)] mb-2">
                  15+
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Tecnologías Integradas
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-pink)] mb-2">
                  100%
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Open Source
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--accent-green)] mb-2">
                  24/7
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Soporte API
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-8 bg-[var(--panel-bg)]/50 backdrop-blur sticky top-0 z-40 border-b border-[var(--border-color)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Categorías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorias.map((categoria) => (
                    <button
                      key={categoria}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        categoria === "Todos"
                          ? "filter-active"
                          : "filter-inactive"
                      }`}
                    >
                      {categoria}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Tipo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tipos.map((tipo) => (
                    <button
                      key={tipo}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        tipo === "Todos" ? "filter-active" : "filter-inactive"
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Productos Grid */}
        <section id="productos" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map((producto) => (
                <article
                  key={producto.id}
                  className="product-card rounded-2xl p-6 group"
                >
                  {/* Header del producto */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                        {producto.type === "Framework" && (
                          <Code className="w-6 h-6 text-white" />
                        )}
                        {producto.type === "Herramienta" && (
                          <Wrench className="w-6 h-6 text-white" />
                        )}
                        {producto.type === "API" && (
                          <Database className="w-6 h-6 text-white" />
                        )}
                        {producto.type === "Suite" && (
                          <Grid className="w-6 h-6 text-white" />
                        )}
                        {producto.type === "Plataforma" && (
                          <Layers className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-[var(--accent-purple)]">
                          {producto.type}
                        </span>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {producto.category}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold text-white status-${producto.status}`}
                    >
                      {producto.status === "available" && "Disponible"}
                      {producto.status === "beta" && "Beta"}
                      {producto.status === "coming-soon" && "Próximamente"}
                    </span>
                  </div>

                  {/* Imagen del producto */}
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-[var(--panel-bg)] to-[var(--deep-blue)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">
                        {producto.type === "Framework" && <Code />}
                        {producto.type === "Herramienta" && <Wrench />}
                        {producto.type === "API" && <Database />}
                        {producto.type === "Suite" && <Grid />}
                        {producto.type === "Plataforma" && <Layers />}
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--primary-cyan)] transition-colors">
                        <Link href={producto.href}>{producto.title}</Link>
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {producto.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Características principales
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {producto.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="text-xs bg-white/5 px-2 py-1 rounded border border-[var(--border-color)]"
                          >
                            {feature}
                          </span>
                        ))}
                        {producto.features.length > 3 && (
                          <span className="text-xs text-[var(--text-secondary)]">
                            +{producto.features.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tecnologías</h4>
                      <div className="flex flex-wrap gap-1">
                        {producto.tech.slice(0, 3).map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {producto.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {producto.duration}
                        </span>
                      </div>
                      <div className="font-semibold text-[var(--primary-cyan)]">
                        {producto.price}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={producto.href}
                      className="block w-full text-center py-3 px-4 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {producto.status === "available" && "Acceder"}
                      {producto.status === "beta" && "Probar Beta"}
                      {producto.status === "coming-soon" && "Notificarme"}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Necesitas algo personalizado?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Creamos productos de IA a medida para tu empresa. Desde MVPs hasta
              soluciones empresariales completas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ia/contacto"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[var(--accent-purple)] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Hablemos
              </Link>
              <Link
                href="/ia/autor/pablo-cubides"
                className="inline-flex items-center gap-2 px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                <User className="w-5 h-5" />
                Conoce al equipo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* Icons */
function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4l3-3z" />
    </svg>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function Tools(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    </svg>
  );
}

function Code(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}

function Wrench(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    </svg>
  );
}

function Database(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
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
      width="12"
      height="12"
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

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
