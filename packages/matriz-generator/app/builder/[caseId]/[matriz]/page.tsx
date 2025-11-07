"use client";
import React, { useState, useEffect } from "react";
import { Action, Factor, ImpactoBase } from "@types/index";
import LeopoldGrid from "@components/LeopoldGrid";
import LeopoldMatrix from "@components/LeopoldMatrix";
import ConesaForm from "@components/ConesaForm";
import BattelleTable from "@components/BattelleTable";

export default function Builder({
  params,
}: {
  params: Promise<{ caseId: string; matriz: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{
    caseId: string;
    matriz: string;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Enhanced sample data based on case
  const [acciones, setAcciones] = useState<Action[]>([]);
  const [factores, setFactores] = useState<Factor[]>([]);
  const [impactos, setImpactos] = useState<ImpactoBase[]>([]);

  useEffect(() => {
    params.then((p) => {
      setResolvedParams(p);
      loadCaseData(p.caseId);
    });
  }, [params]);

  const loadCaseData = (caseId: string) => {
    // Load case-specific data
    const caseData: Record<string, any> = {
      vias: {
        acciones: [
          { id: "a1", fase: "preoperativa", nombre: "Desmonte y limpieza" },
          {
            id: "a2",
            fase: "operativa",
            nombre: "Excavación y movimiento de tierras",
          },
          { id: "a3", fase: "operativa", nombre: "Construcción de pavimento" },
          { id: "a4", fase: "operativa", nombre: "Construcción de drenajes" },
          { id: "a5", fase: "cierre", nombre: "Revegetación de taludes" },
        ],
        factores: [
          {
            id: "f1",
            medio: "fisico",
            nombre: "Calidad del aire",
            sensibilidad: "media",
          },
          {
            id: "f2",
            medio: "fisico",
            nombre: "Calidad del agua",
            sensibilidad: "alta",
          },
          {
            id: "f3",
            medio: "fisico",
            nombre: "Calidad del suelo",
            sensibilidad: "alta",
          },
          {
            id: "f4",
            medio: "biotico",
            nombre: "Cobertura vegetal",
            sensibilidad: "alta",
          },
          {
            id: "f5",
            medio: "biotico",
            nombre: "Fauna terrestre",
            sensibilidad: "media",
          },
          {
            id: "f6",
            medio: "social",
            nombre: "Empleo local",
            sensibilidad: "media",
          },
          {
            id: "f7",
            medio: "social",
            nombre: "Movilidad y acceso",
            sensibilidad: "alta",
          },
        ],
      },
      mineria: {
        acciones: [
          {
            id: "a1",
            fase: "preoperativa",
            nombre: "Remoción de cobertura vegetal",
          },
          {
            id: "a2",
            fase: "preoperativa",
            nombre: "Construcción de vías de acceso",
          },
          {
            id: "a3",
            fase: "operativa",
            nombre: "Explotación a cielo abierto",
          },
          { id: "a4", fase: "operativa", nombre: "Transporte de mineral" },
          { id: "a5", fase: "operativa", nombre: "Manejo de estériles" },
          { id: "a6", fase: "cierre", nombre: "Cierre y revegetación" },
        ],
        factores: [
          {
            id: "f1",
            medio: "fisico",
            nombre: "Calidad del aire",
            sensibilidad: "alta",
          },
          {
            id: "f2",
            medio: "fisico",
            nombre: "Ruido ambiental",
            sensibilidad: "alta",
          },
          {
            id: "f3",
            medio: "fisico",
            nombre: "Aguas superficiales",
            sensibilidad: "alta",
          },
          {
            id: "f4",
            medio: "fisico",
            nombre: "Aguas subterráneas",
            sensibilidad: "alta",
          },
          {
            id: "f5",
            medio: "biotico",
            nombre: "Ecosistemas terrestres",
            sensibilidad: "alta",
          },
          {
            id: "f6",
            medio: "social",
            nombre: "Salud ocupacional",
            sensibilidad: "alta",
          },
          {
            id: "f7",
            medio: "social",
            nombre: "Economía local",
            sensibilidad: "media",
          },
          {
            id: "f8",
            medio: "social",
            nombre: "Paisaje",
            sensibilidad: "media",
          },
        ],
      },
      ecoturismo: {
        acciones: [
          { id: "a1", fase: "preoperativa", nombre: "Construcción de cabañas" },
          {
            id: "a2",
            fase: "preoperativa",
            nombre: "Construcción de senderos",
          },
          { id: "a3", fase: "operativa", nombre: "Operación turística" },
          { id: "a4", fase: "operativa", nombre: "Manejo de residuos" },
          { id: "a5", fase: "operativa", nombre: "Educación ambiental" },
        ],
        factores: [
          {
            id: "f1",
            medio: "fisico",
            nombre: "Calidad del agua",
            sensibilidad: "media",
          },
          {
            id: "f2",
            medio: "biotico",
            nombre: "Fauna silvestre",
            sensibilidad: "alta",
          },
          {
            id: "f3",
            medio: "biotico",
            nombre: "Hábitats naturales",
            sensibilidad: "alta",
          },
          {
            id: "f4",
            medio: "social",
            nombre: "Cultura local",
            sensibilidad: "media",
          },
          {
            id: "f5",
            medio: "social",
            nombre: "Economía local",
            sensibilidad: "media",
          },
          {
            id: "f6",
            medio: "social",
            nombre: "Educación ambiental",
            sensibilidad: "baja",
          },
        ],
      },
    };

    const data = caseData[caseId] || caseData["vias"];
    setAcciones(data.acciones);
    setFactores(data.factores);

    // Auto-generate some impacts
    const impactosGenerados: ImpactoBase[] = [];
    data.acciones.forEach((accion: Action) => {
      data.factores.forEach((factor: Factor) => {
        if (
          (accion.fase === "operativa" && factor.sensibilidad === "alta") ||
          (accion.nombre.includes("Construcción") && factor.medio === "fisico")
        ) {
          impactosGenerados.push({
            id: `i_${accion.id}_${factor.id}`,
            actionId: accion.id,
            factorId: factor.id,
            signo:
              factor.nombre.includes("Empleo") ||
              factor.nombre.includes("Economía") ||
              factor.nombre.includes("Educación")
                ? "+"
                : "-",
          });
        }
      });
    });
    setImpactos(impactosGenerados);
  };

  if (!resolvedParams) {
    return <div className="max-w-6xl mx-auto p-6">Cargando...</div>;
  }

  const { caseId, matriz } = resolvedParams;

  const steps = [
    {
      id: 1,
      title: "Acciones del proyecto",
      desc: "Define las actividades por fase",
    },
    {
      id: 2,
      title: "Factores ambientales",
      desc: "Identifica componentes del medio",
    },
    {
      id: 3,
      title: "Identificación de impactos",
      desc: "Cruza acciones con factores",
    },
    {
      id: 4,
      title: "Valoración de impactos",
      desc: `Aplica metodología ${matriz}`,
    },
    { id: 5, title: "Resultados", desc: "Analiza la matriz completa" },
  ];

  const caseNames: Record<string, string> = {
    vias: "Vía regional",
    mineria: "Mina de carbón",
    ecoturismo: "Complejo ecoturístico",
    hidroelectrica: "Central hidroeléctrica",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Constructor de Matriz{" "}
              {matriz.charAt(0).toUpperCase() + matriz.slice(1)}
            </h1>
            <p className="text-gray-600">Caso: {caseNames[caseId] || caseId}</p>
          </div>
          <div className="text-sm text-gray-500">
            Paso {currentStep} de {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.id <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-xs text-center mt-2 max-w-20">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-gray-500">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded"></div>
            <div
              className={`absolute top-0 left-0 h-1 bg-primary rounded transition-all duration-300`}
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Paso 1: Acciones del proyecto
            </h3>
            <p className="text-gray-600">
              Las acciones son las actividades que realiza el proyecto y que
              pueden generar impactos ambientales.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {["preoperativa", "operativa", "cierre"].map((fase) => (
                <div key={fase} className="border rounded-lg p-4">
                  <h4 className="font-semibold capitalize mb-3 text-center bg-gray-50 py-2 rounded">
                    {fase}
                  </h4>
                  <div className="space-y-2">
                    {acciones
                      .filter((a) => a.fase === fase)
                      .map((accion) => (
                        <div
                          key={accion.id}
                          className="p-2 bg-blue-50 rounded text-sm"
                        >
                          {accion.nombre}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Paso 2: Factores ambientales
            </h3>
            <p className="text-gray-600">
              Los factores son los componentes del medio ambiente que pueden
              verse afectados.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {["fisico", "biotico", "social"].map((medio) => (
                <div key={medio} className="border rounded-lg p-4">
                  <h4 className="font-semibold capitalize mb-3 text-center bg-gray-50 py-2 rounded">
                    {medio}
                  </h4>
                  <div className="space-y-2">
                    {factores
                      .filter((f) => f.medio === medio)
                      .map((factor) => (
                        <div
                          key={factor.id}
                          className="p-2 rounded text-sm flex justify-between items-center"
                          style={{
                            backgroundColor:
                              factor.sensibilidad === "alta"
                                ? "#fef3cd"
                                : factor.sensibilidad === "media"
                                  ? "#f0f9ff"
                                  : "#f3f4f6",
                          }}
                        >
                          <span>{factor.nombre}</span>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor:
                                factor.sensibilidad === "alta"
                                  ? "#d97706"
                                  : factor.sensibilidad === "media"
                                    ? "#0284c7"
                                    : "#6b7280",
                              color: "white",
                            }}
                          >
                            {factor.sensibilidad}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Paso 3: Identificación de impactos
            </h3>
            <p className="text-gray-600">
              Se identificaron {impactos.length} interacciones acción-factor que
              generan impactos.
            </p>
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {impactos.map((impacto) => {
                const accion = acciones.find((a) => a.id === impacto.actionId);
                const factor = factores.find((f) => f.id === impacto.factorId);
                return (
                  <div
                    key={impacto.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{accion?.nombre}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span>{factor?.nombre}</span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        impacto.signo === "+" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {impacto.signo}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Paso 4: Valoración - Matriz{" "}
              {matriz.charAt(0).toUpperCase() + matriz.slice(1)}
            </h3>
            <p className="text-gray-600">
              Ahora aplicamos la metodología específica para valorar cada
              impacto.
            </p>
            {matriz === "leopold" && <LeopoldMatrix impactos={impactos} />}
            {matriz === "conesa" && <ConesaForm impactos={impactos} />}
            {matriz === "battelle" && <BattelleTable impactos={impactos} />}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              Paso 5: Matriz Completada - Resultados
            </h3>
            <p className="text-gray-600">
              Matriz {matriz.charAt(0).toUpperCase() + matriz.slice(1)}{" "}
              completada con todos los cálculos y análisis.
            </p>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <button
                onClick={() =>
                  setCurrentStep(Math.min(steps.length, currentStep + 1))
                }
                disabled={currentStep === steps.length}
                className="px-6 py-2 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {currentStep !== 5 && (
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              onClick={() =>
                setCurrentStep(Math.min(steps.length, currentStep + 1))
              }
              disabled={currentStep === steps.length}
              className="px-6 py-2 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
