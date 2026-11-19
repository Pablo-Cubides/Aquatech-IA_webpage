import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde blog-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "navegador-normas-ambientales",
  title: "Guía de Normatividad Ambiental en Colombia: Agua, Aire, Vertimientos y Residuos Sólidos",
  category: "Normatividad Ambiental",
  date: "2024-12-09",
  dateModified: "2026-11-19",
  readTime: 4,
  excerpt: "Guía técnica sobre la legislación ambiental en Colombia. Parámetros clave de las resoluciones 2115, 631 y 2254 para cumplimiento legal y gestión técnica.",
  heroImage: "/images/portal-ambiental/blog/normatividad-ambiental-guia.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "El cumplimiento normativo en Colombia no es solo una obligación legal; es la base técnica para cualquier proyecto de ingeniería sostenible. Desde la calidad del agua potable bajo la **Resolución 2115** hasta los niveles máximos permisibles de contaminantes en el aire de la **Resolución 2254**, los gestores ambientales enfrentan una matriz compleja de requerimientos. En AquatechIA hemos consolidado esta guía técnica para facilitar la interpretación de los parámetros más críticos y te ofrecemos acceso a nuestro Navegador de Normas para una consulta ágil y sectorizada.",
    sections: [
      {
        id: "matriz-cumplimiento",
        title: "Estructura de la Matriz Legal Ambiental",
        content: "En Colombia, la gestión ambiental se rige por el Decreto Único Reglamentario 1076 de 2015, pero son las resoluciones técnicas las que definen los límites de operación. Comprender la jerarquía normativa permite a las industrias evitar sanciones: la Ley 1333 de 2009 (art. 40, modificado por la Ley 2387 de 2024) prevé multas de hasta 100.000 SMMLV.",
        callout: {
          type: "warning",
          title: "Importancia Técnica",
          content: "Siempre verifique la norma técnica específica para su CIIU (Clasificación Industrial Internacional Uniforme).",
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
            content: "• **Microbiológicos:** Ausencia total de *E. coli* y Coliformes Totales (0 UFC/100ml).\n• **Físicos:** Turbiedad ≤ 2 UNT; pH entre 6.5 y 9.0.\n• **Químicos:** Cloro Residual Libre entre 0.3 y 2.0 mg/L; Dureza Total ≤ 300 mg/L.\n• **Consecuencias:** Un IRCA superior al 5 % clasifica el agua como no apta para consumo humano (art. 15, Cuadro 7): entre 5,1 y 14 % el riesgo es bajo y susceptible de mejoramiento, y la autoridad sanitaria notifica por muestra a la persona prestadora y al COVE, y a más entidades cuanto mayor es el nivel de riesgo.",
          },
        ],
      },
      {
        id: "vertimientos-industriales",
        title: "Vertimientos Puntuales: Resolución 631 de 2015",
        content: "Regula las descargas a cuerpos de agua superficiales y alcantarillado. A diferencia de normas anteriores, la 631 establece límites específicos por sector productivo: agroindustria y ganadería, minería, hidrocarburos, alimentos y bebidas, fabricación y manufactura de bienes, y servicios y otras actividades (arts. 9 a 14 y Anexo 2).",
        subsections: [
          {
            id: "limites-631",
            title: "Límites Generales vs Específicos",
            content: "• **Aguas residuales domésticas de los prestadores del servicio de alcantarillado (art. 8):** con cargas de hasta 3.000 kg/día de DBO₅, DBO₅ ≤ 90 mg/L; DQO ≤ 180 mg/L; SST ≤ 90 mg/L. Para cargas mayores a 3.000 kg/día los límites son más estrictos (70, 150 y 70 mg/L).\n• **Industriales:** los parámetros y límites varían según el sector y la actividad (arts. 9 a 14).\n• **Reporte:** la resolución define los parámetros que cada actividad debe analizar y reportar (art. 18).",
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
            content: "• **PM10:** 50 µg/m³ (anual); 75 µg/m³ (24 h, desde el 1 de julio de 2018; la Tabla 1 traía 100).\n• **PM2.5:** 25 µg/m³ (anual); 37 µg/m³ (24 h, desde el 1 de julio de 2018; la Tabla 1 traía 50).\n• **Gases:** NO₂ 60 µg/m³ (anual) y 200 µg/m³ (1 h); SO₂ 50 µg/m³ (24 h) y 100 µg/m³ (1 h).\n• **Año 2030:** el art. 3 (Tabla 2) fija niveles ajustados que rigen desde el 1 de enero de 2030.\n• **Episodios:** el art. 10 fija además las concentraciones para declarar los niveles de prevención, alerta o emergencia.",
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
            content: "Regula los vertimientos puntuales a cuerpos de agua superficiales y al alcantarillado, con límites específicos por sector productivo. Para las aguas residuales domésticas de los prestadores del servicio de alcantarillado, con cargas de hasta 3.000 kg/día de DBO₅, fija DBO₅ ≤ 90 mg/L, DQO ≤ 180 mg/L y SST ≤ 90 mg/L.",
          },
          {
            id: "faq-3",
            title: "¿Cuáles son los límites de calidad del aire de la Resolución 2254 de 2017?",
            content: "PM10: 50 µg/m³ anual y 75 µg/m³ en 24 horas (desde el 1 de julio de 2018). PM2.5: 25 µg/m³ anual y 37 µg/m³ en 24 horas (desde el 1 de julio de 2018). Gases: NO₂ 60 µg/m³ anual y 200 µg/m³ en 1 hora; SO₂ 50 µg/m³ en 24 horas y 100 µg/m³ en 1 hora.",
          },
          {
            id: "faq-4",
            title: "¿Cuál es la norma marco de la gestión ambiental en Colombia?",
            content: "El Decreto Único Reglamentario 1076 de 2015. Las resoluciones técnicas definen los límites de operación, y conocer la jerarquía normativa permite evitar sanciones: la Ley 1333 de 2009 prevé multas de hasta 100.000 SMMLV.",
          },
        ],
      },
    ],
    conclusion: "Mantenerse al día con la normatividad ambiental es un pilar estratégico para la competitividad industrial y la protección de los ecosistemas. En AquatechIA trabajamos para convertir la complejidad legal en datos accionables. Te invitamos a utilizar nuestro Navegador de Normas para asegurar que tu proyecto cumpla con los estándares más exigentes de la legislación colombiana.",
  },
  tags: ["normativa ambiental", "Resolución 2115", "Resolución 631", "Resolución 2254", "Decreto 1076", "IRCA", "gestión ambiental Colombia"],
  references: [
    {
      title: "Resolución 2115 de 2007: características, instrumentos básicos y frecuencias del sistema de control y vigilancia de la calidad del agua para consumo humano",
      url: "https://cancilleria.gov.co/normograma/compilacion/docs/resolucion_minproteccion_2115_2007.htm",
      source: "Ministerio de la Protección Social y MAVDT, reproducida en el Normograma de la Cancillería",
      description: "Art. 2 (turbiedad), art. 4 (pH), art. 7 (dureza total), art. 9 (cloro residual libre), art. 11 (características microbiológicas) y art. 15 (clasificación del nivel de riesgo, Cuadro 7). Texto consultado el 19 de noviembre de 2026; esa copia no incluye notas de vigencia.",
    },
    {
      title: "Resolución 631 de 2015: parámetros y valores límites máximos permisibles en los vertimientos puntuales a cuerpos de aguas superficiales y a los sistemas de alcantarillado público",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_0631_2015.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Art. 8 (aguas residuales domésticas), arts. 9 a 14 (límites por sector), art. 18 y Anexo 2 (actividades). Texto consultado el 19 de noviembre de 2026; esa copia registra la modificación del art. 21 por la Resolución 2659 de 2015 y no indica otras modificaciones.",
    },
    {
      title: "Resolución 2254 de 2017: norma de calidad del aire o nivel de inmisión",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_2254_2017.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Art. 2 (Tabla 1 y parágrafo 1: desde el 1 de julio de 2018, 24 h de PM10 en 75 µg/m³ y de PM2.5 en 37 µg/m³), art. 3 (niveles a 2030) y art. 10 (niveles de prevención, alerta y emergencia). Texto consultado el 19 de noviembre de 2026; esa copia no incluye notas de modificaciones posteriores.",
    },
    {
      title: "Decreto 1076 de 2015: Decreto Único Reglamentario del Sector Ambiente y Desarrollo Sostenible",
      url: "https://normas.cra.gov.co/gestor/docs/decreto_1076_2015.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducido en el Gestor Normativo de la CRA",
      description: "Compilación de los decretos reglamentarios del sector ambiental (Diario Oficial 49.523, 26 de mayo de 2015). Texto consultado el 19 de noviembre de 2026.",
    },
    {
      title: "Ley 1333 de 2009: procedimiento sancionatorio ambiental",
      url: "https://normas.cra.gov.co/gestor/docs/ley_1333_2009.htm",
      source: "Congreso de la República, reproducida en el Gestor Normativo de la CRA",
      description: "Art. 40, numeral 2: multas hasta por 100.000 salarios mínimos mensuales legales vigentes, texto modificado por el art. 17 de la Ley 2387 de 2024. Consultado el 19 de noviembre de 2026.",
    },
  ],
  nextArticle: {
    slug: "tratamiento-de-aguas-residuales-industriales-en-colombia",
    title: "Tratamiento de Aguas Residuales Industriales en Colombia: Normativa, Reúso y Claves de Eficiencia",
  },
});

export default article;
