import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const isDev = process.env.NODE_ENV === "development";

  // Next.js requires 'unsafe-inline' and 'unsafe-eval' for its runtime
  // (SSR hydration, Turbopack chunks, React event handlers).
  // Without these, ALL JavaScript is blocked by the browser in production.
  const scriptSrc = [
    "script-src 'self'",
    "'unsafe-inline'", // Required for Next.js runtime scripts in all envs
    "'unsafe-eval'",   // Required for Turbopack/SSR hydration
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
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

  const contentSecurityPolicy = [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    [
      "connect-src 'self'",
      "https://www.google-analytics.com",
      "https://vitals.vercel-insights.com",
      "https://*.supabase.co",
      "https://*.vercel.app",
      "https://api.openaq.org",
      "https://api.gbif.org",
      "https://www.waterqualitydata.us",
      "https://eonet.gsfc.nasa.gov",
      "https://huggingface.co",
      "https://arxiv.org",
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

  const securityHeaders = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": contentSecurityPolicy,
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
