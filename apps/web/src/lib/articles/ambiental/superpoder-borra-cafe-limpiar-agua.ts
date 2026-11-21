import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "superpoder-borra-cafe-limpiar-agua",
  title: "De tu taza al grifo: El \"superpoder\" oculto de la borra de café para limpiar el agua",
  category: "Nuevas Tecnologías Ambientales",
  date: "2026-04-07",
  dateModified: "2026-11-21",
  readTime: 4,
  excerpt: "Un estudio de la Universidad Nacional de Colombia (Revista Mutis, 2014) probó la borra de café para retirar cromo VI del agua: qué mostró, con qué condiciones y qué falta por probar.",
  heroImage: "/images/portal-ambiental/blog/cafe-filtro.png",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    "introduction": "¿Sabías que la borra de café que sobra de tu taza se ha probado como adsorbente para limpiar agua? Lo que tú llamas \"desecho\", los ingenieros ambientales lo llaman bioadsorbente: un material que atrapa contaminantes en su superficie.\n\nEste artículo cuenta un caso concreto y publicado: el estudio sobre la adsorción de cromo hexavalente (Cr VI) con residuos de café que hicimos en la Universidad Nacional de Colombia (Cubides-Guerrero y Ramírez-Franco, Revista Mutis, 2014), qué mostró y qué no mostró.",
    "sections": [
      {
        "id": "el-estudio",
        "title": "🧪 El estudio en pocas palabras",
        "content": "**Qué se probó:** la adsorción de cromo VI sobre tres materiales: carbón activado comercial, carbón activado preparado a partir de residuos de café y el residuo de café sin tratar (el \"cuncho\").\n\n**Con qué agua:** soluciones acuosas sintéticas de dicromato de potasio, a 5 µg/mL de cromo VI. No se usó agua de río ni vertimientos reales.\n\n**Quién lo hizo:** Pablo Cubides Guerrero, autor de este sitio, y José Herney Ramírez Franco, del Departamento de Ingeniería Química y Ambiental de la Universidad Nacional de Colombia. El trabajo se hizo en el Grupo de Investigación RESA de la Universidad Nacional de Colombia y el semillero SIRSA.\n\n**Dónde se publicó:** Revista Mutis, vol. 4, núm. 2 (2014), pp. 18-25, revista de la Universidad de Bogotá Jorge Tadeo Lozano."
      },
      {
        "id": "caso-cromo-vi",
        "title": "🏭 El caso del cromo VI (Cr VI)",
        "content": "**El hallazgo:** con el residuo de café se obtuvieron adsorciones superiores al 95 % del cromo VI de las soluciones. El proceso se ajustó al modelo de Freundlich y a una cinética de segundo orden.\n\n**Frente al carbón comercial:** los autores eligieron el residuo de café como la mejor alternativa entre las analizadas y, en las condiciones estudiadas, no encontraron diferencias significativas en los porcentajes de adsorción entre los adsorbentes comparados.\n\n**Por qué importa:** los autores concluyen que el proceso tiene potencial para tratar las aguas residuales del proceso de curtido, que contienen cromo.\n\n**Lo que el estudio no demuestra:** que funcione con agua de río o con vertimientos reales de curtiembres; para eso harían falta pruebas adicionales.",
        "callout": {
          "type": "info",
          "title": "Referencia del estudio",
          "content": "Cubides-Guerrero, P. A. y Ramírez-Franco, J. H. (2014). Adsorción de Cr VI sobre residuos de café. Revista Mutis, 4(2), 18-25. DOI 10.21789/22561498.953.\n\n [Leer el estudio en la Revista Mutis](https://revistas.utadeo.edu.co/index.php/mutis/article/view/953)"
        }
      },
      {
        "id": "datos-del-estudio",
        "title": "📊 Las condiciones del experimento",
        "content": "• **Contaminante:** cromo VI, a 5 µg/mL en solución acuosa sintética\n• **Dosis de residuo de café:** entre 0,01 % y 4 % en peso\n• **Tiempo de contacto y temperatura (isoterma de adsorción):** 60 minutos a 36 °C\n• **Resultado:** adsorciones superiores al 95 % de cromo VI\n• **Modelos:** isoterma de Freundlich y cinética de segundo orden"
      },
      {
        "id": "preguntas-frecuentes",
        "title": "Preguntas frecuentes",
        "content": "Respuestas breves a las dudas más comunes sobre este tema.",
        "subsections": [
          {
            "id": "faq-1",
            "title": "¿Qué estudió el trabajo?",
            "content": "La adsorción de cromo VI sobre tres materiales: carbón activado comercial, carbón activado de residuos de café y residuo de café sin tratar, con soluciones acuosas sintéticas de dicromato de potasio a 5 µg/mL."
          },
          {
            "id": "faq-2",
            "title": "¿Qué resultados obtuvo?",
            "content": "Adsorciones superiores al 95 % del cromo VI, con ajuste al modelo de Freundlich y cinética de segundo orden. En las condiciones estudiadas no hubo diferencias significativas entre los adsorbentes comparados, y los autores eligieron el residuo de café como la mejor alternativa entre las analizadas."
          },
          {
            "id": "faq-3",
            "title": "¿Se probó con agua real de un río o de una curtiembre?",
            "content": "No. Se usaron soluciones sintéticas en laboratorio. Los autores concluyen que el proceso tiene potencial para tratar aguas residuales del proceso de curtido, pero eso requeriría pruebas con agua real."
          },
          {
            "id": "faq-4",
            "title": "¿Quién hizo el estudio y dónde se publicó?",
            "content": "Pablo Cubides Guerrero, autor de este sitio, y José Herney Ramírez Franco, en la Universidad Nacional de Colombia (Grupo de Investigación RESA y semillero SIRSA). Se publicó en la Revista Mutis 4(2), 2014 (DOI 10.21789/22561498.953)."
          }
        ]
      }
    ],
    "conclusion": "🧾 **Qué nos deja este estudio**\nLa borra de café, un residuo que hoy se desecha, mostró en laboratorio adsorciones superiores al 95 % de cromo VI en soluciones sintéticas y un desempeño comparable al de los otros adsorbentes probados. Es una señal alentadora para pensar en el tratamiento de aguas de curtido, pero es un primer paso: faltan pruebas con agua real y a mayor escala.\n\n*Este artículo recoge un estudio publicado: Cubides-Guerrero, P. A. y Ramírez-Franco, J. H. (2014), Revista Mutis 4(2), 18-25, DOI 10.21789/22561498.953. Su primer autor es el autor de este sitio.*"
  },
  tags: ["Economía Circular", "Tratamiento de Agua", "Borra de Café", "Sostenibilidad", "Innovación", "Ciencia Ambiental", "SCG"],
  references: [
    {
      title: "Adsorción de Cr VI sobre residuos de café",
      url: "https://revistas.utadeo.edu.co/index.php/mutis/article/view/953",
      source: "Cubides-Guerrero, P. A. y Ramírez-Franco, J. H. (2014). Revista Mutis 4(2), 18-25, Universidad de Bogotá Jorge Tadeo Lozano. DOI 10.21789/22561498.953",
      description: "Estudio de adsorción de cromo VI sobre carbón activado comercial, carbón activado de residuos de café y residuo de café, con soluciones acuosas sintéticas a 5 µg/mL; adsorciones superiores al 95 %, ajuste a Freundlich y cinética de segundo orden. El primer autor es el autor de este sitio. Consultado el 2026-11-21.",
    },
  ],
  nextArticle: {
    slug: "desafios-mecanismos-tratamiento-aguas-riego",
    title: "Desafíos y Mecanismos de Tratamiento Avanzado para Aguas de Riego"
  }
});

export default article;
