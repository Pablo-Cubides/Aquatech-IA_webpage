import { connection } from "next/server";
import type { ReactNode } from "react";

/**
 * SEC-006 (ADR-0017): /auth recibe una CSP con nonce (src/proxy.ts). Un nonce solo puede aplicarse a una
 * página renderizada POR PETICIÓN: el HTML prerenderizado en el build no lo llevaría y sus scripts en línea
 * se bloquearían. `connection()` marca este árbol como dinámico (hoy solo /auth/error era estática).
 */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  await connection();
  return children;
}
