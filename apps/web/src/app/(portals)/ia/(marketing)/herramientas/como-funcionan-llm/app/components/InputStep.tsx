"use client";

import { useState } from "react";
import { tokenize } from "../../utils/llm-simulation";
import { useProcess } from "../../context/ProcessContext";
import { logEvent } from "../../utils/analytics";

interface InputStepProps {
  demoTexts?: string[];
  onNext?: () => void;
}

export default function InputStep({ demoTexts = [], onNext }: InputStepProps) {
  const { state, dispatch } = useProcess();
  const { isExplanationMode } = state;
  const [inputText, setInputText] = useState("");
  const [selectedDemo, setSelectedDemo] = useState("");
  const MAX_TOKENS = 50;

  const tokenCount = tokenize(inputText || selectedDemo || "").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText || selectedDemo;
    if (text.trim()) {
      logEvent("start_process", { text });
      dispatch({ type: "START_PROCESS", payload: { text: text.trim() } });
      // advance to next step in the flow if the parent provided a handler
      if (typeof onNext === "function") setTimeout(() => onNext(), 60);
    }
  };

  const handleDemoSelect = (demo: string) => {
    setSelectedDemo(demo);
    setInputText(demo);
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-12 text-center animate-fadeInUp">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-cyan-500/50 animate-pulse">
          <span className="text-4xl">✏️</span>
        </div>
        <h1
          className="mb-4 text-4xl font-black sm:text-5xl"
          style={{
            background: "linear-gradient(135deg, #00efff, #0095ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          Bienvenido a ExploraModelo
        </h1>

        {isExplanationMode && (
          <div className="max-w-3xl mx-auto explanation-box">
            <p className="explanation-text">
              Descubre cómo funcionan los modelos de lenguaje paso a paso.
              Escribe una frase y observa el proceso completo desde la entrada
              hasta la generación de texto.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
        {/* Input de texto principal */}
        <div className="p-8 space-y-4 card-glass rounded-2xl">
          <label
            htmlFor="input-text"
            className="flex items-center gap-2 mb-3 text-lg font-bold text-slate-200"
          >
            <span className="text-2xl">💭</span>
            Escribe una frase para analizar:
          </label>
          <div className="relative">
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ej: La inteligencia artificial es fascinante..."
              className="w-full h-32 px-4 py-3 text-lg font-medium text-white transition-all border-2 rounded-lg resize-none border-cyan-500/30 focus:border-cyan-500 bg-slate-900/50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              maxLength={200}
            />
            <div className="absolute flex items-center gap-3 bottom-4 right-4">
              <div
                className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
                  tokenCount > MAX_TOKENS
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                }`}
              >
                {tokenCount} / {MAX_TOKENS} tokens
              </div>
              <div className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium">
                {inputText.length} / 200
              </div>
            </div>
          </div>
          {tokenCount > MAX_TOKENS && (
            <div className="flex items-start gap-3 p-4 border bg-red-500/10 border-red-500/30 rounded-xl">
              <span className="flex-shrink-0 text-2xl">⚠️</span>
              <p className="text-sm font-medium text-red-400">
                Límite de tokens superado — acorta tu frase (máximo {MAX_TOKENS}{" "}
                tokens)
              </p>
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 py-2 font-semibold bg-black border rounded-full text-slate-400 border-slate-700">
              O selecciona un ejemplo
            </span>
          </div>
        </div>

        {/* Demos grid */}
        <div className="p-6 card-glass rounded-2xl">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-200">
            <span className="text-2xl">🎯</span>
            Ejemplos rápidos:
          </h3>
          <div className="demo-grid">
            {demoTexts.map((demo, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDemoSelect(demo)}
                className="text-left demo-btn group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-2xl transition-transform group-hover:scale-110">
                    {index === 0
                      ? "🐦"
                      : index === 1
                        ? "🤖"
                        : index === 2
                          ? "📚"
                          : "💧"}
                  </span>
                  <span className="transition-colors text-slate-200 group-hover:text-white line-clamp-2">
                    {demo}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Botón de submit */}
        <div className="pt-6 text-center">
          <button
            type="submit"
            disabled={!inputText.trim() || tokenCount > MAX_TOKENS}
            className="px-12 py-4 text-lg navigation-button group"
            aria-disabled={!inputText.trim() || tokenCount > MAX_TOKENS}
          >
            <span className="inline-block text-2xl transition-transform group-hover:rotate-12">
              🚀
            </span>
            <span>Comenzar Análisis</span>
            <span className="inline-block text-2xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
