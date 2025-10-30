'use client';
import React, { useState } from 'react';
import { LeopoldCell, ImpactoBase } from '../types';
import { computeLeopoldCell } from '../lib/matrices';

export default function LeopoldGrid({ impactos }: { impactos: ImpactoBase[] }) {
  // Create editable cells for each impact
  const [cells, setCells] = useState<LeopoldCell[]>(
    impactos.map((imp, i) => ({ 
      impactoId: imp.id, 
      magnitud: imp.signo === '+' ? Math.floor(Math.random() * 5) + 3 : -(Math.floor(Math.random() * 5) + 3),
      importancia: Math.floor(Math.random() * 5) + 4, 
      S: 0 
    }))
  );

  const updateCell = (impactoId: string, field: 'magnitud' | 'importancia', value: number) => {
    setCells(prev => prev.map(cell => {
      if (cell.impactoId === impactoId) {
        const updated = { ...cell, [field]: value };
        const computed = computeLeopoldCell(updated);
        return computed;
      }
      return cell;
    }));
  };

  const totalSignificancia = cells.reduce((sum, cell) => sum + cell.S, 0);
  const impactosPositivos = cells.filter(c => c.magnitud > 0);
  const impactosNegativos = cells.filter(c => c.magnitud < 0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-bold mb-2 text-lg">Matriz de Leopold</h3>
        <p className="text-sm text-gray-700 mb-4">
          Para cada impacto, ajusta la <strong>magnitud</strong> (-10 a +10) e <strong>importancia</strong> (1 a 10). 
          La significancia S se calcula como |magnitud| × importancia.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-semibold">Significancia total:</div>
            <div className="text-2xl font-bold text-primary">{totalSignificancia}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-semibold text-green-700">Impactos positivos:</div>
            <div className="text-xl font-bold text-green-700">{impactosPositivos.length}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-semibold text-red-700">Impactos negativos:</div>
            <div className="text-xl font-bold text-red-700">{impactosNegativos.length}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {cells.map((cell, index) => {
          const impacto = impactos.find(i => i.id === cell.impactoId);
          return (
            <div key={cell.impactoId} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex-1">
                  <div className="font-medium">Impacto #{index + 1}</div>
                  <div className="text-sm text-gray-600">ID: {impacto?.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Significancia</div>
                  <div className={`text-2xl font-bold ${cell.S > 50 ? 'text-red-600' : cell.S > 25 ? 'text-orange-500' : 'text-green-600'}`}>
                    {cell.S}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Magnitud: {cell.magnitud} 
                    <span className="text-xs text-gray-500 ml-1">
                      ({cell.magnitud > 0 ? 'Positivo' : 'Negativo'})
                    </span>
                  </label>
                  <input 
                    type="range" 
                    min={-10} 
                    max={10} 
                    value={cell.magnitud}
                    onChange={(e) => updateCell(cell.impactoId, 'magnitud', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(10 + cell.magnitud) * 5}%, #22c55e ${(10 + cell.magnitud) * 5}%, #22c55e 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-10</span>
                    <span>0</span>
                    <span>+10</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Importancia: {cell.importancia}
                    <span className="text-xs text-gray-500 ml-1">
                      ({cell.importancia > 7 ? 'Muy importante' : cell.importancia > 4 ? 'Moderada' : 'Baja'})
                    </span>
                  </label>
                  <input 
                    type="range" 
                    min={1} 
                    max={10} 
                    value={cell.importancia}
                    onChange={(e) => updateCell(cell.impactoId, 'importancia', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <strong>Cálculo:</strong> S = |{cell.magnitud}| × {cell.importancia} = {Math.abs(cell.magnitud)} × {cell.importancia} = <span className="font-bold">{cell.S}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Interpretación de resultados</h4>
        <div className="text-sm space-y-1">
          <div>• <strong>S {'<'} 25:</strong> Impacto poco significativo</div>
          <div>• <strong>25 ≤ S {'<'} 50:</strong> Impacto moderadamente significativo</div>
          <div>• <strong>50 ≤ S {'<'} 75:</strong> Impacto muy significativo</div>
          <div>• <strong>S ≥ 75:</strong> Impacto extremadamente significativo</div>
        </div>
      </div>
    </div>
  );
}
