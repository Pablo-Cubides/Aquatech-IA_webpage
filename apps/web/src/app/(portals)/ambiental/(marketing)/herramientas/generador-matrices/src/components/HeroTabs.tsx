'use client';
import React, { useState } from 'react';
import MatrixInfoCard from './MatrixInfoCard';
import CaseSelector from './CaseSelector';

export default function HeroTabs({ knowledge }: { knowledge: any }) {
  const [tab, setTab] = useState<'fundamentos'|'matrices'|'casos'>('fundamentos');
  const [selectedMatrix, setSelectedMatrix] = useState<'leopold'|'conesa'|'battelle'>('leopold');

  return (
    <div className="space-y-8">
      {/* Hero Section - Full Width */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">EIA Matrix Studio</h1>
          <p className="text-xl text-gray-700 mb-8">Herramienta educativa visual para aprender, construir y comparar matrices de Evaluación de Impacto Ambiental paso a paso.</p>
          
          <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => setTab('fundamentos')} className={`px-6 py-3 rounded-lg text-lg ${tab==='fundamentos' ? 'bg-primary text-white' : 'border-2 border-gray-300 hover:border-primary'}`}>Fundamentos</button>
            <button onClick={() => setTab('matrices')} className={`px-6 py-3 rounded-lg text-lg ${tab==='matrices' ? 'bg-primary text-white' : 'border-2 border-gray-300 hover:border-primary'}`}>Matrices</button>
            <button onClick={() => setTab('casos')} className={`px-6 py-3 rounded-lg text-lg ${tab==='casos' ? 'bg-primary text-white' : 'border-2 border-gray-300 hover:border-primary'}`}>Casos</button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            {tab === 'fundamentos' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">¿Qué son las matrices de EIA?</h3>
                <div className="text-gray-700 leading-relaxed max-h-64 overflow-auto">
                  {knowledge.fundamentos?.[0]?.text?.slice(0, 1500) ?? 'Las matrices de Evaluación de Impacto Ambiental son herramientas sistemáticas que permiten identificar, valorar y comparar los efectos ambientales de un proyecto sobre los factores del medio ambiente.'}
                </div>
              </div>
            )}

            {tab === 'matrices' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Tipos de matrices EIA</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-bold text-lg">Leopold</h4>
                    <p className="text-sm text-gray-600 mt-2">Matriz cuali-cuantitativa clásica. Magnitud (-10 a +10) e Importancia (1-10).</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-bold text-lg">Conesa</h4>
                    <p className="text-sm text-gray-600 mt-2">Evaluación multicriterio con 10 atributos. Más detallada y precisa.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-bold text-lg">Battelle-Columbus</h4>
                    <p className="text-sm text-gray-600 mt-2">Sistema por parámetros con UIP y calidades. Enfoque cuantitativo.</p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'casos' && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Casos de estudio</h3>
                <p className="text-gray-700">Aprende con casos reales de diferentes sectores: infraestructura, minería, agricultura y turismo. Cada caso incluye factores sensibles específicos del sector.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Siguiente Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
        <p className="text-lg mb-6">Sigue nuestro proceso paso a paso para dominar las matrices de EIA</p>
        <a href="/matrices" className="inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition-shadow">
          Siguiente: Conocer las matrices →
        </a>
      </div>
    </div>
  );
}
