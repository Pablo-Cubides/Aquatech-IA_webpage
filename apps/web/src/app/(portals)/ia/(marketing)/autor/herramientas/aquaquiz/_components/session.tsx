"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  ArrowRight,
  Check,
  Copy,
  Eye,
  ExternalLink,
  Flag,
  KeyRound,
  Play,
  Trophy,
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
} from "./ui";

type SessionState = {
  sessionId: string;
  pin: string;
  phase: "LOBBY" | "QUESTION" | "REVEAL" | "FINISHED";
  stateVersion: number;
  serverNow: string;
  questionIndex: number;
  questionCount: number;
  question: null | {
    prompt: string;
    options: string[];
    seconds: number;
    correctOptionIndex?: number;
    explanation?: string;
  };
  opensAt: string | null;
  closesAt: string | null;
  hasAnswered: boolean;
  myCorrect: boolean | null;
  myOptionIndex: number | null;
  myScore: number | null;
  myPlace: number | null;
  participantCount: number;
  answerCount: number;
  leaderboard: { place: number; nickname: string; score: number }[];
};

function errorText(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo conectar con la sala.";
}

export function Countdown({
  closesAt,
  serverNow,
}: {
  closesAt: string | null;
  serverNow?: string;
}) {
  const [seconds, setSeconds] = useState<number | null>(null);
  useEffect(() => {
    if (!closesAt) {
      setSeconds(null);
      return;
    }
    const offset = serverNow ? Date.now() - Date.parse(serverNow) : 0;
    const tick = () =>
      setSeconds(
        Math.max(
          0,
          Math.ceil((Date.parse(closesAt) - (Date.now() - offset)) / 1000),
        ),
      );
    tick();
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [closesAt, serverNow]);
  if (seconds === null) return <span className="text-[#8C9BB7]">Listo</span>;
  return (
    <span
      aria-live="off"
      className={`tabular-nums ${seconds <= 5 ? "text-rose-200" : "text-white"}`}
    >
      {seconds}s
    </span>
  );
}

function AnswerBlocks({
  options,
  selected,
  disabled,
  onSelect,
}: {
  options: string[];
  selected?: number;
  disabled?: boolean;
  onSelect?: (index: number) => void;
}) {
  const colors = [
    "border-[#FF7282]/45 bg-[#FF526D]/[0.14] hover:bg-[#FF526D]/25",
    "border-[#39A9FF]/45 bg-[#078BFA]/[0.16] hover:bg-[#078BFA]/25",
    "border-[#F4C542]/45 bg-[#F4C542]/[0.13] hover:bg-[#F4C542]/25",
    "border-[#35D6A2]/45 bg-[#10B981]/[0.14] hover:bg-[#10B981]/25",
  ];
  const shapes = ["▲", "◆", "●", "■"];
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      {options.map((option, index) => (
        <button
          key={`${index}-${option}`}
          type="button"
          disabled={disabled || !onSelect}
          onClick={() => onSelect?.(index)}
          className={`group flex min-h-24 items-center gap-4 rounded-2xl border px-4 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00EFFF] disabled:cursor-default disabled:opacity-80 sm:min-h-32 sm:px-6 ${colors[index]} ${selected === index ? "ring-2 ring-white" : ""}`}
        >
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/20 text-2xl font-black text-white sm:h-14 sm:w-14"
          >
            {shapes[index]}
          </span>
          <span className="min-w-0 flex-1 text-lg font-extrabold leading-snug text-white sm:text-xl">
            {option}
          </span>
          {selected === index && (
            <Check
              size={20}
              className="shrink-0 text-white"
              aria-label="Tu respuesta"
            />
          )}
        </button>
      ))}
    </div>
  );
}

function Leaderboard({
  rows,
  currentPlace,
}: {
  rows: SessionState["leaderboard"];
  currentPlace?: number | null;
}) {
  if (!rows.length)
    return (
      <EmptyState title="Todavía no hay puntajes">
        La clasificación aparece cuando el grupo empieza a responder.
      </EmptyState>
    );
  return (
    <ol className="space-y-2">
      {rows.map((row, index) => (
        <li
          key={`${row.place}-${row.nickname}-${index}`}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${row.place === currentPlace ? "border-[#00C9DF]/45 bg-[#00C9DF]/[0.07]" : "border-white/[0.07] bg-[#0A0D15]"}`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black ${index < 3 ? "bg-[#F4C542]/15 text-[#FFD76E]" : "bg-white/[0.05] text-[#9EAAC0]"}`}
          >
            {row.place}
          </span>
          <span className="min-w-0 flex-1 truncate font-bold text-white">
            {row.nickname}
          </span>
          <span className="text-sm font-extrabold tabular-nums text-[#8EF5FF]">
            {row.score.toLocaleString("es-CO")}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function AquaQuizJoin() {
  const router = useRouter();
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<"account" | "guest">("guest");
  const [pin, setPin] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPin((params.get("pin") || "").replace(/\D/g, "").slice(0, 6));
    try {
      const draft = sessionStorage.getItem("aquaquiz:join-draft");
      if (draft && session?.user) {
        const saved = JSON.parse(draft) as {
          pin?: string;
          studentCode?: string;
          nickname?: string;
        };
        if (saved.pin) setPin(saved.pin);
        if (saved.studentCode) setStudentCode(saved.studentCode);
        if (saved.nickname) setNickname(saved.nickname);
        sessionStorage.removeItem("aquaquiz:join-draft");
        setMode("account");
      }
    } catch {
      /* Ignore invalid local draft. */
    }
  }, [session?.user]);
  async function join(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (mode === "account" && !session?.user) {
      sessionStorage.setItem(
        "aquaquiz:join-draft",
        JSON.stringify({ pin, studentCode, nickname }),
      );
      setAuthOpen(true);
      return;
    }
    setSaving(true);
    try {
      const result = await aquaFetch<{
        sessionId: string;
        participant: { nickname: string };
      }>("sessions/join", {
        method: "POST",
        body: JSON.stringify({ pin, studentCode, nickname, mode }),
      });
      router.push(`${AQUAQUIZ_ROOT}/sesiones/${result.sessionId}/jugar`);
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setSaving(false);
    }
  }
  return (
    <AquaQuizFrame
      title="Entra a tu clase"
      subtitle="Escribe el PIN que proyecta el docente, tu código estudiantil y el apodo que aparecerá en el juego."
      backLabel="Inicio de Aquatech"
    >
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[0.8fr_1fr]">
        <Panel className="flex flex-col justify-between bg-[linear-gradient(145deg,rgba(0,149,255,0.13),rgba(0,239,255,0.04)_58%,rgba(16,19,30,0.95))]">
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00C9DF]/10 text-[#76F3FF]">
              <KeyRound size={26} />
            </div>
            <h2 className="text-2xl font-black">¿Listo para jugar?</h2>
            <p className="mt-3 text-sm leading-6 text-[#AAB5CA]">
              Tu asistencia queda asociada al código de este curso. El apodo es
              lo único que se muestra a tus compañeros.
            </p>
          </div>
          <ul className="mt-8 space-y-3 text-sm text-[#D4DEEF]">
            <li className="flex gap-2">
              <Check size={17} className="shrink-0 text-emerald-300" /> No
              solicitamos tu nombre completo.
            </li>
            <li className="flex gap-2">
              <Check size={17} className="shrink-0 text-emerald-300" /> Puedes
              entrar con tu cuenta o como invitado.
            </li>
            <li className="flex gap-2">
              <Check size={17} className="shrink-0 text-emerald-300" /> Una
              respuesta guardada no se duplica.
            </li>
          </ul>
        </Panel>
        <Panel>
          <div className="mb-5 flex gap-2 rounded-xl border border-white/[0.08] bg-[#090C14] p-1.5">
            <button
              type="button"
              aria-pressed={mode === "account"}
              onClick={() => setMode("account")}
              className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-bold transition ${mode === "account" ? "bg-[#00C9DF]/15 text-[#A2F7FF]" : "text-[#9DAAC1] hover:text-white"}`}
            >
              Tengo cuenta
            </button>
            <button
              type="button"
              aria-pressed={mode === "guest"}
              onClick={() => setMode("guest")}
              className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-bold transition ${mode === "guest" ? "bg-[#00C9DF]/15 text-[#A2F7FF]" : "text-[#9DAAC1] hover:text-white"}`}
            >
              Entrar como invitado
            </button>
          </div>
          {mode === "account" && !session?.user && (
            <div className="mb-4">
              <Notice>
                Al continuar podrás iniciar sesión con tu cuenta Aquatech.
                Mantendremos tu PIN y código en este dispositivo.
              </Notice>
            </div>
          )}
          {error && (
            <div className="mb-4">
              <Notice tone="error">{error}</Notice>
            </div>
          )}
          <form onSubmit={join} className="space-y-4">
            <Field
              label="PIN de la clase"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={pin}
              onChange={(event) =>
                setPin(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123 456"
              minLength={6}
              maxLength={6}
              required
            />
            <Field
              label="Código estudiantil"
              value={studentCode}
              onChange={(event) =>
                setStudentCode(event.target.value.toLocaleUpperCase("es-CO"))
              }
              placeholder="Tu código, incluidos ceros iniciales"
              minLength={2}
              maxLength={32}
              required
            />
            <Field
              label="Apodo para el juego"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="¿Cómo quieres aparecer?"
              minLength={2}
              maxLength={24}
              required
            />
            <ActionButton
              type="submit"
              disabled={saving}
              aria-busy={saving}
              className="mt-2 w-full"
            >
              {mode === "account" && !session?.user
                ? "Iniciar sesión y entrar"
                : "Entrar a la sala"}
              <ArrowRight size={17} />
            </ActionButton>
          </form>
        </Panel>
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        theme="dark"
        allowRegistration={false}
      />
    </AquaQuizFrame>
  );
}

export function AquaQuizHost({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [projectionHref, setProjectionHref] = useState("");
  const load = useCallback(async () => {
    try {
      const result = await aquaFetch<{ state: SessionState }>(
        `sessions/${sessionId}`,
      );
      setState(result.state);
      setError("");
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setLoading(false);
    }
  }, [sessionId]);
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 1600);
    return () => window.clearInterval(timer);
  }, [load]);
  useEffect(() => {
    let active = true;
    aquaFetch<{ token: string }>(`sessions/${sessionId}/projection`, {
      method: "POST",
    })
      .then(({ token }) => {
        if (active)
          setProjectionHref(
            `${window.location.origin}${AQUAQUIZ_ROOT}/sesiones/${sessionId}/pantalla#${token}`,
          );
      })
      .catch(() => {
        if (active) setProjectionHref("");
      });
    return () => {
      active = false;
    };
  }, [sessionId]);
  async function act(action: "start" | "reveal" | "next" | "finish") {
    if (!state) return;
    setWorking(true);
    setError("");
    try {
      await aquaFetch(`sessions/${sessionId}/actions`, {
        method: "POST",
        body: JSON.stringify({ action, expectedVersion: state.stateVersion }),
      });
      await load();
    } catch (caught) {
      setError(errorText(caught));
      await load();
    } finally {
      setWorking(false);
    }
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      setError("No se pudo copiar. Selecciona el texto y cópialo manualmente.");
    }
  }
  if (loading && !state)
    return (
      <AquaQuizFrame title="Abriendo tu sala">
        <Panel>
          <p className="animate-pulse text-sm text-[#9DAAC1]">
            Conectando con AquaQuiz…
          </p>
        </Panel>
      </AquaQuizFrame>
    );
  if (error && !state)
    return (
      <AquaQuizFrame title="No se pudo abrir la sala">
        <Notice tone="error">{error}</Notice>
      </AquaQuizFrame>
    );
  if (!state) return null;
  const labels: Record<SessionState["phase"], string> = {
    LOBBY: "Sala abierta",
    QUESTION: "Pregunta en curso",
    REVEAL: "Respuesta revelada",
    FINISHED: "Partida finalizada",
  };
  const joinUrl =
    typeof window === "undefined"
      ? `${AQUAQUIZ_ROOT}/entrar?pin=${state.pin}`
      : `${window.location.origin}${AQUAQUIZ_ROOT}/entrar?pin=${state.pin}`;
  return (
    <AquaQuizFrame
      wide
      title="Control del docente"
      subtitle={labels[state.phase]}
      action={
        projectionHref ? (
          <a
            target="_blank"
            rel="noreferrer"
            href={projectionHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.13] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white hover:bg-white/[0.08]"
          >
            <ExternalLink size={16} /> Abrir proyección
          </a>
        ) : (
          <span className="text-xs text-[#91A0B7]">Preparando proyección…</span>
        )
      }
    >
      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.4fr_0.8fr]">
        <div className="space-y-5">
          <Panel className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8B99B1]">
              PIN de ingreso
            </p>
            <p className="my-3 font-mono text-5xl font-black tracking-[0.12em] text-[#A7FBFF] sm:text-6xl">
              {state.pin}
            </p>
            <p className="text-sm text-[#9EABC1]">
              Comparte el PIN o el enlace con tu clase.
            </p>
            <button
              type="button"
              onClick={() => void copy(joinUrl)}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.12] px-3 text-sm font-bold text-white hover:border-[#00C9DF]/50"
            >
              <Copy size={15} /> Copiar enlace
            </button>
          </Panel>
          <Panel>
            <div className="mb-3 flex items-center gap-2">
              <Users size={18} className="text-[#62EAF5]" />
              <h2 className="font-bold">Participación</h2>
            </div>
            <p className="text-4xl font-black tabular-nums text-white">
              {state.participantCount}
            </p>
            <p className="mt-1 text-sm text-[#9DAAC1]">
              {state.phase === "LOBBY"
                ? "estudiantes ingresados"
                : `${state.answerCount} respuestas recibidas`}
            </p>
            <progress
              aria-label="Progreso de respuestas"
              value={
                state.phase === "QUESTION" && state.participantCount
                  ? Math.min(
                      100,
                      (state.answerCount / state.participantCount) * 100,
                    )
                  : 0
              }
              max={100}
              className="mt-5 h-2 w-full overflow-hidden rounded-full accent-[#00C9DF]"
            />
          </Panel>
          <Panel>
            <h2 className="mb-3 font-bold">En esta pantalla</h2>
            <p className="text-sm leading-6 text-[#9DAAC1]">
              La vista de proyección muestra pregunta, PIN y apodos del
              marcador. Los códigos estudiantiles quedan en el reporte privado
              del docente.
            </p>
            <Link
              href={`${AQUAQUIZ_ROOT}/entrar?pin=${state.pin}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#8EF5FF] hover:underline"
            >
              Abrir entrada de estudiantes <ArrowRight size={15} />
            </Link>
          </Panel>
        </div>
        <Panel className="min-h-[430px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00C9DF]">
                {state.question
                  ? `Pregunta ${state.questionIndex + 1} de ${state.questionCount}`
                  : "Preparación"}
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {state.question ? "Vista del juego" : "Sala de espera"}
              </h2>
            </div>
            <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-sm font-bold text-[#C4D2E7]">
              <Countdown
                closesAt={state.closesAt}
                serverNow={state.serverNow}
              />
            </span>
          </div>
          {state.question ? (
            <>
              <p className="mb-5 text-2xl font-black leading-snug text-white sm:text-3xl">
                {state.question.prompt}
              </p>
              <AnswerBlocks options={state.question.options} disabled />
              {state.phase === "REVEAL" && (
                <Notice tone="success">
                  Correcta:{" "}
                  {state.question.options[
                    state.question.correctOptionIndex ?? -1
                  ] ?? "—"}
                  {state.question.explanation
                    ? ` · ${state.question.explanation}`
                    : ""}
                </Notice>
              )}
            </>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#00C9DF]/10 text-[#70EBF5]">
                <Users size={37} />
              </div>
              <h3 className="text-2xl font-black">Esperando al grupo</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#99A6BD]">
                Comparte el PIN. Cuando veas al grupo listo, inicia la primera
                pregunta.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="rounded-lg bg-white/[0.05] px-3 py-2 text-sm text-[#CDD8EA]">
                  {state.participantCount} participantes en la sala
                </span>
                <span className="rounded-lg bg-white/[0.05] px-3 py-2 text-sm text-[#CDD8EA]">
                  {state.questionCount} preguntas
                </span>
              </div>
            </div>
          )}
          <div className="mt-7 flex flex-wrap gap-3 border-t border-white/[0.08] pt-5">
            {state.phase === "LOBBY" && (
              <ActionButton
                disabled={working || state.participantCount === 0}
                aria-busy={working}
                onClick={() => void act("start")}
              >
                <Play size={16} /> Iniciar quiz
              </ActionButton>
            )}
            {state.phase === "QUESTION" && (
              <ActionButton
                disabled={working}
                aria-busy={working}
                onClick={() => void act("reveal")}
              >
                <Eye size={16} /> Revelar respuesta
              </ActionButton>
            )}
            {state.phase === "REVEAL" && (
              <ActionButton
                disabled={working}
                aria-busy={working}
                onClick={() => void act("next")}
              >
                <ArrowRight size={16} />{" "}
                {state.questionIndex + 1 >= state.questionCount
                  ? "Finalizar partida"
                  : "Siguiente pregunta"}
              </ActionButton>
            )}
            {state.phase === "FINISHED" && (
              <Link
                href={AQUAQUIZ_ROOT}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.12] px-4 py-2 font-bold text-[#DCE5F5]"
              >
                Volver a cursos <ArrowRight size={16} />
              </Link>
            )}
            {state.phase !== "FINISHED" && (
              <ActionButton
                variant="danger"
                disabled={working}
                onClick={() => void act("finish")}
              >
                <Flag size={15} /> Terminar
              </ActionButton>
            )}
          </div>
        </Panel>
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.17em] text-[#00C9DF]">
                Marcador
              </p>
              <h2 className="mt-1 text-xl font-bold">Clasificación</h2>
            </div>
            <Trophy className="text-[#FFD76E]" size={22} />
          </div>
          <Leaderboard rows={state.leaderboard} />
          <p className="mt-4 text-xs leading-5 text-[#8491A8]">
            Los apodos repetidos se identifican por su puesto. No se publican
            códigos.
          </p>
        </Panel>
      </div>
    </AquaQuizFrame>
  );
}

export function AquaQuizProjection({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<SessionState | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    document.body.classList.add("aquaquiz-projection");
    return () => document.body.classList.remove("aquaquiz-projection");
  }, []);
  const load = useCallback(
    async (projectionToken: string) => {
      try {
        const response = await fetch(`/api/aquaquiz/sessions/${sessionId}`, {
          headers: { "X-AquaQuiz-Projection": projectionToken },
          credentials: "same-origin",
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(
            result.error || "No se pudo conectar a la proyección.",
          );
        setState(result.state);
        setError("");
      } catch (caught) {
        setError(errorText(caught));
      }
    },
    [sessionId],
  );
  useEffect(() => {
    const storageKey = `aquaquiz:projection:${sessionId}`;
    const fromHash = window.location.hash.slice(1);
    const savedToken = fromHash || sessionStorage.getItem(storageKey) || "";
    if (fromHash) {
      sessionStorage.setItem(storageKey, fromHash);
      window.history.replaceState({}, "", window.location.pathname);
    }
    setToken(savedToken);
  }, [sessionId]);
  useEffect(() => {
    if (!token) return;
    void load(token);
    const timer = window.setInterval(() => void load(token), 1400);
    return () => window.clearInterval(timer);
  }, [load, token]);
  if (!token)
    return (
      <AquaQuizFrame
        title="Pantalla de proyección"
        subtitle="La proyección necesita la clave de solo lectura que crea el docente."
      >
        <Panel>
          <Notice>
            Abre este enlace desde el control del docente para conectar la
            pantalla.
          </Notice>
          <Link
            href={AQUAQUIZ_ROOT}
            className="mt-4 inline-flex text-sm font-bold text-[#8EF5FF] underline underline-offset-4"
          >
            Volver al panel
          </Link>
        </Panel>
      </AquaQuizFrame>
    );
  if (!state)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080A12] px-5 text-center text-white">
        <div className="max-w-xl">
          {error ? (
            <>
              <p className="mb-4 text-2xl font-black">No se pudo conectar</p>
              <p className="text-[#AAB5CA]">{error}</p>
            </>
          ) : (
            <p className="animate-pulse text-xl font-bold text-[#A7FBFF]">
              Conectando con la sala…
            </p>
          )}
        </div>
      </div>
    );
  return (
    <div className="min-h-screen bg-[#080A12] px-5 py-6 text-white sm:px-10 sm:py-9">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7E93AC]">
            Aquatech presenta
          </p>
          <p className="text-lg font-black">
            Aqua<span className="text-[#00EFFF]">Quiz</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#00EFFF]/25 bg-[#00EFFF]/[0.07] px-5 py-2 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#83BFC9]">
              PIN de ingreso
            </p>
            <p className="font-mono text-2xl font-black tracking-[0.14em] text-[#A7FBFF] sm:text-3xl">
              {state.pin}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void document.documentElement.requestFullscreen?.()}
            className="hidden min-h-10 rounded-lg border border-white/[0.12] px-3 text-xs font-bold text-[#B8C5DD] hover:bg-white/[0.06] sm:block"
          >
            Pantalla completa
          </button>
        </div>
      </div>
      {error && (
        <div
          className="mx-auto mt-4 max-w-[1500px] rounded-xl border border-rose-300/20 bg-rose-300/[0.07] px-4 py-3 text-sm text-rose-100"
          role="status"
        >
          Conexión pausada. Revisa la sala del docente y vuelve a abrir la
          proyección si hace falta.
        </div>
      )}
      <div className="mx-auto mt-8 grid max-w-[1500px] gap-7 xl:grid-cols-[1fr_340px]">
        <section className="flex min-h-[70vh] flex-col justify-center rounded-3xl border border-white/[0.08] bg-[#10131E]/90 p-5 shadow-2xl shadow-black/30 sm:p-10 lg:p-14">
          {state.phase === "LOBBY" ? (
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#00C9DF]/10 text-[#75F2FE]">
                <Users size={45} />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00C9DF]">
                Entra desde tu celular
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
                ¿Listos para jugar?
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-[#AAB5CA]">
                Abre AquaQuiz en Aquatech e ingresa este PIN.
              </p>
              <p className="mt-10 font-mono text-6xl font-black tracking-[0.16em] text-[#A7FBFF] sm:text-8xl">
                {state.pin}
              </p>
              <p className="mt-5 text-lg text-[#94A3BA]">
                {state.participantCount}{" "}
                {state.participantCount === 1
                  ? "estudiante ingresado"
                  : "estudiantes ingresados"}
              </p>
            </div>
          ) : state.phase === "FINISHED" ? (
            <div className="text-center">
              <Trophy size={56} className="mx-auto text-[#FFD76E]" />
              <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#00C9DF]">
                ¡Buen trabajo, equipo!
              </p>
              <h1 className="mt-3 text-5xl font-black">Partida finalizada</h1>
              <p className="mt-3 text-lg text-[#AAB5CA]">
                Gracias por participar.
              </p>
            </div>
          ) : (
            state.question && (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <span className="rounded-full border border-[#00C9DF]/25 bg-[#00C9DF]/[0.06] px-4 py-2 text-sm font-bold text-[#9BF5FF]">
                    Pregunta {state.questionIndex + 1} / {state.questionCount}
                  </span>
                  <span className="rounded-full border border-white/[0.1] bg-[#090C14] px-5 py-2 text-lg font-black">
                    <Countdown
                      closesAt={state.closesAt}
                      serverNow={state.serverNow}
                    />
                  </span>
                </div>
                <h1 className="mb-8 text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  {state.question.prompt}
                </h1>
                <AnswerBlocks options={state.question.options} disabled />
                {state.phase === "REVEAL" && (
                  <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] p-5">
                    <p className="font-bold text-emerald-100">
                      La respuesta correcta es:{" "}
                      {state.question.options[
                        state.question.correctOptionIndex ?? -1
                      ] ?? "—"}
                    </p>
                    {state.question.explanation && (
                      <p className="mt-2 leading-6 text-[#BCE8D8]">
                        {state.question.explanation}
                      </p>
                    )}
                  </div>
                )}
              </>
            )
          )}
        </section>
        <aside className="rounded-3xl border border-white/[0.08] bg-[#10131E]/90 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00C9DF]">
                Top 10
              </p>
              <h2 className="mt-1 text-xl font-black">Marcador</h2>
            </div>
            <Trophy size={21} className="text-[#FFD76E]" />
          </div>
          <Leaderboard rows={state.leaderboard} />
          <p className="mt-4 text-center text-xs text-[#8190A8]">
            {state.participantCount} participantes
          </p>
        </aside>
      </div>
    </div>
  );
}

export function AquaQuizPlayer({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<SessionState | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const load = useCallback(async () => {
    try {
      const result = await aquaFetch<{ state: SessionState }>(
        `sessions/${sessionId}`,
      );
      setState(result.state);
      setError("");
    } catch (caught) {
      setError(errorText(caught));
    }
  }, [sessionId]);
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 1300);
    return () => window.clearInterval(timer);
  }, [load]);
  async function answer(optionIndex: number) {
    if (!state || state.hasAnswered || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await aquaFetch(`sessions/${sessionId}/answers`, {
        method: "POST",
        body: JSON.stringify({ optionIndex, requestId: crypto.randomUUID() }),
      });
      await load();
    } catch (caught) {
      setError(errorText(caught));
      await load();
    } finally {
      setSubmitting(false);
    }
  }
  if (!state)
    return (
      <AquaQuizFrame title="Conectando a la partida">
        <Panel>
          {error ? (
            <Notice tone="error">
              {error}
              <Link href={`${AQUAQUIZ_ROOT}/entrar`} className="ml-2 underline">
                Volver a entrar
              </Link>
            </Notice>
          ) : (
            <p className="animate-pulse text-sm text-[#AAB5CA]">
              AquaQuiz está buscando tu sala…
            </p>
          )}
        </Panel>
      </AquaQuizFrame>
    );
  return (
    <AquaQuizFrame
      wide
      title={state.phase === "FINISHED" ? "¡Fin de la partida!" : "Tu partida"}
      subtitle={
        state.phase === "LOBBY"
          ? "Ya estás en la sala. Mantén este dispositivo listo."
          : state.question
            ? `Pregunta ${state.questionIndex + 1} de ${state.questionCount}`
            : undefined
      }
      backHref={`${AQUAQUIZ_ROOT}/entrar`}
      backLabel="Salir de la vista"
    >
      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.7fr]">
        <Panel className="min-h-[480px]">
          {state.phase === "LOBBY" ? (
            <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
              <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#00C9DF]/10 text-[#76EFFB]">
                <Check size={38} />
              </span>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00C9DF]">
                Estás en la sala
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Espera la primera pregunta
              </h2>
              <p className="mt-3 text-[#AAB5CA]">
                Tu asistencia quedó registrada.
              </p>
            </div>
          ) : state.phase === "FINISHED" ? (
            <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
              <Trophy size={52} className="text-[#FFD76E]" />
              <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#00C9DF]">
                Resultado final
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Puesto {state.myPlace ?? "—"}
              </h2>
              <p className="mt-2 text-lg text-[#AAB5CA]">
                {(state.myScore ?? 0).toLocaleString("es-CO")} puntos
              </p>
              <p className="mt-5 text-sm text-[#93A0B7]">
                Tu apodo aparece en el marcador de la pantalla.
              </p>
            </div>
          ) : (
            state.question && (
              <>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00C9DF]">
                    Pregunta {state.questionIndex + 1} / {state.questionCount}
                  </p>
                  <p className="rounded-lg border border-white/[0.1] bg-[#090C14] px-3 py-2 text-sm font-black">
                    <Countdown
                      closesAt={state.closesAt}
                      serverNow={state.serverNow}
                    />
                  </p>
                </div>
                <h2 className="mb-7 text-2xl font-black leading-tight sm:text-3xl">
                  {state.question.prompt}
                </h2>
                <AnswerBlocks
                  options={state.question.options}
                  selected={state.myOptionIndex ?? undefined}
                  disabled={
                    state.hasAnswered ||
                    state.phase !== "QUESTION" ||
                    submitting
                  }
                  onSelect={(index) => void answer(index)}
                />
                {state.hasAnswered && state.phase === "QUESTION" && (
                  <Notice tone="success">
                    <Check size={16} className="mr-1 inline" /> Respuesta
                    guardada. Puedes mirar la pantalla mientras esperas.
                  </Notice>
                )}
                {state.phase === "REVEAL" && (
                  <div className="mt-5">
                    <Notice tone={state.myCorrect ? "success" : "info"}>
                      {state.myCorrect
                        ? "¡Correcto!"
                        : "La respuesta correcta era otra."}{" "}
                      · Correcta:{" "}
                      {state.question.options[
                        state.question.correctOptionIndex ?? -1
                      ] ?? "—"}{" "}
                      · {state.myScore?.toLocaleString("es-CO")} puntos totales
                    </Notice>
                    {state.question.explanation && (
                      <p className="mt-3 rounded-xl border border-white/[0.08] bg-[#0A0D15] p-4 text-sm leading-6 text-[#C5D1E3]">
                        {state.question.explanation}
                      </p>
                    )}
                  </div>
                )}
              </>
            )
          )}
        </Panel>
        <div className="space-y-5">
          <Panel className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.17em] text-[#8C9BB7]">
              Tu puntaje
            </p>
            <p className="my-2 text-5xl font-black tabular-nums text-[#A7FBFF]">
              {(state.myScore ?? 0).toLocaleString("es-CO")}
            </p>
            <p className="text-sm text-[#AAB5CA]">
              Puesto {state.myPlace ?? "—"}
            </p>
          </Panel>
          <Panel>
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-[#FFD76E]" />
              <h2 className="font-bold">Marcador</h2>
            </div>
            <Leaderboard
              rows={state.leaderboard}
              currentPlace={state.myPlace}
            />
          </Panel>
        </div>
      </div>
    </AquaQuizFrame>
  );
}
