"use client";
import React, { useRef, useState } from "react";

interface FileUploaderProps {
  onUpload: (file: File) => void;
  loading: boolean;
}

export default function FileUploader({ onUpload, loading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  function handleFile(file: File) {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      setError("Formato no válido. Solo se permiten archivos .csv o .xlsx.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo supera el límite de 10 MB.");
      return;
    }
    setError(null);
    onUpload(file);
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className={`w-full relative overflow-hidden rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-400 shadow-lg"
            : "bg-white border-2 border-dashed border-slate-300 hover:border-cyan-300 hover:shadow-md"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !loading && inputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Subir archivo"
      >
        {dragActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 animate-pulse"></div>
        )}

        <input
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          ref={inputRef}
          onChange={handleChange}
          disabled={loading}
        />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
            📁
          </div>
          <div>
            <p className="text-slate-900 font-semibold text-center">
              Arrastra archivos aquí
            </p>
            <p className="text-xs text-slate-500 text-center mt-1">
              o haz clic para seleccionar (.csv o .xlsx)
            </p>
          </div>
          <div className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 rounded-lg text-xs text-slate-700 font-medium">
            Máximo 10 MB
          </div>
        </div>
      </div>
      {error && (
        <div className="w-full flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600 mt-0.5 text-lg">⚠️</span>
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
