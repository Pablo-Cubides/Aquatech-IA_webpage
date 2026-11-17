import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde blog-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "navegador-normas-ambientales",
  title: "Guía de Normatividad Ambiental en Colombia: Agua, Aire, Vertimientos y Residuos Sólidos",
  category: "Normatividad Ambiental",
  date: "2024-12-09",
  readTime: 4,
  excerpt: "Guía técnica sobre la legislación ambiental en Colombia. Parámetros clave de las resoluciones 2115, 631 y 2254 para cumplimiento legal y gestión técnica.",
  heroImage: "/images/portal-ambiental/blog/normatividad-ambiental-guia.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
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
        image: "/images/portal-ambiental/blog/normatividad-ambiental-guia.jpg",
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
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Qué norma regula el agua potable y cómo se mide su cumplimiento?",
            content: "La Resolución 2115 de 2007, que define el sistema de control y vigilancia. El cumplimiento se mide con el IRCA. Entre los parámetros críticos están la ausencia de E. coli y coliformes totales (0 UFC/100 ml), una turbiedad de 2 UNT o menos y un pH entre 6,5 y 9,0.",
          },
          {
            id: "faq-2",
            title: "¿Qué regula la Resolución 631 de 2015?",
            content: "Regula los vertimientos puntuales a cuerpos de agua superficiales y al alcantarillado, con límites por sector productivo (8 sectores y 73 actividades). Para aguas residuales domésticas fija DBO₅ ≤ 90 mg/L, DQO ≤ 180 mg/L y SST ≤ 90 mg/L.",
          },
          {
            id: "faq-3",
            title: "¿Cuáles son los límites de calidad del aire de la Resolución 2254 de 2017?",
            content: "PM10: 50 µg/m³ anual y 100 µg/m³ en 24 horas. PM2.5: 25 µg/m³ anual y 50 µg/m³ en 24 horas. Gases: NO₂ hasta 60 µg/m³ y SO₂ hasta 50 µg/m³.",
          },
          {
            id: "faq-4",
            title: "¿Cuál es la norma marco de la gestión ambiental en Colombia?",
            content: "El Decreto Único Reglamentario 1076 de 2015. Las resoluciones técnicas definen los límites de operación, y conocer la jerarquía normativa permite evitar sanciones que pueden superar los 5.000 SMMLV.",
          },
        ],
      },
    ],
    conclusion: "Mantenerse al día con la normatividad ambiental es un pilar estratégico para la competitividad industrial y la protección de los ecosistemas. En AquatechIA trabajamos para convertir la complejidad legal en datos accionables. Te invitamos a utilizar nuestro Navegador de Normas para asegurar que tu proyecto cumpla con los estándares más exigentes de la legislación colombiana.",
  },
  tags: ["normativa ambiental", "Resolución 2115", "Resolución 631", "Resolución 2254", "Decreto 1076", "IRCA", "gestión ambiental Colombia"],
  nextArticle: {
    slug: "tratamiento-de-aguas-residuales-industriales-en-colombia",
    title: "Tratamiento de Aguas Residuales Industriales en Colombia: Normativa, Reúso y Claves de Eficiencia",
  },
});

export default article;
