"use client";

import React from "react";

export default function UploadNotes() {
  const [status, setStatus] = React.useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setStatus("Leyendo archivo...");
    try {
      const XLSX = await import("xlsx");
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: null }) as any[];

      // Map rows to expected payload
      const notes = rows.map((r) => ({
        university: r.university || r.univ || r.Universidad || r.universidad || "",
        course: r.course || r.curso || r.Course || r.curso || "",
        code: r.code || r.codigo || r.Code || r.codigo || "",
        grade: Number(r.grade ?? r.nota ?? r.Grade ?? 0),
        studentName: r.name || r.nombre || r.studentName || null,
        metadata: null,
      }));

      setStatus(`Parsed ${notes.length} rows, subiendo...`);
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus(`Subida completada. Insertados: ${json.inserted || notes.length}`);
      } else {
        setStatus(`Error: ${json.error || res.statusText}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatus("Error leyendo o subiendo el archivo");
    }
  };

  return (
    <div className="mt-8 p-6 bg-black/20 rounded">
      <h4 className="font-bold mb-3">Administrador: subir archivo Excel (.xlsx)</h4>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
        className="mb-3"
      />
      <div className="text-sm text-[var(--text-secondary)]">{status}</div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Formato esperado: columnas universidad, course/curso, code/codigo, grade/nota, name/nombre</p>
    </div>
  );
}
