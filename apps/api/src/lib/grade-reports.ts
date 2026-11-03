import { createHash, randomUUID } from "node:crypto";
import { Prisma, PrismaClient } from "@ia-next/database";
import {
  gradeBatchSchema,
  studentGradeReportSchema,
  type StudentGradeReport,
} from "@ia-next/contracts";

export function prepareGradeReports(input: unknown) {
  const batch = gradeBatchSchema.parse(input);
  return batch.students.map((student) => {
    const payload: StudentGradeReport = {
      schemaVersion: 1,
      period: batch.period,
      courseId: batch.courseId,
      courseTitle: batch.courseTitle,
      group: batch.group,
      university: batch.university,
      cut: batch.cut,
      studentCode: student.studentCode,
      grades: student.grades.map((g) => ({
        activityId: g.activityId,
        title: g.title,
        grade: g.grade,
        max: g.max,
        kind: g.kind,
        status: g.status,
        justification: g.justification,
        technicalGrade: g.technicalGrade ?? null,
        latePenalty: g.latePenalty ?? null,
        countsTowardAggregate: g.countsTowardAggregate !== false,
      })),
      cutTotal: student.cuts[String(batch.cut)],
      cutMax: batch.cut === 3 ? 40 : 30,
    };
    return {
      period: batch.period,
      courseId: batch.courseId,
      courseTitle: batch.courseTitle,
      groupLabel: batch.group,
      university: batch.university,
      cut: batch.cut,
      code: student.studentCode,
      sourceVersion: batch.source.version,
      sourceSha256: batch.source.sha256,
      reportHash: createHash("sha256")
        .update(JSON.stringify(payload))
        .digest("hex"),
      payload: payload as unknown as Prisma.InputJsonValue,
    };
  });
}

export async function importGradeReports(
  db: Pick<PrismaClient, "$transaction">,
  input: unknown,
  publish = false,
) {
  const rows = prepareGradeReports(input);
  return db.$transaction(
    async (tx) => {
      const scope = rows[0];
      // Serialize imports for this course/cut. Values remain bound parameters.
      await tx.$executeRawUnsafe(
        "SELECT pg_advisory_xact_lock(hashtext($1))",
        `${scope.period}:${scope.courseId}:${scope.cut}`,
      );
      const existing = await tx.gradeReport.findMany({
        where: {
          period: scope.period,
          courseId: scope.courseId,
          cut: scope.cut,
        },
        select: {
          id: true,
          code: true,
          sourceVersion: true,
          sourceSha256: true,
          reportHash: true,
          published: true,
        },
      });
      const byCode = new Map(existing.map((row) => [row.code, row]));
      const writes: Array<
        (typeof rows)[number] & { id: string; published: boolean }
      > = [];
      let changed = 0;
      let published = 0;
      for (const row of rows) {
        const old = byCode.get(row.code);
        if (old && BigInt(old.sourceVersion) > BigInt(row.sourceVersion))
          throw Error(
            "La base contiene una versión más reciente. Exporta de nuevo desde Colega.",
          );
        if (
          old?.sourceVersion === row.sourceVersion &&
          old.sourceSha256 !== row.sourceSha256
        )
          throw Error(
            "La misma versión contiene archivos distintos. Revisa la exportación.",
          );
        const same =
          old?.sourceVersion === row.sourceVersion &&
          old.reportHash === row.reportHash;
        if (same && (!publish || old.published)) continue;
        writes.push({
          ...row,
          id: old?.id ?? randomUUID(),
          published: publish,
        });
        if (!same) changed++;
        if (publish) published++;
      }
      if (writes.length) {
        // Static SQL + one JSON parameter avoids per-student network round trips.
        // No request data is interpolated into SQL, identifiers or clauses.
        await tx.$executeRawUnsafe(
          `INSERT INTO "grade_reports" ("id","period","courseId","courseTitle","groupLabel","university","cut","code","sourceVersion","sourceSha256","reportHash","payload","published","createdAt","updatedAt")
        SELECT x.id,x.period,x."courseId",x."courseTitle",x."groupLabel",x.university,x.cut,x.code,x."sourceVersion",x."sourceSha256",x."reportHash",x.payload,x.published,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
        FROM jsonb_to_recordset($1::jsonb) AS x(id text,period text,"courseId" text,"courseTitle" text,"groupLabel" text,university text,cut int,code text,"sourceVersion" text,"sourceSha256" text,"reportHash" text,payload jsonb,published boolean)
        ON CONFLICT ("period","courseId","cut","code") DO UPDATE SET "courseTitle"=EXCLUDED."courseTitle","groupLabel"=EXCLUDED."groupLabel","university"=EXCLUDED."university","sourceVersion"=EXCLUDED."sourceVersion","sourceSha256"=EXCLUDED."sourceSha256","reportHash"=EXCLUDED."reportHash","payload"=EXCLUDED."payload","published"=EXCLUDED."published","updatedAt"=CURRENT_TIMESTAMP`,
          JSON.stringify(writes),
        );
      }
      return { students: rows.length, changed, published, private: !publish };
    },
    { isolationLevel: "Serializable", maxWait: 10000, timeout: 30000 },
  );
}

export async function lookupGradeReports(
  db: Pick<PrismaClient, "gradeReport">,
  input: {
    code: string;
    courseId?: string;
    courseTitle?: string;
    period?: string;
    group?: string;
    cut?: number;
  },
) {
  const rows = await db.gradeReport.findMany({
    where: {
      code: input.code,
      published: true,
      ...(input.courseId ? { courseId: input.courseId } : {}),
      ...(input.courseTitle ? { courseTitle: input.courseTitle } : {}),
      ...(input.period ? { period: input.period } : {}),
      ...(input.group ? { groupLabel: input.group } : {}),
      ...(input.cut !== undefined ? { cut: input.cut } : {}),
    },
    select: { payload: true },
    orderBy: [{ period: "desc" }, { courseId: "asc" }, { cut: "asc" }],
  });
  return {
    found: rows.length > 0,
    reports: rows.map((row) => {
      const report = studentGradeReportSchema.parse(row.payload);
      if (report.studentCode !== input.code)
        throw Error("El código del registro no coincide.");
      return report;
    }),
  };
}

