/**
 * Fecha de publicacion de cada herramienta (primer commit que creo su carpeta, segun el historial de git).
 * Las cuatro de 2025-09-15 corresponden al commit inicial del repositorio: significan "existia desde el principio",
 * no necesariamente cuando se construyo; como datePublished de la pagina en esta URL es defendible.
 *
 * NO hay dateModified de herramientas a proposito: el ultimo commit de un archivo no distingue un cambio de
 * funcionalidad de uno de formato, y una fecha inferida afirmaria algo falso. Pendiente (durable): que cada herramienta
 * declare su propia fecha de actualizacion editorial en sus datos, mantenida por quien cambia el contenido.
 */
export const TOOL_PUBLISHED: Record<string, string> = {
  "como-funcionan-llm": "2025-10-30",
  "filtrado-ia": "2025-09-15",
  "modelos-tendencia": "2025-12-09",
  "papers-ia": "2025-12-09",
  "parametros-decodificacion": "2025-11-11",
  "visor-difusion": "2025-10-30",
  "analisis-correlaciones": "2025-10-30",
  "generador-matrices": "2025-09-15",
  "indice-calidad-agua": "2025-12-09",
  "indice-calidad-aire": "2025-12-09",
  "normas-ambientales": "2025-09-15",
  "visor-mapas-ambientales": "2025-09-15",
};
