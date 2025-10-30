"use client"
import React, { useRef, useState } from "react"

interface FileUploaderProps {
  onUpload: (file: File) => void
  loading: boolean
}

export default function FileUploader({ onUpload, loading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  function handleFile(file: File) {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setError("Formato no válido. Solo se permiten archivos .csv o .xlsx.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo supera el límite de 10 MB.")
      return
    }
    setError(null)
    onUpload(file)
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div
        className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Subir archivo"
      >
        <input
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          ref={inputRef}
          onChange={handleChange}
          disabled={loading}
        />
        <span className="text-primary text-3xl mb-2">⬆️</span>
        <span className="text-gray-700 font-medium">Arrastra y suelta tu archivo aquí</span>
        <span className="text-xs text-gray-500">o haz clic para seleccionar un archivo .csv o .xlsx (máx. 10 MB)</span>
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  )
}
