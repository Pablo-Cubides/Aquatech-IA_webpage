import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@ia-next/database";
import {
  authenticateGradeSync,
  parseGradeSyncBatch,
} from "@/lib/grade-sync-auth";
import { importGradeReports, prepareGradeReports } from "@/lib/grade-reports";
import { limitGradeRequest } from "@/lib/grade-request-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const headers = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function POST(request: Request) {
  const body = await request.text();
  if (new TextEncoder().encode(body).length > 3000000)
    return NextResponse.json(
      { error: "Lote demasiado grande." },
      { status: 413, headers },
    );
  if (!authenticateGradeSync(request.headers, body))
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401, headers },
    );
  try {
    const batch = parseGradeSyncBatch(body);
    const limited = await limitGradeRequest(request, "sync", batch.courseId);
    if (!limited.success)
      return NextResponse.json(
        { error: "La sincronización está temporalmente limitada." },
        { status: limited.limit ? 429 : 503, headers },
      );
    const result = await importGradeReports(prisma, batch, true);
    const expected = prepareGradeReports(batch);
    const saved = await prisma.gradeReport.findMany({
      where: {
        period: batch.period,
        courseId: batch.courseId,
        cut: batch.cut,
        code: { in: expected.map((row) => row.code) },
      },
      select: {
        code: true,
        sourceVersion: true,
        sourceSha256: true,
        reportHash: true,
        published: true,
      },
    });
    const byCode = new Map(saved.map((row) => [row.code, row]));
    if (
      saved.length !== expected.length ||
      expected.some((row) => {
        const actual = byCode.get(row.code);
        return (
          !actual?.published ||
          actual.sourceVersion !== row.sourceVersion ||
          actual.sourceSha256 !== row.sourceSha256 ||
          actual.reportHash !== row.reportHash
        );
      })
    )
      throw Error("No se confirmó la lectura posterior.");
    // Bounded opportunistic cleanup; counters never retain student identifiers.
    await prisma.$executeRaw`DELETE FROM grade_request_windows WHERE bucket IN (SELECT bucket FROM grade_request_windows WHERE "expiresAt" < CURRENT_TIMESTAMP LIMIT 500)`;
    return NextResponse.json(
      {
        ok: true,
        ...result,
        verified: true,
        requestHash: createHash("sha256").update(body).digest("hex"),
        courseId: batch.courseId,
        cut: batch.cut,
        period: batch.period,
        source: batch.source,
        reports: saved.map((row) => ({ code: row.code, hash: row.reportHash })),
        at: new Date().toISOString(),
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No se confirmó la sincronización. Revisa el lote y su versión antes de reintentar.",
      },
      { status: 409, headers },
    );
  }
}
