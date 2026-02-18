"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FileInput from "./FileInput";
import "./styles.css";

// ─────────────────────────────────────────────────────────────────────────────
// Default Question Bank
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_QUESTION_BANKS = [
  {
    id: -100,
    name: "Acueductos y Aducción",
    questions: [
      "¿Cuál es la diferencia entre aducción y conducción de agua en un sistema de acueducto?",
      "Mencione dos casos en los que la aducción podría no ir enterrada.",
      "¿Qué factores ambientales se deben considerar para el diseño de la línea de aducción?",
      "Mencione tres aspectos que influyen en el trazado de la línea de aducción.",
      "Indique tres formas comunes de realizar una aducción de agua.",
      "¿En qué casos es necesario hacer una aducción a presión?",
      "Mencione tres parámetros que deben especificarse en el diseño de la línea de aducción y explique por qué son importantes.",
      "¿Qué significa el término \"servidumbre\" en una línea de aducción?",
      "Mencione dos tipos de tuberías comúnmente usadas en aducción.",
      "¿Para qué sirve la tabla de relaciones hidráulicas en el diseño de una línea de aducción?",
      "¿Por qué es importante verificar la velocidad mínima en un sistema de aducción?",
      "¿Por qué se debe tener en cuenta la velocidad máxima al diseñar una aducción?",
      "Mencione los tipos de sedimentación y sus diferencias.",
      "Mencione dos fuerzas a las que está sometida una partícula en el agua.",
      "Mencione las partes principales de un desarenador.",
      "Explique la función de la zona 1 de un desarenador.",
      "Explique la función de la zona 2 de un desarenador.",
      "Explique la función de la zona 3 de un desarenador.",
      "Explique la función de la zona 4 de un desarenador.",
      "Explique la función de la zona 5 de un desarenador.",
      "¿Por qué se debe colocar una pendiente en la placa de fondo del desarenador y de cuánto puede ser?",
      "¿Qué es el periodo de retención hidráulico y cuál es su valor típico en un desarenador?",
      "¿Qué es la carga hidráulica superficial?",
      "Mencione tres criterios para ubicar un desarenador.",
      "¿Cómo influye la velocidad de salida del agua en la eficiencia de un desarenador?",
      "Mencione dos funciones de los tanques de almacenamiento.",
      "¿Qué es un tanque de compensación?",
      "Diferencie la curva de consumo horario y la curva integral de consumo.",
      "¿Cómo se calcula el porcentaje de agua para incendios (concepto, no fórmula)?",
      "¿Cuál es la diferencia en el suministro por bombeo y por gravedad?",
      "Mencione dos ventajas y dos desventajas de usar tuberías de PVC frente a hierro fundido.",
      "¿Cómo afecta la topografía montañosa al diseño de una aducción?",
      "¿Por qué es importante mantener el nivel de agua en un tanque de almacenamiento dentro de ciertos límites?",
      "Mencione dos medidas para minimizar la sedimentación en un tanque y cómo afectan la calidad del agua.",
      "¿Qué es el efecto sifón en la evacuación de lodos de un desarenador?",
      "Mencione la resolución vigente para el diseño de acueductos y alcantarillados en Colombia.",
      "¿De qué trata la resolución 501 de 2007?",
      "¿Qué son los manuales de buenas prácticas y mencione dos ejemplos?",
      "¿Qué es el RAS rural y mencione una diferencia con el RAS 0330?",
      "Mencione las etapas principales para la construcción de un acueducto.",
      "¿Por qué es importante considerar las vías de acceso al construir un acueducto?",
      "¿Por qué es importante la topografía para la construcción de un acueducto?",
      "¿En qué consiste la priorización de proyectos de saneamiento?",
      "¿Por qué se deben analizar alternativas de diseño y cuántas como mínimo?",
      "Mencione tres tipos de sostenibilidad a considerar en un proyecto de acueducto.",
      "¿Por qué se requieren más de dos censos para estimar la población de diseño?",
      "Mencione tres tipos de fuentes de abastecimiento y un criterio de selección para cada una.",
      "¿Qué es la dotación bruta y en qué se diferencia de la dotación neta?",
      "¿Qué es una estructura de captación y qué la caracteriza?",
      "Mencione tres fuentes típicas de agua y cuándo se usaría cada una.",
    ],
  },
];

type Mode = "choose" | "select" | "upload";

interface QuestionBank {
  id: number;
  name: string;
  questions?: string[];
}

export default function RuletaAcademicaPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choose");
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>(DEFAULT_QUESTION_BANKS);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [loadedQuestions, setLoadedQuestions] = useState<string[]>([]);
  const [loadedName, setLoadedName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [bankError, setBankError] = useState<string>("");

  // Load saved banks from API on mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch("/api/questionsets");
        if (res.ok) {
          const data = await res.json();
          setQuestionBanks((prev) => {
            const existingIds = new Set(prev.map((b) => b.id));
            const newBanks = data.filter((b: QuestionBank) => !existingIds.has(b.id));
            return [...prev, ...newBanks];
          });
        }
      } catch {
        // API not available, use defaults only
      }
    };
    fetchBanks();
  }, []);

  // Handle bank selection
  const handleSelectBank = (id: number) => {
    setSelectedBankId(id);
    setLoading(true);
    setBankError("");
    setLoadedQuestions([]);
    setLoadedName("");

    // Check if it's a default bank
    const defaultBank = DEFAULT_QUESTION_BANKS.find((b) => b.id === id);
    if (defaultBank) {
      setLoadedQuestions(defaultBank.questions);
      setLoadedName(defaultBank.name);
      setLoading(false);
      return;
    }

    // Fetch from API
    fetch(`/api/questionsets/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("No fue posible cargar ese banco de preguntas.");
        }
        return res.json();
      })
      .then((data) => {
        const questions = Array.isArray(data.questions)
          ? data.questions.map((q: { text: string } | string) =>
              typeof q === "string" ? q : q.text,
            )
          : [];
        if (questions.length === 0) {
          throw new Error("El banco no tiene preguntas disponibles.");
        }
        setLoadedQuestions(questions);
        setLoadedName(data.name);
      })
      .catch(() => {
        setLoadedQuestions([]);
        setLoadedName("");
        setBankError("No se pudo cargar el banco seleccionado. Intenta otro.");
      })
      .finally(() => setLoading(false));
  };

  // Handle file upload
  const handleFileLoaded = (questions: string[], name: string) => {
    setLoadedQuestions(questions);
    setLoadedName(name);
  };

  // Start game
  const handleStart = () => {
    if (loadedQuestions.length === 0) return;
    try {
      sessionStorage.setItem("tempQuestions", JSON.stringify(loadedQuestions));
      router.push("/ia/autor/herramientas/ruleta-academica/juego?temp=1");
    } catch {
      const encoded = encodeURIComponent(JSON.stringify(loadedQuestions));
      router.push(`/ia/autor/herramientas/ruleta-academica/juego?questions=${encoded}`);
    }
  };

  // Reset to choose mode
  const handleBack = () => {
    setMode("choose");
    setSelectedBankId(null);
    setLoadedQuestions([]);
    setLoadedName("");
    setBankError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#10111A] to-gray-900 flex flex-col items-center py-12 px-4">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/images/Portal IA/Autor/Ruleta academica.png"
          alt="Ruleta Académica"
          className="h-32 w-auto drop-shadow-lg"
        />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
        Ruleta Académica
      </h1>
      <p className="text-gray-400 text-center mb-10 max-w-md">
        Selecciona o carga un banco de preguntas para comenzar la dinámica de clase.
      </p>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* STEP 1: Choose Mode */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {mode === "choose" && (
        <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setMode("select")}
            className="group relative bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-2xl text-white font-semibold text-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
          >
            <div className="text-5xl mb-4">📚</div>
            <div>Seleccionar Banco</div>
            <p className="text-sm font-normal text-cyan-200 mt-2">
              Elige un banco de preguntas guardado
            </p>
          </button>

          <button
            onClick={() => setMode("upload")}
            className="group relative bg-gradient-to-br from-green-600 to-teal-700 p-8 rounded-2xl text-white font-semibold text-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
          >
            <div className="text-5xl mb-4">📤</div>
            <div>Cargar Archivo</div>
            <p className="text-sm font-normal text-green-200 mt-2">
              Sube un CSV o Excel con preguntas
            </p>
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* STEP 2a: Select from banks */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {mode === "select" && (
        <div className="w-full max-w-xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <button
            onClick={handleBack}
            className="text-cyan-400 hover:text-cyan-300 mb-6 flex items-center gap-2 text-sm"
          >
            ← Volver
          </button>

          <h2 className="text-xl font-bold text-white mb-4">
            Seleccionar Banco de Preguntas
          </h2>

          <select
            className="w-full p-4 rounded-lg bg-gray-900 text-white text-lg border border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors"
            value={selectedBankId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setSelectedBankId(null);
                setLoadedQuestions([]);
                setLoadedName("");
                setBankError("");
                return;
              }
              handleSelectBank(Number(value));
            }}
          >
            <option value="">-- Elegir banco --</option>
            {questionBanks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>

          {loading && (
            <div className="text-cyan-400 mt-4 animate-pulse">Cargando preguntas...</div>
          )}

          {bankError && !loading && (
            <div className="text-red-400 mt-4">{bankError}</div>
          )}

          {loadedQuestions.length > 0 && !loading && (
            <>
              <div className="mt-6 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-cyan-400 font-semibold">{loadedName}</span>
                  <span className="text-gray-400 text-sm">
                    {loadedQuestions.length} preguntas
                  </span>
                </div>
                <ul className="text-gray-300 text-sm space-y-2 max-h-48 overflow-y-auto">
                  {loadedQuestions.slice(0, 5).map((q, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-500">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                  {loadedQuestions.length > 5 && (
                    <li className="text-gray-500 italic">
                      ... y {loadedQuestions.length - 5} más
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={handleStart}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-xl transition-all shadow-lg hover:shadow-green-500/30"
              >
                🎯 Comenzar
              </button>
            </>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* STEP 2b: Upload file */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {mode === "upload" && (
        <div className="w-full max-w-xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <button
            onClick={handleBack}
            className="text-green-400 hover:text-green-300 mb-6 flex items-center gap-2 text-sm"
          >
            ← Volver
          </button>

          <h2 className="text-xl font-bold text-white mb-4">
            Cargar Archivo de Preguntas
          </h2>

          <FileInput
            groupName=""
            onGroupNameChange={() => {}}
            onUpload={handleFileLoaded}
            onSaveSuccess={() => {}}
            showGroupNameInput={false}
          />

          {loadedQuestions.length > 0 && (
            <>
              <div className="mt-6 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-400 font-semibold">
                    {loadedName || "Archivo cargado"}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {loadedQuestions.length} preguntas
                  </span>
                </div>
                <ul className="text-gray-300 text-sm space-y-2 max-h-48 overflow-y-auto">
                  {loadedQuestions.slice(0, 5).map((q, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-500">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                  {loadedQuestions.length > 5 && (
                    <li className="text-gray-500 italic">
                      ... y {loadedQuestions.length - 5} más
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={handleStart}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-xl transition-all shadow-lg hover:shadow-green-500/30"
              >
                🎯 Comenzar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
