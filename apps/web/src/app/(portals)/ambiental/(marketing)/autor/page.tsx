import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Space_Grotesk } from "next/font/google";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Cpu,
  Mail,
  Linkedin,
  Droplets,
  Microscope,
  TrendingUp,
  FlaskConical,
  Database,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

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
  <div className="bg-white border border-gray-200 p-6 rounded-xl hover:border-[#0077B6] transition-colors">
    <div className="text-[#10B981] mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-[#0D161C] mb-3">{title}</h3>
    <p className="text-gray-600">{desc}</p>
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
    className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#0077B6] transition-colors"
  >
    <div className="aspect-video bg-gradient-to-br from-[#0077B6] to-[#10B981] relative">
      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
        Herramienta Ambiental
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-[#0D161C] mb-3 group-hover:text-[#0077B6] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600">{desc}</p>
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
  <Link
    href={href}
    className="group bg-white border border-gray-200 rounded-xl overflow-hidden grid md:grid-cols-2 gap-8 items-center hover:border-[#0077B6] transition-colors"
  >
    <div className="p-8">
      <span className="bg-[#E8F5E8] text-[#10B981] text-sm px-3 py-1 rounded-full font-medium">
        {badge}
      </span>
      <h3 className="text-2xl font-bold text-[#0D161C] mt-4 mb-2 group-hover:text-[#0077B6] transition-colors">
        {title}
      </h3>
      <p className="text-[#10B981] font-semibold mb-4">{impact}</p>
      <p className="text-gray-600">{desc}</p>
    </div>
    <div className="h-64 md:h-full bg-gradient-to-br from-[#0077B6] to-[#10B981] flex items-center justify-center text-white font-semibold">
      Proyecto Ambiental
    </div>
  </Link>
);

const StackCard: React.FC<StackCardProps> = ({ icon, title, desc }) => (
  <div className="bg-white border border-gray-200 p-6 rounded-xl hover:border-[#0077B6] transition-colors">
    <div className="text-[#10B981] mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-[#0D161C] mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
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
    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-[#0077B6] transition-colors"
  >
    <div className="flex items-center gap-2 mb-3">
      <span className="bg-[#E8F5E8] text-[#10B981] text-xs px-2 py-1 rounded">
        {category}
      </span>
      <span className="text-gray-500 text-sm">{readTime}</span>
    </div>
    <h3 className="text-xl font-semibold text-[#0D161C] mb-3 group-hover:text-[#0077B6] transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm">{excerpt}</p>
  </Link>
);

const Faq: React.FC<FaqProps> = ({ q, a }) => (
  <details className="group bg-white border border-gray-200 rounded-lg p-6">
    <summary className="flex justify-between items-center cursor-pointer font-semibold text-[#0D161C] group-open:text-[#0077B6]">
      {q}
      <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
    </summary>
    <p className="text-gray-600 mt-4">{a}</p>
  </details>
);

export const metadata: Metadata = {
  title:
    "Pablo Andrés Cubides Guerrero — Científico ambiental y especialista en gestión y tratamientos del agua | AquatechIA",
  description:
    "Perfil de Pablo Andrés Cubides Guerrero, autor en AquatechIA. Ingeniero Químico y M. Sc. en Ingeniería Ambiental. Docente e investigador en gestión integral del recurso hídrico, PTAP/PTAR, calidad del agua, aseguramiento de calidad ISO/IEC 17025 y optimización de procesos ambientales.",
  alternates: { canonical: "/ambiental/autor" },
  openGraph: {
    title:
      "Pablo Andrés Cubides Guerrero — Científico ambiental y especialista en agua",
    description:
      "Gestión del recurso hídrico, tratamientos (potable, residual, reúso), calidad del agua, I+D aplicada y docencia universitaria en AquatechIA.",
    type: "profile",
    url: "/ambiental/autor",
    images: [
      {
        url: "/images/authors/pablo-cubides-profile.jpg",
        width: 1200,
        height: 630,
        alt: "Retrato de Pablo Andrés Cubides Guerrero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pablo Andrés Cubides — Científico ambiental y especialista en tratamientos de agua",
    description:
      "Gestión integral del agua | PTAP/PTAR | Calidad del agua | ISO/IEC 17025 | Docencia e investigación.",
  },
};

export default function AmbientalAutorPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pablo Andrés Cubides Guerrero",
    jobTitle:
      "Científico ambiental · Ingeniero Químico · M. Sc. en Ingeniería Ambiental",
    description:
      "Docente e investigador especializado en gestión integral del recurso hídrico, tratamientos de agua, calidad del agua y optimización de procesos ambientales.",
    email: "mailto:pacubidesg@gmail.com",
    sameAs: ["https://www.linkedin.com/in/pacubidesg/"],
    worksFor: {
      "@type": "Organization",
      name: "AquatechIA",
      url: "https://aquatechia.com",
    },
    knowsAbout: [
      "PTAP",
      "PTAR",
      "Calidad del agua",
      "ISO/IEC 17025",
      "Gestión integral del agua",
      "Humedales artificiales",
      "Coagulación/Floculación",
      "Teledetección",
      "Modelación hidrológica",
      "Sostenibilidad ambiental",
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué tipo de servicios de consultoría ofreces?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Consultoría estratégica en gestión hídrica, diseño/operación de PTAP/PTAR, modelos predictivos, análisis geoespacial y sistemas de monitoreo con aseguramiento de calidad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Estás disponible para ponencias o talleres?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Ponencias, talleres técnicos y cursos aplicados sobre agua, calidad, optimización de procesos y herramientas de análisis.",
        },
      },
      {
        "@type": "Question",
        name: "¿En qué proyectos de investigación colaboras?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Investigación aplicada en calidad del agua, PTAP/PTAR, eventos extremos, reúso con humedales y teledetección para monitoreo ambiental.",
        },
      },
    ],
  };

  return (
    <>
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

      <main className="min-h-screen bg-[#F5F9F8] text-gray-600">
        {/* Header con breadcrumb */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <nav aria-label="Breadcrumb" className="text-sm">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link
                      href="/ambiental"
                      className="text-gray-500 hover:text-[#0077B6] transition-colors"
                    >
                      Portal Ambiental
                    </Link>
                  </li>
                  <li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </li>
                  <li>
                    <Link
                      href="/ambiental/blog"
                      className="text-gray-500 hover:text-[#0077B6] transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </li>
                  <li className="font-medium text-[#0077B6]">Pablo Cubides</li>
                </ol>
              </nav>

              <Link
                href="/ambiental/blog"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0077B6] hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Blog
              </Link>
            </div>
          </div>
        </header>

        {/* HERO Section */}
        <section className="py-16 md:py-24 border-b border-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#10B981] rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#0077B6] rounded-full blur-3xl"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative">
            <div className="lg:col-span-7">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#0077B6] to-[#10B981] text-white">
                  <Droplets className="w-4 h-4 mr-1" />
                  Especialista Ambiental
                </span>
              </div>

              <h1
                className={`${spaceGrotesk.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#0D161C] leading-tight`}
              >
                Pablo Andrés Cubides Guerrero
              </h1>
              <p className="mt-3 text-lg md:text-xl text-[#0D161C] font-medium">
                Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente
                universitario · Investigador en gestión y tratamientos del agua
              </p>

              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
                Gestión integral del recurso hídrico, PTAP/PTAR, calidad del
                agua para usos doméstico, agrícola e industrial y optimización
                de procesos ambientales con aseguramiento de calidad.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:pacubidesg@gmail.com"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#0077B6] to-[#10B981] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contactar
                </a>
                <a
                  href="https://www.linkedin.com/in/pacubidesg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-[#0077B6] text-[#0077B6] px-6 py-3 font-semibold hover:bg-blue-50 transition-colors"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </a>
                <a
                  href="/cv/pablo-cubides.pdf"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50 transition-colors text-[#0D161C]"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Descargar CV
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div>
                  <p
                    className={`${spaceGrotesk.className} text-3xl font-bold text-[#0D161C]`}
                  >
                    +35
                  </p>
                  <p className="text-sm">Proyectos</p>
                </div>
                <div>
                  <p
                    className={`${spaceGrotesk.className} text-3xl font-bold text-[#0D161C]`}
                  >
                    10+
                  </p>
                  <p className="text-sm">Años de experiencia</p>
                </div>
                <div>
                  <p
                    className={`${spaceGrotesk.className} text-3xl font-bold text-[#0D161C]`}
                  >
                    15
                  </p>
                  <p className="text-sm">Publicaciones</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#10B981] to-[#0077B6] blur-2xl opacity-30" />
                <div className="relative w-80 h-80 bg-gradient-to-br from-[#0077B6] to-[#10B981] rounded-full flex items-center justify-center text-white text-8xl shadow-xl">
                  👨‍🔬
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resumen ejecutivo */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2
                className={`${spaceGrotesk.className} text-3xl md:text-4xl mb-6 text-[#023E8A]`}
              >
                Acerca de mí
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Docente e investigador colombiano especializado en gestión del
                  recurso hídrico, tratamientos de agua (potable, residual y
                  reúso), calidad del agua para distintos usos y optimización de
                  procesos ambientales. Experiencia en docencia, dirección y
                  coordinación académica, trabajo de laboratorio con
                  aseguramiento de calidad y proyectos de investigación aplicada
                  de alcance nacional e interinstitucional.
                </p>
                <p>
                  Foco actual en: (1) diseño, operación y mejora de PTAP/PTAR y
                  soluciones de tratamiento; (2) evaluación tecnológica y
                  desempeño; (3) gestión integral del agua con información
                  multi-fuente para la toma de decisiones; (4) formación
                  universitaria basada en problemas reales del territorio.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Gestión integral del agua y apoyo a decisiones.</li>
                  <li>Calidad del agua: criterios, monitoreo y análisis.</li>
                  <li>
                    Reúso y tecnologías naturales (p. ej., humedales
                    artificiales).
                  </li>
                  <li>Aseguramiento de calidad bajo ISO/IEC 17025.</li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <div className="w-full h-96 bg-gradient-to-br from-[#0077B6] to-[#10B981] flex items-center justify-center text-white text-6xl">
                  🔬💧
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competencias clave */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`${spaceGrotesk.className} text-3xl md:text-4xl text-[#023E8A] text-center mb-10`}
            >
              Áreas de especialidad
            </h2>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
              {[
                "Gestión integral del agua",
                "PTAP/PTAR",
                "Calidad del agua",
                "Humedales artificiales",
                "Evaluación tecnológica",
                "Optimización de procesos",
                "ISO/IEC 17025",
                "Análisis estadístico",
                "Teledetección",
                "Modelización hidrológica",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm shadow-sm border border-gray-200 text-gray-700 hover:border-[#0077B6] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ExpertiseCard
                icon={<FlaskConical className="w-8 h-8" />}
                title="Tratamientos de agua"
                desc="Diseño/operación de PTAP/PTAR y soluciones de reúso. Procesos: coagulación/floculación, sedimentación, filtración, desinfección, adsorción y tecnologías naturales."
              />
              <ExpertiseCard
                icon={<Microscope className="w-8 h-8" />}
                title="Calidad y trazabilidad"
                desc="Aseguramiento de la calidad bajo ISO/IEC 17025: trazabilidad, QA/QC, validación y reporte técnico en laboratorio y campo."
              />
              <ExpertiseCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Optimización y datos"
                desc="Diagnóstico, control y mejora continua apoyados en análisis estadístico y datos multi-fuente para decisiones robustas."
              />
            </div>
          </div>
        </section>

        {/* Proyectos destacados */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`${spaceGrotesk.className} text-3xl md:text-4xl text-[#023E8A] text-center mb-12`}
            >
              Proyectos destacados
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ProjectWide
                badge="CASO DE ESTUDIO"
                title="Monitoreo de calidad del agua"
                impact="−40% en falsos positivos"
                desc="Sistema predictivo para optimizar el tratamiento en tiempo real."
                image=""
                href="#"
              />

              <ProjectCard
                title="Modelización hidrológica de cuencas"
                desc="Predicción de caudales con 95% de precisión para la gestión de embalses."
                image=""
                href="#"
              />
              <ProjectCard
                title="Plataforma de datos sobre sequías"
                desc="Visualización y soporte a decisiones para el sector agrícola."
                image=""
                href="#"
              />
            </div>
          </div>
        </section>

        {/* Herramientas estudiantiles */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`${spaceGrotesk.className} text-3xl md:text-4xl text-[#023E8A] text-center mb-12`}
            >
              Herramientas de estudiante
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Recursos desarrollados para apoyar el aprendizaje y la formación
              en ingeniería ambiental
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Consulta tu Nota */}
              <article className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#0077B6] transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#0077B6] to-[#10B981] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-[#0077B6] transition-colors text-[#0D161C]">
                    Consulta tu Nota
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Revisa tus calificaciones, progreso y retroalimentación de
                  manera rápida y organizada.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0077B6]"></div>
                    <span className="text-gray-700">Historial completo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-700">
                      Estadísticas detalladas
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0077B6]"></div>
                    <span className="text-gray-700">Exportar reportes</span>
                  </div>
                </div>
                <Link
                  href="/ia/autor/herramientas/consulta-nota"
                  className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-[#0077B6] to-[#10B981] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-4 h-4" />
                  Consultar Notas
                </Link>
              </article>

              {/* Ruleta Académica */}
              <article className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#0077B6] transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#10B981] to-[#0077B6] flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-[#0077B6] transition-colors text-[#0D161C]">
                    Ruleta Académica
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Carga preguntas desde CSV/Excel y juega con una ruleta
                  interactiva para dinámicas de clase.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-700">Carga CSV/XLSX</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0077B6]"></div>
                    <span className="text-gray-700">Ruleta animada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-700">Guarda conjuntos</span>
                  </div>
                </div>
                <Link
                  href="/ia/autor/herramientas/ruleta-academica"
                  className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-[#10B981] to-[#0077B6] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="w-4 h-4" />
                  Abrir Ruleta
                </Link>
              </article>

              {/* Aula Score */}
              <article className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#0077B6] transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#0077B6] to-[#10B981] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-[#0077B6] transition-colors text-[#0D161C]">
                    Aula Score
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Scoreboard interactivo para gamificación en clase. Controla
                  grupos, puntos y tiempo en tiempo real.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0077B6]"></div>
                    <span className="text-gray-700">Hasta 30 grupos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                    <span className="text-gray-700">Temporizador</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#0077B6]"></div>
                    <span className="text-gray-700">Tema claro/oscuro</span>
                  </div>
                </div>
                <Link
                  href="/ia/autor/herramientas/aula-score"
                  className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-[#0077B6] to-[#10B981] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <TrendingUp className="w-4 h-4" />
                  Abrir Aula Score
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Stack tecnológico */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`${spaceGrotesk.className} text-3xl md:text-4xl text-[#023E8A] text-center mb-10`}
            >
              Tecnologías y metodologías
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StackCard
                icon={<Database className="w-6 h-6" />}
                title="GIS y Teledetección"
                desc="ArcGIS, QGIS, Google Earth Engine para análisis geoespacial"
              />
              <StackCard
                icon={<FlaskConical className="w-6 h-6" />}
                title="Laboratorio"
                desc="ISO/IEC 17025, métodos estándar de análisis"
              />
              <StackCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Modelación"
                desc="HEC-HMS, SWAT, modelos hidrológicos predictivos"
              />
              <StackCard
                icon={<Cpu className="w-6 h-6" />}
                title="Análisis de Datos"
                desc="R, Python, SPSS para análisis estadístico avanzado"
              />
            </div>
          </div>
        </section>

        {/* Artículos */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2
                  className={`${spaceGrotesk.className} text-3xl md:text-4xl mb-4 text-[#023E8A]`}
                >
                  Artículos recientes
                </h2>
                <p className="text-gray-600">
                  Investigación y conocimiento aplicado en gestión ambiental
                </p>
              </div>
              <Link
                href="/ambiental/blog"
                className="text-[#0077B6] hover:text-[#10B981] font-semibold flex items-center gap-2"
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ArticleCard
                title="Optimización de PTAP mediante coagulación avanzada"
                excerpt="Metodologías para mejorar la eficiencia en plantas de tratamiento de agua potable"
                category="Tratamiento"
                readTime="8 min"
                href="/ambiental/blog/optimizacion-ptap-coagulacion"
              />
              <ArticleCard
                title="Humedales artificiales para aguas residuales"
                excerpt="Diseño y operación de sistemas naturales de tratamiento"
                category="Tecnología"
                readTime="6 min"
                href="/ambiental/blog/humedales-artificiales"
              />
              <ArticleCard
                title="Teledetección aplicada al monitoreo hídrico"
                excerpt="Uso de imágenes satelitales para gestión de recursos hídricos"
                category="Investigación"
                readTime="10 min"
                href="/ambiental/blog/teledeteccion-monitoreo"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              className={`${spaceGrotesk.className} text-3xl md:text-4xl text-center mb-10 text-[#023E8A]`}
            >
              Preguntas frecuentes
            </h2>
            <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              <Faq
                q="¿Qué tipo de servicios de consultoría ofreces?"
                a="Consultoría estratégica en gestión hídrica, diseño/operación de PTAP/PTAR, modelos predictivos, análisis geoespacial y sistemas de monitoreo con aseguramiento de calidad."
              />
              <Faq
                q="¿Estás disponible para ponencias o talleres?"
                a="Sí. Ofrezco ponencias, talleres técnicos y cursos aplicados sobre agua, calidad, optimización de procesos y herramientas de análisis."
              />
              <Faq
                q="¿Cómo es tu enfoque de trabajo?"
                a="Enfoque por problemas, análisis de datos, calidad y trazabilidad, trabajo interdisciplinar y comunicación técnica clara."
              />
              <Faq
                q="¿Trabajas con empresas del sector privado?"
                a="Sí, trabajo con empresas de servicios públicos, consultoras ambientales y empresas del sector industrial que requieren optimización de procesos de tratamiento de agua."
              />
              <Faq
                q="¿Ofreces cursos de formación especializada?"
                a="Ofrezco cursos técnicos en PTAP/PTAR, calidad del agua, aseguramiento de calidad según ISO/IEC 17025 y uso de herramientas de análisis geoespacial."
              />
            </div>
          </div>
        </section>

        {/* CTA Colaboración */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-[#0077B6] to-[#10B981] text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
            <h2
              className={`${spaceGrotesk.className} text-3xl md:text-4xl mb-4`}
            >
              ¿Colaboramos?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-blue-100">
              Abierto a proyectos, investigación aplicada y formación. Si tienes
              una idea, conversemos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:pacubidesg@gmail.com"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-bold text-[#0077B6] hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Escríbeme
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
