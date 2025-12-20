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
    image: "/images/Portal IA/Herramientas/como-funcionan-llm.png",
    tags: ["LLM", "IA", "Educación"],
    href: "/ia/herramientas/como-funcionan-llm",
    status: "available",
  },
  {
    id: "explorador-parametros",
    slug: "explorador-parametros",
    name: "Explorador de Parámetros de Decodificación",
    shortDescription: "Entiende cómo afectan la temperatura, top-p y top-k a las respuestas de la IA.",
    description: "Experimenta con los diferentes parámetros que controlan la creatividad y precisión de los modelos de lenguaje en tiempo real.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    tags: ["Parámetros", "Decodificación", "IA"],
    href: "/ia/herramientas/explorador-parametros",
    status: "available",
  },
  {
    id: "filtrado-ia",
    slug: "filtrado-ia",
    name: "Cómo la IA filtra las respuestas",
    shortDescription: "Descubre los mecanismos de seguridad y moderación que protegen a los usuarios.",
    description: "Analiza cómo los modelos de IA detectan y filtran contenido inapropiado o peligroso mediante capas de seguridad y alineación.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
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
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
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
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
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
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
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
