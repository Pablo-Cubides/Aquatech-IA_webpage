// Article configuration for both portals
// This file can be easily edited to add new articles

import { NEW_IA_ARTICLES } from "./new-blog-articles";
import { NEW_AMBIENTAL_ARTICLES } from "./new-ambiental-articles";

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
  "calculadora-irca-calidad-agua": {
    slug: "calculadora-irca-calidad-agua",
    title: "Cómo Calcular el IRCA y Otros Índices de Calidad del Agua: Guía Completa con Herramienta Gratuita",
    category: "Gestión Ambiental",
    date: "2024-12-09",
    readTime: 12,
    excerpt: "Descubre cómo evaluar la calidad del agua potable con los índices IRCA, WQI y DWQI. Incluye herramienta gratuita, ejemplos prácticos y normatividad colombiana.",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "¿Alguna vez te has preguntado qué tan segura es el agua que bebes? Los índices de calidad del agua son herramientas científicas que transforman datos complejos de laboratorio en un solo número que cualquiera puede entender. En Colombia, el IRCA (Índice de Riesgo de Calidad del Agua) es la herramienta oficial para evaluar el agua potable, pero también existen otros índices internacionales como el WQI y el DWQI. En este artículo, te mostraremos cómo funcionan estos índices, cómo calcularlos paso a paso y cómo usar nuestra herramienta gratuita para hacerlo automáticamente.",
      sections: [
        {
          id: "que-es-irca",
          title: "¿Qué es el IRCA y por qué es importante?",
          content: "El Índice de Riesgo de Calidad del Agua Potable (IRCA) es un indicador establecido por la Resolución 2115 de 2007 del Ministerio de la Protección Social de Colombia. Este índice evalúa 22 parámetros fisicoquímicos y microbiológicos para determinar el nivel de riesgo del agua que consumes. El resultado es un porcentaje de 0% a 100%: entre más bajo, mejor calidad tiene el agua. Un IRCA de 0% significa agua sin riesgo, mientras que 80% o más indica que el agua es inviable sanitariamente.",
          image: "https://images.unsplash.com/photo-1580741569180-94ec70a0e2a1?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "info",
            title: "Niveles de riesgo del IRCA",
            content: "• 0% - 5%: Sin riesgo (agua apta)\n• 5.1% - 14%: Riesgo bajo (requiere seguimiento)\n• 14.1% - 35%: Riesgo medio (tomar acciones correctivas)\n• 35.1% - 80%: Riesgo alto (agua no apta)\n• >80%: Inviable sanitariamente (prohibido consumo)",
          },
          subsections: [
            {
              id: "parametros-irca",
              title: "Los 22 parámetros que evalúa el IRCA",
              content: "El IRCA evalúa tres grupos de parámetros:\n\n**Microbiológicos (25% del puntaje):**\n• Coliformes totales y E. coli (15 puntos cada uno)\n\n**Fisicoquímicos (75% del puntaje):**\n• pH, turbiedad, color, cloro residual\n• Alcalinidad, dureza, conductividad\n• Metales: aluminio, hierro, manganeso\n• Químicos: fluoruros, cloruros, nitratos, nitritos\n• Sustancias tóxicas: arsénico, plomo, mercurio, cadmio\n\nCada parámetro que no cumple con la norma suma puntos de penalización. El IRCA final es la suma de todos los puntos, expresado como porcentaje.",
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
          content: "Calcular estos índices manualmente puede ser complejo, pero con nuestra herramienta gratuita es instantáneo. Aquí te explicamos el proceso general:",
          callout: {
            type: "success",
            title: "Usa nuestra calculadora gratuita",
            content: "Ahorra tiempo y evita errores. Nuestra calculadora de índices de calidad de agua procesa tus datos en segundos y genera reportes profesionales con gráficos y explicaciones detalladas. ¡Pruébala ahora!",
          },
          subsections: [
            {
              id: "ejemplo-practico-irca",
              title: "Ejemplo práctico: Calculando el IRCA",
              content: "Imagina que tienes los siguientes resultados de laboratorio:\n\n**Muestra de agua de acueducto municipal:**\n• pH: 7.2 (Cumple: rango 6.5-9.0)\n• Turbiedad: 8 UNT (No cumple: máx 2 UNT) → +15 puntos\n• Cloro residual: 0.3 mg/L (Cumple: 0.3-2.0 mg/L)\n• E. coli: 0 UFC/100mL (Cumple: 0 UFC/100mL)\n• Coliformes totales: 5 UFC/100mL (No cumple: máx 0) → +15 puntos\n• Color: 5 UPC (Cumple: máx 15 UPC)\n• Aluminio: 0.15 mg/L (Cumple: máx 0.2 mg/L)\n• Hierro: 0.35 mg/L (No cumple: máx 0.3 mg/L) → +1.5 puntos\n\n**Cálculo:**\nPuntos totales = 15 + 15 + 1.5 = 31.5 puntos\nIRCA = 31.5%\n\n**Interpretación:**\nEl agua tiene **riesgo medio** (14.1%-35%). Requiere acciones correctivas inmediatas, especialmente en el control de turbidez y desinfección para eliminar coliformes.",
            },
          ],
        },
        {
          id: "herramienta-calculadora",
          title: "Usa nuestra calculadora gratuita de índices",
          content: "Hemos desarrollado una herramienta web gratuita que te permite calcular los tres índices (IRCA, WQI y DWQI) de forma rápida y profesional. Solo necesitas cargar un archivo CSV con tus datos de laboratorio y la herramienta hará todo el trabajo por ti.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
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
            content: "Si tu IRCA es mayor a 35% o tu DWQI es mayor a 200, el agua NO es apta para consumo humano. Reporta a las autoridades sanitarias, busca fuentes alternativas y NO consumas el agua sin tratamiento.",
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
      ],
      conclusion: "Los índices de calidad de agua son herramientas poderosas para proteger la salud pública. Ya sea que trabajes en un acueducto, laboratorio, autoridad sanitaria o simplemente quieras entender mejor la calidad del agua que consumes, conocer cómo calcular e interpretar estos índices es fundamental. Nuestra calculadora gratuita hace que este proceso sea rápido, preciso y accesible para todos. ¡No esperes más y comienza a evaluar la calidad de tu agua hoy mismo!",
    },
    tags: ["IRCA", "WQI", "DWQI", "calidad agua", "potabilización", "Resolución 2115", "monitoreo agua", "herramienta gratuita"],
    nextArticle: {
      slug: "indices-calidad-aire-aqi-ica",
      title: "Índices de Calidad del Aire: Cómo Interpretar el AQI, ICA e IBOCA",
    },
  },

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
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
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

  "indices-calidad-aire-aqi-ica": {
    slug: "indices-calidad-aire-aqi-ica",
    title: "Índices de Calidad del Aire: Cómo Interpretar el AQI, ICA e IBOCA para la Toma de Decisiones",
    category: "Control de Contaminación",
    date: "2024-12-09",
    readTime: 14,
    excerpt: "Aprende a leer e interpretar los índices de calidad del aire más utilizados en el mundo. Protege tu salud con información en tiempo real y herramientas gratuitas.",
    heroImage: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "El aire que respiramos tiene un impacto directo en nuestra salud, pero ¿cómo saber si el aire de tu ciudad está limpio o contaminado? Los índices de calidad del aire transforman mediciones complejas de contaminantes en un número simple que cualquiera puede entender. En este artículo descubrirás cómo funcionan los principales índices usados en Colombia, Estados Unidos y Europa, qué significan sus colores y números, y cómo puedes proteger tu salud tomando decisiones informadas. Además, te mostraremos nuestra herramienta gratuita para calcular estos índices instantáneamente.",
      sections: [
        {
          id: "que-son-indices-aire",
          title: "¿Qué son los índices de calidad del aire?",
          content: "Los índices de calidad del aire son herramientas que convierten las concentraciones de contaminantes atmosféricos (medidas en µg/m³ o mg/m³) en una escala numérica fácil de entender, generalmente de 0 a 500. Cada índice divide esta escala en categorías con códigos de colores que indican el nivel de riesgo para la salud: verde (bueno), amarillo (moderado), naranja (dañino para grupos sensibles), rojo (dañino), morado (muy dañino) y marrón (peligroso).",
          image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "info",
            title: "Los 6 contaminantes criterio",
            content: "Los índices de calidad del aire monitoran 6 contaminantes principales:\n• PM₂.₅ (partículas finas ≤2.5µm)\n• PM₁₀ (partículas ≤10µm)\n• O₃ (ozono troposférico)\n• NO₂ (dióxido de nitrógeno)\n• SO₂ (dióxido de azufre)\n• CO (monóxido de carbono)\n\nEl índice final reportado es el del contaminante con el peor valor (contaminante crítico).",
          },
        },
        {
          id: "aqi-estados-unidos",
          title: "US AQI: El índice de referencia mundial",
          content: "El Air Quality Index (AQI) de la EPA (Agencia de Protección Ambiental de Estados Unidos) es el índice más utilizado globalmente. Utiliza una escala de 0 a 500 dividida en 6 categorías con colores del semáforo.",
          subsections: [
            {
              id: "categorias-aqi",
              title: "Categorías del AQI",
              content: "**🟢 Bueno (0-50):**\nCalidad del aire satisfactoria, sin riesgo para la salud. Ideal para actividades al aire libre.\n\n**🟡 Moderado (51-100):**\nAceptable, pero personas muy sensibles podrían experimentar molestias leves.\n\n**🟠 Dañino para grupos sensibles (101-150):**\nNiños, adultos mayores, personas con asma o enfermedades cardíacas deben reducir esfuerzos prolongados al aire libre.\n\n**🔴 Dañino (151-200):**\nToda la población puede experimentar efectos en la salud. Grupos sensibles deben evitar actividades al aire libre.\n\n**🟣 Muy dañino (201-300):**\nAlerta de salud: todos pueden experimentar efectos graves. Evitar ejercicio al aire libre.\n\n**🟤 Peligroso (301-500):**\nEmergencia sanitaria. Toda la población está en riesgo. Permanecer en espacios cerrados con filtros de aire.",
            },
            {
              id: "formula-aqi",
              title: "Cómo se calcula el AQI",
              content: "El AQI usa interpolación lineal entre breakpoints definidos por la EPA:\n\n**Fórmula:**\n```\nAQI = [(Ihi - Ilo) / (BPhi - BPlo)] × (Cp - BPlo) + Ilo\n```\n\nDonde:\n• Cp = concentración medida del contaminante\n• BPhi = breakpoint superior de la concentración\n• BPlo = breakpoint inferior de la concentración\n• Ihi = índice correspondiente al BPhi\n• Ilo = índice correspondiente al BPlo\n\n**Ejemplo práctico:**\nSi mides PM₂.₅ = 35.5 µg/m³ (promedio 24h):\n• Cae en el rango 35.5-55.4 µg/m³ (Moderado)\n• Breakpoints: BPlo=35.5, BPhi=55.4, Ilo=101, Ihi=150\n• AQI = [(150-101)/(55.4-35.5)] × (35.5-35.5) + 101 = **101**\n• Categoría: 🟠 Dañino para grupos sensibles",
            },
          ],
        },
        {
          id: "ica-colombia",
          title: "ICA Colombia: Monitoreo nacional",
          content: "El Índice de Calidad del Aire (ICA) de Colombia, establecido por la Resolución 2254 de 2017 del Ministerio de Ambiente, es prácticamente idéntico al AQI estadounidense en su escala y categorías, pero con algunos breakpoints ajustados a condiciones locales.",
          subsections: [
            {
              id: "red-monitoreo-colombia",
              title: "Red de monitoreo en Colombia",
              content: "Colombia cuenta con más de 200 estaciones de monitoreo de calidad del aire distribuidas en las principales ciudades:\n\n• **Bogotá:** Red RMCAB con 19 estaciones\n• **Medellín:** Sistema SIATA con 30+ estaciones\n• **Cali:** Red DAGMA\n• **Barranquilla:** Red de la CRA\n• **Cartagena:** Red EPA Cartagena\n\nPuedes consultar el ICA en tiempo real en:\n• www.sisaire.gov.co (sistema nacional)\n• Aplicaciones móviles de las CAR locales\n• Nuestra herramienta con datos integrados",
            },
          ],
        },
        {
          id: "iboca-bogota",
          title: "IBOCA: El índice de Bogotá",
          content: "El Índice Bogotano de Calidad del Aire (IBOCA), creado por la Resolución 2840 de 2023, es una versión mejorada del ICA tradicional que incorpora múltiples promedios temporales y condiciones meteorológicas específicas de la capital colombiana.",
          callout: {
            type: "success",
            title: "Mejoras del IBOCA",
            content: "El IBOCA considera:\n• Promedios móviles de 1h, 8h y 24h según el contaminante\n• Factores meteorológicos (inversión térmica, vientos)\n• Períodos de episodios de alta contaminación\n• Alertas tempranas específicas para Bogotá\n• Recomendaciones personalizadas por localidad",
          },
        },
        {
          id: "eaqi-europa",
          title: "EAQI: El índice europeo",
          content: "El European Air Quality Index (EAQI) de la Agencia Europea de Medio Ambiente utiliza una escala simplificada de 1 a 6 (en lugar de 0-500), con categorías más condensadas.",
          subsections: [
            {
              id: "categorias-eaqi",
              title: "Escala del EAQI",
              content: "**1 - Muy bueno:**\nÓptimo para todas las actividades\n\n**2 - Bueno:**\nSin restricciones\n\n**3 - Moderado:**\nPersonas muy sensibles deben considerar reducir actividades intensas\n\n**4 - Deficiente:**\nGrupos sensibles deben reducir esfuerzos prolongados\n\n**5 - Muy deficiente:**\nToda la población debe reducir actividades al aire libre\n\n**6 - Extremadamente deficiente:**\nEvitar todas las actividades al aire libre",
            },
          ],
        },
        {
          id: "oms-guias",
          title: "Índice OMS: Los estándares más estrictos",
          content: "La Organización Mundial de la Salud publicó en 2021 sus nuevas Guías de Calidad del Aire (AQG 2021), que establecen los límites más estrictos del mundo. Muchas ciudades están adoptando estos valores como referencia para sus índices locales.",
          subsections: [
            {
              id: "limites-oms",
              title: "Valores guía OMS 2021",
              content: "**PM₂.₅:**\n• Promedio anual: 5 µg/m³ (antes 10)\n• Promedio 24h: 15 µg/m³ (antes 25)\n\n**PM₁₀:**\n• Promedio anual: 15 µg/m³ (antes 20)\n• Promedio 24h: 45 µg/m³ (antes 50)\n\n**O₃:**\n• Pico estacional: 60 µg/m³ (promedio 8h)\n\n**NO₂:**\n• Promedio anual: 10 µg/m³ (antes 40)\n• Promedio 24h: 25 µg/m³\n\n**SO₂:**\n• Promedio 24h: 40 µg/m³\n\nEstos valores son mucho más estrictos que los índices tradicionales, reflejando el consenso científico actual sobre los efectos de la contaminación en la salud.",
            },
          ],
        },
        {
          id: "herramienta-calculadora-aire",
          title: "Calcula índices de calidad del aire gratis",
          content: "Hemos creado una herramienta web gratuita que te permite calcular los 5 índices principales (US AQI, ICA Colombia, IBOCA, EAQI, OMS) a partir de tus datos de monitoreo. Solo necesitas las concentraciones de los 6 contaminantes y la herramienta hace todo el cálculo automáticamente.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          subsections: [
            {
              id: "caracteristicas-calculadora-aire",
              title: "Características de la calculadora",
              content: "✅ **5 índices simultáneos:** AQI, ICA, IBOCA, EAQI, OMS\n✅ **Entrada flexible:** Manual o carga CSV\n✅ **Identificación de contaminante crítico:** Descubre qué contamina más\n✅ **Breakpoints completos:** Ve la tabla de cálculo detallada\n✅ **Colores oficiales:** Categorías con códigos de color estándar\n✅ **Recomendaciones de salud:** Qué hacer según el nivel de contaminación\n✅ **Exportación:** Descarga resultados en CSV\n✅ **Gratis y sin registro:** Úsala cuando quieras",
            },
            {
              id: "como-usar-calculadora",
              title: "Cómo usar la calculadora",
              content: "**Paso 1:** Ingresa las concentraciones de los contaminantes que mediste:\n• PM₂.₅ en µg/m³\n• PM₁₀ en µg/m³\n• O₃ en µg/m³\n• NO₂ en µg/m³\n• SO₂ en µg/m³\n• CO en mg/m³\n\n**Paso 2:** Selecciona el período de promedio:\n• PM₂.₅: 24 horas\n• PM₁₀: 24 horas\n• O₃: 8 horas\n• NO₂: 1 hora\n• SO₂: 1 hora\n• CO: 8 horas\n\n**Paso 3:** Haz clic en \"Calcular\" y obtén:\n• Índices de los 5 sistemas\n• Categoría con código de color\n• Contaminante crítico\n• Recomendaciones de salud\n• Tabla de breakpoints aplicados",
            },
          ],
        },
        {
          id: "recomendaciones-salud",
          title: "Qué hacer según el índice de calidad del aire",
          content: "Conocer el índice es solo el primer paso. Lo importante es saber cómo protegerte según el nivel de contaminación:",
          callout: {
            type: "warning",
            title: "Grupos sensibles",
            content: "Si eres parte de un grupo sensible (niños, adultos mayores, personas con asma, EPOC, enfermedades cardiovasculares o diabetes), debes tomar precauciones incluso con índices moderados (51-100).",
          },
          subsections: [
            {
              id: "acciones-bueno-moderado",
              title: "🟢 Bueno (0-50) y 🟡 Moderado (51-100)",
              content: "**Puedes:**\n• Realizar cualquier actividad al aire libre sin restricciones\n• Ejercitarte normalmente\n• Ventilar tu casa o espacio de trabajo\n\n**Grupos sensibles en nivel moderado:**\n• Considera reducir esfuerzos prolongados muy intensos\n• Monitorea síntomas si tienes condiciones preexistentes",
            },
            {
              id: "acciones-dañino-sensibles",
              title: "🟠 Dañino para grupos sensibles (101-150)",
              content: "**Grupos sensibles deben:**\n• Reducir esfuerzos prolongados al aire libre\n• Evitar ejercicio intenso en exteriores\n• Usar mascarilla N95 si deben salir\n• Mantener ventanas cerradas\n• Usar purificadores de aire en interiores\n\n**Población general:**\n• Puede realizar actividades normales\n• Considera reducir ejercicio muy intenso",
            },
            {
              id: "acciones-dañino",
              title: "🔴 Dañino (151-200)",
              content: "**Toda la población debe:**\n• Evitar esfuerzos prolongados al aire libre\n• Reducir significativamente el ejercicio exterior\n• Usar mascarilla N95 al salir\n• Mantener espacios cerrados con purificadores\n\n**Grupos sensibles:**\n• Evitar completamente salir al exterior\n• Tener medicamentos de rescate a mano\n• Consultar médico si aparecen síntomas",
            },
            {
              id: "acciones-muy-dañino-peligroso",
              title: "🟣 Muy dañino (201-300) y 🟤 Peligroso (>300)",
              content: "**Alerta de salud pública - Todos deben:**\n• Permanecer en interiores con puertas y ventanas cerradas\n• Evitar completamente actividades al aire libre\n• Usar mascarillas N95 o superiores si es imprescindible salir\n• Usar purificadores de aire HEPA en interiores\n• Seguir comunicados oficiales de emergencia\n\n**Medidas institucionales:**\n• Suspensión de clases en colegios\n• Restricción vehicular ampliada\n• Teletrabajo recomendado\n• Cierre de parques y espacios recreativos\n• Activación de protocolos de emergencia sanitaria",
            },
          ],
        },
        {
          id: "fuentes-tiempo-real",
          title: "Consulta calidad del aire en tiempo real",
          content: "Existen múltiples plataformas donde puedes consultar el índice de calidad del aire de tu ciudad en tiempo real:",
          subsections: [
            {
              id: "plataformas-colombia",
              title: "Plataformas en Colombia",
              content: "• **SISAIRE:** Sistema de Información sobre Calidad del Aire (www.sisaire.gov.co)\n• **Aplicación Aire Bogotá:** Para iOS y Android\n• **SIATA Medellín:** www.siata.gov.co\n• **DAGMA Cali:** Reportes diarios\n• **Twitter:** @IDIGERBogota, @SIATAMedellin",
            },
            {
              id: "plataformas-internacionales",
              title: "Plataformas internacionales",
              content: "• **AirNow (USA):** www.airnow.gov\n• **WAQI:** World Air Quality Index (waqi.info)\n• **IQAir:** www.iqair.com\n• **Copernicus (EU):** atmosphere.copernicus.eu\n• **OpenAQ:** Datos abiertos globales (openaq.org)",
            },
          ],
        },
      ],
      conclusion: "Los índices de calidad del aire son tu mejor aliado para proteger tu salud y la de tu familia. No esperes a sentir molestias respiratorias para tomar acción: consulta el índice diariamente, especialmente si perteneces a un grupo sensible. Usa nuestra calculadora gratuita para entender mejor los datos de tu ciudad y toma decisiones informadas sobre cuándo salir, hacer ejercicio o ventilar tu hogar. El aire limpio es un derecho, y el conocimiento es el primer paso para exigirlo.",
    },
    tags: ["AQI", "ICA Colombia", "IBOCA", "calidad del aire", "contaminación atmosférica", "PM2.5", "salud pública", "monitoreo ambiental"],
    nextArticle: {
      slug: "matrices-eia-leopold-conesa",
      title: "Matrices de Evaluación de Impacto Ambiental: Guía Práctica",
    },
  },

  "matrices-eia-leopold-conesa": {
    slug: "matrices-eia-leopold-conesa",
    title: "Matrices de Evaluación de Impacto Ambiental: Guía Práctica de Leopold, Conesa y Battelle",
    category: "Gestión Ambiental",
    date: "2024-12-09",
    readTime: 16,
    excerpt: "Domina las metodologías de EIA más utilizadas en Latinoamérica. Guía paso a paso con ejemplos prácticos y herramienta gratuita para generar tus matrices profesionales.",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "La Evaluación de Impacto Ambiental (EIA) es un requisito obligatorio para obtener licencias ambientales en Colombia y la mayoría de países latinoamericanos. Pero, ¿cómo se evalúan sistemáticamente los impactos de un proyecto? Las matrices de evaluación ambiental son herramientas metodológicas que permiten identificar, valorar y comparar impactos de forma estructurada. En este artículo te enseñaremos las tres metodologías más utilizadas: Leopold, Conesa y Battelle-Columbus, con ejemplos prácticos y acceso a nuestra herramienta gratuita para generar matrices profesionales en minutos.",
      sections: [
        {
          id: "que-es-eia",
          title: "¿Qué es una Evaluación de Impacto Ambiental?",
          content: "La EIA es un procedimiento técnico-administrativo que sirve para identificar, predecir e interpretar los impactos ambientales que producirá un proyecto en su entorno en caso de ser ejecutado. Su objetivo principal es establecer las medidas para prevenir, mitigar, corregir o compensar dichos impactos. En Colombia, la Ley 99 de 1993 y el Decreto 1076 de 2015 regulan el proceso de licenciamiento ambiental.",
          callout: {
            type: "info",
            title: "Proyectos que requieren EIA en Colombia",
            content: "• Hidrocarburos (exploración y explotación)\n• Minería (mediana y gran escala)\n• Infraestructura vial (autopistas, túneles)\n• Energía (centrales térmicas, hidroeléctricas, eólicas)\n• Puertos y aeropuertos\n• Proyectos urbanísticos >5 hectáreas\n• Distritos de riego\n• Manejo de residuos peligrosos",
          },
        },
        {
          id: "matriz-leopold",
          title: "Matriz de Leopold: La pionera de las metodologías",
          content: "Desarrollada en 1971 por el Servicio Geológico de Estados Unidos, la Matriz de Leopold es la metodología de identificación de impactos más conocida mundialmente. Consiste en una matriz de doble entrada donde las filas representan factores ambientales (componentes del medio) y las columnas representan acciones del proyecto que pueden causar impacto.",
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
          subsections: [
            {
              id: "estructura-leopold",
              title: "Estructura de la matriz de Leopold",
              content: "**Dimensiones originales:**\n• 88 factores ambientales (filas)\n• 100 acciones del proyecto (columnas)\n• Total: 8,800 intersecciones posibles\n\n**Factores ambientales agrupados en:**\n• Características físicas y químicas (tierra, agua, atmósfera)\n• Condiciones biológicas (flora, fauna)\n• Factores culturales (uso del territorio, salud, empleo)\n• Relaciones ecológicas\n\n**Acciones del proyecto agrupadas en:**\n• Modificación del régimen\n• Transformación del territorio\n• Renovación de recursos\n• Cambios en el tráfico\n• Disposición de residuos\n• Tratamientos químicos",
            },
            {
              id: "calificacion-leopold",
              title: "Cómo calificar en Leopold",
              content: "Cada intersección (impacto) se califica con DOS valores:\n\n**Magnitud (M):**\n• Escala de -10 a +10 (0 = sin impacto)\n• Signo negativo = impacto adverso\n• Signo positivo = impacto beneficioso\n• Número indica intensidad del impacto\n\n**Importancia (I):**\n• Escala de 1 a 10\n• 1 = poca importancia\n• 10 = muy importante\n• Se refiere a la relevancia del impacto en el contexto del proyecto\n\n**Ejemplo:**\nUna carretera causa pérdida de cobertura vegetal:\n• Magnitud = -7 (impacto adverso fuerte)\n• Importancia = 8 (muy relevante para el ecosistema)\n\nSe anota como: -7/8 en la celda correspondiente.",
            },
            {
              id: "ventajas-limitaciones-leopold",
              title: "Ventajas y limitaciones",
              content: "**Ventajas:**\n✅ Fácil de entender y aplicar\n✅ Buena herramienta de identificación preliminar\n✅ Visual y resumida\n✅ Permite comparar alternativas del proyecto\n\n**Limitaciones:**\n❌ No considera interacciones entre impactos\n❌ Subjetividad en las calificaciones\n❌ No distingue impactos a corto, mediano y largo plazo\n❌ No incluye medidas de manejo",
            },
          ],
        },
        {
          id: "metodo-conesa",
          title: "Método de Conesa: El estándar en Latinoamérica",
          content: "El Método de Vicente Conesa Fernández-Vítora (1995) es el más utilizado en España y Latinoamérica porque ofrece un enfoque cuantitativo más robusto que Leopold. En lugar de dos valores simples, Conesa calcula la importancia del impacto mediante una fórmula que considera 11 atributos.",
          subsections: [
            {
              id: "formula-conesa",
              title: "Fórmula de importancia del impacto",
              content: "**I = ± [3IN + 2EX + MO + PE + RV + SI + AC + EF + PR + MC]**\n\nDonde:\n• **IN (Intensidad):** 1-12. Grado de incidencia\n• **EX (Extensión):** 1-8. Área afectada\n• **MO (Momento):** 1-4. Plazo de manifestación\n• **PE (Persistencia):** 1-4. Permanencia en el tiempo\n• **RV (Reversibilidad):** 1-4. Capacidad de retornar al estado inicial\n• **SI (Sinergia):** 1-4. Acción simultánea de varios impactos\n• **AC (Acumulación):** 1-4. Incremento progresivo\n• **EF (Efecto):** 1-4. Directo o indirecto\n• **PR (Periodicidad):** 1-4. Regularidad de manifestación\n• **MC (Recuperabilidad):** 1-8. Posibilidad de reconstrucción\n\n**Ejemplo práctico:**\nContaminación acústica por construcción de carretera:\n• IN=8 (alta), EX=4 (local), MO=4 (inmediato), PE=2 (temporal)\n• RV=2 (medio plazo), SI=1 (sin sinergia), AC=1 (simple)\n• EF=4 (directo), PR=4 (continuo), MC=4 (mitigable)\n\nI = -[3(8) + 2(4) + 4 + 2 + 2 + 1 + 1 + 4 + 4 + 4] = **-54**",
            },
            {
              id: "categorias-conesa",
              title: "Categorías de impacto según Conesa",
              content: "Una vez calculada la importancia, se clasifica el impacto:\n\n**< 25: Compatible**\n• Recuperación inmediata tras cese de la actividad\n• No necesita medidas correctoras\n\n**25-50: Moderado**\n• Recuperación en el medio plazo\n• Requiere medidas simples de mitigación\n\n**50-75: Severo**\n• Recuperación solo con medidas correctoras intensivas\n• Requiere Plan de Manejo Ambiental robusto\n\n**≥75: Crítico**\n• Imposible de recuperar incluso con medidas\n• Debe evitarse o cambiar diseño del proyecto\n• Puede ser causa de no viabilidad ambiental",
            },
          ],
        },
        {
          id: "sistema-battelle",
          title: "Sistema Battelle-Columbus: Análisis cuantitativo avanzado",
          content: "Desarrollado por el Battelle Columbus Laboratory en 1972 para proyectos de gestión del agua, este sistema utiliza 78 parámetros ambientales agrupados en 18 componentes y 4 categorías principales. Su característica distintiva es el uso de Unidades de Impacto Ambiental (UIA) y funciones de transformación.",
          subsections: [
            {
              id: "estructura-battelle",
              title: "Estructura jerárquica de Battelle",
              content: "**Nivel 1 - Categorías (4):**\n• Ecología (240 UIA max)\n• Contaminación ambiental (402 UIA)\n• Aspectos estéticos (153 UIA)\n• Aspectos de interés humano (205 UIA)\n**Total: 1000 UIA**\n\n**Nivel 2 - Componentes (18):**\nEjemplo en Ecología:\n• Especies y poblaciones\n• Hábitats y comunidades\n• Ecosistemas\n\n**Nivel 3 - Parámetros (78):**\nEjemplo en Agua:\n• DBO\n• Oxígeno disuelto\n• Coliformes fecales\n• pH",
            },
            {
              id: "funciones-transformacion",
              title: "Funciones de transformación",
              content: "El núcleo de Battelle son las curvas de transformación que convierten magnitudes físicas en unidades ambientales:\n\n**Proceso:**\n1. Medir valor del parámetro (ej: DBO = 15 mg/L)\n2. Aplicar función de transformación → Calidad ambiental (CA)\n3. Multiplicar CA × Peso del parámetro → UIA\n\n**Ejemplo:**\nDBO en río:\n• Situación sin proyecto: 5 mg/L → CA=0.9 → UIA=0.9×20=18\n• Situación con proyecto: 25 mg/L → CA=0.5 → UIA=0.5×20=10\n• Impacto: 10-18 = **-8 UIA**\n\nSe repite para los 78 parámetros y se suma el total.",
            },
          ],
        },
        {
          id: "herramienta-generador",
          title: "Generador automático de matrices EIA",
          content: "Crear estas matrices manualmente puede tomar días de trabajo. Por eso desarrollamos una herramienta web gratuita que te guía paso a paso para generar matrices profesionales de Leopold, Conesa y Battelle en minutos.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "success",
            title: "Prueba el generador gratuito",
            content: "✅ Wizard paso a paso guiado\n✅ Base de datos con tipos de proyectos comunes\n✅ Cálculo automático de importancia (Conesa)\n✅ Gráficos de impactos por categoría\n✅ Exportación a PDF y Excel\n✅ Memoria de cálculo incluida\n✅ Sin registro, 100% gratis",
          },
          subsections: [
            {
              id: "como-usar-generador",
              title: "Cómo usar el generador",
              content: "**Paso 1: Selecciona tipo de proyecto**\n• Carretera\n• Hidroeléctrica\n• Minería\n• Urbanización\n• Cultivo agrícola\n• O personaliza\n\n**Paso 2: Define acciones del proyecto**\n• El sistema sugiere acciones típicas\n• Puedes agregar acciones específicas\n• Describe duración y magnitud estimada\n\n**Paso 3: Selecciona factores ambientales**\n• Lista preconfigurada según el proyecto\n• Agrega factores relevantes localmente\n• Describe estado actual (línea base)\n\n**Paso 4: Evalúa impactos**\n• La herramienta te guía en la calificación\n• Conesa: responde 11 preguntas por impacto\n• Leopold: asigna magnitud e importancia\n• Battelle: ingresa mediciones proyectadas\n\n**Paso 5: Descarga matriz profesional**\n• PDF con tablas formateadas\n• Excel editable para ajustes\n• Incluye gráficos y memoria de cálculo",
            },
          ],
        },
        {
          id: "interpretacion-resultados",
          title: "Cómo interpretar y usar los resultados",
          content: "Una vez generada la matriz, debes interpretar los resultados para la toma de decisiones y el diseño del Plan de Manejo Ambiental (PMA):",
          subsections: [
            {
              id: "identificar-criticos",
              title: "1. Identificar impactos críticos y severos",
              content: "**Impactos críticos (Conesa ≥75):**\n• Requieren rediseño del proyecto o alternativa\n• Deben incluirse en la evaluación de viabilidad\n• Podrían ser causa de negación de licencia\n\n**Ejemplo:**\nAfectación de zona de protección de humedal Ramsar\n→ Acción: Reubicar trazado de carretera\n\n**Impactos severos (Conesa 50-75):**\n• Requieren medidas de manejo robustas\n• Monitoreo intensivo durante construcción\n• Inversión significativa en mitigación\n\n**Ejemplo:**\nEmisiones atmosféricas de planta cementera\n→ Acción: Filtros de manga, monitoreo continuo",
            },
            {
              id: "priorizar-medidas",
              title: "2. Priorizar medidas de manejo",
              content: "La jerarquía de manejo ambiental es:\n\n**1. EVITAR (Prevención)**\nEliminar la fuente del impacto\nEj: Cambiar tecnología menos contaminante\n\n**2. MINIMIZAR (Mitigación)**\nReducir magnitud o duración del impacto\nEj: Barreras acústicas, horarios restringidos\n\n**3. RESTAURAR/REHABILITAR (Corrección)**\nRestaurar condiciones originales\nEj: Revegetalización, restauración de cauces\n\n**4. COMPENSAR (Compensación)**\nGenerar beneficios equivalentes en otro lugar\nEj: Reforestación de área equivalente\n\n**5. MONITOREAR (Seguimiento)**\nVerificar eficacia de medidas\nEj: Mediciones trimestrales de calidad de agua",
            },
            {
              id: "costos-ambientales",
              title: "3. Estimar costos del PMA",
              content: "Con base en los impactos identificados, estima los costos del Plan de Manejo Ambiental:\n\n**Costos típicos por categoría:**\n• Prevención y mitigación: 3-8% del valor del proyecto\n• Compensación forestal: $2-5 millones/ha\n• Compensación hídrica: 1% del valor del proyecto\n• Monitoreo ambiental: $50-200 millones/año\n• Arqueología preventiva: $100-500 millones\n• Manejo social: 2-5% del valor del proyecto\n\n**Total PMA:**\nGeneralmente 5-15% del presupuesto total del proyecto.",
            },
          ],
        },
        {
          id: "casos-ejemplo",
          title: "Ejemplos de matrices por tipo de proyecto",
          content: "Para ilustrar la aplicación práctica, veamos ejemplos simplificados de matrices para proyectos comunes:",
          subsections: [
            {
              id: "ejemplo-carretera",
              title: "Ejemplo: Carretera secundaria 15 km",
              content: "**Impactos significativos identificados:**\n\n🔴 **Críticos (ninguno)**\n\n🟠 **Severos:**\n• Remoción cobertura vegetal (Conesa: -67)\n  → 15 ha bosque secundario\n  → Medida: Compensación 3:1 = 45 ha\n• Afectación fauna (Conesa: -58)\n  → Pasos de fauna cada 2 km\n  → Señalización preventiva\n\n🟡 **Moderados:**\n• Generación material particulado (-42)\n• Ruido en fase constructiva (-38)\n• Alteración drenajes naturales (-45)\n\n**Costo estimado PMA:** $450 millones (8% del proyecto)",
            },
            {
              id: "ejemplo-mineria",
              title: "Ejemplo: Mina subterránea de carbón",
              content: "**Impactos significativos:**\n\n🔴 **Críticos:**\n• Afectación acuífero regional (Conesa: -82)\n  → INVIABLE en diseño original\n  → Rediseño: inyección y sellado de galerías\n\n🟠 **Severos:**\n• Subsidencia terreno (Conesa: -71)\n  → Monitoreo topográfico trimestral\n  → Relleno controlado de galerías\n• Generación aguas ácidas (Conesa: -65)\n  → Planta de tratamiento de drenajes\n  → Neutralización química continua\n\n**Costo estimado PMA:** $8,500 millones (12% del proyecto)",
            },
          ],
        },
        {
          id: "normatividad-eia",
          title: "Marco legal de EIA en Colombia",
          content: "Es fundamental conocer el marco normativo para garantizar que tu matriz cumple con los requisitos legales:",
          subsections: [
            {
              id: "normativa-principal",
              title: "Normativa principal",
              content: "**Ley 99 de 1993**\n• Crea el Ministerio de Ambiente\n• Establece licencia ambiental como requisito\n• Define autoridades ambientales competentes\n\n**Decreto 1076 de 2015 (Decreto Único Ambiental)**\n• Libro 2, Parte 2, Título 2, Capítulo 3: Licencias\n• Define proyectos que requieren licencia\n• Establece términos de evaluación\n\n**Resolución 1402 de 2018**\n• Metodología para elaboración de EIA\n• Términos de referencia por sector\n• Contenido mínimo del estudio",
            },
            {
              id: "terminos-referencia",
              title: "Términos de referencia",
              content: "La ANLA (Autoridad Nacional de Licencias Ambientales) publica términos de referencia específicos por sector:\n\n• M-M-INA-01: Minería\n• EIA-H: Hidrocarburos\n• TdR-14: Infraestructura vial\n• TdR-7: Proyectos hidroeléctricos\n• TdR-13: Puertos marítimos\n\nDescárgalos en: www.anla.gov.co → Trámites → Términos de Referencia",
            },
          ],
        },
      ],
      conclusion: "Las matrices de evaluación de impacto ambiental son herramientas fundamentales para cualquier profesional ambiental. Ya sea que estés preparando un EIA para licenciamiento, evaluando la viabilidad ambiental de un proyecto o simplemente aprendiendo sobre gestión ambiental, dominar Leopold, Conesa y Battelle te abrirá puertas. Usa nuestro generador gratuito para crear matrices profesionales en minutos y dedica tu tiempo a lo que realmente importa: diseñar medidas efectivas para proteger el medio ambiente. ¡Comienza ahora y lleva tus EIA al siguiente nivel!",
    },
    tags: ["EIA", "matriz Leopold", "método Conesa", "Battelle", "licencia ambiental", "PMA", "evaluación ambiental", "impacto ambiental"],
    nextArticle: {
      slug: "visor-mapas-sig-ambiental",
      title: "Visualización Geoespacial de Datos Ambientales con SIG",
    },
  },

  "visor-mapas-sig-ambiental": {
    slug: "visor-mapas-sig-ambiental",
    title: "Visualización Geoespacial de Datos Ambientales: Herramientas SIG para el Monitoreo Territorial",
    category: "Nuevas Tecnologías Ambientales",
    date: "2024-12-09",
    readTime: 13,
    excerpt: "Descubre cómo los Sistemas de Información Geográfica revolucionan el monitoreo ambiental. Mapas interactivos, datos en tiempo real y herramientas gratuitas para análisis territorial.",
    heroImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Imagina poder ver en un mapa interactivo, en tiempo real, dónde hay deforestación, puntos de contaminación del agua, distribución de especies en peligro o calidad del aire en tu ciudad. Los Sistemas de Información Geográfica (SIG) hacen posible este superpoder ambiental. Ya no necesitas ser un experto cartógrafo ni tener software costoso: hoy existen herramientas web gratuitas que ponen el poder del análisis geoespacial al alcance de todos. En este artículo aprenderás cómo funcionan los SIG ambientales, qué fuentes de datos geográficos están disponibles gratuitamente y cómo usar nuestra herramienta de mapas interactivos para visualizar y analizar datos ambientales de forma profesional.",
      sections: [
        {
          id: "que-es-sig",
          title: "¿Qué es un Sistema de Información Geográfica (SIG)?",
          content: "Un SIG es una plataforma que integra hardware, software, datos y procedimientos para capturar, almacenar, manipular, analizar y visualizar información geográficamente referenciada. En el contexto ambiental, los SIG permiten responder preguntas como: ¿Dónde está ocurriendo la deforestación? ¿Qué áreas están en riesgo de inundación? ¿Cómo se distribuyen las especies de un ecosistema? La clave está en la capacidad de relacionar datos tabulares (bases de datos) con información espacial (coordenadas geográficas).",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "info",
            title: "Componentes de un SIG",
            content: "• **Hardware:** Computadoras, servidores, sensores GPS/drones\n• **Software:** QGIS, ArcGIS, Google Earth Engine, MapLibre\n• **Datos:** Capas vectoriales (puntos/líneas/polígonos) y raster (imágenes)\n• **Procesos:** Georeferenciación, consultas espaciales, análisis\n• **Personas:** Profesionales capacitados en análisis geoespacial",
          },
        },
        {
          id: "fuentes-datos",
          title: "Fuentes de datos geoespaciales gratuitas",
          content: "La revolución de los datos abiertos ha democratizado el acceso a información geográfica de calidad. Aquí están las principales fuentes que puedes usar gratuitamente:",
          subsections: [
            {
              id: "gbif-biodiversidad",
              title: "GBIF: El banco de biodiversidad global",
              content: "**GBIF (Global Biodiversity Information Facility)**\n• Base de datos: >2 mil millones de registros de especies\n• Cobertura: Global, con énfasis en América\n• Datos incluyen: Coordenadas, fecha, especie, observador\n• Acceso: API REST, portal web gbif.org\n• Casos de uso:\n  - Mapas de distribución de especies\n  - Análisis de puntos calientes de biodiversidad\n  - Identificación de corredores biológicos\n  - Evaluación de amenazas a especies endémicas\n\n**Ejemplo de uso:**\nBusca 'Panthera onca' (jaguar) en Colombia y obtén un mapa con >5,000 registros de avistamientos, atropellamientos y cámaras trampa. Útil para diseñar corredores de conservación.",
            },
            {
              id: "water-quality-portal",
              title: "Water Quality Portal: Monitoreo hídrico USA",
              content: "**Water Quality Portal (USGS/EPA)**\n• Base de datos: >400 millones de registros de calidad de agua\n• Cobertura: Estados Unidos principalmente\n• Datos incluyen: Ubicación de estaciones, parámetros fisicoquímicos históricos\n• Acceso: API WQX, descarga CSV/JSON\n• Casos de uso:\n  - Análisis de tendencias temporales de contaminación\n  - Mapas de estaciones de monitoreo\n  - Comparación de cuencas hidrográficas\n  - Validación de modelos de calidad de agua\n\n**Ejemplo:**\nDescarga 20 años de datos de DBO, OD y coliformes del río Mississippi para identificar puntos críticos de contaminación y estacionalidad.",
            },
            {
              id: "satelital-copernicus",
              title: "Imágenes satelitales: Copernicus y Landsat",
              content: "**Copernicus/Sentinel (ESA):**\n• Satélites Sentinel-1 (radar) y Sentinel-2 (óptico)\n• Resolución: 10m por píxel\n• Frecuencia: Imágenes cada 5 días\n• Descarga: scihub.copernicus.eu, Google Earth Engine\n\n**Landsat (NASA/USGS):**\n• Programa más antiguo (desde 1972)\n• Landsat 8/9 activos\n• Resolución: 30m\n• Historial completo de cambio de cobertura terrestre\n\n**Aplicaciones ambientales:**\n• NDVI (salud vegetación)\n• Detección de deforestación\n• Monitoreo de cuerpos de agua\n• Índices de quemas\n• Crecimiento urbano",
            },
            {
              id: "openstreetmap",
              title: "OpenStreetMap: El mapa colaborativo",
              content: "**OpenStreetMap (OSM)**\n• Wikipedia de los mapas\n• Comunidad de millones de editores\n• Datos: Vías, edificios, uso del suelo, hidrografía\n• Descarga: planet.osm, API Overpass\n• Licencia: Libre uso con atribución\n\n**Útil para contexto en mapas ambientales:**\n• Capa base de carreteras y poblados\n• Identificación de áreas urbanas vs rurales\n• Análisis de accesibilidad a áreas protegidas\n• Cálculo de distancias a infraestructura",
            },
          ],
        },
        {
          id: "tipos-analisis",
          title: "Tipos de análisis geoespacial ambiental",
          content: "Los SIG permiten realizar análisis sofisticados que serían imposibles sin la dimensión espacial. Aquí los más comunes en proyectos ambientales:",
          subsections: [
            {
              id: "analisis-buffer",
              title: "Áreas de influencia (Buffer)",
              content: "Crea polígonos alrededor de elementos a una distancia definida.\n\n**Ejemplo ambiental:**\n• Zona de protección de 30m alrededor de quebradas (según POT)\n• Área de influencia de 5 km de mina para EIA\n• Cobertura de 500m de estaciones de monitoreo\n\n**Aplicación:**\nSi tienes una carretera proyectada, creas un buffer de 200m a cada lado y calculas cuántas hectáreas de bosque serán afectadas.",
            },
            {
              id: "interpolacion",
              title: "Interpolación espacial",
              content: "Estima valores en ubicaciones no medidas a partir de puntos medidos.\n\n**Métodos comunes:**\n• IDW (Inverse Distance Weighting)\n• Kriging (geoestadística)\n• Splines\n\n**Ejemplo:**\nTienes 10 estaciones de calidad de aire con PM₂.₅ medido. Con interpolación generas un mapa de toda la ciudad estimando concentraciones en áreas sin estación.\n\n**Resultado:** Mapa de calor que identifica zonas críticas de contaminación.",
            },
            {
              id: "superposicion",
              title: "Superposición de capas (Overlay)",
              content: "Combina múltiples capas para análisis multi-criterio.\n\n**Ejemplo: Identificar áreas prioritarias de conservación**\n\nCapas a superponer:\n• Riqueza de especies (de GBIF)\n• Áreas protegidas existentes\n• Amenazas (minería, deforestación)\n• Conectividad ecológica\n\nResultado: Mapa de áreas prioritarias donde hay alta biodiversidad, baja protección y alta amenaza.",
            },
            {
              id: "analisis-redes",
              title: "Análisis de redes (Network)",
              content: "Calcula rutas óptimas, accesibilidad y conectividad.\n\n**Aplicaciones ambientales:**\n• Ruta óptima para patrullaje en parque nacional\n• Análisis de conectividad entre parches de bosque\n• Tiempo de respuesta a derrames ambientales\n• Distancia a centros de acopio de residuos\n\n**Ejemplo:**\nCalcula cuántos minutos tardaría un equipo de emergencias en llegar a cualquier punto de un río tras un derrame de petróleo.",
            },
          ],
        },
        {
          id: "herramienta-visor",
          title: "Visor interactivo de mapas ambientales",
          content: "Hemos desarrollado una herramienta web gratuita que te permite crear mapas interactivos profesionales sin necesidad de instalar software complejo. Ideal para estudiantes, consultores y autoridades ambientales.",
          image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "success",
            title: "Características del visor",
            content: "✅ Mapas interactivos con zoom/pan\n✅ Integración directa con GBIF y Water Quality Portal\n✅ Carga de archivos GeoJSON, KML, CSV con coordenadas\n✅ Múltiples capas base (satélite, topográfico, OpenStreetMap)\n✅ Leyendas dinámicas con simbolización personalizada\n✅ Filtros por categoría, fecha, especie, parámetro\n✅ Exportación de mapas como PNG\n✅ Sin registro, 100% gratis",
          },
          subsections: [
            {
              id: "como-usar-visor",
              title: "Cómo usar el visor paso a paso",
              content: "**Opción 1: Conectar con fuentes de datos**\n\n1. Selecciona fuente:\n   • GBIF para biodiversidad\n   • Water Quality Portal para agua\n\n2. Define búsqueda:\n   • Especie: 'Morpho peleides' (mariposa morfo)\n   • Área: Colombia, departamento Chocó\n   • Fecha: últimos 10 años\n\n3. El visor consulta la API y carga puntos automáticamente\n\n4. Visualiza:\n   • Puntos con colores por año\n   • Click en punto para ver detalles\n   • Agrupa puntos cercanos (clustering)\n\n**Opción 2: Cargar tus propios datos**\n\n1. Prepara archivo CSV:\n```\nlatitud,longitud,nombre,categoria,valor\n4.6097,-74.0817,Estación Kennedy,PM2.5,35\n4.7110,-74.0721,Estación Suba,PM2.5,28\n```\n\n2. Carga archivo en el visor\n\n3. El sistema detecta coordenadas automáticamente\n\n4. Personaliza:\n   • Color por categoría\n   • Tamaño de símbolo por valor\n   • Etiquetas con información",
            },
            {
              id: "casos-uso-visor",
              title: "Casos de uso del visor",
              content: "**1. Mapa de distribución de especie amenazada**\n• Busca 'Tremarctos ornatus' (oso de anteojos) en GBIF\n• Superpón capa de áreas protegidas (GeoJSON)\n• Identifica registros fuera de protección → acción: proponer ampliación\n\n**2. Red de monitoreo de calidad de agua**\n• Carga CSV con ubicación y parámetros de tus estaciones\n• Codifica por color según cumplimiento normativo\n• Genera mapa para informe a autoridad ambiental\n\n**3. Línea base ambiental para EIA**\n• Carga polígono del área de influencia del proyecto\n• Consulta GBIF: especies en la zona\n• Carga capas de ecosistemas, cuencas, áreas protegidas\n• Exporta mapa para capítulo de línea base del EIA",
            },
          ],
        },
        {
          id: "software-sig",
          title: "Software SIG recomendado por nivel",
          content: "Según tu experiencia y presupuesto, estas son las mejores opciones:",
          subsections: [
            {
              id: "principiantes",
              title: "Nivel principiante (sin experiencia)",
              content: "**Google My Maps**\n• Gratis, en línea\n• Interfaz intuitiva\n• Limitado a funciones básicas\n• Ideal para: Ubicar puntos, trazar rutas simples\n\n**QGIS Web Client**\n• Visualizador web de proyectos QGIS\n• No requiere instalación\n• Solo visualización e interacción básica\n\n**Nuestra herramienta Visor de Mapas Ambientales**\n• Diseñada específicamente para datos ambientales\n• Sin curva de aprendizaje\n• Integración con APIs científicas",
            },
            {
              id: "intermedio",
              title: "Nivel intermedio (estudiantes, técnicos)",
              content: "**QGIS (Quantum GIS)**\n• ✅ Gratis y de código abierto\n• ✅ Muy completo (casi todo lo de ArcGIS)\n• ✅ Plugins para análisis específicos\n• ✅ Comunidad activa en español\n• Descarga: qgis.org\n\n**Recomendado si:**\n• Vas a hacer análisis espaciales complejos\n• Necesitas editar datos geográficos\n• Quieres generar mapas para publicaciones\n• Presupuesto limitado\n\n**Plugins ambientales útiles:**\n• Profile Tool (perfiles topográficos)\n• Geospatial Data Abstraction Library\n• Semi-Automatic Classification (imágenes satelitales)",
            },
            {
              id: "avanzado",
              title: "Nivel avanzado (profesionales, empresas)",
              content: "**ArcGIS Pro (Esri)**\n• Software comercial líder ($$$)\n• Integración total con servicios en la nube\n• Herramientas avanzadas de modelado\n• Soporte técnico profesional\n• Ideal para empresas consultoras\n\n**Google Earth Engine**\n• Plataforma en la nube para big data geoespacial\n• Gratis para investigación y educación\n• Catálogo petabyte de imágenes satelitales\n• Requiere programación (JavaScript o Python)\n• Ideal para análisis de cambio de cobertura a gran escala\n\n**R con paquetes espaciales**\n• sf, raster, terra, leaflet\n• Análisis estadístico + SIG en un solo ambiente\n• Reproducibilidad científica\n• Curva de aprendizaje alta",
            },
          ],
        },
        {
          id: "proyectos-reales",
          title: "Proyectos ambientales reales con SIG",
          content: "Para inspirarte, aquí hay ejemplos de proyectos ambientales exitosos que usaron SIG:",
          subsections: [
            {
              id: "corredor-biologico",
              title: "Diseño de corredor biológico para jaguar (WWF)",
              content: "**Problema:**\nPoblaciones fragmentadas de jaguar en Centroamérica sin conectividad genética.\n\n**Solución con SIG:**\n• Mapeo de registros de jaguar (cámaras trampa + GBIF)\n• Análisis de cobertura vegetal (Landsat histórico)\n• Modelado de idoneidad de hábitat\n• Identificación de puntos de cruce de carreteras\n• Diseño de corredores mínimos de 5 km de ancho\n\n**Resultado:**\nMesoamerican Biological Corridor: 1,000 km de México a Panamá, protegiendo no solo jaguares sino cientos de especies.",
            },
            {
              id: "deforestacion-tiempo-real",
              title: "Alertas de deforestación en tiempo real (Global Forest Watch)",
              content: "**Problema:**\nDeforestación ilegal en Amazonía difícil de detectar y frenar a tiempo.\n\n**Solución con SIG:**\n• Procesamiento automático de imágenes Sentinel-2 diarias\n• Algoritmos ML para detectar pérdida de cobertura\n• Alertas GLAD (Global Land Analysis & Discovery)\n• Mapas públicos en globalforestwatch.org\n• Notificaciones a autoridades en <72 horas\n\n**Resultado:**\nReducción de 31% en deforestación en áreas monitoreadas (estudio 2021). Herramienta usada por 180 países.",
            },
          ],
        },
      ],
      conclusion: "Los Sistemas de Información Geográfica son el microscopio del siglo XXI para entender nuestro planeta. Ya no son herramientas exclusivas de expertos: hoy cualquier persona con curiosidad y acceso a internet puede crear mapas ambientales profesionales. Usa nuestra herramienta gratuita para comenzar a visualizar datos ambientales, explora las fuentes de datos abiertos y atrévete a hacer tus propios análisis. El primer paso para proteger el medio ambiente es saber dónde están los problemas. Los mapas te lo mostrarán. ¿Estás listo para ver el mundo con otros ojos?",
    },
    tags: ["SIG", "mapas ambientales", "QGIS", "GBIF", "análisis espacial", "geoespacial", "monitoreo ambiental", "datos abiertos"],
    nextArticle: {
      slug: "navegador-normas-ambientales",
      title: "Guía de Normatividad Ambiental en Colombia",
    },
  },

  "navegador-normas-ambientales": {
    slug: "navegador-normas-ambientales",
    title: "Guía de Normatividad Ambiental en Colombia: Agua, Aire, Vertimientos y Residuos Sólidos",
    category: "Normatividad Ambiental",
    date: "2024-12-09",
    readTime: 11,
    excerpt: "Navega fácilmente por la normatividad ambiental colombiana. Resoluciones, decretos y límites permisibles organizados por dominio con herramienta de consulta gratuita.",
    heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "La normatividad ambiental colombiana es extensa y compleja: cientos de decretos, resoluciones, acuerdos y sentencias que regulan desde la calidad del agua potable hasta la gestión de residuos peligrosos. Para empresas, consultores y autoridades ambientales, mantenerse actualizado y encontrar rápidamente la norma correcta es un desafío constante. ¿Cuál es el límite permisible de DBO en vertimientos? ¿Qué dice la Resolución 2254 sobre calidad del aire? ¿Cuándo entró en vigencia el nuevo código de colores para residuos? En este artículo encontrarás una guía organizada de la normatividad ambiental colombiana por dominio, con acceso a nuestra herramienta gratuita que funciona como un buscador inteligente de normas.",
      sections: [
        {
          id: "marco-legal",
          title: "Marco legal ambiental de Colombia",
          content: "El sistema normativo ambiental colombiano se basa en una jerarquía de leyes, decretos, resoluciones y acuerdos. La pirámide normativa va desde la Constitución Política hasta las resoluciones técnicas específicas.",
          callout: {
            type: "info",
            title: "Jerarquía normativa ambiental",
            content: "1. **Constitución Política 1991** (Art. 79-80: derecho ambiente sano)\n2. **Leyes** (Ley 99/1993: crea MinAmbiente y SINA)\n3. **Decretos** (Decreto 1076/2015: Decreto Único Ambiental)\n4. **Resoluciones** (técnicas específicas por dominio)\n5. **Acuerdos** (autoridades ambientales regionales)\n6. **Sentencias** (Corte Constitucional, jurisprudencia)",
          },
        },
        {
          id: "agua-potable",
          title: "Normatividad de Agua Potable",
          content: "La calidad del agua para consumo humano está regulada principalmente por la Resolución 2115 de 2007, que establece características físicas, químicas y microbiológicas y el IRCA.",
          subsections: [
            {
              id: "resolucion-2115",
              title: "Resolución 2115 de 2007",
              content: "**Entidad emisora:** Ministerio de Protección Social y Ambiente\n**Objeto:** Características, instrumentos básicos y frecuencias del sistema de control y vigilancia para la calidad del agua potable\n\n**Parámetros regulados (22 total):**\n• Microbiológicos: E. coli, coliformes totales\n• Físicos: pH, turbiedad, color, cloro residual\n• Químicos: dureza, alcalinidad, fluoruros, cloruros, nitratos\n• Metales: aluminio, hierro, manganeso\n• Sustancias tóxicas: plomo, arsénico, mercurio, cadmio\n\n**Índice IRCA:**\n• 0-5%: Sin riesgo\n• 5.1-14%: Riesgo bajo\n• 14.1-35%: Riesgo medio\n• 35.1-80%: Riesgo alto\n• >80%: Inviable sanitariamente",
            },
          ],
        },
        {
          id: "vertimientos",
          title: "Normatividad de Vertimientos",
          content: "La Resolución 631 de 2015 es la norma técnica más importante para vertimientos, estableciendo parámetros y límites máximos permisibles según el tipo de actividad económica.",
          subsections: [
            {
              id: "resolucion-631",
              title: "Resolución 631 de 2015",
              content: "**Ámbito:** Vertimientos puntuales a cuerpos de agua superficiales y alcantarillado\n\n**Estructura:**\n• 73 actividades económicas con límites específicos\n• Parámetros generales (pH, DBO, SST, grasas)\n• Parámetros específicos por sector (fenoles, metales pesados, hidrocarburos)\n• Análisis y reporte semestral obligatorio\n\n**Ejemplos de límites:**\n**Aguas residuales domésticas:**\n• DBO₅: 250 mg/L\n• SST: 250 mg/L\n• Grasas y aceites: 20 mg/L\n\n**Industria de alimentos:**\n• DBO₅: 800 mg/L\n• DQO: 1,500 mg/L\n• Fenoles: 0.2 mg/L",
            },
          ],
        },
        {
          id: "calidad-aire",
          title: "Normatividad de Calidad del Aire",
          content: "La Resolución 2254 de 2017 establece los niveles máximos permisibles de contaminantes en el aire ambiente y los índices de calidad del aire para Colombia.",
          subsections: [
            {
              id: "resolucion-2254",
              title: "Resolución 2254 de 2017",
              content: "**Contaminantes regulados:**\n• PM₂.₅ (Material Particulado Fino)\n• PM₁₀ (Material Particulado)\n• SO₂ (Dióxido de azufre)\n• NO₂ (Dióxido de nitrógeno)\n• O₃ (Ozono troposférico)\n• CO (Monóxido de carbono)\n\n**Niveles máximos permisibles:**\n• PM₂.₅: 25 µg/m³ (anual), 50 µg/m³ (24h)\n• PM₁₀: 50 µg/m³ (anual), 100 µg/m³ (24h)\n• NO₂: 60 µg/m³ (anual), 200 µg/m³ (1h)\n\n**Índice de Calidad del Aire (ICA):**\nEscala 0-500 con 6 categorías (Bueno a Peligroso)",
            },
          ],
        },
        {
          id: "residuos-solidos",
          title: "Normatividad de Residuos Sólidos",
          content: "La gestión integral de residuos está regulada por el Decreto 1077 de 2015 (sector vivienda) y resoluciones específicas según el tipo de residuo.",
          subsections: [
            {
              id: "decreto-1077",
              title: "Decreto 1077 de 2015 y Resolución 2184 de 2019",
              content: "**Decreto 1077/2015:**\n• Gestión integral de residuos sólidos ordinarios\n• Obligaciones de usuarios, prestadores y municipios\n• Separación en la fuente obligatoria\n\n**Resolución 2184/2019 - Código de colores:**\n• **Blanco:** Residuos aprovechables (plástico, vidrio, metal, papel)\n• **Negro:** Residuos no aprovechables (contaminados, mezclados)\n• **Verde:** Residuos orgánicos biodegradables\n\n**Sanciones por incumplimiento:**\nMultas hasta 5,000 SMMLV según gravedad",
            },
          ],
        },
        {
          id: "herramienta-navegador",
          title: "Navegador de normas ambientales",
          content: "Hemos creado una herramienta web gratuita que funciona como un buscador inteligente de normatividad ambiental colombiana. Encuentra rápidamente la norma que necesitas, consulta límites permisibles y compara requisitos.",
          callout: {
            type: "success",
            title: "Características del navegador",
            content: "✅ Base de datos actualizada de normas vigentes\n✅ Búsqueda por dominio (agua, aire, residuos, vertimientos)\n✅ Filtro por sector económico\n✅ Tabla de parámetros y límites permisibles\n✅ Descarga de textos legales completos\n✅ Comparativa entre normativas\n✅ Historial de modificaciones\n✅ Gratis y sin registro",
          },
        },
      ],
      conclusion: "Mantenerse actualizado en normatividad ambiental ya no tiene que ser una tarea titánica. Con nuestra herramienta navegador de normas, tienes acceso instantáneo a la información legal que necesitas para cumplir con tus obligaciones ambientales. Ya seas un empresario que debe reportar vertimientos, un consultor preparando una EIA o una autoridad verificando cumplimiento, esta herramienta te ahorrará horas de búsqueda. La normatividad ambiental existe para proteger nuestro entorno: conocerla es el primer paso para cumplirla.",
    },
    tags: ["normativa ambiental", "Resolución 2115", "Resolución 631", "Resolución 2254", "Decreto 1077", "límites permisibles", "legislación Colombia"],
    nextArticle: {
      slug: "analisis-correlaciones-estadistica-ambiental",
      title: "Análisis Estadístico de Datos Ambientales: Correlaciones",
    },
  },

  "analisis-correlaciones-estadistica-ambiental": {
    slug: "analisis-correlaciones-estadistica-ambiental",
    title: "Análisis Estadístico de Datos Ambientales: Correlaciones de Pearson, Spearman y Kendall",
    category: "Gestión Ambiental",
    date: "2024-12-09",
    readTime: 14,
    excerpt: "Descubre relaciones ocultas en tus datos ambientales. Guía práctica de análisis de correlaciones con herramienta gratuita para estudios científicos y gestión ambiental.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/Portal ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "¿La temperatura del agua está relacionada con la concentración de oxígeno disuelto? ¿El PM₂.₅ aumenta cuando sube la humedad? ¿La deforestación se correlaciona con pérdida de biodiversidad? Estas preguntas solo pueden responderse con análisis estadístico riguroso. El análisis de correlaciones es una herramienta fundamental para descubrir relaciones entre variables ambientales, validar hipótesis y fundamentar decisiones de gestión. En este artículo aprenderás cuándo usar Pearson, Spearman o Kendall, cómo interpretar correctamente los resultados y cómo usar nuestra herramienta gratuita para hacer análisis profesionales sin necesidad de ser experto en estadística.",
      sections: [
        {
          id: "que-es-correlacion",
          title: "¿Qué es una correlación y qué NO es?",
          content: "Una correlación mide la fuerza y dirección de la relación entre dos variables. El coeficiente de correlación (r) varía de -1 a +1, donde +1 indica relación positiva perfecta, -1 relación negativa perfecta y 0 sin relación.",
          callout: {
            type: "warning",
            title: "¡Correlación NO implica causación!",
            content: "Este es el error más común en análisis ambiental. Si temperatura y helados se correlacionan, NO significa que el calor cause helados. Ambos pueden estar causados por una tercera variable (verano). Siempre busca el mecanismo causal subyacente.",
          },
        },
        {
          id: "pearson",
          title: "Coeficiente de Pearson: Relaciones lineales",
          content: "El coeficiente de correlación de Pearson (r) mide relaciones lineales entre variables cuantitativas continuas. Es el más común pero tiene requisitos estrictos.",
          subsections: [
            {
              id: "cuando-pearson",
              title: "Cuándo usar Pearson",
              content: "✅ **Usa Pearson cuando:**\n• Ambas variables son cuantitativas continuas\n• La relación es lineal (gráfico de dispersión forma línea recta)\n• Datos siguen distribución normal (o n>30)\n• No hay valores atípicos extremos\n\n**Ejemplo ambiental:**\nTemperatura del agua vs Oxígeno disuelto\n→ Relación lineal negativa: a mayor temperatura, menor OD",
            },
            {
              id: "interpretacion-pearson",
              title: "Interpretación de r de Pearson",
              content: "**Magnitud de la correlación:**\n• |r| < 0.3: Débil\n• 0.3 ≤ |r| < 0.7: Moderada\n• |r| ≥ 0.7: Fuerte\n\n**Signo:**\n• r > 0: Relación positiva (suben juntas)\n• r < 0: Relación negativa (una sube, otra baja)\n\n**Ejemplo:**\nr = -0.85 entre temperatura (°C) y OD (mg/L)\n→ Correlación **fuerte negativa**\n→ Por cada 1°C de aumento, el OD disminuye ~0.5 mg/L",
            },
          ],
        },
        {
          id: "spearman",
          title: "Coeficiente de Spearman: Relaciones monótonas",
          content: "El coeficiente de Spearman (ρ o rs) es la versión no paramétrica de Pearson. Mide relaciones monótonas (no necesariamente lineales) usando rangos en lugar de valores absolutos.",
          subsections: [
            {
              id: "cuando-spearman",
              title: "Cuándo usar Spearman",
              content: "✅ **Usa Spearman cuando:**\n• La relación no es lineal pero es monótona (siempre sube o siempre baja)\n• Datos ordinales (escalas de Likert, rangos)\n• Distribución no normal\n• Hay valores atípicos que distorsionarían Pearson\n\n**Ejemplo ambiental:**\nÍndice de biodiversidad vs Área protegida\n→ Relación monótona pero no lineal (logarítmica)\n→ Spearman capta mejor la tendencia que Pearson",
            },
          ],
        },
        {
          id: "kendall",
          title: "Tau de Kendall: Robustez con muestras pequeñas",
          content: "El tau de Kendall (τ) es otra medida no paramétrica similar a Spearman pero más robusta con muestras pequeñas y mejor para detectar patrones en series temporales.",
          subsections: [
            {
              id: "cuando-kendall",
              title: "Cuándo usar Kendall",
              content: "✅ **Usa Kendall cuando:**\n• Muestra pequeña (n < 30)\n• Muchos empates (valores repetidos)\n• Series temporales con tendencias\n• Necesitas mayor robustez estadística\n\n**Ventaja:**\nEl tau de Kendall es menos sensible a errores de medición que Spearman.",
            },
          ],
        },
        {
          id: "herramienta-analisis",
          title: "Herramienta de análisis de correlaciones",
          content: "Nuestra calculadora gratuita te permite analizar correlaciones entre múltiples variables ambientales sin necesidad de instalar software estadístico complejo como R o SPSS.",
          callout: {
            type: "success",
            title: "Características",
            content: "✅ Calcula Pearson, Spearman y Kendall simultáneamente\n✅ Matriz de correlaciones con mapa de calor\n✅ Gráficos de dispersión interactivos\n✅ Pruebas de significancia (p-valor)\n✅ Interpretación automática de resultados\n✅ Exportación a Excel/CSV\n✅ Integración con APIs de datos globales\n✅ Gratis, sin registro",
          },
        },
      ],
      conclusion: "El análisis de correlaciones es tu aliado para descubrir patrones ocultos en datos ambientales. Ya sea que estés escribiendo un paper científico, preparando un informe de monitoreo o explorando relaciones en tu tesis, entender Pearson, Spearman y Kendall te dará superpoderes analíticos. Usa nuestra herramienta gratuita para hacer análisis profesionales en minutos y dedica tu tiempo a lo que realmente importa: interpretar los resultados y tomar decisiones basadas en evidencia. Los datos están ahí, esperando revelar sus secretos. ¿Listo para descubrirlos?",
    },
    tags: ["estadística ambiental", "correlación Pearson", "Spearman", "Kendall", "análisis de datos", "monitoreo ambiental", "ciencia de datos"],
    nextArticle: {
      slug: "calculadora-irca-calidad-agua",
      title: "Cómo Calcular el IRCA y Otros Índices de Calidad del Agua",
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
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
      bio: "Ingeniero Químico · M. Sc. en Ingeniería Ambiental · Docente universitario · Desarrollador en IA, redes neuronales y optimización",
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
      name: "Pablo Cubides",
      avatar: "/images/Portal IA/Autor/Pablo Cubides.png",
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

// Helper function to get article by slug and portal
export function getArticle(
  portal: "ia" | "ambiental",
  slug: string,
): BlogArticle | null {
  const existingArticles = portal === "ia" ? IA_ARTICLES : AMBIENTAL_ARTICLES;
  const newArticles = portal === "ia" ? NEW_IA_ARTICLES : NEW_AMBIENTAL_ARTICLES;
  const allArticles = { ...existingArticles, ...newArticles };
  return allArticles[slug] || null;
}

// Helper function to get all articles from a portal
export function getAllArticles(portal: "ia" | "ambiental"): BlogArticle[] {
  const existingArticles = portal === "ia" ? IA_ARTICLES : AMBIENTAL_ARTICLES;
  const newArticles = portal === "ia" ? NEW_IA_ARTICLES : NEW_AMBIENTAL_ARTICLES;
  const allArticles = { ...existingArticles, ...newArticles };
  return Object.values(allArticles);
}

// Helper function to generate table of contents
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
