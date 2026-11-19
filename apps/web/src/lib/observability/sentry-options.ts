/**
 * Configuración compartida de Sentry para cliente y servidor (OPS-001).
 *
 * Regla de oro: el proyecto maneja correos y notas de estudiantes. Nada de eso
 * sale hacia Sentry. Se filtra en `beforeSend`/`beforeBreadcrumb` (último punto
 * antes de la red) además de `sendDefaultPii: false`.
 *
 * Sin DSN no se inicializa nada: el SDK queda inerte y los `captureException`
 * existentes son no-ops, como hoy.
 */

import type { Breadcrumb, ErrorEvent, EventHint } from "@sentry/nextjs";

/** Errores de navegador sin acción posible que consumirían la cuota. */
export const IGNORED_ERRORS: Array<string | RegExp> = [
  "ResizeObserver loop limit exceeded",
  "ResizeObserver loop completed with undelivered notifications",
  /^AbortError/,
  /Loading chunk [\w-]+ failed/,
  /Failed to fetch dynamically imported module/,
  "Non-Error promise rejection captured",
];

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// Códigos de estudiante (4-20 dígitos seguidos) y tokens largos.
const LONG_DIGITS = /\b\d{4,20}\b/g;
const LONG_TOKEN = /\b[A-Za-z0-9_-]{32,}\b/g;

/** Enmascara correos, códigos numéricos y tokens largos de un texto libre. */
export function scrubText(text: string): string {
  return text
    .replace(EMAIL, "[email]")
    .replace(LONG_DIGITS, "[num]")
    .replace(LONG_TOKEN, "[token]");
}

/** Quita query string y fragmento: pueden llevar código de estudiante, tokens, etc. */
export function scrubUrl(url: string): string {
  try {
    const parsed = new URL(url, "http://local.invalid");
    const isAbsolute = /^[a-z][a-z0-9+.-]*:/i.test(url);
    return isAbsolute ? `${parsed.origin}${parsed.pathname}` : parsed.pathname;
  } catch {
    return url.split(/[?#]/)[0] ?? url;
  }
}

/** `/ia/herramientas/visor-difusion` → "visor-difusion" (null si no es una herramienta pública). */
export function toolFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const match = scrubUrl(url).match(/\/(?:ia|ambiental)\/herramientas\/([a-z0-9-]+)/);
  return match?.[1] ?? null;
}

function scrubObjectStrings(value: unknown): unknown {
  if (typeof value === "string") return scrubText(value);
  if (Array.isArray(value)) return value.map(scrubObjectStrings);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, scrubObjectStrings(v)]),
    );
  }
  return value;
}

/**
 * Último filtro antes de enviar. Devuelve null para descartar el evento.
 *  - Sin usuario, IP, cookies, cabeceras, cuerpo ni query string.
 *  - Mensajes y valores de excepción con correos/códigos/tokens enmascarados.
 *  - Etiqueta `tool` cuando el error ocurre en una herramienta pública.
 */
export function scrubEvent<T extends ErrorEvent>(event: T, _hint?: EventHint): T | null {
  const url = event.request?.url;

  if (url && /\/api\/health|\/webhook/.test(url)) return null;

  delete event.user;
  delete event.server_name;
  delete (event as { contexts?: { culture?: unknown } }).contexts?.culture;

  if (event.request) {
    event.request = url ? { url: scrubUrl(url), method: event.request.method } : {};
  }

  if (event.message) event.message = scrubText(event.message);

  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = scrubText(exception.value);
  }

  if (event.extra) event.extra = scrubObjectStrings(event.extra) as typeof event.extra;

  for (const crumb of event.breadcrumbs ?? []) scrubBreadcrumb(crumb);

  const tool = toolFromUrl(url);
  if (tool) event.tags = { ...event.tags, tool };

  return event;
}

export function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  if (breadcrumb.message) breadcrumb.message = scrubText(breadcrumb.message);
  const data = breadcrumb.data;
  if (data) {
    for (const key of ["url", "from", "to"]) {
      if (typeof data[key] === "string") data[key] = scrubUrl(data[key] as string);
    }
    delete data.request_body_size;
    delete data.body;
  }
  // Las pulsaciones llevan el texto del elemento (puede ser contenido del usuario).
  if (breadcrumb.category?.startsWith("ui.")) delete breadcrumb.message;
  return breadcrumb;
}

export function sentryDsn(): string | undefined {
  const dsn = (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)?.trim();
  return dsn || undefined;
}

export function sentryEnvironment(): string {
  // Vercel sabe si es producción o preview; la variable manual puede haberse copiado de .env.local.
  return (
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_SENTRY_ENV?.trim() ||
    process.env.NODE_ENV ||
    "development"
  );
}

/** Fracción de transacciones de servidor que se envían (conservador: cuota y coste). */
export const SERVER_TRACES_SAMPLE_RATE = 0.05;

/** Transacciones que solo hacen ruido y gastan cuota. */
export const IGNORED_TRANSACTIONS: Array<string | RegExp> = [/\/api\/health/, /\/monitoring/];
