"use client";

import Link from "next/link";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  ArrowRight,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  FileSpreadsheet,
  Play,
  Plus,
  Users,
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

type Course = {
  id: string;
  title: string;
  groupName: string;
  _count: { enrollments: number; meetings: number; quizzes: number };
};
type Meeting = {
  id: string;
  classDate: string;
  classStartTime: string | null;
  lateAfterMinutes: number | null;
  attendanceLockedAt: string | null;
  _count: { attendances: number; sessions: number };
  sessions: {
    id: string;
    joinCode: string;
    status: string;
    createdAt: string;
    quizSet: { title: string };
    _count: { participants: number };
  }[];
};
type Quiz = { id: string; title: string; _count: { questions: number } };
type QuestionDraft = {
  kind: "SINGLE_CHOICE" | "TRUE_FALSE";
  topic: string;
  difficulty: "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED";
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  seconds: number;
};

function messageOf(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Ocurrió un error. Vuelve a intentarlo.";
}
function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
  }).format(new Date());
}
function dateLabel(value: string) {
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

export function AquaQuizDashboard() {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await aquaFetch<{ courses: Course[] }>("courses");
      setCourses(result.courses);
      setError("");
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  async function createCourse(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await aquaFetch<{ course: { id: string } }>("courses", {
        method: "POST",
        body: JSON.stringify({ title, groupName: group || "General" }),
      });
      window.location.assign(`${AQUAQUIZ_ROOT}/cursos/${result.course.id}`);
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AquaQuizFrame
      title="Clases que se sienten como un juego"
      subtitle="Crea un curso, prepara preguntas y pasa asistencia mientras el grupo participa en vivo."
      action={
        <Link
          href={`${AQUAQUIZ_ROOT}/entrar`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#00EFFF]/30 bg-[#00EFFF]/10 px-4 py-2.5 text-sm font-bold text-[#B8FAFF] hover:bg-[#00EFFF]/15"
        >
          Tengo un PIN <ArrowRight size={16} />
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-6">
          {error && (
            <Notice tone="error">
              {error}
              {(error.includes("Inicia sesión") ||
                error.includes("iniciar sesión")) && (
                <button
                  className="ml-2 underline underline-offset-4"
                  onClick={() => setAuthOpen(true)}
                >
                  Iniciar sesión
                </button>
              )}
            </Notice>
          )}
          <Panel>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
                  Espacio docente
                </p>
                <h2 className="mt-1 text-xl font-bold">Mis cursos</h2>
              </div>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-[#AAB5CA]">
                {courses.length} {courses.length === 1 ? "curso" : "cursos"}
              </span>
            </div>
            {loading ? (
              <div className="animate-pulse rounded-xl bg-white/[0.04] p-8 text-sm text-[#9DAAC1]">
                Cargando tus cursos…
              </div>
            ) : courses.length === 0 ? (
              <EmptyState title="Tu primer curso empieza aquí">
                Crea un espacio para agrupar la lista de códigos, las clases y
                los cuestionarios.
              </EmptyState>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`${AQUAQUIZ_ROOT}/cursos/${course.id}`}
                    className="group rounded-xl border border-white/[0.09] bg-[#0B0E17] p-4 transition hover:border-[#00C9DF]/55 hover:bg-[#101925] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00EFFF]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-[#9BF5FF]">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#97A4BA]">
                          Grupo · {course.groupName}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 text-[#00C9DF]" size={18} />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#AAB5CA]">
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} /> {course._count.enrollments} códigos
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={14} /> {course._count.meetings}{" "}
                        clases
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CircleHelp size={14} /> {course._count.quizzes} quizzes
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
              Nuevo espacio
            </p>
            <h2 className="mb-5 text-xl font-bold">Organiza una asignatura</h2>
            <form className="space-y-4" onSubmit={createCourse}>
              <Field
                label="Nombre del curso"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej. Acueductos y Aducción"
                minLength={3}
                maxLength={120}
                required
              />
              <Field
                label="Grupo"
                value={group}
                onChange={(event) => setGroup(event.target.value)}
                placeholder="Ej. Ingeniería Ambiental · 02"
                maxLength={80}
              />
              <ActionButton
                type="submit"
                disabled={saving}
                aria-busy={saving}
                className="w-full"
              >
                <Plus size={17} /> Crear curso
              </ActionButton>
            </form>
            {!session?.user && (
              <div className="mt-4 border-t border-white/[0.08] pt-4">
                <p className="text-xs leading-5 text-[#99A6BD]">
                  Para administrar clases, inicia sesión con una cuenta docente
                  de Aquatech.
                </p>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="mt-3 text-sm font-bold text-[#8EF5FF] underline underline-offset-4"
                >
                  Iniciar sesión
                </button>
              </div>
            )}
          </Panel>
          <Panel className="bg-[linear-gradient(135deg,rgba(0,149,255,0.11),rgba(0,239,255,0.04)_60%,rgba(16,19,30,0.95))]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C9DF]/10 text-[#66EAF5]">
              <ClipboardList size={20} />
            </div>
            <h2 className="font-bold">Asistencia útil para la clase</h2>
            <p className="mt-2 text-sm leading-6 text-[#AAB5CA]">
              Al entrar, cada estudiante usa un código y un apodo. Puede elegir
              su cuenta Aquatech o participar como invitado; no pedimos nombre
              completo.
            </p>
          </Panel>
        </div>
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        theme="dark"
      />
    </AquaQuizFrame>
  );
}

function defaultQuestion(): QuestionDraft {
  return {
    kind: "SINGLE_CHOICE",
    topic: "",
    difficulty: "INTERMEDIATE",
    prompt: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    explanation: "",
    seconds: 30,
  };
}
function cleanOptions(question: QuestionDraft) {
  return question.kind === "TRUE_FALSE"
    ? ["Verdadero", "Falso"]
    : question.options.slice(0, 4);
}
function importRows(rows: Record<string, unknown>[]) {
  const questions: QuestionDraft[] = [];
  const errors: string[] = [];
  rows.forEach((row, index) => {
    const value = (key: string) => String(row[key] ?? "").trim();
    const prompt = value("pregunta") || value("question");
    const opts = ["opcion_a", "opcion_b", "opcion_c", "opcion_d"].map(value);
    const rawCorrect = (
      value("correcta") || value("correct")
    ).toLocaleUpperCase("es-CO");
    const correctIndex = /^[A-D]$/.test(rawCorrect)
      ? rawCorrect.charCodeAt(0) - 65
      : Number(rawCorrect) - 1;
    const kind = /verdadero|falso|true.?false/i.test(value("tipo"))
      ? "TRUE_FALSE"
      : "SINGLE_CHOICE";
    const options =
      kind === "TRUE_FALSE"
        ? [value("opcion_a") || "Verdadero", value("opcion_b") || "Falso"]
        : opts.filter(Boolean);
    if (
      !prompt &&
      Object.values(row).every((cell) => String(cell ?? "").trim() === "")
    )
      return;
    if (
      prompt.length < 4 ||
      options.length < 2 ||
      options.length > 4 ||
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex >= options.length
    ) {
      errors.push(
        `Fila ${index + 2}: revisa pregunta, opciones y respuesta correcta.`,
      );
      return;
    }
    questions.push({
      kind,
      topic: value("tema") || value("topic"),
      difficulty:
        value("dificultad").toLocaleUpperCase("es-CO") === "AVANZADO" ||
        value("dificultad").toLocaleUpperCase("es-CO") === "ADVANCED"
          ? "ADVANCED"
          : value("dificultad").toLocaleUpperCase("es-CO") === "INICIAL" ||
              value("dificultad").toLocaleUpperCase("es-CO") === "INTRODUCTORY"
            ? "INTRODUCTORY"
            : "INTERMEDIATE",
      prompt,
      options,
      correctOptionIndex: correctIndex,
      explanation: value("explicacion") || value("explanation"),
      seconds: Math.min(
        180,
        Math.max(
          10,
          Number(value("tiempo_segundos") || value("seconds") || 30),
        ),
      ),
    });
  });
  return { questions, errors };
}

function QuestionEditor({
  question,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: {
  question: QuestionDraft;
  index: number;
  canRemove: boolean;
  onUpdate: (changes: Partial<QuestionDraft>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.1] bg-[#0B0E17] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold text-white">Pregunta {index + 1}</p>
        <div className="flex items-center gap-2">
          <select
            value={question.kind}
            onChange={(event) =>
              onUpdate({
                kind: event.target.value as QuestionDraft["kind"],
                options:
                  event.target.value === "TRUE_FALSE"
                    ? ["Verdadero", "Falso"]
                    : ["", "", "", ""],
                correctOptionIndex: 0,
              })
            }
            aria-label={`Tipo de pregunta ${index + 1}`}
            className="rounded-lg border border-white/[0.12] bg-[#090C14] px-3 py-2 text-xs text-white"
          >
            <option value="SINGLE_CHOICE">Selección única</option>
            <option value="TRUE_FALSE">Verdadero / falso</option>
          </select>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg px-2 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-400/10"
            >
              Quitar
            </button>
          )}
        </div>
      </div>
      <label className="block space-y-2 text-sm font-semibold text-[#DCE5F5]">
        <span>Enunciado</span>
        <textarea
          value={question.prompt}
          onChange={(event) => onUpdate({ prompt: event.target.value })}
          rows={2}
          maxLength={500}
          minLength={4}
          required
          placeholder="Escribe una pregunta sobre el tema de la clase…"
          className="w-full resize-y rounded-xl border border-white/[0.12] bg-[#090C14] px-4 py-3 text-white outline-none focus:border-[#00C9DF] focus:ring-2 focus:ring-[#00C9DF]/20"
        />
      </label>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cleanOptions(question).map((option, optionIndex) => (
          <label
            key={optionIndex}
            className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 ${question.correctOptionIndex === optionIndex ? "border-emerald-300/50 bg-emerald-300/[0.08]" : "border-white/[0.09] bg-[#090C14]"}`}
          >
            <input
              type="radio"
              name={`correct-${index}`}
              checked={question.correctOptionIndex === optionIndex}
              onChange={() => onUpdate({ correctOptionIndex: optionIndex })}
              aria-label={`Marcar ${String.fromCharCode(65 + optionIndex)} como respuesta correcta`}
              className="accent-emerald-400"
            />
            <span className="w-5 text-xs font-black text-[#7C8AA1]">
              {String.fromCharCode(65 + optionIndex)}
            </span>
            {question.kind === "TRUE_FALSE" ? (
              <span className="flex-1 text-sm text-white">{option}</span>
            ) : (
              <input
                value={option}
                onChange={(event) => {
                  const options = [...question.options];
                  options[optionIndex] = event.target.value;
                  onUpdate({ options });
                }}
                required
                maxLength={140}
                aria-label={`Opción ${String.fromCharCode(65 + optionIndex)} de la pregunta ${index + 1}`}
                placeholder={`Opción ${String.fromCharCode(65 + optionIndex)}`}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#657188]"
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_190px]">
        <Field
          label="Tema (opcional)"
          value={question.topic}
          onChange={(event) => onUpdate({ topic: event.target.value })}
          maxLength={80}
          placeholder="Ej. Sedimentación"
        />
        <SelectField
          label="Dificultad"
          value={question.difficulty}
          onChange={(event) =>
            onUpdate({
              difficulty: event.target.value as QuestionDraft["difficulty"],
            })
          }
        >
          <option value="INTRODUCTORY">Inicial</option>
          <option value="INTERMEDIATE">Intermedia</option>
          <option value="ADVANCED">Avanzada</option>
        </SelectField>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px]">
        <label className="block space-y-2 text-sm font-semibold text-[#DCE5F5]">
          <span>Explicación al revelar</span>
          <input
            value={question.explanation}
            onChange={(event) => onUpdate({ explanation: event.target.value })}
            maxLength={1000}
            placeholder="Opcional"
            className="w-full rounded-xl border border-white/[0.12] bg-[#090C14] px-4 py-3 text-sm text-white outline-none focus:border-[#00C9DF]"
          />
        </label>
        <Field
          label="Tiempo (seg.)"
          type="number"
          min="10"
          max="180"
          value={question.seconds}
          onChange={(event) =>
            onUpdate({ seconds: Number(event.target.value) })
          }
          required
        />
      </div>
    </div>
  );
}

export function AquaQuizCourse({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [rosterText, setRosterText] = useState("");
  const [meetingDate, setMeetingDate] = useState(today());
  const [meetingTime, setMeetingTime] = useState("");
  const [lateAfter, setLateAfter] = useState("15");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    defaultQuestion(),
  ]);
  const [meetingForSession, setMeetingForSession] = useState("");
  const [quizForSession, setQuizForSession] = useState("");
  const [speedBonus, setSpeedBonus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importFeedback, setImportFeedback] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [courseResult, meetingResult, quizResult] = await Promise.all([
        aquaFetch<{ courses: Course[] }>("courses"),
        aquaFetch<{ meetings: Meeting[] }>(`courses/${courseId}/meetings`),
        aquaFetch<{ quizzes: Quiz[] }>(`courses/${courseId}/quizzes`),
      ]);
      setCourse(
        courseResult.courses.find((entry) => entry.id === courseId) ?? null,
      );
      setMeetings(meetingResult.meetings);
      setQuizzes(quizResult.quizzes);
      setMeetingForSession(
        (current) => current || meetingResult.meetings[0]?.id || "",
      );
      setQuizForSession(
        (current) => current || quizResult.quizzes[0]?.id || "",
      );
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setLoading(false);
    }
  }, [courseId]);
  useEffect(() => {
    void load();
  }, [load]);

  const questionCount = useMemo(
    () => questions.filter((question) => question.prompt.trim()).length,
    [questions],
  );
  function updateQuestion(index: number, changes: Partial<QuestionDraft>) {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...changes } : question,
      ),
    );
  }
  async function addRoster(event: FormEvent) {
    event.preventDefault();
    setSaving("roster");
    setError("");
    setSuccess("");
    const codes = [
      ...new Set(
        rosterText
          .split(/[\n,;\t ]+/)
          .map((code) => code.trim())
          .filter(Boolean),
      ),
    ];
    try {
      const result = await aquaFetch<{ added: number; total: number }>(
        `courses/${courseId}/enrollments`,
        { method: "POST", body: JSON.stringify({ codes }) },
      );
      setSuccess(
        `Lista guardada: ${result.added} códigos nuevos; ${codes.length - result.added} ya estaban registrados.`,
      );
      setRosterText("");
      await load();
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setSaving("");
    }
  }
  async function addMeeting(event: FormEvent) {
    event.preventDefault();
    setSaving("meeting");
    setError("");
    setSuccess("");
    try {
      const result = await aquaFetch<{ meeting: { id: string } }>(
        `courses/${courseId}/meetings`,
        {
          method: "POST",
          body: JSON.stringify({
            classDate: meetingDate,
            classStartTime: meetingTime || null,
            lateAfterMinutes: lateAfter === "" ? null : Number(lateAfter),
          }),
        },
      );
      setSuccess(
        "Clase creada. Ya puedes abrir un quiz o revisar su asistencia.",
      );
      await load();
      setMeetingForSession(result.meeting.id);
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setSaving("");
    }
  }
  async function addQuiz(event: FormEvent) {
    event.preventDefault();
    setSaving("quiz");
    setError("");
    setSuccess("");
    const payload = questions
      .filter((question) => question.prompt.trim())
      .map((question) => ({ ...question, options: cleanOptions(question) }));
    try {
      const result = await aquaFetch<{ quiz: { id: string; title: string } }>(
        `courses/${courseId}/quizzes`,
        {
          method: "POST",
          body: JSON.stringify({ title: quizTitle, questions: payload }),
        },
      );
      setSuccess(
        `“${result.quiz.title}” quedó listo con ${payload.length} preguntas.`,
      );
      setQuizTitle("");
      setQuestions([defaultQuestion()]);
      await load();
      setQuizForSession(result.quiz.id);
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setSaving("");
    }
  }
  async function startSession(event: FormEvent) {
    event.preventDefault();
    setSaving("session");
    setError("");
    try {
      const result = await aquaFetch<{ session: { id: string } }>("sessions", {
        method: "POST",
        body: JSON.stringify({
          meetingId: meetingForSession,
          quizSetId: quizForSession,
          speedBonus,
        }),
      });
      router.push(`${AQUAQUIZ_ROOT}/sesiones/${result.session.id}`);
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setSaving("");
    }
  }
  async function handleFile(file?: File) {
    if (!file) return;
    setImportFeedback("");
    setError("");
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo debe pesar máximo 5 MB.");
      return;
    }
    try {
      let rows: Record<string, unknown>[];
      if (/\.csv$/i.test(file.name)) {
        const Papa = await import("papaparse");
        const text = await file.text();
        const parsed = Papa.default.parse<Record<string, unknown>>(text, {
          header: true,
          skipEmptyLines: "greedy",
          transformHeader: (header) => header.trim().toLocaleLowerCase("es-CO"),
        });
        rows = parsed.data;
        if (parsed.errors.length)
          setImportFeedback(
            `${parsed.errors.length} aviso(s) al leer el CSV; revisa la vista previa.`,
          );
      } else {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
        rows = XLSX.utils
          .sheet_to_json<Record<string, unknown>>(
            workbook.Sheets[workbook.SheetNames[0]],
            { defval: "", raw: false },
          )
          .map((row) =>
            Object.fromEntries(
              Object.entries(row).map(([key, value]) => [
                key.trim().toLocaleLowerCase("es-CO"),
                value,
              ]),
            ),
          );
      }
      const parsed = importRows(rows);
      if (!parsed.questions.length)
        throw new Error(
          parsed.errors[0] || "No encontramos preguntas en el archivo.",
        );
      if (parsed.questions.length > 100)
        throw new Error("El cuestionario admite hasta 100 preguntas.");
      setQuestions(parsed.questions);
      setImportFeedback(
        `${parsed.questions.length} pregunta(s) listas para revisar.${parsed.errors.length ? ` ${parsed.errors.length} fila(s) se omitieron: ${parsed.errors.slice(0, 3).join(" ")}` : ""}`,
      );
    } catch (caught) {
      setError(messageOf(caught));
    }
  }

  return (
    <AquaQuizFrame
      title={course?.title ?? "Configura tu curso"}
      subtitle={
        course
          ? `Grupo ${course.groupName} · administra tu lista, prepara preguntas y abre una partida.`
          : undefined
      }
    >
      {error && (
        <div className="mb-5">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {success && (
        <div className="mb-5">
          <Notice tone="success">{success}</Notice>
        </div>
      )}
      {loading ? (
        <Panel>
          <p className="animate-pulse text-sm text-[#9DAAC1]">
            Cargando curso…
          </p>
        </Panel>
      ) : !course ? (
        <Panel>
          <Notice tone="error">
            No encontramos este curso o no tienes acceso para editarlo.
          </Notice>
        </Panel>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Panel>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0095FF]/15 text-[#75BDFF]">
                  <CalendarDays size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
                    Calendario de clase
                  </p>
                  <h2 className="text-xl font-bold">Encuentros</h2>
                </div>
              </div>
              <form
                onSubmit={addMeeting}
                className="grid gap-3 sm:grid-cols-[1fr_1fr_0.7fr_auto] sm:items-end"
              >
                <Field
                  label="Fecha"
                  type="date"
                  value={meetingDate}
                  onChange={(event) => setMeetingDate(event.target.value)}
                  required
                />
                <Field
                  label="Hora de inicio"
                  type="time"
                  value={meetingTime}
                  onChange={(event) => setMeetingTime(event.target.value)}
                  hint="Hora de Bogotá. Opcional."
                />
                <Field
                  label="Minutos de gracia"
                  type="number"
                  min="0"
                  max="240"
                  value={lateAfter}
                  onChange={(event) => setLateAfter(event.target.value)}
                />
                <ActionButton
                  type="submit"
                  disabled={saving === "meeting"}
                  aria-busy={saving === "meeting"}
                >
                  <Plus size={16} /> Crear clase
                </ActionButton>
              </form>
              <div className="mt-5 space-y-2">
                {meetings.length === 0 ? (
                  <EmptyState title="Aún no tienes clases">
                    Crea un encuentro para que AquaQuiz registre la asistencia
                    de ese día.
                  </EmptyState>
                ) : (
                  meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0A0D15] p-4"
                    >
                      <div>
                        <p className="font-semibold capitalize text-white">
                          {dateLabel(meeting.classDate)}
                        </p>
                        <p className="mt-1 text-xs text-[#94A1B8]">
                          {meeting.classStartTime
                            ? `${meeting.classStartTime} · `
                            : ""}
                          {meeting._count.attendances} asistencias ·{" "}
                          {meeting._count.sessions} partidas ·{" "}
                          {meeting.attendanceLockedAt
                            ? "lista cerrada"
                            : "ingreso abierto"}
                        </p>
                      </div>
                      <Link
                        href={`${AQUAQUIZ_ROOT}/clases/${meeting.id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#8EF5FF] hover:underline"
                      >
                        Ver reporte <ArrowRight size={15} />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200">
                  <CircleHelp size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
                    Banco de preguntas
                  </p>
                  <h2 className="text-xl font-bold">Prepara un quiz</h2>
                </div>
              </div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0A0D15] p-3">
                <p className="text-sm text-[#B6C2D7]">
                  Escribe preguntas o carga una hoja para ahorrar tiempo.
                </p>
                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/[0.12] px-3 text-sm font-bold text-[#DCE5F5] hover:border-[#00C9DF]/50">
                  <FileSpreadsheet size={16} className="text-[#7EEBF4]" />{" "}
                  Importar CSV/XLSX
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="sr-only"
                    onChange={(event) =>
                      void handleFile(event.target.files?.[0])
                    }
                  />
                </label>
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#91A0B7]">
                <a
                  href="/aquaquiz-plantilla.csv"
                  download
                  className="font-bold text-[#8EF5FF] underline underline-offset-4"
                >
                  Descargar plantilla CSV
                </a>
                <span>Máximo 5 MB · hasta 100 preguntas</span>
              </div>
              {importFeedback && (
                <p className="mb-4 text-sm text-[#A8F2D1]">{importFeedback}</p>
              )}
              <form className="space-y-5" onSubmit={addQuiz}>
                <Field
                  label="Nombre del cuestionario"
                  value={quizTitle}
                  onChange={(event) => setQuizTitle(event.target.value)}
                  placeholder="Ej. Repaso de desarenadores"
                  minLength={3}
                  maxLength={160}
                  required
                />

                {questions.map((question, index) => (
                  <QuestionEditor
                    key={index}
                    question={question}
                    index={index}
                    canRemove={questions.length > 1}
                    onUpdate={(changes) => updateQuestion(index, changes)}
                    onRemove={() =>
                      setQuestions((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  />
                ))}
                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    type="button"
                    variant="secondary"
                    disabled={questions.length >= 100}
                    onClick={() =>
                      setQuestions((current) => [...current, defaultQuestion()])
                    }
                  >
                    <Plus size={16} /> Añadir pregunta
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    disabled={saving === "quiz" || questionCount === 0}
                    aria-busy={saving === "quiz"}
                  >
                    <CircleHelp size={16} /> Guardar quiz
                  </ActionButton>
                </div>
              </form>
            </Panel>
          </div>
          <div className="space-y-6">
            <Panel className="sticky top-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00EFFF]/10 text-[#7EEBF4]">
                  <Play size={19} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
                    Partida en vivo
                  </p>
                  <h2 className="text-xl font-bold">Abrir sala</h2>
                </div>
              </div>
              {meetings.length === 0 || quizzes.length === 0 ? (
                <EmptyState title="Te falta un paso">
                  Crea al menos una clase y guarda un cuestionario para abrir tu
                  primera sala.
                </EmptyState>
              ) : (
                <form onSubmit={startSession} className="space-y-4">
                  <SelectField
                    label="Encuentro"
                    value={meetingForSession}
                    onChange={(event) =>
                      setMeetingForSession(event.target.value)
                    }
                    required
                  >
                    {meetings.map((meeting) => (
                      <option key={meeting.id} value={meeting.id}>
                        {dateLabel(meeting.classDate)}
                        {meeting.classStartTime
                          ? ` · ${meeting.classStartTime}`
                          : ""}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField
                    label="Cuestionario"
                    value={quizForSession}
                    onChange={(event) => setQuizForSession(event.target.value)}
                    required
                  >
                    {quizzes.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.title} · {quiz._count.questions} preguntas
                      </option>
                    ))}
                  </SelectField>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.09] bg-[#0A0D15] p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={speedBonus}
                      onChange={(event) => setSpeedBonus(event.target.checked)}
                      className="mt-1 accent-[#00DDEB]"
                    />
                    <span>
                      <span className="block font-semibold text-white">
                        Premiar rapidez
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#8F9CB2]">
                        Hasta 200 puntos extra por respuesta correcta más
                        rápida.
                      </span>
                    </span>
                  </label>
                  <ActionButton
                    type="submit"
                    disabled={saving === "session"}
                    aria-busy={saving === "session"}
                    className="w-full"
                  >
                    <Play size={16} /> Crear sala y PIN
                  </ActionButton>
                </form>
              )}
            </Panel>
            <Panel>
              <h2 className="mb-4 font-bold">Cuestionarios guardados</h2>
              {quizzes.length === 0 ? (
                <p className="text-sm leading-6 text-[#97A4BA]">
                  Guarda tu primer cuestionario arriba. La solución solo se
                  revela al cerrar cada pregunta.
                </p>
              ) : (
                <div className="space-y-2">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] px-3 py-3"
                    >
                      <span className="truncate text-sm font-semibold text-white">
                        {quiz.title}
                      </span>
                      <span className="whitespace-nowrap text-xs text-[#95A2B8]">
                        {quiz._count.questions} preguntas
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
            <Panel>
              <div className="mb-2 flex items-center gap-2">
                <Users size={18} className="text-[#73DCE8]" />
                <h2 className="font-bold">Lista de códigos</h2>
              </div>
              <p className="mb-4 text-sm leading-6 text-[#9BA8BF]">
                Pega uno por línea desde tu archivo de clase. Se conserva como
                texto, incluidos los ceros iniciales.
              </p>
              <form onSubmit={addRoster} className="space-y-3">
                <textarea
                  value={rosterText}
                  onChange={(event) => setRosterText(event.target.value)}
                  rows={5}
                  placeholder={"00123456\n00123457\n00123458"}
                  className="w-full rounded-xl border border-white/[0.12] bg-[#090C14] px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#00C9DF]"
                />
                <ActionButton
                  type="submit"
                  variant="secondary"
                  disabled={saving === "roster" || !rosterText.trim()}
                  aria-busy={saving === "roster"}
                  className="w-full"
                >
                  <Users size={16} /> Guardar códigos
                </ActionButton>
              </form>
            </Panel>
          </div>
        </div>
      )}
    </AquaQuizFrame>
  );
}
