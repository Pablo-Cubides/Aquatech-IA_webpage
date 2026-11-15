import { createHmac } from "node:crypto";
import { prisma } from "@ia-next/database";
import { checkRateLimit, getClientIP } from "./rate-limit";

export async function limitGradeRequest(
  request: Request,
  scope: "lookup" | "catalog" | "import" | "sync",
  identity = "",
) {
  const identifier = `grade:${scope}:${identity || getClientIP(request)}`;
  if (process.env.GRADE_RATE_LIMIT_BACKEND !== "postgres")
    return checkRateLimit(scope === "catalog" ? "api" : "grade", identifier);
  try {
    const secret = process.env.GRADE_SYNC_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) throw Error("Falta configuración del limitador.");
    const bucket = createHmac("sha256", secret)
      .update(identifier)
      .digest("hex");
    const limit = scope === "lookup" ? 10 : scope === "catalog" ? 100 : 30;
    const rows = await prisma.$queryRaw<Array<{ hits: number; reset: Date }>>`
      INSERT INTO grade_request_windows (bucket, "windowStart", hits, "expiresAt")
      VALUES (${bucket}, date_trunc('minute', CURRENT_TIMESTAMP), 1, CURRENT_TIMESTAMP + interval '2 minutes')
      ON CONFLICT (bucket) DO UPDATE SET
        hits = CASE WHEN grade_request_windows."windowStart" = EXCLUDED."windowStart"
          THEN LEAST(grade_request_windows.hits + 1, ${limit + 1}) ELSE 1 END,
        "windowStart" = EXCLUDED."windowStart", "expiresAt" = EXCLUDED."expiresAt"
      RETURNING hits, "windowStart" + interval '1 minute' AS reset`;
    const row = rows[0];
    if (!row) throw Error("No se confirmó el contador.");
    return {
      success: row.hits <= limit,
      limit,
      remaining: Math.max(0, limit - row.hits),
      reset: row.reset,
    };
  } catch {
    return { success: false, limit: 0, remaining: 0, reset: new Date() };
  }
}
