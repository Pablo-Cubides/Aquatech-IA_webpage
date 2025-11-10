import { Tool } from "../types";

/**
 * Registro de herramientas IA
 * TODO: Implementar herramientas reales con microservicios
 */
export const iaTools: Tool[] = [
  {
    slug: "como-funciona-llm",
    name: "Cómo funciona un LLM",
    description:
      "Explora el funcionamiento interno de los modelos de lenguaje.",
    type: "public",
    url: "https://placeholder-llm-demo.vercel.app",
    owner: "IA-Next",
    version: "1.0.0",
    status: "beta",
    portal: "ia",
    seo: {
      title: "Cómo funciona un LLM | Herramientas IA",
      description:
        "Descubre cómo funcionan los modelos de lenguaje grande (LLM) de manera interactiva.",
      keywords: ["LLM", "inteligencia artificial", "modelos de lenguaje"],
    },
  },
  {
    slug: "sistema-de-difusion",
    name: "Cómo funciona el sistema de difusión",
    description:
      "Comprende los modelos de difusión para generación de imágenes.",
    type: "public",
    url: "https://placeholder-diffusion-demo.vercel.app",
    owner: "IA-Next",
    version: "1.0.0",
    status: "beta",
    portal: "ia",
    seo: {
      title: "Sistema de Difusión | Herramientas IA",
      description:
        "Aprende cómo funcionan los modelos de difusión para generar imágenes.",
      keywords: ["difusión", "generación de imágenes", "IA generativa"],
    },
  },
  {
    slug: "filtros-ia-respuestas",
    name: "Cómo la IA filtra las respuestas",
    description: "Entiende los sistemas de filtrado y moderación de contenido.",
    type: "public",
    url: "https://placeholder-filters-demo.vercel.app",
    owner: "IA-Next",
    version: "1.0.0",
    status: "beta",
    portal: "ia",
    seo: {
      title: "Filtros de IA | Herramientas IA",
      description:
        "Descubre cómo la IA filtra y modera las respuestas generadas.",
      keywords: ["filtros IA", "moderación", "seguridad IA"],
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
 * Función para obtener herramientas por portal
 */
export function getToolsByPortal(portal: "ia" | "ambiental"): Tool[] {
  return portal === "ia" ? iaTools : ambientalTools;
}

/**
 * Función para obtener una herramienta por slug y portal
 */
export function getToolBySlug(
  slug: string,
  portal: "ia" | "ambiental",
): Tool | null {
  const tools = getToolsByPortal(portal);
  return tools.find((tool) => tool.slug === slug) || null;
}

/**
 * Función para validar si un slug existe
 */
export function isValidToolSlug(
  slug: string,
  portal: "ia" | "ambiental",
): boolean {
  return getToolBySlug(slug, portal) !== null;
}
