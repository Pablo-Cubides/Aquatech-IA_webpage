import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "desafios-mecanismos-tratamiento-aguas-riego",
  title: "Desafíos y Mecanismos de Tratamiento Avanzado para Aguas de Riego: Gestión de Contaminantes Emergentes",
  category: "Control y Tratamiento de Contaminación",
  date: "2026-04-07",
  readTime: 5,
  excerpt: "El reúso de aguas residuales en esquemas agrícolas exige una transición urgente. Análisis sobre la gestión de contaminantes emergentes en la Sabana de Bogotá.",
  heroImage: "https://res.cloudinary.com/lv3hwy1f/image/upload/v1793701243/articulos/aquatech-ambiental/tratamiento-riego.jpg",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "El reúso de aguas residuales en esquemas agrícolas, particularmente en sistemas hidráulicos de alta presión antrópica como **La Ramada** (Sabana Occidental de Cundinamarca), exige una transición urgente en los paradigmas de tratamiento actuales.\n\nLa problemática central radica en que las Plantas de Tratamiento de Aguas Residuales (PTAR) convencionales están diseñadas principalmente para la remoción de macronutrientes y la Demanda Bioquímica de Oxígeno (DBO). Sin embargo, estas infraestructuras resultan ineficientes ante la creciente presencia de **Contaminantes Emergentes (CE)**.",
    sections: [
      {
        id: "problematica-contaminantes-emergentes",
        title: "La Problemática de los Contaminantes Emergentes (CE)",
        content: "Los CE abarcan una amplia gama de productos farmacéuticos como *antibióticos, analgésicos y antihipertensivos*. Estos compuestos presentan estructuras moleculares complejas que les confieren una **alta recalcitrancia** (resistencia a la degradación). \n\nPara mitigar este impacto ambiental y sanitario, es indispensable estructurar trenes de tratamiento modulares que combinen separaciones físicas tradicionales con procesos de degradación química de alta energía.",
        callout: {
          type: "warning",
          title: "Riesgo de Bioacumulación",
          content: "Al ingresar a los canales de riego en concentraciones del orden de los microgramos por litro (μg/L), estos contaminantes generan una fuerte presión selectiva sobre los ecosistemas edáficos y representan un grave vector de bioacumulación.",
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
        content: "El núcleo tecnológico para la degradación de moléculas recalcitrantes reside en los POA. Específicamente, mediante el uso de semiconductores minerales como la **ilmenita** (un óxido de hierro y titanio) acoplados a agentes oxidantes como el peróxido de hidrógeno (H2O2).\n\n**Mecanismo de Activación:** Al irradiar el catalizador con fotones que superan su energía de banda prohibida (*Band Gap*), se promueve un electrón desde la banda de valencia hacia la banda de conducción, generando un par electrón-hueco (e- / h+).\n\n**Ruta Radicalaria:** Estos pares interactúan con el agua y el peróxido de hidrógeno circundante para producir **radicales hidroxilo (HO•)**. Este radical es un oxidante no selectivo con un potencial de oxidación extremadamente alto (2.80 V), capaz de romper enlaces carbono-carbono y conducir a la completa mineralización de los fármacos (transformándolos en CO2, H2O y ácidos inorgánicos).\n\n**Transición Energética:** El diseño avanzado del reactor evalúa la cinética de reacción bajo iniciación con radiación UV-C (alta energía, menor longitud de onda), seguida de un sostenimiento mediante radiación solar, buscando la máxima viabilidad técnica y eficiencia energética a escala real."
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Por qué las PTAR convencionales no bastan para aguas de riego?",
            content: "Están diseñadas sobre todo para remover macronutrientes y demanda bioquímica de oxígeno (DBO), y no eliminan bien los contaminantes emergentes, como antibióticos, analgésicos y antihipertensivos, que tienen alta recalcitrancia, es decir, resistencia a la degradación.",
          },
          {
            id: "faq-2",
            title: "¿Qué tres procesos propone el artículo?",
            content: "Coagulación y floculación (por ejemplo con cloruro férrico, para desestabilizar los coloides), adsorción con carbón activado como operación de afino y fotocatálisis heterogénea, un proceso de oxidación avanzada que usa ilmenita junto con peróxido de hidrógeno.",
          },
          {
            id: "faq-3",
            title: "¿Cómo se complementan los tres procesos?",
            content: "La coagulación acondiciona la matriz y reduce los interferentes ópticos, la fotocatálisis oxida los fármacos y la carga microbiológica, y la adsorción actúa como barrera final.",
          },
          {
            id: "faq-4",
            title: "¿Qué caso de estudio se menciona?",
            content: "El reúso de aguas residuales en esquemas agrícolas, en particular el sistema hidráulico de La Ramada, en la Sabana Occidental de Cundinamarca.",
          },
        ],
      },
    ],
    conclusion: "La integración de estos tres sistemas busca crear un efecto sinérgico poderoso: la Coagulación acondiciona la matriz reduciendo interferentes ópticos, la Fotocatálisis oxida estructuralmente los fármacos y la microbiología, y la Adsorción actúa como barrera final.\n\nLa evaluación metodológica rigurosa de estas variables cinéticas e isotérmicas, transitando desde moléculas trazadoras modelo hasta matrices reales complejas, establece los parámetros de diseño necesarios para escalar estas infraestructuras de tratamiento. \n\nEl objetivo final es claro: **asegurar la viabilidad toxicológica del agua y proteger el futuro de la agroindustria colombiana.**"
  },
  tags: ["contaminantes emergentes", "PTAR", "fotocatálisis", "coagulación", "adsorción", "reúso", "Sabana de Bogotá"],
  nextArticle: {
    slug: "superpoder-borra-cafe-limpiar-agua",
    title: "De tu taza al grifo: El 'superpoder' oculto de la borra de café para limpiar el agua"
  }
});

export default article;
