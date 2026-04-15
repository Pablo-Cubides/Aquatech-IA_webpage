// Nuevos artículos del blog - Portal IA
// Basados en contenido del equipo de redacción

import type { BlogArticle } from "./blog-articles";

// ============================================
// PORTAL IA - 12 ARTÍCULOS NUEVOS
// ============================================

export const NEW_IA_ARTICLES: Record<string, BlogArticle> = {
  "como-funcionan-los-llm-guia": {
    slug: "como-funcionan-los-llm-guia",
    title: "Cómo funcionan los LLM: De la Tokenización al Transformer",
    category: "LLMs",
    date: "2024-04-14",
    readTime: 10,
    excerpt: "Descubre la mecánica interna de los modelos de lenguaje modernos y cómo logran entender el lenguaje humano.",
    heroImage: "/images/portal-ia/herramientas/como-funcionan-llm.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides-2.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Los Modelos de Lenguaje Grandes (LLMs) como GPT-4 o Claude parecen mágicos, pero su funcionamiento se basa en una arquitectura matemática sólida: el Transformer. Entender este flujo es fundamental para cualquier profesional que quiera dominar la IA.",
      sections: [
        {
          id: "tokenizacion",
          title: "1. Tokenización: El lenguaje de los números",
          content: "Las computadoras no entienden palabras, entienden números. El primer paso es la tokenización, donde el texto se divide en unidades llamadas tokens. Algoritmos como BPE permiten manejar vocabularios masivos eficientemente.",
          image: "/images/portal-ia/blog/modelos-tendencia.jpg",
        },
        {
          id: "atencion",
          title: "2. El Mecanismo de Atención",
          content: "La gran innovación del Transformer es la auto-atención (self-attention). Permite que el modelo 'mire' todas las palabras de una frase simultáneamente y determine cuáles son más relevantes para entender el contexto.",
          callout: {
            type: "info",
            title: "Dato clave",
            content: "El paper 'Attention is All You Need' de 2017 es el origen de toda esta revolución.",
          },
        },
        {
          id: "generacion",
          title: "3. Generación Autorregresiva",
          content: "Un LLM calcula la probabilidad de cuál será la siguiente palabra basándose en las anteriores. Este proceso se repite miles de veces para generar párrafos coherentes.",
        },
        {
          id: "cta",
          title: "Explora la estructura",
          content: "¿Listo para ver esto en acción? Haz clic abajo para interactuar con la arquitectura real.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "[Ir al Diagrama del Transformer](/ia/herramientas/como-funcionan-llm)",
          },
        },
      ],
      conclusion: "El Transformer ha redefinido el procesamiento del lenguaje natural, permitiendo una comprensión contextual que antes parecía imposible.",
    },
    tags: ["Transformer", "Tokenización", "IA", "LLM"],
    nextArticle: {
      slug: "parametros-decodificacion-ia",
      title: "Temperatura, Top-P y Top-K: Los mandos de la IA",
    },
  },
  "parametros-decodificacion-ia": {
    slug: "parametros-decodificacion-ia",
    title: "Temperatura, Top-P y Top-K: Los mandos de la IA",
    category: "LLMs",
    date: "2024-04-13",
    readTime: 12,
    excerpt: "Aprende a controlar la creatividad y precisión de las respuestas de la inteligencia artificial.",
    heroImage: "/images/portal-ia/herramientas/llm-insight.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides-2.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "¿Por qué una IA a veces es muy precisa y otras veces divaga poéticamente? La respuesta está en los parámetros de decodificación que controlan cómo selecciona cada palabra.",
      sections: [
        {
          id: "temperatura",
          title: "Temperatura: El termómetro de la creatividad",
          content: "La Temperatura escala las probabilidades. Una temperatura baja (0.1) obliga al modelo a elegir siempre lo más probable. Una temperatura alta (0.9) fomenta la creatividad.",
        },
        {
          id: "topp",
          title: "Top-P y Top-K: Limitando el caos",
          content: "Top-K considera las K mejores opciones. Top-P (Nucleus Sampling) elige el conjunto cuya probabilidad sumada alcance el valor P. Es más dinámico y natural.",
          image: "/images/portal-ia/blog/productividad-ia-escritorio.jpg",
        },
        {
          id: "cta",
          title: "Experimenta",
          content: "La mejor forma de entenderlo es moviendo los diales tú mismo.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "[Ir al Explorador de Parámetros](/ia/herramientas/explorador-parametros)",
          },
        },
      ],
      conclusion: "Dominar estos ajustes es clave para obtener el mejor rendimiento de cualquier modelo generativo según la tarea requerida.",
    },
    tags: ["Parámetros", "Decodificación", "Prompting"],
    nextArticle: {
      slug: "seguridad-y-filtrado-ia",
      title: "Seguridad en IA: Las capas invisibles",
    },
  },
  "seguridad-y-filtrado-ia": {
    slug: "seguridad-y-filtrado-ia",
    title: "Seguridad en IA: Las capas invisibles",
    category: "Seguridad",
    date: "2024-04-12",
    readTime: 8,
    excerpt: "Analizamos cómo los modelos detectan y filtran contenido para garantizar interacciones seguras.",
    heroImage: "/images/portal-ia/herramientas/filtrado-ia-logo.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides-2.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La seguridad en la Inteligencia Artificial no es accidental; es el resultado de múltiples capas de entrenamiento y monitoreo continuo para evitar riesgos.",
      sections: [
        {
          id: "alineacion",
          title: "Alineación y RLHF",
          content: "Mediante el Aprendizaje por Refuerzo a partir de Retroalimentación Humana, los modelos aprenden a seguir instrucciones de forma ética y a evitar respuestas dañinas.",
        },
        {
          id: "moderacion",
          title: "Moderación en Tiempo Real",
          content: "Sistemas secundarios analizan tanto el prompt como la respuesta antes de mostrarla, bloqueando contenido inapropiado instantáneamente.",
          image: "/images/portal-ia/blog/seguridad-robot-ia.jpg",
        },
        {
          id: "cta",
          title: "Ver el filtrado",
          content: "¿Quieres ver cómo se ve este proceso de moderación en tiempo real?",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "[Ir al Visor de Filtrado](/ia/herramientas/filtrado-ia)",
          },
        },
      ],
      conclusion: "A medida que la IA se vuelve más potente, estas capas de seguridad se vuelven fundamentales para la confianza del usuario.",
    },
    tags: ["Seguridad", "Moderación", "Ética"],
    nextArticle: {
      slug: "el-proceso-de-difusion",
      title: "Difusión: Creando imágenes desde el ruido",
    },
  },
  "el-proceso-de-difusion": {
    slug: "el-proceso-de-difusion",
    title: "Difusión: Creando imágenes desde el ruido",
    category: "Generación de Imágenes",
    date: "2024-04-11",
    readTime: 11,
    excerpt: "Entiende el proceso contraintuitivo que permite a la IA generar arte digital asombroso.",
    heroImage: "/images/portal-ia/herramientas/pixelgen-logo.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides-2.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "A diferencia de otros modelos, los algoritmos de difusión no 'dibujan'. Aprenden a revertir el caos, convirtiendo el ruido en arte.",
      sections: [
        {
          id: "proceso",
          title: "De la destrucción a la creación",
          content: "En el entrenamiento se añade ruido a una imagen. En la generación, el modelo toma un lienzo de ruido aleatorio y lo limpia paso a paso siguiendo un prompt.",
          image: "/images/portal-ia/blog/arte-generativo-colores.jpg",
        },
        {
          id: "pasos",
          title: "Refinamiento incremental",
          content: "Este proceso revela la capacidad de la IA para conceptualizar formas y texturas a partir del caos puro guiada por descriptores semánticos.",
        },
        {
          id: "cta",
          title: "Observa la magia",
          content: "Hemos preparado un visor para que veas este proceso ocurrir paso a paso ante tus ojos.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "[Ir al Visor de Difusión](/ia/herramientas/visor-difusion)",
          },
        },
      ],
      conclusion: "La difusión ha revolucionado el diseño digital, permitiendo niveles de detalle antes reservados para expertos.",
    },
    tags: ["Difusión", "Arte IA", "Stable Diffusion"],
    nextArticle: {
      slug: "papers-fundamentales-ia",
      title: "Papers que cambiaron la historia de la IA",
    },
  },
  "papers-fundamentales-ia": {
    slug: "papers-fundamentales-ia",
    title: "Papers que cambiaron la historia de la IA",
    category: "Investigación",
    date: "2024-04-10",
    readTime: 14,
    excerpt: "Un recorrido por las investigaciones que sentaron las bases de la revolución tecnológica actual.",
    heroImage: "/images/portal-ia/herramientas/llm-tune-logo.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides-2.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La IA moderna se apoya en hombros de gigantes. Conocer estos hitos teóricos es esencial para entender el presente y futuro del campo.",
      sections: [
        {
          id: "hitos",
          title: "Hitos Teóricos",
          content: "Desde el influyente 'Attention is All You Need' hasta 'ResNet' y 'BERT', cada paper ha aportado una pieza del rompecabezas que hoy llamamos IA Generativa.",
        },
        {
          id: "biblioteca",
          title: "La Biblioteca del Futuro",
          content: "Contar con acceso a estas fuentes permite discernir entre tendencias pasajeras e hitos tecnológicos reales.",
          image: "/images/portal-ia/blog/laptop-trabajo-ia.jpg",
        },
        {
          id: "cta",
          title: "Accede a las fuentes",
          content: "Consulta nuestra base de datos curada de papers fundamentales.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "[Ir a Papers y Recursos](/ia/herramientas/papers-ia)",
          },
        },
      ],
      conclusion: "La base teórica es el cimiento de la innovación práctica que vemos cada día.",
    },
    tags: ["Papers", "Teoría", "Transformers"],
    nextArticle: {
      slug: "modelos-open-source-tendencias",
      title: "La explosión del Open Source en IA",
    },
  },
  "modelos-open-source-tendencias": {
    slug: "modelos-open-source-tendencias",
    title: "La explosión del Open Source en IA",
    category: "Investigación",
    date: "2024-04-09",
    readTime: 10,
    excerpt: "Por qué el código abierto está ganando terreno frente a los modelos propietarios.",
    heroImage: "/images/portal-ia/blog/modelos-tendencia.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides-2.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "El futuro de la IA no es solo propiedad de las grandes corporaciones. La comunidad abierta está acelerando el progreso a un ritmo sin precedentes.",
      sections: [
        {
          id: "poder",
          title: "El poder de la comunidad",
          content: "Modelos como Mistral y Llama 3 permiten que cualquier desarrollador pueda ejecutar, modificar y mejorar una IA potente en su propio hardware.",
          image: "/images/portal-ia/blog/flujo-trabajo-digital.jpg",
        },
        {
          id: "democratizacion",
          title: "Democratización",
          content: "Estamos viviendo un momento donde el conocimiento de vanguardia es accesible para todos a través de plataformas como Hugging Face.",
        },
        {
          id: "cta",
          title: "Mira las tendencias",
          content: "¿Quieres ver qué modelos están liderando las descargas en la comunidad hoy?",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "[Ir a Modelos de Tendencia](/ia/herramientas/modelos-tendencia)",
          },
        },
      ],
      conclusion: "El código abierto garantiza que la IA sea una herramienta diversa, segura y accesible para la humanidad.",
    },
    tags: ["Open Source", "Hugging Face", "LLMs"],
    nextArticle: {
      slug: "como-funcionan-los-llm-guia",
      title: "Cómo funcionan los LLM: De la Tokenización al Transformer",
    },
  },
};


export function getLatestIAArticles(count: number = 3): BlogArticle[] {
  return Object.values(NEW_IA_ARTICLES)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
