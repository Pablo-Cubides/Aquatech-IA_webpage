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

const DEFAULT_AMBIENTAL_SOURCES: AuthoritativeSource[] = [
  {
    title: "Ministerio de Ambiente y Desarrollo Sostenible de Colombia",
    url: "https://www.minambiente.gov.co/",
    source: "MinAmbiente (.gov.co)",
    description: "Normatividad, resoluciones hídricas y lineamientos ambientales nacionales.",
  },
  {
    title: "Instituto de Hidrología, Meteorología y Estudios Ambientales (IDEAM)",
    url: "http://www.ideam.gov.co/",
    source: "IDEAM (.gov.co)",
    description: "Monitoreo científico, calidad de agua y modelos hidrometeorológicos.",
  },
  {
    title: "Programa de las Naciones Unidas para el Medio Ambiente (PNUMA)",
    url: "https://www.unep.org/es",
    source: "UNEP (.org)",
    description: "Evaluaciones ambientales globales y metas de desarrollo sostenible.",
  },
  {
    title: "USGS Water Resources Mission Area",
    url: "https://www.usgs.gov/mission-areas/water-resources",
    source: "USGS (.gov)",
    description: "Estudios hidrológicos, caudales y estándares de investigación geológica.",
  },
];

const DEFAULT_IA_SOURCES: AuthoritativeSource[] = [
  {
    title: "NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    source: "NIST (.gov)",
    description: "Estándares federales para gobernanza, seguridad y confiabilidad en IA.",
  },
  {
    title: "arXiv Computer Science: Artificial Intelligence Repository",
    url: "https://arxiv.org/corr/cs.AI",
    source: "arXiv (Cornell University .edu)",
    description: "Publicaciones pre-print revisadas sobre arquitecturas de aprendizaje profundo.",
  },
  {
    title: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
    url: "https://doi.org/10.1109/TPAMI.2023.3276856",
    source: "IEEE Xplore (doi.org)",
    description: "Investigaciones científicas indexadas sobre visión computacional y modelos fundacionales.",
  },
  {
    title: "Stanford Center for Research on Foundation Models (CRFM)",
    url: "https://crfm.stanford.edu/",
    source: "Stanford University (.edu)",
    description: "Evaluación holística, alineamiento ético y capacidades de LLMs.",
  },
];

interface AuthoritativeReferencesProps {
  sources?: AuthoritativeSource[];
  customSources?: AuthoritativeSource[];
  title?: string;
  subtitle?: string;
  theme?: "dark" | "light";
  className?: string;
}

/**
 * Renders authoritative sources (.gov, .edu, DOI, standard bodies)
 * to satisfy Generative Engine Optimization (GEO) trust and verification criteria.
 */
export function AuthoritativeReferences({
  sources,
  customSources,
  title = "Fuentes y Referencias Científico-Normativas",
  subtitle = "Recursos oficiales y literatura académica para verificación y profundización técnica:",
  theme = "light",
  className = "",
}: AuthoritativeReferencesProps) {
  const activeSources =
    sources ||
    customSources ||
    (theme === "dark" ? DEFAULT_IA_SOURCES : DEFAULT_AMBIENTAL_SOURCES);

  if (!activeSources || activeSources.length === 0) return null;

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
        {activeSources.map((item, idx) => {
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
