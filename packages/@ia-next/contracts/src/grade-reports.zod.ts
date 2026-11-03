import { z } from "zod";

const gradeSchema = z
  .object({
    activityId: z.string().min(1).max(90),
    title: z.string().min(1).max(300),
    cut: z.number().int().min(1).max(3),
    kind: z.enum(["score", "detail", "input"]),
    grade: z.number().finite().nonnegative().nullable(),
    max: z.number().finite().positive().max(100).nullable(),
    status: z.enum(["graded", "pending"]),
    explanationStatus: z.enum(["matched", "missing", "outdated", "pending"]),
    justification: z.string().min(1).max(12000),
    technicalGrade: z.number().finite().nullable().optional(),
    latePenalty: z.number().finite().nonnegative().nullable().optional(),
    countsTowardAggregate: z.boolean().optional(),
  })
  .superRefine((g, ctx) => {
    if (
      g.grade !== null &&
      (g.explanationStatus !== "matched" || (g.max !== null && g.grade > g.max))
    )
      ctx.addIssue({
        code: "custom",
        message: "Nota fuera de escala o justificación no vigente.",
      });
    if ((g.grade === null) !== (g.status === "pending"))
      ctx.addIssue({
        code: "custom",
        message: "El estado no coincide con la nota.",
      });
  });
export const gradeBatchSchema = z
  .object({
    kind: z.literal("colega-grade-reports"),
    schemaVersion: z.literal(1),
    readyToImport: z.literal(true),
    period: z.string().regex(/^\d{4}-\d+$/),
    courseId: z.string().regex(/^[\w-]{1,90}$/),
    courseTitle: z.string().min(1).max(200),
    group: z.string().max(80),
    university: z.string().min(1).max(200),
    cut: z.number().int().min(1).max(3),
    privacy: z.object({
      version: z.literal(1),
      studentNamesExcluded: z.literal(true),
      coauthorCodesExcluded: z.literal(true),
    }),
    source: z.object({
      version: z.string().regex(/^\d+$/),
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
    }),
    students: z
      .array(
        z.object({
          studentCode: z.string().regex(/^\d{4,20}$/),
          courseId: z.string(),
          grades: z.array(gradeSchema).min(1).max(100),
          cuts: z.record(z.string(), z.number().finite().nullable()),
        }),
      )
      .min(1)
      .max(1000),
  })
  .superRefine((batch, ctx) => {
    const codes = new Set<string>();
    for (const student of batch.students) {
      if (codes.has(student.studentCode) || student.courseId !== batch.courseId)
        ctx.addIssue({
          code: "custom",
          message: "Estudiante duplicado o curso incorrecto.",
        });
      codes.add(student.studentCode);
      const ids = new Set<string>();
      for (const grade of student.grades) {
        if (ids.has(grade.activityId) || grade.cut !== batch.cut)
          ctx.addIssue({
            code: "custom",
            message: "Actividad duplicada o corte incorrecto.",
          });
        ids.add(grade.activityId);
      }
      const total = student.cuts[String(batch.cut)];
      if (
        total !== null &&
        (total === undefined ||
          total < 0 ||
          total > (batch.cut === 3 ? 40 : 30))
      )
        ctx.addIssue({
          code: "custom",
          message: "Total de corte fuera de escala.",
        });
    }
  });
export type GradeBatch = z.infer<typeof gradeBatchSchema>;
export const publicGradeRowSchema = z.object({
  activityId: z.string(),
  title: z.string(),
  grade: z.number().nullable(),
  max: z.number().nullable(),
  kind: z.enum(["score", "detail", "input"]),
  status: z.enum(["graded", "pending"]),
  justification: z.string(),
  technicalGrade: z.number().nullable(),
  latePenalty: z.number().nullable(),
  countsTowardAggregate: z.boolean(),
});
export const studentGradeReportSchema = z.object({
  schemaVersion: z.literal(1),
  period: z.string(),
  courseId: z.string(),
  courseTitle: z.string(),
  group: z.string(),
  university: z.string(),
  cut: z.number(),
  studentCode: z.string(),
  grades: z.array(publicGradeRowSchema),
  cutTotal: z.number().nullable(),
  cutMax: z.number(),
});
export const gradeCourseSchema = z.object({
  period: z.string(),
  courseId: z.string(),
  courseTitle: z.string(),
  groupLabel: z.string(),
  university: z.string(),
  cut: z.number(),
});
export type GradeRow = z.infer<typeof publicGradeRowSchema>;
export type StudentGradeReport = z.infer<typeof studentGradeReportSchema>;
export type GradeCourse = z.infer<typeof gradeCourseSchema>;
export const gradeLookupSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{4,20}$/, "Ingresa tu código completo."),
  courseId: z
    .string()
    .regex(/^[\w-]{1,90}$/)
    .optional(),
  courseTitle: z.string().min(1).max(200).optional(),
  period: z
    .string()
    .regex(/^\d{4}-\d+$/)
    .optional(),
  group: z.string().min(1).max(80).optional(),
  cut: z.number().int().min(1).max(3).optional(),
});

