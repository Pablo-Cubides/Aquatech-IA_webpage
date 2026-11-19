import { createToolAnalytics } from "@/lib/analytics/tool-analytics";

// Medición de uso: ver docs/medicion-uso-herramientas.md. Antes solo escribía en la
// consola; ahora cuenta acciones (generar token, cambiar estrategia…). El texto que
// escribe el usuario NUNCA se envía: safeEventData descarta las claves de texto libre.
export const { logEvent, trackPageView } = createToolAnalytics("como-funcionan-llm");
