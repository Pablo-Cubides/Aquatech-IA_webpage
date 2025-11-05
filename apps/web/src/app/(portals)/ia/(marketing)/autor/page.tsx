import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Space_Grotesk, Inter } from "next/font/google";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Cpu,
  Mail,
  Linkedin,
  Brain,
  Zap,
  TrendingUp,
  Code,
  Database,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

// Component interfaces
interface ExpertiseCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface ProjectCardProps {
  title: string;
  desc: string;
  image: string;
  href: string;
}

interface ProjectWideProps {
  badge: string;
  title: string;
  impact: string;
  desc: string;
  image: string;
  href: string;
}

interface StackCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  href: string;
}

interface FaqProps {
  q: string;
  a: string;
}

// Component definitions
const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ icon, title, desc }) => (
  <div className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] p-6 rounded-xl">
    <div className="text-[var(--accent-primary)] mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
      {title}
    </h3>
    <p className="text-[var(--text-secondary)]">{desc}</p>
  </div>
);

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  desc,
  image,
  href,
}) => (
  <Link
    href={href}
    className="group block bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden hover:border-[var(--accent-primary)] transition-colors"
  >
    <div className="aspect-video bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] relative">
      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
        Proyecto IA
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)]">{desc}</p>
    </div>
  </Link>
);

const ProjectWide: React.FC<ProjectWideProps> = ({
  badge,
  title,
  impact,
  desc,
  image,
  href,
}) => (
  <div className="lg:col-span-3">
    <Link
      href={href}
      className="group block bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl overflow-hidden hover:border-[var(--accent-primary)] transition-colors"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 aspect-video lg:aspect-auto bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] relative">
          <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
            {title}
          </div>
        </div>
        <div className="lg:w-1/2 p-8">
          <span className="inline-block px-3 py-1 bg-[var(--accent-primary)] text-white text-sm font-medium rounded-full mb-4">
            {badge}
          </span>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {title}
          </h3>
          <p className="text-[var(--accent-primary)] font-medium mb-3">
            {impact}
          </p>
          <p className="text-[var(--text-secondary)]">{desc}</p>
        </div>
      </div>
    </Link>
  </div>
);

const StackCard: React.FC<StackCardProps> = ({ icon, title, desc }) => (
  <div className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] p-6 rounded-xl">
    <div className="text-[var(--accent-primary)] mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
      {title}
    </h3>
    <p className="text-[var(--text-secondary)]">{desc}</p>
  </div>
);

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  category,
  readTime,
  href,
}) => (
  <Link
    href={href}
    className="group block bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] p-6 rounded-xl hover:border-[var(--accent-primary)] transition-colors"
  >
    <span className="inline-block px-3 py-1 bg-[var(--accent-primary)] text-white text-sm font-medium rounded-full mb-4">
      {category}
    </span>
    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
      {title}
    </h3>
    <p className="text-[var(--text-secondary)] mb-4">{excerpt}</p>
    <span className="text-sm text-[var(--text-tertiary)]">{readTime}</span>
  </Link>
);

const Faq: React.FC<FaqProps> = ({ q, a }) => (
  <details className="group p-6">
    <summary className="flex items-center justify-between cursor-pointer list-none">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] group-open:text-[var(--accent-primary)] transition-colors">
        {q}
      </h3>
      <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-open:rotate-90 transition-transform" />
    </summary>
    <div className="mt-4 text-[var(--text-secondary)]">
      <p>{a}</p>
    </div>
  </details>
);

export const metadata: Metadata = {
  title:
    "Pablo Andrés Cubides Guerrero — Autor en IA, redes neuronales y optimización | AquatechIA",
  description:
    "Perfil de autor en IA de Pablo A. Cubides en AquatechIA. Desarrollador full-stack (FastAPI + Next.js), LLMs, RAG, agentes, modelos generativos y visión por computador. Dirección técnica, docencia y transferencia en LATAM.",
  alternates: { canonical: "/ia/autor" },
  openGraph: {
    title:
      "Pablo A. Cubides — IA, redes neuronales, optimización y desarrollo full-stack",
    description:
      "LLMs, RAG, agentes, modelos generativos, visión por computador; FastAPI, Next.js, Tailwind v4, Prisma/PostgreSQL, Vercel en AquatechIA.",
    type: "profile",
    url: "/ia/autor",
    images: [
      {
        url: "/images/authors/pablo-cubides-ia-profile.jpg",
        width: 1200,
        height: 630,
        alt: "Retrato de Pablo A. Cubides - IA Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pablo A. Cubides — IA, redes neuronales y desarrollo full-stack",
    description:
      "Prototipos con LLMs y agentes, FastAPI + Next.js, DevOps ligero en Vercel, analítica y optimización.",
  },
};

export default function IAAutorPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pablo Andrés Cubides Guerrero",
    jobTitle:
      "Desarrollador en IA, redes neuronales y optimización · Docente universitario",
    email: "mailto:pacubidesg@gmail.com",
    sameAs: ["https://www.linkedin.com/in/pacubidesg/"],
    worksFor: {
      "@type": "Organization",
      name: "AquatechIA",
      url: "https://aquatechia.com",
    },
    knowsAbout: [
      "Large Language Models",
      "RAG",
      "Agentes de IA",
      "Modelos generativos",
      "Visión por computador",
      "FastAPI",
      "Next.js",
      "Tailwind CSS v4",
      "Prisma",
      "PostgreSQL",
      "Vercel",
      "Sentry",
      "OpenTelemetry",
      "Redis",
      "WebSockets",
      "Redes neuronales",
      "Optimización",
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué construyes con LLMs y agentes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Asistentes y automatizaciones con RAG, agentes y orquestadores (LangChain, CrewAI, n8n), integrados a backends FastAPI y frontends Next.js.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo abordas un MVP de IA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Definición clara del caso de uso, diseño de arquitectura (pipelines, datos y observabilidad), prototipo funcional con APIs y UI, y despliegue en Vercel.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es tu stack preferido?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Python 3.13.3 + FastAPI, Next.js 15 + Tailwind v4, Prisma + PostgreSQL (Neon/Supabase), Sentry + OpenTelemetry, Firebase Auth, MercadoPago y Brevo.",
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD SEO */}
      {/* JSON-LD SEO */}
      <Script
        id="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="body-font bg-[#10111A] text-gray-400">
        {/* Header con breadcrumb */}
        <header className="bg-[#1a1b2e]/80 backdrop-blur border-b border-[rgba(0,239,255,0.1)] sticky top-0 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <nav aria-label="Breadcrumb" className="text-sm">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link
                      href="/ia"
                      className="text-gray-500 hover:text-[#00efff] transition-colors"
                    >
                      Portal IA
                    </Link>
                  </li>
                  <li>
                    <ChevronRight className="text-gray-500" />
                  </li>
                  <li>
                    <Link
                      href="/ia/blog"
                      className="text-gray-500 hover:text-[#00efff] transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <ChevronRight className="text-gray-500" />
                  </li>
                  <li className="font-medium text-[#00efff]">
                    Pablo Cubides
                  </li>
                </ol>
              </nav>

              <Link
                href="/ia/blog"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#00efff] hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Blog
              </Link>
            </div>
          </div>
        </header>

        {/* HERO Section */}
        <section className="gradient-bg py-16 md:py-24 border-b border-[rgba(0,239,255,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00efff] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#0095FF] rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative">
            <div className="lg:col-span-7">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium tech-gradient text-white">
                  <Cpu className="w-4 h-4 mr-1" />
                  IA Specialist
                </span>
              </div>

              <h1 className="title-font text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Pablo Andrés Cubides Guerrero
              </h1>
              <p className="mt-3 text-lg md:text-xl text-white font-medium">
                Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente
                universitario · Desarrollador en IA, redes neuronales y
                optimización
              </p>

              <p className="mt-4 text-gray-400 max-w-2xl leading-relaxed">
                IA aplicada a optimización, modelación de procesos con redes
                neuronales, análisis de datos y desarrollo de software. Integro
                LLMs y agentes, modelos generativos y visión por computador con
                plataformas full-stack para construir productos y prototipos
                funcionales.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:pacubidesg@gmail.com"
                  className="inline-flex items-center justify-center rounded-lg tech-gradient px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity glow-effect"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contactar
                </a>
                <a
                  href="https://www.linkedin.com/in/pacubidesg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-[#00efff] text-[#00efff] px-6 py-3 font-semibold hover:bg-white/5 transition-colors"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </a>
                <Link
                  href="#articulos"
                  className="inline-flex items-center justify-center rounded-lg border border-[rgba(0,239,255,0.1)] px-6 py-3 font-semibold hover:bg-white/5 transition-colors text-white"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Ver Artículos IA
                </Link>
              </div>

              {/* Tech Stack Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Python 3.13.3",
                  "FastAPI",
                  "Next.js 15",
                  "Tailwind v4",
                  "Prisma + PostgreSQL",
                  "Vercel",
                  "Sentry + OTel",
                  "WebSockets",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-white/5 border border-[rgba(0,239,255,0.1)] px-4 py-2 text-sm font-medium text-gray-400 hover:border-[#00efff] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-purple)] blur-2xl opacity-30" />
                <Image
                  src="/images/authors/pablo-cubides-ia-profile.jpg"
                  alt="Retrato de Pablo Andrés Cubides Guerrero - IA Specialist"
                  width={360}
                  height={360}
                  className="relative rounded-full border-4 border-[#1a1b2e] shadow-xl glow-effect"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE EL AUTOR */}
        <section className="py-16 md:py-24 bg-[#1a1b2e]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="title-font text-3xl md:text-4xl mb-6 text-white">
                Resumen ejecutivo
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Profesional colombiano con enfoque en IA y redes neuronales
                  aplicado a optimización, modelación de procesos, análisis de
                  datos y desarrollo de software. Como autor en AquatechIA,
                  comparto experiencia en dirección y gestión de proyectos,
                  docencia universitaria y transferencia de conocimiento en
                  Latinoamérica.
                </p>

                <div className="bg-gradient-to-r from-[rgba(0,239,255,0.1)] to-[rgba(0,149,255,0.1)] border border-[rgba(0,239,255,0.2)] rounded-lg p-4 mt-6">
                  <h3 className="title-font text-lg font-semibold text-white mb-3">
                    Lo que aporto a equipos y organizaciones
                  </h3>
                  <ul className="list-disc ml-5 space-y-2 text-sm">
                    <li>
                      <strong>Solución de problemas con IA:</strong> del caso de
                      uso al prototipo (APIs en FastAPI, UIs en Next.js,
                      despliegue en Vercel)
                    </li>
                    <li>
                      <strong>Optimización y analítica:</strong> estadística y
                      ML para mejorar procesos y automatizar flujos
                    </li>
                    <li>
                      <strong>Arquitectura de productos de IA:</strong>{" "}
                      pipelines (RAG, agentes, generativos), observabilidad y
                      buenas prácticas
                    </li>
                    <li>
                      <strong>Gestión y liderazgo técnico:</strong> coordinación
                      de equipos, alcance, planificación y comunicación
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-[rgba(0,239,255,0.1)]">
                <Image
                  src="/images/authors/pablo-cubides-ai-work.jpg"
                  alt="Pablo Cubides trabajando en arquitecturas de IA"
                  width={600}
                  height={400}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* COMPETENCIAS CLAVE */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="title-font text-3xl md:text-4xl text-white text-center mb-10">
              Competencias clave en IA
            </h2>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
              {[
                "LLMs",
                "RAG",
                "Agentes de IA",
                "Modelos generativos",
                "Visión por computador",
                "Redes neuronales",
                "FastAPI",
                "Next.js 15",
                "Tailwind v4",
                "Prisma + PostgreSQL",
                "Vercel",
                "Sentry + OpenTelemetry",
                "WebSockets",
                "Docker",
                "Redis",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[#1a1b2e] border border-[rgba(0,239,255,0.1)] px-4 py-2 text-sm font-medium text-gray-400 shadow-sm hover:border-[#00efff] hover:shadow-md transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ExpertiseCard
                icon={<Brain className="w-6 h-6" />}
                title="LLMs, RAG y agentes"
                desc="LM Studio, Ollama, LangChain, CrewAI y n8n. Prototipos de asistentes y automatizaciones con orquestación y memoria para casos de uso específicos."
              />
              <ExpertiseCard
                icon={<Zap className="w-6 h-6" />}
                title="Redes neuronales y generativos"
                desc="Stable Diffusion (A1111/ComfyUI), DreamBooth, FLUX, InstantID + ControlNet Hair integrados en herramientas web con FastAPI y Next.js."
              />
              <ExpertiseCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Optimización y analítica"
                desc="ANOVA, t-Student y métricas prácticas para insights y mejora continua; dashboards útiles orientados a decisiones basadas en datos."
              />
            </div>
          </div>
        </section>

        {/* PROYECTOS DE IA */}
        <section className="py-16 md:py-24 bg-[#1a1b2e]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="title-font text-3xl md:text-4xl text-white text-center mb-12">
              Proyectos y desarrollos de IA
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ProjectWide
                badge="HUB EDUCATIVO IA (2025–)"
                title="AquatechIA Platform"
                impact="Comunidades LATAM"
                desc="Integración de contenidos, herramientas y demostradores de IA aplicada. LLMs, RAG, agentes y modelos generativos en producción."
                image="/images/projects/aquatechia-platform.jpg"
                href="/ia/proyectos/aquatechia-platform"
              />

              <ProjectCard
                title="Herramientas IA para imagen"
                desc="Edición y generación con FastAPI + Next.js + WebSockets integrando FLUX, InstantID y ControlNet Hair en tiempo real."
                image="/images/projects/ai-image-tools.jpg"
                href="/ia/proyectos/ai-image-tools"
              />

              <ProjectCard
                title="RAG y asistentes especializados"
                desc="Sistemas de recuperación aumentada con LangChain y CrewAI para documentación técnica y soporte automatizado."
                image="/images/projects/rag-assistants.jpg"
                href="/ia/proyectos/rag-assistants"
              />
            </div>
          </div>
        </section>

        {/* STACK TECNOLÓGICO */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="title-font text-3xl md:text-4xl text-white text-center mb-12">
              Stack tecnológico IA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StackCard
                icon={<Code className="w-6 h-6" />}
                title="Lenguajes & Framework"
                desc="Python (3.13.3), TypeScript/JS. Backend: FastAPI con async/await; Frontend: Next.js 15 (App Router) + Tailwind CSS v4; WebSockets para tiempo real."
              />
              <StackCard
                icon={<Database className="w-6 h-6" />}
                title="Datos & DevOps"
                desc="PostgreSQL (Neon/Supabase) + Prisma ORM. Vercel como runtime principal. Observabilidad completa con Sentry y OpenTelemetry."
              />
              <StackCard
                icon={<Sparkles className="w-6 h-6" />}
                title="IA/ML & Integraciones"
                desc="SD (A1111/ComfyUI), FLUX, LM Studio, Ollama, LangChain, CrewAI. Firebase Auth, Brevo, MercadoPago. Docker/Redis cuando es necesario."
              />
            </div>
          </div>
        </section>

        {/* ARTÍCULOS DESTACADOS */}
        <section
          id="articulos"
          className="py-16 md:py-24 bg-[#1a1b2e]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="title-font text-3xl md:text-4xl text-white text-center mb-12">
              Artículos recientes sobre IA
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <ArticleCard
                title="Cómo funcionan los LLMs: Guía completa"
                excerpt="Explicación detallada de la arquitectura Transformer, attention mechanisms y el proceso de entrenamiento de modelos de lenguaje."
                category="Machine Learning"
                readTime="15 min"
                href="/ia/blog/como-funcionan-llms-guia-completa"
              />
              <ArticleCard
                title="RAG vs Fine-tuning: ¿Cuándo usar cada uno?"
                excerpt="Comparación práctica entre Retrieval-Augmented Generation y fine-tuning para casos de uso específicos en producción."
                category="LLMs"
                readTime="12 min"
                href="/ia/blog/rag-vs-fine-tuning-cuando-usar"
              />
              <ArticleCard
                title="Construyendo agentes de IA con LangChain y CrewAI"
                excerpt="Tutorial paso a paso para crear agentes inteligentes que pueden colaborar y ejecutar tareas complejas de forma autónoma."
                category="Agentes de IA"
                readTime="18 min"
                href="/ia/blog/agentes-ia-langchain-crewai"
              />
            </div>

            <div className="text-center">
              <Link
                href="/ia/blog?autor=pablo-cubides"
                className="inline-flex items-center gap-2 px-6 py-3 tech-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity glow-effect"
              >
                Ver todos los artículos de IA
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="title-font text-3xl md:text-4xl text-white text-center mb-10">
              Preguntas frecuentes sobre IA
            </h2>
            <div className="divide-y divide-[rgba(0,239,255,0.1)] rounded-xl border border-[rgba(0,239,255,0.1)] bg-[#1a1b2e]">
              <Faq
                q="¿Qué construyes con LLMs y agentes?"
                a="Asistentes, automatizaciones y prototipos productivos con RAG/agentes, integrados a FastAPI y Next.js, con observabilidad completa y buenas prácticas de desarrollo."
              />
              <Faq
                q="¿Cómo abordas un MVP de IA?"
                a="Definición clara del caso de uso, diseño de arquitectura de pipelines y datos, prototipo funcional (API + UI), pruebas exhaustivas y despliegue en Vercel con monitoreo."
              />
              <Faq
                q="¿Ofreces consultoría técnica en IA?"
                a="Sí, desde exploración y diseño de soluciones hasta implementación completa, hand-off y capacitación de equipos en tecnologías de IA modernas."
              />
            </div>
          </div>
        </section>

        {/* HERRAMIENTAS ESTUDIANTILES */}
        <section className="py-16 md:py-24 bg-[#1a1b2e]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="title-font text-3xl md:text-4xl mb-4">
                Herramientas para Estudiantes
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Recursos interactivos diseñados para mejorar tu experiencia de
                aprendizaje en IA y tecnología.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Consulta tu Nota */}
              <article className="bg-[#10111A] rounded-2xl p-6 border border-[rgba(0,239,255,0.1)] hover:border-[#00efff] transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#00efff] to-[#0095FF] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-[#00efff] transition-colors">
                    Consulta tu Nota
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Revisa tus calificaciones, progreso y retroalimentación de
                  manera rápida y organizada.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#00efff]"></div>
                    <span>Historial completo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0095FF]"></div>
                    <span>Estadísticas detalladas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#00efff]"></div>
                    <span>Exportar reportes</span>
                  </div>
                </div>
                <Link
                  href="/ia/autor/herramientas/consulta-nota"
                  className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-[#00efff] to-[#0095FF] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-4 h-4" />
                  Consultar Notas
                </Link>
              </article>

              {/* Ruleta de Preguntas */}
              <article className="bg-[#10111A] rounded-2xl p-6 border border-[rgba(0,239,255,0.1)] hover:border-[#0095FF] transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#0095FF] to-[#00efff] flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-[#0095FF] transition-colors">
                    Ruleta de Preguntas
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Genera preguntas aleatorias sobre IA, machine learning y
                  programación para estudiar.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0095FF]"></div>
                    <span>Múltiples categorías</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#00efff]"></div>
                    <span>Niveles de dificultad</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0095FF]"></div>
                    <span>Explicaciones detalladas</span>
                  </div>
                </div>
                <Link
                  href="/ia/autor/herramientas/ruleta-preguntas"
                  className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-[#0095FF] to-[#00efff] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="w-4 h-4" />
                  Girar Ruleta
                </Link>
              </article>

              {/* Análisis de Correlaciones */}
              <article className="bg-[#10111A] rounded-2xl p-6 border border-[rgba(0,239,255,0.1)] hover:border-[#00efff] transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#00efff] to-[#0095FF] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-[#00efff] transition-colors">
                    Análisis de Correlaciones
                  </h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Visualiza y analiza correlaciones entre variables con gráficos
                  interactivos y estadísticas.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#00efff]"></div>
                    <span>Gráficos interactivos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0095FF]"></div>
                    <span>Matrices de correlación</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#00efff]"></div>
                    <span>Exportar análisis</span>
                  </div>
                </div>
                <Link
                  href="/ia/autor/herramientas/analisis-correlaciones"
                  className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-[#00efff] to-[#0095FF] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <TrendingUp className="w-4 h-4" />
                  Analizar Datos
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* CTA COLABORACIÓN */}
        <section className="py-16 md:py-24 tech-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="title-font text-3xl md:text-4xl mb-4">
              ¿Construimos tu MVP de IA?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/90">
              Desde la idea hasta el prototipo desplegado con tecnologías
              modernas de IA. Hablemos de tu caso de uso y de cómo ponerlo en
              producción con LLMs, RAG y agentes inteligentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:pacubidesg@gmail.com"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-bold text-[var(--accent-purple)] hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Escribir sobre IA
              </a>
              <a
                href="https://www.linkedin.com/in/pacubidesg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white px-8 py-3 font-bold text-white hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                Conectar en LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
