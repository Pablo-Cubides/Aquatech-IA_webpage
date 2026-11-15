import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  authenticateGradeSync,
  GRADE_SYNC_PATH,
  parseGradeSyncBatch,
} from "./grade-sync-auth";
const secret = "s".repeat(43),
  now = 1793660000000;
function signed(body: string, timestamp = String(now)) {
  return new Headers({
    "x-colega-timestamp": timestamp,
    "x-colega-signature": createHmac("sha256", secret)
      .update(`POST\n${GRADE_SYNC_PATH}\n${timestamp}\n${body}`)
      .digest("hex"),
  });
}
afterEach(() => vi.unstubAllEnvs());
describe("scoped Colega authentication", () => {
  it("accepts the exact signed body with a current timestamp", () => {
    vi.stubEnv("GRADE_SYNC_SECRET", secret);
    expect(authenticateGradeSync(signed("{}"), "{}", now)).toBe(true);
  });
  it("rejects tampering, expired requests and missing configuration", () => {
    vi.stubEnv("GRADE_SYNC_SECRET", secret);
    expect(authenticateGradeSync(signed("{}"), '{"changed":true}', now)).toBe(
      false,
    );
    expect(
      authenticateGradeSync(signed("{}", String(now - 300001)), "{}", now),
    ).toBe(false);
    vi.stubEnv("GRADE_SYNC_SECRET", "");
    expect(authenticateGradeSync(signed("{}"), "{}", now)).toBe(false);
  });
  it("rejects malformed signatures without throwing", () => {
    vi.stubEnv("GRADE_SYNC_SECRET", secret);
    expect(
      authenticateGradeSync(
        new Headers({
          "x-colega-timestamp": String(now),
          "x-colega-signature": "xyz",
        }),
        "{}",
        now,
      ),
    ).toBe(false);
  });
  it("rejects a different course even when its batch is structurally valid", () => {
    const batch = {
      kind: "colega-grade-reports",
      schemaVersion: 1,
      readyToImport: true,
      period: "2026-3",
      courseId: "other-course",
      courseTitle: "Fixture",
      group: "1",
      university: "Fixture",
      cut: 2,
      privacy: {
        version: 1,
        studentNamesExcluded: true,
        coauthorCodesExcluded: true,
      },
      source: { version: "1", sha256: "a".repeat(64) },
      students: [
        {
          studentCode: "00001234",
          courseId: "other-course",
          cuts: { "2": null, "3": null },
          grades: [
            {
              activityId: "test",
              title: "Fixture",
              cut: 2,
              kind: "score",
              grade: null,
              max: 5,
              status: "pending",
              explanationStatus: "pending",
              justification: "Pendiente.",
            },
          ],
        },
      ],
    };
    expect(() => parseGradeSyncBatch(JSON.stringify(batch))).toThrow("alcance");
    batch.courseId = "ct01111-g1";
    batch.students[0].courseId = batch.courseId;
    expect(parseGradeSyncBatch(JSON.stringify(batch)).courseId).toBe(
      batch.courseId,
    );
    batch.cut = 3;
    batch.students[0].grades[0].cut = 3;
    expect(() => parseGradeSyncBatch(JSON.stringify(batch))).toThrow("alcance");
  });
});
