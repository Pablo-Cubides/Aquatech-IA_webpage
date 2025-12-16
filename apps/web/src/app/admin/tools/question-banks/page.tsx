"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Save, X, Upload, Eye } from "lucide-react";

interface QuestionBank {
  id: number;
  name: string;
  questions: string[];
  createdAt?: string;
}

// Default banks (hardcoded, can't be deleted)
const DEFAULT_BANKS: QuestionBank[] = [
  {
    id: -100,
    name: "Acueductos y Aducción",
    questions: [
      "¿Cuál es la diferencia entre aducción y conducción de agua en un sistema de acueducto?",
      "Mencione dos casos en los que la aducción podría no ir enterrada.",
      "¿Qué factores ambientales se deben considerar para el diseño de la línea de aducción?",
      "Mencione tres aspectos que influyen en el trazado de la línea de aducción.",
      "Indique tres formas comunes de realizar una aducción de agua.",
      // ... truncated for display, full list in actual component
    ],
  },
];

type Mode = "list" | "create" | "edit" | "preview";

export default function QuestionBanksAdmin() {
  const [mode, setMode] = useState<Mode>("list");
  const [banks, setBanks] = useState<QuestionBank[]>(DEFAULT_BANKS);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<QuestionBank | null>(null);
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formQuestions, setFormQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  // Fetch banks from API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch("/api/questionsets");
        if (res.ok) {
          const data = await res.json();
          const apiBanks = data.map((b: any) => ({
            id: b.id,
            name: b.name,
            questions: b.questions?.map((q: any) => q.text || q) || [],
            createdAt: b.createdAt,
          }));
          setBanks([...DEFAULT_BANKS, ...apiBanks]);
        }
      } catch {
        // API not available
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  // Add question to form
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setFormQuestions([...formQuestions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  // Remove question from form
  const handleRemoveQuestion = (index: number) => {
    setFormQuestions(formQuestions.filter((_, i) => i !== index));
  };

  // Save new bank
  const handleSave = async () => {
    if (!formName.trim() || formQuestions.length === 0) {
      setSaveStatus("Nombre y al menos una pregunta requeridos");
      return;
    }

    setSaveStatus("Guardando...");
    try {
      const res = await fetch("/api/questionsets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), questions: formQuestions }),
      });

      if (res.ok) {
        const data = await res.json();
        setBanks([...banks, { id: data.id, name: formName, questions: formQuestions }]);
        setMode("list");
        setFormName("");
        setFormQuestions([]);
        setSaveStatus("");
      } else {
        const err = await res.json().catch(() => ({}));
        setSaveStatus(err.error || "Error al guardar");
      }
    } catch (e) {
      setSaveStatus("Error de conexión");
    }
  };

  // Delete bank
  const handleDelete = async (id: number) => {
    if (id < 0) {
      alert("Los bancos predeterminados no se pueden eliminar");
      return;
    }

    if (!confirm("¿Eliminar este banco de preguntas?")) return;

    try {
      const res = await fetch(`/api/questionsets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanks(banks.filter((b) => b.id !== id));
      }
    } catch {
      alert("Error al eliminar");
    }
  };

  // Edit bank
  const handleEdit = (bank: QuestionBank) => {
    setSelectedBank(bank);
    setFormName(bank.name);
    setFormQuestions([...bank.questions]);
    setMode("edit");
  };

  // Update bank
  const handleUpdate = async () => {
    if (!selectedBank || !formName.trim() || formQuestions.length === 0) {
      setSaveStatus("Nombre y preguntas requeridos");
      return;
    }

    if (selectedBank.id < 0) {
      setSaveStatus("Los bancos predeterminados no se pueden editar");
      return;
    }

    setSaveStatus("Actualizando...");
    try {
      const res = await fetch(`/api/questionsets/${selectedBank.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), questions: formQuestions }),
      });

      if (res.ok) {
        setBanks(banks.map((b) => 
          b.id === selectedBank.id ? { ...b, name: formName, questions: formQuestions } : b
        ));
        setMode("list");
        setSelectedBank(null);
        setFormName("");
        setFormQuestions([]);
        setSaveStatus("");
      } else {
        setSaveStatus("Error al actualizar");
      }
    } catch {
      setSaveStatus("Error de conexión");
    }
  };

  // Preview bank
  const handlePreview = (bank: QuestionBank) => {
    setSelectedBank(bank);
    setMode("preview");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bancos de Preguntas</h1>
          <p className="text-slate-400 mt-1">Gestiona los bancos para la Ruleta Académica</p>
        </div>
        {mode === "list" && (
          <button
            onClick={() => {
              setMode("create");
              setFormName("");
              setFormQuestions([]);
              setSaveStatus("");
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Banco
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* LIST MODE */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {mode === "list" && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-slate-400 animate-pulse">Cargando bancos...</div>
          ) : banks.length === 0 ? (
            <div className="text-slate-400">No hay bancos de preguntas</div>
          ) : (
            <div className="grid gap-4">
              {banks.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{bank.name}</h3>
                      {bank.id < 0 && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          Predeterminado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {bank.questions.length} preguntas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(bank)}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Vista previa"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {bank.id > 0 && (
                      <>
                        <button
                          onClick={() => handleEdit(bank)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bank.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* CREATE / EDIT MODE */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {(mode === "create" || mode === "edit") && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {mode === "create" ? "Crear Nuevo Banco" : "Editar Banco"}
            </h2>
            <button
              onClick={() => {
                setMode("list");
                setSelectedBank(null);
                setFormName("");
                setFormQuestions([]);
                setSaveStatus("");
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bank name */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Nombre del banco</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ej: Química Orgánica - Parcial 1"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Add question */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Agregar pregunta</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
                placeholder="Escribe una pregunta y presiona Enter"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleAddQuestion}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Questions list */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Preguntas ({formQuestions.length})
            </label>
            {formQuestions.length === 0 ? (
              <div className="text-slate-500 text-sm italic">
                Aún no hay preguntas. Agrega algunas arriba.
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {formQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3 group"
                  >
                    <span className="text-emerald-400 font-mono text-sm">{i + 1}.</span>
                    <span className="flex-1 text-slate-300 text-sm">{q}</span>
                    <button
                      onClick={() => handleRemoveQuestion(i)}
                      className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Save button */}
          {saveStatus && (
            <div className="text-amber-400 text-sm">{saveStatus}</div>
          )}
          <button
            onClick={mode === "create" ? handleSave : handleUpdate}
            disabled={!formName.trim() || formQuestions.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {mode === "create" ? "Guardar Banco" : "Actualizar Banco"}
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* PREVIEW MODE */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {mode === "preview" && selectedBank && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{selectedBank.name}</h2>
              <p className="text-slate-400 text-sm">{selectedBank.questions.length} preguntas</p>
            </div>
            <button
              onClick={() => {
                setMode("list");
                setSelectedBank(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {selectedBank.questions.map((q, i) => (
              <li key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                <span className="text-cyan-400 font-mono text-sm">{i + 1}.</span>
                <span className="text-slate-300 text-sm">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
