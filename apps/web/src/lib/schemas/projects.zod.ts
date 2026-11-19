import { z } from "zod";

/** Id de proyecto: slug corto (p. ej. "coag-moringa"). */
export const projectIdSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[A-Za-z0-9_-]+$/, "Id inválido");

export const projectEstadoSchema = z.enum([
  "bloqueado",
  "abierto",
  "en_desarrollo",
  "completado",
]);

const shortText = (max: number) => z.string().max(max);
const textList = (maxItems: number, maxLength: number) =>
  z.array(shortText(maxLength)).max(maxItems);

/**
 * Cuerpo de creación/edición. Las claves desconocidas se descartan (strip), de
 * modo que el cuerpo del cliente no puede inyectar campos arbitrarios en el
 * almacén.
 */
export const projectBodySchema = z.object({
  id: projectIdSchema.optional(),
  titulo: z.string().trim().min(1).max(200),
  linea: shortText(100).optional(),
  familia: z.enum(["A", "B", "C"]).optional(),
  resumen: shortText(4000).optional(),
  que_lograras: shortText(4000).optional(),
  por_que_importa: shortText(4000).optional(),
  objetivos: textList(50, 1000).optional(),
  plan_trabajo: textList(50, 1000).optional(),
  entregable: shortText(500).optional(),
  nivel: z.enum(["introductorio", "intermedio", "avanzado"]).optional(),
  prerrequisitos: shortText(2000).optional(),
  estado: projectEstadoSchema.optional(),
  fecha_apertura: shortText(40).nullable().optional(),
  fecha_estado: shortText(40).nullable().optional(),
  estudiante: shortText(200).nullable().optional(),
  desbloquea: z.array(projectIdSchema).max(50).optional(),
  complementa: z.array(projectIdSchema).max(50).optional(),
  notas_admin: shortText(4000).nullable().optional(),
});

export const projectUpdateBodySchema = z.union([
  z.object({
    action: z.literal("updateStatus"),
    estado: projectEstadoSchema,
    estudiante: shortText(200).nullable().optional(),
    notas_admin: shortText(4000).nullable().optional(),
  }),
  projectBodySchema.partial().extend({ action: z.undefined().optional() }),
]);

export const projectsQuerySchema = z.object({
  publicOnly: z.enum(["true", "false"]).optional(),
  linea: z.string().max(100).optional(),
});

export type ProjectBody = z.infer<typeof projectBodySchema>;
