/**
 * Fuente canónica de constantes normativas — tipos comunes.
 *
 * REGLA (cargo DOM): ninguna constante normativa entra aquí sin haberse
 * verificado contra el texto oficial. Cada constante lleva su cita (`NormCitation`).
 * Si una norma cambia, el test `__tests__/normativa.test.ts` debe ser el que avise.
 */
export interface NormCitation {
  /** Norma, p. ej. "Resolución 2115 de 2007 (MPS-MAVDT)". */
  norma: string;
  /** Artículo / cuadro / tabla, p. ej. "art. 13, Cuadro 6". */
  articulo: string;
  /** Fecha desde la que rige lo citado (ISO 8601). */
  vigenteDesde: string;
  /** Medio oficial de publicación. */
  publicacion: string;
  /** URL del texto consultado. */
  url: string;
  /** Fecha en que se verificó contra ese texto (ISO 8601). */
  verificado: string;
}
