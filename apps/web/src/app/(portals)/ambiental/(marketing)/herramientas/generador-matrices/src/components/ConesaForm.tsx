'use client';
import React, { useState, useEffect } from 'react';
import { ImpactoBase, ConesaImpact } from '../types';
import { computeConesa } from '../lib/matrices';
import ExportButtons from './ExportButtons';

export default function ConesaForm({ impactos }: { impactos: ImpactoBase[] }) {
  const [conesaImpacts, setConesaImpacts] = useState<ConesaImpact[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on client side only
  React.useEffect(() => {
    const initialData = impactos.map((imp, i) => computeConesa({
      impactoId: imp.id,
      signo: imp.signo,
      IN: Math.floor(Math.random() * 8) + 1,
      EX: Math.floor(Math.random() * 4) + 1,
      MO: Math.floor(Math.random() * 4) + 1,
      PE: Math.floor(Math.random() * 4) + 1,
      RV: Math.floor(Math.random() * 4) + 1,
      SI: Math.floor(Math.random() * 4) + 1,
      AC: Math.floor(Math.random() * 4) + 1,
      EF: Math.floor(Math.random() * 4) + 1,
      PR: Math.floor(Math.random() * 4) + 1,
      MC: Math.floor(Math.random() * 4) + 1
    }));
    setConesaImpacts(initialData);
    setIsInitialized(true);
  }, [impactos]);

  const updateImpact = (impactoId: string, field: keyof ConesaImpact, value: any) => {
    setConesaImpacts(prev => prev.map(impact => {
      if (impact.impactoId === impactoId) {
        const updated = { ...impact, [field]: value };
        return computeConesa(updated);
      }
      return impact;
    }));
  };

  const criteriaLabels = {
    IN: 'Intensidad',
    EX: 'Extensión', 
    MO: 'Momento',
    PE: 'Persistencia',
    RV: 'Reversibilidad',
    SI: 'Sinergia',
    AC: 'Acumulación',
    EF: 'Efecto',
    PR: 'Periodicidad',
    MC: 'Recuperabilidad'
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'Crítico': return 'bg-red-100 text-red-800 border-red-200';
      case 'Severo': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const impactosCriticos = conesaImpacts.filter(i => i.categoria === 'Crítico');
  const impactosSeveros = conesaImpacts.filter(i => i.categoria === 'Severo');

  // Show loading state during hydration
  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-bold mb-2 text-lg">Matriz de Conesa</h3>
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
      <div className="bg-green-50 rounded-lg p-4">
        <h3 className="font-bold mb-2 text-lg">Matriz de Conesa</h3>
        <p className="text-sm text-gray-700 mb-4">
          Evaluación multicriterio con 10 atributos. Cada impacto se calcula con la fórmula: 
          <strong> I = 3×IN + 2×EX + MO + PE + RV + SI + AC + EF + PR + MC</strong>
        </p>
        
        <div className="grid md:grid-cols-4 gap-3 text-sm">
          {Object.entries({
            'Crítico': conesaImpacts.filter(i => i.categoria === 'Crítico').length,
            'Severo': conesaImpacts.filter(i => i.categoria === 'Severo').length,
            'Moderado': conesaImpacts.filter(i => i.categoria === 'Moderado').length,
            'Irrelevante': conesaImpacts.filter(i => i.categoria === 'Irrelevante').length
          }).map(([cat, count]) => (
            <div key={cat} className={`p-3 rounded border ${getCategoryColor(cat)}`}>
              <div className="font-semibold">{cat}:</div>
              <div className="text-xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {conesaImpacts.map((impact, index) => (
          <div key={impact.impactoId} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-medium">Impacto #{index + 1}</div>
                <div className="text-sm text-gray-600">ID: {impact.impactoId}</div>
              </div>
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(impact.categoria)}`}>
                  {impact.categoria}
                </div>
                <div className="text-2xl font-bold text-primary mt-1">I = {impact.I}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {Object.entries(criteriaLabels).map(([key, label]) => (
                <div key={key} className="text-center">
                  <label className="block text-xs font-medium mb-1">{label}</label>
                  <select 
                    aria-label={`${label} impacto ${impact.impactoId}`}
                    value={impact[key as keyof ConesaImpact] as number}
                    onChange={(e) => updateImpact(impact.impactoId, key as keyof ConesaImpact, parseInt(e.target.value))}
                    className="w-full text-sm border rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
                  >
                    {key === 'IN' && [1,2,4,8,12].map(v => <option key={v} value={v}>{v}</option>)}
                    {key === 'EX' && [1,2,4,8].map(v => <option key={v} value={v}>{v}</option>)}
                    {!['IN', 'EX'].includes(key) && [1,2,4].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">{key}</div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-gray-50 rounded text-sm">
              <strong>Cálculo:</strong> I = 3×{impact.IN} + 2×{impact.EX} + {impact.MO} + {impact.PE} + {impact.RV} + {impact.SI} + {impact.AC} + {impact.EF} + {impact.PR} + {impact.MC} = <span className="font-bold">{impact.I}</span>
            </div>
          </div>
        ))}
      </div>

      {(impactosCriticos.length > 0 || impactosSeveros.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Impactos que requieren atención especial</h4>
          <div className="text-sm space-y-1">
            {impactosCriticos.length > 0 && (
              <div><strong>Críticos ({impactosCriticos.length}):</strong> Requieren medidas de compensación obligatorias</div>
            )}
            {impactosSeveros.length > 0 && (
              <div><strong>Severos ({impactosSeveros.length}):</strong> Requieren medidas de mitigación robustas</div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Interpretación de categorías</h4>
        <div className="text-sm space-y-1">
          <div>• <strong>Irrelevante ({'<'}25):</strong> Compatible, no requiere medidas</div>
          <div>• <strong>Moderado (25-49):</strong> Requiere medidas preventivas</div>
          <div>• <strong>Severo (50-74):</strong> Requiere medidas correctivas</div>
          <div>• <strong>Crítico (≥75):</strong> Prohibitivo sin medidas compensatorias</div>
        </div>
      </div>

      {/* Exportación */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">📄 Exportar Matriz Conesa</h4>
        <ExportButtons 
          matrixType="conesa" 
          caseId="vias" 
          data={conesaImpacts}
        />
      </div>
    </div>
  );
}
