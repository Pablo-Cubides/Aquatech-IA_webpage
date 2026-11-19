import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "cerebro-digital-gestion-ambiental-esg",
  title: "Más allá del papel: El Cerebro Digital de la Gestión Ambiental y ESG",
  category: "Nuevas Tecnologías Ambientales",
  date: "2025-01-02",
  dateModified: "2026-11-19",
  readTime: 4,
  excerpt: "Cómo KoboToolbox, Google Earth Engine y los marcos ESG cambian la consultoría ambiental: del Excel estático a ecosistemas de datos.",
  heroImage: "/images/portal-ambiental/blog/cerebro-digital-ia.png",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "La gestión ambiental moderna ha dejado de ser una tarea de oficina para convertirse en un desafío de arquitectura de datos. Laboratorios en PDF, excels de caudales y reportes climáticos dispersos son el síntoma de una gestión analógica. Hoy, el éxito de un proyecto ambiental o una estrategia ESG (Environmental, Social, and Governance) depende de nuestra capacidad para construir un *cerebro digital* que integre datos en tiempo real y análisis geoespacial avanzado.",
    sections: [
      {
        id: "recoleccion-datos",
        title: "1. Recolección en Campo: KoboToolbox y la Soberanía de Datos",
        content: "El primer paso para digitalizar la gestión ambiental es eliminar el papel en el levantamiento de información primaria.\n\n**Herramienta clave:** [KoboToolbox](https://www.kobotoolbox.org/) (Open Source).\n\n**Por qué usarla:** Permite crear formularios complejos que funcionan offline en celulares o tablets. Captura coordenadas GPS, fotos y firmas sin necesidad de internet en la selva o el campo. Al llegar a la oficina, los datos se sincronizan automáticamente con tu base de datos central.",
      },
      {
        id: "geospatial-earth-engine",
        title: "2. Mapas de Precisión: QGIS y el poder de Google Earth Engine",
        content: "No se puede gestionar lo que no se puede mapear. Mientras QGIS sigue siendo el rey del escritorio, la nube ofrece capacidades sobrehumanas.\n\n**Google Earth Engine (GEE):** Permite procesar décadas de imágenes satelitales Sentinel y Landsat en segundos. Google publica [documentación oficial de Earth Engine](https://developers.google.com/earth-engine) (en inglés), con guías para aprender a usarlo.\n\n**Caso de uso:** Detectar cambios en el uso del suelo o estrés hídrico en una cuenca de 100,000 hectáreas sin descargar un solo gigabyte de información.",
        image: "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701247/articulos/aquatech-ambiental/google-earth-engine-ia.jpg",
      },
      {
        id: "grafana-realtime",
        title: "3. Dashboards Médicos para la Industria: Grafana",
        content: "Si gestionas una planta de tratamiento (PTAR/PTAP) o una red de sensores de aire, los reportes mensuales ya no son suficientes.\n\n**Grafana:** Es el estándar de oro para ver 'series temporales'.\n\n**Ventaja estratégica:** Conecta tus sensores IoT para ver en vivo el pH, la turbidez o el nivel de los tanques. Configura alertas a Telegram si un parámetro supera el límite legal que te aplique (por ejemplo, la [Resolución 631 de 2015](https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_0631_2015.htm) para vertimientos o la [Resolución 1256 de 2021](https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_1256_2021.htm) para el uso de aguas residuales tratadas).",
        image: "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701247/articulos/aquatech-ambiental/grafana-ambiental-ia.jpg",
        callout: {
          type: "info",
          title: "Dato Clave",
          content: "Grafana te permite visualizar la 'salud' de tus procesos ambientales con la misma precisión que un monitor cardíaco en un hospital.",
        },
      },
      {
        id: "esg-carbono",
        title: "4. ESG y Calculadoras de Impacto: El lenguaje del inversor",
        content: "La gestión ambiental ahora habla el idioma de las finanzas. Las empresas deben reportar su Huella de Carbono y su desempeño en sostenibilidad.\n\n**Herramientas recomendadas:**\n- **OpenLCA:** Software profesional para Análisis de Ciclo de Vida (ACV) gratuito.\n- **Calculadora del MITECO:** Herramienta del Ministerio para la Transición Ecológica de España para la huella de carbono de organización (alcances 1 y 2). Es una buena referencia metodológica, pero está hecha para España: para Colombia usa factores de emisión colombianos. En España, el registro de huella de carbono lo regula hoy el Real Decreto 214/2025, que sustituyó al 163/2014.\n- **SDG Action Manager:** Para medir el impacto respecto a los Objetivos de Desarrollo Sostenible (ODS).",
      },
      {
        id: "flujo-recomendado-2025",
        title: "El Ecosistema Recomendado (Data Pipeline)",
        content: "La clave no es usar una herramienta, sino conectarlas en un 'pipeline' eficiente:\n\n1. **Captura:** KoboToolbox (Campo) + Sensores IoT (Planta).\n2. **Almacenamiento:** PostgreSQL o Google Sheets (Nube).\n3. **Procesamiento:** Python/R para análisis estadístico pesado.\n4. **Entrega:** Looker Studio para gerencia + Grafana para operación.",
        callout: {
          type: "success",
          title: "Recomendación de Oro",
          content: "Empieza pequeño. Digitaliza un solo formulario de inspección con KoboToolbox hoy mismo. El ahorro de tiempo te convencerá de seguir con el resto del ecosistema.",
        },
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Qué herramientas gratuitas recomienda el artículo?",
            content: "KoboToolbox para la recolección en campo (funciona sin conexión), QGIS y Google Earth Engine para mapas, Grafana para tableros en vivo, y OpenLCA y la calculadora del MITECO para análisis de ciclo de vida y huella de carbono.",
          },
          {
            id: "faq-2",
            title: "¿Cómo se conectan esas herramientas?",
            content: "En un flujo de datos de cuatro pasos: captura (KoboToolbox y sensores IoT), almacenamiento (PostgreSQL o Google Sheets), procesamiento (Python o R) y entrega (Looker Studio para la gerencia y Grafana para la operación).",
          },
          {
            id: "faq-3",
            title: "¿Para qué sirve Grafana en una planta de tratamiento?",
            content: "Para ver series temporales: conecta los sensores IoT y muestra en vivo variables como el pH, la turbidez o el nivel de los tanques, y permite configurar alertas.",
          },
          {
            id: "faq-4",
            title: "¿Qué calculadora sirve para la huella de carbono?",
            content: "La calculadora de huella de carbono de organización del MITECO de España (alcances 1 y 2), pensada para España: para Colombia conviene usar factores de emisión colombianos. El artículo también recomienda OpenLCA para análisis de ciclo de vida.",
          },
        ],
      },
    ],
    conclusion: "Las herramientas digitales gratuitas han democratizado la ingeniería ambiental de alto nivel. Ya no dependemos de presupuestos millonarios en software; hoy dependemos de nuestra habilidad para orquestar estas tecnologías (KoboToolbox, GEE, Grafana, ESG Frameworks) en un sistema coherente que proteja el recurso hídrico y genere valor empresarial genuino.",
  },
  tags: ["KoboToolbox", "QGIS", "Google Earth Engine", "Grafana", "ESG", "IoT", "huella de carbono"],
  references: [
    {
      title: "Resolución 631 de 2015: parámetros y valores límites máximos permisibles en los vertimientos puntuales a cuerpos de aguas superficiales y a los sistemas de alcantarillado público",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_0631_2015.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Norma de vertimientos citada en la sección de Grafana. Texto consultado el 19 de noviembre de 2026; esa copia registra la modificación del art. 21 por la Resolución 2659 de 2015.",
    },
    {
      title: "Resolución 1256 de 2021: por la cual se reglamenta el uso de las aguas residuales",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_1256_2021.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Deroga la Resolución 1207 de 2014 sobre el uso de aguas residuales tratadas. Texto consultado el 19 de noviembre de 2026.",
    },
    {
      title: "Documentación de Google Earth Engine",
      url: "https://developers.google.com/earth-engine",
      source: "Google",
      description: "Documentación oficial (en inglés), citada en la sección de mapas. Consultada el 19 de noviembre de 2026.",
    },
    {
      title: "Registro de huella de carbono: inscripción y calculadoras de alcance 1+2",
      url: "https://www.miteco.gob.es/es/cambio-climatico/temas/registro-huella/huella-de-carbonoinscripcion.html",
      source: "Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO), España",
      description: "Página del registro con las calculadoras de huella de carbono de organización. Consultada el 19 de noviembre de 2026.",
    },
    {
      title: "Real Decreto 214/2025, de 18 de marzo, por el que se crea el registro de huella de carbono, compensación y proyectos de absorción de dióxido de carbono",
      url: "https://www.boe.es/buscar/act.php?id=BOE-A-2025-7439",
      source: "Boletín Oficial del Estado (España), núm. 89, 12 de abril de 2025",
      description: "En vigor desde el 12 de junio de 2025; deroga el Real Decreto 163/2014. Consultado el 19 de noviembre de 2026.",
    },
  ],
  nextArticle: {
    slug: "desafio-agua-america-latina-rural-estadisticas",
    title: "El Desafío del Agua en la América Latina Rural: Estadísticas de una Brecha Urgente",
  },
});

export default article;
