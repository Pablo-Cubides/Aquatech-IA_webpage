/**
 * Fechas de CALENDARIO (un día, sin hora) y «hoy» en la zona del sitio. VIS-008.
 *
 * EL PROBLEMA QUE RESUELVE
 * `new Date("2024-01-15")` es la medianoche UTC de ese día. Al pintarla con `toLocaleDateString()` en el navegador de
 * Colombia (UTC-5) sale «14/1/2024»: un día antes. Y `new Date().toISOString().split("T")[0]` es la fecha UTC de
 * ahora, que entre las 19:00 y las 24:00 en Colombia ya es MAÑANA. Las dos cosas son el mismo error: interpretar un día
 * como un instante UTC.
 *
 * LA REGLA
 * - Un día suelto (`YYYY-MM-DD`) es un día de calendario, no un instante. Se formatea con `formatCalendarDate`, que da
 *   el MISMO día en cualquier zona y en servidor y cliente (sin desajuste de hidratación).
 * - «Hoy» es el día de Colombia: `todayCalendarDate()`.
 * - Un instante real (con hora) se muestra en la zona del sitio, también igual en servidor y cliente.
 * No volver a escribir `new Date(texto).toLocaleDateString()` ni `new Date().toISOString().split("T")[0]`: una prueba
 * estática (`calendar-date.guard.test.ts`) falla si reaparecen.
 *
 * Módulo puro y sin dependencias: sirve en servidor y en cliente. (La convención de SALIDA para JSON-LD/Open Graph vive
 * en `lib/seo/article-dates.ts`; aquí el dato llega bien y el riesgo es corromperlo al MOSTRARLO.)
 */

/** Zona del sitio: Colombia (sin horario de verano). */
export const SITE_TIME_ZONE = "America/Bogota";

/** Un día suelto: `YYYY-MM-DD`. Única definición del proyecto. */
export const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `[año, mes, día]` si `value` es un día de calendario real (rechaza 2026-02-30 o 2026-13-01), si no `undefined`. */
function calendarParts(value: string | null | undefined): [number, number, number] | undefined {
  const match = DATE_ONLY.exec((value ?? "").trim());
  if (!match) return undefined;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const probe = new Date(Date.UTC(year, month - 1, day));
  const real = probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day;
  return real ? [year, month, day] : undefined;
}

/**
 * Un día de calendario como `Date` a mediodía LOCAL, para el código que necesita un `Date` y usa los getters locales
 * (`getDate()`, `toLocaleDateString()`): a mediodía el día no se corre en ninguna zona. `undefined` si no es `YYYY-MM-DD`.
 */
export function parseCalendarDate(value: string | null | undefined): Date | undefined {
  const parts = calendarParts(value);
  return parts ? new Date(parts[0], parts[1] - 1, parts[2], 12) : undefined;
}

/**
 * Formatea una fecha para mostrarla.
 * - `YYYY-MM-DD`: fecha de calendario; mismo día en cualquier zona (se formatea en UTC sobre el mediodía UTC de ese día).
 * - Otro valor con fecha y hora (un instante): se muestra en la zona del sitio salvo que `options.timeZone` diga otra.
 * - Vacío o inválido: cadena vacía (no `Invalid Date`).
 * Los parámetros son los de `Intl.DateTimeFormat`; sin opciones da lo mismo que `toLocaleDateString(locale)`.
 */
export function formatCalendarDate(
  value: string | null | undefined,
  locale?: string | string[],
  options: Intl.DateTimeFormatOptions = {},
): string {
  const parts = calendarParts(value);
  if (parts) {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12)));
  }
  const text = (value ?? "").trim();
  // Un «YYYY-MM-DD» que no es un día real (2026-02-30) no se interpreta como instante: JS lo desplazaría a otro día.
  if (!text || DATE_ONLY.test(text)) return "";
  const instant = new Date(text);
  if (Number.isNaN(instant.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { timeZone: SITE_TIME_ZONE, ...options }).format(instant);
}

/** «Hoy» (o el día de `now`) como `YYYY-MM-DD` en la zona del sitio. Sustituye a `toISOString().split("T")[0]`. */
export function todayCalendarDate(now: Date = new Date(), timeZone: string = SITE_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
