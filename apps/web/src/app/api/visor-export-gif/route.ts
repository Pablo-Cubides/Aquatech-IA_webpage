import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { guardPublicProxy } from "@/lib/security/public-proxy";

// SEC-003: `case_id` se interpolaba sin validar en `Content-Disposition` (comillas y saltos de
// línea permitían inyectar cabeceras o romper el nombre) y en los logs. Ahora solo admite el
// formato de los identificadores de caso y el nombre de archivo se deriva de ese valor ya validado.
// El cliente envía además parámetros de render que este placeholder no usa: se aceptan acotados.
const querySchema = z.strictObject({
  case_id: z.string().regex(/^[A-Za-z0-9.-]{1,40}$/, "case_id inválido"),
  include_noise: z.enum(["true", "false"]).optional(),
  overlay_opacity: z.string().regex(/^\d(\.\d{1,3})?$/).optional(),
  frame_ms: z.string().regex(/^\d{1,5}$/).optional(),
  linger_last_ms: z.string().regex(/^\d{1,5}$/).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await guardPublicProxy(request, {
    name: "visor:export-gif",
    schema: querySchema,
    perMinutePerIp: 30,
    limiter: "memory",
  });
  if (!guard.ok) return guard.response;
  const caseId = guard.query.case_id;

  // For now, return a simple placeholder GIF
  // In production, you would generate an actual GIF from the step images
  // This is a minimal 1x1 transparent PNG converted to GIF format
  const placeholderGif = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
    0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x0a,
    0x00, 0x01, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
    0x00, 0x02, 0x02, 0x4c, 0x01, 0x00, 0x3b,
  ]);

  return new NextResponse(placeholderGif, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Disposition": `attachment; filename="diffusion_${caseId}.gif"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
