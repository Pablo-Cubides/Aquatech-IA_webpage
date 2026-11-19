/**
 * Sentry en el navegador con CARGA DIFERIDA (OPS-001).
 *
 * El SDK completo pesa ~60 KB comprimidos. Cargarlo en todas las páginas rompía el
 * presupuesto de JS (constitución §5.1: < 250 KB) y retrasaba el LCP, así que el
 * código del SDK vive en un chunk aparte que SOLO se descarga cuando ocurre el
 * primer error (o se reporta uno de forma explícita). Hasta entonces el coste es
 * un puñado de bytes: dos listeners y esta función.
 *
 * Contrapartida asumida: no hay breadcrumbs previos al primer error ni trazas de
 * navegador (solo errores; los Core Web Vitals los mide Vercel Analytics).
 * Sin DSN no se carga nada nunca.
 */

import {
  IGNORED_ERRORS,
  scrubBreadcrumb,
  scrubEvent,
  sentryDsn,
  sentryEnvironment,
} from "./sentry-options";

type SentrySdk = typeof import("@sentry/nextjs");

let loading: Promise<SentrySdk | null> | null = null;
let initialized = false;

export function loadSentry(): Promise<SentrySdk | null> {
  const dsn = sentryDsn();
  if (!dsn) return Promise.resolve(null);

  loading ??= import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.init({
        dsn,
        environment: sentryEnvironment(),
        sendDefaultPii: false,
        ignoreErrors: IGNORED_ERRORS,
        // Los errores de scripts de terceros (extensiones, traductores) no son nuestros.
        denyUrls: [/^chrome-extension:/i, /^moz-extension:/i, /^safari-extension:/i],
        beforeSend: (event, hint) => scrubEvent(event, hint),
        beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
      });
      initialized = true;
      return Sentry;
    })
    .catch(() => null);

  return loading;
}

/** Reporta un error capturado (error boundaries, trackError). No lanza nunca. */
export function reportClientError(error: unknown, tags?: Record<string, string>): void {
  void loadSentry()
    .then((Sentry) => Sentry?.captureException(error, tags ? { tags } : undefined))
    .catch(() => undefined);
}

/**
 * Engancha los errores globales. El primero descarga el SDK y lo reporta; desde
 * que el SDK está iniciado, sus propios manejadores toman el relevo y estos se
 * apartan para no duplicar.
 */
export function installLazyErrorCapture(): void {
  if (typeof window === "undefined" || !sentryDsn()) return;

  window.addEventListener("error", (event) => {
    if (initialized) return;
    reportClientError(event.error ?? event.message);
  });
  window.addEventListener("unhandledrejection", (event) => {
    if (initialized) return;
    reportClientError(event.reason);
  });
}
