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
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "¿Alguna vez te has preguntado qué tan segura es el agua que bebes? Los índices de calidad del agua son herramientas científicas que transforman datos complejos de laboratorio en un solo número que cualquiera puede entender. En Colombia, el IRCA (Índice de Riesgo de Calidad del Agua) es la herramienta oficial para evaluar el agua potable, pero también existen otros índices internacionales como el WQI y el DWQI. En este artículo, te mostraremos cómo funcionan estos índices, cómo calcularlos paso a paso y cómo usar nuestra herramienta gratuita para hacerlo automáticamente.",
      sections: [
        {
          id: "que-es-irca",
          title: "¿Qué es el IRCA y por qué es importante?",
          content: "El Índice de Riesgo de Calidad del Agua Potable (IRCA) es un indicador establecido por la Resolución 2115 de 2007 del Ministerio de la Protección Social de Colombia. Este índice evalúa 22 parámetros fisicoquímicos y microbiológicos para determinar el nivel de riesgo del agua que consumes. El resultado es un porcentaje de 0% a 100%: entre más bajo, mejor calidad tiene el agua. Un IRCA de 0% significa agua sin riesgo, mientras que 80% o más indica que el agua es inviable sanitariamente.",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
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
          content: "Calcular estos índices manualmente puede ser complejo, pero con nuestra herramienta gratuita es instantáneo. Solo necesitas los datos de laboratorio de los parámetros básicos como turbidez (15 pts), cloro residual (15 pts) y coliformes (15 pts c/u).",
          callout: {
            type: "success",
            title: "Usa nuestra calculadora gratuita",
            content: "Ahorra tiempo y evita errores. Nuestra calculadora de índices de calidad de agua procesa tus datos en segundos y genera reportes profesionales. \n\n [🚀 Ir a la Calculadora de Índices de Calidad de Agua](/ambiental/herramientas/indice-calidad-agua)",
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
      avatar: "/images/portal-ambiental/autor/Pablo Cubides.jpg",
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
          content: "Hemos creado una herramienta web gratuita que te permite calcular los 5 índices principales (US AQI, ICA Colombia, IBOCA, EAQI, OMS) a partir de tus datos de monitoreo.",
          callout: {
            type: "success",
            title: "¡Calcula tu índice ahora!",
            content: "Cruza tus datos de PM2.5, PM10 y gases contaminantes con los estándares internacionales. \n\n [🚀 Ir al Calculador de Calidad del Aire](/ambiental/herramientas/indice-calidad-aire)",
          },
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
    excerpt: "Domina las metodologías de EIA para el licenciamiento ambiental. Análisis técnico de Leopold, Conesa y Battelle-Columbus con casos prácticos.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "La Evaluación de Impacto Ambiental (EIA) es el núcleo técnico de cualquier trámite de licenciamiento. No se trata solo de cumplir un requisito legal; es un ejercicio de predicción científica sobre cómo un proyecto alterará su entorno. En este artículo profundizamos en las metodologías más aceptadas por autoridades como la ANLA en Colombia, desde la clásica matriz de **Leopold** hasta el sofisticado método de **Conesa** y el enfoque cuantitativo de **Battelle-Columbus**.",
      sections: [
        {
          id: "metodologia-comparada",
          title: "Leopold vs Conesa vs Battelle",
          content: "Elegir la metodología correcta depende de la fase del proyecto y el nivel de detalle requerido. A continuación, desglosamos sus bases técnicas:",
          subsections: [
            {
              id: "leopold-tecnico",
              title: "1. Matriz de Leopold: El cribado inicial",
              content: "Diseñada originalmente con 100 acciones y 88 factores, esta matriz causa-efecto evalúa cada celda con:\n• **Magnitud (M):** Escala de -10 a +10. Representa la extensión o escala de la alteración.\n• **Importancia (I):** Escala de 1 a 10. Representa el peso relativo del factor afectado en el ecosistema local.\n• **Uso:** Ideal para diagnósticos ambientales de alternativas (DAA) donde se requiere una visión rápida de los puntos críticos.",
            },
            {
              id: "conesa-tecnico",
              title: "2. Método de Conesa: Valoración Integral",
              content: "Es el estándar en Estudios de Impacto Ambiental debido a su fórmula de **Importancia (I)** que integra 11 atributos técnicos para asignar un valor numérico preciso:\n\n**I = ± [3IN + 2EX + MO + PE + RV + SI + AC + EF + PR + MC]**\n\n• **IN (Intensidad):** Grado de incidencia.\n• **EX (Extensión):** Área de influencia física.\n• **MO (Momento):** Tiempo entre la acción y la aparición del efecto.\n• **PE (Persistencia):** Tiempo que permanecería el efecto.\n• **RV (Reversibilidad):** Capacidad del medio de retornar a su estado inicial.\n• **Otros:** Sinergia, Acumulación, Efecto, Periodicidad y Recuperabilidad.\n\n**Interpretación:** I < 25 (Irrelevante), 25-50 (Moderado), 50-75 (Severo), > 75 (Crítico).",
            },
          ],
        },
        {
          id: "battelle-columbus",
          title: "Battelle-Columbus: Cuantificación Pura",
          content: "Diseñado para proyectos hídricos, este sistema utiliza **Unidades de Impacto Ambiental (UIA)** y una estructura jerárquica de 4 niveles: 4 Categorías, 18 Componentes y 78 Parámetros ambientales. Se basa en funciones de transformación que convierten medidas físicas (ej. mg/L de DBO) en una escala de 0 a 1 de calidad ambiental. Incorpora un sistema de 'banderas rojas' para alertar sobre riesgos críticos que exceden los límites de absorción del medio.",
        },
        {
          id: "herramienta-matrices",
          title: "Genera tus Matrices con AquatechIA",
          content: "Sabemos que el cálculo de matrices de Conesa para cientos de interacciones puede ser propenso a errores. Por ello, hemos integrado un generador automatizado en nuestra plataforma que sigue rigurosamente esta metodología.",
          callout: {
            type: "success",
            title: "Herramienta Profesional",
            content: "Nuestro generador te permite calificar atributos, calcular la importancia automáticamente y exportar la matriz lista para incluir en tu EIA. \n\n [🚀 Ir al Generador de Matrices de Impacto](/ambiental/herramientas/generador-matrices)",
          },
        },
      ],
      conclusion: "Las matrices de impacto ambiental no son tablas estáticas; son modelos dinámicos de riesgo territorial. Al utilizar metodologías rigurosas como Conesa y herramientas de automatización, garantizamos que los Planes de Manejo Ambiental (PMA) sean sólidos frente a la revisión de la autoridad ambiental.",
    },
    tags: ["EIA", "Leopold", "Conesa", "Battelle", "licencia ambiental", "PMA", "impacto ambiental", "ANLA"],
    nextArticle: {
      slug: "visualizacion-geoespacial-sig-monitoreo",
      title: "Visualización Geoespacial de Datos Ambientales con SIG",
    },
  },

  "visor-mapas-sig-ambiental": {
    slug: "visor-mapas-sig-ambiental",
    title: "Visualización Geoespacial de Datos Ambientales: Herramientas SIG para el Monitoreo Territorial",
    category: "Geotecnología",
    date: "2024-12-09",
    readTime: 14,
    excerpt: "Domina el análisis espacial para la gestión ambiental. Guía técnica sobre sensores Sentinel, índices NDVI/NDWI y el estándar MAGNA-SIRGAS para Colombia.",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "Imagina poder ver en un mapa interactivo, en tiempo real, dónde hay deforestación, puntos de contaminación del agua, distribución de especies en peligro o calidad del aire en tu ciudad. Los Sistemas de Información Geográfica (SIG) hacen posible este superpoder ambiental. En la era del Big Data ambiental, la capacidad de ver datos en un mapa no es suficiente; necesitamos entender la dinámica del territorio a través de sensores remotos y modelos geoestadísticos.",
      sections: [
        {
          id: "que-es-sig",
          title: "¿Qué es un Sistema de Información Geográfica (SIG)?",
          content: "Un SIG es una plataforma que integra hardware, software, datos y procedimientos para capturar, almacenar, manipular, analizar y visualizar información geográficamente referenciada. Es la herramienta definitiva para relacionar datos tabulares con ubicación espacial.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "info",
            title: "Componentes de un SIG",
            content: "• **Hardware:** Computadoras, servidores, sensores GPS/drones\n• **Software:** QGIS, ArcGIS, Google Earth Engine, MapLibre\n• **Datos:** Capas vectoriales y raster\n• **Personas:** Profesionales capacitados en análisis geoespacial",
          },
        },
        {
          id: "sensores-remotos",
          title: "Monitoreo Satelital: Más allá de lo Visible",
          content: "Los sensores remotos nos permiten 'ver' en bandas del espectro electromagnético que el ojo humano ignora. El programa Copernicus de la ESA con sus satélites **Sentinel-2** ha democratizado el acceso a imágenes de 10m de resolución, esenciales para el monitoreo ambiental continuo.",
          subsections: [
            {
              id: "indices-espectrales",
              title: "Índices NDVI y NDWI",
              content: "• **NDVI (Vegetación):** Utiliza las bandas Roja e Infrarrojo Cercano para medir la salud fotosintética.\n• **NDWI (Agua):** Crucial para hidrología, permite diferenciar cuerpos de agua de vegetación y suelo desnudo.\n• **Impacto:** Con estos índices podemos detectar estrés hídrico en cultivos o retroceso de glaciares sin salir al campo.",
            },
          ],
        },
        {
          id: "geodesia-colombia",
          title: "Precisión en Colombia: MAGNA-SIRGAS",
          content: "Todo análisis geoespacial en Colombia debe regirse por el sistema **MAGNA-SIRGAS**. El uso de proyecciones obsoletas como el Datum Bogotá puede generar desplazamientos de cientos de metros en la ubicación de límites ambientales.",
          callout: {
            type: "info",
            title: "Dato Técnico",
            content: "Desde 2020, Colombia implementó el **Origen Nacional**, una proyección única que elimina las zonas de origen (Este-Este, Oeste-Oeste) facilitando la interoperabilidad de datos.",
          },
        },
        {
          id: "proyectos-visor",
          title: "Visualiza tus Proyectos con AquatechIA",
          content: "Nuestra plataforma ambiental cuenta con un **Visor de Mapas** diseñado para gestores ambientales. Carga tus capas GeoJSON, visualiza datos de biodiversidad de GBIF y genera mapas profesionales en segundos.",
          image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "success",
            title: "Explora el Visor SIG",
            content: "Analiza capas satelitales, coberturas de tierra e índices de vegetación en una plataforma integrada. \n\n [🌍 Abrir Visor de Mapas Ambientales](/ambiental/herramientas/visor-mapas-ambientales)",
          },
        },
      ],
      conclusion: "Los Sistemas de Información Geográfica son el microscopio del siglo XXI para entender nuestro planeta. Usa nuestra herramienta gratuita para comenzar a visualizar datos ambientales y atrévete a hacer tus propios análisis.",
    },
    tags: ["SIG", "mapas ambientales", "QGIS", "GBIF", "análisis espacial", "geoespacial", "monitoreo ambiental"],
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
    readTime: 12,
    excerpt: "Guía técnica sobre la legislación ambiental en Colombia. Parámetros clave de las resoluciones 2115, 631 y 2254 para cumplimiento legal y gestión técnica.",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2000&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "El cumplimiento normativo en Colombia no es solo una obligación legal; es la base técnica para cualquier proyecto de ingeniería sostenible. Desde la calidad del agua potable bajo la **Resolución 2115** hasta los límites de emisión atmosférica de la **Resolución 2254**, los gestores ambientales enfrentan una matriz compleja de requerimientos. En AquatechIA hemos consolidado esta guía técnica para facilitar la interpretación de los parámetros más críticos y te ofrecemos acceso a nuestro Navegador de Normas para una consulta ágil y sectorizada.",
      sections: [
        {
          id: "matriz-cumplimiento",
          title: "Estructura de la Matriz Legal Ambiental",
          content: "En Colombia, la gestión ambiental se rige por el Decreto Único Reglamentario 1076 de 2015, pero son las resoluciones técnicas las que definen los límites de operación. Comprender la jerarquía normativa permite a las industrias evitar sanciones que pueden superar los 5,000 SMMLV.",
          callout: {
            type: "warning",
            title: "Importancia Técnica",
            content: "El desconocimiento de un parámetro de vertimiento puede invalidar un permiso de uso de aguas. Siempre verifique la norma técnica específica para su CIIU (Clasificación Industrial Internacional Uniforme).",
          },
        },
        {
          id: "agua-consumo-humano",
          title: "Agua Potable: Resolución 2115 de 2007",
          content: "Esta resolución define el sistema de control y vigilancia para la calidad del agua de consumo humano. El cumplimiento se mide a través del IRCA (Índice de Riesgo de la Calidad del Agua).",
          subsections: [
            {
              id: "parametros-potable",
              title: "Parámetros Críticos y Límites",
              content: "• **Microbiológicos:** Ausencia total de *E. coli* y Coliformes Totales (0 UFC/100ml).\n• **Físicos:** Turbiedad ≤ 2 UNT; pH entre 6.5 y 9.0.\n• **Químicos:** Cloro Residual Libre entre 0.3 y 2.0 mg/L; Dureza Total ≤ 300 mg/L.\n• **Consecuencias:** Un IRCA superior al 5% indica un riesgo que requiere intervención inmediata de la autoridad sanitaria.",
            },
          ],
        },
        {
          id: "vertimientos-industriales",
          title: "Vertimientos Puntuales: Resolución 631 de 2015",
          content: "Regula las descargas a cuerpos de agua superficiales y alcantarillado. A diferencia de normas anteriores, la 631 establece límites por sector productivo (8 sectores, 73 actividades).",
          subsections: [
            {
              id: "limites-631",
              title: "Límites Generales vs Específicos",
              content: "• **Domésticas (ARU/ARD):** DBO₅ ≤ 90 mg/L; DQO ≤ 180 mg/L; SST ≤ 90 mg/L.\n• **Industriales:** Los límites de metales pesados (Pb, Cd, Hg) y compuestos orgánicos varían drásticamente entre el sector minero, manufacturero o agroindustrial.\n• **Urgencia:** El reporte de caracterización es obligatorio ante la CAR/ANLA para mantener la concesión de vertimientos.",
            },
          ],
        },
        {
          id: "herramienta-normas",
          title: "Gestiona tu Cumplimiento con Nuestra Herramienta",
          content: "Nuestra plataforma ambiental incluye un **Navegador de Normas Ambientales** actualizado, que te permite filtrar límites permisibles por sector y descargar los textos legales completos.",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
          callout: {
            type: "success",
            title: "¡Consulta las normas ahora!",
            content: "Simplifica tu matriz legal. Revisa parámetros, límites y vigencias en segundos con nuestro buscador especializado. \n\n [👉 Ir al Navegador de Normas Ambientales](/ambiental/herramientas/normas-ambientales)",
          },
        },
        {
          id: "aire-y-atmosfera",
          title: "Calidad del Aire: Resolución 2254 de 2017",
          content: "Establece la norma de calidad del aire ambiente (inmisión) para proteger la salud. Se enfoca en contaminantes criterio que afectan el sistema respiratorio.",
          subsections: [
            {
              id: "niveles-aire",
              title: "Material Particulado y Gases",
              content: "• **PM10:** 50 µg/m³ (Anual); 100 µg/m³ (24h).\n• **PM2.5:** 25 µg/m³ (Anual); 50 µg/m³ (24h).\n• **Gases:** NO₂ ≤ 60 µg/m³; SO₂ ≤ 50 µg/m³.\n• **Enfoque:** La superación de estos niveles activa los Protocolos para el Manejo de Episodios Críticos de Contaminación del Aire.",
            },
          ],
        },
      ],
      conclusion: "Mantenerse al día con la normatividad ambiental es un pilar estratégico para la competitividad industrial y la protección de los ecosistemas. En AquatechIA trabajamos para convertir la complejidad legal en datos accionables. Te invitamos a utilizar nuestro Navegador de Normas para asegurar que tu proyecto cumpla con los estándares más exigentes de la legislación colombiana.",
    },
    tags: ["normativa ambiental", "Resolución 2115", "Resolución 631", "Resolución 2254", "Decreto 1076", "IRCA", "gestión ambiental Colombia"],
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
    excerpt: "Descubre relaciones ocultas en tus datos ambientales. Guía técnica sobre correlaciones para estudios científicos y gestión avanzada del recurso hídrico y aire.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
    author: {
      name: "Pablo Cubides",
      avatar: "/images/portal-ambiental/autor/Pablo Cubides.jpg",
      bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
    },
    content: {
      introduction: "¿La temperatura del agua está relacionada con la concentración de oxígeno disuelto? ¿El PM2.5 aumenta cuando sube la humedad? Estas preguntas no pueden responderse por intuición; requieren un rigor estadístico que valide la significancia de las relaciones. En la gestión ambiental moderna, donde manejamos grandes volúmenes de datos provenientes de redes de sensores IoT, imágenes satelitales (GEE) o encuestas socio-ambientales (KoboToolbox), el análisis de correlaciones se vuelve la brújula para identificar impulsores de degradación o éxito en la restauración. En este artículo profundizamos en los coeficientes de Pearson, Spearman y Kendall, sus aplicaciones técnicas y cómo nuestra herramienta interna facilita estos cálculos complejos.",
      sections: [
        {
          id: "importancia-monitoreo",
          title: "La Correlación en el Monitoreo Ambiental",
          content: "En ciencias ambientales, rara vez una variable actúa de forma aislada. La correlación nos permite entender la interdependencia entre contaminantes, factores climáticos y salud de ecosistemas. Medir la fuerza (magnitud) y la dirección (positiva o negativa) es el primer paso para construir modelos predictivos confiables.",
          callout: {
            type: "info",
            title: "Dato Clave",
            content: "Una correlación de r=0.8 entre dos contaminantes indica que probablemente comparten la misma fuente de emisión o proceso de transporte. Identificar esto ahorra miles de dólares en estudios de caracterización.",
          },
        },
        {
          id: "comparativa-coeficientes",
          title: "Pearson vs Spearman vs Kendall: ¿Cuál elegir?",
          content: "No todos los datos ambientales se comportan igual. Elegir el coeficiente incorrecto puede llevar a conclusiones erróneas sobre el impacto ambiental.",
          subsections: [
            {
              id: "pearson-tecnico",
              title: "1. Pearson (Paramétrico)",
              content: "Ideal para relaciones lineales puras entre variables continuas (ej: pH vs Alcalinidad). Requiere que los datos sigan una distribución normal y que no existan valores atípicos significativos (outliers), los cuales son muy comunes en sensores ambientales defectuosos.",
            },
            {
              id: "spearman-tecnico",
              title: "2. Spearman (No paramétrico)",
              content: "Basado en rangos. Es robusto ante valores atípicos y detecta relaciones no lineales pero monótonas (siempre crecientes o decrecientes). Es perfecto para variables de biodiversidad o percepción social donde los datos no son perfectamente normales.\n\n**Usa Spearman cuando:**\n• Datos ordinales (escalas de Likert, rangos)\n• Distribución no normal\n• Hay valores atípicos que distorsionarían Pearson\n\n**Ejemplo ambiental:**\nÍndice de biodiversidad vs Área protegida\n→ Relación monótona pero no lineal (logarítmica)\n→ Spearman capta mejor la tendencia que Pearson",
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
          content: "Nuestra calculadora gratuita te permite analizar correlaciones entre múltiples variables ambientales sin necesidad de instalar software estadístico complejo.",
          callout: {
            type: "success",
            title: "Realiza tu análisis técnico",
            content: "Calcula Pearson, Spearman y Kendall simultáneamente con interpretación de p-valor. \n\n [📊 Ir a la Herramienta de Correlaciones](/ambiental/herramientas/analisis-correlaciones)",
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
