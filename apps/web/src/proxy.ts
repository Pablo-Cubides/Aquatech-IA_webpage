import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NONCE_CSP_PATH, buildContentSecurityPolicy } from "@/lib/security/csp.mjs";

// La CSP de las paginas PUBLICAS y las cabeceras de seguridad viven en next.config.mjs (headers()):
// aplicarlas por configuracion no ejecuta codigo en cada visita. Este proxy atiende CORS y OPTIONS de
// /api/*, y (SEC-006, ADR-0017) genera la CSP con NONCE de /admin y /auth, unicas rutas en las que corre
// para paginas: poner el nonce en todo el sitio obligaria a renderizar por peticion 88 paginas
// publicas hoy servidas por el CDN.

/** Nonce criptografico por peticion (128 bits), en base64. */
function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

function withNonceCsp(request: NextRequest): NextResponse {
  const nonce = createNonce();
  const policy = buildContentSecurityPolicy({ nonce, isDev: process.env.NODE_ENV === "development" });

  // Next lee el nonce de la CSP de la PETICION y lo aplica a sus scripts en linea y de arranque.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export function proxy(request: NextRequest) {
  if (NONCE_CSP_PATH.test(request.nextUrl.pathname)) return withNonceCsp(request);

  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com",
      ...(process.env.NODE_ENV === "development"
        ? ["http://localhost:3000", "http://localhost:3001"]
        : []),
    ];

    const origin = request.headers.get("origin");

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );
    }
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  // /api para CORS; /admin y /auth para la CSP con nonce (mantener alineado con NONCE_CSP_PATH).
  matcher: ["/api/:path*", "/admin/:path*", "/auth/:path*"],
};
