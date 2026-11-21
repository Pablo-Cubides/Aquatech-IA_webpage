/**
 * Constructor único de la Content-Security-Policy (SEC-006, ADR-0017).
 *
 * Es .mjs porque lo importan `next.config.mjs` (política estática de las páginas públicas) y
 * `src/proxy.ts` (política con nonce de /admin y /auth). Un solo constructor: las dos políticas solo
 * difieren en `script-src`.
 *
 *  - Sin `nonce`  => `script-src 'self' 'unsafe-inline'` (páginas públicas, prerenderizadas por el CDN).
 *  - Con `nonce`  => `script-src 'self' 'nonce-…'`, SIN 'unsafe-inline' (páginas de /admin y /auth,
 *    renderizadas por petición). Con nonce, los navegadores con CSP2+ ignoran 'unsafe-inline' aunque
 *    estuviera; aquí además no se escribe.
 *
 * SEC-005b: en producción no hay 'unsafe-eval' (solo el modo desarrollo, para el refresco en caliente)
 * ni scripts de Google Tag Manager / Analytics: ningún código del sitio los inyecta. Si algún día se
 * añade GA, se añade aquí el origen que cargue y se prueba en navegador.
 */

/** Rutas que reciben la CSP con nonce. Debe coincidir con el `matcher` de src/proxy.ts. */
export const NONCE_CSP_PATH = /^\/(?:admin|auth)(?:\/|$)/;

/**
 * Patrón de `source` de `headers()` (path-to-regexp) que cubre TODAS las rutas menos /admin y /auth.
 */
export const STATIC_CSP_SOURCE = "/((?!admin/|admin$|auth/|auth$).*)";

/**
 * @param {{ nonce?: string, isDev?: boolean }} [options]
 * @returns {string}
 */
export function buildContentSecurityPolicy({ nonce, isDev = false } = {}) {
  if (nonce !== undefined && !/^[A-Za-z0-9+/=_-]{16,}$/.test(nonce)) {
    // El nonce se escribe dentro de la cabecera: nunca debe poder traer `;`, comillas ni saltos.
    throw new Error("nonce de CSP inválido");
  }

  const scriptSrc = [
    "script-src 'self'",
    nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const styleSrc = [
    "style-src 'self'",
    "'unsafe-inline'", // Required for Next.js inline styles in all envs
    "https://fonts.googleapis.com",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    [
      // SEC-006: SOLO el mismo origen. El navegador no llama directo a ningun proveedor (SEC-003: OpenAQ,
      // GBIF, WQP, EONET, Hugging Face, arXiv, Supabase, *.vercel.app: todo pasa por /api/* del mismo
      // origen) y tampoco a analitica de terceros: Google Analytics no se carga en ningun sitio (SEC-005b
      // quito su script) y @vercel/analytics envia a /_vercel/insights/* (mismo origen), no a
      // vitals.vercel-insights.com. Un destino de red permitido es un canal por el que un script
      // inyectado puede sacar datos; cada uno que se anada debe tener un uso real y una prueba.
      // Si algun dia se configura el DSN de Sentry en el navegador, habra que decidir entre un tunel
      // (/monitoring) o permitir su host de ingesta: hoy Sentry esta inerte por falta de DSN (ver ADR-0017).
      "connect-src 'self'",
      isDev ? "ws://localhost:*" : "",
      isDev ? "wss://localhost:*" : "",
    ]
      .filter(Boolean)
      .join(" "),
    "frame-src 'self' https://accounts.google.com",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}
