// Nuevos artículos del blog - Portal IA
// Basados en contenido del equipo de redacción

import type { BlogArticle } from "./blog-articles";

// ============================================
// PORTAL IA - 12 ARTÍCULOS NUEVOS
// ============================================

export const NEW_IA_ARTICLES: Record<string, BlogArticle> = {
  // Categoría: Productividad con IA (Artículos 1, 2, 3)
  "automatizar-tareas-con-ia-sin-programar": {
    slug: "automatizar-tareas-con-ia-sin-programar",
    title: "Tareas repetitivas que puedes automatizar con IA sin saber programar",
    category: "Productividad con IA",
    date: "2025-01-15",
    readTime: 10,
    excerpt: "Descubre 5 tareas diarias que puedes automatizar hoy mismo usando IA: correos, reportes en Excel y organización de archivos. Guía práctica sin código.",
    heroImage: "/images/portal-ambiental/blog/automatizacion-ia-oficina.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Automatizar tareas con IA es hoy la forma más efectiva de \"comprar tiempo\", incluso si nunca has escrito una línea de código. Dejar que la inteligencia artificial se encargue de lo aburrido reduce tus horas de trabajo manual, elimina el error humano y te libera para lo estratégico. A continuación, encontrarás recetas de automatización listas para aplicar en tu trabajo, estudios o negocio.",
      sections: [
        {
          id: "tareas-delegables",
          title: "¿Qué tareas repetitivas puedo delegar a la IA hoy mismo?",
          content: "Este no es un artículo de teoría futurista. Hablamos de problemas reales que consumen tu lunes por la mañana. Estas son las actividades que herramientas como Zapier, ChatGPT o Make pueden hacer por ti ahora:\n\n• **Resumir hilos de correos interminables**\n• **Limpiar bases de datos desordenadas en Excel**\n• **Clasificar facturas y documentos automáticamente**\n• **Convertir notas de voz en listas de tareas**\n• **Extraer datos específicos de PDFs complejos**\n\nLo mejor: no necesitas ser ingeniero de software. Solo necesitas saber conectar \"A\" con \"B\".",
          image: "/images/portal-ambiental/blog/matrices-eia-metodologias.jpg",
        },
        {
          id: "gestion-correo",
          title: "Automatizar la gestión del correo: adiós al Inbox infinito",
          content: "Tu bandeja de entrada es un agujero negro de tiempo. La solución con IA es configurar un asistente que lea, resuma y proponga respuestas.\n\n**Mini-guía práctica:**\n1. Si usas Gmail o Outlook, activa las funciones de IA integradas (Gemini o Copilot)\n2. Para correos largos, usa este prompt: \"*Actúa como mi asistente ejecutivo. Resume este hilo de correos en 3 puntos clave, dime si hay alguna tarea pendiente para mí y redacta una respuesta cordial confirmando recibido.*\"\n3. Si quieres ir más allá, usa Zapier para que cada correo etiquetado como \"Urgente\" te envíe un resumen a Slack o WhatsApp",
          callout: {
            type: "success",
            title: "Herramientas recomendadas",
            content: "• Gemini para Google Workspace\n• Microsoft Copilot en Outlook\n• Zapier (para conectar apps)",
          },
        },
        {
          id: "reportes-excel",
          title: "Automatizar reportes semanales y análisis de datos",
          content: "Hacer el mismo reporte en Excel cada viernes debería ser ilegal en 2025. La IA puede analizar tus datos y escribir el informe por ti.\n\n**Cómo hacerlo paso a paso:**\n1. Sube tu archivo Excel o CSV a ChatGPT (Data Analyst) o usa Copilot en Excel\n2. Escribe la instrucción: \"*Analiza esta tabla de ventas. Identifica las 3 tendencias principales de la semana, compara con el promedio del mes anterior y genera un párrafo de conclusiones para mi jefe.*\"\n3. Copia el resultado. Listo.",
          image: "/images/portal-ambiental/blog/irca-analisis-datos.jpg",
        },
        {
          id: "limpieza-datos",
          title: "Limpieza de bases de datos: el fin del Buscar y Reemplazar",
          content: "La IA es experta en encontrar patrones. Si tienes una lista de clientes con formatos mezclados (unos en mayúsculas, otros sin tildes, teléfonos con y sin código de país), no lo arregles a mano.\n\n**Prompt listo para usar:**\n\"*Toma esta lista desordenada. Estandariza todos los nombres en formato 'Título', pon los teléfonos en formato internacional (+57...) y elimina las filas duplicadas. Entrégame el resultado como una tabla CSV descargable.*\"",
        },
        {
          id: "agendamiento",
          title: "Agendamiento inteligente y recordatorios de contexto",
          content: "Los nuevos agentes de IA no solo ponen una cita; entienden el contexto.\n\n**Ejemplo real:** En lugar de buscar huecos manualmente, puedes decir a herramientas como Gemini o Reclaim.ai:\n\n\"*Busca un espacio de 45 minutos la próxima semana para reunirme con el equipo de diseño. Que no sea lunes por la mañana y asegúrate de que tenga 15 minutos libres antes para prepararme.*\"",
        },
        {
          id: "extraccion-pdfs",
          title: "Extraer datos de PDFs y facturas",
          content: "¿Tienes 50 facturas en PDF y necesitas pasar los totales a Excel?\n\n**Mini-guía:**\n1. Usa una herramienta como ChatPDF o la función de análisis de archivos de ChatGPT\n2. Sube los archivos (en lote si la herramienta lo permite)\n3. Instrucción: \"*Extrae: Fecha, Número de Factura, Proveedor y Total Bruto. Organízalo todo en una tabla.*\"",
          callout: {
            type: "info",
            title: "¿Qué hacer ahora?",
            content: "No esperes al \"momento perfecto\". Mañana a las 9:00 AM, elige una de estas tareas (te recomiendo la de los correos) y pruébala. Te garantizo que recuperarás al menos 30 minutos de tu día.",
          },
        },
      ],
      conclusion: "La automatización con IA ya no es ciencia ficción. Cada una de estas tareas puede implementarse hoy, sin código, y con herramientas gratuitas o de bajo costo. El primer paso es identificar qué tarea te roba más tiempo y aplicar una de estas recetas. Tu futuro yo te lo agradecerá.",
    },
    tags: ["automatización", "productividad", "Zapier", "ChatGPT", "no-code", "Excel", "correo electrónico"],
    nextArticle: {
      slug: "productividad-ia-excel-correo-calendario",
      title: "Cómo combinar IA con Excel, correo y calendario",
    },
  },

  "productividad-ia-excel-correo-calendario": {
    slug: "productividad-ia-excel-correo-calendario",
    title: "Cómo combinar IA con herramientas clásicas como Excel, correo y calendario",
    category: "Productividad con IA",
    date: "2025-01-14",
    readTime: 11,
    excerpt: "Aprende a integrar Inteligencia Artificial en Excel, Gmail, Outlook y tu Calendario. Trucos prácticos para multiplicar tu productividad sin cambiar de apps.",
    heroImage: "/images/portal-ambiental/blog/productividad-ia-escritorio.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La productividad con IA no significa abandonar las herramientas que has usado toda la vida. Al contrario, la magia ocurre cuando \"vitaminizas\" Excel, tu Correo y tu Calendario con inteligencia artificial. Si eres ingeniero, administrativo, docente o emprendedor, integrar la IA en tu flujo de trabajo clásico te dará superpoderes inmediatos: menos errores, análisis instantáneos y una agenda que trabaja para ti, no en tu contra.",
      sections: [
        {
          id: "porque-ia-office",
          title: "¿Por qué la IA es el mejor complemento para tu Office de siempre?",
          content: "Porque elimina la fricción. Ya no tienes que salir de Excel para buscar una fórmula en Google, ni salir del correo para redactar una respuesta formal. La IA ahora vive dentro de estas apps.",
          image: "/images/portal-ambiental/blog/laptop-trabajo-ia.jpg",
        },
        {
          id: "excel-ia",
          title: "Excel + IA: Tu analista de datos personal",
          content: "Aquí es donde la IA brilla con fuerza. Excel ya no es solo una hoja de cálculo; con herramientas como Copilot o complementos de IA, es un motor de análisis.\n\n**Ejemplos concretos de lo que puedes hacer:**\n• **Crear fórmulas complejas con lenguaje natural:** \"Escribe una fórmula que sume la columna B si la columna A dice 'Aprobado' y la fecha en C es de este año\"\n• **Detectar anomalías:** \"Resalta en rojo cualquier valor de venta que esté 20% por debajo del promedio histórico\"\n• **Generar Dashboards:** \"Crea un gráfico de barras comparando las ventas por región y añádelo en una hoja nueva\"",
          callout: {
            type: "info",
            title: "Función clave",
            content: "Busca el botón de 'Copilot' o 'Explore' en tu Excel. Te permite hacer preguntas sobre tus datos en lenguaje natural.",
          },
        },
        {
          id: "correo-ia",
          title: "Correo + IA: Tu secretario 24/7",
          content: "El correo electrónico es la mayor fuente de estrés laboral. La IA te ayuda a procesarlo, no solo a leerlo.\n\n**Aplicaciones reales:**\n• **Resúmenes ejecutivos:** Si te copian en un hilo de 30 correos, pide a la IA: \"Resume la discusión, dime qué se decidió y si tengo alguna tarea asignada\"\n• **Cambio de tono:** Escribe un borrador rápido y sucio con las ideas clave, y pide a la IA: \"Reescribe esto para que suene profesional, empático y conciso\"\n• **Búsqueda semántica:** En lugar de buscar por palabras clave, pregúntale a tu correo: \"¿Cuándo fue la última vez que el cliente X mencionó problemas con la facturación?\"",
          image: "/images/portal-ambiental/blog/gestion-correo-teclado.jpg",
        },
        {
          id: "calendario-ia",
          title: "Calendario + IA: El fin del Tetris de reuniones",
          content: "La IA puede ver tu agenda de forma holística, protegiendo tu tiempo de concentración.\n\n**Lo que puedes lograr:**\n• **Bloques de enfoque:** Herramientas como Reclaim o Clockwise (y ahora Google/Microsoft nativos) pueden mover automáticamente tus reuniones flexibles para garantizarte 2 horas de trabajo profundo al día\n• **Preparación automática:** Configura tu calendario para que, 15 minutos antes de cada reunión, la IA te envíe un resumen de los últimos correos intercambiados con esa persona\n• **Agendamiento dinámico:** \"Agenda una revisión de proyecto la próxima semana, preferiblemente martes o jueves por la tarde\"",
        },
        {
          id: "integracion-zapier",
          title: "Integrar las 3 herramientas con Zapier o Make (Nivel Pro)",
          content: "Si quieres magia real, conecta las tres. Un flujo simple podría ser:\n\n1. Recibes un correo con una factura adjunta\n2. La IA lee el PDF y extrae el monto y la fecha\n3. La IA añade una fila en tu Excel de gastos\n4. La IA crea un evento en tu calendario el día de pago para recordártelo\n\n**Todo esto ocurre mientras duermes.**",
          callout: {
            type: "success",
            title: "¿Qué hacer ahora?",
            content: "Abre tu Excel o tu Correo. Busca el botón de 'Copilot', 'Gemini' o 'IA' (suele ser una estrella o un destello). Púlsalo y pídele algo simple: 'Resume mi última semana'. Ese pequeño paso cambiará tu forma de trabajar.",
          },
        },
      ],
      conclusion: "Las herramientas que ya conoces —Excel, correo y calendario— son ahora más poderosas que nunca gracias a la integración de IA. No necesitas cambiar tu flujo de trabajo; necesitas mejorarlo. Empieza con un botón, un prompt simple, y observa cómo tu productividad se multiplica.",
    },
    tags: ["Excel", "Outlook", "Gmail", "calendario", "Copilot", "productividad", "Office"],
    nextArticle: {
      slug: "flujos-de-trabajo-automaticos-ia",
      title: "Cómo crear flujos de trabajo automáticos con IA",
    },
  },

  "flujos-de-trabajo-automaticos-ia": {
    slug: "flujos-de-trabajo-automaticos-ia",
    title: "Cómo crear flujos de trabajo automáticos con IA para estudiantes y profesionales",
    category: "Productividad con IA",
    date: "2025-01-13",
    readTime: 12,
    excerpt: "Guía paso a paso para crear flujos de trabajo (workflows) automáticos con IA. Conecta Drive, Gmail y WhatsApp sin saber programar. Ideal para estudiantes y PYMES.",
    heroImage: "/images/portal-ambiental/blog/reunion-equipo-ia.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La automatización ya no es un club exclusivo para programadores. Hoy, cualquier estudiante, ingeniero ambiental, administrador o dueño de negocio puede construir \"robots\" de software que conectan sus aplicaciones favoritas. Imagina un asistente invisible que mueve archivos de un lado a otro, avisa a tu equipo y organiza tu vida digital. Aquí verás cómo crear estos flujos usando herramientas visuales y lenguaje natural.",
      sections: [
        {
          id: "que-es-workflow",
          title: "¿Qué es un flujo de trabajo (workflow) con IA?",
          content: "Un flujo de trabajo es simplemente una secuencia de \"Si pasa esto... entonces haz aquello\". La diferencia es que ahora, en medio de esa secuencia, ponemos un cerebro de Inteligencia Artificial para que tome decisiones, resuma textos o clasifique información.",
          image: "/images/portal-ambiental/blog/flujo-trabajo-digital.jpg",
        },
        {
          id: "flujo-bibliotecario",
          title: "Flujo \"El Bibliotecario\": Correo → Resumen → Drive",
          content: "Ideal para estudiantes, investigadores y cualquiera que reciba mucha documentación.\n\n**Cómo funciona:**\n1. **Disparador (Trigger):** Llega un correo a Gmail con un adjunto (PDF/Word)\n2. **Acción IA:** El archivo se envía automáticamente a ChatGPT (vía API en Zapier/Make) con la instrucción: \"Resume los hallazgos clave de este documento y lista las referencias bibliográficas\"\n3. **Resultado:** Se crea un nuevo documento en Google Drive con el resumen y el archivo original se guarda en una carpeta llamada \"Para Leer\"\n\n**Por qué es útil:** Tu carpeta de Drive se llena de conocimiento procesado, no de archivos basura que nunca abrirás.",
          callout: {
            type: "info",
            title: "Herramientas necesarias",
            content: "• Zapier o Make (planes gratuitos disponibles)\n• Cuenta de Gmail\n• Google Drive\n• API de ChatGPT (opcional para nivel avanzado)",
          },
        },
        {
          id: "flujo-secretario",
          title: "Flujo \"El Secretario de Actas\": Reunión → Transcripción → Email",
          content: "Deja de tomar notas frenéticamente en las reuniones.\n\n**El Proceso:**\n1. Graba la reunión (en Zoom, Teams, Meet o incluso una nota de voz)\n2. Sube el archivo a una carpeta de Drive o Dropbox\n3. **Acción IA:** Una herramienta como Whisper (de OpenAI) transcribe el audio a texto. Luego, ChatGPT procesa ese texto: \"Extrae los compromisos, responsables y fechas límite\"\n4. **Entrega:** Se envía un correo automático a todos los asistentes con el acta perfectamente formateada",
          image: "/images/portal-ambiental/blog/transcripcion-reuniones.jpg",
        },
        {
          id: "flujo-guardian",
          title: "Flujo \"El Guardián de la Agenda\": Detección de fechas en correos",
          content: "A veces los compromisos están escondidos en el texto de un email y se nos pasan.\n\n**Ejemplo:** Un profesor o cliente escribe: \"Por favor, necesitamos el informe preliminar para el próximo viernes antes del mediodía.\"\n\n**La automatización:** La IA lee tus correos entrantes, detecta frases que implican una obligación temporal (\"para el viernes\", \"entrega mañana\") y crea automáticamente un evento en tu Google Calendar o Outlook con el asunto \"Entrega pendiente\" y un recordatorio 24 horas antes.",
        },
        {
          id: "flujo-academico",
          title: "Flujo Académico: Clasificador de archivos",
          content: "Si eres estudiante, el caos de archivos \"Trabajo_final_v3_final_ahorasi.docx\" es tu enemigo.\n\n**La solución:** Configura un flujo donde, al subir un archivo a una carpeta general de \"Bajadas\":\n1. La IA lee el contenido del archivo\n2. Determina de qué materia es (Biología, Matemáticas, Historia)\n3. Mueve el archivo a la carpeta correspondiente y lo renombra con una estructura lógica: [Materia]_[Fecha].pdf",
          callout: {
            type: "success",
            title: "¿Qué hacer ahora?",
            content: "Entra a Zapier.com o Make.com (tienen planes gratuitos). Crea tu primer flujo simple hoy: \"Si recibo un correo con la palabra 'Factura', guárdalo en Drive\". Una vez domines eso, añádele la IA. Es un camino de ida hacia la eficiencia.",
          },
        },
      ],
      conclusion: "Los flujos de trabajo automáticos son el superpoder del profesional moderno. No necesitas ser programador para construirlos; solo necesitas identificar los patrones repetitivos en tu trabajo y dejar que la IA se encargue. Empieza con un flujo simple, domínalo, y luego construye sobre él.",
    },
    tags: ["workflows", "automatización", "Zapier", "Make", "Google Drive", "productividad", "estudiantes"],
    nextArticle: {
      slug: "crear-imagenes-profesionales-ia-sin-disenar",
      title: "Cómo crear imágenes profesionales con IA sin saber diseñar",
    },
  },

  // Categoría: IA Generativa Creativa (Artículos 4, 5, 6)
  "crear-imagenes-profesionales-ia-sin-disenar": {
    slug: "crear-imagenes-profesionales-ia-sin-disenar",
    title: "Cómo crear imágenes con aspecto profesional usando IA sin saber dibujar ni diseñar",
    category: "IA Generativa Creativa",
    date: "2025-01-12",
    readTime: 13,
    excerpt: "Aprende a generar imágenes de calidad profesional con DALL-E 3, Midjourney y Stable Diffusion. Guía de 5 pasos para ingenieros y no diseñadores.",
    heroImage: "/images/portal-ambiental/blog/codigo-ia-manos.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "El diseño ya no es una barrera. Hoy, cualquier ingeniero, estudiante o emprendedor puede materializar conceptos visuales de nivel profesional sin tocar un lápiz. Herramientas como Midjourney o DALL-E 3 han democratizado la dirección de arte. A continuación, te explico el flujo de trabajo exacto para pasar de una idea abstracta a un render impactante.",
      sections: [
        {
          id: "elegir-herramienta",
          title: "¿Qué herramienta de IA debo elegir? (Panorama 2025)",
          content: "No todas las IAs sirven para lo mismo. Elige según tu necesidad:\n\n**DALL-E 3 (vía ChatGPT):** La mejor para principiantes. Entiende el lenguaje natural perfectamente y es ideal para seguir instrucciones precisas (ej. \"Pon un casco amarillo al ingeniero\").\n\n**Midjourney (v6/v7):** La reina de la estética. Si necesitas realismo fotográfico, arte conceptual para videojuegos o renders arquitectónicos que ganen concursos, esta es la opción. Requiere Discord o su nueva web alpha.\n\n**Stable Diffusion (SDXL / SD3):** Para control total. Es de código abierto. Si te preocupa la privacidad o quieres instalarlo en tu propio servidor sin pagar suscripciones mensuales, este es el camino.",
          image: "/images/portal-ambiental/blog/arte-generativo-colores.jpg",
        },
        {
          id: "flujo-5-pasos",
          title: "El flujo profesional de 5 pasos para una imagen perfecta",
          content: "No escribas prompts al azar. Sigue este algoritmo creativo:\n\n**1. Define el propósito (El \"Job-to-be-done\")**\n¿Es para una diapositiva de PowerPoint? (Necesitas fondo limpio). ¿Es un render para un cliente? (Necesitas fotorrealismo). ¿Es un icono para una app? (Necesitas vectores planos).\n\n**2. Escribe el prompt con la fórmula maestra**\nNo digas \"un bosque\". Di: [Acción/Contexto] + [Estilo Artístico] + [Iluminación/Cámara]\n\nEjemplo para Ingenieros:\n\"*Planta de tratamiento de aguas residuales moderna, vista aérea isométrica, rodeada de bosque tropical, luz suave de atardecer, estilo render arquitectónico 3D, hiperrealista, 8k.*\"\n\n**3. Genera variaciones**\nLa primera imagen casi nunca es la mejor. En Midjourney, usa el botón V (Variation) para explorar alternativas.\n\n**4. Retoque y Upscaling**\nLas imágenes nativas suelen tener resoluciones medias. Usa las funciones de \"Upscale\" para aumentar la nitidez.\n\n**5. Exportación optimizada**\n• PNG: Para gráficos con texto o líneas finas\n• JPG: Para fotografías complejas\n• WebP: El estándar moderno para webs (carga más rápido)",
          callout: {
            type: "info",
            title: "Fórmula de prompt ganador",
            content: "[Sujeto] + [Estilo/Medio] + [Iluminación] + [Ángulo de cámara] + [Calidad]",
          },
        },
        {
          id: "prompts-copiar",
          title: "Prompts listos para copiar",
          content: "**Para presentaciones corporativas:**\n\"*Infografía minimalista sobre el ciclo del agua, diseño plano (flat design), fondo blanco, paleta de colores azul corporativo y verde, estilo vectorial limpio, alta resolución.*\"\n\n**Para portadas de informes técnicos:**\n\"*Primer plano cinemático de una gota de agua limpia cayendo sobre una hoja, macro fotografía, profundidad de campo baja (fondo desenfocado), iluminación de estudio, nítido.*\"\n\n**Para miniaturas de YouTube:**\n\"*Robot futurista analizando un río, colores neón vibrantes, alto contraste, expresión amigable, estilo arte digital 3D tipo Pixar.*\"",
          image: "/images/portal-ambiental/blog/diseño-vectorial-ia.jpg",
        },
        {
          id: "errores-comunes",
          title: "Errores que arruinan tus imágenes",
          content: "• **Prompts vagos:** \"Un perro\" te dará una imagen genérica. \"Un Golden Retriever con gafas de sol en la playa\" te dará una imagen útil.\n\n• **Olvidar el Aspect Ratio (Relación de aspecto):** Si necesitas una imagen para Instagram (vertical) y generas una horizontal, perderás calidad al recortar. En Midjourney usa --ar 9:16 para historias o --ar 16:9 para pantallas.\n\n• **Pedir texto complejo:** Aunque DALL-E 3 ha mejorado, las IAs aún fallan deletreando palabras largas. Es mejor añadir el texto después con Canva o Photoshop.",
          callout: {
            type: "success",
            title: "Tu misión de hoy",
            content: "Abre Bing Image Creator (que usa DALL-E 3 y es gratis). Escribe el prompt del ejemplo de la \"Planta de tratamiento\" y mira qué sucede. Acabas de convertirte en director de arte.",
          },
        },
      ],
      conclusion: "Crear imágenes profesionales con IA es más sobre dirección creativa que sobre habilidad técnica. El secreto está en ser específico, iterar y conocer las fortalezas de cada herramienta. Empieza con DALL-E 3 si eres principiante, explora Midjourney si buscas estética, y domina Stable Diffusion si quieres control total.",
    },
    tags: ["DALL-E", "Midjourney", "Stable Diffusion", "imágenes IA", "diseño", "prompts", "generación de imágenes"],
    nextArticle: {
      slug: "derechos-autor-imagenes-ia-guia-legal",
      title: "Derechos de autor en imágenes generadas con IA",
    },
  },

  "derechos-autor-imagenes-ia-guia-legal": {
    slug: "derechos-autor-imagenes-ia-guia-legal",
    title: "Qué debes saber sobre derechos de autor al usar imágenes generadas con IA",
    category: "IA Generativa Creativa",
    date: "2025-01-11",
    readTime: 10,
    excerpt: "¿Quién es dueño de una imagen hecha con IA? Guía sobre copyright, uso comercial y riesgos legales de usar Midjourney o DALL-E en 2025.",
    heroImage: "/images/portal-ambiental/blog/normatividad-ambiental-guia.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Los derechos de autor en imágenes generadas con IA son el \"Lejano Oeste\" del siglo XXI. Si usas IA para presentaciones, webs de clientes o trabajos universitarios, ignorar las reglas puede costarte una demanda o una descalificación. A continuación, desglosamos la realidad legal (basada en términos de 2025) para que crees con tranquilidad.",
      sections: [
        {
          id: "propiedad-imagen",
          title: "La pregunta del millón: ¿De quién es la imagen?",
          content: "Según la Oficina de Derechos de Autor de EE.UU. (USCO) y la tendencia global actual, **las imágenes generadas 100% por IA no tienen copyright**. Esto significa:\n\n1. No eres el \"autor\" legal en el sentido tradicional\n2. No puedes registrar esa imagen para impedir que otros la usen (es dominio público de facto)\n3. Sin embargo, **sí puedes usarlas comercialmente** si la plataforma te da la licencia",
          callout: {
            type: "warning",
            title: "Importante",
            content: "Si modificas significativamente una imagen generada por IA añadiendo tu creatividad humana, esas modificaciones SÍ pueden protegerse por copyright.",
          },
        },
        {
          id: "terminos-plataformas",
          title: "Términos de uso comercial por plataforma (2025)",
          content: "Cada herramienta tiene sus propias reglas de juego.\n\n**1. Midjourney**\n• Si pagas suscripción, eres dueño de los \"assets\" y puedes usarlos comercialmente\n• La excepción millonaria: Si tu empresa factura más de $1,000,000 USD al año, debes contratar el plan \"Pro\" o \"Mega\"\n• Cuidado: En planes básicos, tus imágenes son públicas en la galería. Solo el plan Pro tiene \"Stealth Mode\"\n\n**2. OpenAI (DALL-E 3 / ChatGPT)**\n• OpenAI te cede la propiedad de las imágenes que generas\n• Puedes usarlas para fines comerciales libremente, independientemente de tu facturación\n\n**3. Stability AI (Stable Diffusion)**\n• Licencia comunitaria gratuita para uso comercial si tu empresa factura menos de $1M USD anuales\n• Si pasas ese umbral, necesitas licencia \"Enterprise\"",
          image: "/images/portal-ambiental/blog/normatividad-ambiental-guia.jpg",
        },
        {
          id: "riesgos-legales",
          title: "Riesgos legales reales que debes evitar",
          content: "Aunque la herramienta te dé permiso, el **contenido de la imagen** puede meterte en problemas:\n\n**1. Logos y Marcas:** Si la IA genera unas zapatillas con el logo de Nike \"por accidente\", no puedes usar eso comercialmente. Es infracción de marca registrada.\n\n**2. Personas Reales (Deepfakes):** Generar una imagen fotorrealista de una celebridad para promocionar tu marca viola los derechos de imagen y publicidad. Evítalo.\n\n**3. Estilos Protegidos:** Evita prompts como \"estilo Disney\" si vas a vender el resultado. Podría considerarse obra derivada no autorizada. Mejor usa \"estilo animación clásica de los 90\".",
          callout: {
            type: "warning",
            title: "Riesgo por estilo artístico",
            content: "Pedir \"una imagen al estilo de [artista vivo]\" puede generar problemas legales. Los tribunales aún debaten este tema.",
          },
        },
        {
          id: "checklist-seguridad",
          title: "Checklist de seguridad para tus proyectos",
          content: "Antes de publicar esa imagen en el informe final o la web del cliente:\n\n✅ ¿Tengo una suscripción activa o licencia válida de la herramienta?\n✅ ¿La imagen contiene logos o marcas de terceros? (Bórralos con Photoshop)\n✅ ¿Aparecen caras de personas famosas?\n✅ ¿He sido transparente? (En entornos académicos, siempre declara: \"Imagen generada con IA\")",
          callout: {
            type: "info",
            title: "Protege tu trabajo",
            content: "Revisa hoy mismo en qué plan estás suscrito. Si usas Midjourney para clientes confidenciales y tienes el plan básico, tus imágenes están visibles para todo el mundo ahora mismo. Considera actualizar o cambiar de herramienta.",
          },
        },
      ],
      conclusion: "El marco legal de las imágenes generadas por IA está evolucionando rápidamente. Por ahora, la regla de oro es: revisa los términos de servicio de la plataforma que usas, evita contenido que pueda infringir derechos de terceros, y sé transparente sobre el origen de tus imágenes. La creatividad con IA es increíble; usarla responsablemente es tu responsabilidad.",
    },
    tags: ["derechos de autor", "copyright", "legal", "Midjourney", "DALL-E", "uso comercial", "propiedad intelectual"],
    nextArticle: {
      slug: "prompts-avanzados-imagenes-ia",
      title: "Prompts avanzados para imágenes profesionales con IA",
    },
  },

  "prompts-avanzados-imagenes-ia": {
    slug: "prompts-avanzados-imagenes-ia",
    title: "Cómo escribir prompts avanzados para obtener imágenes de nivel profesional con IA",
    category: "IA Generativa Creativa",
    date: "2025-01-10",
    readTime: 14,
    excerpt: "Deja de obtener resultados aleatorios. Domina la estructura de prompts avanzados con parámetros de iluminación, cámara y estilo en Midjourney y DALL-E.",
    heroImage: "/images/portal-ambiental/blog/tecnologia-futurista-ia.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Los prompts avanzados son la diferencia entre una imagen que parece un \"dibujo de computadora\" y una que gana premios de arte digital. La mayoría de la gente escribe lo que quiere (\"un gato\"). Los expertos escriben cómo lo quieren. Aquí aprenderás la sintaxis técnica para controlar la IA como un profesional.",
      sections: [
        {
          id: "anatomia-prompt",
          title: "La anatomía de un Prompt Maestro",
          content: "Olvídate de las frases sueltas. Un prompt profesional tiene estructura de capas:\n\n1. **Sujeto:** ¿Qué es? (Un ingeniero ambiental)\n2. **Medio:** ¿Qué formato? (Fotografía, ilustración a tinta, render 3D)\n3. **Estilo:** ¿Qué referencia visual? (Cyberpunk, Art Deco, Minimalista)\n4. **Iluminación:** ¿Cómo es la luz? (Volumétrica, cinemática, luz de neón)\n5. **Cámara/Técnica:** (Gran angular, macro, ISO 100, vista de dron)\n6. **Parámetros:** Comandos técnicos (--ar, --no)",
          image: "/images/portal-ambiental/blog/stable-diffusion-art.jpg",
        },
        {
          id: "parametros-tecnicos",
          title: "Parámetros técnicos que cambian el juego (Cheat Sheet)",
          content: "Estos códigos se escriben al final del prompt (especialmente en Midjourney) y son vitales:\n\n**Relación de Aspecto (--ar):** Controla la forma\n• --ar 16:9 (Pantallas, presentaciones, YouTube)\n• --ar 9:16 (Stories, TikTok, Reels)\n• --ar 1:1 (Instagram cuadrado, avatares)\n\n**Estilización (--s 0 a --s 1000):** Controla cuánta libertad creativa le das a la IA\n• --s 50: Se apega estrictamente a tu texto (bueno para logos)\n• --s 750: La IA añade muchos detalles artísticos propios (bueno para arte abstracto)\n\n**Negativo (--no):** Lo que NO quieres ver\n• Ejemplo: --no text, blur, watermark, people (Vital para limpiar imágenes)",
          callout: {
            type: "info",
            title: "Cheat Sheet de parámetros",
            content: "• --ar = aspect ratio (proporción)\n• --s = stylize (estilización)\n• --no = negative prompt (excluir)\n• --q = quality (calidad)\n• --v = version (versión del modelo)",
          },
        },
        {
          id: "ejemplos-practicos",
          title: "Ejemplos prácticos para copiar",
          content: "**Caso 1: Render de Arquitectura Sostenible**\n```\nLuxury eco-lodge in the Amazon rainforest, bamboo structure, glass walls, sustainable architecture, blending with nature, hyper-realistic, 8k, unreal engine 5 render, cinematic lighting, morning mist --ar 16:9 --no people\n```\n\n**Caso 2: Fotografía de Producto**\n```\nProduct photography of a glass water bottle, clear water, splashing, studio lighting, softbox, white background, 85mm lens, sharp focus, 4k, commercial aesthetic --ar 4:5\n```\n\n**Caso 3: Ilustración para Blog de Tecnología**\n```\nArtificial Intelligence brain connecting to a city, isometric illustration, gradient colors blue and purple, tech style, vector art, clean lines, minimalist background --ar 3:2\n```",
          image: "/images/portal-ambiental/blog/neural-network-concept.jpg",
        },
        {
          id: "image-prompting",
          title: "Técnica Pro: Prompting con Referencias (Image Prompting)",
          content: "A veces las palabras no bastan. Puedes usar una imagen existente para guiar a la IA.\n\n**En Midjourney:** Pega la URL de una imagen al principio de tu prompt. La IA usará los colores y la composición de esa foto como base.\n\n**Comando --sref:** (Style Reference). Permite copiar solo el \"estilo\" de una imagen sin copiar el contenido exacto. Ideal para mantener consistencia de marca en una serie de imágenes.",
        },
        {
          id: "arreglar-prompts",
          title: "Cómo arreglar un prompt que falla",
          content: "1. **Simplifica:** Si el prompt es muy largo, la IA se confunde. Elimina adjetivos innecesarios.\n\n2. **Sube el peso:** En Midjourney, puedes dar más importancia a una palabra usando ::2\n• Ejemplo: space ship::2 forest::1 (La nave espacial será más importante que el bosque)\n\n3. **Cambia el orden:** Lo que pones al principio tiene más fuerza que lo que pones al final.",
          callout: {
            type: "success",
            title: "Sube de nivel",
            content: "Elige una foto que te guste mucho de internet. Intenta \"ingeniería inversa\": escribe un prompt para intentar que la IA recree esa foto. Es la mejor forma de entrenar tu ojo para entender cómo \"piensan\" los modelos.",
          },
        },
      ],
      conclusion: "Los prompts avanzados son un idioma que se aprende con práctica. La estructura, los parámetros y la iteración son más importantes que la inspiración. Domina la anatomía del prompt perfecto, experimenta con los parámetros técnicos y entrena tu ojo recreando imágenes existentes. En pocas semanas, pasarás de usuario casual a director de arte digital.",
    },
    tags: ["prompts", "Midjourney", "DALL-E", "parámetros", "ingeniería de prompts", "imágenes IA", "técnicas avanzadas"],
    nextArticle: {
      slug: "guia-escribir-buenos-prompts-chatgpt",
      title: "Guía para escribir buenos prompts en ChatGPT y LLMs",
    },
  },

  // Categoría: Modelos de Lenguaje (Artículos 7, 8, 9)
  "guia-escribir-buenos-prompts-chatgpt": {
    slug: "guia-escribir-buenos-prompts-chatgpt",
    title: "Cómo escribir buenos prompts para sacar el máximo provecho a ChatGPT y otros LLMs",
    category: "Modelos de Lenguaje",
    date: "2025-01-09",
    readTime: 12,
    excerpt: "Aprende a escribir prompts efectivos para ChatGPT, Claude y Gemini. Guía definitiva con 5 reglas de oro, plantillas copiables y ejemplos de antes/después.",
    heroImage: "/images/portal-ambiental/blog/llm-transformers-architecture.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Saber escribir prompts para ChatGPT y otros modelos de lenguaje (LLMs) es la habilidad blanda más importante de 2025. Los modelos funcionan como un pasante brillante pero literal: si tus instrucciones son vagas, el resultado será mediocre. Si son precisas, el resultado será de nivel experto. En esta guía práctica, te entregamos la \"sintaxis\" exacta para dejar de pelear con la IA y empezar a obtener resultados útiles a la primera.",
      sections: [
        {
          id: "que-es-prompt",
          title: "¿Qué es un prompt y por qué define el 80% del resultado?",
          content: "Un prompt es simplemente el texto de entrada que le das al modelo. Pero no es solo una pregunta; es el contexto, la restricción y el formato que guía la respuesta.",
          image: "/images/portal-ambiental/blog/prompting-personas-ia.jpg",
        },
        {
          id: "cinco-reglas",
          title: "Las 5 reglas de oro del Prompting (La Fórmula R.F.L.C.I.)",
          content: "Para obtener respuestas profesionales, aplica siempre esta estructura:\n\n**1. Rol (Persona):** Dile quién debe ser\n• Ejemplo: \"Actúa como un Ingeniero Sanitario Senior con 10 años de experiencia en tratamiento de aguas.\"\n\n**2. Formato:** Dile cómo quieres la entrega\n• Ejemplo: \"Entrégame la respuesta en una tabla comparativa con columnas para: Parámetro, Límite Permisible y Método de Análisis.\"\n\n**3. Longitud y Profundidad:** Sé específico\n• Ejemplo: \"Sé conciso, no uses jerga innecesaria, máximo 300 palabras.\"\n\n**4. Contexto:** Dale los datos necesarios\n• Ejemplo: \"El análisis es para una planta ubicada en Bogotá, bajo la normativa colombiana actual.\"\n\n**5. Iteración (Refinamiento):** La primera respuesta es un borrador. Conversa con el modelo para pulirlo.",
          callout: {
            type: "info",
            title: "Fórmula R.F.L.C.I.",
            content: "Rol + Formato + Longitud + Contexto + Iteración = Prompt Profesional",
          },
        },
        {
          id: "plantillas",
          title: "Plantillas de Prompts Listas para Copiar",
          content: "**Plantilla 1: Resumen de Documentos Técnicos**\n\"*Actúa como un consultor ambiental experto. Necesito un resumen técnico del siguiente texto sobre [tema]. Estructura la respuesta en: 1. Objetivo principal, 2. Obligaciones clave para la industria, 3. Tabla de plazos y sanciones. Tono: Formal y ejecutivo. Texto: [Pegar texto aquí]*\"\n\n**Plantilla 2: Corrector de Estilo Académico**\n\"*Eres mi editor de tesis. Revisa el siguiente párrafo. Mejora la cohesión, elimina la voz pasiva innecesaria y asegúrate de que suene profesional y académico. No inventes información, solo mejora la forma. Texto: [Pegar texto aquí]*\"\n\n**Plantilla 3: El \"Abogado del Diablo\"**\n\"*Analiza mi propuesta para [Proyecto X]. Adopta una postura crítica y escéptica. Enumera 5 posibles puntos de falla, riesgos regulatorios o debilidades lógicas que no estoy viendo. Propuesta: [Pegar texto aquí]*\"",
        },
        {
          id: "antes-despues",
          title: "Ejemplos Reales: Antes y Después",
          content: "❌ **Prompt Malo:** \"Explícame qué es la DBO.\"\n→ Resultado probable: Una definición de diccionario genérica de Wikipedia.\n\n✅ **Prompt Bueno:** \"Actúa como profesor de ingeniería ambiental. Explícame qué es la Demanda Bioquímica de Oxígeno (DBO) utilizando una analogía sencilla para estudiantes de primer semestre. Luego, dame un ejemplo numérico de cómo afecta una alta DBO a un río en Colombia.\"\n→ Resultado: Una explicación pedagógica, contextualizada y útil.",
          image: "/images/portal-ambiental/blog/programacion-pantalla-codigo.jpg",
        },
        {
          id: "errores-prompting",
          title: "Errores comunes que matan tu productividad",
          content: "• **Ambigüedad:** Usar palabras como \"breve\" o \"interesante\" sin definirlas (mejor di: \"3 frases\" o \"enfocado en costos\")\n\n• **Sobrecarga:** Pedir 10 tareas complejas en un solo prompt. Es mejor dividirlo en pasos\n\n• **Falta de contexto geográfico:** Si no dices \"Colombia\" o \"Latinoamérica\", la IA te dará normativas de España o EE.UU. por defecto",
          callout: {
            type: "success",
            title: "Tu tarea de hoy",
            content: "Toma el último correo difícil que tengas que escribir. Usa la Plantilla 2 y deja que la IA lo mejore por ti. Te sorprenderá la diferencia.",
          },
        },
      ],
      conclusion: "El prompting es un idioma que se aprende con práctica. La fórmula R.F.L.C.I. te da la estructura, las plantillas te dan el punto de partida, y la iteración te lleva a la excelencia. Domina estos principios y convertirás a cualquier LLM en tu asistente personal de alto rendimiento.",
    },
    tags: ["prompts", "ChatGPT", "Claude", "Gemini", "LLMs", "productividad", "ingeniería de prompts"],
    nextArticle: {
      slug: "modelos-lenguaje-para-estudiar-resumenes-examenes",
      title: "Cómo usar IA para estudiar mejor y preparar exámenes",
    },
  },

  "modelos-lenguaje-para-estudiar-resumenes-examenes": {
    slug: "modelos-lenguaje-para-estudiar-resumenes-examenes",
    title: "Cómo usar modelos de lenguaje para estudiar mejor, hacer resúmenes y preparar exámenes",
    category: "Modelos de Lenguaje",
    date: "2025-01-08",
    readTime: 11,
    excerpt: "Transforma tu forma de estudiar con IA. Flujos de trabajo para resumir textos, crear simulacros de examen y entender temas complejos sin hacer trampa.",
    heroImage: "/images/portal-ambiental/blog/estudio-preparacion-examen.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Usar modelos de lenguaje para estudiar no significa pedirle a ChatGPT que escriba tu ensayo (eso es plagio y no aprendes nada). Significa usar la IA como un tutor personal disponible 24/7 que te interroga, te resume y te explica. Si eres estudiante de ingeniería, ciencias o cualquier carrera técnica, estos flujos de trabajo te ahorrarán horas de lectura pasiva y activarán tu aprendizaje real.",
      sections: [
        {
          id: "active-recall",
          title: "Por qué la IA es el mejor compañero de estudio",
          content: "La ciencia del aprendizaje nos dice que leer y subrayar es poco efectivo. Lo que funciona es el **Active Recall** (intentar recordar) y la **síntesis**. Los LLMs son perfectos para esto porque pueden generarte preguntas infinitas sobre tu material.",
          image: "/images/portal-ambiental/blog/biblioteca-estudio-ia.jpg",
        },
        {
          id: "flujo-triturador",
          title: "Flujo 1: El \"Triturador\" de Textos Densos",
          content: "Tienes un paper académico de 20 páginas o una normativa compleja.\n\n**1. Paso 1:** Copia el texto (o sube el PDF si usas GPT-4o / Claude Pro)\n\n**2. Prompt:**\n\"*Actúa como un analista experto. Extrae las 5 ideas centrales de este texto. Para cada idea, dame una definición simple y un ejemplo práctico de la vida real. Ignora la introducción y las conclusiones genéricas.*\"\n\n**3. Resultado:** Un mapa mental en texto plano listo para estudiar",
        },
        {
          id: "flujo-socratico",
          title: "Flujo 2: El Simulador de Examen (Socrático)",
          content: "No leas tus apuntes. Ponte a prueba.\n\n**Prompt:**\n\"*Tengo un examen sobre [tema] mañana. Hazme 5 preguntas de opción múltiple difíciles sobre [tema específico]. No me des las respuestas todavía. Espera a que yo responda y luego evalúa mi respuesta y explícame por qué estoy mal o bien.*\"\n\n**Por qué funciona:** Este método te obliga a pensar y refuerza las conexiones neuronales.",
          callout: {
            type: "info",
            title: "Método Socrático",
            content: "La IA actúa como un profesor que te guía con preguntas en lugar de darte respuestas directas. Esto maximiza la retención.",
          },
        },
        {
          id: "flujo-feynman",
          title: "Flujo 3: La Técnica Feynman (Explicar para entender)",
          content: "Si no puedes explicarlo simple, no lo entiendes.\n\n**Prompt:**\n\"*Estoy estudiando el concepto de [tema]. Explícamelo como si yo tuviera 12 años. Usa una analogía relacionada con [algo que te guste, ej: cocinar o videojuegos].*\"",
          image: "/images/portal-ambiental/blog/grupo-estudio-laptop.jpg",
        },
        {
          id: "advertencias-eticas",
          title: "Advertencias Éticas: La línea entre herramienta y trampa",
          content: "• **Alucinaciones:** La IA puede inventar fechas, fórmulas o leyes. Nunca confíes en un dato fáctico sin verificarlo en la fuente oficial.\n\n• **Citas:** ChatGPT a veces inventa bibliografía. No pongas referencias que no hayas leído tú mismo.\n\n• **Dependencia:** Usa la IA para desbloquearte, no para pensar por ti.",
          callout: {
            type: "warning",
            title: "Integridad Académica",
            content: "Usa la IA para ENTENDER, no para COPIAR. Tu cerebro necesita hacer el trabajo de pensar; la IA solo facilita el proceso.",
          },
        },
        {
          id: "herramientas-estudiantes",
          title: "Herramientas recomendadas para estudiantes",
          content: "• **NotebookLM (de Google):** Increíble para cargar tus PDFs y \"chatear\" solo con esa información (sin alucinaciones externas). Crea podcasts de audio desde documentos.\n\n• **Consensus:** Buscador de papers científicos con resúmenes por IA\n\n• **Perplexity:** Respuestas con fuentes citadas en tiempo real",
          callout: {
            type: "success",
            title: "Prueba el \"Modo Socrático\"",
            content: "Antes de cerrar esta pestaña, abre tu IA de confianza y dile: \"Hazme una pregunta sobre lo que acabo de leer en este artículo\". Pon a prueba tu retención ya mismo.",
          },
        },
      ],
      conclusion: "La IA es el tutor personal que todos merecen pero pocos pueden pagar. Usada correctamente, transforma horas de lectura pasiva en minutos de aprendizaje activo. El secreto está en usar la IA para preguntarte, retarte y explicarte, no para darte respuestas que copiar. Tu cerebro hará el trabajo pesado; la IA solo lo facilita.",
    },
    tags: ["estudio", "estudiantes", "resúmenes", "exámenes", "Active Recall", "técnica Feynman", "NotebookLM"],
    nextArticle: {
      slug: "integrar-modelos-lenguaje-trabajo-diario",
      title: "Cómo integrar IA en tu trabajo diario",
    },
  },

  "integrar-modelos-lenguaje-trabajo-diario": {
    slug: "integrar-modelos-lenguaje-trabajo-diario",
    title: "Cómo integrar modelos de lenguaje en tu trabajo diario para ahorrar tiempo",
    category: "Modelos de Lenguaje",
    date: "2025-01-07",
    readTime: 10,
    excerpt: "Guía de productividad con IA para profesionales. Automatiza correos, analiza informes y genera ideas en minutos. Casos de uso por profesión.",
    heroImage: "/images/portal-ambiental/blog/flujo-trabajo-digital.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Integrar modelos de lenguaje en tu rutina laboral no es cosa del futuro; es la ventaja competitiva de hoy. Si pasas más de 2 horas al día redactando correos, resumiendo actas o luchando con la hoja en blanco, estás trabajando \"a la antigua\". Aquí te mostramos cómo delegar la \"carpintería\" intelectual a la IA para que tú te concentres en la estrategia y la toma de decisiones.",
      sections: [
        {
          id: "tareas-delegables",
          title: "¿Qué tareas son realmente delegables a una IA hoy?",
          content: "No intentes que la IA haga tu trabajo completo. Úsala para las tareas \"puente\":\n\n• **Borradores:** De correos, informes, memos\n• **Síntesis:** De hilos de email largos, reuniones transcritas, PDFs técnicos\n• **Transformación:** De texto a tabla, de lista a párrafo, de tono informal a formal",
          image: "/images/portal-ambiental/blog/trabajo-diario-oficina.jpg",
        },
        {
          id: "casos-por-profesion",
          title: "Casos de Uso por Profesión",
          content: "**1. Para el Ingeniero Ambiental / Gestor Hídrico**\n• *Situación:* Tienes que comparar resultados de laboratorio de 3 meses con la norma\n• *Prompt:* \"Tengo estos datos de calidad de agua (pegar). Compáralos con los límites de la Resolución 2115. Genera una tabla con los parámetros que NO cumplen y sugiere posibles causas técnicas.\"\n\n**2. Para el Administrativo / Asistente**\n• *Situación:* Tienes una transcripción desordenada de una reunión\n• *Prompt:* \"Analiza esta transcripción. Extrae: 1. Decisiones tomadas, 2. Tareas pendientes (y responsable), 3. Fechas límite. Redáctalo como acta formal.\"\n\n**3. Para el Gerente de Proyectos**\n• *Situación:* Necesitas enviar un reporte de avance a un cliente difícil\n• *Prompt:* \"Escribe un correo actualizando el estado del proyecto. Menciona que tuvimos un retraso por lluvias pero ya recuperamos con horas extra. Tono profesional, tranquilizador, orientado a soluciones.\"",
        },
        {
          id: "regla-10-porciento",
          title: "Flujo de Integración: La Regla del 10%",
          content: "Para empezar, intenta delegar el 10% de tu carga cognitiva diaria:\n\n1. **Identifica:** ¿Qué tarea repetí ayer más de 3 veces? (Ej: Responder correos de \"Recibido\")\n2. **Crea el Prompt:** Escribe una instrucción estándar para esa tarea\n3. **Guárdalo:** Ten un archivo de notas con tus \"Prompts Maestros\"\n4. **Ejecuta:** La próxima vez, copia, pega y edita",
          callout: {
            type: "info",
            title: "Biblioteca de Prompts",
            content: "Crea un documento con tus prompts más usados. Organízalo por categoría: Correos, Análisis, Resúmenes, Creatividad. Será tu arsenal de productividad.",
          },
        },
        {
          id: "indicadores-exito",
          title: "Indicadores de éxito (KPIs)",
          content: "¿Cómo sabes si funciona?\n\n• **Tiempo de respuesta:** ¿Respondes correos más rápido?\n• **Bloqueo de escritor:** ¿Eliminaste el tiempo que pasas mirando la pantalla en blanco?\n• **Calidad:** ¿Tus entregables tienen menos errores ortográficos o de estructura?",
          callout: {
            type: "success",
            title: "El Reto de la Semana",
            content: "Durante los próximos 5 días, no escribas ningún correo importante desde cero. Escribe los puntos clave (bullets) y pídele a la IA que redacte el borrador completo. Al final de la semana, calcula cuánto tiempo ahorraste.",
          },
        },
      ],
      conclusion: "La IA no reemplaza tu expertise; la amplifica. Delega la carpintería (redacción, formato, síntesis) y dedica tu tiempo a lo que solo tú puedes hacer: pensar, decidir y crear. La regla del 10% es tu punto de entrada; una vez la domines, el límite es tu imaginación.",
    },
    tags: ["productividad", "trabajo", "profesionales", "correos", "informes", "LLMs", "automatización"],
    nextArticle: {
      slug: "diferencias-ia-machine-learning-deep-learning",
      title: "Diferencias entre IA, Machine Learning y Deep Learning",
    },
  },

  // Categoría: Fundamentos de IA (Artículos 10, 11, 12)
  "diferencias-ia-machine-learning-deep-learning": {
    slug: "diferencias-ia-machine-learning-deep-learning",
    title: "Diferencias entre Inteligencia Artificial, Machine Learning y Deep Learning",
    category: "Fundamentos de IA",
    date: "2025-01-06",
    readTime: 9,
    excerpt: "¿Confundido con los términos de IA? Te explicamos la diferencia entre Inteligencia Artificial, Machine Learning y Deep Learning con analogías simples y ejemplos.",
    heroImage: "/images/portal-ambiental/blog/stable-diffusion-art.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "La inteligencia artificial (IA) está en boca de todos, pero pocos entienden realmente la jerarquía técnica detrás de las palabras de moda. Es común usar \"IA\", \"Machine Learning\" y \"Deep Learning\" como sinónimos, pero no lo son. Entender la diferencia es vital para saber qué tecnología necesitas realmente para tu proyecto (y para no dejarte engañar por vendedores de humo).",
      sections: [
        {
          id: "jerarquia-matrioshkas",
          title: "La Jerarquía: Imagina unas muñecas rusas (Matrioshkas)",
          content: "La forma más fácil de visualizarlo es como círculos dentro de círculos:\n\n**1. Inteligencia Artificial (El Círculo Grande):**\nEs la disciplina académica completa. Cualquier técnica que permita a una máquina imitar el comportamiento humano inteligente.\n\n**2. Machine Learning (El Círculo Mediano):**\nEs un subconjunto de la IA. Aquí, la máquina no sigue solo reglas fijas; aprende de los datos para mejorar sin ser programada para cada caso.\n\n**3. Deep Learning (El Círculo Pequeño):**\nEs un subconjunto del ML especializado. Utiliza Redes Neuronales Artificiales con muchas capas (por eso lo de \"profundo\") para resolver problemas vastos y complejos.",
          image: "/images/portal-ambiental/blog/jerarquia-conceptos-ia.jpg",
        },
        {
          id: "tabla-comparativa",
          title: "Tabla Comparativa para Entenderlo en Segundos",
          content: "| Característica | IA | Machine Learning | Deep Learning |\n|---|---|---|---|\n| **Definición** | Imitación de inteligencia humana | Algoritmos que mejoran con datos | Redes neuronales multicapa |\n| **Intervención Humana** | Alta (reglas manuales) | Media (ingeniería de características) | Baja (aprende solo) |\n| **Datos Necesarios** | Pocos datos | Miles de datos | Millones de datos |\n| **Hardware** | CPU normal | CPU potente | GPU potente |\n| **Ejemplo Real** | Chatbot de reglas simples | Filtro de Spam | Generación de imágenes |",
          callout: {
            type: "info",
            title: "Regla práctica",
            content: "Si tienes datos estructurados (Excel, tablas) → usa Machine Learning clásico.\nSi trabajas con imágenes, video, audio o texto → necesitas Deep Learning.",
          },
        },
        {
          id: "machine-learning",
          title: "Machine Learning: Aprender buscando patrones",
          content: "Imagina que quieres enseñar a una computadora a diferenciar un perro de un gato.\n\n**En la IA tradicional:** Tendrías que escribir reglas: \"Si tiene orejas triangulares y bigotes, es un gato\". (Muy difícil y propenso a errores).\n\n**En Machine Learning:** Le das 1,000 fotos de gatos y 1,000 de perros. El algoritmo analiza los píxeles, encuentra patrones estadísticos que tú ni siquiera ves, y crea su propio modelo para diferenciarlos.",
        },
        {
          id: "deep-learning",
          title: "Deep Learning: El cerebro artificial",
          content: "El Deep Learning lleva esto al extremo inspirándose en la biología. Utiliza capas de neuronas digitales:\n\n• La primera capa detecta bordes\n• La segunda detecta formas (ojos, orejas)\n• La tercera detecta rostros completos\n\nEs la tecnología detrás de los coches autónomos, los traductores en tiempo real y la generación de imágenes con IA.",
          image: "/images/portal-ambiental/blog/llm-transformers-architecture.jpg",
        },
        {
          id: "cual-aplicar",
          title: "¿Cuál debo aprender o aplicar?",
          content: "• **Datos estructurados (Excel, tablas, lecturas de sensores):** Usa Machine Learning (algoritmos como Random Forest o Regresión). Es más rápido y barato.\n\n• **Imágenes, video, audio o texto complejo:** Necesitas Deep Learning.",
          callout: {
            type: "success",
            title: "Haz la prueba del concepto",
            content: "Abre Spotify o Netflix. Las recomendaciones que ves (\"Porque escuchaste X...\") son Machine Learning clásico en acción. La portada generada por IA de esa playlist nueva, eso es Deep Learning generativo. Ya los usas a diario.",
          },
        },
      ],
      conclusion: "IA, Machine Learning y Deep Learning no son sinónimos: son niveles de especialización. Entender esta jerarquía te permite elegir la herramienta correcta para tu problema y evitar soluciones sobredimensionadas. Ahora que conoces la diferencia, puedes hablar con propiedad y tomar mejores decisiones tecnológicas.",
    },
    tags: ["IA", "Machine Learning", "Deep Learning", "redes neuronales", "fundamentos", "conceptos básicos"],
    nextArticle: {
      slug: "que-es-inteligencia-artificial-generativa-usos",
      title: "Qué es la IA Generativa y cómo se usa hoy",
    },
  },

  "que-es-inteligencia-artificial-generativa-usos": {
    slug: "que-es-inteligencia-artificial-generativa-usos",
    title: "Qué es la inteligencia artificial generativa y en qué se está usando hoy en día",
    category: "Fundamentos de IA",
    date: "2025-01-05",
    readTime: 10,
    excerpt: "La IA Generativa (GenAI) no solo analiza, crea. Descubre cómo funciona esta tecnología y sus aplicaciones reales en ingeniería, educación y empresas en 2025.",
    heroImage: "/images/portal-ambiental/blog/ia-generativa-abstracto.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Hasta hace poco, la IA servía principalmente para clasificar (¿es esto spam o no?) o predecir (¿lloverá mañana?). Pero en 2025, la revolución es la Inteligencia Artificial Generativa. Como su nombre indica, esta tecnología es capaz de crear contenido nuevo y original —texto, código, imágenes, video— que nunca antes existió, aprendiendo de todo lo que ha visto en internet.",
      sections: [
        {
          id: "como-funciona",
          title: "¿Cómo funciona realmente? (Sin magia, solo probabilidad)",
          content: "Los modelos generativos (como GPT-4 o Claude) son, en esencia, predictores de secuencias hiper-avanzados. Imagínalos como el autocompletar de tu celular, pero entrenado con todo el conocimiento de la humanidad.\n\nCuando le pides un poema, no está \"sintiendo\"; está calculando, palabra por palabra, cuál es la continuación más probable y coherente basada en los patrones que aprendió durante su entrenamiento.",
                image: "/images/portal-ambiental/blog/codigo-ia-manos.jpg",
        },
        {
          id: "aplicaciones-2025",
          title: "Aplicaciones Reales en 2025",
          content: "**1. En Ingeniería y Gestión Ambiental**\n• **Diseño Generativo:** Ingenieros usan IA para generar miles de diseños de piezas mecánicas optimizadas para pesar menos\n• **Datos Sintéticos:** Se usa IA para crear \"datos falsos\" realistas para entrenar modelos de detección de fugas sin romper tuberías reales\n\n**2. En Educación y Academia**\n• **Tutores Socráticos:** Sistemas que no te dan la respuesta, sino que te guían con pistas personalizadas\n• **Resúmenes de Papers:** Herramientas como NotebookLM que leen PDFs científicos y generan podcasts de audio\n\n**3. En Programación (Coding)**\n• Herramientas como GitHub Copilot escriben el 40-60% del código repetitivo de los desarrolladores",
        },
        {
          id: "ventajas-riesgos",
          title: "Ventajas y Riesgos que debes conocer",
          content: "| Ventajas | Riesgos |\n|---|---|\n| **Velocidad:** Borradores en segundos | **Alucinaciones:** Inventa datos con confianza |\n| **Creatividad:** Rompe el bloqueo de la hoja en blanco | **Sesgo:** Puede replicar prejuicios de sus datos |\n| **Personalización:** Contenido único para cada usuario | **Propiedad Intelectual:** Debates legales sobre copyright |",
          callout: {
            type: "warning",
            title: "El mayor riesgo actual",
            content: "No es una rebelión de robots, sino la desinformación (Deepfakes) y la dependencia cognitiva (dejar de pensar porque la IA lo hace por ti).",
          },
        },
        {
          id: "es-peligrosa",
          title: "¿Es peligrosa la IA Generativa?",
          content: "La tecnología es neutra; el uso no. El mayor riesgo actual no es una rebelión de robots, sino:\n\n• **Desinformación:** Deepfakes que parecen reales\n• **Dependencia cognitiva:** Dejar de pensar porque la IA lo hace por ti\n• **Automatización de sesgos:** La IA replica los prejuicios de sus datos de entrenamiento",
          image: "/images/portal-ambiental/blog/seguridad-robot-ia.jpg",
        },
        {
          id: "primer-experimento",
          title: "Tu primer experimento generativo",
          content: "No te quedes en el texto. Entra a una herramienta gratuita de generación de imágenes (como Bing Image Creator) y pide:\n\n\"*Un paisaje futurista de una ciudad sostenible en los Andes colombianos*\"\n\nVerás la \"imaginación\" de la máquina en acción.",
          callout: {
            type: "success",
            title: "Experimenta ahora",
            content: "La mejor forma de entender la IA Generativa es usándola. Abre ChatGPT o Bing y pídele algo creativo. Observa cómo \"piensa\".",
          },
        },
      ],
      conclusion: "La IA Generativa es la revolución tecnológica de nuestra era. No solo analiza o predice; crea. Entender cómo funciona y sus aplicaciones te prepara para aprovechar su potencial mientras evitas sus riesgos. El futuro pertenece a quienes sepan colaborar con estas herramientas.",
    },
    tags: ["IA Generativa", "GenAI", "GPT-4", "creatividad", "futuro del trabajo", "innovación"],
    nextArticle: {
      slug: "empezar-ia-sin-ser-programador-guia",
      title: "Guía para empezar a usar IA sin ser programador",
    },
  },

  "empezar-ia-sin-ser-programador-guia": {
    slug: "empezar-ia-sin-ser-programador-guia",
    title: "Cómo empezar a usar inteligencia artificial sin ser programador: guía práctica",
    category: "Fundamentos de IA",
    date: "2025-01-04",
    readTime: 11,
    excerpt: "Guía paso a paso para profesionales no técnicos. Aprende a integrar la IA en tu flujo de trabajo usando herramientas No-Code. Casos de uso reales.",
    heroImage: "/images/portal-ambiental/blog/matrices-eia-metodologias.jpg",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
    },
    content: {
      introduction: "Si crees que para usar Inteligencia Artificial necesitas saber Python, matemáticas avanzadas o tener una supercomputadora, estás viviendo en el 2015. Hoy, la barrera de entrada técnica ha desaparecido. La habilidad clave ya no es \"codificar\", sino \"comunicar\" (Prompting) y \"conectar\" (Integración). Esta guía está diseñada para el profesional de a pie que quiere subirse a la ola tecnológica hoy mismo.",
      sections: [
        {
          id: "elige-herramienta",
          title: "Paso 1: Elige tu \"Navaja Suiza\" (Las Herramientas)",
          content: "No necesitas instalar nada. Empieza con las herramientas de chat avanzadas que funcionan en tu navegador:\n\n**ChatGPT (OpenAI):** El todoterreno. Excelente para redacción, análisis de texto y creatividad.\n\n**Claude (Anthropic):** El analista. Tiene una capacidad superior para leer documentos largos (PDFs de 100 páginas) y redactar con un tono más humano.\n\n**Perplexity:** El investigador. Conectado a internet en tiempo real y cita sus fuentes. Ideal para buscar información verificada.",
          image: "/images/portal-ambiental/blog/automatizacion-ia-oficina.jpg",
        },
        {
          id: "aprende-prompting",
          title: "Paso 2: Aprende el idioma de la máquina (Prompting Básico)",
          content: "No le hables como a un buscador (\"mejores plantas tratamiento\"). Háblale como a un pasante inteligente.\n\n**❌ Malo:** \"Escribe un correo.\"\n\n**✅ Bueno:** \"Actúa como un gerente de servicio al cliente. Redacta un correo amable pero firme para un cliente que lleva 2 meses sin pagar la factura del servicio de agua. Ofrece un plan de pagos.\"",
          callout: {
            type: "info",
            title: "Regla de oro",
            content: "Cuanto más contexto des, mejor será la respuesta. La IA no lee tu mente; lee tu prompt.",
          },
        },
        {
          id: "automatiza-no-code",
          title: "Paso 3: Automatiza sin código (No-Code)",
          content: "Aquí es donde ocurre la magia real. Puedes conectar aplicaciones entre sí con plataformas como **Zapier** o **Make**.\n\n**Caso Real:** Un abogado configuró una automatización donde cada vez que le llega un correo con un adjunto \"Contrato\", Zapier lo envía a ChatGPT para que extraiga las cláusulas de riesgo y le mande un resumen a Slack. Todo esto sin escribir una sola línea de código.",
          image: "/images/portal-ambiental/blog/flujo-trabajo-digital.jpg",
        },
        {
          id: "casos-latam",
          title: "Casos de Uso Reales en LATAM",
          content: "**1. La Contadora:** Usa ChatGPT para convertir listas de gastos desordenadas (copiadas de un PDF) en tablas CSV limpias para Excel.\n\n**2. El Profesor:** Usa herramientas de IA generativa para crear exámenes de opción múltiple personalizados basados en notas de clase.\n\n**3. El Emprendedor:** Usa IA para generar las imágenes de producto de su tienda online y los textos de venta para Instagram en una tarde.",
        },
        {
          id: "errores-novato",
          title: "Errores de Novato a Evitar",
          content: "• **Confianza Ciega:** Nunca copies y pegues un dato numérico o legal sin verificar. La IA se equivoca con seguridad.\n\n• **Datos Sensibles:** No subas bases de datos con cédulas, teléfonos o secretos industriales a chats públicos gratuitos. Usa versiones empresariales o anonimiza los datos.",
          callout: {
            type: "success",
            title: "Tu tarea de 10 minutos",
            content: "Regístrate en Claude.ai (es gratis). Sube un PDF de algún tema que te parezca aburrido o difícil. Pídele: \"Explícame esto como si tuviera 10 años y dame 3 puntos clave\". Acabas de desbloquear tu superpoder de aprendizaje.",
          },
        },
      ],
      conclusion: "No necesitas ser programador para usar IA. Necesitas curiosidad, las herramientas correctas y disposición para experimentar. Esta guía te dio el mapa; ahora te toca caminar. Empieza con un chat simple, domina el prompting, y cuando estés listo, automatiza. El futuro no espera.",
    },
    tags: ["principiantes", "No-Code", "Zapier", "herramientas IA", "productividad", "guía práctica"],
    nextArticle: {
      slug: "automatizar-tareas-con-ia-sin-programar",
      title: "Tareas que puedes automatizar con IA sin programar",
    },
  },
};

export function getLatestIAArticles(count: number = 3): BlogArticle[] {
  return Object.values(NEW_IA_ARTICLES)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
