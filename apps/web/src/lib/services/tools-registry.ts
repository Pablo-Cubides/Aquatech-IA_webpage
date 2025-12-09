import { Tool } from "../types";

/**
 * Registro de herramientas IA
 * Todas las herramientas están implementadas e integradas en el monorepo
 */
export const iaTools: Tool[] = [
  {
    slug: "como-funcionan-llm",
    name: "Cómo Funcionan los LLMs",
    description:
      "Herramienta educativa interactiva que explica paso a paso el funcionamiento interno de los Grandes Modelos de Lenguaje: tokenización, embeddings, atención y generación.",
    type: "public",
    url: "/ia/herramientas/como-funcionan-llm",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ia",
    seo: {
      title: "Cómo Funcionan los LLMs | Herramientas IA | AquatechIA",
      description:
        "Aprende paso a paso cómo funcionan los Grandes Modelos de Lenguaje (LLM): tokenización, embeddings, atención, probabilidades y generación autorregresiva.",
      keywords: [
        "LLM",
        "modelos de lenguaje",
        "GPT",
        "Transformer",
        "tokenización",
        "embeddings",
        "inteligencia artificial",
      ],
    },
  },
  {
    slug: "visor-difusion",
    name: "Visor de Difusión (PixelGen)",
    description:
      "Visualiza paso a paso cómo los modelos de difusión generan imágenes desde ruido puro. Exporta secuencias como GIF animado.",
    type: "public",
    url: "/ia/herramientas/visor-difusion",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ia",
    seo: {
      title: "Visor de Difusión (PixelGen) | Herramientas IA | AquatechIA",
      description:
        "Visualiza paso a paso cómo los modelos de difusión generan imágenes desde ruido puro. Herramienta educativa para Stable Diffusion, DALL-E y similares.",
      keywords: [
        "difusión",
        "generación de imágenes",
        "IA generativa",
        "Stable Diffusion",
        "DALL-E",
        "denoising",
      ],
    },
  },
  {
    slug: "filtrado-ia",
    name: "Cómo la IA Filtra Respuestas",
    description:
      "Comprende los mecanismos de seguridad, moderación y filtrado que utilizan los modelos de IA para clasificar y proteger las respuestas generadas.",
    type: "public",
    url: "/ia/herramientas/filtrado-ia",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ia",
    seo: {
      title: "Cómo la IA Filtra Respuestas | Herramientas IA | AquatechIA",
      description:
        "Comprende los mecanismos de seguridad, moderación y filtrado que utilizan los modelos de IA para analizar y clasificar las respuestas generadas.",
      keywords: [
        "filtrado IA",
        "moderación de contenido",
        "seguridad IA",
        "RLHF",
        "clasificación de riesgo",
      ],
    },
  },
  {
    slug: "parametros-decodificacion",
    name: "Parámetros de Decodificación (LLM Tune)",
    description:
      "Playground educativo interactivo para experimentar con parámetros de LLM: Temperature, Top-k, Top-p y penalización por repetición.",
    type: "public",
    url: "/ia/herramientas/parametros-decodificacion",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ia",
    seo: {
      title:
        "Parámetros de Decodificación (LLM Tune) | Herramientas IA | AquatechIA",
      description:
        "Playground educativo interactivo para experimentar con parámetros de LLM: Temperature, Top-k, Top-p y penalización por repetición.",
      keywords: [
        "temperatura LLM",
        "top-k sampling",
        "top-p nucleus sampling",
        "parámetros de decodificación",
        "generación de texto",
      ],
    },
  },
  {
    slug: "modelos-tendencia",
    name: "Modelos de IA en Tendencia",
    description:
      "Explora los modelos de inteligencia artificial más populares de Hugging Face. Filtra por tendencia semanal o mensual y descubre los últimos avances en machine learning.",
    type: "public",
    url: "/ia/herramientas/modelos-tendencia",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ia",
    seo: {
      title: "Modelos de IA en Tendencia | Hugging Face Explorer | AquatechIA",
      description:
        "Descubre los modelos de inteligencia artificial más populares de Hugging Face con estadísticas en tiempo real.",
      keywords: [
        "modelos de IA",
        "Hugging Face",
        "trending models",
        "machine learning",
        "transformers",
        "LLM",
      ],
    },
  },
  {
    slug: "papers-ia",
    name: "Papers de IA (ArXiv Explorer)",
    description:
      "Explora los artículos científicos más recientes sobre inteligencia artificial desde ArXiv. Búsqueda por categoría, autor y tema con filtros avanzados.",
    type: "public",
    url: "/ia/herramientas/papers-ia",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ia",
    seo: {
      title: "Papers de IA | Investigación ArXiv | AquatechIA",
      description:
        "Explora los artículos científicos más recientes sobre inteligencia artificial desde ArXiv. Machine Learning, NLP, Visión por Computadora y más.",
      keywords: [
        "papers IA",
        "ArXiv",
        "investigación IA",
        "machine learning papers",
        "NLP research",
        "artículos científicos",
      ],
    },
  },
];

/**
 * Registro de herramientas ambientales
 * TODO: Implementar herramientas reales con microservicios
 */
export const ambientalTools: Tool[] = [
  {
    slug: "visor-mapas-ambientales",
    name: "Visor de mapas ambientales",
    description: "Explora datos ambientales en mapas interactivos.",
    type: "public",
    url: "/ambiental/herramientas/visor-mapas-ambientales",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ambiental",
    seo: {
      title: "Visor de Mapas Ambientales | Herramientas Sostenibles",
      description:
        "Visualiza datos ambientales en mapas interactivos y actualizados.",
      keywords: ["mapas ambientales", "datos ambientales", "sostenibilidad"],
    },
  },
  {
    slug: "normas-ambientales",
    name: "Normas ambientales",
    description: "Consulta normativas y regulaciones ambientales.",
    type: "public",
    url: "/ambiental/herramientas/normas-ambientales",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ambiental",
    seo: {
      title: "Normas Ambientales | Herramientas Sostenibles",
      description:
        "Accede a las normativas y regulaciones ambientales actualizadas.",
      keywords: ["normas ambientales", "regulaciones", "legislación ambiental"],
    },
  },
  {
    slug: "generador-matrices",
    name: "Generador de Matrices EIA",
    description:
      "Herramienta educativa para crear matrices de Evaluación de Impacto Ambiental (Leopold, Conesa, Battelle).",
    type: "public",
    url: "/ambiental/herramientas/generador-matrices",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ambiental",
    seo: {
      title: "Generador de Matrices EIA | Herramientas Ambientales",
      description:
        "Crea matrices de evaluación de impacto ambiental con metodologías Leopold, Conesa y Battelle-Columbus paso a paso.",
      keywords: [
        "matriz leopold",
        "matriz conesa",
        "battelle columbus",
        "EIA",
        "evaluación ambiental",
        "impacto ambiental",
      ],
    },
  },
  // 'generador-matrices' removed: tool implemented as a separate package
  {
    slug: "analisis-correlaciones",
    name: "Análisis de correlaciones",
    description: "Análisis avanzado de correlaciones en datos ambientales.",
    type: "public",
    url: "/ambiental/herramientas/analisis-correlaciones",
    owner: "IA-Next",
    version: "1.0.0",
    status: "stable",
    portal: "ambiental",
    seo: {
      title: "Análisis de Correlaciones | Herramientas Sostenibles",
      description:
        "Realiza análisis de correlaciones Pearson, Spearman y Kendall en datos ambientales.",
      keywords: ["análisis de correlaciones", "estadística ambiental", "datos"],
    },
  },
];

/**
 * Function to get tools by portal
 */
export function getToolsByPortal(portal: "ia" | "ambiental"): Tool[] {
  return portal === "ia" ? iaTools : ambientalTools;
}

/**
 * Function to get a tool by slug and portal
 */
export function getToolBySlug(
  slug: string,
  portal: "ia" | "ambiental",
): Tool | null {
  const tools = getToolsByPortal(portal);
  return tools.find((tool) => tool.slug === slug) || null;
}

/**
 * Function to validate if a slug exists
 */
export function isValidToolSlug(
  slug: string,
  portal: "ia" | "ambiental",
): boolean {
  return getToolBySlug(slug, portal) !== null;
}
