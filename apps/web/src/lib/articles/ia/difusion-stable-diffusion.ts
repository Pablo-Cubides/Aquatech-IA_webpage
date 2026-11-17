import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde blog-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "difusion-stable-diffusion",
  title:
    "Cómo funciona el sistema de difusión en IA generativa: de ruido a arte",
  category: "Computer Vision",
  date: "2024-09-08",
  readTime: 6,
  excerpt:
    "Descubre los fundamentos matemáticos y conceptuales detrás de Stable Diffusion y otros modelos de generación de imágenes.",
  heroImage:
    "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701249/articulos/aquatech-ia/stable-diffusion-art.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ia/autor/pablo-cubides.png",
    bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
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
          "/images/portal-ia/blog/diffusion-process.jpg",
        callout: {
          type: "info",
          title: "Analogía: El escultor y el mármol",
          content:
            "Imagina un escultor que ve una estatua perfecta dentro de un bloque de mármol. Los modelos de difusión son como ese escultor: ven la imagen perfecta dentro del ruido y gradualmente la 'esculpen' removiendo el ruido paso a paso.",
        },
      },
      {
        "id": "proceso-hacia-adelante",
        "title": "El proceso hacia adelante: destruir una imagen con ruido",
        "content": "En el entrenamiento, el modelo toma una imagen real y le añade ruido gaussiano en muchos pasos pequeños (típicamente cientos o un millar) hasta que no queda rastro de la imagen original. Cada paso sigue un calendario de ruido (noise schedule) que define cuánto se añade en cada momento.\n\nEste proceso no se aprende: es una fórmula fija. Lo valioso es que, al conocer exactamente el ruido que se añadió en cada paso, el sistema dispone de un ejercicio de entrenamiento con respuesta conocida: \"dada esta imagen ruidosa en el paso t, ¿qué ruido se le añadió?\"."
      },
      {
        "id": "red-denoising",
        "title": "La red que aprende a quitar ruido",
        "content": "El corazón del modelo es una red neuronal (en Stable Diffusion, una U-Net) que recibe una imagen ruidosa y el número de paso, y predice el ruido que contiene. Al restarlo, obtiene una versión ligeramente más limpia.\n\nDurante millones de ejemplos, la red aprende regularidades visuales: que los ojos van por pares, que el cielo suele estar arriba o que una sombra sigue la forma del objeto. No memoriza imágenes: aprende una distribución de cómo se ven las imágenes plausibles."
      },
      {
        "id": "espacio-latente",
        "title": "Espacio latente: por qué Stable Diffusion cabe en una tarjeta gráfica",
        "content": "Los primeros modelos de difusión trabajaban directamente sobre los píxeles, lo que exigía muchísimo cálculo. Los modelos de difusión latente (Rombach et al., 2022) comprimen primero la imagen con un autoencoder variacional (VAE): una imagen de 512 × 512 píxeles pasa a una representación de 64 × 64 con 4 canales.\n\nLa difusión ocurre en ese espacio comprimido y, al final, el decodificador del VAE reconstruye la imagen en píxeles. Trabajar con una representación unas 48 veces más pequeña es lo que permitió ejecutar estos modelos en equipos de consumo."
      },
      {
        "id": "texto-a-imagen",
        "title": "Cómo el texto guía la imagen",
        "content": "Para que el modelo obedezca un prompt, el texto pasa primero por un codificador (en Stable Diffusion, CLIP) que lo convierte en vectores numéricos. La U-Net incorpora esos vectores mediante capas de **atención cruzada**: en cada paso consulta el texto para decidir qué rasgos reforzar.\n\nA eso se suma la **guía libre de clasificador** (classifier-free guidance): el modelo calcula una predicción con el prompt y otra sin él, y amplifica la diferencia. El parámetro CFG (frecuente entre 5 y 9) controla la fidelidad al texto: valores bajos dan imágenes más libres; valores altos, más literales pero a menudo saturadas."
      },
      {
        "id": "muestreo",
        "title": "El muestreo: de ruido puro a imagen en 20-50 pasos",
        "content": "Para generar, se parte de ruido aleatorio en el espacio latente y se aplican pasos de eliminación de ruido, cada uno guiado por el texto. El **sampler** (DDIM, Euler, DPM++, entre otros) decide cómo se combina cada predicción en el siguiente estado.\n\n• **Pasos (steps):** entre 20 y 50 suelen bastar; más pasos aumentan el tiempo sin mejorar siempre el resultado.\n• **Semilla (seed):** determina el ruido inicial. Con la misma semilla, el mismo modelo y los mismos parámetros se obtiene la misma imagen.\n• **Resolución:** cada modelo funciona mejor cerca de la resolución con la que se entrenó."
      },
      {
        "id": "usos-y-control",
        "title": "Más allá del texto: imagen a imagen, relleno y control",
        "content": "La misma maquinaria permite otras tareas:\n\n• **Imagen a imagen (img2img):** en lugar de partir de ruido puro, se parte de una imagen con algo de ruido añadido; el parámetro de intensidad decide cuánto se respeta el original.\n• **Inpainting:** se regenera solo una zona enmascarada de la imagen.\n• **ControlNet:** añade condiciones como bordes, poses o mapas de profundidad para controlar la composición.\n• **LoRA y ajuste fino:** permiten especializar un modelo en un estilo o sujeto con pocos ejemplos y poco cálculo."
      },
      {
        "id": "limitaciones",
        "title": "Limitaciones y riesgos que conviene conocer",
        "content": "• **Detalles difíciles:** manos, texto legible y conteos exactos siguen siendo puntos débiles, aunque cada generación mejora.\n• **Sesgos:** el modelo refleja los datos de entrenamiento, con estereotipos sobre profesiones, géneros o lugares.\n• **Derechos de autor y consentimiento:** el entrenamiento con obras protegidas es un debate legal abierto en varios países.\n• **Desinformación:** las imágenes sintéticas realistas pueden usarse para engañar; conviene etiquetarlas y verificar el origen de las que recibimos.\n• **Costo energético:** entrenar y servir estos modelos consume electricidad y, de forma indirecta, agua; lo analizamos con cifras en nuestro artículo sobre el consumo de agua de la IA."
      },
      {
        "id": "practica",
        "title": "Buenas prácticas para obtener mejores resultados",
        "content": "1. Describe sujeto, entorno, luz y estilo en ese orden, con frases concretas.\n2. Usa prompts negativos para excluir elementos no deseados.\n3. Fija la semilla mientras ajustas un solo parámetro cada vez.\n4. Genera varias variantes y selecciona; la primera rara vez es la mejor.\n5. Revisa siempre la licencia del modelo y de las imágenes antes de usarlas con fines comerciales."
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Cómo funciona un modelo de difusión?",
            content: "Aprende dos cosas: a añadir ruido gradualmente a imágenes reales hasta convertirlas en ruido puro, y a revertir ese proceso. Para generar, parte de ruido aleatorio y aplica pasos sucesivos de eliminación de ruido guiados por el texto.",
          },
          {
            id: "faq-2",
            title: "¿Por qué Stable Diffusion cabe en una tarjeta gráfica?",
            content: "Porque trabaja en un espacio latente: primero comprime la imagen con un autoencoder variacional (VAE), de modo que una imagen de 512 × 512 píxeles pasa a una representación de 64 × 64, y así exige mucho menos cálculo que trabajar sobre los píxeles.",
          },
          {
            id: "faq-3",
            title: "¿Cómo guía el texto a la imagen?",
            content: "El prompt pasa por un codificador (CLIP en Stable Diffusion) que lo convierte en vectores. La U-Net los incorpora con capas de atención cruzada: en cada paso consulta el texto para decidir qué rasgos reforzar.",
          },
          {
            id: "faq-4",
            title: "¿Cuántos pasos de muestreo se necesitan?",
            content: "Entre 20 y 50 suelen bastar. El sampler (DDIM, Euler, DPM++, entre otros) decide cómo se combina cada predicción en el siguiente estado.",
          },
          {
            id: "faq-5",
            title: "¿Qué limitaciones tienen estos modelos?",
            content: "Las manos, el texto legible y los conteos exactos siguen siendo puntos débiles. Además reflejan los sesgos de sus datos de entrenamiento y plantean dudas de derechos de autor y consentimiento.",
          },
        ],
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
    slug: "que-es-un-modelo-de-lenguaje",
    title: "Qué es un modelo de lenguaje (LLM) y cómo funciona: guía",
  },
});

export default article;
