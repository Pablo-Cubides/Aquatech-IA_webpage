import * as Sentry from "@sentry/nextjs";

/** Se ejecuta una vez al arrancar el servidor. Sentry solo se inicializa si hay DSN. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
}

/** Errores de servidor (render, rutas, acciones) que Next captura por su cuenta. */
export const onRequestError = Sentry.captureRequestError;
