"use client";

import React, { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-10 bg-gradient-to-br from-pink-400 via-pink-500 to-red-500 text-white">
      {/* Header */}
      <div className="w-full max-w-2xl mx-auto mb-6 md:mb-8 lg:mb-10">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 text-center">
          📊 Visualizador de Notas
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-center leading-relaxed max-w-md md:max-w-lg mx-auto">
          Carga, visualiza y analiza calificaciones estudiantiles de forma
          interactiva
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-10 w-full max-w-md md:max-w-lg">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${
            activeTab === "upload"
              ? "bg-red-600 hover:bg-red-700 shadow-lg"
              : "bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm"
          }`}
        >
          📤 Cargar
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${
            activeTab === "analytics"
              ? "bg-red-600 hover:bg-red-700 shadow-lg"
              : "bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm"
          }`}
        >
          📈 Análisis
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-md md:max-w-lg">
        {activeTab === "upload" && (
          <div className="p-6 md:p-8 lg:p-10 bg-white bg-opacity-10 backdrop-blur-md rounded-lg md:rounded-xl border-2 border-dashed border-white border-opacity-50 text-center hover:border-opacity-75 transition-all duration-200">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">📁</div>
            <p className="text-base md:text-lg leading-relaxed">
              Arrastra archivos CSV o Excel aquí
            </p>
            <p className="text-xs md:text-sm text-white text-opacity-75 mt-3 md:mt-4">
              Soporta: .csv, .xls, .xlsx
            </p>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="p-6 md:p-8 lg:p-10 bg-white bg-opacity-10 backdrop-blur-md rounded-lg md:rounded-xl">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">📊</div>
            <p className="text-base md:text-lg leading-relaxed">
              Visualiza gráficos de desempeño, distribuciones, tendencias y
              estadísticas detalladas
            </p>
            <ul className="mt-4 md:mt-6 space-y-2 text-sm md:text-base text-white text-opacity-90">
              <li>✓ Gráficos de distribución</li>
              <li>✓ Estadísticas por estudiante</li>
              <li>✓ Análisis de tendencias</li>
              <li>✓ Comparativas de desempeño</li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 md:mt-12 lg:mt-16 max-w-md md:max-w-lg text-center text-xs md:text-sm text-white text-opacity-80">
        <p>
          💡 Tip: Utiliza archivos en formato estándar para mejor compatibilidad
        </p>
      </div>
    </div>
  );
}
