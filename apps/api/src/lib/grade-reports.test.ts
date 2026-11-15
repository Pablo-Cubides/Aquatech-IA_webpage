import { describe, it, expect, vi } from "vitest";
import {
  prepareGradeReports,
  importGradeReports,
  lookupGradeReports,
} from "./grade-reports";
import type { PrismaClient } from "@ia-next/database";
vi.mock("@ia-next/database", () => ({}));
const batch = () => ({
  kind: "colega-grade-reports",
  schemaVersion: 1,
  readyToImport: true,
  period: "2026-3",
  courseId: "course-1",
  courseTitle: "Curso de prueba",
  group: "1",
  university: "Universidad",
  cut: 2,
  privacy: {
    version: 1,
    studentNamesExcluded: true,
    coauthorCodesExcluded: true,
  },
  source: { version: "2", sha256: "a".repeat(64) },
  students: [
    {
      studentCode: "00001234",
      studentName: "NO PUBLICAR",
      courseId: "course-1",
      cuts: { "2": null },
      grades: [
        {
          activityId: "C2-PAR",
          cut: 2,
          kind: "score",
          title: "Parcial",
          grade: 12.3,
          max: 15,
          status: "graded",
          explanationStatus: "matched",
          justification: "Resolución verificada.",
        },
        {
          activityId: "C2-PRO",
          cut: 2,
          kind: "score",
          title: "Proyecto",
          grade: 0,
          max: 5,
          status: "graded",
          explanationStatus: "matched",
          justification: "Cero confirmado.",
        },
        {
          activityId: "C2-ACT",
          cut: 2,
          kind: "score",
          title: "Actividades",
          grade: null,
          max: 5,
          status: "pending",
          explanationStatus: "pending",
          justification: "Falta una actividad.",
        },
      ],
    },
  ],
});
function store() {
  const data = new Map<string, Record<string, unknown>>();
  const gradeReport = {
    findUnique: vi.fn(async ({ where }: { where: unknown }) =>
      data.get(JSON.stringify(where)),
    ),
    upsert: vi.fn(
      async ({
        where,
        create,
        update,
      }: {
        where: unknown;
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }) => {
        data.set(
          JSON.stringify(where),
          data.has(JSON.stringify(where)) ? update : create,
        );
      },
    ),
    update: vi.fn(
      async ({
        where,
        data: update,
      }: {
        where: unknown;
        data: Record<string, unknown>;
      }) => {
        const key = JSON.stringify(where);
        data.set(key, { ...data.get(key), ...update });
      },
    ),
    findMany: vi.fn(async () => [...data.values()]),
  };
  const execute = vi.fn(async (sql: string, value: string) => {
    if (sql.startsWith("INSERT"))
      for (const row of JSON.parse(value))
        data.set(
          JSON.stringify({
            period_courseId_cut_code: {
              period: row.period,
              courseId: row.courseId,
              cut: row.cut,
              code: row.code,
            },
          }),
          row,
        );
    return 0;
  });
  const db = {
    gradeReport,
    $transaction: async (
      fn: (tx: {
        gradeReport: typeof gradeReport;
        $executeRawUnsafe: typeof execute;
      }) => unknown,
    ) => fn({ gradeReport, $executeRawUnsafe: execute }),
  } as unknown as PrismaClient;
  return { db, data, gradeReport };
}
describe("Colega grade reports", () => {
  it("keeps /15, zero, pending and exact code; strips personal fields", () => {
    const row = prepareGradeReports(batch())[0];
    const text = JSON.stringify(row);
    expect(text).not.toContain("NO PUBLICAR");
    expect(row.code).toBe("00001234");
    const payload = row.payload as {
      grades: Array<{ grade: number | null; max: number }>;
    };
    expect(payload.grades.map((g) => g.grade)).toEqual([12.3, 0, null]);
    expect(payload.grades[0].max).toBe(15);
  });
  it("validates the whole batch before writing", async () => {
    const { db, gradeReport } = store();
    const invalid = batch();
    invalid.students[0].grades[0].explanationStatus = "outdated";
    await expect(importGradeReports(db, invalid)).rejects.toThrow();
    expect(gradeReport.upsert).not.toHaveBeenCalled();
  });
  it("rejects duplicate students, activities and wrong cuts", () => {
    const a = batch();
    a.students.push(a.students[0]);
    expect(() => prepareGradeReports(a)).toThrow();
    const b = batch();
    b.students[0].grades.push(b.students[0].grades[0]);
    expect(() => prepareGradeReports(b)).toThrow();
    const c = batch();
    c.students[0].grades[0].cut = 1;
    expect(() => prepareGradeReports(c)).toThrow();
  });
  it("imports idempotently and preserves publication on an identical private import", async () => {
    const { db, data } = store();
    expect((await importGradeReports(db, batch(), true)).changed).toBe(1);
    expect((await importGradeReports(db, batch())).changed).toBe(0);
    expect([...data.values()][0].published).toBe(true);
    expect(data.size).toBe(1);
  });
  it("refuses older versions and resets new content to private", async () => {
    const { db, data } = store();
    await importGradeReports(db, batch(), true);
    const old = batch();
    old.source.version = "1";
    await expect(importGradeReports(db, old)).rejects.toThrow("versión");
    const fresh = batch();
    fresh.source.version = "3";
    fresh.source.sha256 = "b".repeat(64);
    await importGradeReports(db, fresh);
    expect([...data.values()][0].published).toBe(false);
  });
  it("updates a corrected explanation even when the XLSX grade has not changed", async () => {
    const { db, data } = store();
    await importGradeReports(db, batch(), true);
    const corrected = batch();
    corrected.students[0].grades[0].justification =
      "Motivo corregido por el profesor.";
    expect((await importGradeReports(db, corrected)).changed).toBe(1);
    expect([...data.values()][0].published).toBe(false);
  });
  it("queries only the exact published code and selected course", async () => {
    const { db, gradeReport } = store();
    await lookupGradeReports(db, {
      code: "00001234",
      courseId: "course-1",
      period: "2026-3",
    });
    expect(gradeReport.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          code: "00001234",
          published: true,
          courseId: "course-1",
          period: "2026-3",
        },
        select: { payload: true },
      }),
    );
  });
});
