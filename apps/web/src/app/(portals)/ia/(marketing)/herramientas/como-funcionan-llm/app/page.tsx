"use client";

import React, { useState, useEffect } from "react";
import InputStep from "./components/InputStep";
import TokenizationStep from "./components/TokenizationStep";
import EmbeddingStep from "./components/EmbeddingStep";
import AttentionStep from "./components/AttentionStep";
import ProbabilityStep from "./components/ProbabilityStep";
import AutoregressiveStep from "./components/AutoregressiveStep";
import BibliographyStep from "./components/BibliographyStep";
import { ProcessProvider, useProcess } from "../context/ProcessContext";

const DEMO_TEXTS = [
  "Los pájaros vuelan porque tienen alas",
  "La inteligencia artificial es una tecnología fascinante",
  "Para estudiar mejor, recomiendo hacer resúmenes",
  "El agua hierve cuando alcanza cien grados",
];

export default function Page() {
  return (
    <ProcessProvider>
      <ExploraModeloApp />
    </ProcessProvider>
  );
}

function ExploraModeloApp() {
  const { state, dispatch } = useProcess();
  const currentStep = state.currentStep ?? 0;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Paleta de colores alineada con la marca (IA portal)
  const steps = [
    {
      id: 0,
      label: "Entrada",
      icon: "✏️",
      gradientStart: "#00efff",
      gradientEnd: "#0095ff",
    },
    {
      id: 1,
      label: "Tokenización",
      icon: "🔤",
      gradientStart: "#0095ff",
      gradientEnd: "#00efff",
    },
    {
      id: 2,
      label: "Embeddings",
      icon: "📊",
      gradientStart: "#10b981",
      gradientEnd: "#00efff",
    },
    {
      id: 3,
      label: "Atención",
      icon: "🎯",
      gradientStart: "#00efff",
      gradientEnd: "#10b981",
    },
    {
      id: 4,
      label: "Probabilidades",
      icon: "📈",
      gradientStart: "#0095ff",
      gradientEnd: "#10b981",
    },
    {
      id: 5,
      label: "Generación",
      icon: "✨",
      gradientStart: "#10b981",
      gradientEnd: "#0095ff",
    },
    {
      id: 6,
      label: "Bibliografía",
      icon: "📚",
      gradientStart: "#00efff",
      gradientEnd: "#0095ff",
    },
  ];

  const goToStep = (stepId: number) => {
    dispatch({ type: "SET_STEP", payload: stepId });
  };

  const goNext = () => {
    if (currentStep < 6) {
      dispatch({ type: "SET_STEP", payload: currentStep + 1 });
    }
  };

  const restart = () => {
    dispatch({ type: "RESTART" });
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ia-bg)] via-[var(--ia-bg-2)] to-[var(--ia-bg)]">
      {/* Header - Moderno y limpio */}
      <header className="sticky top-0 z-50 border-b border-[var(--ia-border)] bg-[var(--ia-bg)]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧠</div>
            <div>
              <h1 className="text-xl font-bold text-[var(--ia-accent)]">
                ExploraModelo
              </h1>
              <p className="text-xs text-[var(--ia-text-secondary)]">
                Cómo funcionan los LLMs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-[var(--ia-text-secondary)]">
                Explicaciones
              </span>
              <input
                type="checkbox"
                checked={state.isExplanationMode}
                onChange={() => dispatch({ type: "TOGGLE_EXPLANATION_MODE" })}
                className="w-4 h-4 rounded"
              />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Bar con números de pasos */}
        <div className="mb-12">
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`relative px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[var(--ia-accent)] to-[var(--ia-accent-secondary)] text-[var(--ia-bg)] shadow-lg shadow-[var(--ia-accent)]/30"
                        : isCompleted
                          ? "bg-[var(--ia-success)]/20 text-[var(--ia-success)] border border-[var(--ia-success)]/50"
                          : "bg-[var(--ia-bg-3)] text-[var(--ia-text-secondary)] hover:bg-[var(--ia-bg-2)] border border-[var(--ia-border)]"
                    }`}
                  >
                    <span>{step.icon}</span>
                    <span>{step.label}</span>
                    {isCompleted && isMounted && (
                      <span className="text-xs ml-1">✓</span>
                    )}
                  </button>

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-grow min-w-[20px] rounded-full ${
                        isCompleted
                          ? "bg-gradient-to-r from-[var(--ia-success)] to-[var(--ia-success)]/50"
                          : "bg-[var(--ia-border)]"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Card - Diseño moderno */}
        <div className="bg-gradient-to-br from-[var(--ia-bg-2)] to-[var(--ia-bg-3)] border border-[var(--ia-border)] rounded-2xl overflow-hidden">
          {/* Header del Card */}
          <div className="bg-gradient-to-r from-[var(--ia-accent)] to-[var(--ia-accent-secondary)] p-0.5">
            <div className="bg-[var(--ia-bg-2)] px-8 py-6">
              <h2 className="text-3xl font-bold text-[var(--ia-accent)] mb-2">
                {currentStepData.icon} {currentStepData.label}
              </h2>
              <p className="text-[var(--ia-text-secondary)] text-lg leading-relaxed">
                {currentStep === 0 &&
                  "Escribe o selecciona un texto de ejemplo para comenzar el proceso completo"}
                {currentStep === 1 &&
                  "Observa cómo el texto se divide en tokens (palabras o sub-palabras) individuales"}
                {currentStep === 2 &&
                  "Cada token se convierte en un vector de números que el modelo entiende"}
                {currentStep === 3 &&
                  "El modelo aprende qué tokens son más relevantes entre sí"}
                {currentStep === 4 &&
                  "Calcula probabilidades para predecir el siguiente token"}
                {currentStep === 5 &&
                  "Genera texto token por token, autoregresivamente"}
                {currentStep === 6 &&
                  "Explora papers fundamentales para profundizar"}
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-8">
            {currentStep === 0 && (
              <InputStep demoTexts={DEMO_TEXTS} onNext={goNext} />
            )}
            {currentStep === 1 && <TokenizationStep onNext={goNext} />}
            {currentStep === 2 && <EmbeddingStep onNext={goNext} />}
            {currentStep === 3 && <AttentionStep onNext={goNext} />}
            {currentStep === 4 && <ProbabilityStep onNext={goNext} />}
            {currentStep === 5 && (
              <AutoregressiveStep onRestart={restart} onNext={goNext} />
            )}
            {currentStep === 6 && <BibliographyStep onRestart={restart} />}
          </div>

          {/* Footer con botones */}
          <div className="bg-[var(--ia-bg-3)] border-t border-[var(--ia-border)] px-8 py-6 flex justify-between items-center">
            <button
              onClick={restart}
              className="px-6 py-2.5 rounded-lg font-medium text-[var(--ia-text-secondary)] bg-[var(--ia-bg-2)] border border-[var(--ia-border)] hover:bg-[var(--ia-border)] hover:text-[var(--ia-accent)] transition-all"
            >
              ↻ Reiniciar
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => goToStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-[var(--ia-text-secondary)] bg-[var(--ia-bg-2)] border border-[var(--ia-border)] hover:border-[var(--ia-accent-secondary)] transition-all"
              >
                ← Anterior
              </button>

              <button
                onClick={goNext}
                disabled={currentStep >= 6}
                className="px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--ia-accent)] to-[var(--ia-accent-secondary)] text-[var(--ia-bg)] hover:shadow-lg hover:shadow-[var(--ia-accent)]/40 transition-all"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="mt-8 text-center text-[var(--ia-text-secondary)]">
          <p className="text-sm">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>
      </main>
    </div>
  );
}
