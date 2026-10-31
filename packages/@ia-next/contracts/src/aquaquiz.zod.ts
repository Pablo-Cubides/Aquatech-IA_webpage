import { z } from "zod";

export const aquaQuizStudentCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(32)
  .regex(/^[\p{L}\p{N}._-]+$/u)
  .transform((value) => value.toLocaleUpperCase("es-CO"));

export const aquaQuizNicknameSchema = z
  .string()
  .trim()
  .min(2)
  .max(24)
  .refine((value) => !/[\p{Cc}\p{Cf}]/u.test(value));

export const aquaQuizQuestionInputSchema = z
  .object({
    kind: z.enum(["SINGLE_CHOICE", "TRUE_FALSE"]).default("SINGLE_CHOICE"),
    topic: z.string().trim().max(80).default(""),
    difficulty: z
      .enum(["INTRODUCTORY", "INTERMEDIATE", "ADVANCED"])
      .default("INTERMEDIATE"),
    prompt: z.string().trim().min(4).max(500),
    options: z.array(z.string().trim().min(1).max(140)).min(2).max(4),
    correctOptionIndex: z.number().int().min(0).max(3),
    explanation: z.string().trim().max(1000).default(""),
    seconds: z.number().int().min(10).max(180).default(30),
  })
  .superRefine((question, context) => {
    if (question.correctOptionIndex >= question.options.length) {
      context.addIssue({
        code: "custom",
        path: ["correctOptionIndex"],
        message:
          "La respuesta correcta debe corresponder a una opción existente.",
      });
    }

    if (
      new Set(
        question.options.map((option) => option.toLocaleLowerCase("es-CO")),
      ).size !== question.options.length
    ) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Cada opción debe ser diferente.",
      });
    }

    if (question.kind === "TRUE_FALSE" && question.options.length !== 2) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Verdadero o falso requiere exactamente dos opciones.",
      });
    }
  });

export const aquaQuizCourseCreateSchema = z.object({
  title: z.string().trim().min(3).max(120),
  groupName: z.string().trim().min(1).max(80).default("General"),
});

export const aquaQuizEnrollmentListSchema = z.object({
  codes: z.array(aquaQuizStudentCodeSchema).min(1).max(300),
});

export const aquaQuizMeetingCreateSchema = z.object({
  classDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  classStartTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .default(null),
  lateAfterMinutes: z.number().int().min(0).max(240).nullable().default(null),
});

export const aquaQuizSetCreateSchema = z.object({
  title: z.string().trim().min(3).max(160),
  questions: z.array(aquaQuizQuestionInputSchema).min(1).max(100),
});

export const aquaQuizJoinSchema = z.object({
  pin: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
  studentCode: aquaQuizStudentCodeSchema,
  nickname: aquaQuizNicknameSchema,
  mode: z.enum(["account", "guest"]),
});

export const aquaQuizAnswerSchema = z.object({
  optionIndex: z.number().int().min(0).max(3),
  requestId: z.string().uuid(),
});

export const aquaQuizActionSchema = z.object({
  action: z.enum(["start", "reveal", "next", "finish"]),
  expectedVersion: z.number().int().nonnegative(),
});

export const aquaQuizAttendanceUpdateSchema = z.object({
  nickname: aquaQuizNicknameSchema.optional(),
  status: z.enum(["PRESENT", "LATE", "EXCUSED"]).optional(),
  studentCode: aquaQuizStudentCodeSchema.optional(),
  reason: z.string().trim().min(5).max(500),
});

export const aquaQuizManualAttendanceSchema = z.object({
  studentCode: aquaQuizStudentCodeSchema,
  nickname: aquaQuizNicknameSchema,
  status: z.enum(["PRESENT", "LATE", "EXCUSED"]),
  reason: z.string().trim().min(5).max(500),
});

export type AquaQuizCourseCreate = z.infer<typeof aquaQuizCourseCreateSchema>;
export type AquaQuizQuestionInput = z.infer<typeof aquaQuizQuestionInputSchema>;
export type AquaQuizSetCreate = z.infer<typeof aquaQuizSetCreateSchema>;
