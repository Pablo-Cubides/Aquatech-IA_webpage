"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Tipo para el artículo
type BlogArticle = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: number;
  excerpt: string;
  heroImage: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  content: {
    introduction: string;
    sections: {
      id: string;
      title: string;
      content: string;
      subsections?: {
        id: string;
        title: string;
        content: string;
      }[];
      image?: string;
      callout?: {
        type: "info" | "warning" | "success";
        title: string;
        content: string;
      };
    }[];
    conclusion?: string;
  };
  tags: string[];
  nextArticle?: {
    slug: string;
    title: string;
  };
};

// Artículo de ejemplo - esto vendría de una base de datos o CMS
const ARTICLE_DATA: BlogArticle = {
  slug: "plan-restauracion-hidrica-2030",
  title:
    "Plan de restauración hídrica 2030: métricas accionables para un futuro sostenible",
  category: "Políticas Ambientales",
  date: "2024-09-10",
  readTime: 12,
  excerpt:
    "Cómo priorizar cuencas y definir indicadores claros para medir avances en restauración hídrica a gran escala.",
  heroImage:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  author: {
    name: "Dra. Elena Vance",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    bio: "Especialista en gestión de recursos hídricos con más de 15 años de experiencia en proyectos de restauración ambiental.",
  },
  content: {
    introduction:
      "La crisis hídrica global no es un problema del futuro: es una realidad presente que requiere acción inmediata y coordinada. El Plan de Restauración Hídrica 2030 representa una oportunidad sin precedentes para transformar la gestión del agua a nivel mundial, pero su éxito depende de métricas claras, objetivos medibles y un enfoque basado en evidencia científica.",
    sections: [
      {
        id: "crisis-hidrica-actual",
        title: "La crisis hídrica actual: números que no mienten",
        content:
          "Según la ONU, más de 2.000 millones de personas viven en países con estrés hídrico, y se espera que esta cifra aumente a 5.000 millones para 2050. La degradación de cuencas hidrográficas, la contaminación industrial y el cambio climático han creado una tormenta perfecta que amenaza la seguridad hídrica global.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        subsections: [
          {
            id: "estadisticas-clave",
            title: "Estadísticas clave del panorama hídrico",
            content:
              "• 80% de las aguas residuales se vierten sin tratamiento\n• 40% de la población mundial sufre escasez de agua\n• 3.6 millones de hectáreas de humedales se pierden anualmente\n• Solo el 0.3% del agua dulce del planeta es accesible para uso humano",
          },
        ],
      },
      {
        id: "marco-metodologico",
        title: "Marco metodológico para la priorización de cuencas",
        content:
          "La restauración efectiva requiere un enfoque sistemático que considere múltiples factores: vulnerabilidad climática, densidad poblacional, importancia ecológica, viabilidad técnica y costo-beneficio. Nuestro marco metodológico integra análisis geoespacial, modelado hidrológico y evaluación socioeconómica.",
        callout: {
          type: "info",
          title: "Metodología de priorización",
          content:
            "Utilizamos un índice compuesto que combina 15 indicadores distribuidos en 4 dimensiones: ambiental (40%), social (25%), económica (20%) y técnica (15%). Cada cuenca recibe una puntuación de 0-100 que determina su prioridad de intervención.",
        },
        subsections: [
          {
            id: "criterios-priorizacion",
            title: "Criterios de priorización",
            content:
              "1. **Vulnerabilidad climática**: Análisis de proyecciones de precipitación y temperatura\n2. **Estado de degradación**: Evaluación de cobertura vegetal y erosión\n3. **Impacto poblacional**: Número de personas dependientes de la cuenca\n4. **Biodiversidad**: Presencia de especies endémicas y ecosistemas críticos\n5. **Viabilidad económica**: Análisis costo-beneficio de las intervenciones",
          },
        ],
      },
      {
        id: "indicadores-medicion",
        title: "Indicadores para medir el progreso",
        content:
          "Un sistema de monitoreo robusto es fundamental para el éxito del plan. Hemos identificado 25 indicadores clave organizados en tres categorías: indicadores de resultado, de impacto y de proceso. Cada indicador incluye metodología de medición, frecuencia de recolección y metas específicas.",
        image:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
        subsections: [
          {
            id: "indicadores-resultado",
            title: "Indicadores de resultado",
            content:
              "• **Cobertura vegetal restaurada**: Meta 500,000 hectáreas para 2030\n• **Calidad del agua**: Reducción del 60% en contaminantes prioritarios\n• **Caudal ecológico**: Restauración del 80% del caudal natural\n• **Conectividad de hábitats**: 70% de corredores biológicos funcionales",
          },
          {
            id: "indicadores-impacto",
            title: "Indicadores de impacto",
            content:
              "• **Seguridad hídrica**: 95% de población con acceso confiable\n• **Resiliencia climática**: Reducción del 50% en vulnerabilidad\n• **Servicios ecosistémicos**: Incremento del 40% en valor económico\n• **Biodiversidad**: Recuperación del 80% de especies indicadoras",
          },
        ],
      },
      {
        id: "tecnologias-monitoreo",
        title: "Tecnologías de monitoreo y seguimiento",
        content:
          "La implementación exitosa del plan requiere tecnologías avanzadas de monitoreo. Combinamos sensores remotos, inteligencia artificial y sistemas de información geográfica para crear un sistema de seguimiento en tiempo real que permita ajustes adaptativos y toma de decisiones basada en evidencia.",
        callout: {
          type: "success",
          title: "Caso de éxito: Cuenca del Río Magdalena",
          content:
            "La implementación piloto en la cuenca del Río Magdalena (Colombia) logró una mejora del 35% en la calidad del agua y la restauración de 12,000 hectáreas en solo 18 meses, utilizando nuestro sistema de monitoreo integrado.",
        },
      },
    ],
    conclusion:
      "El Plan de Restauración Hídrica 2030 no es solo una aspiración: es una hoja de ruta práctica hacia la seguridad hídrica global. Con métricas claras, tecnología avanzada y compromiso político, podemos revertir décadas de degradación y construir un futuro donde el agua sea abundante, limpia y accesible para todos. El tiempo de actuar es ahora.",
  },
  tags: [
    "Restauración",
    "Gestión Hídrica",
    "Sostenibilidad",
    "Política Ambiental",
    "Conservación",
  ],
  nextArticle: {
    slug: "contaminantes-agua-urbana",
    title: "Los 5 contaminantes más comunes en agua urbana",
  },
};

// Tabla de contenidos generada automáticamente
const generateTOC = (sections: BlogArticle["content"]["sections"]) => {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    subsections:
      section.subsections?.map((sub) => ({
        id: sub.id,
        title: sub.title,
      })) || [],
  }));
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogArticlePage() {
  const toc = generateTOC(ARTICLE_DATA.content.sections);

  return (
    <div className="bg-[#F5F9F8] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Artículo */}
          <article className="lg:col-span-8">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href="/ambiental" className="hover:text-[#10B981]">
                    Inicio
                  </Link>
                </li>
                <li>
                  <span>›</span>
                </li>
                <li>
                  <Link href="/ambiental/blog" className="hover:text-[#10B981]">
                    Blog
                  </Link>
                </li>
                <li>
                  <span>›</span>
                </li>
                <li className="text-[#10B981] font-medium">
                  {ARTICLE_DATA.category}
                </li>
              </ol>
            </nav>

            {/* Meta + Título */}
            <div className="mb-8">
              <span className="inline-block bg-[#10B981] text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {ARTICLE_DATA.category}
              </span>
              <h1
                className="text-4xl md:text-5xl font-bold mb-6 text-[#0D161C] leading-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {ARTICLE_DATA.title}
              </h1>

              <div className="flex flex-wrap items-center text-gray-600 text-sm gap-6 mb-6">
                <div className="flex items-center">
                  <Image
                    alt={`Avatar de ${ARTICLE_DATA.author.name}`}
                    className="rounded-full mr-3"
                    src={ARTICLE_DATA.author.avatar}
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-medium text-[#0D161C]">
                      Por {ARTICLE_DATA.author.name}
                    </div>
                    {ARTICLE_DATA.author.bio && (
                      <div className="text-xs text-gray-500">
                        {ARTICLE_DATA.author.bio}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Publicado el {formatDate(ARTICLE_DATA.date)}</span>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{ARTICLE_DATA.readTime} min de lectura</span>
                </div>

                <div className="flex items-center ml-auto space-x-2">
                  <button
                    aria-label="Compartir"
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="Guardar en favoritos"
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
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
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Imagen hero */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-8">
              <div className="relative w-full h-[300px] md:h-[480px]">
                <Image
                  alt={ARTICLE_DATA.title}
                  src={ARTICLE_DATA.heroImage}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Contenido principal */}
            <div className="prose prose-lg max-w-none">
              {/* Introducción */}
              <p className="text-xl leading-relaxed text-[#2D3748] mb-8 font-medium">
                {ARTICLE_DATA.content.introduction}
              </p>

              {/* Secciones */}
              {ARTICLE_DATA.content.sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-12">
                  <h2
                    className="text-3xl font-bold text-[#0D161C] mb-6"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {section.title}
                  </h2>

                  <div
                    className="text-[#4A5568] leading-7 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: section.content
                        .replace(/\n/g, "<br>")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/• /g, "<br>• "),
                    }}
                  />

                  {/* Imagen de sección */}
                  {section.image && (
                    <div className="my-8 rounded-lg overflow-hidden shadow-md">
                      <div className="relative w-full h-[280px] md:h-[360px]">
                        <Image
                          alt={section.title}
                          src={section.image}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Callout */}
                  {section.callout && (
                    <div
                      className={`callout border-l-4 p-6 rounded-lg my-8 flex items-start ${
                        section.callout.type === "info"
                          ? "bg-[#EBF8FF] border-[#4299E1]"
                          : section.callout.type === "success"
                            ? "bg-[#F0FFF4] border-[#10B981]"
                            : "bg-[#FFF5F5] border-[#F56565]"
                      }`}
                    >
                      <div
                        className={`mr-3 text-2xl ${
                          section.callout.type === "info"
                            ? "text-[#4299E1]"
                            : section.callout.type === "success"
                              ? "text-[#10B981]"
                              : "text-[#F56565]"
                        }`}
                      >
                        {section.callout.type === "info"
                          ? "💡"
                          : section.callout.type === "success"
                            ? "✅"
                            : "⚠️"}
                      </div>
                      <div>
                        <h4
                          className={`font-semibold text-lg mb-1 ${
                            section.callout.type === "info"
                              ? "text-blue-800"
                              : section.callout.type === "success"
                                ? "text-green-800"
                                : "text-red-800"
                          }`}
                        >
                          {section.callout.title}
                        </h4>
                        <p
                          className={
                            section.callout.type === "info"
                              ? "text-blue-700"
                              : section.callout.type === "success"
                                ? "text-green-700"
                                : "text-red-700"
                          }
                        >
                          {section.callout.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Subsecciones */}
                  {section.subsections?.map((subsection) => (
                    <div
                      key={subsection.id}
                      id={subsection.id}
                      className="ml-6 mb-8"
                    >
                      <h3 className="text-2xl font-bold text-[#0D161C] mb-4">
                        {subsection.title}
                      </h3>
                      <div
                        className="text-[#4A5568] leading-7"
                        dangerouslySetInnerHTML={{
                          __html: subsection.content
                            .replace(/\n/g, "<br>")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/• /g, "<br>• "),
                        }}
                      />
                    </div>
                  ))}
                </section>
              ))}

              {/* Conclusión */}
              {ARTICLE_DATA.content.conclusion && (
                <section className="mb-12 p-6 bg-white rounded-xl border border-gray-200">
                  <h2
                    className="text-3xl font-bold text-[#0D161C] mb-6"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Conclusión
                  </h2>
                  <p className="text-[#4A5568] leading-7 text-lg">
                    {ARTICLE_DATA.content.conclusion}
                  </p>
                </section>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {ARTICLE_DATA.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[#10B981] hover:text-white transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky top-24 self-start space-y-8">
            {/* TOC */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3
                className="text-xl font-bold mb-4 text-[#0D161C]"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Tabla de contenidos
              </h3>
              <nav className="toc">
                <ul className="space-y-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        className="text-gray-600 hover:text-[#10B981] transition-colors block py-1"
                        href={`#${item.id}`}
                      >
                        {item.title}
                      </a>
                      {item.subsections.length > 0 && (
                        <ul className="pl-4 mt-2 space-y-2 border-l border-gray-200">
                          {item.subsections.map((sub) => (
                            <li key={sub.id}>
                              <a
                                className="text-sm text-gray-500 hover:text-[#10B981] transition-colors block py-1"
                                href={`#${sub.id}`}
                              >
                                {sub.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Buscador */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Categorías */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3
                className="text-xl font-bold mb-4 text-[#0D161C]"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Categorías
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Políticas Ambientales", count: 12 },
                  { name: "Gestión Hídrica", count: 8 },
                  { name: "Sostenibilidad", count: 15 },
                  { name: "Tecnología Verde", count: 6 },
                ].map((category) => (
                  <li key={category.name}>
                    <Link
                      href={`/ambiental/blog?categoria=${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex justify-between items-center text-gray-600 hover:text-[#10B981] transition-colors py-1"
                    >
                      <span>{category.name}</span>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#10B981] to-[#059669] p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">Mantente informado</h3>
              <p className="text-sm text-green-100 mb-4">
                Suscríbete y recibe lo último en sostenibilidad ambiental.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-white text-white placeholder-green-100 transition-colors"
                  placeholder="tu.email@ejemplo.com"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-[#10B981] font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </aside>
        </main>

        {/* Siguiente artículo */}
        {ARTICLE_DATA.nextArticle && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <Link
              href={`/ambiental/blog/${ARTICLE_DATA.nextArticle.slug}`}
              className="group block p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 mb-2">
                    Siguiente artículo
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0D161C] group-hover:text-[#10B981] transition-colors">
                    {ARTICLE_DATA.nextArticle.title}
                  </h3>
                </div>
                <div className="flex items-center text-[#10B981] transform group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-xl font-semibold mr-3">Leer más</span>
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
