import { createHmac, timingSafeEqual } from "node:crypto";
import { gradeBatchSchema } from "@ia-next/contracts";

const courses = new Set(["ct01111-g1", "ct04024-miercoles", "ct04024-sabado"]);
export const GRADE_SYNC_PATH = "/api/grade-reports/sync";

export function authenticateGradeSync(
  headers: Headers,
  body: string,
  now = Date.now(),
) {
  const secret = process.env.GRADE_SYNC_SECRET;
  const timestamp = headers.get("x-colega-timestamp") ?? "";
  const signature = headers.get("x-colega-signature") ?? "";
  if (
    !secret ||
    secret.length < 43 ||
    !/^\d{13}$/.test(timestamp) ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false;
  if (Math.abs(now - Number(timestamp)) > 300000) return false;
  const expected = createHmac("sha256", secret)
    .update(`POST\n${GRADE_SYNC_PATH}\n${timestamp}\n${body}`)
    .digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export function parseGradeSyncBatch(body: string) {
  const batch = gradeBatchSchema.parse(JSON.parse(body));
  if (
    batch.period !== "2026-3" ||
    batch.cut !== 2 ||
    !courses.has(batch.courseId)
  )
    throw Error("Lote fuera del alcance de Colega.");
  return batch;
}
