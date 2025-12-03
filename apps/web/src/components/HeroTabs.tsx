"use client";
import React, { useState } from "react";

interface KnowledgeData {
  fundamentos?: Array<{ text?: string }>;
}

interface HeroTabsProps {
  knowledge: KnowledgeData;
}

export default function HeroTabs({ knowledge }: HeroTabsProps) {
  const [tab, setTab] = useState<"fundamentos" | "matrices" | "casos">(
    "fundamentos",
  );

  return (
    <div className="space-y-8">
      <div className="p-8 bg-white rounded-lg shadow">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/images/Portal ambiental/Herramientas/MatrizIA.png"
              alt="Matriz IA"
              className="object-contain w-auto h-64"
            />
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setTab("fundamentos")}
              className={`px-6 py-3 rounded-lg text-lg ${tab === "fundamentos" ? "bg-blue-600 text-white" : "border-2 border-gray-300 hover:border-blue-600"}`}
            >
              Fundamentos
            </button>
            <button
              onClick={() => setTab("matrices")}
              className={`px-6 py-3 rounded-lg text-lg ${tab === "matrices" ? "bg-blue-600 text-white" : "border-2 border-gray-300 hover:border-blue-600"}`}
            >
              Matrices
            </button>
            <button
              onClick={() => setTab("casos")}
              className={`px-6 py-3 rounded-lg text-lg ${tab === "casos" ? "bg-blue-600 text-white" : "border-2 border-gray-300 hover:border-blue-600"}`}
            >
              Casos
            </button>
          </div>

          <div className="p-6 text-left rounded-lg bg-gray-50">
            {tab === "fundamentos" && (
              <div>
                <h3 className="mb-4 text-2xl font-semibold">
                  ¿Qué son las matrices de EIA?
                </h3>
                <div className="overflow-auto leading-relaxed text-gray-700 max-h-64">
                  {knowledge.fundamentos?.[0]?.text?.slice(0, 1500) ??
                    "Las matrices de Evaluación de Impacto Ambiental son herramientas sistemáticas que permiten identificar, valorar y comparar los efectos ambientales de un proyecto sobre los factores del medio ambiente."}
                </div>
              </div>
            )}

            {tab === "matrices" && (
              <div>
                <h3 className="mb-4 text-2xl font-semibold">
                  Tipos de matrices EIA
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-lg font-bold">Leopold</h4>
                    <p className="mt-2 text-sm text-gray-600">
                      Matriz cuali-cuantitativa clásica. Magnitud (-10 a +10) e
                      Importancia (1-10).
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-lg font-bold">Conesa</h4>
                    <p className="mt-2 text-sm text-gray-600">
                      Evaluación multicriterio con 10 atributos. Más detallada y
                      precisa.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-lg font-bold">Battelle-Columbus</h4>
                    <p className="mt-2 text-sm text-gray-600">
                      Sistema por parámetros con UIP y calidades. Enfoque
                      cuantitativo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tab === "casos" && (
              <div>
                <h3 className="mb-4 text-2xl font-semibold">
                  Casos de estudio
                </h3>
                <p className="text-gray-700">
                  Aprende con casos reales de diferentes sectores:
                  infraestructura, minería, agricultura y turismo. Cada caso
                  incluye factores sensibles específicos del sector.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 text-center text-white rounded-lg bg-gradient-to-r from-blue-600 to-green-600">
        <h2 className="mb-4 text-2xl font-bold">¿Listo para empezar?</h2>
        <p className="mb-6 text-lg">
          Sigue nuestro proceso paso a paso para dominar las matrices de EIA
        </p>
        <a
          href="/ambiental/herramientas/generador-matrices/matrices"
          className="inline-block px-8 py-3 text-lg font-semibold text-blue-600 transition-shadow bg-white rounded-lg hover:shadow-lg"
        >
          Siguiente: Conocer las matrices →
        </a>
      </div>
    </div>
  );
}
