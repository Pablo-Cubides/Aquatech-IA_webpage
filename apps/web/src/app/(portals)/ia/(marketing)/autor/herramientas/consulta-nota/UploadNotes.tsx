"use client";

import React from "react";

interface UploadResult {
  success: boolean;
  inserted?: number;
  total?: number;
  valid?: number;
  invalid?: number;
  validationErrors?: Array<{ index: number; errors: string[] }>;
  error?: string;
}

export default function UploadNotes() {
  const [status, setStatus] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<UploadResult | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;

    setIsLoading(true);
    setStatus("Leyendo archivo Excel...");
    setResult(null);

    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("El archivo es muy grande. Máximo 5MB.");
      }

      // Validate file type
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error("Solo se aceptan archivos .xlsx o .xls");
      }

      const XLSX = await import("xlsx");
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      if (workbook.SheetNames.length === 0) {
        throw new Error("El archivo Excel no contiene hojas");
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: null }) as any[];

      if (rows.length === 0) {
        throw new Error("El archivo no contiene datos");
      }

      // Map rows to expected payload with better field mapping
      const notes = rows.map((r) => ({
        university:
          r.university || r.univ || r.Universidad || r.universidad || "",
        course: r.course || r.curso || r.Course || r.Curso || "",
        code: String(r.code || r.codigo || r.Code || r.Codigo || ""),
        grade: Number(r.grade ?? r.nota ?? r.Grade ?? r.Nota ?? 0),
        studentName:
          r.name || r.nombre || r.studentName || r.Name || r.Nombre || null,
        metadata: null,
      }));

      setStatus(
        `Procesadas ${notes.length} filas. Subiendo a la base de datos...`,
      );

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      const json = await res.json();

      if (res.ok) {
        setResult(json);
        setStatus(
          `✅ Subida completada: ${json.inserted} notas insertadas de ${json.total} totales` +
            (json.invalid > 0 ? ` (${json.invalid} inválidas)` : ""),
        );
      } else {
        setResult(json);
        throw new Error(json.error || "Error desconocido del servidor");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus(
        `❌ Error: ${err.message || "Error leyendo o subiendo el archivo"}`,
      );
      setResult({ success: false, error: err.message });
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="mt-8 p-6 bg-black/20 rounded-lg border border-[var(--border-color)]">
      <div className="flex items-center gap-3 mb-4">
        <svg
          className="w-6 h-6 text-[var(--accent-purple)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div>
          <h4 className="font-bold text-lg">Administrador: Subir Notas</h4>
          <p className="text-sm text-[var(--text-secondary)]">
            Carga archivo Excel con las calificaciones de los estudiantes
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Seleccionar archivo Excel (.xlsx, .xls)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) =>
            handleFile(e.target.files ? e.target.files[0] : null)
          }
          disabled={isLoading}
          className="block w-full text-sm text-[var(--text-secondary)]
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-gradient-to-r file:from-[var(--primary-cyan)] file:to-[var(--accent-purple)]
            file:text-white
            hover:file:opacity-90
            file:cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-3">
          <svg
            className="animate-spin h-5 w-5 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm">Procesando...</span>
        </div>
      )}

      {status && !isLoading && (
        <div
          className={`p-3 rounded-lg mb-3 text-sm ${
            status.includes("✅")
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : status.includes("❌")
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : "bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/30"
          }`}
        >
          {status}
        </div>
      )}

      {result &&
        result.validationErrors &&
        result.validationErrors.length > 0 && (
          <details className="mb-3">
            <summary className="cursor-pointer text-sm text-yellow-400 hover:text-yellow-300">
              Ver errores de validación ({result.validationErrors.length})
            </summary>
            <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs max-h-40 overflow-y-auto">
              {result.validationErrors.map((err, idx) => (
                <div key={idx} className="mb-2">
                  <span className="font-semibold">Fila {err.index + 1}:</span>
                  <ul className="ml-4 list-disc">
                    {err.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )}

      <div className="mt-4 p-3 bg-black/30 rounded text-xs text-[var(--text-secondary)]">
        <p className="font-semibold mb-1">
          📋 Formato esperado del archivo Excel:
        </p>
        <ul className="list-disc ml-4 space-y-1">
          <li>
            <strong>universidad / university:</strong> Nombre de la universidad
            (requerido)
          </li>
          <li>
            <strong>curso / course:</strong> Nombre del curso (requerido)
          </li>
          <li>
            <strong>codigo / code:</strong> Código del estudiante (requerido)
          </li>
          <li>
            <strong>nota / grade:</strong> Calificación numérica 0-5 (requerido)
          </li>
          <li>
            <strong>nombre / name:</strong> Nombre del estudiante (opcional)
          </li>
        </ul>
        <p className="mt-2 text-yellow-400">
          ⚠️ Máximo 1000 notas por archivo. Tamaño máximo 5MB.
        </p>
      </div>
    </div>
  );
}
