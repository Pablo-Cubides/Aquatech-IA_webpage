"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePortalTheme } from "@/lib/hooks/usePortalTheme";
import QuestionWheel from "../QuestionWheel";

function JuegoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = usePortalTheme();
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [setName, setSetName] = useState("");

  const loadQuestions = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // Modo 1: Cargar desde ID de base de datos
      const id = searchParams.get("id");
      if (id) {
        const response = await fetch(`/api/questionsets/${id}`);
        if (!response.ok) throw new Error("No se encontró el conjunto");
        const data = (await response.json()) as { name: string; questions: { text: string }[] };
        setSetName(data.name);
        setQuestions(data.questions.map((q) => q.text));
        setError("");
        setIsLoading(false);
        return;
      }

      // Modo 2: Cargar desde sessionStorage (temporal)
      const temp = searchParams.get("temp");
      if (temp === "1") {
        const stored = sessionStorage.getItem("tempQuestions");
        if (stored) {
          const parsed = JSON.parse(stored);
          setQuestions(parsed);
          setSetName("Juego Temporal");
          setError("");
          setIsLoading(false);
          return;
        }
      }

      // Modo 3: Cargar desde URL (backup)
      const questionsParam = searchParams.get("questions");
      if (questionsParam) {
        try {
          const parsed = JSON.parse(decodeURIComponent(questionsParam));
          setQuestions(parsed);
          setSetName("Preguntas Personalizadas");
          setError("");
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Error parsing questions from URL", e);
        }
      }

      // Si no hay ninguna fuente válida
      throw new Error("No se especificaron preguntas para jugar");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar preguntas";
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleBack = () => {
    router.push(`${theme.portalBase}/autor/herramientas/ruleta-academica`);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bgMain}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0077B6]"></div>
          <span className={`text-xl font-semibold ${theme.textPrimary}`}>
            Cargando preguntas...
          </span>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${theme.bgMain}`}>
        <div className={`max-w-lg w-full p-8 rounded-xl border text-center ${theme.bgCard} border-red-500`}>
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Error al cargar preguntas
          </h2>
          <p className={`mb-6 opacity-80 ${theme.textPrimary}`}>
            {error || "No se encontraron preguntas para este conjunto"}
          </p>
          <button
            onClick={handleBack}
            className={`px-6 py-3 rounded-lg font-bold text-lg ${theme.btnPrimary}`}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${theme.bgMain} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${theme.btnSecondary}`}
          >
            ← Volver
          </button>
          <h1 className={`text-3xl font-bold ${theme.textAccent}`}>
            {setName}
          </h1>
          <div className="w-24"></div>
        </div>

        <QuestionWheel questions={questions} />
      </div>
    </div>
  );
}

export default function JuegoPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "var(--background-dark)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="animate-spin rounded-full h-16 w-16 border-b-4"
              style={{ borderColor: "var(--primary-cyan)" }}
            ></div>
            <span
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Cargando...
            </span>
          </div>
        </div>
      }
    >
      <JuegoContent />
    </Suspense>
  );
}
