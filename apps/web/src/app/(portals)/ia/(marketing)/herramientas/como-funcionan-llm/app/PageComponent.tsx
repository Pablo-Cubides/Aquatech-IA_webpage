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
import { WebPageStructuredData } from "@/components/seo/StructuredData";
import { AuthoritativeReferences } from "@/components/seo/AuthoritativeReferences";

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
    <>
      <WebPageStructuredData
        title="Cómo Funcionan los Grandes Modelos de Lenguaje (LLM) | Aquatech IA"
        description="Aprende paso a paso cómo funcionan los Grandes Modelos de Lenguaje (LLM): tokenización, embeddings, atención, probabilidades y generación autorregresiva de texto."
        url="https://aquatechia.com/ia/herramientas/como-funcionan-llm"
        datePublished="2024-06-01"
        dateModified="2026-09-06"
      />
      <div className="min-h-screen bg-gradient-to-b from-[var(--ia-bg)] via-[var(--ia-bg-2)] to-[var(--ia-bg)]">
        {/* Header - Moderno y limpio */}
        <header className="sticky top-0 z-50 border-b border-[var(--ia-border)] bg-[var(--ia-bg)]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🧠</div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[var(--ia-accent)] block">
                  Simulador Arquitectónico
                </span>
                <h1 className="text-lg md:text-xl font-bold text-white leading-tight">
                  Cómo Funcionan los Grandes Modelos de Lenguaje (LLM)
                </h1>
                <p className="text-xs md:text-sm text-[var(--ia-text-secondary)] mt-0.5 max-w-xl leading-normal">
                  Guía visual interactiva que explica paso a paso la arquitectura interna de un modelo de lenguaje Transformer: desde la tokenización de texto y embeddings vectoriales hasta la autoatención y generación autorregresiva de tokens.
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

        {/* Fundamentación Teórica y Arquitectura de Transformers */}
        <section className="mt-16 pt-12 border-t border-[var(--ia-border)]">
          <div className="bg-[var(--ia-bg-2)] border border-[var(--ia-border)] rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Arquitectura de Transformers: Fundamentos Teóricos de los LLMs
            </h2>
            <p className="text-[var(--ia-text-secondary)] leading-relaxed mb-6">
              Los Modelos de Lenguaje Grande (LLM) contemporáneos operan sobre el principio de atención propio de la arquitectura Transformer ("Attention Is All You Need", Vaswani et al., 2017). A través de múltiples capas de atención multicabezal (Multi-Head Self-Attention) y redes prealimentadas (Feed-Forward Networks), el modelo procesa secuencias de texto capturando dependencias semánticas globales de largo alcance.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-sm text-[var(--ia-text-secondary)]">
              <div className="p-5 rounded-xl bg-[var(--ia-bg-3)] border border-[var(--ia-border)]">
                <h3 className="font-bold text-[var(--ia-accent)] mb-2">1. Tokenización y Espacio Vectorial</h3>
                <p className="leading-relaxed">
                  El texto plano es segmentado en unidades mínimas o subpalabras mediante algoritmos de Byte-Pair Encoding (BPE) o WordPiece. Cada token se proyecta a un vector continuo en un espacio latente de alta dimensionalidad enriquecido con codificación posicional.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--ia-bg-3)] border border-[var(--ia-border)]">
                <h3 className="font-bold text-[var(--ia-accent-secondary)] mb-2">2. Mecanismo de Autoatención</h3>
                <p className="leading-relaxed">
                  Cada token genera vectores de consulta (Query), clave (Key) y valor (Value). La puntuación de atención calcula la compatibilidad entre pares de tokens: Attention(Q, K, V) = softmax((Q K^T) / √d_k) V, permitiendo contextualizar palabras polisémicas dinámicamente.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--ia-bg-3)] border border-[var(--ia-border)]">
                <h3 className="font-bold text-[var(--ia-success)] mb-2">3. Inferencia Autorregresiva</h3>
                <p className="leading-relaxed">
                  La cabeza lineal de salida proyecta los estados ocultos al vocabulario completo. Aplicando softmax, se obtiene una distribución de probabilidad condicional P(w_t | w_1...w_t-1), prediciendo y concatenando un token a la vez de forma continua.
                </p>
              </div>
            </div>
          </div>

          {/* Referencias Académicas Autorizadas GEO */}
          <div className="mt-12">
            <AuthoritativeReferences theme="dark" />
          </div>
        </section>
      </main>
    </div>
    </>
  );
}
