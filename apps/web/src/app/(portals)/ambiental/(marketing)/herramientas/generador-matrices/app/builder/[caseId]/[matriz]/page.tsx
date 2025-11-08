"use client";
import React, { useState, useEffect } from "react";
import LeopoldGrid from "../../../../src/components/LeopoldGrid";
import LeopoldMatrix from "../../../../src/components/LeopoldMatrix";
import ConesaForm from "../../../../src/components/ConesaForm";
import BattelleTable from "../../../../src/components/BattelleTable";

export default function Builder({ params }: { params: Promise<{ caseId: string; matriz: string }>; }) {
  const [resolvedParams, setResolvedParams] = useState<{ caseId: string; matriz: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [acciones, setAcciones] = useState<any[]>([]);
  const [factores, setFactores] = useState<any[]>([]);
  const [impactos, setImpactos] = useState<any[]>([]);

  useEffect(() => {
    params.then((p) => {
      setResolvedParams(p);
      loadCaseData(p.caseId);
    });
  }, [params]);

  const loadCaseData = (caseId: string) => {
    const caseData: Record<string, any> = {
      vias: {
        acciones: [
          { id: "a1", fase: "preoperativa", nombre: "Desmonte y limpieza" },
          { id: "a2", fase: "operativa", nombre: "Excavación y movimiento de tierras" },
          { id: "a3", fase: "operativa", nombre: "Construcción de pavimento" },
          { id: "a4", fase: "operativa", nombre: "Construcción de drenajes" },
          { id: "a5", fase: "cierre", nombre: "Revegetación de taludes" },
        ],
        factores: [
          { id: "f1", medio: "fisico", nombre: "Calidad del aire", sensibilidad: "media" },
          { id: "f2", medio: "fisico", nombre: "Calidad del agua", sensibilidad: "alta" },
          { id: "f3", medio: "fisico", nombre: "Calidad del suelo", sensibilidad: "alta" },
          { id: "f4", medio: "biotico", nombre: "Cobertura vegetal", sensibilidad: "alta" },
          { id: "f5", medio: "biotico", nombre: "Fauna terrestre", sensibilidad: "media" },
          { id: "f6", medio: "social", nombre: "Empleo local", sensibilidad: "media" },
          { id: "f7", medio: "social", nombre: "Movilidad y acceso", sensibilidad: "alta" },
        ],
      },
    };

    const data = caseData[caseId] || caseData["vias"];
    setAcciones(data.acciones);
    setFactores(data.factores);

    const impactosGenerados: any[] = [];
    data.acciones.forEach((accion: any) => {
      data.factores.forEach((factor: any) => {
        if ((accion.fase === "operativa" && factor.sensibilidad === "alta") || (accion.nombre.includes("Construcción") && factor.medio === "fisico")) {
          impactosGenerados.push({ id: `i_${accion.id}_${factor.id}`, actionId: accion.id, factorId: factor.id, signo: factor.nombre.includes("Empleo") ? "+" : "-" });
        }
      });
    });
    setImpactos(impactosGenerados);
  };

  if (!resolvedParams) return <div className="max-w-6xl mx-auto p-6">Cargando...</div>;

  const { caseId, matriz } = resolvedParams;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Constructor de Matriz {matriz}</h1>
            <p className="text-gray-600">Caso: {caseId}</p>
          </div>
          <div className="text-sm text-gray-500">Paso {currentStep}</div>
        </div>

        {currentStep === 4 && (
          <div>
            {matriz === "leopold" && <LeopoldMatrix impactos={impactos} />}
            {matriz === "conesa" && <ConesaForm impactos={impactos} />}
            {matriz === "battelle" && <BattelleTable impactos={impactos} />}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} className="px-6 py-2 border rounded">← Anterior</button>
          <button onClick={() => setCurrentStep(Math.min(5, currentStep + 1))} className="px-6 py-2 bg-primary text-white rounded">Siguiente →</button>
        </div>
      </div>
    </div>
  );
}
