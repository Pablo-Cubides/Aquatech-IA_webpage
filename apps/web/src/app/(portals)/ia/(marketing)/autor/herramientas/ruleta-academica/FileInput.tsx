"use client";
import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { sanitizeText } from "@/lib/sanitize";

interface FileInputProps {
  groupName: string;
  onGroupNameChange: (name: string) => void;
  onUpload: (questions: string[], name: string) => void;
  onSaveSuccess?: () => void;
  selectedSet?: number | null;
  fileQuestions?: string[];
  showGroupNameInput?: boolean;
  onSave?: (questions: string[], name: string) => Promise<void>;
}

// Helper function to parse questions from a file
async function parseQuestionsFromFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      Papa.parse(file, {
        encoding: "ISO-8859-1",
        complete: (results) => {
          const questions = results.data
            .flat()
            .map((q) => sanitizeText(String(q)))
            .filter(Boolean);
          if (questions.length === 0) {
            return reject(
              new Error(
                "No se encontraron preguntas válidas en el archivo CSV.",
              ),
            );
          }
          resolve(questions);
        },
        error: (err) => {
          reject(new Error(`Error al procesar el archivo CSV: ${err.message}`));
        },
        skipEmptyLines: true,
      });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as any[][];
          const questions = jsonData
            .flat()
            .map((q) => sanitizeText(String(q)))
            .filter(Boolean);
          if (questions.length === 0) {
            return reject(
              new Error(
                "No se encontraron preguntas válidas en el archivo Excel.",
              ),
            );
          }
          resolve(questions);
        } catch (err: any) {
          reject(
            new Error(`Error al procesar el archivo Excel: ${err.message}`),
          );
        }
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsBinaryString(file);
    }
  });
}

const FileInput = ({
  groupName,
  onGroupNameChange,
  onUpload,
  onSaveSuccess,
  selectedSet,
  fileQuestions = [],
  showGroupNameInput = true,
  onSave,
}: FileInputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionsPreview, setQuestionsPreview] = useState<string[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Solo se permiten archivos CSV o Excel (.csv, .xlsx)");
      setFile(null);
      setQuestionsPreview([]);
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setError("Archivo demasiado grande (máx 5MB)");
      setFile(null);
      setQuestionsPreview([]);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    try {
      const questions = await parseQuestionsFromFile(selectedFile);
      setQuestionsPreview(questions);
    } catch (err: any) {
      setError(err.message || "Error al previsualizar el archivo.");
      setQuestionsPreview([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (playAfterUpload = false) => {
    if (!file) {
      setError("Por favor, seleccione un archivo");
      return;
    }
    if (!groupName.trim()) {
      setError("Por favor, ingrese un nombre para el grupo de preguntas");
      return;
    }

    if (playAfterUpload) {
      try {
        const questions = await parseQuestionsFromFile(file);
        try {
          sessionStorage.setItem("tempQuestions", JSON.stringify(questions));
          window.location.href = `/ia/autor/herramientas/ruleta-academica/juego?temp=1`;
        } catch (e) {
          const encoded = encodeURIComponent(JSON.stringify(questions));
          window.location.href = `/ia/autor/herramientas/ruleta-academica/juego?questions=${encoded}`;
        }
      } catch (err: any) {
        setError(err.message || "Error al procesar el archivo");
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const questions = await parseQuestionsFromFile(file);
      onUpload(questions, groupName);
      setIsUploaded(true);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayClick = async () => {
    if (selectedSet) {
      window.location.href = `/ia/autor/herramientas/ruleta-academica/juego?id=${selectedSet}`;
    } else if (fileQuestions.length > 0) {
      const encoded = encodeURIComponent(JSON.stringify(fileQuestions));
      window.location.href = `/ia/autor/herramientas/ruleta-academica/juego?questions=${encoded}`;
    } else if (file) {
      try {
        const questions = await parseQuestionsFromFile(file);
        sessionStorage.setItem("tempQuestions", JSON.stringify(questions));
        window.location.href = `/ia/autor/herramientas/ruleta-academica/juego?temp=1`;
      } catch (err) {
        await handleUpload(true);
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h2 className="heading-primary">Cargar Preguntas</h2>

        <div className="space-y-6">
          {showGroupNameInput && (
            <div>
              <label className="block mb-3 text-2xl font-medium text-white">
                Nombre del grupo:
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => onGroupNameChange(e.target.value)}
                placeholder="Ej: Historia Universal"
                className="w-full p-4 mb-6 text-xl input-primary"
              />
            </div>
          )}

          <div>
            <label className="block mb-3 text-2xl font-medium text-white">
              Archivo de preguntas:
            </label>
            <div className="flex items-center space-x-6">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".csv,.xlsx"
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="btn-primary inline-block cursor-pointer"
              >
                Seleccionar archivo
              </label>
              {file && <span className="text-2xl text-white">{file.name}</span>}
            </div>
          </div>

          {error && <p className="text-2xl text-red-500">{error}</p>}

          {isLoading && (
            <p className="text-xl text-white">Procesando archivo...</p>
          )}

          {!isLoading && questionsPreview.length > 0 && (
            <div className="p-6 mt-6 overflow-y-auto bg-gray-800 rounded-2xl max-h-80">
              <h3 className="mb-4 text-2xl font-semibold text-white">
                Vista previa de preguntas ({questionsPreview.length}):
              </h3>
              <div className="space-y-4">
                {questionsPreview.slice(0, 10).map((question, index) => (
                  <p key={index} className="text-xl text-white">
                    {index + 1}. {question}
                  </p>
                ))}
                {questionsPreview.length > 10 && (
                  <p className="text-gray-400">
                    ...y {questionsPreview.length - 10} más.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-8">
            {!isUploaded && questionsPreview.length > 0 && (
              <button
                key="save-button"
                onClick={async () => {
                  if (!file) {
                    setError("Por favor, seleccione un archivo");
                    return;
                  }
                  if (!groupName.trim()) {
                    setError(
                      "Por favor, ingrese un nombre para el grupo de preguntas",
                    );
                    return;
                  }
                  setIsLoading(true);
                  setError(null);
                  try {
                    const questions = await parseQuestionsFromFile(file);
                    if (typeof onSave === "function") {
                      await onSave(questions, groupName);
                      setIsUploaded(true);
                      if (onSaveSuccess) onSaveSuccess();
                    } else {
                      onUpload(questions, groupName);
                      setIsUploaded(true);
                      if (onSaveSuccess) onSaveSuccess();
                    }
                  } catch (err: any) {
                    setError(err.message || "Error al procesar el archivo");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full px-8 py-5 text-2xl font-bold text-white transition-colors bg-green-600 rounded-2xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !groupName.trim()}
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </button>
            )}

            {(isUploaded || questionsPreview.length > 0 || file) && (
              <button
                key="play-button"
                onClick={handlePlayClick}
                className={`w-full px-8 py-5 text-2xl font-bold rounded-2xl transition-colors ${
                  isUploaded ? "bg-blue-600 hover:bg-blue-700" : "btn-primary"
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isLoading || !groupName.trim()}
              >
                {isLoading ? "Cargando..." : "Jugar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
