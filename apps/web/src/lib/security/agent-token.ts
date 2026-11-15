import { createHash, timingSafeEqual } from "node:crypto";

export type AgentTokenResult = "valid" | "invalid" | "not-configured";

const BEARER_PATTERN = /^Bearer\s+(\S+)\s*$/i;

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/**
 * Comprueba una cabecera `Authorization: Bearer <token>` contra el secreto del
 * agente de blog (BLOG_AGENT_API_KEY).
 *
 * - No existe ningún valor por defecto: sin variable definida devuelve
 *   "not-configured" y el llamador debe responder 500 y registrar el error.
 * - La comparación es en tiempo constante (se comparan digests SHA-256 del
 *   mismo largo, así tampoco se filtra la longitud del secreto).
 */
export function verifyAgentToken(
  authorizationHeader: string | null,
  expected: string | undefined = process.env.BLOG_AGENT_API_KEY,
): AgentTokenResult {
  if (!expected) return "not-configured";

  const match = authorizationHeader ? BEARER_PATTERN.exec(authorizationHeader) : null;
  if (!match) return "invalid";

  return timingSafeEqual(digest(match[1]), digest(expected)) ? "valid" : "invalid";
}
