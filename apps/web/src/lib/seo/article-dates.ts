/**
 * Fechas de artículos para máquinas (JSON-LD, Open Graph, sitemap, llms-full.txt y .md). VIS-007.
 *
 * CONVENCIÓN DE FORMATO, NO UN DATO MEDIDO.
 * Los artículos solo guardan el día (`YYYY-MM-DD`). No sabemos a qué hora se publicó ni se modificó, y no lo
 * afirmamos. Google pide fecha-hora ISO 8601 con zona (la Prueba de resultados enriquecidos avisa si falta), así que
 * un día suelto se escribe como la medianoche de Colombia (-05:00). Esa hora es solo la forma de expresar «este
 * día» sin que se corra un día hacia atrás en hora local; no significa que algo ocurriera a esa hora.
 * Si el dato ya trae hora y zona, se respeta tal cual.
 *
 * SIN RESPALDO PARA `dateModified`.
 * Antes la fecha de modificación se rellenaba con la de publicación cuando faltaba: eso decía «actualizado» el mismo
 * día de la publicación, es decir, frescura que no existe. Ahora solo hay fecha de modificación si el artículo declara una real. No volver
 * a poner un respaldo (hay una prueba que falla si vuelve).
 */

import { DATE_ONLY } from "@/lib/dates/calendar-date";

/** Zona de la convención: medianoche en Colombia. */
export const DATE_ONLY_OFFSET = "-05:00";


/**
 * Fecha-hora ISO 8601 con zona para JSON-LD y Open Graph.
 * `YYYY-MM-DD` -> `YYYY-MM-DDT00:00:00-05:00`. Un valor que ya trae hora se devuelve igual. Un valor que no es una
 * fecha válida devuelve `undefined` (mejor omitir el campo que emitir basura).
 */
export function toSchemaDateTime(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const text = value.trim();
  if (DATE_ONLY.test(text)) {
    const stamped = `${text}T00:00:00${DATE_ONLY_OFFSET}`;
    return Number.isNaN(Date.parse(stamped)) ? undefined : stamped;
  }
  return Number.isNaN(Date.parse(text)) ? undefined : text;
}

/**
 * Fecha de modificación REAL del artículo, tal como se guardó (sin convertir), o `undefined`.
 * Es real si existe, es una fecha válida y no es anterior a la de publicación (segunda barrera: el contrato de
 * artículos ya rechaza esa inversión al guardar). Una igualdad explícita (`dateModified === date`) se respeta: la
 * escribió alguien; lo que se elimina es la ausencia rellenada por defecto.
 */
export function realModifiedDate(article: { date: string; dateModified?: string | null }): string | undefined {
  const raw = article.dateModified?.trim();
  const modified = toSchemaDateTime(raw);
  const published = toSchemaDateTime(article.date);
  if (!raw || !modified || !published) return undefined;
  if (Date.parse(modified) < Date.parse(published)) return undefined;
  return raw;
}
