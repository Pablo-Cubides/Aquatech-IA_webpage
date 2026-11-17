import { blogArticleSchema } from "@ia-next/contracts";
import type { BlogArticle } from "@ia-next/contracts";

// Migrado verbatim desde new-ambiental-articles.ts (ARQ-007). Se valida contra el contrato al cargar el modulo:
// un incumplimiento rompe el build, a proposito. No relajes los topes del esquema para que pase.
const article: BlogArticle = blogArticleSchema.parse({
  slug: "superpoder-borra-cafe-limpiar-agua",
  title: "De tu taza al grifo: El \"superpoder\" oculto de la borra de café para limpiar el agua",
  category: "Nuevas Tecnologías Ambientales",
  date: "2026-04-07",
  readTime: 5,
  excerpt: "La borra de café puede ayudar a eliminar nitratos y cromo del agua. Qué dice la química ambiental sobre este residuo cotidiano.",
  heroImage: "/images/portal-ambiental/blog/cafe-filtro.png",
  author: {
    name: "Pablo Cubides",
    avatar: "/images/portal-ambiental/autor/pablo-cubides.jpg",
    bio: "Científico ambiental, Ingeniero Químico y M.Sc. en Ingeniería Ambiental. Docente e investigador especializado en gestión integral del recurso hídrico.",
  },
  content: {
    introduction: "¿Sabías que cada vez que preparas un café, estás desechando una de las herramientas más poderosas de la química ambiental? Lo que tú llamas \"desecho\" o borra de café (SCG, por sus siglas en inglés), la ciencia lo llama bioadsorbente de alto rendimiento.\n\nA nivel mundial, producimos más de 6 millones de toneladas de este residuo al año. Pero, ¿y si te dijera que este residuo tiene la clave para eliminar contaminantes letales como los nitratos de la agricultura y el cromo hexavalente de la industria?",
    sections: [
      {
        id: "quimica-esponja-negra",
        title: "🧪 La Química detrás de la \"Esponja\" Negra",
        content: "No es magia, es ciencia de superficies. La borra de café no es solo polvo quemado; es una estructura lignocelulósica ultra-porosa rica en celulosa, lignina y grupos funcionales clave como:\n\n*   Hidroxilos (–OH)\n*   Carboxilos (–COOH)\n*   Aminas (N–H)\n\nEstos grupos actúan como \"imanes químicos\" que atrapan metales y aniones mientras el agua fluye a través de ellos."
      },
      {
        id: "desafio-nitratos",
        title: "🚫 El Desafío de los Nitratos (NO3-)",
        content: "La contaminación por nitratos es una bomba de tiempo silenciosa en nuestras zonas agrícolas, causando desde la degradación de ecosistemas (eutrofización) hasta problemas graves de salud como la metahemoglobinemia en bebés.\n\n**¿Cómo lo soluciona el café?**\nLa investigación más reciente (2020-2025) revela que no basta con usar la borra cruda. Para los nitratos, la clave es la activación:\n\n*   **Tratamiento con HCl (Ácido Clorhídrico):** Una concentración de 0.4 M prepara la superficie para atraer específicamente los aniones de nitrato.\n*   **Carbonización a Baja Temperatura:** Calentar la borra de café a solo 200 °C crea un biochar que mantiene intactos los grupos funcionales necesarios, logrando recuperaciones de nitratos superiores al 80%."
      },
      {
        id: "caso-cromo-vi",
        title: "🏭 El Caso del Cromo VI (Cr VI): ¡Más eficiente que el carbón comercial!",
        content: "Basado en estudios locales recientes realizados en la Universidad Nacional de Colombia, se ha demostrado que los residuos de café (o \"cunchos\") son una alternativa revolucionaria para limpiar ríos contaminados por curtiembres.\n\n**El hallazgo:** En pruebas comparativas, los residuos de café sin tratamiento costoso mostraron una capacidad de remoción de Cromo VI superior al 95%, ajustándose perfectamente al modelo de Freundlich.\n\n**El impacto:** Esto significa que podemos tratar aguas industriales con un material que hoy es gratuito, compitiendo codo a codo con carbones activados comerciales de alto costo.\n\nReferencia del estudio: [Repositorio UTadeo](https://expeditiorepositorio.utadeo.edu.co/entities/publication/110fcfae-def6-4dbb-a827-ed6ef84cc2b1)",
        callout: {
          type: "info",
          title: "Referencia Clave",
          content: "Para consultar el estudio sobre bioadsorbentes de Cromo VI a base de café, visita la investigación académica completa en el repositorio."
        }
      },
      {
        id: "innovacion-ia",
        title: "🤖 Innovación 2025: Inteligencia Artificial en el Laboratorio",
        content: "La frontera de esta investigación ya no es solo química, es digital. Se están utilizando modelos de Machine Learning (como Random Forest y Redes Neuronales) para predecir exactamente cuánta borra de café necesitas según el pH y la temperatura del agua.\n\n**Precisión asombrosa:** Estos modelos logran una exactitud superior al 90% (R² > 0.89), permitiendo optimizar plantas de tratamiento rurales sin necesidad de costosos experimentos de prueba y error."
      },
      {
        id: "datos-rapidos-eficiencia",
        title: "📊 Datos Rápidos: Café vs. El Mundo",
        content: "| Contaminante | Eficiencia con Café Modificado | Condición Óptima |\n| :--- | :--- | :--- |\n| **Nitratos (NO3-)** | 80.7% - 83.8% | pH ácido (3-4) |\n| **Cromo VI (Cr VI)** | > 95% | Tiempo de contacto 60 min |\n| **Plomo (Pb2+)** | 98% | Biochar optimizado |\n| **Colorantes (Azul Metileno)** | 100% | 6 ciclos de reutilización |"
      },
      {
        id: "preguntas-frecuentes",
        title: "Preguntas frecuentes",
        content: "Respuestas breves a las dudas más comunes sobre este tema.",
        subsections: [
          {
            id: "faq-1",
            title: "¿Por qué la borra de café sirve para limpiar agua?",
            content: "Es una estructura lignocelulósica muy porosa, rica en celulosa, lignina y grupos funcionales (hidroxilos, carboxilos y aminas) que actúan como imanes químicos y atrapan contaminantes.",
          },
          {
            id: "faq-2",
            title: "¿Qué contaminantes remueve y con qué eficiencia?",
            content: "Según los datos del artículo: nitratos entre 80,7 % y 83,8 % (pH ácido de 3 a 4), cromo VI por encima de 95 % (con 60 minutos de contacto), plomo 98 % (con biochar optimizado) y azul de metileno 100 %.",
          },
          {
            id: "faq-3",
            title: "¿Cuánta borra de café se genera?",
            content: "A escala mundial se producen más de 6 millones de toneladas al año de este residuo.",
          },
          {
            id: "faq-4",
            title: "¿Cómo ayuda la inteligencia artificial en esta investigación?",
            content: "Se usan modelos de machine learning, como Random Forest y redes neuronales, para predecir cuánta borra de café se necesita según el pH y la temperatura del agua.",
          },
        ],
      },
    ],
    conclusion: "🌍 **Sostenibilidad y Futuro**\nImplementar filtros de borra de café no solo limpia el agua; reduce la huella de carbono de la industria cafetalera y evita que los residuos orgánicos terminen en vertederos produciendo gases de efecto invernadero.\n\n¿El siguiente paso? Proyectos comunitarios y \"CoffeeBots\" (nanopartículas magnéticas de café) que ya están siendo probados para limpiar microplásticos y aceites en el mar.\n\n💡 **Conclusión**\nLa próxima vez que disfrutes tu café, mira esos restos negros con otros ojos. No son basura; son la tecnología de limpieza hídrica del futuro: barata, sostenible y ultra-eficiente.\n\n¿Te interesa la ciencia ambiental? ¡Comparte este post y ayudemos a que la economía circular llegue a cada taza!\n\n*Este artículo se basa en investigaciones académicas publicadas entre 2014 y 2025 en revistas como Revista Mutis, MDPI, SciELO y Frontiers in Chemical Engineering.*"
  },
  tags: ["Economía Circular", "Tratamiento de Agua", "Borra de Café", "Sostenibilidad", "Innovación", "Ciencia Ambiental", "SCG"],
  nextArticle: {
    slug: "desafios-mecanismos-tratamiento-aguas-riego",
    title: "Desafíos y Mecanismos de Tratamiento Avanzado para Aguas de Riego"
  }
});

export default article;
