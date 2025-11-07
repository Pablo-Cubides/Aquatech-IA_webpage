import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generador de Matrices EIA | Aquatech IA",
  description:
    "Herramienta educativa para aprender y construir matrices de evaluación ambiental",
};

export default function GeneradorPage() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-[#0077B6] mb-4">
          Generador de Matrices de EIA
        </h1>
        <p className="text-lg text-[#666666] max-w-2xl mx-auto">
          Herramienta educativa interactiva para aprender, construir y comparar
          matrices de Evaluación de Impacto Ambiental
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-xl font-semibold mb-2 text-[#0077B6]">
            Tres Metodologías
          </h3>
          <p className="text-gray-600">Leopold, Conesa y Battelle-Columbus</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-4xl mb-3">🔨</div>
          <h3 className="text-xl font-semibold mb-2 text-[#0077B6]">
            Constructor Interactivo
          </h3>
          <p className="text-gray-600">Paso a paso con guías completas</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-xl font-semibold mb-2 text-[#0077B6]">
            Comparación Visual
          </h3>
          <p className="text-gray-600">Analiza metodologías simultáneamente</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#0077B6] to-[#10B981] rounded-lg p-8 text-white text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="./selector"
            className="bg-white text-[#0077B6] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Usar Selector
          </a>
          <a
            href="./builder/vias/leopold"
            className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-30"
          >
            Ir a Leopold
          </a>
        </div>
      </div>
    </div>
  );
}
