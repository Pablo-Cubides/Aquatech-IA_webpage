// Configuración de artículos para ambos portales
// Este archivo puede ser editado fácilmente para agregar nuevos artículos

export type BlogArticle = {
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

// Artículos del portal ambiental
export const AMBIENTAL_ARTICLES: Record<string, BlogArticle> = {
  "plan-restauracion-hidrica-2030": {
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
        },
      ],
      conclusion:
        "El Plan de Restauración Hídrica 2030 no es solo una aspiración: es una hoja de ruta práctica hacia la seguridad hídrica global. Con métricas claras, tecnología avanzada y compromiso político, podemos revertir décadas de degradación y construir un futuro donde el agua sea abundante, limpia y accesible para todos.",
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
  },

  "contaminantes-agua-urbana": {
    slug: "contaminantes-agua-urbana",
    title:
      "Los 5 contaminantes más comunes en agua urbana: detección y mitigación",
    category: "Gestión Hídrica",
    date: "2024-09-05",
    readTime: 10,
    excerpt:
      "Panorama completo de los principales contaminantes en redes urbanas y las tecnologías más efectivas para detectarlos y mitigarlos.",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Dr. Carlos Mendoza",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      bio: "Ingeniero químico especializado en tratamiento de aguas y control de contaminación urbana.",
    },
    content: {
      introduction:
        "El agua urbana enfrenta una batalla constante contra múltiples contaminantes que amenzan tanto la salud pública como los ecosistemas acuáticos. Identificar, monitorear y mitigar estos contaminantes es fundamental para garantizar agua segura y sostenible en nuestras ciudades.",
      sections: [
        {
          id: "microplasticos",
          title: "1. Microplásticos: la contaminación invisible",
          content:
            "Los microplásticos, partículas menores a 5mm, se han convertido en uno de los contaminantes más ubicuos en sistemas urbanos. Provienen de textiles sintéticos, neumáticos, productos de cuidado personal y degradación de residuos plásticos más grandes.",
          image:
            "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "warning",
            title: "Impacto en la salud",
            content:
              "Los microplásticos pueden actuar como vectores de contaminantes químicos y patógenos, además de causar inflamación y estrés oxidativo en organismos acuáticos.",
          },
        },
        {
          id: "farmaceuticos",
          title: "2. Contaminantes farmacéuticos emergentes",
          content:
            "Antibióticos, hormonas, analgésicos y otros fármacos llegan a los sistemas hídricos a través de excreción humana y descargas hospitalarias. Las plantas de tratamiento convencionales no están diseñadas para eliminar estos compuestos.",
          subsections: [
            {
              id: "antibioticos-resistencia",
              title: "Antibióticos y resistencia microbiana",
              content:
                "La presencia constante de antibióticos en bajas concentraciones crea presión selectiva que favorece el desarrollo de bacterias resistentes, un problema de salud pública global.",
            },
          ],
        },
      ],
      conclusion:
        "La gestión efectiva de contaminantes urbanos requiere un enfoque integral que combine tecnologías avanzadas de detección, tratamiento especializado y políticas preventivas. La inversión en estas soluciones es fundamental para proteger tanto la salud humana como los ecosistemas acuáticos.",
    },
    tags: [
      "Contaminación",
      "Agua Urbana",
      "Salud Pública",
      "Tecnología",
      "Mitigación",
    ],
    nextArticle: {
      slug: "plan-restauracion-hidrica-2030",
      title: "Plan de restauración hídrica 2030: métricas accionables",
    },
  },
};

// Artículos del portal IA
export const IA_ARTICLES: Record<string, BlogArticle> = {
  "como-funciona-llm-transformers": {
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
        "Los Large Language Models (LLMs) han revolucionado la inteligencia artificial, pero ¿cómo funcionan realmente? Detrás de ChatGPT, GPT-4 y otros modelos están los Transformers: una arquitectura elegante que cambió para siempre el procesamiento de lenguaje natural.",
      sections: [
        {
          id: "que-es-transformer",
          title: "¿Qué es un Transformer?",
          content:
            "Un Transformer es una arquitectura de red neuronal diseñada para procesar secuencias de datos, especialmente texto. A diferencia de las RNN que procesaban palabras una por una, los Transformers pueden analizar toda una oración simultáneamente.",
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
            "La atención es lo que permite a un Transformer entender qué palabras son importantes para entender el significado de otras palabras. Es como un destacador inteligente que resalta automáticamente las palabras relevantes.",
          callout: {
            type: "info",
            title: "Analogía: Atención como un destacador inteligente",
            content:
              "Imagina que tienes un texto y un destacador que cambia de color automáticamente. Para cada palabra, el destacador resalta en diferentes intensidades todas las palabras relevantes para entender esa palabra específica.",
          },
        },
      ],
      conclusion:
        "Los Transformers representan uno de los avances más significativos en IA de las últimas décadas. Su elegancia radica en la simplicidad conceptual del mecanismo de atención, que permite capturar relaciones complejas en el lenguaje.",
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
  },

  "difusion-stable-diffusion": {
    slug: "difusion-stable-diffusion",
    title:
      "Cómo funciona el sistema de difusión en IA generativa: de ruido a arte",
    category: "Computer Vision",
    date: "2024-09-08",
    readTime: 13,
    excerpt:
      "Descubre los fundamentos matemáticos y conceptuales detrás de Stable Diffusion y otros modelos de generación de imágenes.",
    heroImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Dra. Sarah Kim",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      bio: "Especialista en computer vision y modelos generativos, con experiencia en Meta AI y investigación independiente.",
    },
    content: {
      introduction:
        "Los modelos de difusión han revolucionado la generación de imágenes, permitiendo crear arte digital de calidad profesional a partir de simples descripciones de texto. Pero ¿cómo logran transformar ruido aleatorio en imágenes coherentes y detalladas?",
      sections: [
        {
          id: "proceso-difusion",
          title: "El proceso de difusión: añadir y quitar ruido",
          content:
            "Los modelos de difusión funcionan mediante un proceso de dos etapas: primero aprenden a añadir ruido gradualmente a imágenes reales hasta convertirlas en ruido puro, y luego aprenden a revertir este proceso para generar nuevas imágenes.",
          image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "info",
            title: "Analogía: El escultor y el mármol",
            content:
              "Imagina un escultor que ve una estatua perfecta dentro de un bloque de mármol. Los modelos de difusión son como ese escultor: ven la imagen perfecta dentro del ruido y gradualmente la 'esculpen' removiendo el ruido paso a paso.",
          },
        },
      ],
      conclusion:
        "Los modelos de difusión representan un paradigma completamente nuevo en IA generativa. Su capacidad para crear imágenes de alta calidad y su flexibilidad para incorporar condicionamiento textual los convierte en una de las tecnologías más prometedoras para el futuro del arte digital y la creatividad asistida por IA.",
    },
    tags: [
      "Diffusion",
      "Stable Diffusion",
      "Computer Vision",
      "Generative AI",
      "Image Generation",
    ],
    nextArticle: {
      slug: "como-funciona-llm-transformers",
      title: "Cómo funciona un LLM: desentrañando la arquitectura Transformer",
    },
  },
};

// Función helper para obtener artículo por slug y portal
export function getArticle(
  portal: "ia" | "ambiental",
  slug: string,
): BlogArticle | null {
  const articles = portal === "ia" ? IA_ARTICLES : AMBIENTAL_ARTICLES;
  return articles[slug] || null;
}

// Función helper para obtener todos los artículos de un portal
export function getAllArticles(portal: "ia" | "ambiental"): BlogArticle[] {
  const articles = portal === "ia" ? IA_ARTICLES : AMBIENTAL_ARTICLES;
  return Object.values(articles);
}

// Función helper para generar tabla de contenidos
export function generateTOC(sections: BlogArticle["content"]["sections"]) {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    subsections:
      section.subsections?.map((sub) => ({
        id: sub.id,
        title: sub.title,
      })) || [],
  }));
}
