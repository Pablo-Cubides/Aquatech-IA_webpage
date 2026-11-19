import { getServerSession, type Session } from "next-auth";
import { prisma } from "@ia-next/database";
import { authOptions } from "@/lib/auth";

/**
 * ¿Es este usuario ADMIN ahora mismo? Lee el rol de la BASE DE DATOS, no del JWT.
 *
 * Por qué (SEC-004): el JWT se firma al iniciar sesión y vive `session.maxAge`. Si el rol se
 * leyera de ahí, un ADMIN degradado (o con la cuenta borrada) conservaría sus privilegios hasta que
 * el token expirara. Releer el rol en cada acción de administrador —pocas y poco frecuentes— hace
 * que la degradación surta efecto de inmediato.
 *
 * Criterio de fallo (SEC-001, "fallar cerrado donde el fallo niega un privilegio"): si la base de
 * datos no responde o el usuario no existe, NO es administrador. Esta función nunca lanza.
 */
export async function isAdminInDatabase(userId: string | undefined | null): Promise<boolean> {
  if (!userId) return false;
  try {
    const record = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return record?.role === "ADMIN";
  } catch {
    return false;
  }
}

/**
 * Devuelve la sesión solo si pertenece a un ADMIN según la base de datos; en cualquier otro caso
 * (sin sesión, rol distinto, usuario borrado, error al resolverla o al consultar la base) devuelve
 * null. El rol de la sesión devuelta es el de la base, no el del token.
 */
export async function getAdminSession(): Promise<Session | null> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!session || !(await isAdminInDatabase(userId))) return null;
    return { ...session, user: { ...session.user, role: "ADMIN" } };
  } catch {
    return null;
  }
}
