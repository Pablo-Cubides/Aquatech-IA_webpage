/**
 * Fábrica de las funciones `logEvent / trackPageView / trackToolEvent / trackError`
 * que cada herramienta ya importa de su `utils/analytics.ts`. Mantiene esa API pero:
 *  - el USO va a la tabla de eventos propia (`sendToolEvent`), no a Sentry;
 *  - Sentry recibe SOLO errores (`captureException`), con la etiqueta de herramienta;
 *  - se ignora `userId` (antes se enviaba el correo del usuario como etiqueta).
 */

import { reportClientError } from "@/lib/observability/sentry-client";
import { TOOL_EVENTS } from "./events";
import { sendToolEvent } from "./track";

export function createToolAnalytics(tool: string) {
  const logEvent = (
    eventName: string,
    params?: Record<string, unknown>,
    _userId?: string,
  ) => {
    void _userId;
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[Analytics Event]", eventName);
    }
    sendToolEvent(tool, TOOL_EVENTS.ACTION, { ...params, action: eventName });
  };

  /** Las visitas ya las cuenta <ToolUsageTracker /> en el layout; no se duplican. */
  const trackPageView = (_path: string, _userId?: string) => {
    void _path;
    void _userId;
  };

  const trackToolEvent = (
    eventType: string,
    details?: Record<string, unknown>,
    userId?: string,
  ) => logEvent("tool_" + eventType, details, userId);

  const trackError = (
    error: Error,
    _context?: Record<string, unknown>,
    _userId?: string,
  ) => {
    void _context;
    void _userId;
    reportClientError(error, { tool });
    sendToolEvent(tool, TOOL_EVENTS.ERROR, { kind: "handled", name: error.name });
  };

  return { logEvent, trackPageView, trackToolEvent, trackError };
}
