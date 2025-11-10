import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selector de Matriz EIA - Encuentra la Metodología Ideal",
  description:
    "¿No sabes qué matriz EIA usar? Responde 3 preguntas sobre tu proyecto y descubre si Leopold, Conesa o Battelle-Columbus es la mejor opción para tu evaluación ambiental.",
  keywords: [
    "selector matriz EIA",
    "elegir matriz ambiental",
    "comparar metodologías EIA",
  ],
  openGraph: {
    title: "Selector de Matriz EIA - Encuentra la Metodología Ideal",
    description:
      "Encuentra la matriz EIA perfecta para tu proyecto en 3 preguntas",
  },
};

export default function Selector() {
  const questions = [
    {
      id: "complexity",
      question: "¿Qué tan complejo es tu proyecto?",
      options: [
        {
          text: "Simple (infraestructura básica, pocos impactos)",
          recommendation: "leopold",
          points: { leopold: 3, conesa: 1, battelle: 0 },
        },
        {
          text: "Moderado (múltiples componentes, impactos diversos)",
          recommendation: "conesa",
          points: { leopold: 1, conesa: 3, battelle: 1 },
        },
        {
          text: "Complejo (gran escala, múltiples fases)",
          recommendation: "battelle",
          points: { leopold: 0, conesa: 2, battelle: 3 },
        },
      ],
    },
    {
      id: "sector",
      question: "¿A qué sector pertenece tu proyecto?",
      options: [
        {
          text: "Infraestructura/Construcción",
          recommendation: "leopold",
          points: { leopold: 3, conesa: 2, battelle: 1 },
        },
        {
          text: "Minería/Energía",
          recommendation: "conesa",
          points: { leopold: 1, conesa: 3, battelle: 2 },
        },
        {
          text: "Industria/Química",
          recommendation: "battelle",
          points: { leopold: 0, conesa: 2, battelle: 3 },
        },
        {
          text: "Agricultura/Turismo",
          recommendation: "leopold",
          points: { leopold: 2, conesa: 3, battelle: 1 },
        },
      ],
    },
    {
      id: "purpose",
      question: "¿Cuál es el propósito principal de tu evaluación?",
      options: [
        {
          text: "Aprendizaje/Educación",
          recommendation: "leopold",
          points: { leopold: 3, conesa: 2, battelle: 1 },
        },
        {
          text: "Estudio técnico profesional",
          recommendation: "conesa",
          points: { leopold: 1, conesa: 3, battelle: 2 },
        },
        {
          text: "Análisis económico/Comparación de alternativas",
          recommendation: "battelle",
          points: { leopold: 0, conesa: 1, battelle: 3 },
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Selector de Matriz EIA</h1>
        <p className="text-lg text-gray-700">
          Responde estas preguntas para encontrar la matriz más adecuada para tu
          proyecto
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q.id} className="border-b pb-6 last:border-b-0">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                {q.question}
              </h3>
              <div className="grid gap-3 ml-11">
                {q.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        →{" "}
                        {option.recommendation.charAt(0).toUpperCase() +
                          option.recommendation.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">
            Recomendaciones rápidas por sector:
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white rounded border">
              <div className="font-medium text-blue-700">Leopold</div>
              <div className="text-gray-600">
                Infraestructura, vías, construcción
              </div>
            </div>
            <div className="p-3 bg-white rounded border">
              <div className="font-medium text-green-700">Conesa</div>
              <div className="text-gray-600">Minería, energía, industria</div>
            </div>
            <div className="p-3 bg-white rounded border">
              <div className="font-medium text-purple-700">Battelle</div>
              <div className="text-gray-600">
                Grandes obras, análisis cuantitativo
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="./matrices/leopold"
          className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 text-center transition-colors"
        >
          <h3 className="font-bold text-blue-700 text-lg mb-2">
            Elegir Leopold
          </h3>
          <p className="text-blue-600 text-sm">Matriz simple y educativa</p>
        </Link>

        <Link
          href="./matrices/conesa"
          className="bg-green-50 hover:bg-green-100 rounded-lg p-6 text-center transition-colors"
        >
          <h3 className="font-bold text-green-700 text-lg mb-2">
            Elegir Conesa
          </h3>
          <p className="text-green-600 text-sm">Evaluación multicriterio</p>
        </Link>

        <Link
          href="./matrices/battelle"
          className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 text-center transition-colors"
        >
          <h3 className="font-bold text-purple-700 text-lg mb-2">
            Elegir Battelle
          </h3>
          <p className="text-purple-600 text-sm">Sistema cuantitativo</p>
        </Link>
      </div>
    </div>
  );
}
