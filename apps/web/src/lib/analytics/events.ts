/**
 * Esquema de eventos de uso por herramienta (OPS-001). Documentado en
 * docs/medicion-uso-herramientas.md: cualquier cambio aquí se refleja allí.
 */

export const ANALYTICS_SCHEMA_VERSION = 1;

/** Las 12 herramientas públicas. Las de autor (noindex) no se miden. */
export const PUBLIC_TOOLS = {
  ia: [
    "como-funcionan-llm",
    "filtrado-ia",
    "modelos-tendencia",
    "papers-ia",
    "parametros-decodificacion",
    "visor-difusion",
  ],
  ambiental: [
    "analisis-correlaciones",
    "generador-matrices",
    "indice-calidad-agua",
    "indice-calidad-aire",
    "normas-ambientales",
    "visor-mapas-ambientales",
  ],
} as const;

export type Portal = keyof typeof PUBLIC_TOOLS;

export const TOOL_EVENTS = {
  /** La herramienta se abrió (una visita). */
  VIEW: "tool_view",
  /** Interacción real: clic en un control o cambio de un campo. Ráfagas: máx. 1 por minuto y visita. */
  INTERACTION: "tool_interaction",
  /** Acción con nombre propio de la herramienta (calcular, generar, elegir caso…). */
  ACTION: "tool_action",
  /** Se eligió un archivo en un campo de subida. `ext` dice si es csv, xlsx, etc. */
  FILE_UPLOAD: "file_upload",
  /** Se pulsó un botón o enlace de exportar/descargar. */
  EXPORT: "tool_export",
  /** Error no controlado o capturado en la herramienta. Solo el nombre del error. */
  ERROR: "tool_error",
} as const;

export type ToolEventName = (typeof TOOL_EVENTS)[keyof typeof TOOL_EVENTS];

export type ParsedToolPath = { portal: Portal; tool: string };

/** `/ia/herramientas/visor-difusion/...` → { portal: "ia", tool: "visor-difusion" }; null si no es una herramienta pública. */
export function parseToolPath(pathname: string | null | undefined): ParsedToolPath | null {
  const match = pathname?.match(/^\/(ia|ambiental)\/herramientas\/([a-z0-9-]+)/);
  if (!match) return null;
  const portal = match[1] as Portal;
  const tool = match[2];
  return (PUBLIC_TOOLS[portal] as readonly string[]).includes(tool) ? { portal, tool } : null;
}

/** Claves de eventData cuyo nombre sugiere texto libre o identidad: nunca se envían. */
const DENIED_KEY =
  /text|prompt|email|mail|name|nombre|input|frase|code|codigo|token|password|phrase|query|message/i;
const MAX_STRING = 40;
const MAX_KEYS = 12;

/** Deja solo números, booleanos y cadenas cortas con clave segura. Nunca texto del usuario. */
export function safeEventData(
  params: Record<string, unknown> | undefined,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!params) return out;
  for (const [key, value] of Object.entries(params)) {
    if (Object.keys(out).length >= MAX_KEYS) break;
    if (!/^[A-Za-z0-9_.:-]{1,48}$/.test(key) || DENIED_KEY.test(key)) continue;
    if (typeof value === "number" && Number.isFinite(value)) out[key] = value;
    else if (typeof value === "boolean") out[key] = value;
    else if (typeof value === "string" && value.length <= MAX_STRING) out[key] = value;
  }
  return out;
}
