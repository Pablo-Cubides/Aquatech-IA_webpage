import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@ia-next/database";
import { authOptions } from "@/lib/auth";
import { getClientIP, rateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4 * 1024;
const MAX_USER_AGENT_LENGTH = 200;

const eventDataValue = z.union([
  z.string().max(200),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

/**
 * Esquema cerrado: solo estos campos; eventData es un objeto PLANO de valores
 * primitivos (sin anidación) con un máximo de 20 claves, y el cuerpo entero no
 * puede superar 4 KB. No hay campos de identidad: ni correo ni IP.
 */
const eventSchema = z
  .object({
    tool: z.string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/),
    eventName: z.string().regex(/^[A-Za-z][A-Za-z0-9_.:-]{0,63}$/),
    eventData: z
      .record(z.string().regex(/^[A-Za-z0-9_.:-]{1,64}$/), eventDataValue)
      .refine((value) => Object.keys(value).length <= 20, "demasiadas claves")
      .optional(),
  })
  .strict();

async function cleanupOldAnalytics() {
  try {
    // OPS-001: 400 días (13 meses) para poder comparar mes contra mes y medir quién
    // repite. Los eventos no llevan datos personales (ver docs/medicion-uso-herramientas.md).
    const retentionPeriod = new Date();
    retentionPeriod.setDate(retentionPeriod.getDate() - 400);

    await prisma.toolAnalytics.deleteMany({
      where: {
        createdAt: {
          lt: retentionPeriod,
        },
      },
    });
  } catch (error) {
    console.error("Failed to cleanup old analytics:", error);
    Sentry.captureException(error, {
      tags: { task: "analytics_cleanup" },
    });
  }
}

/**
 * POST: acepta eventos de uso, incluso anónimos (la medición por herramienta es
 * el objetivo). Datos personales: NO se guarda el correo (solo el id opaco de
 * usuario si hay sesión), NO se guarda la IP (solo se usa para el límite de tasa)
 * y el user-agent se trunca.
 */
export async function POST(request: NextRequest) {
  try {
    // failureMode "closed" (por defecto): escritura anónima en base de datos. Si
    // el almacén de límites no está disponible, se descartan los eventos antes
    // que dejar la tabla sin protección.
    const limit = await rateLimit(`analytics:${getClientIP(request.headers)}`, {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 60,
      failureMode: "closed",
    });

    if (!limit.success) {
      const unavailable = limit.reason === "backend-unavailable";
      return NextResponse.json(
        { error: unavailable ? "Servicio no disponible" : "Demasiadas solicitudes" },
        { status: unavailable ? 503 : 429, headers: { "Retry-After": "60" } },
      );
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let json: unknown;
    try {
      json = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = eventSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid event: expected { tool, eventName, eventData? }" },
        { status: 400 },
      );
    }

    const { tool, eventName, eventData } = parsed.data;
    const session = await getServerSession(authOptions);
    // País (ISO-3166 alfa-2) de la cabecera de Vercel; no es dato personal. Lo fija
    // el servidor: sobrescribe cualquier `country` que mande el cliente.
    const countryHeader = request.headers.get("x-vercel-ip-country");
    const country = countryHeader && /^[A-Za-z]{2}$/.test(countryHeader)
      ? countryHeader.toUpperCase()
      : "XX";

    const analyticsRecord = await prisma.toolAnalytics.create({
      data: {
        eventName,
        tool,
        eventData: { ...(eventData ?? {}), country },
        userId: session?.user?.id ?? null,
        userAgent: request.headers.get("user-agent")?.slice(0, MAX_USER_AGENT_LENGTH) ?? null,
        ipAddress: null,
      },
    });

    // Probabilistic cleanup (1% chance) to avoid running on every request
    if (Math.random() < 0.01) {
      // Fire and forget - don't await to avoid slowing down the response
      cleanupOldAnalytics();
    }

    return NextResponse.json({
      success: true,
      message: "Event logged successfully",
      eventId: analyticsRecord.id,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/tools/analytics" },
    });

    console.error("Analytics endpoint error:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}

/** GET: estadísticas agregadas. Solo ADMIN (son métricas internas del negocio). */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      // No confirmar que la ruta existe para usuarios sin rol de administrador.
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentEvents, uniqueUsersCount] = await Promise.all([
      prisma.toolAnalytics.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.toolAnalytics.groupBy({
        by: ["userId"],
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
          userId: {
            not: null,
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        message: "Analytics data retrieved successfully",
        recentEvents,
        uniqueUsers: uniqueUsersCount.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/tools/analytics", method: "GET" },
    });

    return NextResponse.json(
      { error: "Failed to retrieve analytics" },
      { status: 500 },
    );
  }
}
