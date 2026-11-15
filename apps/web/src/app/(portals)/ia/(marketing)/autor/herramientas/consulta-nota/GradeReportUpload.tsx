"use client";
// Interactive grade lookup, file selection or accessible detail disclosure.
import { useState } from "react";
import { gradeBatchSchema, type GradeBatch } from "@ia-next/contracts";
export default function GradeReportUpload() {
  const [batch, setBatch] = useState<GradeBatch | null>(null);
  const [publish, setPublish] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function read(file: File | undefined) {
    setBatch(null);
    setMessage("");
    if (!file) return;
    try {
      if (file.size > 3000000) throw Error("El archivo excede 3 MB.");
      const result = gradeBatchSchema.safeParse(JSON.parse(await file.text()));
      if (!result.success)
        throw Error(
          "Selecciona el JSON conciliado y sin nombres de Exportar para Aquatech, en Colega.",
        );
      setBatch(result.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Archivo inválido.");
    }
  }
  async function upload() {
    if (!batch) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/grade-reports/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch, publish }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "No se pudo importar.");
      setMessage(
        `${data.students} registros revisados; ${data.changed} actualizados. ${publish ? "Disponibles para consulta por código." : "Guardados como privados."}`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo importar.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mt-10 space-y-4 rounded-xl border border-white/15 bg-white/[0.03] p-5">
      <h2 className="font-semibold">Administración de calificaciones</h2>
      <p className="text-sm text-slate-400">
        Importa el JSON de Colega para conservar actividades, escalas y
        justificaciones.
      </p>
      <input
        aria-label="Exportación de Colega"
        type="file"
        accept="application/json,.json"
        onChange={(e) => void read(e.target.files?.[0])}
        className="block max-w-full text-sm"
      />
      {batch ? (
        <>
          <p className="text-sm">
            {batch.courseTitle} · {batch.group} · {batch.period} · Corte{" "}
            {batch.cut}: {batch.students.length} estudiantes,{" "}
            {batch.students.reduce(
              (n, s) => n + s.grades.filter((g) => g.grade !== null).length,
              0,
            )}{" "}
            notas y{" "}
            {batch.students.reduce(
              (n, s) => n + s.grades.filter((g) => g.grade === null).length,
              0,
            )}{" "}
            pendientes.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            Publicar para consulta por código
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void upload()}
            className="min-h-11 rounded-lg bg-cyan-200 px-4 font-semibold text-slate-950 disabled:opacity-50"
          >
            {busy
              ? "Importando…"
              : publish
                ? "Importar y publicar"
                : "Importar como privado"}
          </button>
        </>
      ) : null}
      <p role="status" className="text-sm">
        {message}
      </p>
    </section>
  );
}
