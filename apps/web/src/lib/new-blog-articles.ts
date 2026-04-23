// Nuevos artículos del blog - Portal IA
// Artículos extendidos con investigación profunda
import type { BlogArticle } from "./blog-articles";

export const NEW_IA_ARTICLES: Record<string, BlogArticle> = {
  "ecosistema-bots-empresariales-cubides": {
    slug: "ecosistema-bots-empresariales-cubides",
    title: "La Trinidad de la Productividad: El Sistema Multi-Agente Cubides Bots",
    category: "Agentes de IA",
    date: "2024-04-23",
    readTime: 15,
    excerpt: "Análisis técnico del ecosistema Cubides_bots: Orquestación modular de agentes locales para productividad académica, personal y empresarial.",
    heroImage: "/images/portal-ia/blog/cubides-bots-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "En un entorno saturado de interfaces pesadas, el proyecto Cubides_bots emerge como una solución de minimalismo productivo. Basado en la línea de comandos y la orquestación de agentes locales, este sistema redefine la automatización mediante un enfoque modular y hermético.",
      sections: [
        {
          id: "orquestacion",
          title: "1. Orquestación Políglota y Modular",
          content: "La robustez de Cubides_bots radica en su base tecnológica diversificada: PowerShell para automatización del sistema, Python para la lógica de LLMs y Node.js para integraciones ágiles. Esta arquitectura permite intercambiar componentes sin comprometer la estabilidad del núcleo.",
        },
        {
          id: "seguridad",
          title: "2. Seguridad Hermética y Aislamiento",
          content: "A diferencia de asistentes convencionales, Cubides_bots implementa aislamiento total a través de Dockerización. Cada agente opera en contenedores independientes, mientras que la gestión de secretos se realiza con SOPS, asegurando privacidad de nivel profesional.",
        },
        {
          id: "trinidad",
          title: "3. La Trinidad de la Especialización",
          content: "El sistema se estructura en tres dominios: \n- **Agente Académico**: Optimizado para investigación y síntesis.\n- **Agente Personal**: Gestión de hábitos y coaching.\n- **Agente Empresarial**: Flujos de trabajo profesionales y automatización de oficina.",
        }
      ],
      conclusion: "Cubides_bots establece un estándar para la IA local y privada, protegiendo la propiedad intelectual mientras optimiza el enfoque cognitivo a través de la potencia multi-agente.",
    },
    tags: ["Agentes IA", "Docker", "Productividad", "Python", "Local AI"],
    nextArticle: {
      slug: "como-funcionan-los-llm-guia",
      title: "Cómo funcionan los LLM: De la Tokenización al Transformer",
    },
  },
  "spartan-plataforma-gestion-inteligente": {
    slug: "spartan-plataforma-gestion-inteligente",
    title: "Spartan: Arquitectura de un Marketplace Inteligente con IA",
    category: "Desarrollo Web",
    date: "2024-04-22",
    readTime: 12,
    excerpt: "Explorando la infraestructura de Spartan, un ecosistema digital que integra gestión de datos, marketplace y servicios automatizados.",
    heroImage: "/images/portal-ia/blog/spartan-webpage-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Spartan representa la convergencia entre el e-commerce moderno y la gestión inteligente de datos. Este proyecto no solo facilita la comercialización de productos, sino que implementa una capa lógica avanzada para la optimización de inventarios y análisis de mercado.",
      sections: [
        {
          id: "marketplace",
          title: "1. Ecosistema de Marketplace",
          content: "La plataforma utiliza un stack moderno para garantizar transacciones rápidas y seguras. La integración con pasarelas de pago y sistemas de logística automatizada permite una escalabilidad sin precedentes en el sector.",
        },
        {
          id: "datos",
          title: "2. Gestión y Analítica de Datos",
          content: "Detrás de la interfaz, Spartan procesa grandes volúmenes de información utilizando arquitecturas de bases de datos optimizadas, permitiendo a los administradores tomar decisiones basadas en tendencias de consumo reales.",
        }
      ],
      conclusion: "Spartan es más que una web; es una infraestructura digital diseñada para soportar los desafíos del comercio y la gestión de servicios en la era de la información.",
    },
    tags: ["E-commerce", "Next.js", "Data Management", "Full Stack"],
  },
  "integracion-llm-whatsapp-chatbot": {
    slug: "integracion-llm-whatsapp-chatbot",
    title: "Chatbots de WhatsApp con LLM: El Futuro de la Atención al Cliente",
    category: "Conversational IA",
    date: "2024-04-21",
    readTime: 10,
    excerpt: "Guía técnica sobre la integración de modelos de lenguaje de gran escala en WhatsApp para crear asistentes conversacionales humanos.",
    heroImage: "/images/portal-ia/blog/chatbot-whatsapp-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La comunicación directa por WhatsApp es vital para las empresas modernas. Integrar LLMs en este canal eleva la experiencia del usuario de simples menús rígidos a conversaciones fluidas y contextuales.",
      sections: [
        {
          id: "arquitectura",
          title: "1. Conectividad y Webhooks",
          content: "El proyecto utiliza la API de WhatsApp Business vinculada a un backend en Node.js/Python. Los webhooks procesan los mensajes en tiempo real, enviándolos al motor de IA para generar respuestas coherentes.",
        },
        {
          id: "memoria",
          title: "2. Contexto y Memoria de Corto Plazo",
          content: "Para que un chatbot sea efectivo, debe recordar el historial de la conversación. Implementamos buffers de memoria que permiten al LLM entender referencias pasadas, creando un diálogo natural y resolutivo.",
        }
      ],
      conclusion: "La democratización de los LLMs está permitiendo que pequeñas y medianas empresas ofrezcan una atención al cliente de nivel élite mediante automatizaciones en WhatsApp.",
    },
    tags: ["WhatsApp API", "LLM", "Chatbots", "Node.js", "AI Integration"],
  },
  "aquatech-ia-portal-ambiental-digital": {
    slug: "aquatech-ia-portal-ambiental-digital",
    title: "Aquatech-IA: Digitalizando la Sostenibilidad Ambiental",
    category: "Soluciones Ambientales",
    date: "2024-04-20",
    readTime: 14,
    excerpt: "Cómo el portal Aquatech-IA utiliza tecnologías de información para facilitar la gestión ambiental y el cumplimiento normativo.",
    heroImage: "/images/portal-ia/blog/aquatech-ia-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Aquatech-IA es la plataforma central donde la ingeniería ambiental se encuentra con la analítica de datos. Este portal ha sido diseñado para centralizar herramientas críticas de cálculo e investigación ambiental.",
      sections: [
        {
          id: "herramientas",
          title: "1. Herramientas de Cálculo y Cumplimiento",
          content: "Desde calculadoras de IRCA hasta simuladores de dispersión, el portal ofrece módulos interactivos que simplifican tareas técnicas complejas, garantizando precisión en los reportes ambientales.",
        },
        {
          id: "educacion",
          title: "2. Repositorio de Conocimiento",
          content: "El blog y las secciones de autor sirven como un hub educativo, transformando datos brutos en insights accionables para profesionales y estudiantes del sector ambiental.",
        }
      ],
      conclusion: "Con Aquatech-IA, estamos construyendo el puente necesario entre la tecnología de vanguardia y la preservación del entorno natural.",
    },
    tags: ["Sostenibilidad", "Ingeniería Ambiental", "EdTech", "Data Science"],
  },
  "como-funcionan-los-llm-guia": {
    slug: "como-funcionan-los-llm-guia",
    title: "Cómo funcionan los LLM: De la Tokenización al Transformer",
    category: "LLMs",
    date: "2024-04-14",
    readTime: 18,
    excerpt: "Descubre la mecánica interna de los modelos de lenguaje modernos. Un análisis profundo sobre tokens, atención y generación autorregresiva.",
    heroImage: "/images/portal-ia/blog/llm-transformer-hero-v2.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Los Modelos de Lenguaje Grandes (LLMs) como GPT-4, Claude o LLaMA han transformado radicalmente la manera en que interactuamos con la tecnología. Sin embargo, detrás de la ilusión de la 'comprensión', existe una arquitectura matemática robusta y elegante: el Transformer. En este artículo, desentrañaremos paso a paso el viaje que recorre una frase desde que la escribes hasta que el modelo emite su respuesta.",
      sections: [
        {
          id: "tokenizacion",
          title: "1. Tokenización: El lenguaje de los algoritmos",
          content: "Las redes neuronales no procesan palabras, procesan números. Antes de que cualquier modelo pueda analizar texto, este debe ser convertido en vectores numéricos. La **tokenización** es el proceso de fragmentación del texto en sub-unidades (tokens). Algoritmos como *Byte-Pair Encoding (BPE)* garantizan que palabras comunes sean un solo token, mientras que palabras raras se desarmen en fragmentos más pequeños.\n\nGracias a este proceso, los LLM pueden lidiar con cualquier palabra nueva en cualquier idioma sin colapsar. La eficiencia de un tokenizador define directamente cuántos recursos consumirá el modelo en su inferencia.",
          image: "/images/portal-ia/blog/tokenization-v2.png",
        },
        {
          id: "atencion",
          title: "2. El Mecanismo de Auto-Atención",
          content: "En arquitecturas antiguas como las RNNs, la IA leía el texto palabra por palabra, olvidando el principio de la frase al llegar al final. La gran innovación del Transformer es el mecanismo de **Self-Attention**.\n\nEl modelo calcula matrices vectoriales (Query, Key, Value) para permitir que cada token 'preste atención' a todos los demás tokens simultáneamente. Así, si la frase es 'El banco estaba cerrado, así que me senté en otro banco', la auto-atención sabe perfectamente que el primer banco es una institución financiera y el segundo es un asiento.",
          callout: {
            type: "info",
            title: "El Origen de Todo",
            content: "El famoso ensayo de Google de 2017, **'Attention is All You Need'**, introdujo esta arquitectura, demostrando que al prescindir totalmente de la recurrencia y apoyarse únicamente en la atención, los modelos podían paralelizarse masivamente en GPUs.",
          },
        },
        {
          id: "generacion",
          title: "3. La Predicción Autorregresiva",
          content: "Una vez que el modelo ha contextualizado la pregunta a través del Transformer, comienza el proceso de generación. Un LLM es, en esencia, una calculadora de probabilidades masiva: su único objetivo es predecir matemáticamente cuál es la palabra (token) más probable que sigue en la secuencia.\n\nUna vez que elige el siguiente token, lo añade al historial (contexto) y repite todo el proceso para el siguiente token. Esto se conoce como generación *autorregresiva*, un ciclo continuo hasta que emite un token de terminación.",
        },
        {
          id: "cta",
          title: "Experimenta la Arquitectura",
          content: "Comprender la teoría es solo el comienzo. Hemos preparado una herramienta interactiva donde puedes visualizar y experimentar cómo interactúan estos componentes internamente al inyectar tu propio texto.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "👉 [Ir al Diagrama Interactivo del Transformer](/ia/herramientas/como-funcionan-llm)",
          },
        },
      ],
      conclusion: "Entender que los LLM son motores probabilísticos con arquitecturas de atención profunda desmitifica la IA, ayudándonos a crear prompts mucho más efectivos y anticipar las limitaciones de estos sistemas.",
    },
    tags: ["Transformer", "Tokenización", "IA", "LLM", "Atención"],
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
    excerpt: "Aprende a controlar la creatividad y precisión de las respuestas generativas de la inteligencia artificial.",
    heroImage: "/images/portal-ia/blog/decoding-parameters-hero-v2.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "¿Alguna vez has notado que al hacerle la misma pregunta a ChatGPT dos veces, las respuestas son sutilmente diferentes? Esto no es un accidente. La Inteligencia Artificial posee capas de aleatoriedad controlada mediante hiperparámetros que dictan su nivel de creatividad y exhaustividad en las predicciones.",
      sections: [
        {
          id: "temperatura",
          title: "1. La Temperatura: El Termostato de la Innovación",
          content: "Cuando el modelo predice la siguiente palabra, obtiene un abanico probabilístico de opciones. La **Temperatura** actúa como un ecualizador de estas probabilidades.\n\n- **Temperatura Baja (0.1 - 0.3):** Las opciones altamente probables se fortalecen. Es ideal para tareas deterministas como escribir código o resumir artículos.\n- **Temperatura Alta (0.7 - 1.0):** Las opciones menos probables ganan peso estadístico. Perfecto para el brainstorming, escritura creativa o poesía.",
        },
        {
          id: "topp",
          title: "2. Top-P (Nucleus Sampling): Control Dinámico",
          content: "En lugar de simplemente jugar con probabilidades escaladas, el hiperparámetro **Top-P** suma secuencialmente la masa de probabilidad estricta. Si fijamos Top-P en 0.90, la red evalúa tokens de mayor a menor hasta que las probabilidades sumen el 90%.\n\nEsto significa que frente a contextos obvios, el modelo restringe sus opciones a solo un par de palabras. Frente a contextos ambiguos, el abanico crece y elige entre muchas opciones aleatoriamente pero con sentido gramatical.",
          image: "/images/portal-ia/blog/decoding-parameters-section-v2.png",
        },
        {
          id: "topk",
          title: "3. Top-K: El Filtro Rígido",
          content: "Mientras Top-P es dinámico, **Top-K** es rígido. Si definimos Top-K en 40, en cada paso el modelo descartará todas las posibles palabras salvo las 40 más probables del diccionario. A diferencia de P, no importa si el token número 41 tenía una probabilidad similar al 40; el modelo instaura una métrica invariable de corte absoluto.",
        },
        {
          id: "cta",
          title: "Controla los Parámetros",
          content: "Saber cuándo usar Temperatura versus Top-P es vital. Generalmente se recomienda modificar uno u otro, no ambos a la vez.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "👉 [Prueba el Explorador de Parámetros Interactivo](/ia/herramientas/explorador-parametros)",
          },
        },
      ],
      conclusion: "Si logramos ajustar con precisión estos tres hiperparámetros, podremos calibrar cualquier modelo como si fuese un piano afinado para entregar tareas desde reportes financieros estrictos hasta narrativas abstractas.",
    },
    tags: ["Top-P", "Top-K", "Temperatura", "Prompting", "Hiperparámetros"],
    nextArticle: {
      slug: "seguridad-y-filtrado-ia",
      title: "Seguridad y Filtrado en Interacciones de IA",
    },
  },
  "seguridad-y-filtrado-ia": {
    slug: "seguridad-y-filtrado-ia",
    title: "Seguridad en IA: Protegiendo el Diálogo Humano-Máquina",
    category: "Seguridad",
    date: "2024-04-12",
    readTime: 16,
    excerpt: "Analizamos cómo los modelos modernos detectan y filtran contenido malicioso para garantizar entornos seguros y éticos.",
    heroImage: "/images/portal-ia/herramientas/ai-filtering-tool-v2.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Imagina un modelo de código abierto entrenado con toda la información de la web; eso incluye contenido violento, ilegal y peligroso. Para convertir este modelo 'crudo' en un asistente amigable y seguro (como Claude o ChatGPT), las empresas tecnológicas desarrollan ecosistemas de filtrado y moderación sumamente sofisticados.",
      sections: [
        {
          id: "alineacion",
          title: "1. RLHF: Reinforcement Learning from Human Feedback",
          content: "La base de la seguridad comienza en la alineación estructural. El modelo base (Base Model) atraviesa un entrenamiento RLHF donde miles de evaluadores humanos califican respuestas. Con esto, un 'Modelo de Recompensas' (Reward Model) penaliza matemáticamente conductas hostiles o inmorales, forzando a la red neuronal a priorizar respuestas informativas y dóciles.",
        },
        {
          id: "moderacion",
          title: "2. Escudos de Moderación Activa",
          content: "A pesar del entrenamiento ético, existen los *Jailbreaks* o vectores de ataque (prompts maliciosos). Aquí intervienen modelos auxiliares conocidos como APIs de Moderación. Estos clasificadores evalúan el prompt del usuario en milisegundos bajo etiquetas como Odio, Automutilación Política o Violencia Explícita.",
          image: "https://images.unsplash.com/photo-1555949963-aa79dcee57d1?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: "filtros",
          title: "3. Red-Teaming Constante",
          content: "Los investigadores emplean equipos de cibercriminalística conocidos como *Red Teams*, cuya única labor es tratar de romper el modelo y encontrar vulnerabilidades lógicas. Cada vez que logran extraer información restringida, la brecha es analizada y re-entrenada en los sistemas de RLHF.",
        },
        {
          id: "cta",
          title: "Analiza Textos Crudamente",
          content: "Entender qué flaggeará un modelo clasificador de textos es indispensable si quieres construir aplicaciones productivas de IA.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "👉 [Utiliza el Visor de Filtrado de IA](/ia/herramientas/filtrado-ia)",
          },
        },
      ],
      conclusion: "El principal desafío de la IA en la próxima década no será cuántos parámetros tiene un modelo, sino lograr el equilibrio perfecto entre seguridad inquebrantable y libertad creativa.",
    },
    tags: ["Seguridad", "Moderación", "Ética", "RLHF", "Red Teaming"],
    nextArticle: {
      slug: "generacion-de-imagenes-difusion",
      title: "Modelos de Difusión Espacial",
    },
  },
  "generacion-de-imagenes-difusion": {
    slug: "generacion-de-imagenes-difusion",
    title: "Creando lo Inexistente: La Matemática de la Difusión Vectorial",
    category: "Visión por Computadora",
    date: "2024-04-11",
    readTime: 14,
    excerpt: "Analizando paso a paso cómo Midjourney y Stable Diffusion convierten el ruido semántico en fotografías impactantes.",
    heroImage: "/images/portal-ia/herramientas/diffusion-viewer-tool-v2.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Hace cinco años, las GANs gobernaban la síntesis de imágenes, pero sufrían de inestabilidad brutal en altas resoluciones. Luego llegaron los **Modelos de Difusión**, un engrane radical inspirado por la termodinámica fundamental de partículas que destronó a todo lo conocido, proveyendo un hiper-realismo controlable gracias al condicionamiento por texto.",
      sections: [
        {
          id: "ruido",
          title: "1. Termodinámica Artificial: Arruinar para Aprender",
          content: "El entrenamiento (Forward Diffusion) implica añadir conscientemente grados progresivos de ruido gaussiano a imágenes de alta definición, etapa por etapa, hasta que solo quedan píxeles borrosos. La red neuronal U-Net no memoriza la imagen; en cambio, aprende las operaciones matemáticas inversas requeridas para retirar precisamente esa capa de ruido.",
          image: "https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: "denoising",
          title: "2. Denoising Condicionado por CLIP",
          content: "En inferencia, el sistema parte de ruido infinito 100% aleatorio. Se alimenta lo que tú pediste vía texto a un modelo lingüístico (como OpenAI CLIP), transformándolo en tensores matemáticos. Con este molde vectorial, la U-Net extrae, capa tras capa, la información que no coincide con tu prompt de texto. Limpiando la niebla en iteraciones discretas (steps).",
        },
        {
          id: "control",
          title: "3. Redes de Control como ControlNet",
          content: "Las implementaciones de frontera ahora utilizan capas adicionales como ControlNet, incrustando geometrías estáticas, profundidades y poses para que la síntesis de ruido se adapte firmemente a restricciones humanas, combinando un pincel creativo absoluto con una rigurosidad espacial perfecta.",
        },
        {
          id: "cta",
          title: "Genera tu Arte",
          content: "Observar el desvanecimiento del ruido en iteraciones es la mejor ilustración posible de inteligencia estadística.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "👉 [Despliega el Visor de Difusión y Genera Arte](/ia/herramientas/visor-difusion)",
          },
        },
      ],
      conclusion: "Los difusores revolucionan nuestro nexo creativo con las máquinas. Su expansión del modelo matricial nos ha llevado hacia una generación procedural ilimitada.",
    },
    tags: ["Difusión", "Arte Generativo", "Stable Diffusion", "U-Net", "CLIP"],
    nextArticle: {
      slug: "papers-fundamentales-ia",
      title: "Documentos Esenciales de IA",
    },
  },
  "papers-fundamentales-ia": {
    slug: "papers-fundamentales-ia",
    title: "De Turing al Transformer: Papers que Forjaron la Era IA",
    category: "Investigación",
    date: "2024-04-10",
    readTime: 20,
    excerpt: "Navegamos a través de la bibliografía definitiva y los ensayos revisados por pares que catapultaron la algoritmia moderna a la omnipresencia global.",
    heroImage: "/images/portal-ia/herramientas/ai-papers-tool-v2.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La Inteligencia Artificial puede parecer una fiebre surgida de un día para otro, pero es el clímax de décadas de experimentación académica. Investigadores clave, enfrentados a severos cuellos de botella computacionales y escepticismo, redactaron propuestas algorítmicas ('Papers') que fracturaron permanentemente los paradigmas de escalabilidad e iteración.",
      sections: [
        {
          id: "historicos",
          title: "1. Ruptura de Paradigmas Históricos",
          content: "Todo gran investigador debe detenerse en *'Computing Machinery and Intelligence'* de Alan Turing (1950) y los pilares del deep learning establecidos en *'ImageNet Classification with Deep Convolutional Neural Networks'* de Alex Krizhevsky (2012) que inauguró el boom de la visión computarizada apoyada en Hardware Gráfico (GPUs).",
        },
        {
          id: "era-moderna",
          title: "2. La Edad de la Atención (2017)",
          content: "No existe texto más sagrado en el estado del arte moderno que *'Attention Is All You Need'* de Vaswani et al. Este documento liberó el procesamiento NLP de cadenas recurrentes secuenciales hacia una ejecución paralela hiper-eficiente. Poco después, *'BERT: Pre-training of Deep Bidirectional Transformers'* evidenció cómo la atención bidireccional establecía récords universales de exactitud semántica.",
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: "investigacion-actual",
          title: "3. Descubrimientos de Frontera Actual",
          content: "Las investigaciones de los últimos años están altamente concentradas en escalabilidad. Documentos emblemáticos como el paper de *Chinchilla* probaron que estábamos escalando mal el peso paramétrico versus el dataset óptimo. Otras joyas técnicas documentan innovaciones en *Quantization* y *LoRA* (Low-Rank Adaptation) para democratizar computos monstruosos a portátiles comerciales.",
        },
        {
          id: "cta",
          title: "Lleva tu Conocimiento al Siguiente Nivel",
          content: "Tenemos una curaduría clasificada y categorizada que mapea la interdependencia histórica de todos estos papers geniales.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "👉 [Consulta el Banco de Papers Fundamentales](/ia/herramientas/papers-ia)",
          },
        },
      ],
      conclusion: "Mantenerse al día no implica leerlo absolutamente todo, sino saber distinguir entre implementaciones pasajeras y arquitecturas que redefinirán los manuales universitarios.",
    },
    tags: ["Papers", "Teoría", "Investigación", "Deep Learning", "Bibliografía"],
    nextArticle: {
      slug: "modelos-open-source-tendencias",
      title: "Modelos Open Source de Mayor Demanda",
    },
  },
  "modelos-open-source-tendencias": {
    slug: "modelos-open-source-tendencias",
    title: "El Ascenso Imparable del Ecosistema IA: Open Source Categórico",
    category: "Investigación Práctica",
    date: "2024-04-09",
    readTime: 15,
    excerpt: "Analítica del frente abierto, los repositorios comunitarios, la irrupción de Llama 3 y la balanza competitiva frente a oligopolios cerrados.",
    heroImage: "/images/portal-ia/herramientas/ai-trending-models-tool-v2.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Existe un memorando interno filtrado muy famoso de Google titulado 'We Have No Moat' (No tenemos foso defensivo). Argumentaba que mientras gigantes corporativos disputaban premios aislados, una comunidad no monetizada de desarrolladores en código abierto estaba replicando sigilosamente las capacidades empresariales billonarias empleando recursos escasos. Hoy en día, esta amenaza competitiva se manifiesta contundentemente.",
      sections: [
        {
          id: "arquitecturas-abiertas",
          title: "1. Modelos Competitivos en Casa",
          content: "Hace apenas dos años, construir un bot requería depender de llamadas de API propietarias de costo variable. La publicación abierta de familias enteras de pesos como **LLaMA** (Meta), **Mistral** (Mixtral 8x7B) y **Qwen** (Alibaba), dotaron al investigador independiente del poder para forjar servidores LMM on-premise, resguardando la privacidad de sus datos y mitigando la dependencia monopólica.",
        },
        {
          id: "huggingface",
          title: "2. Hugging Face: El Hub Central",
          content: "Sin el ecosistema de Hugging Face, esta democratización hubiera sido estéril. HF estandarizó los pipelines para que el mismo fragmento de código (Transformers library) consuma igualitariamente modelos de visión de Microsoft, NLP de Google o audios de OpenAI. Ha mutado en un repositorio colosal de pesos pre-entrenados y finetuneados.",
          image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
        },
        {
          id: "cuantizacion",
          title: "3. La Magia de Optimizar: GGUF / AWQ",
          content: "El principal verdugo del Open Source era el factor VRAM. Correr un modelo poderoso implicaba comprar placas graficas industriales multimillonarias. La innovación de las precisiones de Cuantización (4-bits, 8-bits GGUF) reduce inteligentemente el peso numérico, permitiendo a computadores gamer correr razonamientos nivel Ph.D.",
        },
        {
          id: "cta",
          title: "Descubre Quién Domina Hoy",
          content: "¿Te perdiste qué modelo generativo open source está dominando el meta-ranking y destronó a la competencia en razonamiento lógico ayer? Lo tenemos cubierto.",
          callout: {
            type: "success",
            title: "Herramienta Activa",
            content: "👉 [Analiza las Tendencias Open Source Diarias](/ia/herramientas/modelos-tendencia)",
          },
        },
      ],
      conclusion: "El espectro privativo seguirá iterando supernúcleos colosales, pero el código abierto ya comprobó ser el contrapeso regulatorio y la navaja suiza versátil de la mayoría de ecosistemas de producción real.",
    },
    tags: ["Open Source", "Hugging Face", "LLMs", "Llama", "Privacidad"],
  },
};

export function getLatestIAArticles(count: number = 3): BlogArticle[] {
  return Object.values(NEW_IA_ARTICLES)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
