"use client";

import { useEffect, useMemo, useState } from "react";

export type SortBy = "relevance" | "rating" | "price_asc" | "price_desc" | "newest" | "bestsellers";

export type FiltersState = {
  q: string;
  type: "all" | "course" | "product" | "ebook" | "software" | "certification" | "membership";
  topics: string[];
  level: ("intro" | "intermedio" | "avanzado")[];
  format: string[]; // curso: grabado/en-vivo ; producto: gadget/libro/herramienta/kit/hogar-eco
  language: ("es" | "en")[];
  region: ("LatAm" | "Global")[];
  platform: string[]; // Hotmart/Udemy/Coursera/Amazon/Domestika/Crehana/…
  price: "all" | "free" | "<25" | "25-100" | "100-300" | "300+";
  sortBy: SortBy;
};

export const defaultFilters: FiltersState = {
  q: "",
  type: "all",
  topics: [],
  level: [],
  format: [],
  language: [],
  region: ["LatAm"],
  platform: [],
  price: "all",
  sortBy: "relevance",
};

const TOPICS = [
  "agua",
  "sostenibilidad",
  "renovables",
  "economía-circular",
  "IA-aplicada",
  "productividad",
  "automatización",
  "educación-IA",
  "marketing-verde",
];

const PLATFORMS = ["Hotmart", "Udemy", "Coursera", "Domestika", "Crehana", "Amazon", "Libros", "Otro"];

export default function Filters({
  value,
  onChange,
}: {
  value: FiltersState;
  onChange: (s: FiltersState) => void;
}) {
  const [local, setLocal] = useState<FiltersState>(value);
  useEffect(() => setLocal(value), [value]);

  const formatOptions = useMemo(() => {
    if (["product"].includes(local.type)) return ["gadget", "libro", "herramienta", "kit", "hogar-eco"];
    if (["ebook", "software"].includes(local.type)) return ["pdf", "licencia", "app", "saas"];
    if (["certification", "membership"].includes(local.type)) return ["certificación", "membresía"];
    return ["grabado", "en-vivo", "bootcamp", "universidad"];
  }, [local.type]);

  function apply() {
    onChange(local);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador + Tipo */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            value={local.q}
            onChange={(e) => setLocal({ ...local, q: e.target.value })}
            placeholder="Buscar por título, plataforma o palabra clave…"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <span className="absolute right-3 top-2.5 text-sm text-[var(--muted)]">Enter ↵</span>
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
          {(["all", "course", "product", "ebook", "software", "certification", "membership"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setLocal({ ...local, type: t })}
              className={`rounded-lg px-3 py-2 text-sm font-semibold border ${
                local.type === t ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--border)]"
              }`}
              aria-pressed={local.type === t}
            >
              {t === "all" ? "Todos" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Chips de temas */}
      <div className="hidden md:flex flex-wrap gap-2">
        {TOPICS.map((tag) => {
          const active = local.topics.includes(tag);
          return (
            <button
              key={tag}
              onClick={() =>
                setLocal({
                  ...local,
                  topics: active ? local.topics.filter((x) => x !== tag) : [...local.topics, tag],
                })
              }
              className={`rounded-full px-3 py-1 text-sm border ${
                active ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-white border-[var(--border)]"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Selectores */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <select
          value={local.level[0] ?? ""}
          onChange={(e) => setLocal({ ...local, level: e.target.value ? [e.target.value as any] : [] })}
          disabled={local.type === "product"}
          className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
        >
          <option value="">Nivel</option>
          <option value="intro">Intro</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>

        <select
          value={local.format[0] ?? ""}
          onChange={(e) => setLocal({ ...local, format: e.target.value ? [e.target.value] : [] })}
          className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
        >
          <option value="">Formato</option>
          {formatOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={local.language[0] ?? ""}
          onChange={(e) => setLocal({ ...local, language: e.target.value ? [e.target.value as any] : [] })}
          className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
        >
          <option value="">Idioma</option>
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>

        <select
          value={local.region[0] ?? "LatAm"}
          onChange={(e) => setLocal({ ...local, region: e.target.value ? [e.target.value as any] : [] })}
          className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
        >
          <option value="LatAm">LatAm</option>
          <option value="Global">Global</option>
        </select>

        <select
          value={local.platform[0] ?? ""}
          onChange={(e) => setLocal({ ...local, platform: e.target.value ? [e.target.value] : [] })}
          className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
        >
          <option value="">Plataforma / Marca</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={local.price}
          onChange={(e) => setLocal({ ...local, price: e.target.value as any })}
          className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
        >
          <option value="all">Precio</option>
          <option value="free">Gratis</option>
          <option value="<25">{"< $25"}</option>
          <option value="25-100">$25–$100</option>
          <option value="100-300">$100–$300</option>
          <option value="300+">$300+</option>
        </select>

        <select
          value={local.sortBy}
          onChange={(e) => setLocal({ ...local, sortBy: e.target.value as any })}
          className="col-span-2 md:col-span-1 rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-sm"
        >
          <option value="relevance">Relevancia</option>
          <option value="rating">Calificación</option>
          <option value="newest">Nuevos</option>
          <option value="bestsellers">Más vendidos</option>
          <option value="price_asc">Precio ↑</option>
          <option value="price_desc">Precio ↓</option>
        </select>

        <div className="col-span-2 md:col-span-1 flex justify-end">
          <button
            onClick={apply}
            className="w-full md:w-auto rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:opacity-90"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
