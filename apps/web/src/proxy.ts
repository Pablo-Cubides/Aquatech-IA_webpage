import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CSP y cabeceras de seguridad de pagina viven en next.config.mjs (headers()):
// aplicarlas por configuracion no ejecuta codigo en cada visita. Este proxy solo
// atiende CORS y OPTIONS de /api/*.
export function proxy(request: NextRequest) {
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
  matcher: ["/api/:path*"],
};
