import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde blog-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "calculadora-irca-calidad-agua",
  title: "Cómo Calcular el IRCA y Otros Índices de Calidad del Agua: Guía Completa con Herramienta Gratuita",
  category: "Gestión Ambiental",
  date: "2024-12-09",
  dateModified: "2026-10-26",
  readTime: 9,
  excerpt: "Cómo se calcula el IRCA según la Resolución 2115: fórmula, los 22 parámetros con su puntaje, ejemplo resuelto y calculadora gratuita.",
  heroImage: "/images/portal-ambiental/blog/irca-calidad-agua-potable.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "¿Alguna vez te has preguntado qué tan segura es el agua que bebes? Los índices de calidad del agua son herramientas científicas que transforman datos complejos de laboratorio en un solo número que cualquiera puede entender. En Colombia, el IRCA (Índice de Riesgo de Calidad del Agua) es la herramienta oficial para evaluar el agua potable, pero también existen otros índices internacionales como el WQI y el DWQI. En este artículo, te mostraremos cómo funcionan estos índices, cómo calcularlos paso a paso y cómo usar nuestra herramienta gratuita para hacerlo automáticamente.",
    sections: [
      {
        id: "que-es-irca",
        title: "¿Qué es el IRCA y por qué es importante?",
        content: "El Índice de Riesgo de Calidad del Agua Potable (IRCA) es un indicador establecido por la Resolución 2115 de 2007 del Ministerio de la Protección Social de Colombia. Este índice evalúa 22 parámetros fisicoquímicos y microbiológicos para determinar el nivel de riesgo del agua que consumes. Se calcula sumando los puntajes de las características que no cumplen la norma, dividiéndolos entre los puntajes de todas las características que se analizaron y multiplicando por 100. El resultado es un porcentaje de 0% a 100%: entre más bajo, mejor calidad tiene el agua. Un IRCA de 0% significa agua sin riesgo, mientras que 80% o más indica que el agua es inviable sanitariamente.",
        image: "/images/portal-ambiental/blog/irca-laboratorio-monitoreo.jpg",
        callout: {
          type: "info",
          title: "Niveles de riesgo del IRCA",
          content: "• 0% - 5%: Sin riesgo (agua apta)\n• 5.1% - 14%: Riesgo bajo (requiere seguimiento)\n• 14.1% - 35%: Riesgo medio (tomar acciones correctivas)\n• 35.1% - 80%: Riesgo alto (agua no apta)\n• >80%: Inviable sanitariamente (prohibido consumo)",
        },
        subsections: [
          {
            id: "parametros-irca",
            title: "Los 22 parámetros que evalúa el IRCA",
            content: "La Resolución 2115 de 2007 asigna un puntaje de riesgo a cada una de las 22 características del IRCA, y los puntajes suman 100:\n\n**Microbiológicas (40 puntos):**\n• Escherichia coli (25 puntos)\n• Coliformes totales (15 puntos)\n\n**Fisicoquímicas de mayor peso (36 puntos):**\n• Turbiedad (15 puntos) y cloro residual libre (15 puntos)\n• Color aparente (6 puntos)\n\n**Otras fisicoquímicas (24 puntos):**\n• Nitritos, aluminio y carbono orgánico total (3 puntos cada uno)\n• pH y hierro total (1.5 puntos cada uno)\n• Alcalinidad, calcio, cloruros, dureza total, fluoruros, fosfatos, magnesio, manganeso, molibdeno, nitratos, sulfatos y zinc (1 punto cada uno)\n\nEl puntaje de una característica solo cuenta en el IRCA cuando su resultado no cumple el valor aceptable. Si el laboratorio no analizó alguna, no entra ni en el numerador ni en el denominador.",
          },
        ],
      },
      {
        id: "otros-indices",
        title: "WQI y DWQI: índices internacionales de calidad de agua",
        content: "Además del IRCA, existen otros índices reconocidos internacionalmente que también son útiles para evaluar calidad de agua:",
        subsections: [
          {
            id: "wqi-nsf",
            title: "WQI (NSF Water Quality Index)",
            content: "Desarrollado por la National Sanitation Foundation de Estados Unidos, el WQI evalúa 9 parámetros con pesos ponderados según su importancia. A diferencia del IRCA que penaliza incumplimientos, el WQI calcula un puntaje de 0 a 100 donde valores altos indican mejor calidad.\n\n**Los 9 parámetros del WQI:**\n• Oxígeno disuelto (17% de peso)\n• Coliformes fecales (16%)\n• pH (11%)\n• DBO₅ (11%)\n• Temperatura (10%)\n• Fosfatos totales (10%)\n• Nitratos (10%)\n• Turbiedad (8%)\n• Sólidos disueltos totales (7%)\n\n**Categorías de calidad:**\n• 90-100: Excelente\n• 70-89: Buena\n• 50-69: Media\n• 25-49: Mala\n• 0-24: Muy mala",
          },
          {
            id: "dwqi-internacional",
            title: "DWQI (Drinking Water Quality Index)",
            content: "El DWQI es un índice internacional que calcula la calidad del agua potable comparando las concentraciones medidas con estándares de la OMS. Utiliza 18 parámetros y una fórmula matemática basada en pesos inversamente proporcionales a los estándares.\n\n**Fórmula del DWQI:**\n• Qi = (|Ci - Vi| / |Si - Vi|) × 100\n• Wi = K / Si\n• DWQI = Σ(Qi × Wi)\n\nDonde:\n• Ci = concentración medida\n• Si = estándar permitido\n• Vi = valor ideal (generalmente 0)\n• K = constante de proporcionalidad\n\n**Categorías:**\n• <50: Excelente\n• 51-100: Buena\n• 101-200: Pobre\n• 201-300: Muy pobre\n• >300: No apta para consumo",
          },
        ],
      },
      {
        id: "como-calcular",
        title: "Cómo calcular los índices paso a paso",
        content: "Calcular estos índices manualmente puede ser complejo, pero con nuestra herramienta gratuita es instantáneo. Solo necesitas los datos de laboratorio de los parámetros básicos como turbiedad (15 pts), cloro residual (15 pts), coliformes totales (15 pts) y E. coli (25 pts).",
        callout: {
          type: "success",
          title: "Usa nuestra calculadora gratuita",
          content: "Ahorra tiempo y evita errores. Nuestra calculadora de índices de calidad de agua procesa tus datos en segundos y genera reportes profesionales. \n\n [🚀 Ir a la Calculadora de Índices de Calidad de Agua](/ambiental/herramientas/indice-calidad-agua)",
        },
        subsections: [
          {
            id: "ejemplo-practico-irca",
            title: "Ejemplo práctico: Calculando el IRCA",
            content: "Imagina que tienes los siguientes resultados de laboratorio:\n\n**Muestra de agua de acueducto municipal:**\n• pH: 7.2 (Cumple: rango 6.5-9.0)\n• Turbiedad: 8 UNT (No cumple: máx 2 UNT) → +15 puntos\n• Cloro residual: 0.3 mg/L (Cumple: 0.3-2.0 mg/L)\n• E. coli: 0 UFC/100mL (Cumple: 0 UFC/100mL)\n• Coliformes totales: 5 UFC/100mL (No cumple: máx 0) → +15 puntos\n• Color: 5 UPC (Cumple: máx 15 UPC)\n• Aluminio: 0.15 mg/L (Cumple: máx 0.2 mg/L)\n• Hierro: 0.35 mg/L (No cumple: máx 0.3 mg/L) → +1.5 puntos\n\n**Cálculo:**\nPuntaje de las características analizadas = 1.5 (pH) + 15 (turbiedad) + 15 (cloro) + 25 (E. coli) + 15 (coliformes) + 6 (color) + 3 (aluminio) + 1.5 (hierro) = 82 puntos\nPuntaje de las que no cumplen = 15 + 15 + 1.5 = 31.5 puntos\nIRCA = 31.5 / 82 × 100 = 38.4%\n\n**Interpretación:**\nEl agua tiene **riesgo alto** (35.1%-80%): no es apta para consumo humano. Las prioridades son la turbiedad y la desinfección para eliminar los coliformes. Fíjate en que el denominador es 82 y no 100, porque solo se analizaron 8 de las 22 características.",
          },
        ],
      },
      {
        id: "herramienta-calculadora",
        title: "Usa nuestra calculadora gratuita de índices",
        content: "Hemos desarrollado una herramienta web gratuita que te permite calcular los tres índices (IRCA, WQI y DWQI) de forma rápida y profesional. Solo necesitas cargar un archivo CSV con tus datos de laboratorio y la herramienta hará todo el trabajo por ti.",
        image: "/images/portal-ambiental/blog/irca-analisis-datos.jpg",
        subsections: [
          {
            id: "caracteristicas-herramienta",
            title: "Características de la herramienta",
            content: "✅ **Carga masiva de datos:** Importa múltiples muestras desde CSV\n✅ **Tres índices en uno:** Calcula IRCA, WQI y DWQI simultáneamente\n✅ **Validación automática:** Verifica que tus datos sean correctos\n✅ **Reportes descargables:** Exporta resultados en CSV con memoria de cálculo\n✅ **Gráficos interactivos:** Visualiza categorías de calidad con colores\n✅ **Normatividad incluida:** Compara con Resolución 2115/2007 y estándares OMS\n✅ **Reconocimiento inteligente:** Identifica parámetros aunque los nombres varíen\n✅ **Gratis y sin registro:** Úsala cuantas veces quieras",
          },
          {
            id: "formato-csv",
            title: "Formato del archivo CSV",
            content: "Tu archivo CSV debe tener 5 columnas:\n\n**Estructura:**\n```\nfecha,ubicacion,parametro,valor,unidad\n2024-12-01,Acueducto Municipal,pH,7.2,Unidades de pH\n2024-12-01,Acueducto Municipal,Turbiedad,1.5,UNT\n2024-12-01,Acueducto Municipal,Cloro residual,0.5,mg/L\n```\n\n**Consejos:**\n• Usa nombres comunes de parámetros (pH, Turbiedad, E. coli, etc.)\n• Asegúrate de incluir las unidades correctas\n• Agrupa todas las muestras de un mismo sitio y fecha\n• Descarga nuestro CSV de ejemplo si tienes dudas",
          },
        ],
      },
      {
        id: "interpretacion-resultados",
        title: "Cómo interpretar los resultados y tomar acción",
        content: "Una vez obtengas el índice, es importante saber qué hacer con esa información. Aquí te explicamos las acciones recomendadas según el resultado:",
        callout: {
          type: "warning",
          title: "¿Agua no apta? Actúa inmediatamente",
          content: "Con un IRCA superior a 5% el agua deja de clasificarse como apta para consumo humano según la Resolución 2115, y con más de 35% (riesgo alto) o un DWQI mayor a 200 la situación es grave. Reporta a las autoridades sanitarias, busca fuentes alternativas y NO consumas el agua sin tratamiento.",
        },
        subsections: [
          {
            id: "acciones-irca-bajo",
            title: "IRCA 5%-14% (Riesgo Bajo)",
            content: "**Acciones recomendadas:**\n• Implementar monitoreo preventivo trimestral\n• Revisar procesos de tratamiento\n• Capacitar operadores en mejores prácticas\n• Documentar incidencias menores\n• Mantener comunicación con autoridad sanitaria",
          },
          {
            id: "acciones-irca-medio",
            title: "IRCA 14%-35% (Riesgo Medio)",
            content: "**Acciones correctivas inmediatas:**\n• Identificar parámetros críticos que no cumplen\n• Ajustar dosificación de cloro/coagulantes\n• Revisar integridad de la red de distribución\n• Implementar plan de contingencia\n• Monitoreo mensual obligatorio\n• Reportar a autoridad sanitaria en 30 días",
          },
          {
            id: "acciones-irca-alto",
            title: "IRCA 35%-80% (Riesgo Alto)",
            content: "**Medidas de emergencia:**\n• PROHIBIR consumo directo del agua\n• Notificar población inmediatamente\n• Implementar suministro alternativo (carrotanques)\n• Auditoría completa del sistema de tratamiento\n• Plan de mejoramiento con cronograma\n• Reporte inmediato a Superintendencia de Servicios Públicos\n• Monitoreo semanal hasta corrección",
          },
        ],
      },
      {
        id: "normatividad",
        title: "Marco legal y normativo en Colombia",
        content: "En Colombia, la calidad del agua potable está regulada principalmente por la Resolución 2115 de 2007, que establece los parámetros y valores límites permisibles. También aplican decretos complementarios como el Decreto 1575 de 2007 sobre el Sistema de Vigilancia de Calidad del Agua.",
        subsections: [
          {
            id: "resolucion-2115",
            title: "Resolución 2115 de 2007",
            content: "Esta norma define:\n• Características físicas, químicas y microbiológicas del agua potable\n• Valores máximos permisibles para 22 parámetros\n• Metodología de cálculo del IRCA\n• Frecuencias de muestreo según población atendida\n• Obligaciones de prestadores de servicio y autoridades\n\n**Frecuencia de control según población:**\n• <2,500 hab: 1 muestra/mes\n• 2,500-12,500: 5 muestras/mes\n• 12,500-60,000: 10 muestras/mes\n• >60,000: Según fórmula específica",
          },
          {
            id: "vigilancia-sanitaria",
            title: "Sistema de vigilancia sanitaria",
            content: "Las Secretarías de Salud municipales y departamentales son responsables de:\n• Realizar muestreos de vigilancia independientes\n• Verificar cumplimiento del IRCA\n• Aplicar medidas sanitarias cuando sea necesario\n• Reportar información al SIVICAP (Sistema de Información de Vigilancia de Calidad del Agua)\n• Publicar IRCA mensual en página web",
          },
        ],
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Qué es el IRCA y quién lo definió?",
            content: "El Índice de Riesgo de Calidad del Agua Potable (IRCA) es el indicador oficial de Colombia para evaluar el agua de consumo. Lo establece la Resolución 2115 de 2007 y evalúa 22 parámetros fisicoquímicos y microbiológicos cuyos puntajes suman 100. Las características microbiológicas pesan 40 puntos: E. coli 25 y coliformes totales 15.",
          },
          {
            id: "faq-2",
            title: "¿Qué significan los rangos de riesgo del IRCA?",
            content: "Según el artículo, un IRCA de 5 % a 14 % es riesgo bajo (monitoreo preventivo y revisión del tratamiento), de 14 % a 35 % es riesgo medio (acciones correctivas inmediatas y monitoreo mensual) y de 35 % a 80 % es riesgo alto (prohibir el consumo directo, notificar a la población y habilitar suministro alternativo).",
          },
          {
            id: "faq-3",
            title: "¿En qué se diferencian el IRCA, el WQI y el DWQI?",
            content: "El IRCA penaliza los incumplimientos de la norma colombiana. El WQI de la National Sanitation Foundation evalúa 9 parámetros con pesos ponderados y entrega un puntaje de 0 a 100 donde un valor alto indica mejor calidad. El DWQI compara las concentraciones medidas con los estándares de la OMS usando 18 parámetros.",
          },
          {
            id: "faq-4",
            title: "¿Qué archivo necesita la calculadora gratuita?",
            content: "Un CSV con cinco columnas: fecha, ubicación, parámetro, valor y unidad. La herramienta calcula el IRCA, el WQI y el DWQI a la vez, valida los datos y permite exportar los resultados en CSV.",
          },
          {
            id: "faq-5",
            title: "¿Quién vigila que el agua cumpla la norma?",
            content: "Las secretarías de salud municipales y departamentales hacen muestreos de vigilancia independientes, verifican el cumplimiento del IRCA y aplican medidas sanitarias cuando es necesario. El Decreto 1575 de 2007 regula el sistema de vigilancia de la calidad del agua.",
          },
        ],
      },
    ],
    conclusion: "Los índices de calidad de agua son herramientas poderosas para proteger la salud pública. Ya sea que trabajes en un acueducto, laboratorio, autoridad sanitaria o simplemente quieras entender mejor la calidad del agua que consumes, conocer cómo calcular e interpretar estos índices es fundamental. Nuestra calculadora gratuita hace que este proceso sea rápido, preciso y accesible para todos. ¡No esperes más y comienza a evaluar la calidad de tu agua hoy mismo!",
  },
  tags: ["IRCA", "WQI", "DWQI", "calidad agua", "potabilización", "Resolución 2115", "herramienta gratuita"],
  references: [
    {
      title: "Resolución 2115 de 2007: características, instrumentos básicos y frecuencias del sistema de control y vigilancia de la calidad del agua para consumo humano",
      url: "https://cancilleria.gov.co/normograma/compilacion/docs/resolucion_minproteccion_2115_2007.htm",
      source: "Ministerio de la Protección Social y MAVDT, reproducida en el Normograma de la Cancillería",
      description: "Art. 13 (puntaje de riesgo de cada característica, Cuadro 6; suma 100), art. 14 (fórmulas del IRCA por muestra y mensual) y art. 15 (clasificación del nivel de riesgo, Cuadro 7). Texto consultado el 17 de noviembre de 2026; esa copia no incluye notas de vigencia.",
    },
    {
      title: "Decreto 1575 de 2007: Sistema para la Protección y Control de la Calidad del Agua para Consumo Humano",
      url: "https://normas.cra.gov.co/gestor/docs/decreto_1575_2007.htm",
      source: "Ministerio de la Protección Social, reproducido en el Gestor Normativo de la CRA",
      description: "Art. 12: define el IRCA como el grado de riesgo de ocurrencia de enfermedades por el incumplimiento de las características físicas, químicas y microbiológicas del agua. Texto consultado el 17 de noviembre de 2026.",
    },
  ],
  nextArticle: {
    slug: "indices-calidad-aire-aqi-ica",
    title: "Índices de Calidad del Aire: Cómo Interpretar el AQI, ICA e IBOCA",
  },
});

export default article;
