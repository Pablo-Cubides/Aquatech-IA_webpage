"use client";

export type AnalysisType = "correlation" | "growth" | "comparison" | "trend";

interface AnalysisTypeSelectorProps {
  selected: AnalysisType;
  onSelect: (type: AnalysisType) => void;
}

const analysisTypes = [
  {
    type: "correlation" as AnalysisType,
    icon: "📊",
    title: "Correlación",
    description: "Analiza la relación entre dos o más variables",
    methods: ["Pearson", "Spearman", "Kendall"],
  },
  {
    type: "growth" as AnalysisType,
    icon: "📈",
    title: "Crecimiento",
    description: "Calcula tasas de crecimiento anual y tendencias",
    methods: ["% Anual", "CAGR", "Variación"],
  },
  {
    type: "comparison" as AnalysisType,
    icon: "🔄",
    title: "Comparación",
    description: "Compara múltiples países o períodos temporales",
    methods: ["Multi-país", "Temporal", "Benchmarking"],
  },
  {
    type: "trend" as AnalysisType,
    icon: "📉",
    title: "Tendencia",
    description: "Identifica patrones y proyecciones futuras",
    methods: ["Regresión", "Media móvil", "Proyección"],
  },
];

export default function AnalysisTypeSelector({
  selected,
  onSelect,
}: AnalysisTypeSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Tipo de Análisis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analysisTypes.map((analysis) => (
          <button
            key={analysis.type}
            onClick={() => onSelect(analysis.type)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${
                selected === analysis.type
                  ? "border-[#00796B] bg-[#E0F2F1] shadow-md"
                  : "border-gray-200 hover:border-[#00796B] hover:bg-gray-50"
              }
            `}
          >
            {/* Icon */}
            <div className="text-3xl mb-2">{analysis.icon}</div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 mb-1">
              {analysis.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-3">
              {analysis.description}
            </p>

            {/* Methods */}
            <div className="flex flex-wrap gap-1">
              {analysis.methods.map((method) => (
                <span
                  key={method}
                  className={`
                    text-xs px-2 py-1 rounded
                    ${
                      selected === analysis.type
                        ? "bg-[#00796B] text-white"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Selected Badge */}
            {selected === analysis.type && (
              <div className="absolute top-2 right-2">
                <div className="bg-[#00796B] text-white text-xs font-bold px-2 py-1 rounded-full">
                  ✓
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">💡 Sugerencia:</span>{" "}
          {selected === "correlation" && "Ideal para descubrir relaciones entre variables ambientales y socioeconómicas."}
          {selected === "growth" && "Perfecto para evaluar el progreso temporal de indicadores específicos."}
          {selected === "comparison" && "Útil para comparar el desempeño entre diferentes países o regiones."}
          {selected === "trend" && "Excelente para identificar patrones históricos y realizar proyecciones."}
        </p>
      </div>
    </div>
  );
}
