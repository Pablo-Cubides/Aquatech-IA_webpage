import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matrices de EIA - Leopold, Conesa y Battelle",
  description:
    "Conoce las tres metodologías principales de Evaluación de Impacto Ambiental: Matriz Leopold, Matriz Conesa y Sistema Battelle-Columbus. Aprende cuándo usar cada una.",
  keywords: [
    "matriz leopold",
    "matriz conesa",
    "battelle columbus",
    "metodologías EIA",
    "evaluación ambiental",
  ],
  openGraph: {
    title: "Matrices de EIA - Leopold, Conesa y Battelle",
    description:
      "Conoce las tres metodologías principales de Evaluación de Impacto Ambiental",
  },
};

export default function MatricesPage() {
  const matrices = [
    {
      id: "leopold",
      title: "Matriz de Leopold",
      description:
        "La matriz clásica de evaluación de impacto ambiental, desarrollada en 1971. Utiliza una aproximación bidimensional con magnitud e importancia.",
      characteristics: [
        "Evaluación cualitativa y cuantitativa",
        "Magnitud: -10 a +10 (con signo)",
        "Importancia: 1 a 10",
        "Significancia = |Magnitud| × Importancia",
        "Fácil de entender y aplicar",
      ],
      whenToUse:
        "Ideal para proyectos de infraestructura, evaluaciones rápidas y cuando se requiere una aproximación sencilla.",
      sectors: ["Infraestructura", "Construcción", "Vías", "Urbanismo"],
    },
    {
      id: "conesa",
      title: "Matriz de Conesa",
      description:
        "Metodología española multicriterio que evalúa impactos mediante 10 atributos diferentes para mayor precisión.",
      characteristics: [
        "Evaluación multicriterio detallada",
        "Intensidad (IN), Extensión (EX), Momento (MO), etc.",
        "Fórmula: I = 3×IN + 2×EX + MO + PE + RV + SI + AC + EF + PR + MC",
        "Categorización: Irrelevante, Moderado, Severo, Crítico",
        "Mayor objetividad y detalle",
      ],
      whenToUse:
        "Recomendada para proyectos complejos, estudios detallados y cuando se requiere justificación técnica robusta.",
      sectors: ["Minería", "Energía", "Industria", "Grandes obras"],
    },
    {
      id: "battelle",
      title: "Sistema Battelle-Columbus",
      description:
        "Sistema cuantitativo desarrollado para evaluar impactos mediante parámetros ambientales con pesos relativos.",
      characteristics: [
        "Enfoque completamente cuantitativo",
        "Unidades de Importancia del Parámetro (UIP)",
        "Calidad ambiental sin y con proyecto (1-4)",
        "UIA = UIP × (Calidad_con - Calidad_sin)",
        "Agregación por categorías ambientales",
      ],
      whenToUse:
        "Ideal para proyectos que requieren análisis cuantitativo detallado y comparación económica de alternativas.",
      sectors: [
        "Grandes represas",
        "Centrales eléctricas",
        "Complejos industriales",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Tipos de Matrices EIA</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Existen diferentes metodologías para evaluar impactos ambientales.
          Cada una tiene sus fortalezas y es más adecuada para ciertos tipos de
          proyectos.
        </p>
      </div>

      <div className="grid gap-8">
        {matrices.map((matrix, index) => (
          <div key={matrix.id} className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  {matrix.title}
                </h2>
                <p className="text-gray-700 text-lg">{matrix.description}</p>
              </div>
              <div className="text-4xl font-bold text-gray-300">
                {index + 1}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Características principales
                </h3>
                <ul className="space-y-2">
                  {matrix.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Cuándo usarla</h3>
                <p className="text-gray-700 mb-4">{matrix.whenToUse}</p>

                <h4 className="font-medium mb-2">Sectores típicos:</h4>
                <div className="flex flex-wrap gap-2">
                  {matrix.sectors.map((sector, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Link
                href={`./matrices/${matrix.id}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Conocer más sobre {matrix.title} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          ¿No estás seguro cuál elegir?
        </h2>
        <p className="text-lg mb-6">
          Usa nuestro selector inteligente para encontrar la matriz más adecuada
          para tu proyecto
        </p>
        <Link
          href="./selector"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Siguiente: Selector de matrices →
        </Link>
      </div>
    </div>
  );
}
