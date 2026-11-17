import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "cerebro-digital-gestion-ambiental-esg",
  title: "Más allá del papel: El Cerebro Digital de la Gestión Ambiental y ESG",
  category: "Nuevas Tecnologías Ambientales",
  date: "2025-01-02",
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
        content: "No se puede gestionar lo que no se puede mapear. Mientras QGIS sigue siendo el rey del escritorio, la nube ofrece capacidades sobrehumanas.\n\n**Google Earth Engine (GEE):** Permite procesar décadas de imágenes satelitales Sentinel y Landsat en segundos. Existe un [Manual en Español](https://github.com/google/earthengine-api) enfocado en ingenieros colombianos que facilita este aprendizaje.\n\n**Caso de uso:** Detectar cambios en el uso del suelo o estrés hídrico en una cuenca de 100,000 hectáreas sin descargar un solo gigabyte de información.",
        image: "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701247/articulos/aquatech-ambiental/google-earth-engine-ia.jpg",
      },
      {
        id: "grafana-realtime",
        title: "3. Dashboards Médicos para la Industria: Grafana",
        content: "Si gestionas una planta de tratamiento (PTAR/PTAP) o una red de sensores de aire, los reportes mensuales ya no son suficientes.\n\n**Grafana:** Es el estándar de oro para ver 'series temporales'.\n\n**Ventaja estratégica:** Conecta tus sensores IoT para ver en vivo el pH, la turbidez o el nivel de los tanques. Configura alertas a Telegram si un parámetro supera el límite legal de la Resolución 1207 o 0631.",
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
        content: "La gestión ambiental ahora habla el idioma de las finanzas. Las empresas deben reportar su Huella de Carbono y su desempeño en sostenibilidad.\n\n**Herramientas recomendadas:**\n- **OpenLCA:** Software profesional para Análisis de Ciclo de Vida (ACV) gratuito.\n- **Calculadora del MITECO:** Basada en el Real Decreto 163/2014, es un excelente referente para el cálculo de Huella de Carbono de Alcance 1 y 2.\n- **SDG Action Manager:** Para medir el impacto respecto a los Objetivos de Desarrollo Sostenible (ODS).",
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
            content: "La calculadora del MITECO, basada en el Real Decreto 163/2014. El artículo también recomienda OpenLCA para análisis de ciclo de vida.",
          },
        ],
      },
    ],
    conclusion: "Las herramientas digitales gratuitas han democratizado la ingeniería ambiental de alto nivel. Ya no dependemos de presupuestos millonarios en software; hoy dependemos de nuestra habilidad para orquestar estas tecnologías (KoboToolbox, GEE, Grafana, ESG Frameworks) en un sistema coherente que proteja el recurso hídrico y genere valor empresarial genuino.",
  },
  tags: ["KoboToolbox", "QGIS", "Google Earth Engine", "Grafana", "ESG", "IoT", "huella de carbono"],
  nextArticle: {
    slug: "desafio-agua-america-latina-rural-estadisticas",
    title: "El Desafío del Agua en la América Latina Rural: Estadísticas de una Brecha Urgente",
  },
});

export default article;
