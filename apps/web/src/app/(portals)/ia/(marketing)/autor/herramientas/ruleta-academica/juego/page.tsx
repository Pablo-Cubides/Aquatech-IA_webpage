"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionWheel from "../QuestionWheel";

export default function JuegoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [setName, setSetName] = useState("");

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);

      // Modo 1: Cargar desde ID de base de datos
      const id = searchParams.get("id");
      if (id) {
        const response = await fetch(`/api/questionsets/${id}`);
        if (!response.ok) throw new Error("No se encontró el conjunto");
        const data = await response.json();
        setSetName(data.name);
        setQuestions(data.questions.map((q: any) => q.text));
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
    } catch (err: any) {
      setError(err.message || "Error al cargar preguntas");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/ia/autor/herramientas/ruleta-academica");
  };

  if (isLoading) {
    return (
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
            Cargando preguntas...
          </span>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--background-dark)" }}
      >
        <div
          className="max-w-lg w-full p-8 rounded-xl border text-center"
          style={{
            backgroundColor: "var(--background-light)",
            borderColor: "#ef4444",
          }}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#ef4444" }}>
            Error al cargar preguntas
          </h2>
          <p
            className="mb-6 opacity-80"
            style={{ color: "var(--text-primary)" }}
          >
            {error || "No se encontraron preguntas para este conjunto"}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-lg font-bold text-lg"
            style={{
              backgroundColor: "var(--primary-cyan)",
              color: "var(--background-dark)",
            }}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: "var(--background-dark)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            style={{
              backgroundColor: "var(--background-light)",
              color: "var(--primary-cyan)",
            }}
          >
            ← Volver
          </button>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--primary-cyan)" }}
          >
            {setName}
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <QuestionWheel questions={questions} />
      </div>
    </div>
  );
}
