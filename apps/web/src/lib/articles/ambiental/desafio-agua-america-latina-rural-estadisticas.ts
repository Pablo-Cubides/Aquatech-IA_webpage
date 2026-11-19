import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "desafio-agua-america-latina-rural-estadisticas",
  title: "El Desafío del Agua en la América Latina Rural: Cifras de la CEPAL y Gestión Comunitaria",
  category: "Gestión Comunitaria del Agua",
  date: "2025-04-02",
  dateModified: "2026-11-15",
  readTime: 8,
  excerpt:
    "La CEPAL estima que 161 millones de personas en América Latina y el Caribe no tienen agua potable gestionada de forma segura. Cifras regionales y rurales, y el papel de las juntas de agua.",
  heroImage:
    "/images/portal-ambiental/blog/desafio-agua-rural-latam.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction:
      "El acceso al agua potable y al saneamiento es un derecho humano reconocido desde 2010, pero su cumplimiento efectivo sigue siendo una asignatura pendiente en América Latina y el Caribe. Este artículo reúne las cifras que presenta la CEPAL sobre el ODS 6 en la región, distingue cuáles son totales regionales y cuáles corresponden al ámbito rural, y explica por qué la gestión comunitaria es parte de la respuesta.",
    sections: [
      {
        id: "brecha-rural-cifras",
        title: "La Brecha en Cifras: Millones que se Quedan Atrás",
        content:
          "Las cifras de esta sección provienen de la División de Recursos Naturales de la CEPAL, que a su vez usa datos del Programa Conjunto de Monitoreo OMS/UNICEF (JMP) (Fuente: CEPAL, presentación «Avance en el cumplimiento del ODS 6 para América Latina y el Caribe», 22 de febrero de 2023).\n\n**161 millones de personas** (2,5 de cada 10) en América Latina y el Caribe no tienen acceso a agua potable gestionada de forma segura. Es el total regional, urbano y rural.\n\n**431 millones de personas** (7 de cada 10) no cuentan con saneamiento gestionado de forma segura. También es un total regional.\n\n**23,8 millones de personas** en el ámbito rural no tienen instalaciones para el lavado de manos, una carencia crítica para la salud pública.\n\nLa brecha entre el campo y la ciudad es sistemática: en la serie 2000-2020 que presenta la CEPAL, la cobertura de agua potable gestionada de forma segura es menor en el ámbito rural que en el urbano.",
        image:
          "/images/portal-ambiental/blog/agua-rural-contaminacion.jpg",
      },
      {
        id: "inequidad-regresividad",
        title: "Inequidad y Regresividad: El Costo de la Pobreza Hídrica",
        content:
          "La gestión actual evidencia una alta **regresividad tarifaria**: los hogares de menores ingresos destinan una proporción mayor de su ingreso al servicio de agua.\n\n**Quintil 1 (más vulnerable):** tiene un 25 % menos de acceso a agua potable gestionada de forma segura que el quintil más rico y puede llegar a pagar, proporcionalmente, hasta **2 veces más** que él por el servicio (Fuente: CEPAL, 2023).\n\nEsta inequidad profundiza el ciclo de pobreza: quienes menos tienen pagan proporcionalmente más por un bien que debería estar garantizado.",
      },
      {
        id: "infraestructura-contaminacion",
        title: "Infraestructura y Contaminación: Un Panorama Crítico",
        content:
          "La CEPAL describe una infraestructura hídrica deteriorada y una alta vulnerabilidad de la prestación ante el cambio climático:\n\n**Pérdidas del 60 %:** las redes deterioradas pierden el 60 % del agua.\n\n**Tratamiento insuficiente:** solamente el 41 % de las aguas residuales se trata, con amplias diferencias entre países. El tratamiento se concentra en zonas urbanas de alta densidad, de modo que el ámbito rural queda menos cubierto.\n\n**Conflictos en aumento:** los conflictos por el agua iniciados entre 2000 y 2019 son cuatro veces más que los iniciados entre 1980 y 1999 (Fuente: CEPAL, 2023).",
        callout: {
          type: "info",
          title: "Eficiencia en el uso del agua",
          content:
            "Según el indicador ODS 6.4.1, los niveles de eficiencia en el uso del agua de la región son bajos respecto al promedio mundial, y la CEPAL no observa un desacople entre la extracción de agua y el PIB entre 2000 y 2017.",
        },
      },
      {
        id: "cambio-climatico-agua-dulce",
        title: "El Impacto del Cambio Climático en los Ecosistemas de Agua Dulce",
        content:
          "El cambio climático amplifica las ineficiencias de gestión que ya existían. La CEPAL señala que los desastres relacionados con el agua, entre sequías e inundaciones, se han duplicado, y que América del Sur perdió casi **7.000 km²** de superficies de agua dulce, el equivalente a cuatro veces la ciudad de São Paulo. También hay pérdida de nieves permanentes y glaciares.\n\nPara las comunidades rurales que dependen de fuentes locales, esas pérdidas son un riesgo directo para la disponibilidad del recurso.",
        image:
          "/images/portal-ambiental/blog/soluciones-basadas-naturaleza.jpg",
      },
      {
        id: "gestion-comunitaria",
        title: "La Gestión Comunitaria: Capital Social Donde el Mercado y el Estado No Llegan",
        content:
          "En el entorno rural, la participación de la comunidad en la gestión del agua no es opcional. Donde los altos costos de transacción y las barreras geográficas frenan al prestador privado y la presencia del Estado es dispersa, los prestadores comunitarios (juntas de agua, cooperativas y asociaciones de usuarios) operan con base en el capital social: la confianza local reduce barreras de entrada que ni el mercado ni el Estado han logrado superar.\n\nVentajas que suelen señalarse de la gestión comunitaria en zonas rurales:\n\n**Gobernanza democrática:** al compartir la toma de decisiones se reduce la conflictividad y las soluciones responden a la realidad del territorio.\n\n**Resiliencia:** la comunidad es el primer sensor de las sequías y de los cambios en las fuentes, y su capacidad de acción inmediata es la base de la adaptación local.\n\n**Mantenimiento:** la autogestión ayuda a mantener operativa la infraestructura cuando la presencia del Estado es intermitente.\n\nNo existe un modelo único. El comunitario, el público y el privado funcionan de forma distinta según el contexto geográfico y socioeconómico y la fortaleza del marco regulatorio. El error es imponer uno sin considerar el territorio.",
        image:
          "/images/portal-ambiental/blog/comunidad-rural-desarrollo.jpg",
      },
      {
        id: "monitoreo-comunitario",
        title: "Monitoreo Comunitario: Qué Medir y Por Qué Importa la Turbidez",
        content:
          "Pasar del reporte reactivo al monitoreo activo exige información oportuna. Una secuencia de trabajo orientativa para una junta de agua:\n\n**1. Identificar** fuentes y puntos críticos: mapear pozos y fuentes y detectar focos de contaminación, como letrinas mal ubicadas o vertimientos informales.\n\n**2. Evaluar** el riesgo midiendo de forma sistemática parámetros físicos y químicos.\n\n**3. Intervenir y alertar:** limpieza, desinfección y comunicación de emergencia.\n\n**4. Reportar** y compartir los datos para exigir apoyo institucional.\n\nParámetros básicos para empezar:\n\n**Turbidez:** una turbidez alta no es solo un problema estético; los sedimentos pueden proteger a los microorganismos y reducir la eficacia de la desinfección con cloro.\n\n**Temperatura:** los cambios bruscos pueden alertar sobre descargas.\n\n**E. coli y coliformes:** como solo el 41 % de las aguas residuales de la región se trata, el riesgo de contaminación fecal es permanente, sobre todo tras lluvias intensas.\n\nEn Colombia, el criterio de referencia para el agua de consumo es el IRCA de la Resolución 2115 de 2007. Con resultados de laboratorio puedes calcularlo en la [calculadora de índices de calidad de agua](/ambiental/herramientas/indice-calidad-agua); la guía [Cómo calcular el IRCA](/ambiental/blog/calculadora-irca-calidad-agua) explica la fórmula y los rangos de riesgo.",
        image:
          "/images/portal-ambiental/blog/irca-laboratorio-monitoreo.jpg",
        callout: {
          type: "success",
          title: "Punto de partida práctico",
          content:
            "¿Gestionas o colaboras con una junta de agua? Identifica los 3 puntos de tu sistema donde la turbidez varía más. Instalar incluso un turbidímetro básico en esos puntos te dará información para actuar antes de que llegue la crisis.",
        },
      },
      {
        id: "propuesta-inversion",
        title: "Hacia una Transición Hídrica Inclusiva: La Propuesta de la CEPAL",
        content:
          "La CEPAL propone una transición hídrica sostenible e inclusiva con cuatro pilares: garantizar el derecho humano al agua y al saneamiento sin dejar a nadie atrás; asegurar un acceso equitativo y asequible para erradicar la pobreza hídrica; revertir las externalidades negativas (conflictos, contaminación y sobreexplotación); y promover una economía más circular en la cadena de valor del agua. Son los pilares de la Agenda Regional de Acción por el Agua, aprobada en los Diálogos Regionales del Agua de febrero de 2023.\n\n**Inversión estimada:** la CEPAL calcula que invertir cada año el 1,3 % del PIB regional durante 10 años permitiría universalizar el acceso al agua potable y al saneamiento gestionados de forma segura con las capacidades técnicas actuales, con un efecto positivo en el empleo verde (Fuente: comunicado de la CEPAL, febrero de 2023).\n\n**Información:** la Red y Observatorio para la Sostenibilidad del Agua (ROSA), presentada en esos mismos Diálogos, es un repositorio digital de documentos de política e información sobre el ODS 6.",
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Cuántas personas en América Latina y el Caribe carecen de agua y saneamiento seguros?",
            content: "Según la CEPAL, 161 millones de personas (2,5 de cada 10) no tienen agua potable gestionada de forma segura y 431 millones (7 de cada 10) no tienen saneamiento gestionado de forma segura. Ambas son cifras del total regional. En el ámbito rural, 23,8 millones de personas no tienen instalaciones para lavarse las manos.",
          },
          {
            id: "faq-2",
            title: "¿Qué es la regresividad tarifaria?",
            content: "Que los hogares de menores ingresos destinan una proporción mayor de su ingreso al agua. Según la CEPAL, el quintil más vulnerable tiene un 25 % menos de acceso a agua potable gestionada de forma segura y puede llegar a pagar proporcionalmente hasta dos veces más que el quintil más rico.",
          },
          {
            id: "faq-3",
            title: "¿Cuánta agua se pierde y cuánta se trata?",
            content: "La CEPAL describe redes deterioradas con pérdidas del 60 % y señala que solamente el 41 % de las aguas residuales se trata, con grandes diferencias entre países.",
          },
          {
            id: "faq-4",
            title: "¿Cuánto costaría cerrar la brecha?",
            content: "La CEPAL estima que invertir el 1,3 % del PIB regional cada año durante 10 años permitiría universalizar el acceso al agua potable y al saneamiento gestionados de forma segura con las capacidades técnicas actuales.",
          },
          {
            id: "faq-5",
            title: "¿Por qué funciona la gestión comunitaria del agua en zonas rurales?",
            content: "Porque los prestadores comunitarios (juntas de agua, cooperativas y asociaciones de usuarios) operan con capital social, y la gobernanza democrática reduce la conflictividad. Las grandes empresas privadas suelen retirarse ante los altos costos de transacción y las barreras geográficas.",
          },
          {
            id: "faq-6",
            title: "¿Qué debe medir una junta de agua para empezar a monitorear?",
            content: "Turbidez, temperatura y E. coli o coliformes. La turbidez es la señal de alerta más accesible porque los sedimentos pueden proteger a los microorganismos y reducir la eficacia del cloro.",
          },
        ],
      },
    ],
    conclusion:
      "Cerrar la brecha hídrica rural exige inversión y una gobernanza que reconozca a quienes ya sostienen el servicio: las juntas de agua, las cooperativas y las asociaciones de usuarios. Las cifras de la CEPAL muestran el tamaño del problema; el monitoreo comunitario y los datos locales ayudan a decidir dónde actuar primero.",
  },
  tags: [
    "agua rural",
    "ODS 6",
    "CEPAL",
    "saneamiento",
    "América Latina",
    "gestión comunitaria",
    "juntas de agua",
  ],
  references: [
    {
      title: "Avance en el cumplimiento del ODS 6 para América Latina y el Caribe (presentación, 22 de febrero de 2023)",
      url: "https://www.cepal.org/sites/default/files/events/files/avance_en_el_cumplimiento_del_ods_6_para_america_latina_y_el_caribe_elisa_blanco.pdf",
      source: "CEPAL, División de Recursos Naturales",
      description: "Acceso a agua potable y saneamiento (datos JMP OMS/UNICEF), tratamiento de aguas residuales, conflictos por el agua y pilares de la transición hídrica.",
    },
    {
      title: "La CEPAL insta a fomentar inversiones en servicios hídricos para mejorar el bienestar y la calidad de vida",
      url: "https://www.cepal.org/es/comunicados/cepal-insta-fomentar-inversiones-servicios-hidricos-mejorar-bienestar-la-calidad-vida",
      source: "CEPAL, comunicado de prensa",
      description: "Inversión estimada del 1,3 % del PIB regional anual durante 10 años.",
    },
    {
      title: "Países aprueban la Agenda Regional de Acción por el Agua de América Latina y el Caribe",
      url: "https://www.cepal.org/es/noticias/paises-aprueban-la-agenda-regional-accion-agua-america-latina-caribe",
      source: "CEPAL, noticia",
      description: "Diálogos Regionales del Agua 2023 y Agenda Regional de Acción por el Agua.",
    },
  ],
  nextArticle: {
    slug: "como-predecir-riesgos-de-calidad-del-agua-con-turbidez-ph-cloro-residual-e-irca",
    title: "Cómo Predecir Riesgos en la Calidad del Agua Mediante Turbidez, pH, Cloro Residual e IRCA",
  },
});

export default article;
