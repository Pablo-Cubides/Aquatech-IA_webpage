/**
 * Clasificación de un valor continuo en una escala de categorías (ING-002).
 *
 * Una sola política para todas las herramientas de índices (WQI, DWQI, IRCA, comparación con la
 * OMS). Origen: las escalas se escribían con rangos enteros (0-24, 25-49…) pero los índices son
 * decimales, y la búsqueda `find(...) || categoria_de_respaldo` devolvía en silencio la primera o la
 * última categoría cuando el valor caía entre dos rangos. Un WQI de 89.79 salía «Muy mala».
 *
 * Reglas:
 *  - Valor no finito (NaN, ±Infinity) o fuera de la escala: `null`. Nunca una categoría inventada.
 *  - Valor dentro de un rango (extremos incluidos): ese rango.
 *  - Valor entre dos rangos (el hueco de `24` a `25`): el rango inferior o el superior según `gap`.
 *    Cada escala declara hacia dónde cae el hueco; lo prudente es hacia la categoría peor.
 *  - `openTop`: el último rango no tiene techo real (p. ej. «No apta», «>300 %»).
 *
 * Los rangos deben venir ordenados de menor a mayor y sin solaparse. No se modifican las escalas.
 */

export interface Band {
  min: number;
  max: number;
}

export interface FindBandOptions {
  /** Hacia dónde cae un valor que queda entre dos rangos: el inferior o el superior. */
  gap: "lower" | "upper";
  /** El último rango acepta cualquier valor por encima de su `max`. */
  openTop?: boolean;
}

export function findBand<T extends Band>(
  value: number,
  bands: readonly T[],
  { gap, openTop = false }: FindBandOptions,
): T | null {
  if (!Number.isFinite(value) || bands.length === 0) return null;

  for (const band of bands) {
    if (value >= band.min && value <= band.max) return band;
  }

  if (value < bands[0].min) return null;
  if (value > bands[bands.length - 1].max) return openTop ? bands[bands.length - 1] : null;

  for (let i = 0; i < bands.length - 1; i++) {
    if (value > bands[i].max && value < bands[i + 1].min) {
      return gap === "lower" ? bands[i] : bands[i + 1];
    }
  }

  // Rangos desordenados o solapados: es un error de la escala, no del valor.
  return null;
}
