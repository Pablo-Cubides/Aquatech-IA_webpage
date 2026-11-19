import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde blog-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "indices-calidad-aire-aqi-ica",
  title: "Índices de Calidad del Aire: Cómo Interpretar el AQI, ICA e IBOCA para la Toma de Decisiones",
  category: "Control de Contaminación",
  date: "2024-12-09",
  dateModified: "2026-11-19",
  readTime: 10,
  excerpt: "Aprende a leer los índices de calidad del aire más usados (AQI, ICA) y protege tu salud con información en tiempo real y herramientas gratuitas.",
  heroImage: "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701245/articulos/aquatech-ambiental/escuelas-rurales-agua-hero.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "El aire que respiramos tiene un impacto directo en nuestra salud, pero ¿cómo saber si el aire de tu ciudad está limpio o contaminado? Los índices de calidad del aire transforman mediciones complejas de contaminantes en un número simple que cualquiera puede entender. En este artículo descubrirás cómo funcionan los principales índices usados en Colombia, Estados Unidos y Europa, qué significan sus colores y números, y cómo puedes proteger tu salud tomando decisiones informadas. Además, te mostraremos nuestra herramienta gratuita para calcular estos índices instantáneamente.",
    sections: [
      {
        id: "que-son-indices-aire",
        title: "¿Qué son los índices de calidad del aire?",
        content: "Los índices de calidad del aire son herramientas que convierten las concentraciones de contaminantes atmosféricos (medidas en µg/m³ o mg/m³) en una escala numérica fácil de entender, generalmente de 0 a 500. Cada índice divide esta escala en categorías con códigos de colores que indican el nivel de riesgo para la salud: verde (bueno), amarillo (moderado), naranja (dañino para grupos sensibles), rojo (dañino), morado (muy dañino) y marrón (peligroso).",
        image: "/images/portal-ambiental/blog/escuelas-rurales-almacenamiento.jpg",
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
            content: "El AQI usa interpolación lineal entre breakpoints definidos por la EPA:\n\n**Fórmula:**\n```\nAQI = [(Ihi - Ilo) / (BPhi - BPlo)] × (Cp - BPlo) + Ilo\n```\n\nDonde:\n• Cp = concentración medida del contaminante\n• BPhi = breakpoint superior de la concentración\n• BPlo = breakpoint inferior de la concentración\n• Ihi = índice correspondiente al BPhi\n• Ilo = índice correspondiente al BPlo\n\n**Ejemplo práctico:**\nSi mides PM₂.₅ = 35.5 µg/m³ (promedio 24h):\n• Cae en el rango 35.5-55.4 µg/m³ (Dañino para grupos sensibles)\n• Breakpoints: BPlo=35.5, BPhi=55.4, Ilo=101, Ihi=150\n• AQI = [(150-101)/(55.4-35.5)] × (35.5-35.5) + 101 = **101**\n• Categoría: 🟠 Dañino para grupos sensibles",
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
            content: "Colombia cuenta con sistemas de vigilancia de la calidad del aire en las principales ciudades, y el IDEAM administra el sistema nacional de información (SISAIRE):\n\n• **Bogotá:** Red de Monitoreo de Calidad del Aire de Bogotá (RMCAB)\n• **Medellín:** Sistema SIATA\n• **Cali:** Red DAGMA\n• **Barranquilla:** Red de la CRA\n• **Cartagena:** Red EPA Cartagena\n\nPuedes consultar el ICA en tiempo real en:\n• SISAIRE (sistema nacional): sisaire.ideam.gov.co/ideam-sisaire-web\n• Aplicaciones móviles de las CAR locales\n• Nuestra herramienta con datos integrados",
          },
        ],
      },
      {
        id: "iboca-bogota",
        title: "IBOCA: El índice de Bogotá",
        content: "El Índice Bogotano de Calidad del Aire y Riesgo en Salud (IBOCA) es el índice con el que Bogotá gestiona de forma conjunta el riesgo para el ambiente y la salud según la calidad del aire. Su versión vigente la establece la Resolución Conjunta 2840 de 2023 de las Secretarías Distritales de Ambiente y de Salud, que rige desde el 16 de diciembre de 2023 y sustituyó a la Resolución Conjunta 868 de 2021.",
        callout: {
          type: "success",
          title: "Cómo funciona el IBOCA",
          content: "Según la Resolución 2840 de 2023:\n• Se calcula cada hora, para cada contaminante criterio (PM₂.₅, PM₁₀, O₃, NO₂, SO₂ y CO) en cada estación de la RMCAB\n• Se comunica el «IBOCA condicionante»: el del contaminante con las peores condiciones en cada estación\n• PM₂.₅ y PM₁₀ usan una media móvil ponderada (NowCast); O₃ y CO, una media móvil de 8 horas; NO₂ y SO₂, de 1 hora\n• Cinco niveles de riesgo (bajo, moderado, regular, alto y peligroso), con los colores verde, amarillo, naranja, rojo y morado\n• Cuatro niveles de actuación: Prevención, Alerta Fase 1, Alerta Fase 2 y Emergencia",
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
            content: "**1 - Buena (Good):**\nLa calidad del aire es buena. Disfruta tus actividades habituales al aire libre.\n\n**2 - Aceptable (Fair):**\nDisfruta tus actividades habituales al aire libre.\n\n**3 - Moderada (Moderate):**\nPoblación general: actividades habituales. Poblaciones sensibles: considera reducir las actividades intensas al aire libre si tienes síntomas.\n\n**4 - Mala (Poor):**\nPoblación general: considera reducir las actividades intensas al aire libre si tienes síntomas como ojos irritados, tos o dolor de garganta. Poblaciones sensibles: considera reducir la actividad física, sobre todo al aire libre, especialmente si tienes síntomas.\n\n**5 - Muy mala (Very poor):**\nPoblación general: considera reducir las actividades intensas al aire libre si tienes síntomas. Poblaciones sensibles: reduce la actividad física, sobre todo al aire libre, especialmente si tienes síntomas.\n\n**6 - Extremadamente mala (Extremely poor):**\nPoblación general: reduce la actividad física al aire libre. Poblaciones sensibles: evita la actividad física al aire libre.\n\n*Los nombres entre paréntesis son los de la Agencia Europea de Medio Ambiente; la traducción de los niveles y de sus mensajes es nuestra.*",
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
        image: "/images/portal-ambiental/blog/matrices-eia-metodologias.jpg",
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
            id: "acciones-danino-sensibles",
            title: "🟠 Dañino para grupos sensibles (101-150)",
            content: "**Grupos sensibles deben:**\n• Reducir esfuerzos prolongados al aire libre\n• Evitar ejercicio intenso en exteriores\n• Usar mascarilla N95 si deben salir\n• Mantener ventanas cerradas\n• Usar purificadores de aire en interiores\n\n**Población general:**\n• Puede realizar actividades normales\n• Considera reducir ejercicio muy intenso",
          },
          {
            id: "acciones-danino",
            title: "🔴 Dañino (151-200)",
            content: "**Toda la población debe:**\n• Evitar esfuerzos prolongados al aire libre\n• Reducir significativamente el ejercicio exterior\n• Usar mascarilla N95 al salir\n• Mantener espacios cerrados con purificadores\n\n**Grupos sensibles:**\n• Evitar completamente salir al exterior\n• Tener medicamentos de rescate a mano\n• Consultar médico si aparecen síntomas",
          },
          {
            id: "acciones-muy-danino-peligroso",
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
            content: "• **SISAIRE:** Sistema de Información sobre Calidad del Aire (sisaire.ideam.gov.co/ideam-sisaire-web)\n• **Aplicación Aire Bogotá:** Para iOS y Android\n• **SIATA Medellín:** www.siata.gov.co\n• **DAGMA Cali:** Reportes diarios\n• **Twitter:** @IDIGERBogota, @SIATAMedellin",
          },
          {
            id: "plataformas-internacionales",
            title: "Plataformas internacionales",
            content: "• **AirNow (USA):** www.airnow.gov\n• **WAQI:** World Air Quality Index (waqi.info)\n• **IQAir:** www.iqair.com\n• **Copernicus (EU):** atmosphere.copernicus.eu\n• **OpenAQ:** Datos abiertos globales (openaq.org)",
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
            title: "¿Qué es un índice de calidad del aire y cómo se lee?",
            content: "Convierte las concentraciones de contaminantes atmosféricos (en µg/m³ o mg/m³) en una escala numérica, generalmente de 0 a 500, dividida en categorías con color que indican el riesgo para la salud: del verde (bueno) al marrón (peligroso).",
          },
          {
            id: "faq-2",
            title: "¿En qué se diferencian el US AQI, el ICA de Colombia y el IBOCA?",
            content: "El AQI de la EPA va de 0 a 500 en seis categorías. El ICA de Colombia (Resolución 2254 de 2017) es prácticamente idéntico en escala y categorías, con algunos puntos de corte ajustados a condiciones locales. El IBOCA (Resolución Conjunta 2840 de 2023) es el índice de Bogotá: se calcula cada hora por contaminante y estación, y a cada nivel de riesgo le asocia un nivel de actuación (Prevención, Alerta Fase 1, Alerta Fase 2 o Emergencia).",
          },
          {
            id: "faq-3",
            title: "¿Qué hago si el índice marca «dañino» (151-200)?",
            content: "Según el artículo, toda la población debe evitar los esfuerzos prolongados al aire libre, reducir de forma significativa el ejercicio exterior, usar mascarilla N95 al salir y mantener los espacios cerrados con purificadores.",
          },
          {
            id: "faq-4",
            title: "¿Dónde consulto la calidad del aire en tiempo real?",
            content: "En Colombia: SISAIRE, la aplicación Aire Bogotá, SIATA en Medellín y los reportes diarios del DAGMA en Cali. A escala internacional: AirNow, WAQI, IQAir, Copernicus y OpenAQ.",
          },
          {
            id: "faq-5",
            title: "¿Cuáles son los valores guía de la OMS 2021 para PM₂.₅?",
            content: "Las Guías de Calidad del Aire 2021 fijan un promedio anual de 5 µg/m³ (antes 10) y un promedio de 24 horas de 15 µg/m³ (antes 25).",
          },
        ],
      },
    ],
    conclusion: "Los índices de calidad del aire son tu mejor aliado para proteger tu salud y la de tu familia. No esperes a sentir molestias respiratorias para tomar acción: consulta el índice diariamente, especialmente si perteneces a un grupo sensible. Usa nuestra calculadora gratuita para entender mejor los datos de tu ciudad y toma decisiones informadas sobre cuándo salir, hacer ejercicio o ventilar tu hogar. El aire limpio es un derecho, y el conocimiento es el primer paso para exigirlo.",
  },
  tags: ["AQI", "ICA Colombia", "IBOCA", "calidad del aire", "PM2.5", "salud pública", "monitoreo ambiental"],
  references: [
    {
      title: "WHO global air quality guidelines: particulate matter (PM2.5 and PM10), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide",
      url: "https://www.who.int/publications/i/item/9789240034228",
      source: "Organización Mundial de la Salud, 22 de septiembre de 2021",
      description: "Valores guía de 2021 frente a los de 2005 para PM2.5, PM10, O3, NO2, SO2 y CO (tabla de la OMS «What are the WHO Air quality guidelines?»).",
    },
    {
      title: "40 CFR Parte 58, Apéndice G: Índice de Calidad del Aire (AQI) uniforme y reporte diario, Tabla 2 (breakpoints del AQI)",
      url: "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-C/part-58/appendix-Appendix%20G%20to%20Part%2058",
      source: "EPA de Estados Unidos, Código de Regulaciones Federales (eCFR)",
      description: "Intervalos y categorías del AQI, breakpoints por contaminante, ecuación de interpolación y tiempos de promedio. Texto consultado el 19 de noviembre de 2026.",
    },
    {
      title: "European Air Quality Index",
      url: "https://airindex.eea.europa.eu/AQI/index.html",
      source: "Agencia Europea de Medio Ambiente (EEA)",
      description: "Los seis niveles del EAQI (Good a Extremely poor) y sus mensajes de salud. Consultado el 19 de noviembre de 2026; las bandas de concentración se revisaron en 2024 (ETC HE Report 2024/17).",
    },
    {
      title: "Resolución 2254 de 2017: norma de calidad del aire o nivel de inmisión",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_2254_2017.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Arts. 19 y 20 (Tablas 5 y 6: descripción general y puntos de corte del ICA). Texto consultado el 19 de noviembre de 2026; esa copia no incluye notas de vigencia.",
    },
    {
      title: "Resolución Conjunta 2840 de 2023: Índice Bogotano de Calidad del Aire y Riesgo en Salud (IBOCA)",
      url: "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=152203",
      source: "Secretarías Distritales de Ambiente y de Salud de Bogotá, texto en SISJUR (Alcaldía de Bogotá)",
      description: "Expedida el 15 de diciembre de 2023, rige desde el 16 de diciembre de 2023 y deroga la Resolución Conjunta 868 de 2021. Texto consultado el 19 de noviembre de 2026; la página no indica el estado de vigencia.",
    },
    {
      title: "SISAIRE: Subsistema de Información sobre Calidad del Aire",
      url: "https://sisaire.ideam.gov.co/ideam-sisaire-web/",
      source: "IDEAM",
      description: "Sistema nacional de información sobre calidad del aire. Consultado el 19 de noviembre de 2026.",
    },
  ],
  nextArticle: {
    slug: "matrices-eia-leopold-conesa",
    title: "Matrices de Evaluación de Impacto Ambiental: Guía Práctica",
  },
});

export default article;
