import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "desafios-mecanismos-tratamiento-aguas-riego",
  title: "Desafíos y Mecanismos de Tratamiento Avanzado para Aguas de Riego: Gestión de Contaminantes Emergentes",
  category: "Control y Tratamiento de Contaminación",
  date: "2026-04-07",
  dateModified: "2026-11-21",
  readTime: 5,
  excerpt: "El reúso de aguas residuales en agricultura exige tratar contaminantes que muchas PTAR convencionales no están diseñadas para remover: mecanismos de un tren con coagulación, adsorción y fotocatálisis.",
  heroImage: "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701243/articulos/aquatech-ambiental/tratamiento-riego.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "El reúso de aguas residuales en esquemas agrícolas, particularmente en distritos de riego como **La Ramada** (Sabana Occidental de Cundinamarca), exige revisar los esquemas de tratamiento actuales.\n\nLa problemática central radica en que las Plantas de Tratamiento de Aguas Residuales (PTAR) convencionales, en muchos casos, están diseñadas principalmente para la remoción de macronutrientes y la Demanda Bioquímica de Oxígeno (DBO), y no para eliminar **Contaminantes Emergentes (CE)** como los fármacos.\n\nSobre La Ramada: una tesis de maestría de la Universidad Nacional de Colombia evaluó la toxicidad de los sedimentos de los canales del distrito de riego con dos bioensayos (*Hydra attenuata* y *Daphnia magna*), con análisis de metales, plaguicidas y antibióticos en tres zonas (agrícola, urbana y urbano-industrial) y en épocas seca y de lluvias; la mayor toxicidad se encontró en la zona urbano-industrial (Sánchez Romero, 2020).\n\n*Este artículo presenta el diseño y la evaluación de un tren de tratamiento para contaminantes emergentes en agua de riego, con fotocatálisis heterogénea a base de ilmenita y peróxido de hidrógeno, desarrollados por el autor. El trabajo se encuentra en proceso de postulación para publicación científica; por eso no se presentan concentraciones, porcentajes de remoción ni condiciones de ensayo, que se reservan para esa publicación.*",
    sections: [
      {
        id: "problematica-contaminantes-emergentes",
        title: "La Problemática de los Contaminantes Emergentes (CE)",
        content: "Los CE abarcan una amplia gama de productos farmacéuticos como *antibióticos, analgésicos y antihipertensivos*. Estos compuestos presentan estructuras moleculares complejas que les confieren una **alta recalcitrancia** (resistencia a la degradación). \n\nPara reducir su presencia en el agua, una alternativa es estructurar trenes de tratamiento modulares que combinen separaciones físicas tradicionales con procesos de degradación química de alta energía.",
        callout: {
          type: "info",
          title: "Por qué importan en el agua de riego",
          content: "Los contaminantes emergentes pueden llegar a los canales de riego con los vertimientos; reducir su presencia en el agua es lo que motiva un tratamiento específico.",
        }
      },
      {
        id: "coagulacion-floculacion",
        title: "1. Coagulación y Floculación: Desestabilización Coloidal",
        content: "Este proceso fisicoquímico primario busca la remoción de material particulado suspendido y fracciones de materia orgánica disuelta.\n\n**Mecanismo:** La adición de sales metálicas, como el cloruro férrico (FeCl3), induce la compresión de la doble capa eléctrica de los coloides. Esto anula las fuerzas de repulsión electrostática, permitiendo la aglomeración de partículas mediante las fuerzas de *Van der Waals* durante las fases de mezcla rápida y lenta.\n\n**Alcance en CE:** Aunque es altamente eficiente para reducir la turbiedad y compuestos con afinidad hidrofóbica, su capacidad para remover moléculas polares disueltas de bajo peso molecular (como la mayoría de los fármacos) es mecánicamente limitada. Por ello, actúa como un **pretratamiento indispensable** para optimizar las etapas posteriores."
      },
      {
        id: "adsorcion-carbon-activado",
        title: "2. Adsorción con Carbón Activado: Transferencia de Masa",
        content: "Implementado generalmente como una operación de afino, la adsorción explota fenómenos de superficie para capturar solutos disueltos.\n\n**Mecanismo:** El proceso se rige por la afinidad química y el tamaño de poro del material adsorbente. La dinámica de captura en el equilibrio termodinámico suele modelarse mediante isotermas (ej. la isoterma de Langmuir), la cual asume que la adsorción ocurre en una monocapa sobre sitios energéticamente homogéneos sin interacción entre las moléculas adsorbidas.\n\n**Variable Crítica:** La tasa de agotamiento del carbón activado depende directamente de la \"competencia\" por los sitios activos entre la Materia Orgánica Natural (MON) remanente y los microcontaminantes objetivo."
      },
      {
        id: "fotocatalisis-heterogenea",
        title: "3. Fotocatálisis Heterogénea: Procesos de Oxidación Avanzada (POA)",
        content: "El núcleo tecnológico para la degradación de moléculas recalcitrantes reside en los POA. Específicamente, mediante el uso de semiconductores minerales como la **ilmenita** (un óxido de hierro y titanio) acoplados a agentes oxidantes como el peróxido de hidrógeno (H2O2).\n\n**Mecanismo de Activación:** Al irradiar el catalizador con fotones que superan su energía de banda prohibida (*Band Gap*), se promueve un electrón desde la banda de valencia hacia la banda de conducción, generando un par electrón-hueco (e- / h+).\n\n**Ruta Radicalaria:** Estos pares interactúan con el agua y el peróxido de hidrógeno circundante para producir **radicales hidroxilo (HO•)**. Este radical es un oxidante no selectivo y muy reactivo, que puede degradar los compuestos orgánicos hasta CO2, agua y ácidos inorgánicos (mineralización), según el compuesto y las condiciones.\n\n**Diseño del reactor:** el diseño del autor considera radiación UV-C y radiación solar como fuentes de activación del catalizador, con el objetivo de combinar viabilidad técnica y eficiencia energética. Los detalles de operación y los resultados se reservan para la publicación científica."
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Por qué muchas PTAR convencionales no bastan para aguas de riego?",
            content: "Muchas están diseñadas sobre todo para remover macronutrientes y demanda bioquímica de oxígeno (DBO), y no para eliminar contaminantes emergentes como antibióticos, analgésicos y antihipertensivos, que tienen alta recalcitrancia, es decir, resistencia a la degradación.",
          },
          {
            id: "faq-2",
            title: "¿Qué tres procesos propone el artículo?",
            content: "Coagulación y floculación (por ejemplo con cloruro férrico, para desestabilizar los coloides), adsorción con carbón activado como operación de afino y fotocatálisis heterogénea, un proceso de oxidación avanzada que usa ilmenita junto con peróxido de hidrógeno.",
          },
          {
            id: "faq-3",
            title: "¿Cómo se complementan los tres procesos?",
            content: "El diseño los plantea como complementarios: la coagulación acondiciona el agua y reduce los interferentes ópticos, la fotocatálisis busca oxidar los fármacos y la adsorción actúa como barrera final.",
          },
          {
            id: "faq-4",
            title: "¿Qué se sabe del agua de riego de La Ramada?",
            content: "Una tesis de maestría de la Universidad Nacional de Colombia (Sánchez Romero, 2020) evaluó la toxicidad de los sedimentos de los canales del distrito de riego con dos bioensayos y encontró la mayor toxicidad en la zona urbano-industrial.",
          },
          {
            id: "faq-5",
            title: "¿Hay resultados?",
            content: "El trabajo está en proceso de postulación para publicación científica. Sus resultados se reservan para esa publicación; este artículo explica los mecanismos y el diseño, no cifras de remoción.",
          },
        ],
      },
    ],
    conclusion: "Los tres procesos están pensados para complementarse: la coagulación acondiciona el agua reduciendo interferentes ópticos, la fotocatálisis busca oxidar los fármacos y la adsorción actúa como barrera final.\n\nEl trabajo del autor busca definir parámetros de diseño para escalar estas infraestructuras de tratamiento; su evidencia se publicará en la literatura científica. \n\nEl objetivo final es claro: **reducir la presencia de contaminantes emergentes en el agua de riego.**"
  },
  tags: ["contaminantes emergentes", "PTAR", "fotocatálisis", "coagulación", "adsorción", "reúso", "Sabana de Bogotá"],
  references: [
    {
      title: "Evaluación de la toxicidad en sedimentos de los canales del Distrito de Riego de La Ramada mediante la utilización de dos bioensayos",
      url: "https://repositorio.unal.edu.co/items/29b60b50-91dd-45af-a5b0-2ec2572133e8",
      source: "Sánchez Romero, C. A. (2020). Tesis de Maestría en Ingeniería Ambiental, Universidad Nacional de Colombia, Sede Bogotá",
      description: "Evaluación de la toxicidad de sedimentos de los canales del distrito de riego de La Ramada con Hydra attenuata y Daphnia magna, con análisis de metales, plaguicidas y antibióticos. Consultado el 2026-11-21.",
    },
  ],
  nextArticle: {
    slug: "superpoder-borra-cafe-limpiar-agua",
    title: "De tu taza al grifo: El 'superpoder' oculto de la borra de café para limpiar el agua"
  }
});

export default article;
