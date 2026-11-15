// SEO-optimized blog categories configuration
// All slugs are lowercase, without accents, URL-safe

export type BlogCategory = {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  intro?: string; // texto de apoyo bajo el encabezado de la categoria (contexto para el lector y para buscadores)
  metaTitle: string; // máx ~60 caracteres
  metaDescription: string; // 120-160 caracteres
  h1: string;
  keywords: string[];
  noindex?: boolean; // Para categorías ocultas
  phase: 1 | 2; // Fase de implementación
};

// ============================================
// CATEGORÍAS PORTAL AMBIENTAL
// ============================================
export const AMBIENTAL_CATEGORIES: BlogCategory[] = [
  // FASE 1 - Categorías principales
  {
    slug: "normatividad-ambiental",
    name: "Normatividad y legislación ambiental",
    displayName: "Normatividad Ambiental",
    description:
      "Artículos sobre normativas, leyes y regulaciones ambientales en Colombia y Latinoamérica.",
    intro: "La normatividad ambiental colombiana se reparte entre decretos y resoluciones técnicas que definen límites para el agua potable, los vertimientos, el aire y los residuos. Esta categoría resume qué exige cada norma y cómo se mide el cumplimiento. Para consultar los límites por sector y descargar los textos completos, usa el Navegador de Normas Ambientales del portal.",
    metaTitle: "Normatividad Ambiental | Legislación y Regulaciones",
    metaDescription:
      "Guías y análisis sobre normativas ambientales, decretos, resoluciones y legislación ambiental vigente en Colombia y Latinoamérica.",
    h1: "Normatividad y legislación ambiental",
    keywords: [
      "normativa ambiental",
      "legislación ambiental",
      "decretos ambientales",
      "resoluciones ambientales",
      "regulaciones medioambientales",
    ],
    phase: 1,
  },
  {
    slug: "gestion-ambiental-instrumentos",
    name: "Gestión ambiental e instrumentos",
    displayName: "Gestión Ambiental",
    description:
      "Herramientas, metodologías e instrumentos para la gestión ambiental empresarial y pública.",
    metaTitle: "Gestión Ambiental | Instrumentos y Metodologías",
    metaDescription:
      "Guías sobre instrumentos de gestión ambiental: EIA, planes de manejo, licencias ambientales, ISO 14001 y herramientas de evaluación.",
    h1: "Gestión ambiental e instrumentos",
    keywords: [
      "gestión ambiental",
      "instrumentos ambientales",
      "EIA",
      "licencia ambiental",
      "ISO 14001",
      "plan de manejo ambiental",
    ],
    phase: 1,
  },
  {
    slug: "control-tratamiento-contaminacion",
    name: "Control y tratamiento de la contaminación",
    displayName: "Control de Contaminación",
    description:
      "Técnicas y tecnologías para el control, prevención y tratamiento de la contaminación ambiental.",
    intro: "Técnicas para medir, prevenir y tratar la contaminación del agua y del aire. Aquí encontrarás desde cómo interpretar los índices de calidad del aire (AQI, ICA e IBOCA) hasta los procesos avanzados para tratar aguas con contaminantes emergentes. Cada artículo explica el mecanismo y cuándo conviene aplicarlo, y se complementa con calculadoras gratuitas del portal.",
    metaTitle: "Control de Contaminación | Tratamiento y Prevención",
    metaDescription:
      "Artículos sobre técnicas de control y tratamiento de contaminación del agua, aire y suelo. Tecnologías de remediación ambiental.",
    h1: "Control y tratamiento de la contaminación",
    keywords: [
      "control contaminación",
      "tratamiento aguas",
      "tratamiento residuos",
      "remediación ambiental",
      "control emisiones",
    ],
    phase: 1,
  },
  {
    slug: "nuevas-tecnologias-ambientales",
    name: "Nuevas tecnologías ambientales",
    displayName: "Tecnologías Ambientales",
    description:
      "Innovación y tecnologías emergentes aplicadas a la sostenibilidad y protección ambiental.",
    metaTitle: "Tecnologías Ambientales | Innovación Sostenible",
    metaDescription:
      "Explora las últimas tecnologías ambientales: sensores IoT, IA para medio ambiente, energías renovables y soluciones sostenibles.",
    h1: "Nuevas tecnologías ambientales",
    keywords: [
      "tecnología ambiental",
      "innovación sostenible",
      "IoT ambiental",
      "energías renovables",
      "tecnología verde",
    ],
    phase: 1,
  },
  // FASE 2 - Categoría oculta (noindex)
  {
    slug: "gestion-comunitaria-casos-exito-ambientales",
    name: "Gestión comunitaria y casos de éxito ambientales",
    displayName: "Casos de Éxito",
    description:
      "Historias de éxito y proyectos de gestión ambiental comunitaria.",
    metaTitle: "Casos de Éxito Ambientales | Gestión Comunitaria",
    metaDescription:
      "Conoce casos de éxito en gestión ambiental comunitaria, proyectos participativos y experiencias de conservación en comunidades.",
    h1: "Gestión comunitaria y casos de éxito ambientales",
    keywords: [
      "casos de éxito ambientales",
      "gestión comunitaria",
      "proyectos ambientales",
      "conservación participativa",
    ],
    noindex: true,
    phase: 2,
  },
];

// ============================================
// CATEGORÍAS PORTAL IA
// ============================================
export const IA_CATEGORIES: BlogCategory[] = [
  // FASE 1 - Categorías principales
  {
    slug: "fundamentos-inteligencia-artificial",
    name: "Fundamentos de inteligencia artificial",
    displayName: "Fundamentos de IA",
    description:
      "Conceptos básicos, historia y principios fundamentales de la inteligencia artificial.",
    intro: "Aquí empiezas si quieres entender la inteligencia artificial sin tecnicismos: qué es, cómo aprende un modelo y qué límites tiene. Los artículos de esta categoría explican los conceptos con ejemplos concretos, incluido un tema que casi nunca se discute, el consumo de agua de la IA. Son lecturas para estudiantes, docentes y profesionales que quieren una base clara antes de pasar a los modelos de lenguaje o a las herramientas de automatización.",
    metaTitle: "Fundamentos de IA | Conceptos Básicos",
    metaDescription:
      "Aprende los fundamentos de la inteligencia artificial: machine learning, deep learning, redes neuronales y conceptos esenciales de IA.",
    h1: "Fundamentos de inteligencia artificial",
    keywords: [
      "fundamentos IA",
      "inteligencia artificial básica",
      "machine learning",
      "deep learning",
      "redes neuronales",
    ],
    phase: 1,
  },
  {
    slug: "modelos-lenguaje-asistentes-llm",
    name: "Modelos de lenguaje y asistentes (LLM)",
    displayName: "Modelos de Lenguaje",
    description:
      "Todo sobre Large Language Models, ChatGPT, Claude, y asistentes de IA conversacional.",
    intro: "Los modelos de lenguaje (LLM) son la tecnología detrás de los asistentes conversacionales. Esta categoría explica cómo funcionan por dentro (tokens, atención y generación de texto) y cómo interpretar sus respuestas. Se complementa con las herramientas interactivas del portal, como el visualizador de LLM y el simulador de parámetros de decodificación, para ver el proceso paso a paso.",
    metaTitle: "Modelos de Lenguaje LLM | ChatGPT y Asistentes IA",
    metaDescription:
      "Guías sobre modelos de lenguaje LLM, ChatGPT, Claude, Gemini y asistentes de IA. Prompts, casos de uso y mejores prácticas.",
    h1: "Modelos de lenguaje y asistentes (LLM)",
    keywords: [
      "LLM",
      "ChatGPT",
      "modelos de lenguaje",
      "asistentes IA",
      "Claude",
      "prompts",
      "GPT-4",
    ],
    phase: 1,
  },
  {
    slug: "generadores-imagenes-contenido-creativo-ia",
    name: "Generadores de imágenes y contenido creativo con IA",
    displayName: "IA Generativa Creativa",
    description:
      "Stable Diffusion, DALL-E, Midjourney y herramientas de IA para creación de contenido visual.",
    intro: "Los generadores de imágenes con IA parecen magia, pero siguen un proceso que se puede entender. Esta categoría explica cómo un modelo de difusión convierte ruido en una imagen guiada por texto, por qué Stable Diffusion puede ejecutarse en una tarjeta gráfica común y cuáles son sus límites y riesgos. Puedes ver el proceso en vivo con el visor de difusión del portal.",
    metaTitle: "IA Generativa | Generadores de Imágenes y Arte",
    metaDescription:
      "Tutoriales sobre generadores de imágenes con IA: Stable Diffusion, DALL-E, Midjourney. Crea arte, diseños y contenido visual con IA.",
    h1: "Generadores de imágenes y contenido creativo con IA",
    keywords: [
      "IA generativa",
      "Stable Diffusion",
      "DALL-E",
      "Midjourney",
      "generador imágenes IA",
      "arte IA",
    ],
    phase: 1,
  },
  {
    slug: "productividad-automatizacion-ia",
    name: "Productividad y automatización con IA",
    displayName: "Productividad con IA",
    description:
      "Herramientas y técnicas para aumentar la productividad personal y empresarial con IA.",
    intro: "Guías para llevar la IA al trabajo diario de una empresa: por dónde empezar, qué procesos conviene automatizar primero y cómo introducir agentes autónomos sin perder el control. Los artículos van de lo general (un plan de implementación paso a paso) a lo específico (agentes aplicados a la ingeniería), y están pensados para equipos que quieren resultados medibles y no solo pruebas sueltas.",
    metaTitle: "Productividad con IA | Automatización Inteligente",
    metaDescription:
      "Mejora tu productividad con IA: automatización de tareas, herramientas de trabajo, flujos inteligentes y optimización de procesos.",
    h1: "Productividad y automatización con IA",
    keywords: [
      "productividad IA",
      "automatización IA",
      "herramientas IA",
      "trabajo con IA",
      "eficiencia",
    ],
    phase: 1,
  },
  // FASE 2 - Categoría oculta (noindex)
  {
    slug: "etica-regulacion-futuro-ia",
    name: "Ética, regulación y futuro de la IA",
    displayName: "Ética en IA",
    description:
      "Debates sobre ética, regulación, riesgos y el futuro de la inteligencia artificial.",
    metaTitle: "Ética en IA | Regulación y Futuro",
    metaDescription:
      "Análisis sobre ética en inteligencia artificial, regulaciones, riesgos de la IA, sesgo algorítmico y el futuro de la tecnología.",
    h1: "Ética, regulación y futuro de la IA",
    keywords: [
      "ética IA",
      "regulación IA",
      "futuro inteligencia artificial",
      "sesgo algorítmico",
      "riesgos IA",
    ],
    noindex: true,
    phase: 2,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtiene todas las categorías de un portal
 */
export function getCategories(
  portal: "ia" | "ambiental",
  includeHidden = false,
): BlogCategory[] {
  const categories = portal === "ia" ? IA_CATEGORIES : AMBIENTAL_CATEGORIES;
  if (includeHidden) {
    return categories;
  }
  return categories.filter((cat) => !cat.noindex);
}

/**
 * Obtiene una categoría por su slug
 */
export function getCategoryBySlug(
  portal: "ia" | "ambiental",
  slug: string,
): BlogCategory | null {
  const categories = portal === "ia" ? IA_CATEGORIES : AMBIENTAL_CATEGORIES;
  return categories.find((cat) => cat.slug === slug) || null;
}

/**
 * Obtiene categorías por fase
 */
export function getCategoriesByPhase(
  portal: "ia" | "ambiental",
  phase: 1 | 2,
): BlogCategory[] {
  const categories = portal === "ia" ? IA_CATEGORIES : AMBIENTAL_CATEGORIES;
  return categories.filter((cat) => cat.phase === phase);
}

/**
 * Mapeo de categorías antiguas a nuevas (para migración)
 */
export const LEGACY_CATEGORY_MAP: Record<
  string,
  { portal: "ia" | "ambiental"; newSlug: string }
> = {
  // Ambiental legacy categories
  "Políticas Ambientales": {
    portal: "ambiental",
    newSlug: "normatividad-ambiental",
  },
  "Gestión Hídrica": {
    portal: "ambiental",
    newSlug: "control-tratamiento-contaminacion",
  },
  Sostenibilidad: {
    portal: "ambiental",
    newSlug: "gestion-ambiental-instrumentos",
  },
  Conservación: {
    portal: "ambiental",
    newSlug: "gestion-ambiental-instrumentos",
  },
  "Tecnología Verde": {
    portal: "ambiental",
    newSlug: "nuevas-tecnologias-ambientales",
  },

  // IA legacy categories
  "Machine Learning": {
    portal: "ia",
    newSlug: "fundamentos-inteligencia-artificial",
  },
  "Computer Vision": {
    portal: "ia",
    newSlug: "generadores-imagenes-contenido-creativo-ia",
  },
  NLP: { portal: "ia", newSlug: "modelos-lenguaje-asistentes-llm" },
  "Deep Learning": {
    portal: "ia",
    newSlug: "fundamentos-inteligencia-artificial",
  },
};

/**
 * Convierte categoría legacy a nueva
 */
export function mapLegacyCategory(
  legacyCategory: string,
): { portal: "ia" | "ambiental"; newSlug: string } | null {
  return LEGACY_CATEGORY_MAP[legacyCategory] || null;
}

/**
 * Genera URL canónica para categoría
 */
export function getCategoryCanonicalUrl(
  portal: "ia" | "ambiental",
  slug: string,
  baseUrl = "https://aquatechia.com",
): string {
  return `${baseUrl}/${portal}/categoria/${slug}`;
}

/**
 * Genera breadcrumbs para categoría
 */
export function getCategoryBreadcrumbs(
  portal: "ia" | "ambiental",
  category: BlogCategory,
  baseUrl = "https://aquatechia.com",
) {
  return [
    { name: "Inicio", url: `${baseUrl}/${portal}` },
    { name: "Blog", url: `${baseUrl}/${portal}/blog` },
    {
      name: category.displayName,
      url: getCategoryCanonicalUrl(portal, category.slug, baseUrl),
    },
  ];
}
