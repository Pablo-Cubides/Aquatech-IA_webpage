import React from "react";
import { ExternalLink } from "lucide-react";

export interface AuthoritativeSource {
  title: string;
  url: string;
  source?: string;
  organization?: string;
  domain?: string;
  description?: string;
}

interface AuthoritativeReferencesProps {
  /** Obligatorio: este componente no inventa fuentes. Con lista vacía no pinta nada. */
  sources: AuthoritativeSource[];
  title?: string;
  subtitle?: string;
  theme?: "dark" | "light";
  className?: string;
}

/**
 * Pinta exactamente las fuentes que recibe. No hay lista por defecto (VIS-005): en un artículo
 * van sus `references` reales; en portadas e índices, una lista explícita verificada
 * (ver `official-resources.ts`).
 */
export function AuthoritativeReferences({
  sources,
  title = "Fuentes y referencias",
  subtitle = "Documentos y fuentes consultados para este artículo:",
  theme = "light",
  className = "",
}: AuthoritativeReferencesProps) {
  if (!sources || sources.length === 0) return null;

  const isDark = theme === "dark";

  return (
    <aside
      aria-label="Fuentes y Referencias Autoritativas"
      className={`rounded-xl border p-6 my-8 ${
        isDark
          ? "bg-[#10111A]/80 border-cyan-500/20 text-gray-200"
          : "bg-emerald-50/40 border-emerald-200/70 text-gray-800"
      } ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl" aria-hidden="true">🏛️</span>
        <h3
          className={`text-lg font-bold ${
            isDark ? "text-cyan-400" : "text-emerald-900"
          }`}
        >
          {title}
        </h3>
      </div>
      {subtitle && (
        <p
          className={`text-sm mb-4 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0 m-0">
        {sources.map((item, idx) => {
          const sourceLabel = item.source || item.organization || item.domain || "Fuente autorizada";
          return (
            <li
              key={idx}
              className={`flex flex-col justify-between p-3 rounded-lg border transition-colors ${
                isDark
                  ? "bg-black/40 border-gray-800 hover:border-cyan-500/40"
                  : "bg-white border-emerald-100 hover:border-emerald-300 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isDark
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {sourceLabel}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs font-semibold hover:underline ${
                    isDark
                      ? "text-cyan-400 hover:text-cyan-300"
                      : "text-emerald-700 hover:text-emerald-800"
                  }`}
                  aria-label={`Visitar ${item.title} en ${sourceLabel} (abre en nueva pestaña)`}
                >
                  Consultar fuente
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            <p
              className={`text-sm font-medium mt-2 leading-snug ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {item.title}
            </p>
            {item.description && (
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.description}
              </p>
            )}
          </li>
          );
        })}
      </ul>
    </aside>
  );
}
