import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde blog-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "matrices-eia-leopold-conesa",
  title: "Matrices de Evaluación de Impacto Ambiental: Guía Práctica de Leopold, Conesa y Battelle",
  category: "Gestión Ambiental",
  date: "2024-12-09",
  readTime: 6,
  excerpt: "Domina las metodologías de EIA para el licenciamiento ambiental. Análisis técnico de Leopold, Conesa y Battelle-Columbus con casos prácticos.",
  heroImage: "/images/portal-ambiental/blog/matrices-eia-metodologias.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
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
        "id": "ejemplo-conesa",
        "title": "Ejemplo práctico: valorar un impacto con Conesa",
        "content": "Supón que evalúas el impacto de la apertura de una zanja para una tubería sobre la calidad del suelo. Asignas valores a los atributos de la fórmula:\n\n• Intensidad (IN) = 4 · Extensión (EX) = 2 · Momento (MO) = 4 · Persistencia (PE) = 2\n• Reversibilidad (RV) = 1 · Sinergia (SI) = 1 · Acumulación (AC) = 1 · Efecto (EF) = 4\n• Periodicidad (PR) = 1 · Recuperabilidad (MC) = 2\n\nAplicando I = ±[3·IN + 2·EX + MO + PE + RV + SI + AC + EF + PR + MC] se obtiene 12 + 4 + 4 + 2 + 1 + 1 + 1 + 4 + 1 + 2 = 32. En la escala habitual de Conesa, un valor entre 25 y 50 se considera impacto **moderado**: exige medidas de manejo, pero no impide la ejecución del proyecto."
      },
      {
        "id": "como-elegir",
        "title": "Cómo elegir la metodología según la fase del proyecto",
        "content": "• **Diagnóstico de alternativas (DAA):** Leopold, por su rapidez para ver los puntos críticos de cada alternativa.\n• **Estudio de impacto ambiental (EIA):** Conesa, porque produce valores numéricos comparables y trazables para cada interacción.\n• **Proyectos hídricos con muchos parámetros medibles:** Battelle-Columbus, que cuantifica la calidad ambiental antes y después.\n\nEn la práctica es habitual combinarlos: Leopold para el cribado, Conesa para valorar lo que importa y Battelle para comparar escenarios. Antes de decidir, revisa los términos de referencia de la autoridad ambiental, porque a veces exigen una metodología concreta."
      },
      {
        "id": "errores-eia",
        "title": "Errores frecuentes al elaborar matrices de impacto",
        "content": "• **Valorar sin línea base:** sin un diagnóstico del estado actual, la intensidad es subjetiva.\n• **Mezclar acciones y factores:** las filas deben ser actividades del proyecto y las columnas, componentes ambientales.\n• **Olvidar los impactos positivos:** empleo, mejoras de infraestructura o recuperación de áreas también deben quedar registrados.\n• **No justificar los valores:** cada puntuación necesita un argumento técnico que pueda defenderse ante la autoridad.\n• **Ignorar la sinergia y la acumulación:** varios impactos pequeños pueden sumar uno significativo."
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
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Cuándo uso Leopold, Conesa o Battelle-Columbus?",
            content: "Leopold sirve para el diagnóstico de alternativas por su rapidez para ver los puntos críticos. Conesa es la opción para el estudio de impacto ambiental porque produce valores numéricos comparables y trazables para cada interacción. Battelle-Columbus se usa en proyectos hídricos con muchos parámetros medibles.",
          },
          {
            id: "faq-2",
            title: "¿Cómo evalúa la matriz de Leopold cada celda?",
            content: "La matriz, diseñada originalmente con 100 acciones y 88 factores, evalúa cada celda con dos valores: la magnitud, en una escala de −10 a +10 que representa la extensión de la alteración, y la importancia.",
          },
          {
            id: "faq-3",
            title: "¿Qué integra la fórmula de Conesa?",
            content: "La fórmula de Importancia (I) integra 11 atributos técnicos, entre ellos intensidad, extensión, momento, persistencia, reversibilidad, sinergia y acumulación, para asignar un valor numérico a cada impacto.",
          },
          {
            id: "faq-4",
            title: "¿Cuáles son los errores más frecuentes al elaborar una matriz?",
            content: "Valorar sin línea base (la intensidad queda subjetiva), mezclar acciones y factores (las filas deben ser actividades del proyecto y las columnas, componentes ambientales) y olvidar los impactos positivos, como el empleo o las mejoras de infraestructura.",
          },
        ],
      },
    ],
    conclusion: "Las matrices de impacto ambiental no son tablas estáticas; son modelos dinámicos de riesgo territorial. Al utilizar metodologías rigurosas como Conesa y herramientas de automatización, garantizamos que los Planes de Manejo Ambiental (PMA) sean sólidos frente a la revisión de la autoridad ambiental.",
  },
  tags: ["EIA", "Leopold", "Conesa", "Battelle", "licencia ambiental", "impacto ambiental", "ANLA"],
  nextArticle: {
    slug: "navegador-normas-ambientales",
    title: "Guía de Normatividad Ambiental en Colombia: Agua, Aire, Vertimientos y Residuos Sólidos",
  },
});

export default article;
