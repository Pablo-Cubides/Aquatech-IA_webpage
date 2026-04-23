// Nuevos artículos del blog - Portal IA
// Artículos extendidos con investigación profunda
import type { BlogArticle } from "./blog-articles";

export const NEW_IA_ARTICLES: Record<string, BlogArticle> = {
  "ecosistema-bots-empresariales-cubides": {
    slug: "ecosistema-bots-empresariales-cubides",
    title: "Cubides_bots: Arquitectura de Multi-Agentes, Seguridad Hermética y Soberanía Tecnológica",
    category: "Agentes de IA",
    date: "2024-04-23",
    readTime: 25,
    excerpt: "Manual técnico detallado sobre el proyecto Cubides_bots: Orquestación modular de agentes locales, aislamiento con Docker, cifrado SOPS/AGE y automatización con PowerShell.",
    heroImage: "/images/portal-ia/blog/cubides-bots-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "En un panorama saturado de soluciones en la nube de 'caja negra', el proyecto Cubides_bots surge como un manifiesto por la soberanía tecnológica. Este ecosistema no es solo un asistente; es una infraestructura de **Multi-Agentes Aislados** diseñada para ejecutarse localmente, garantizando que tus datos y tu propiedad intelectual nunca abandonen tu perímetro. Pero para entender su valor, primero debemos entender qué es exactamente un 'Agente' en el mundo de la IA.",
      sections: [
        {
          id: "que-es-un-agente",
          title: "1. ¿Qué es un Agente de IA y cómo funciona?",
          content: "Un modelo de lenguaje común (como ChatGPT en su versión básica) es reactivo: esperas que responda a una pregunta directa y ahí termina su labor. Un **Agente de Inteligencia Artificial**, por otro lado, es proactivo.\n\nSe trata de un sistema que envuelve al modelo de lenguaje con herramientas adicionales (acceso web, ejecución de código, lectura de archivos, capacidad de memoria a largo plazo) y un bucle de razonamiento autónomo. Al darle un objetivo complejo a un agente, este puede:\n1. **Planificar:** Dividir el problema en sub-tareas.\n2. **Ejecutar:** Utilizar herramientas externas como buscar en Google o ejecutar un script de Python.\n3. **Evaluar:** Analizar si el resultado fue el esperado y corregirse si se equivoca.\n\nLa ventaja de tener agentes en lugar de simples chatbots es que se convierten en verdaderos 'empleados digitales' capaces de ejecutar flujos de trabajo asíncronos y multipaso sin supervisión humana constante.",
        },
        {
          id: "arquitectura",
          title: "2. La Arquitectura de la 'Trinidad': Tres Dominios, Tres Agentes",
          content: "Aplicando estos conceptos fundamentales, el sistema Cubides_bots no centraliza todo en un único 'super-agente', sino que divide las cargas cognitivas en tres identidades especializadas, cada una con su propia pila tecnológica y base de habilidades (tools):\n\n- **Agente Académico (Colega):** Escucha en el puerto `18789`. Especializado en navegar bases de datos científicas, leer papers y sintetizar metodologías.\n- **Agente Personal (Coach):** Opera directamente en la terminal interactiva. Su 'system prompt' y memoria están calibrados para la planificación de hábitos y resolución de problemas diarios.\n- **Agente Empresarial (Socio):** Desarrollado con FastAPI, expone endpoints en el puerto `8003`. Está armado con herramientas de manipulación de hojas de cálculo, redacción corporativa y gestión de correos electrónicos.\n\nEsta separación evita la 'alucinación cruzada', asegurando que el agente de investigación científica no se confunda con tareas de contabilidad.",
        },
        {
          id: "docker-hardening",
          title: "3. Contenedorización y Hardening de Seguridad",
          content: "Otorgarle a un agente la capacidad de ejecutar código o acceder a tus archivos locales es inherentemente peligroso si el modelo alucina o sufre un ataque de inyección de prompt. Por eso, cada agente dentro de Cubides_bots vive dentro de un entorno Dockerizado con políticas de seguridad agresivas:\n\n```yaml\nservices:\n  academic-agent:\n    cap_drop: [ALL] # Elimina capacidades peligrosas del kernel\n    read_only: true # Filesystem de solo lectura\n    security_opt:\n      - no-new-privileges:true\n```\n\nEste nivel de 'Hardening' garantiza que el agente funcione en una 'sandbox' criptográficamente aislada. Si el Agente Académico intenta borrar el disco C:, fallará silenciosamente.",
        },
        {
          id: "power-shell",
          title: "4. El Motor de Orquestación: PowerShell 7+",
          content: "Para coordinar a estos empleados digitales, el **83.1% de la lógica de orquestación** de Cubides_bots utiliza PowerShell Core 7. \n\nScripts automatizados se encargan de despertar a los agentes solo cuando se necesitan, inyectar el contexto correcto, y lo más importante, ejecutar rutinas para apagar y purgar el entorno (`Clean-Runtime.ps1`) una vez el agente completa su labor, garantizando eficiencia de recursos en la máquina host.",
        },
        {
          id: "secretos",
          title: "5. Criptografía con SOPS y AGE",
          content: "Para que un agente sea verdaderamente autónomo, necesita llaves API (OpenAI, Anthropic, SerpAPI). En Cubides_bots, la gestión de estos secretos se realiza mediante **SOPS (Secrets Operations)**.\n\nLos agentes carecen de las llaves maestras; es el orquestador maestro (PowerShell) quien descifra asimétricamente los archivos `.enc.yaml` por milisegundos, los inyecta en la RAM volátil del contenedor del agente y borra el rastro. Esto permite que todo el código del sistema, incluyendo su configuración, pueda subirse a GitHub sin comprometer la seguridad.",
          callout: {
            type: "info",
            title: "Visita el Proyecto",
            content: "👉 Explora el código del sistema y aprende a orquestar tus propios agentes en [Pablo-Cubides/Cubides_bots](https://github.com/Pablo-Cubides/Cubides_bots)",
          },
        }
      ],
      conclusion: "Tener agentes de IA es dar un paso de la asistencia básica a la colaboración digital activa. Cubides_bots demuestra que es posible delegar tareas de alto nivel operando con tecnología open-source, de forma totalmente soberana, en la privacidad de tu propio hardware.",
    },
    tags: ["Agentes IA", "Docker", "PowerShell", "Security", "SOPS", "Local-AI"],
  },
  "spartan-plataforma-gestion-inteligente": {
    slug: "spartan-plataforma-gestion-inteligente",
    title: "Spartan Club: Arquitectura de una Plataforma de Marketplace y Coaching Multimodal (v1.1.0)",
    category: "Desarrollo Web",
    date: "2024-04-22",
    readTime: 15,
    excerpt: "Explorando la infraestructura avanzada de Spartan: Next.js 15, integración con Gemini 1.5 Flash para visión artificial y sistemas de pagos resilientes.",
    heroImage: "/images/portal-ia/blog/spartan-webpage-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Spartan no es solo un sitio web; es un organismo digital diseñado para soportar un ecosistema masivo de usuarios, marketplace y coaching asistido por inteligencia artificial. Su arquitectura ha evolucionado bajo el lema del rendimiento extremo, utilizando las últimas fronteras del desarrollo web para ofrecer una experiencia fluida, rápida y segura.",
      sections: [
        {
          id: "stack-moderno",
          title: "1. El Corazón Tecnológico: Next.js 15 y React 19",
          content: "Apostando por la innovación, Spartan utiliza **Next.js 15.3** (RC) y **React 19**. Esta combinación permite aprovechar al máximo los *Server Components*, reduciendo drásticamente el JavaScript enviado al cliente. La gestión de datos se apoya en **Prisma 5.17** interactuando con una base de datos **PostgreSQL en Supabase**, garantizando consultas optimizadas y una integridad referencial estricta.",
        },
        {
          id: "ia-multimodal",
          title: "2. Coaching Multimodal con Gemini 1.5 Flash",
          content: "La gran innovación de Spartan es su motor de IA integrado. No se limita al texto; gracias a la implementación de **Google Gemini 1.5 Flash**, la plataforma puede procesar imágenes de los usuarios para realizar análisis de progreso físico y visual. Las conversaciones con el coach no se pierden en el limbo: se almacenan de forma **encriptada** (Firebase Admin SDK + encriptación simétrica) para que solo el usuario tenga acceso a su historial de progreso.",
        },
        {
          id: "resiliencia-pagos",
          title: "3. Marketplace y Resiliencia en Pagos",
          content: "Un marketplace es tan fuerte como su sistema financiero. Spartan ha implementado una arquitectura de pagos dual con **Stripe** y **MercadoPago**. Se gestionan webhooks protegidos mediante firmas criptográficas **HMAC-SHA256**, lo que impide cualquier intento de fraude por inyección de transacciones falsas. El sistema de créditos interno monitoriza meticulosamente el uso de recursos de IA, optimizando los costos operativos.",
        },
        {
          id: "seguridad-escalabilidad",
          title: "4. Seguridad y Rate Limiting",
          content: "Para evitar abusos y ataques de denegación de servicio (DoS), el backend integra **Upstash Redis** para el control de *Rate Limiting*. Todas las entradas de la API están validadas mediante **Zod schemas**, asegurando que los datos que entran al sistema sean íntegros y seguros antes de tocar la persistencia.",
          callout: {
            type: "info",
            title: "Repositorio de Referencia",
            content: "👉 Ver en GitHub: [Pablo-Cubides/spartan](https://github.com/Pablo-Cubides/spartan)",
          },
        }
      ],
      conclusion: "En resumen, Spartan ejemplifica cómo integrar tecnologías de vanguardia —IA multimodal, pagos globales y esquemas de seguridad modernos— en una plataforma coherente preparada para la escala global.",
    },
    tags: ["Next.js 15", "React 19", "Gemini IA", "Fintech", "Supabase"],
  },
  "integracion-llm-whatsapp-chatbot": {
    slug: "integracion-llm-whatsapp-chatbot",
    title: "Enterprise WhatsApp AI Platform: Más allá de la API oficial con Playwright y Celery",
    category: "Conversational IA",
    date: "2024-04-21",
    readTime: 12,
    excerpt: "Desentrañando la ingeniería de un chatbot de WhatsApp empresarial: Automatización con Playwright, gestión de colas distribuida y persistencia SQL.",
    heroImage: "/images/portal-ia/blog/chatbot-whatsapp-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La automatización de WhatsApp para empresas suele estar limitada por costes prohibitivos o APIs rígidas. El proyecto **Chatbot WhatsApp LLM** rompe estas barreras utilizando la potencia de la automatización basada en navegador y orquestación asíncrona, permitiendo integrar cualquier LLM en el canal de comunicación más usado del mundo.",
      sections: [
        {
          id: "playwright",
          title: "1. El Motor de Interacción: Playwright",
          content: "En lugar de depender exclusivamente de webhooks de terceros, este sistema utiliza un módulo de `whatsapp_automator.py` basado en **Playwright**. Este permite simular la interacción en WhatsApp Web con un realismo total, gestionando sesiones persistentes de navegador y detectando cambios reactivos en el DOM para capturar mensajes instantáneamente.",
        },
        {
          id: "celery-workers",
          title: "2. Arquitectura de Workers con Celery",
          content: "Para garantizar que la API de **FastAPI** no se bloquee mientras el chatbot 'piensa' o navega, implementamos una arquitectura de workers distribuidos. Los **Celery Workers** se encargan de ejecutar las estancias del navegador en modo *headless*, permitiendo que el sistema pueda escalar horizontalmente para procesar múltiples conversaciones concurrentes sin latencia perceptible.",
        },
        {
          id: "alembic",
          title: "3. Robustez de Base de Datos con Alembic",
          content: "La gestión de datos no se deja al azar. El sistema utiliza **Alembic** para el versionado y migración del esquema SQL. Esto asegura que cada actualización en el historial de conversaciones o la estructura de los usuarios sea reversible y reproducible, vital para entornos empresariales donde la pérdida de datos no es una opción.",
          callout: {
            type: "info",
            title: "Mira el Código",
            content: "👉 Ver en GitHub: [Pablo-Cubides/chatbot-whatsapp-llm](https://github.com/Pablo-Cubides/chatbot-whatsapp-llm)",
          },
        }
      ],
      conclusion: "Este chatbot representa la combinación perfecta entre automatización de bajo nivel y arquitectura de software moderna, permitiendo que la IA conversacional trabaje realmente para el negocio.",
    },
    tags: ["FastAPI", "Playwright", "Celery", "PostgreSQL", "WhatsApp AI"],
  },
  "aquatech-ia-portal-ambiental-digital": {
    slug: "aquatech-ia-portal-ambiental-digital",
    title: "Monorepos y Ciencia de Datos: El Ecosistema Técnico de Aquatech-IA",
    category: "Soluciones Ambientales",
    date: "2024-04-20",
    readTime: 15,
    excerpt: "Análisis del monorepo Aquatech-IA: Turborepo, pnpm workspaces y la integración de fuentes de datos ambientales masivas (OpenAQ, GBIF).",
    heroImage: "/images/portal-ia/blog/aquatech-ia-hero.png",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ia/autor/pablo-cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Aquatech-IA representa el puente entre la rigurosidad científica del monitoreo ambiental y la agilidad de la ingeniería de software moderna. Construido como un monorepo de alto rendimiento, el portal centraliza flujos de datos complejos para transformarlos en herramientas de decisión inmediata.",
      sections: [
        {
          id: "monorepo",
          title: "1. Gestión con Turborepo y pnpm workspaces",
          content: "Para manejar múltiples aplicaciones (`apps/web`, `apps/api`) y paquetes compartidos de lógica empresarial, Aquatech utiliza **Turborepo** sobre **pnpm workspaces**. Esto nos permite ejecutar builds paralelos con un sistema de caché 'remote caching' que reduce el tiempo de despliegue en un 70%, asegurando que cada componente del ecosistema se mantenga sincronizado.",
        },
        {
          id: "datos-cientificos",
          title: "2. Integración de Macro-datos Ambientales",
          content: "La verdadera potencia de Aquatech reside en su capacidad de ingesta de datos. La plataforma consume en tiempo real APIs globales de **OpenAQ** (calidad del aire), **GBIF** (biodiversidad) y **WQP** (calidad del agua). Estos datos se normalizan mediante una capa de backend enriquecida para alimentar visores cartográficos interactivos basados en **Leaflet** y filtros de IA.",
        },
        {
          id: "ai-first",
          title: "3. Filosofía AI-First y MCP",
          content: "El desarrollo de Aquatech-IA está optimizado para la asistencia por agentes. Implementamos compatibilidad con el **Model Context Protocol (MCP)**, lo que permite que herramientas de IA interactúen directamente con el sistema de archivos y las bases de datos del portal para generar reportes automáticos o realizar diagnosis preventivas de sensores ambientales locales.",
          callout: {
            type: "info",
            title: "Repositorio Web",
            content: "👉 Ver en GitHub: [Pablo-Cubides/Aquatech-IA_webpage](https://github.com/Pablo-Cubides/Aquatech-IA_webpage)",
          },
        }
      ],
      conclusion: "En resumen, Aquatech-IA demuestra que el software ambiental debe ser tan robusto y escalable como cualquier plataforma financiera de Wall Street, poniendo la tecnología al servicio de la preservación del planeta.",
    },
    tags: ["Monorepo", "Turborepo", "Data Science", "Environmental-Tech", "Open Data"],
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
