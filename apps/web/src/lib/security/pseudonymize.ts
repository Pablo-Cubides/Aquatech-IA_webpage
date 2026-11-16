import { createHmac } from "node:crypto";

/**
 * Seudónimo estable de un usuario para analítica (SEC-002).
 *
 * HMAC-SHA256 con una subclave derivada de NEXTAUTH_SECRET y separación de dominio: permite contar
 * usuarios únicos y quién repite sin guardar el id real, de modo que la tabla de analítica no se
 * puede unir con la de usuarios sin conocer el secreto. Sigue siendo reversible POR EL SERVIDOR
 * (se puede recalcular el seudónimo de un usuario para atender una solicitud de borrado).
 * Sin secreto devuelve null: el evento se guarda sin identificador en lugar de fallar.
 */
export function pseudonymizeUserId(userId: string): string | null {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) return null;
  const key = createHmac("sha256", secret).update("analytics:v1").digest();
  return createHmac("sha256", key).update(userId).digest("hex").slice(0, 32);
}
