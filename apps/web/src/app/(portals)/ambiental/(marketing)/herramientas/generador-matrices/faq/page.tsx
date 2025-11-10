import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes - Matrices EIA",
  description:
    "Respuestas a las preguntas más comunes sobre matrices de Evaluación de Impacto Ambiental: Leopold, Conesa y Battelle-Columbus.",
};

export default function FAQ() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "¿Qué es una matriz de evaluación de impacto ambiental?",
          a: "Es una herramienta metodológica que permite identificar, valorar y comparar los impactos ambientales de un proyecto mediante un sistema matricial que cruza acciones del proyecto con factores ambientales afectados.",
        },
        {
          q: "¿Cuál es la diferencia principal entre Leopold, Conesa y Battelle?",
          a: "Leopold es la más simple y visual (magnitud × importancia), Conesa usa 10 criterios para mayor detalle, y Battelle es completamente cuantitativa usando Unidades de Impacto Ambiental (UIA).",
        },
        {
          q: "¿Puedo usar estas matrices para cualquier tipo de proyecto?",
          a: "Sí, aunque cada matriz tiene fortalezas específicas. Leopold es ideal para infraestructura, Conesa para proyectos complejos que requieren detalle técnico, y Battelle para análisis cuantitativos y comparación de alternativas.",
        },
      ],
    },
    {
      category: "Matriz de Leopold",
      questions: [
        {
          q: "¿Qué significa el signo en la magnitud de Leopold?",
          a: "El signo indica si el impacto es positivo (+) o negativo (-). La magnitud va de -10 a +10, donde el valor absoluto indica la intensidad del impacto.",
        },
        {
          q: "¿Cómo se interpreta la significancia (S)?",
          a: "S = |Magnitud| × Importancia. Valores altos (>80) indican impactos muy significativos que requieren atención especial. Valores bajos (<20) son menos relevantes.",
        },
        {
          q: "¿Puedo modificar los valores de magnitud e importancia después?",
          a: "Sí, las matrices en esta herramienta son interactivas. Puedes ajustar los valores y ver cómo cambia la significancia en tiempo real.",
        },
      ],
    },
    {
      category: "Matriz de Conesa",
      questions: [
        {
          q: "¿Qué significan los 10 atributos de Conesa?",
          a: "IN (Intensidad), EX (Extensión), MO (Momento), PE (Persistencia), RV (Reversibilidad), SI (Sinergia), AC (Acumulación), EF (Efecto), PR (Periodicidad), MC (Recuperabilidad). Cada uno evalúa un aspecto diferente del impacto.",
        },
        {
          q: "¿Cómo se interpretan las categorías de Conesa?",
          a: "Irrelevante (I<25): compatible, no requiere medidas. Moderado (25-49): requiere prevención. Severo (50-74): requiere corrección. Crítico (≥75): prohibitivo sin compensación.",
        },
        {
          q: "¿Por qué algunos criterios tienen más peso en la fórmula?",
          a: "La Intensidad (×3) y Extensión (×2) tienen mayor peso porque son los factores más determinantes del impacto. La fórmula refleja su importancia relativa.",
        },
      ],
    },
    {
      category: "Sistema Battelle",
      questions: [
        {
          q: "¿Qué son las Unidades de Importancia del Parámetro (UIP)?",
          a: "Son pesos relativos asignados a cada parámetro ambiental (1-1000) que reflejan su importancia en el sistema ambiental evaluado.",
        },
        {
          q: "¿Cómo se calcula el UIA?",
          a: "UIA = UIP × (Calidad_con_proyecto - Calidad_sin_proyecto). Puede ser positivo (mejora) o negativo (deterioro).",
        },
        {
          q: "¿Qué significa la escala de calidad (1-4)?",
          a: "1 = Muy mala, 2 = Mala, 3 = Regular, 4 = Buena. Esta escala simplificada facilita la evaluación manteniendo la objetividad.",
        },
      ],
    },
    {
      category: "Uso de la Herramienta",
      questions: [
        {
          q: "¿Cómo exporto los resultados de mi matriz?",
          a: "En cada matriz completada encontrarás botones de exportación en formatos PDF, Excel (XLSX) y CSV para análisis posterior o inclusión en informes.",
        },
        {
          q: "¿Se guardan mis matrices automáticamente?",
          a: "Actualmente la herramienta funciona en modo educativo sin guardar datos en servidor. Te recomendamos exportar tus matrices una vez completadas.",
        },
        {
          q: "¿Puedo comparar diferentes matrices para el mismo proyecto?",
          a: "Sí, puedes construir Leopold, Conesa y Battelle para el mismo caso de estudio y comparar los resultados para tener una evaluación más robusta.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h1>
        <p className="text-lg text-gray-700">
          Encuentra respuestas a las dudas más comunes sobre las matrices de EIA
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((section, sectionIdx) => (
          <div key={sectionIdx} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              {section.category}
            </h2>
            <div className="space-y-6">
              {section.questions.map((faq, faqIdx) => (
                <div
                  key={faqIdx}
                  className="border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <h3 className="font-semibold text-lg mb-2 flex items-start">
                    <span className="text-blue-600 mr-2">Q:</span>
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 ml-7">
                    <span className="text-green-600 font-semibold mr-2">
                      A:
                    </span>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3">
          ¿No encontraste tu respuesta?
        </h3>
        <p className="text-gray-700 mb-4">
          Revisa las referencias técnicas en cada página de matriz para
          profundizar en los fundamentos metodológicos.
        </p>
        <div className="flex gap-3">
          <a
            href="./matrices"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Ver matrices
          </a>
          <a
            href="./selector"
            className="inline-block bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
          >
            Selector de matriz
          </a>
        </div>
      </div>
    </div>
  );
}
