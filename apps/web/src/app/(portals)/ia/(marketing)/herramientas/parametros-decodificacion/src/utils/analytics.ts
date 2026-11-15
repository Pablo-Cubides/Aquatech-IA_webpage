import { createToolAnalytics } from "@/lib/analytics/tool-analytics";

// Medición de uso: ver docs/medicion-uso-herramientas.md. El uso va a la tabla de
// eventos propia; Sentry solo recibe errores. userId se ignora a propósito.
export const { logEvent, trackPageView, trackToolEvent, trackError } =
  createToolAnalytics("parametros-decodificacion");
