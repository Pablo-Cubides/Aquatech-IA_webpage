import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { getClientIP, rateLimitByIP } from "@/lib/security/rate-limit";

const bodySchema = z.object({ password: z.string().min(1).max(256) }).strict();

function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(digest(a), digest(b));
}

/**
 * Compuerta de la UI de administración de proyectos. NO emite sesión ni token:
 * el acceso real a escritura en /api/projects exige sesión de ADMIN. Se conserva
 * solo para la pantalla existente; sin ADMIN_PASSWORD definida falla (500).
 */
export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    logger.error("ADMIN_PASSWORD no está definida: /api/projects/auth deshabilitada");
    return NextResponse.json(
      { error: "Configuración del servidor incompleta" },
      { status: 500 },
    );
  }

  const limit = await rateLimitByIP(getClientIP(req.headers), {
    interval: 15 * 60 * 1000,
    uniqueTokenPerInterval: 10,
    failureMode: "closed", // intentos de contraseña: sin almacén se deniega
  });

  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Demasiados intentos. Intenta nuevamente más tarde." },
      { status: 429 },
    );
  }

  const rawBody: unknown = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (safeEqual(parsed.data.password, adminPassword)) {
    return NextResponse.json({ success: true, message: "Acceso concedido" });
  }

  return NextResponse.json(
    { success: false, error: "Credenciales inválidas" },
    { status: 401 },
  );
}
