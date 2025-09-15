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

// Artículo de ejemplo para el portal IA
const ARTICLE_DATA: BlogArticle = {
  slug: "como-funciona-llm-transformers",
  title: "Cómo funciona un LLM: desentrañando la arquitectura Transformer",
  category: "Machine Learning",
  date: "2024-09-10",
  readTime: 15,
  excerpt:
    "Una exploración técnica pero accesible de los mecanismos que hacen posible la inteligencia artificial generativa moderna.",
  heroImage:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
  author: {
    name: "Dr. Marcus Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    bio: "Investigador en IA con especialización en modelos de lenguaje y arquitecturas de deep learning.",
  },
  content: {
    introduction:
      "Los Large Language Models (LLMs) han revolucionado la inteligencia artificial, pero ¿cómo funcionan realmente? Detrás de ChatGPT, GPT-4 y otros modelos están los Transformers: una arquitectura elegante que cambió para siempre el procesamiento de lenguaje natural. En este artículo exploramos sus mecanismos internos sin perdernos en matemáticas complejas.",
    sections: [
      {
        id: "que-es-transformer",
        title: "¿Qué es un Transformer?",
        content:
          "Un Transformer es una arquitectura de red neuronal diseñada para procesar secuencias de datos, especialmente texto. A diferencia de las RNN que procesaban palabras una por una, los Transformers pueden analizar toda una oración simultáneamente, lo que los hace mucho más eficientes y capaces de capturar relaciones complejas entre palabras distantes.",
        image:
          "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
        subsections: [
          {
            id: "ventajas-clave",
            title: "Ventajas clave de los Transformers",
            content:
              "• **Paralelización**: Procesa toda la secuencia simultáneamente\n• **Atención global**: Cada palabra puede 'atender' a cualquier otra palabra\n• **Escalabilidad**: Funciona mejor con más datos y parámetros\n• **Transferibilidad**: Se puede preentrenar y luego especializarse",
          },
        ],
      },
      {
        id: "mecanismo-atencion",
        title: "El mecanismo de atención: el corazón del Transformer",
        content:
          "La atención es lo que permite a un Transformer entender qué palabras son importantes para entender el significado de otras palabras. Cuando lees 'El gato que estaba en la mesa se subió a ella', sabes que 'ella' se refiere a 'la mesa'. El mecanismo de atención permite al modelo hacer estas conexiones automáticamente.",
        callout: {
          type: "info",
          title: "Analogía: Atención como un destacador inteligente",
          content:
            "Imagina que tienes un texto y un destacador que cambia de color automáticamente. Para cada palabra, el destacador resalta en diferentes intensidades todas las palabras relevantes para entender esa palabra específica. Eso es básicamente lo que hace la atención.",
        },
        subsections: [
          {
            id: "tipos-atencion",
            title: "Tipos de atención",
            content:
              "1. **Self-attention**: Una palabra atiende a otras palabras en la misma secuencia\n2. **Multi-head attention**: Múltiples 'cabezas' de atención capturan diferentes tipos de relaciones\n3. **Cross-attention**: Atención entre secuencias diferentes (como en traducción)",
          },
          {
            id: "calculo-atencion",
            title: "Cómo se calcula la atención",
            content:
              "Sin entrar en matemáticas complejas, el proceso es:\n1. **Query, Key, Value**: Cada palabra se convierte en tres vectores\n2. **Puntuaciones**: Se calcula qué tan relacionada está cada palabra con las demás\n3. **Pesos**: Las puntuaciones se normalizan para sumar 1\n4. **Output**: Se combina la información ponderada de todas las palabras",
          },
        ],
      },
      {
        id: "arquitectura-completa",
        title: "Arquitectura completa: Encoder y Decoder",
        content:
          "Un Transformer completo tiene dos partes principales: el Encoder (que entiende el input) y el Decoder (que genera el output). Los LLMs modernos como GPT usan solo la parte Decoder, mientras que modelos como BERT usan solo el Encoder. Esta modularidad es parte de su potencia.",
        image:
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
        subsections: [
          {
            id: "encoder-funciones",
            title: "Funciones del Encoder",
            content:
              "• **Embeddings**: Convierte palabras en vectores numéricos\n• **Positional encoding**: Añade información de posición\n• **Multi-head attention**: Captura relaciones entre palabras\n• **Feed-forward**: Procesa la información transformada",
          },
          {
            id: "decoder-funciones",
            title: "Funciones del Decoder",
            content:
              "• **Masked attention**: Solo puede ver palabras anteriores\n• **Cross-attention**: Atiende al output del encoder\n• **Generación autoregresiva**: Predice una palabra a la vez\n• **Output layer**: Convierte vectores en probabilidades de palabras",
          },
        ],
      },
      {
        id: "entrenamiento-llms",
        title: "Entrenamiento de LLMs: de texto a inteligencia",
        content:
          "El entrenamiento de un LLM es un proceso fascinante en dos etapas. Primero, el pre-entrenamiento en enormes cantidades de texto donde el modelo aprende a predecir la siguiente palabra. Luego, el fine-tuning donde se especializa para tareas específicas como responder preguntas o seguir instrucciones.",
        callout: {
          type: "success",
          title: "Emergencia de capacidades",
          content:
            "Lo sorprendente es que capacidades como razonamiento, traducción o programación 'emergen' naturalmente cuando el modelo alcanza cierto tamaño y calidad de datos, sin ser explícitamente programadas.",
        },
        subsections: [
          {
            id: "pre-entrenamiento",
            title: "Fase 1: Pre-entrenamiento",
            content:
              "• **Objetivo**: Predecir la siguiente palabra en millones de textos\n• **Datos**: Libros, artículos, páginas web (terabytes de texto)\n• **Tiempo**: Meses de entrenamiento en supercomputadoras\n• **Resultado**: Modelo que 'entiende' patrones del lenguaje",
          },
          {
            id: "fine-tuning",
            title: "Fase 2: Fine-tuning y alineación",
            content:
              "• **Supervised fine-tuning**: Entrenamiento con ejemplos de calidad\n• **RLHF**: Reinforcement Learning from Human Feedback\n• **Constitutional AI**: Enseñar principios éticos y de seguridad\n• **Instruction following**: Capacidad de seguir instrucciones complejas",
          },
        ],
      },
    ],
    conclusion:
      "Los Transformers y LLMs representan uno de los avances más significativos en IA de las últimas décadas. Su elegancia radica en la simplicidad conceptual del mecanismo de atención, que permite capturar relaciones complejas en el lenguaje. A medida que estos modelos continúan evolucionando, prometen transformar no solo cómo interactuamos con las computadoras, sino cómo procesamos y generamos conocimiento humano.",
  },
  tags: [
    "LLM",
    "Transformers",
    "Deep Learning",
    "NLP",
    "Inteligencia Artificial",
  ],
  nextArticle: {
    slug: "difusion-stable-diffusion",
    title: "Cómo funciona el sistema de difusión en IA generativa",
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
    <div className="bg-[#10111A] min-h-screen text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Artículo */}
          <article className="lg:col-span-8">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <ol className="flex items-center space-x-2 text-gray-400">
                <li>
                  <Link href="/ia" className="hover:text-[#00EFFF]">
                    Inicio
                  </Link>
                </li>
                <li>
                  <span>›</span>
                </li>
                <li>
                  <Link href="/ia/blog" className="hover:text-[#00EFFF]">
                    Blog
                  </Link>
                </li>
                <li>
                  <span>›</span>
                </li>
                <li className="text-[#00EFFF] font-medium">
                  {ARTICLE_DATA.category}
                </li>
              </ol>
            </nav>

            {/* Meta + Título */}
            <div className="mb-8">
              <span className="inline-block bg-[#00EFFF] text-[#10111A] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {ARTICLE_DATA.category}
              </span>
              <h1
                className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {ARTICLE_DATA.title}
              </h1>

              <div className="flex flex-wrap items-center text-gray-300 text-sm gap-6 mb-6">
                <div className="flex items-center">
                  <Image
                    alt={`Avatar de ${ARTICLE_DATA.author.name}`}
                    className="rounded-full mr-3"
                    src={ARTICLE_DATA.author.avatar}
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-medium text-white">
                      Por {ARTICLE_DATA.author.name}
                    </div>
                    {ARTICLE_DATA.author.bio && (
                      <div className="text-xs text-gray-400">
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
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
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
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
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
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Introducción */}
              <p className="text-xl leading-relaxed text-gray-300 mb-8 font-medium">
                {ARTICLE_DATA.content.introduction}
              </p>

              {/* Secciones */}
              {ARTICLE_DATA.content.sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-12">
                  <h2
                    className="text-3xl font-bold text-white mb-6"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {section.title}
                  </h2>

                  <div
                    className="text-gray-300 leading-7 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: section.content
                        .replace(/\n/g, "<br>")
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-white">$1</strong>',
                        )
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
                          ? "bg-blue-900/20 border-[#0095FF]"
                          : section.callout.type === "success"
                            ? "bg-green-900/20 border-[#00EFFF]"
                            : "bg-red-900/20 border-red-500"
                      }`}
                    >
                      <div
                        className={`mr-3 text-2xl ${
                          section.callout.type === "info"
                            ? "text-[#0095FF]"
                            : section.callout.type === "success"
                              ? "text-[#00EFFF]"
                              : "text-red-500"
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
                              ? "text-blue-300"
                              : section.callout.type === "success"
                                ? "text-cyan-300"
                                : "text-red-300"
                          }`}
                        >
                          {section.callout.title}
                        </h4>
                        <p
                          className={
                            section.callout.type === "info"
                              ? "text-blue-200"
                              : section.callout.type === "success"
                                ? "text-cyan-200"
                                : "text-red-200"
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
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {subsection.title}
                      </h3>
                      <div
                        className="text-gray-300 leading-7"
                        dangerouslySetInnerHTML={{
                          __html: subsection.content
                            .replace(/\n/g, "<br>")
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="text-white">$1</strong>',
                            )
                            .replace(/• /g, "<br>• "),
                        }}
                      />
                    </div>
                  ))}
                </section>
              ))}

              {/* Conclusión */}
              {ARTICLE_DATA.content.conclusion && (
                <section className="mb-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                  <h2
                    className="text-3xl font-bold text-white mb-6"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Conclusión
                  </h2>
                  <p className="text-gray-300 leading-7 text-lg">
                    {ARTICLE_DATA.content.conclusion}
                  </p>
                </section>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {ARTICLE_DATA.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full hover:bg-[#00EFFF] hover:text-[#10111A] transition-colors cursor-pointer"
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
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3
                className="text-xl font-bold mb-4 text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Tabla de contenidos
              </h3>
              <nav className="toc">
                <ul className="space-y-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        className="text-gray-300 hover:text-[#00EFFF] transition-colors block py-1"
                        href={`#${item.id}`}
                      >
                        {item.title}
                      </a>
                      {item.subsections.length > 0 && (
                        <ul className="pl-4 mt-2 space-y-2 border-l border-gray-700">
                          {item.subsections.map((sub) => (
                            <li key={sub.id}>
                              <a
                                className="text-sm text-gray-400 hover:text-[#00EFFF] transition-colors block py-1"
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
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00EFFF] focus:border-[#00EFFF] text-white placeholder-gray-400 transition-colors"
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
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3
                className="text-xl font-bold mb-4 text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Categorías
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Machine Learning", count: 12 },
                  { name: "Deep Learning", count: 8 },
                  { name: "Transformers", count: 15 },
                  { name: "Computer Vision", count: 6 },
                ].map((category) => (
                  <li key={category.name}>
                    <Link
                      href={`/ia/blog?categoria=${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex justify-between items-center text-gray-300 hover:text-[#00EFFF] transition-colors py-1"
                    >
                      <span>{category.name}</span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#00EFFF] to-[#0095FF] p-6 rounded-xl shadow-lg text-[#10111A]">
              <h3 className="text-xl font-bold mb-2">Mantente actualizado</h3>
              <p className="text-sm text-blue-900 mb-4">
                Suscríbete y recibe lo último en inteligencia artificial.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/30 focus:ring-2 focus:ring-white text-[#10111A] placeholder-gray-600 transition-colors"
                  placeholder="tu.email@ejemplo.com"
                />
                <button
                  type="submit"
                  className="w-full bg-[#10111A] text-[#00EFFF] font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </aside>
        </main>

        {/* Siguiente artículo */}
        {ARTICLE_DATA.nextArticle && (
          <section className="mt-16 pt-8 border-t border-gray-800">
            <Link
              href={`/ia/blog/${ARTICLE_DATA.nextArticle.slug}`}
              className="group block p-8 bg-gray-900/50 rounded-xl border border-gray-800 hover:bg-gray-900/70 transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-400 mb-2">
                    Siguiente artículo
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#00EFFF] transition-colors">
                    {ARTICLE_DATA.nextArticle.title}
                  </h3>
                </div>
                <div className="flex items-center text-[#00EFFF] transform group-hover:translate-x-2 transition-transform duration-300">
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
