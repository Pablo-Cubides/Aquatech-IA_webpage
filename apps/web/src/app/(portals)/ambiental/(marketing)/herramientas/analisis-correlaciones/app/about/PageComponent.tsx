import React from "react"

export default function AboutPage() {
  return (
    <section className="max-w-2xl w-full mx-auto bg-white rounded-lg shadow p-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-primary mb-2">Acerca de Relational Insight</h1>
      <p>
        <strong>Relational Insight</strong> es una herramienta para analizar correlaciones entre columnas numéricas de archivos CSV o Excel. Permite identificar relaciones fuertes, moderadas o débiles entre variables, usando varios métodos estadísticos reconocidos.
      </p>
      <div>
        <h2 className="text-lg font-semibold mb-1">¿Qué métodos de correlación se usan?</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Pearson:</strong> Mide la relación lineal entre dos variables numéricas. Valores cercanos a 1 o -1 indican una relación lineal fuerte.
          </li>
          <li>
            <strong>Spearman:</strong> Evalúa la relación monótona (no necesariamente lineal) entre dos variables, usando los rangos de los datos.
          </li>
          <li>
            <strong>Kendall Tau:</strong> Mide la concordancia en el orden de los valores entre dos variables. Es robusto ante valores atípicos y útil para relaciones no lineales.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-1">¿Cómo interpretar los colores?</h2>
        <ul className="list-disc ml-6">
          <li><span className="text-blue-600">🔵 Fuerte (&gt; 0.75)</span></li>
          <li><span className="text-yellow-600">🟡 Moderada (0.4–0.75)</span></li>
          <li><span className="text-red-600">🔴 Débil (&lt; 0.4)</span></li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-1">Créditos</h2>
        <p>
          Desarrollado por <strong>pacub</strong> usando Next.js, FastAPI, Pandas, SciPy y Tailwind CSS.<br />
          Código abierto y disponible para la comunidad.
        </p>
      </div>
    </section>
  )
}
