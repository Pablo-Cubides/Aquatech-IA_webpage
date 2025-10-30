'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ImpactoBase, LeopoldCell } from '../types';
import { computeLeopoldCell } from '../lib/matrices';
import ExportButtons from './ExportButtons';

// Datos de ejemplo para acciones y factores
const sampleActions = [
  { id: 'A1', nombre: 'Excavación', fase: 'preoperativa' as const },
  { id: 'A2', nombre: 'Transporte', fase: 'operativa' as const },
  { id: 'A3', nombre: 'Construcción', fase: 'operativa' as const },
  { id: 'A4', nombre: 'Operación', fase: 'operativa' as const },
  { id: 'A5', nombre: 'Mantenimiento', fase: 'operativa' as const }
];

const sampleFactors = [
  { id: 'F1', nombre: 'Calidad del aire', medio: 'fisico' as const, sensibilidad: 'alta' as const },
  { id: 'F2', nombre: 'Ruido', medio: 'fisico' as const, sensibilidad: 'media' as const },
  { id: 'F3', nombre: 'Suelo', medio: 'fisico' as const, sensibilidad: 'alta' as const },
  { id: 'F4', nombre: 'Agua superficial', medio: 'fisico' as const, sensibilidad: 'alta' as const },
  { id: 'F5', nombre: 'Flora terrestre', medio: 'biotico' as const, sensibilidad: 'media' as const },
  { id: 'F6', nombre: 'Fauna terrestre', medio: 'biotico' as const, sensibilidad: 'alta' as const }
];

export default function LeopoldMatrix({ impactos }: { impactos: ImpactoBase[] }) {
  const matrixRef = useRef<HTMLDivElement>(null);
  const [leopoldCells, setLeopoldCells] = useState<LeopoldCell[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on client side only
  useEffect(() => {
    const initialData = sampleActions.flatMap(action => 
      sampleFactors.map(factor => {
        const impacto = impactos.find(i => i.actionId === action.id && i.factorId === factor.id);
        if (impacto) {
          const magnitud = impacto.signo === '+' ? Math.floor(Math.random() * 5) + 3 : -(Math.floor(Math.random() * 5) + 3);
          const importancia = Math.floor(Math.random() * 6) + 5;
          return computeLeopoldCell({ 
            impactoId: impacto.id, 
            magnitud, 
            importancia,
            S: 0 // Se calculará en computeLeopoldCell
          });
        }
        return null;
      })
    ).filter(Boolean) as LeopoldCell[];
    
    setLeopoldCells(initialData);
    setIsInitialized(true);
  }, [impactos]);

  const updateCell = (impactoId: string, field: 'magnitud' | 'importancia', value: number) => {
    setLeopoldCells(prev => prev.map(cell => {
      if (cell.impactoId === impactoId) {
        const updated = { ...cell, [field]: value };
        return computeLeopoldCell(updated);
      }
      return cell;
    }));
  };

  const getCellData = (actionId: string, factorId: string) => {
    const impacto = impactos.find(i => i.actionId === actionId && i.factorId === factorId);
    if (!impacto) return null;
    return leopoldCells.find(cell => cell.impactoId === impacto.id);
  };

  const getCellColor = (S: number) => {
    const abs = Math.abs(S);
    if (abs >= 80) return S > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white';
    if (abs >= 60) return S > 0 ? 'bg-green-400 text-white' : 'bg-red-400 text-white';
    if (abs >= 40) return S > 0 ? 'bg-green-200' : 'bg-red-200';
    if (abs >= 20) return S > 0 ? 'bg-green-100' : 'bg-red-100';
    return 'bg-gray-50';
  };

  const totalPositivos = leopoldCells.filter(c => c.S > 0).length;
  const totalNegativos = leopoldCells.filter(c => c.S < 0).length;
  const sumaAlgebraica = leopoldCells.reduce((sum, c) => sum + c.S, 0);

  // Show loading state during hydration
  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-bold mb-2 text-lg">📊 Matriz Leopold - Vista Completa</h3>
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
        <h3 className="font-bold mb-2 text-lg">📊 Matriz Leopold - Vista Completa</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded p-3 border">
            <div className="text-gray-600">Impactos Positivos</div>
            <div className="text-xl font-bold text-green-700">{totalPositivos}</div>
          </div>
          <div className="bg-white rounded p-3 border">
            <div className="text-gray-600">Impactos Negativos</div>
            <div className="text-xl font-bold text-red-700">{totalNegativos}</div>
          </div>
          <div className="bg-white rounded p-3 border">
            <div className="text-gray-600">Suma Algebraica</div>
            <div className={`text-xl font-bold ${sumaAlgebraica >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {sumaAlgebraica >= 0 ? '+' : ''}{sumaAlgebraica}
            </div>
          </div>
        </div>
      </div>

      {/* Matriz Leopold Real */}
      <div ref={matrixRef} className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-100 p-3 text-left font-semibold border-r border-b min-w-32">
                FACTORES AMBIENTALES ↓ / ACCIONES →
              </th>
              {sampleActions.map(action => (
                <th key={action.id} className="bg-gray-100 p-2 text-center border-b min-w-20 transform -rotate-45 origin-bottom">
                  <div className="whitespace-nowrap">{action.nombre}</div>
                  <div className="text-xs text-gray-600">({action.fase})</div>
                </th>
              ))}
              <th className="bg-blue-100 p-2 text-center border-b font-bold">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleFactors.map(factor => {
              const factorTotal = sampleActions.reduce((sum, action) => {
                const cell = getCellData(action.id, factor.id);
                return sum + (cell?.S || 0);
              }, 0);
              
              return (
                <tr key={factor.id} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white p-3 border-r font-medium">
                    <div className="font-semibold">{factor.nombre}</div>
                    <div className="text-xs text-gray-600 capitalize">
                      {factor.medio} • {factor.sensibilidad}
                    </div>
                  </td>
                  
                  {sampleActions.map(action => {
                    const cell = getCellData(action.id, factor.id);
                    
                    return (
                      <td key={`${action.id}-${factor.id}`} className="p-1 border-r border-b">
                          {cell ? (
                          <div aria-label={`Celda impacto ${cell.impactoId}`} className={`p-2 rounded text-center ${getCellColor(cell.S)}`}>
                            <div className="font-bold text-sm" aria-hidden>{cell.magnitud >= 0 ? '+' : ''}{cell.magnitud}</div>
                            <div className="text-xs border-t border-current" aria-hidden>{cell.importancia}</div>
                            <div className="text-xs font-semibold mt-1" aria-live="polite">S={cell.S}</div>
                          </div>
                        ) : (
                          <div className="p-2 text-center text-gray-300" aria-hidden>—</div>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className={`p-2 text-center border-b font-bold ${factorTotal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {factorTotal >= 0 ? '+' : ''}{factorTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
          
          <tfoot>
            <tr className="bg-blue-50 font-bold">
              <td className="p-3 border-r">TOTAL POR ACCIÓN</td>
              {sampleActions.map(action => {
                const actionTotal = sampleFactors.reduce((sum, factor) => {
                  const cell = getCellData(action.id, factor.id);
                  return sum + (cell?.S || 0);
                }, 0);
                
                return (
                  <td key={action.id} className={`p-2 text-center border-r ${actionTotal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {actionTotal >= 0 ? '+' : ''}{actionTotal}
                  </td>
                );
              })}
              <td className={`p-2 text-center font-bold text-lg ${sumaAlgebraica >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {sumaAlgebraica >= 0 ? '+' : ''}{sumaAlgebraica}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Leyenda */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">📖 Leyenda e Interpretación</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium mb-2">Estructura de Celda:</h5>
            <div className="space-y-1">
              <div>• <strong>Número superior:</strong> Magnitud (-10 a +10)</div>
              <div>• <strong>Número inferior:</strong> Importancia (1 a 10)</div>
              <div>• <strong>S:</strong> Significancia (Magnitud × Importancia)</div>
            </div>
          </div>
          <div>
            <h5 className="font-medium mb-2">Escala de Colores:</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>Impacto muy negativo (S ≤ -80)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span>Impacto negativo moderado (-79 a -60)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Impacto positivo moderado (60 a 79)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>Impacto muy positivo (S ≥ 80)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📈 Análisis de Resultados</h4>
        <div className="text-sm text-blue-800">
          <div className="mb-2">
            <strong>Evaluación global:</strong> {sumaAlgebraica > 0 ? '✅ Proyecto con impacto neto positivo' : '⚠️ Proyecto con impacto neto negativo'}
          </div>
          <div>
            <strong>Balance:</strong> {totalPositivos} impactos positivos vs {totalNegativos} impactos negativos
            ({totalPositivos > totalNegativos ? 'Favorece aspectos positivos' : 'Predominan aspectos negativos'})
          </div>
        </div>
      </div>

      {/* Exportación */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">📄 Exportar Matriz Leopold</h4>
        <ExportButtons 
          matrixType="leopold" 
          caseId="vias" 
          data={leopoldCells}
          matrixRef={matrixRef}
        />
      </div>
    </div>
  );
}
