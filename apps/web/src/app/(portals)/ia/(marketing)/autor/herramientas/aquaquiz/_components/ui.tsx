"use client";

import Link from "next/link";
import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { ArrowLeft, Droplets, LoaderCircle } from "lucide-react";

export const AQUAQUIZ_ROOT = "/ia/autor/herramientas/aquaquiz";

export async function aquaFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await fetch(`/api/aquaquiz/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "No se pudo completar la solicitud.",
    );
  }
  return data as T;
}

export function AquaQuizFrame({
  children,
  title,
  subtitle,
  backHref = AQUAQUIZ_ROOT,
  backLabel = "Panel AquaQuiz",
  action,
  wide = false,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#080A12] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-[-9rem] h-[28rem] w-[28rem] rounded-full bg-[#0095FF]/10 blur-[120px]" />
        <div className="absolute -right-32 top-[20rem] h-[24rem] w-[24rem] rounded-full bg-[#00EFFF]/[0.07] blur-[110px]" />
      </div>
      <div
        className={`relative mx-auto px-4 pb-16 pt-5 sm:px-6 lg:px-8 ${wide ? "max-w-[1440px]" : "max-w-7xl"}`}
      >
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <Link
            href={AQUAQUIZ_ROOT}
            className="inline-flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00EFFF]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00EFFF] to-[#0095FF] text-[#07111B] shadow-lg shadow-cyan-950/50">
              <Droplets size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">
                Aqua<span className="text-[#00EFFF]">Quiz</span>
              </span>
              <span className="block text-[11px] uppercase tracking-[0.19em] text-[#8C9BB7]">
                Aquatech · aprender jugando
              </span>
            </span>
          </Link>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#B8C5DD] transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00EFFF]"
          >
            <ArrowLeft size={16} aria-hidden="true" /> {backLabel}
          </Link>
        </header>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00C9DF]">
              AquaQuiz en vivo
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#AAB5CA] sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
        {children}
        <footer className="mt-14 border-t border-white/[0.07] pt-5 text-center text-xs text-[#77839B]">
          AquaQuiz · una herramienta de aula de Aquatech
        </footer>
      </div>
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.09] bg-[#10131E]/90 p-5 shadow-[0_18px_60px_-36px_rgba(0,0,0,0.9)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#DCE5F5]">
      <span>{label}</span>
      <input
        {...props}
        className={`w-full rounded-xl border border-white/[0.12] bg-[#090C14] px-4 py-3 text-base text-white outline-none transition placeholder:text-[#657188] focus:border-[#00C9DF] focus:ring-2 focus:ring-[#00C9DF]/20 disabled:opacity-60 ${props.className ?? ""}`}
      />
      {hint && (
        <span className="block text-xs font-normal leading-5 text-[#8C9BB7]">
          {hint}
        </span>
      )}
    </label>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-[#DCE5F5]">
      <span>{label}</span>
      <select
        {...props}
        className={`w-full rounded-xl border border-white/[0.12] bg-[#090C14] px-4 py-3 text-base text-white outline-none focus:border-[#00C9DF] focus:ring-2 focus:ring-[#00C9DF]/20 disabled:opacity-60 ${props.className ?? ""}`}
      >
        {children}
      </select>
    </label>
  );
}

export function ActionButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-[#00DDEB] to-[#078BFA] text-[#07111B] shadow-lg shadow-cyan-950/30 hover:brightness-110",
    secondary:
      "border border-white/[0.13] bg-white/[0.04] text-[#EAF3FF] hover:border-[#00C9DF]/60 hover:bg-white/[0.08]",
    danger:
      "border border-rose-400/25 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20",
  };
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00EFFF] ${variants[variant]} ${className}`}
    >
      {props.disabled && props["aria-busy"] ? (
        <LoaderCircle className="animate-spin" size={17} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "error" | "success";
}) {
  const tones = {
    info: "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100",
    error: "border-rose-300/25 bg-rose-300/[0.08] text-rose-100",
    success: "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-100",
  };
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm leading-6 ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#00C9DF]">
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.14] px-5 py-8 text-center">
      <p className="font-bold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#9DAAC1]">
        {children}
      </p>
    </div>
  );
}
