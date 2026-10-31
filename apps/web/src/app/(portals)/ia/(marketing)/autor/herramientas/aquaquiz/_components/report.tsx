"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  LockKeyhole,
  Pencil,
  UnlockKeyhole,
} from "lucide-react";
import {
  ActionButton,
  AQUAQUIZ_ROOT,
  AquaQuizFrame,
  aquaFetch,
  EmptyState,
  Field,
  Notice,
  Panel,
  SelectField,
} from "./ui";

type ReportRow = {
  attendanceId: string | null;
  enrollmentId: string;
  studentCode: string;
  nickname: string;
  initialAccess: string;
  status: "PRESENT" | "LATE" | "EXCUSED" | "ABSENT";
  firstArrival: string | null;
  questionsAnswered: number;
  correctAnswers: number;
  score: number;
};
type MeetingReport = {
  meeting: {
    id: string;
    date: string;
    startTime: string | null;
    lateAfterMinutes: number | null;
    attendanceLocked: boolean;
    course: {
      title: string;
      groupName: string;
      enrollments: { id: string; studentCode: string; source: string }[];
    };
    sessions: {
      id: string;
      pin: string;
      phase: string;
      quizTitle: string;
      questionCount: number;
      participantCount: number;
      leaderboard: { place: number; nickname: string; score: number }[];
    }[];
  };
  rows: ReportRow[];
};

const statusLabels: Record<ReportRow["status"], string> = {
  PRESENT: "Presente",
  LATE: "Tarde",
  EXCUSED: "Justificado",
  ABSENT: "Ausente",
};
function readableDate(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00-05:00`).toLocaleDateString(
    "es-CO",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Bogota",
    },
  );
}
function readableTime(value: string | null) {
  return value
    ? new Date(value).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
      })
    : "—";
}
function errorText(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Ocurrió un error. Vuelve a intentarlo.";
}

export function AquaQuizReport({ meetingId }: { meetingId: string }) {
  const [report, setReport] = useState<MeetingReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [status, setStatus] = useState<ReportRow["status"]>("PRESENT");
  const [reason, setReason] = useState("");
  const [manualRow, setManualRow] = useState<ReportRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await aquaFetch<MeetingReport>(`meetings/${meetingId}`));
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setLoading(false);
    }
  }, [meetingId]);
  useEffect(() => {
    void load();
  }, [load]);

  async function toggleLock() {
    if (!report) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await aquaFetch(`meetings/${meetingId}`, {
        method: "PATCH",
        body: JSON.stringify({ locked: !report.meeting.attendanceLocked }),
      });
      setSuccess(
        report.meeting.attendanceLocked
          ? "La asistencia vuelve a aceptar ingresos."
          : "La asistencia quedó cerrada. Los estudiantes que ya entraron pueden reconectarse.",
      );
      await load();
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setSaving(false);
    }
  }
  function startEdit(row: ReportRow) {
    if (!row.attendanceId) return;
    setEditing(row.attendanceId);
    setNickname(row.nickname);
    setStudentCode(row.studentCode);
    setStatus(row.status === "ABSENT" ? "EXCUSED" : row.status);
    setReason("");
  }
  function startManual(row: ReportRow) {
    setEditing(null);
    setManualRow(row);
    setStudentCode(row.studentCode);
    setNickname(row.studentCode);
    setStatus("EXCUSED");
    setReason("");
  }
  async function saveEdit(event: FormEvent, row: ReportRow) {
    event.preventDefault();
    if (!row.attendanceId) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await aquaFetch(`meetings/${meetingId}/attendances/${row.attendanceId}`, {
        method: "PATCH",
        body: JSON.stringify({ nickname, studentCode, status, reason }),
      });
      setSuccess(`Se guardó la corrección del código ${studentCode}.`);
      setEditing(null);
      await load();
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setSaving(false);
    }
  }
  async function saveManual(event: FormEvent) {
    event.preventDefault();
    if (!manualRow) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await aquaFetch(`meetings/${meetingId}/attendances`, {
        method: "POST",
        body: JSON.stringify({ studentCode, nickname, status, reason }),
      });
      setSuccess(`Se guardó la asistencia del código ${studentCode}.`);
      setManualRow(null);
      await load();
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setSaving(false);
    }
  }
  async function downloadCsv() {
    setError("");
    try {
      const response = await fetch(
        `/api/aquaquiz/meetings/${meetingId}?format=csv`,
        { credentials: "same-origin", cache: "no-store" },
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "No se pudo exportar el reporte.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `aquatech-asistencia-${report?.meeting.date || "clase"}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(errorText(caught));
    }
  }
  async function downloadExcel() {
    if (!report) return;
    setError("");
    try {
      const XLSX = await import("xlsx");
      const values = [
        [
          "Fecha",
          "Curso",
          "Grupo",
          "Código",
          "Apodo",
          "Ingreso",
          "Primera entrada",
          "Estado",
          "Respuestas",
          "Aciertos",
          "Puntos",
        ],
        ...report.rows.map((row) => [
          report.meeting.date,
          report.meeting.course.title,
          report.meeting.course.groupName,
          row.studentCode,
          row.nickname,
          row.initialAccess,
          row.firstArrival ? readableTime(row.firstArrival) : "",
          statusLabels[row.status],
          String(row.questionsAnswered),
          String(row.correctAnswers),
          String(row.score),
        ]),
      ];
      const sheet = XLSX.utils.aoa_to_sheet(values);
      report.rows.forEach((_, index) => {
        const cell = sheet[`D${index + 2}`];
        if (cell) {
          cell.t = "s";
          cell.z = "@";
        }
      });
      sheet["!cols"] = [
        { wch: 13 },
        { wch: 28 },
        { wch: 22 },
        { wch: 18 },
        { wch: 24 },
        { wch: 14 },
        { wch: 20 },
        { wch: 16 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
      ];
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, "Asistencia");
      XLSX.writeFile(book, `aquatech-asistencia-${report.meeting.date}.xlsx`);
    } catch (caught) {
      setError(errorText(caught));
    }
  }

  if (loading && !report)
    return (
      <AquaQuizFrame title="Reporte de clase">
        <Panel>
          <p className="animate-pulse text-sm text-[#AAB5CA]">
            Cargando asistencia…
          </p>
        </Panel>
      </AquaQuizFrame>
    );
  if (!report)
    return (
      <AquaQuizFrame title="No se pudo abrir el reporte">
        <Notice tone="error">{error || "No encontramos esta clase."}</Notice>
      </AquaQuizFrame>
    );
  const present = report.rows.filter(
    (row) => row.status === "PRESENT" || row.status === "LATE",
  ).length;
  const absent = report.rows.filter((row) => row.status === "ABSENT").length;
  const average = report.rows.length
    ? Math.round(
        report.rows.reduce((sum, row) => sum + row.score, 0) /
          report.rows.length,
      )
    : 0;
  return (
    <AquaQuizFrame
      wide
      title={report.meeting.course.title}
      subtitle={`${report.meeting.course.groupName} · ${readableDate(report.meeting.date)}${report.meeting.startTime ? ` · ${report.meeting.startTime}` : ""}`}
      action={
        <div className="flex flex-wrap gap-2">
          <ActionButton
            variant="secondary"
            disabled={saving}
            onClick={() => void toggleLock()}
          >
            {report.meeting.attendanceLocked ? (
              <>
                <UnlockKeyhole size={16} /> Abrir ingreso
              </>
            ) : (
              <>
                <LockKeyhole size={16} /> Cerrar asistencia
              </>
            )}
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => void downloadCsv()}>
            <Download size={16} /> CSV
          </ActionButton>
          <ActionButton onClick={() => void downloadExcel()}>
            <FileSpreadsheet size={16} /> Excel
          </ActionButton>
        </div>
      }
    >
      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Notice tone="success">{success}</Notice>
        </div>
      )}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="En lista oficial"
          value={report.meeting.course.enrollments.length.toString()}
          detail="códigos"
        />
        <Stat
          label="Registrados"
          value={present.toString()}
          detail={`${report.rows.length} registros totales`}
        />
        <Stat
          label="Ausentes"
          value={absent.toString()}
          detail={
            report.meeting.attendanceLocked
              ? "lista cerrada"
              : "al cerrar el ingreso"
          }
        />
        <Stat
          label="Puntaje promedio"
          value={average.toLocaleString("es-CO")}
          detail="puntos acumulados"
        />
      </div>
      {!report.meeting.attendanceLocked && (
        <div className="mb-5">
          <Notice>
            La lista de ausentes se completa al cerrar el ingreso. Los
            participantes que ya iniciaron pueden volver a conectarse aunque
            cierres la lista.
          </Notice>
        </div>
      )}
      <Panel className="mb-6 overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
              Asistencia por código
            </p>
            <h2 className="mt-1 text-xl font-bold">
              {report.rows.length} estudiantes
            </h2>
          </div>
          <p className="text-xs text-[#8794AA]">
            Los códigos se mantienen como texto para conservar ceros iniciales.
          </p>
        </div>
        {report.rows.length === 0 ? (
          <div className="p-5">
            <EmptyState title="Sin asistencia todavía">
              La lista del curso está vacía o nadie ha entrado a la sala.
            </EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-white/[0.025] text-xs uppercase tracking-wide text-[#8492A9]">
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Apodo</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Ingreso</th>
                  <th className="px-5 py-3">Respuestas</th>
                  <th className="px-5 py-3">Aciertos</th>
                  <th className="px-5 py-3">Puntos</th>
                  <th className="px-5 py-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {report.rows.map((row) => (
                  <tr
                    key={row.enrollmentId}
                    className="align-top hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-[#E3ECFA]">
                      {row.studentCode}
                    </td>
                    <td className="px-5 py-4 text-white">
                      {row.nickname || (
                        <span className="text-[#7F8BA0]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${row.status === "PRESENT" ? "bg-emerald-300/10 text-emerald-200" : row.status === "LATE" ? "bg-amber-300/10 text-amber-100" : row.status === "ABSENT" ? "bg-rose-300/10 text-rose-200" : "bg-slate-300/10 text-slate-200"}`}
                      >
                        {statusLabels[row.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#AAB5CA]">
                      {row.firstArrival ? readableTime(row.firstArrival) : "—"}
                      <span className="ml-2 text-xs text-[#748198]">
                        {row.initialAccess === "ACCOUNT"
                          ? "cuenta"
                          : row.initialAccess === "GUEST"
                            ? "invitado"
                            : row.initialAccess === "TEACHER"
                              ? "docente"
                              : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4 tabular-nums text-[#D3DDED]">
                      {row.questionsAnswered}
                    </td>
                    <td className="px-5 py-4 tabular-nums text-[#D3DDED]">
                      {row.correctAnswers}
                    </td>
                    <td className="px-5 py-4 font-bold tabular-nums text-[#8EF5FF]">
                      {row.score.toLocaleString("es-CO")}
                    </td>
                    <td className="px-5 py-4">
                      {row.attendanceId ? (
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-[#8EF5FF] hover:bg-[#00C9DF]/10"
                        >
                          <Pencil size={13} /> Corregir
                        </button>
                      ) : row.status === "ABSENT" ? (
                        <button
                          type="button"
                          onClick={() => startManual(row)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-[#8EF5FF] hover:bg-[#00C9DF]/10"
                        >
                          <Pencil size={13} /> Registrar
                        </button>
                      ) : (
                        <span className="text-xs text-[#748198]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      {manualRow && (
        <Panel className="mb-6 border-[#00C9DF]/25">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
            Registrar o justificar ausencia · código {manualRow.studentCode}
          </p>
          <form
            onSubmit={(event) => void saveManual(event)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <Field
              label="Código"
              value={studentCode}
              onChange={(event) =>
                setStudentCode(event.target.value.toLocaleUpperCase("es-CO"))
              }
              required
              maxLength={32}
            />
            <Field
              label="Apodo para el reporte"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
              minLength={2}
              maxLength={24}
            />
            <SelectField
              label="Estado"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ReportRow["status"])
              }
            >
              <option value="PRESENT">Presente</option>
              <option value="LATE">Tarde</option>
              <option value="EXCUSED">Justificado</option>
            </SelectField>
            <Field
              label="Motivo"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              minLength={5}
              maxLength={500}
              placeholder="Ej. Asistencia verificada por el docente"
              required
            />
            <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-4">
              <ActionButton
                type="submit"
                disabled={saving || reason.trim().length < 5}
                aria-busy={saving}
              >
                <Pencil size={15} /> Guardar con auditoría
              </ActionButton>
              <ActionButton
                type="button"
                variant="secondary"
                onClick={() => setManualRow(null)}
              >
                Cancelar
              </ActionButton>
            </div>
          </form>
        </Panel>
      )}
      {editing && (
        <Panel className="mb-6 border-[#00C9DF]/25">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
            Corrección con auditoría
          </p>
          {report.rows
            .filter((row) => row.attendanceId === editing)
            .map((row) => (
              <form
                key={row.attendanceId}
                onSubmit={(event) => void saveEdit(event, row)}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              >
                <Field
                  label="Código"
                  value={studentCode}
                  onChange={(event) =>
                    setStudentCode(
                      event.target.value.toLocaleUpperCase("es-CO"),
                    )
                  }
                  required
                  maxLength={32}
                />
                <Field
                  label="Apodo"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  required
                  minLength={2}
                  maxLength={24}
                />
                <SelectField
                  label="Estado"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as ReportRow["status"])
                  }
                >
                  <option value="PRESENT">Presente</option>
                  <option value="LATE">Tarde</option>
                  <option value="EXCUSED">Justificado</option>
                </SelectField>
                <Field
                  label="Motivo del cambio"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  minLength={5}
                  maxLength={500}
                  placeholder="Ej. El estudiante presentó soporte"
                  required
                />
                <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-4">
                  <ActionButton
                    type="submit"
                    disabled={saving || reason.trim().length < 5}
                    aria-busy={saving}
                  >
                    <Pencil size={15} /> Guardar corrección
                  </ActionButton>
                  <ActionButton
                    type="button"
                    variant="secondary"
                    onClick={() => setEditing(null)}
                  >
                    Cancelar
                  </ActionButton>
                </div>
              </form>
            ))}
        </Panel>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        {report.meeting.sessions.map((session) => (
          <Panel key={session.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00C9DF]">
                  Partida · PIN {session.pin}
                </p>
                <h2 className="mt-1 text-lg font-bold">{session.quizTitle}</h2>
                <p className="mt-1 text-sm text-[#98A5BC]">
                  {session.questionCount} preguntas · {session.participantCount}{" "}
                  estudiantes ·{" "}
                  {session.phase === "FINISHED"
                    ? "finalizada"
                    : session.phase === "LOBBY"
                      ? "en espera"
                      : "en curso"}
                </p>
              </div>
              <Link
                href={`${AQUAQUIZ_ROOT}/sesiones/${session.id}`}
                className="text-sm font-bold text-[#8EF5FF] hover:underline"
              >
                Abrir partida
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {session.leaderboard.length ? (
                session.leaderboard.map((row) => (
                  <div
                    key={`${row.place}-${row.nickname}`}
                    className="flex items-center gap-3 rounded-lg bg-[#0A0D15] px-3 py-2"
                  >
                    <span className="w-6 text-center text-xs font-black text-[#FFD76E]">
                      {row.place}
                    </span>
                    <span className="flex-1 font-semibold text-white">
                      {row.nickname}
                    </span>
                    <span className="text-sm font-bold text-[#8EF5FF]">
                      {row.score.toLocaleString("es-CO")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#8D9BB2]">
                  Esta partida todavía no tiene participantes.
                </p>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </AquaQuizFrame>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Panel className="p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#8593AA]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tabular-nums text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-[#91A0B7]">{detail}</p>
    </Panel>
  );
}
