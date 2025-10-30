"use client";

import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          Cómo la IA Filtra Respuestas
        </h1>
        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
          Descubre cómo los modelos de lenguaje filtran y moderan sus respuestas
          utilizando técnicas avanzadas de alineación y seguridad.
        </p>
        <div className="bg-slate-700 bg-opacity-50 p-6 rounded-lg border border-cyan-400 border-opacity-30">
          <p className="text-gray-400 text-sm">
            Esta herramienta educativa está siendo preparada. Vuelve pronto para
            explorar cómo funcionan los mecanismos de filtrado en IA.
          </p>
        </div>
      </div>
    </div>
  );
}
