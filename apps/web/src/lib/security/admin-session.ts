import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Devuelve la sesión solo si pertenece a un ADMIN; en cualquier otro caso
 * (sin sesión, rol distinto, error al resolverla) devuelve null.
 *
 * El rol sale del JWT firmado por el servidor (ver callbacks.jwt en
 * `@/lib/auth`): nunca de datos enviados por el cliente.
 */
export async function getAdminSession(): Promise<Session | null> {
  try {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "ADMIN" ? session : null;
  } catch {
    return null;
  }
}
