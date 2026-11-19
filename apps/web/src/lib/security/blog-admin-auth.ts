import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getAdminSession } from "@/lib/security/admin-session";
import { verifyAgentToken } from "@/lib/security/agent-token";
import { getClientIP, rateLimit } from "@/lib/security/rate-limit";

export type BlogAuthResult =
  | { ok: true; via: "agent" | "session" }
  | { ok: false; response: NextResponse };

/**
 * Autoriza las rutas /api/admin/blog/*: Bearer del agente (BLOG_AGENT_API_KEY)
 * o sesión de ADMIN.
 *
 * - Una petición con cabecera Authorization es un intento de autenticación por
 *   token: se limita por IP (anti fuerza bruta) antes de comparar.
 * - Sin BLOG_AGENT_API_KEY el camino del token falla con 500 y log; no hay
 *   valor por defecto. La sesión de ADMIN sigue funcionando.
 */
export async function authorizeBlogAdmin(req: NextRequest): Promise<BlogAuthResult> {
  const authorization = req.headers.get("authorization");

  if (authorization) {
    const limit = await rateLimit(`admin:blog-agent:${getClientIP(req.headers)}`, {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 60,
      // failureMode "closed" (decisión SEC-001): intentos de autenticación con
      // token de escritura sobre el blog; sin almacén de límites se deniega.
      failureMode: "closed",
    });

    if (!limit.success) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Demasiadas solicitudes" },
          {
            status: limit.reason === "backend-unavailable" ? 503 : 429,
            headers: { "Retry-After": "60" },
          },
        ),
      };
    }

    const result = verifyAgentToken(authorization);

    if (result === "not-configured") {
      logger.error("BLOG_AGENT_API_KEY no está definida: token de agente rechazado");
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Configuración del servidor incompleta" },
          { status: 500 },
        ),
      };
    }

    if (result === "valid") return { ok: true, via: "agent" };
  }

  if (await getAdminSession()) return { ok: true, via: "session" };

  return {
    ok: false,
    response: NextResponse.json(
      { error: "No autorizado. Se requiere token Bearer de agente o sesión de Administrador." },
      { status: 401 },
    ),
  };
}
