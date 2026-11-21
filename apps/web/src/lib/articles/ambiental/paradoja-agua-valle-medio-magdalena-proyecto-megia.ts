import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "paradoja-agua-valle-medio-magdalena-proyecto-megia",
  title: "De Residuo a Recurso: La Paradoja del Agua en el Valle Medio del Magdalena (Análisis Crítico - Proyecto MEGIA)",
  category: "Investigación y Casos de Estudio",
  date: "2026-04-07",
  dateModified: "2026-11-21",
  readTime: 6,
  excerpt: "Cómo la ingeniería choca con las barreras normativas en el reúso de aguas de producción de hidrocarburos: el caso del Proyecto MEGIA.",
  heroImage: "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701246/articulos/aquatech-ambiental/megia-planta.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "### Introducción: El Elefante en la Habitación\n\nEn la industria de los hidrocarburos, el petróleo se lleva los titulares, pero el agua es quien dicta la operación. En el Valle Medio del Magdalena (VMM), por cada barril de crudo, gestionamos volúmenes inmensos de agua de producción. La narrativa convencional se centra en la captación, pero el verdadero desafío técnico y ambiental reside en el retorno.\n\nComo parte del equipo técnico del Proyecto MEGIA (Modelo Multiescala de Gestión Integral del Agua), específicamente liderando el Producto 15, nos enfrentamos a una pregunta que va más allá de la química: ¿Por qué, si tenemos la tecnología para tratar el agua, seguimos prefiriendo el vertimiento sobre el reúso?\n\nEste artículo no es un reporte de laboratorio; es un análisis de cómo la ingeniería choca con la barrera regulatoria y cómo propusimos un tren de tratamiento capaz de romper ese estancamiento.",
    sections: [
      {
        id: "trampa-normativa",
        title: "1. La Trampa Normativa: Cuando la Ley Desincentiva la Economía Circular",
        content: "*El análisis normativo de este artículo corresponde al Producto 15, entregado antes de diciembre de 2021, y se hizo con la Resolución 1207 de 2014, vigente en ese momento. La Resolución 1256 de 2021 la derogó posteriormente.*\n\nDurante el análisis de la información secundaria y la normatividad vigente (Decreto 1076, Res. 631 de 2015 para vertimientos y Res. 1207 de 2014 para reúso), encontramos una incoherencia sistémica crítica.\n\n**El hallazgo:** Los estándares para reúso son, en muchos parámetros, irracionalmente más estrictos que los de vertimiento.\n\n**La realidad:** Hoy en día, para una operadora es técnica y económicamente más viable tratar el agua para \"cumplir y verter\" al río, que tratarla para reusarla en agricultura o industria.\n\n**El dato crítico:** Parámetros como Fenoles, Hidrocarburos Totales y ciertos metales tienen límites en la norma de reúso que obligan a niveles de potabilización casi clínica, mientras que el vertimiento permite cargas más laxas.\n\n**La consecuencia:** Se perpetúa un modelo lineal (extraer -> tratar -> verter) en lugar de uno circular.\n\n**Nuestra crítica:** La norma de reúso en Colombia carece de flexibilidad. No distingue adecuadamente entre un reúso para intercambio de calor industrial y uno para riego de cultivos. Exige monitorear una lista taxativa de parámetros (incluyendo algunos irrelevantes para aguas de producción) que encarecen el proceso sin aportar valor ambiental real."
      },
      {
        id: "reto-tecnico-vmm",
        title: "2. El Reto Técnico: Desarmando el \"Cóctel\" del VMM",
        content: "Las aguas de producción en el VMM no son simples aguas aceitosas; son matrices complejas con tres enemigos principales que inhabilitan las tecnologías convencionales por sí solas:\n\n*   **Salinidad Extrema:** Cloruros disparados que \"queman\" cualquier intento de riego agrícola sin desalinización.\n*   **Emulsiones Recalcitrantes:** Grasas y aceites estabilizados que los separadores API estándar no logran romper.\n*   **Compuestos Orgánicos Disueltos:** Fenoles y BTEX que requieren algo más que física para ser eliminados.\n\nLa mayoría de los sistemas actuales en campo operan con tecnologías físicas (flotación, filtración) que son insuficientes para alcanzar estándares de reúso agrícola. Se necesitaba un cambio de paradigma en el diseño del proceso."
      },
      {
        id: "solucion-tren-hibrido",
        title: "3. La Solución: Un Tren de Tratamiento Híbrido",
        content: "Para el Producto 15, no nos conformamos con evaluar lo existente. Diseñamos, simulamos y probamos a escala laboratorio un prototipo de tren de tratamiento secuencial diseñado específicamente para atacar las tres problemáticas mencionadas.\n\nLa filosofía fue: Atacar cada contaminante con la tecnología termodinámicamente más eficiente para su naturaleza.\n\n**A. Tratamiento Primario: Electrocoagulación (El Rompedor)**\nEn lugar de usar químicos costosos para romper las emulsiones, utilizamos electricidad y placas de sacrificio (aluminio).\n*   **Resultado:** la electrocoagulación removió la mayor parte de las grasas y aceites del agua cruda, con mediciones de laboratorios acreditados. Las cifras se publicarán con los resultados del proyecto.\n*   **Ventaja:** El sistema desestabiliza las cargas de los coloides y genera microburbujas que flotan el contaminante. Es el pre-tratamiento perfecto para proteger las etapas siguientes.\n\n**B. Tratamiento Secundario: Biorreactor de Membrana (MBR)**\nPara los orgánicos disueltos (fenoles), la biología es imbatible. Implementamos un MBR, que combina lodos activados con una filtración física.\n*   **El reto:** Aclimatar las bacterias a la alta salinidad del agua.\n*   **Resultado:** Una vez aclimatadas, las bacterias degradaron la carga orgánica remanente, entregando un efluente visualmente limpio, pero aún salino.\n\n**C. Tratamiento Terciario: Ósmosis Inversa (La Barrera Final)**\nEl paso ineludible para el reúso agrícola. Con el agua ya libre de grasas (que ensuciarían las membranas) y de orgánicos (que harían biofouling), la ósmosis inversa pudo operar con máxima eficiencia.\n*   **Resultado final:** el agua tratada alcanzó una salinidad y una carga orgánica compatibles con el reúso agrícola, con mediciones de laboratorios acreditados. Las cifras se publicarán con los resultados del proyecto.\n\n**Conclusión del Prototipo:** Técnicamente, es posible transformar agua de producción petrolera en agua apta para riego. La barrera no es la ingeniería, es el costo energético (OPEX) y la rigidez normativa."
      },
      {
        id: "gestion-lodos",
        title: "4. Los Lodos: El Residuo del Residuo",
        content: "Ningún tratamiento de agua es \"limpio\"; todos transfieren la contaminación de la fase líquida a la sólida. El proyecto MEGIA abordó esto proponiendo una Ruta de Decisión para Lodos.\n\nCategorizamos los lodos en tres grupos (Base Aceite, Base Agua, Biolodos) y propusimos alternativas de valorización real:\n\n*   **Recuperación Energética:** Para lodos con alto contenido de hidrocarburos (>10%), la incineración o coprocesamiento no es disposición, es recuperación de energía.\n*   **Construcción:** Las cenizas de lodos inorgánicos (base agua) mostraron potencial para ser estabilizadas en matrices de cemento o ladrillos, inmovilizando metales pesados.\n*   **Biolodos:** Potencial generación de biogás, aunque limitada por la toxicidad de los hidrocarburos previos."
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Qué es el Proyecto MEGIA?",
            content: "Es el Modelo Multiescala de Gestión Integral del Agua. El artículo analiza los resultados de su Producto 15 sobre el agua de producción de la industria de hidrocarburos en el Valle Medio del Magdalena.",
          },
          {
            id: "faq-2",
            title: "¿Qué es la «trampa normativa» que describe el artículo?",
            content: "Al revisar el Decreto 1076, la Resolución 631 de 2015 (vertimientos) y la Resolución 1207 de 2014 (reúso), el equipo encontró una incoherencia que desincentiva la economía circular, y por eso recomienda modernizar la Resolución 1207. El análisis normativo de este artículo corresponde al Producto 15, entregado antes de diciembre de 2021, y se hizo con la Resolución 1207 de 2014, vigente en ese momento. La Resolución 1256 de 2021 la derogó posteriormente.",
          },
          {
            id: "faq-3",
            title: "¿Por qué es difícil tratar las aguas de producción de la región?",
            content: "Son matrices complejas con tres problemas que inhabilitan por sí solas las tecnologías convencionales. Uno de ellos es la salinidad extrema, con cloruros tan altos que impiden el riego agrícola sin desalinización.",
          },
          {
            id: "faq-4",
            title: "¿Qué solución propone el proyecto?",
            content: "Un tren de tratamiento híbrido y secuencial, probado a escala de laboratorio, que ataca cada contaminante con la tecnología adecuada, y una ruta de decisión para los lodos, que los clasifica en tres grupos: base aceite, base agua y biolodos.",
          },
        ],
      },
    ],
    conclusion: "### Conclusiones y Recomendaciones Estratégicas\n\nEl Proyecto MEGIA, a través del Producto 15, deja tres mensajes claros para la industria y el regulador:\n\n1.  **Flexibilización Normativa:** Es urgente modernizar la Resolución 1207. Necesitamos rangos dinámicos y evaluación de riesgo caso a caso, no listas estáticas que bloquean la innovación.\n2.  **Tecnología en Tren:** Ninguna \"bala de plata\" (una sola tecnología) funcionará en el VMM. El futuro es la integración de procesos electroquímicos, biológicos y de membrana.\n3.  **El Costo de No Hacer Nada:** Seguir vertiendo agua tratada mientras la región sufre estrés hídrico es un error estratégico. El reúso tiene un costo operativo, sí, pero el costo social y ambiental de agotar las fuentes hídricas es infinitamente mayor.\n\n**La ingeniería ya hizo su parte. Ahora le toca a la regulación.**\n\n*Este artículo recoge el trabajo del autor en el **Producto 15** del proyecto de investigación **MEGIA** — «Modelo multiescala de gestión integral del agua con análisis de incertidumbre de la información para la realización de la evaluación ambiental estratégica (EAE) del subsector de hidrocarburos en el Valle Medio del Magdalena» —, ejecutado por la **Universidad Nacional de Colombia** en el marco del **contrato RC No. FP44842-157-2018** suscrito con **Minciencias**, con financiación de la **Agencia Nacional de Hidrocarburos (ANH)**.*\n\n*Los resultados corresponden a ensayos a escala de laboratorio, con mediciones realizadas por laboratorios acreditados. Los valores detallados se reservan para su publicación científica.*"
  },
  tags: ["Proyecto MEGIA", "Valle Medio del Magdalena", "agua de producción", "electrocoagulación", "MBR", "ósmosis inversa", "Resolución 1207"],
  references: [
    {
      title: "Resolución 631 de 2015: parámetros y valores límites máximos permisibles en los vertimientos puntuales a cuerpos de aguas superficiales y a los sistemas de alcantarillado público",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_0631_2015.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Norma de vertimientos citada en el análisis normativo. Texto consultado el 2026-11-21.",
    },
    {
      title: "Resolución 1207 de 2014: disposiciones relacionadas con el uso de aguas residuales tratadas",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_1207_2014.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Norma de reúso con la que se hizo el análisis; vigente cuando se entregó el Producto 15 (antes de diciembre de 2021). La Resolución 1256 de 2021 (art. 8) la derogó. Texto consultado el 2026-11-21.",
    },
    {
      title: "Resolución 1256 de 2021: por la cual se reglamenta el uso de las aguas residuales",
      url: "https://normas.cra.gov.co/gestor/docs/resolucion_minambienteds_1256_2021.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducida en el Gestor Normativo de la CRA",
      description: "Norma vigente de reúso; deroga la Resolución 1207 de 2014. Texto consultado el 2026-11-21.",
    },
    {
      title: "Decreto 1076 de 2015: Decreto Único Reglamentario del Sector Ambiente y Desarrollo Sostenible",
      url: "https://normas.cra.gov.co/gestor/docs/decreto_1076_2015.htm",
      source: "Ministerio de Ambiente y Desarrollo Sostenible, reproducido en el Gestor Normativo de la CRA",
      description: "Compilación de los decretos reglamentarios del sector ambiental, citada en el análisis normativo. Texto consultado el 2026-11-21.",
    },
  ],
  nextArticle: {
    slug: "superpoder-borra-cafe-limpiar-agua",
    title: "De tu taza al grifo: El 'superpoder' oculto de la borra de café para limpiar el agua"
  }
});

export default article;
