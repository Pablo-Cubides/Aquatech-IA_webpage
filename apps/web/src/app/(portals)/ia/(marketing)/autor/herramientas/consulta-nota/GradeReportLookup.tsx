"use client";
// Interactive grade lookup, file selection or accessible detail disclosure.
import { useEffect, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { GradeCourse, StudentGradeReport } from "@ia-next/contracts";
import GradeDetail from "./GradeDetail";
const score = (v: number | null) =>
  v === null
    ? "Pendiente"
    : v.toLocaleString("es-CO", { maximumFractionDigits: 2 });
export default function GradeReportLookup() {
  const [code, setCode] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState<GradeCourse[]>([]);
  const [reports, setReports] = useState<StudentGradeReport[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [catalogError, setCatalogError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/grade-reports/catalog", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw Error();
        return response.json();
      })
      .then((data) => {
        if (active) setCourses(data.courses);
      })
      .catch(() => {
        if (active)
          setCatalogError(
            "Puedes consultar por código; el filtro de cursos no está disponible.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  async function search(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setReports([]);
    setMessage("");
    try {
      const selected = courses.find(
        (c) => `${c.period}:${c.courseId}` === course,
      );
      const response = await fetch("/api/grade-reports/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          ...(selected
            ? { courseId: selected.courseId, period: selected.period }
            : {}),
        }),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "No se pudo consultar.");
      setReports(data.reports);
      if (!data.found)
        setMessage(
          "No hay calificaciones publicadas para ese código en los cursos seleccionados.",
        );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo consultar.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="Consulta de calificaciones" className="space-y-6">
      <form
        onSubmit={search}
        className="grid gap-4 rounded-2xl border border-white/15 bg-white/[0.03] p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]"
      >
        <label className="text-sm text-slate-200">
          Código estudiantil
          <input
            data-testid="grade-code"
            required
            inputMode="numeric"
            pattern="[0-9]{4,20}"
            autoComplete="off"
            className="mt-2 block min-h-12 w-full rounded-lg border border-white/20 bg-slate-950 px-3 text-white focus:border-cyan-200 focus:outline-none"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setReports([]);
              setMessage("");
            }}
            placeholder="Ingresa tu código completo"
          />
        </label>
        <label className="text-sm text-slate-200">
          Curso y grupo
          <select
            className="mt-2 block min-h-12 w-full rounded-lg border border-white/20 bg-slate-950 px-3 text-white"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setReports([]);
            }}
          >
            <option value="">Todos mis cursos</option>
            {Array.from(
              new Map(
                courses.map((c) => [`${c.period}:${c.courseId}`, c]),
              ).values(),
            ).map((c) => (
              <option
                value={`${c.period}:${c.courseId}`}
                key={`${c.period}:${c.courseId}`}
              >
                {c.courseTitle} · {c.groupLabel} · {c.period}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60"
        >
          <Search className="h-4 w-4" />
          {busy ? "Consultando…" : "Consultar"}
        </button>
      </form>
      {catalogError ? (
        <p className="text-sm text-slate-400">{catalogError}</p>
      ) : null}
      <p role="status" className="text-sm text-slate-200">
        {message}
      </p>
      {reports.map((report) => (
        <article
          key={`${report.period}:${report.courseId}:${report.cut}`}
          className="rounded-2xl border border-white/15 bg-slate-900/50 p-5 sm:p-6"
          data-testid="grade-report"
        >
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-100">
                Código {report.studentCode}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                {report.courseTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Grupo {report.group} · {report.period} · Corte {report.cut}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Total del corte</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {score(report.cutTotal)}
                {report.cutTotal !== null ? (
                  <span className="text-sm font-normal text-slate-400">
                    {" "}
                    /{report.cutMax}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          <div className="mb-2 grid grid-cols-[minmax(0,1fr)_6rem_3rem] gap-2 border-b border-white/15 pb-2 text-xs uppercase tracking-wide text-slate-400">
            <span>Actividad</span>
            <span className="text-right">Nota</span>
            <span className="text-center">Detalle</span>
          </div>
          <ul className="divide-y divide-white/10">
            {report.grades.map((row) => (
              <li
                key={row.activityId}
                className="grid grid-cols-[minmax(0,1fr)_6rem_3rem] items-center gap-2 py-2.5"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-sm text-slate-100">{row.title}</p>
                  {!row.countsTowardAggregate ? (
                    <p className="mt-1 text-xs text-slate-400">
                      Solo seguimiento
                    </p>
                  ) : null}
                </div>
                <p className="text-right text-sm font-semibold tabular-nums text-white">
                  {score(row.grade)}
                  {row.grade !== null && row.max !== null ? (
                    <span className="ml-1 font-normal text-slate-400">
                      /{row.max}
                    </span>
                  ) : null}
                </p>
                <GradeDetail title={row.title} comment={row.justification} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-400">
            Pendiente indica que falta una nota. Pasa sobre el icono de detalle
            o púlsalo para ver el motivo.
          </p>
        </article>
      ))}
    </section>
  );
}
