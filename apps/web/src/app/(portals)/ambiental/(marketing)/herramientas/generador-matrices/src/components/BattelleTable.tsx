'use client';
import React, { useState, useEffect } from 'react';
import { ImpactoBase, BattelleImpact, BattelleCategory } from '../types';
import { computeBattelle } from '../lib/matrices';
import ExportButtons from './ExportButtons';

export default function BattelleTable({ impactos }: { impactos: ImpactoBase[] }) {
  const categories: BattelleCategory[] = ['FÍSICO-QUÍMICO', 'BIOLÓGICO', 'CULTURAL', 'ECOLÓGICO-ESTÉTICO'];
  
  const [battelleImpacts, setBattelleImpacts] = useState<BattelleImpact[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on client side only
  useEffect(() => {
    const initialData = impactos.map((imp, i) => computeBattelle({
      impactoId: imp.id,
      categoria: categories[i % 4],
      uip: 50 + Math.floor(Math.random() * 50),
      calidad_sin: Math.floor(Math.random() * 4) + 1,
      calidad_con: Math.floor(Math.random() * 4) + 1
    }));
    setBattelleImpacts(initialData);
    setIsInitialized(true);
  }, [impactos]);

  const updateImpact = (impactoId: string, field: keyof BattelleImpact, value: any) => {
    setBattelleImpacts(prev => prev.map(impact => {
      if (impact.impactoId === impactoId) {
        const updated = { ...impact, [field]: value };
        return computeBattelle(updated);
      }
      return impact;
    }));
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'FÍSICO-QUÍMICO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BIOLÓGICO': return 'bg-green-100 text-green-800 border-green-200';
      case 'CULTURAL': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ECOLÓGICO-ESTÉTICO': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalSinProyecto = battelleImpacts.reduce((sum, imp) => sum + imp.pia_sin, 0);
  const totalConProyecto = battelleImpacts.reduce((sum, imp) => sum + imp.pia_con, 0);
  const impactoNeto = totalConProyecto - totalSinProyecto;

  const impactosPositivos = battelleImpacts.filter(i => i.uia > 0);
  const impactosNegativos = battelleImpacts.filter(i => i.uia < 0);

  // Show loading state during hydration
  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold mb-2 text-lg">Matriz de Battelle-Columbus</h3>
          <p className="text-sm text-gray-700 mb-4">Cargando matriz...</p>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-bold mb-2 text-lg">Matriz de Battelle-Columbus</h3>
        <p className="text-sm text-gray-700 mb-4">
          Sistema de evaluación por Unidades de Impacto Ambiental (UIA). 
          <strong> UIA = UIP × (calidad con proyecto - calidad sin proyecto)</strong>
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded p-3 border">
            <div className="text-sm text-gray-600">Total sin proyecto</div>
            <div className="text-xl font-bold text-gray-800">{totalSinProyecto.toFixed(0)} PIA</div>
          </div>
          <div className="bg-white rounded p-3 border">
            <div className="text-sm text-gray-600">Total con proyecto</div>
            <div className="text-xl font-bold text-gray-800">{totalConProyecto.toFixed(0)} PIA</div>
          </div>
          <div className={`rounded p-3 border ${impactoNeto >= 0 ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
            <div className="text-sm text-gray-600">Impacto neto</div>
            <div className={`text-xl font-bold ${impactoNeto >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              {impactoNeto >= 0 ? '+' : ''}{impactoNeto.toFixed(0)} UIA
            </div>
          </div>
          <div className="bg-white rounded p-3 border">
            <div className="text-sm text-gray-600">Factores evaluados</div>
            <div className="text-xl font-bold text-gray-800">{battelleImpacts.length}</div>
          </div>
        </div>
      </div>

      {/* Resumen por categorías */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map(cat => {
          const factores = battelleImpacts.filter(i => i.categoria === cat);
          const uiaTotal = factores.reduce((sum, f) => sum + f.uia, 0);
          return (
            <div key={cat} className={`p-3 rounded border ${getCategoryColor(cat)}`}>
              <div className="font-semibold text-xs">{cat}</div>
              <div className="text-lg font-bold">{uiaTotal >= 0 ? '+' : ''}{uiaTotal.toFixed(0)} UIA</div>
              <div className="text-xs">{factores.length} factores</div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-2 text-left">Factor Ambiental</th>
              <th className="border border-gray-300 p-2">Categoría</th>
              <th className="border border-gray-300 p-2">UIP</th>
              <th className="border border-gray-300 p-2">Cal. Sin</th>
              <th className="border border-gray-300 p-2">Cal. Con</th>
              <th className="border border-gray-300 p-2">PIA Sin</th>
              <th className="border border-gray-300 p-2">PIA Con</th>
              <th className="border border-gray-300 p-2">UIA</th>
            </tr>
          </thead>
          <tbody>
            {battelleImpacts.map((impact, index) => (
              <tr key={impact.impactoId} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-medium">
                  Factor #{index + 1}
                  <div className="text-xs text-gray-600">{impact.impactoId}</div>
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(impact.categoria)}`}>
                    {impact.categoria}
                  </span>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={impact.uip}
                    aria-label={`UIP impacto ${impact.impactoId}`}
                    onChange={(e) => updateImpact(impact.impactoId, 'uip', parseInt(e.target.value) || 1)}
                    className="w-20 text-center border rounded px-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <select
                    value={impact.calidad_sin}
                    aria-label={`Calidad sin proyecto impacto ${impact.impactoId}`}
                    onChange={(e) => updateImpact(impact.impactoId, 'calidad_sin', parseFloat(e.target.value))}
                    className="w-full border rounded px-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
                  >
                    <option value={1}>1 - Muy mala</option>
                    <option value={2}>2 - Mala</option>
                    <option value={3}>3 - Regular</option>
                    <option value={4}>4 - Buena</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <select
                    value={impact.calidad_con}
                    aria-label={`Calidad con proyecto impacto ${impact.impactoId}`}
                    onChange={(e) => updateImpact(impact.impactoId, 'calidad_con', parseFloat(e.target.value))}
                    className="w-full border rounded px-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
                  >
                    <option value={1}>1 - Muy mala</option>
                    <option value={2}>2 - Mala</option>
                    <option value={3}>3 - Regular</option>
                    <option value={4}>4 - Buena</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2 text-center font-medium">
                  {impact.pia_sin.toFixed(0)}
                </td>
                <td className="border border-gray-300 p-2 text-center font-medium">
                  {impact.pia_con.toFixed(0)}
                </td>
                <td className={`border border-gray-300 p-2 text-center font-bold ${
                  impact.uia >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {impact.uia >= 0 ? '+' : ''}{impact.uia.toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={5} className="border border-gray-300 p-2 text-right">TOTALES:</td>
              <td className="border border-gray-300 p-2 text-center">{totalSinProyecto.toFixed(0)}</td>
              <td className="border border-gray-300 p-2 text-center">{totalConProyecto.toFixed(0)}</td>
              <td className={`border border-gray-300 p-2 text-center ${
                impactoNeto >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {impactoNeto >= 0 ? '+' : ''}{impactoNeto.toFixed(0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Análisis e interpretación */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">✓ Impactos Positivos ({impactosPositivos.length})</h4>
          <div className="text-sm space-y-1">
            {impactosPositivos.slice(0, 3).map(imp => (
              <div key={imp.impactoId}>
                Factor {imp.impactoId}: <strong>+{imp.uia.toFixed(0)} UIA</strong> ({imp.categoria})
              </div>
            ))}
            {impactosPositivos.length > 3 && (
              <div className="text-gray-600">... y {impactosPositivos.length - 3} más</div>
            )}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Impactos Negativos ({impactosNegativos.length})</h4>
          <div className="text-sm space-y-1">
            {impactosNegativos.slice(0, 3).map(imp => (
              <div key={imp.impactoId}>
                Factor {imp.impactoId}: <strong>{imp.uia.toFixed(0)} UIA</strong> ({imp.categoria})
              </div>
            ))}
            {impactosNegativos.length > 3 && (
              <div className="text-gray-600">... y {impactosNegativos.length - 3} más</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Interpretación del resultado</h4>
        <div className="text-sm space-y-2">
          <div>
            <strong>Impacto Neto Total:</strong> {impactoNeto >= 0 ? '+' : ''}{impactoNeto.toFixed(0)} UIA
          </div>
          <div>
            {impactoNeto > 0 && (
              <span className="text-green-700">✓ Proyecto con impacto ambiental neto positivo - Recomendable</span>
            )}
            {impactoNeto === 0 && (
              <span className="text-gray-700">⚖️ Proyecto equilibrado ambientalmente - Neutral</span>
            )}
            {impactoNeto < 0 && (
              <span className="text-red-700">⚠️ Proyecto con impacto ambiental neto negativo - Requiere medidas</span>
            )}
          </div>
          <div className="text-xs text-gray-600 pt-2">
            <strong>Nota:</strong> UIP = Unidades de Importancia del Parámetro (peso relativo 1-1000) | 
            PIA = Parámetros de Impacto Ambiental (UIP × Calidad) | 
            UIA = Unidades de Impacto Ambiental (diferencia entre PIA con/sin proyecto)
          </div>
        </div>
      </div>

      {/* Exportación */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">📄 Exportar Matriz Battelle-Columbus</h4>
        <ExportButtons 
          matrixType="battelle" 
          caseId="vias" 
          data={battelleImpacts}
        />
      </div>
    </div>
  );
}
