// Centralized data for IA Tools
// When you update images or data here, it will reflect on all pages

export interface IATool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  tags: string[];
  href: string;
  status: "available" | "coming_soon" | "beta";
}

export const IA_TOOLS: IATool[] = [
  {
    id: "como-funcionan-llm",
    slug: "como-funcionan-llm",
    name: "Cómo funcionan los LLMs",
    shortDescription: "Diagrama claro y detallado de la arquitectura de un modelo Transformer.",
    description: "Explora la arquitectura interna de los Large Language Models, desde el proceso de tokenización hasta el mecanismo de atención y la generación de texto.",
    image: "/images/portal-ia/herramientas/llm-architecture-tool-v2.webp",
    tags: ["LLM", "IA", "Educación"],
    href: "/ia/herramientas/como-funcionan-llm",
    status: "available",
  },
  {
    id: "parametros-decodificacion",
    slug: "parametros-decodificacion",
    name: "Explorador de Parámetros de Decodificación",
    shortDescription: "Entiende cómo afectan la temperatura, top-p y top-k a las respuestas de la IA.",
    description: "Experimenta con los diferentes parámetros que controlan la creatividad y precisión de los modelos de lenguaje en tiempo real.",
    image: "/images/portal-ia/herramientas/llm-parameters-tool-v2.webp",
    tags: ["Parámetros", "Decodificación", "IA"],
    href: "/ia/herramientas/parametros-decodificacion",
    status: "available",
  },
  {
    id: "filtrado-ia",
    slug: "filtrado-ia",
    name: "Cómo la IA filtra las respuestas",
    shortDescription: "Descubre los mecanismos de seguridad y moderación que protegen a los usuarios.",
    description: "Analiza cómo los modelos de IA detectan y filtran contenido inapropiado o peligroso mediante capas de seguridad y alineación.",
    image: "/images/portal-ia/herramientas/ai-filtering-tool-v2.webp",
    tags: ["Seguridad", "Moderación", "IA"],
    href: "/ia/herramientas/filtrado-ia",
    status: "available",
  },
  {
    id: "visor-difusion",
    slug: "visor-difusion",
    name: "Visor de Difusión",
    shortDescription: "Observa el proceso paso a paso de cómo una IA genera una imagen desde el ruido.",
    description: "Visualiza el proceso inverso de difusión, donde el ruido aleatorio se transforma gradualmente en una imagen coherente siguiendo un prompt.",
    image: "/images/portal-ia/herramientas/diffusion-viewer-tool-v2.webp",
    tags: ["Difusión", "Generación", "Imágenes"],
    href: "/ia/herramientas/visor-difusion",
    status: "available",
  },
  {
    id: "papers-ia",
    slug: "papers-ia",
    name: "Papers y Recursos",
    shortDescription: "Selección curada de los papers más influyentes en el campo de la IA moderna.",
    description: "Accede a los fundamentos teóricos de la IA actual, con explicaciones simplificadas y enlaces a los documentos originales.",
    image: "/images/portal-ia/herramientas/ai-papers-tool-v2.webp",
    tags: ["Investigación", "Papers", "Recursos"],
    href: "/ia/herramientas/papers-ia",
    status: "available",
  },
  {
    id: "modelos-tendencia",
    slug: "modelos-tendencia",
    name: "Modelos de Tendencia",
    shortDescription: "Explora los modelos más populares y potentes del momento en Hugging Face.",
    description: "Mantente al día con los modelos Open Source más descargados y valorados por la comunidad de inteligencia artificial.",
    image: "/images/portal-ia/herramientas/ai-trending-models-tool-v2.webp",
    tags: ["Modelos", "Tendencias", "Hugging Face"],
    href: "/ia/herramientas/modelos-tendencia",
    status: "available",
  },
];

// Helper to get featured tools for landing page (first 3)
export function getFeaturedIATools(count: number = 3): IATool[] {
  return IA_TOOLS.slice(0, count);
}

// Helper to get tool by slug
export function getIAToolBySlug(slug: string): IATool | undefined {
  return IA_TOOLS.find((tool) => tool.slug === slug);
}
