import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@ia-next/database";
import bcrypt from "bcryptjs";
import { getClientIP, rateLimit } from "@/lib/security/rate-limit";

type DbUserWithPassword = {
  password?: string | null;
  role?: string | null;
};

/** Mensaje único para cualquier fallo de credenciales (no enumera usuarios). */
export const INVALID_CREDENTIALS_MESSAGE = "Credenciales inválidas";

/**
 * Hash bcrypt de un valor aleatorio sin significado. Se compara cuando el
 * usuario no existe para que el tiempo de respuesta no delate si el correo
 * está registrado.
 */
const DUMMY_PASSWORD_HASH =
  "$2b$10$QyLOe5FKWl3cDAqncLS5m.WMJoz5OSPh4/JvAlgtG3trywzlyDuZS";

/** Mensaje al superar el límite de intentos de inicio de sesión (no depende de si el correo existe). */
export const TOO_MANY_ATTEMPTS_MESSAGE = "Demasiados intentos. Inténtalo de nuevo más tarde.";

// Límites de inicio de sesión (SEC-002). La ventana es fija: en el borde de la ventana caben hasta
// 2x el límite en ráfaga, por eso los límites son bajos. Se cuentan TODOS los intentos (existan o no
// el usuario) para no revelar si un correo está registrado. failureMode "closed": sin almacén no se
// permite probar contraseñas sin límite (el almacén es la propia base de datos de la que depende el login).
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_PER_ACCOUNT_AND_IP = 6;
const LOGIN_MAX_PER_IP = 30;

const MAX_PROFILE_NAME_LENGTH = 100;
const MAX_PROFILE_IMAGE_LENGTH = 2048;

function sanitizeProfileName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim();
  return name && name.length <= MAX_PROFILE_NAME_LENGTH ? name : null;
}

function sanitizeProfileImage(value: unknown): string | null {
  if (typeof value !== "string" || value.length > MAX_PROFILE_IMAGE_LENGTH) {
    return null;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "disabled-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "disabled-google-client-secret",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        const ip = getClientIP(new Headers((req?.headers ?? {}) as Record<string, string>));
        const email = credentials.email.trim().toLowerCase();
        const [perAccount, perIp] = await Promise.all([
          rateLimit(`auth:login:acct:${ip}:${email}`, {
            interval: LOGIN_WINDOW_MS,
            uniqueTokenPerInterval: LOGIN_MAX_PER_ACCOUNT_AND_IP,
            failureMode: "closed",
          }),
          rateLimit(`auth:login:ip:${ip}`, {
            interval: LOGIN_WINDOW_MS,
            uniqueTokenPerInterval: LOGIN_MAX_PER_IP,
            failureMode: "closed",
          }),
        ]);
        if (!perAccount.success || !perIp.success) {
          throw new Error(TOO_MANY_ATTEMPTS_MESSAGE);
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        const typedUser = user as (typeof user & DbUserWithPassword) | null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          typedUser?.password || DUMMY_PASSWORD_HASH,
        );

        if (!typedUser || !typedUser.password || !isPasswordValid) {
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        return {
          id: typedUser.id,
          email: typedUser.email,
          name: typedUser.name,
          image: typedUser.image,
          role: typedUser.role,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token) {
        session.user.id = token.uid as string;
        session.user.role = token.role;
      }
      return session;
    },
    jwt: async ({ user, token, trigger, session }) => {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }

      if (trigger === "update") {
        // El payload de update() lo controla el cliente: solo se aceptan campos
        // de presentación, saneados. El rol NUNCA se toma de ahí.
        const name = sanitizeProfileName(session?.user?.name);
        if (name) token.name = name;

        const image = sanitizeProfileImage(session?.user?.image);
        if (image) token.picture = image;

        // El rol se refresca desde la base de datos por uid, no desde el cliente.
        if (token.uid) {
          try {
            const fresh = await prisma.user.findUnique({
              where: { id: token.uid },
              select: { role: true },
            });
            if (fresh) token.role = fresh.role;
          } catch (error) {
            console.error("[auth] No se pudo refrescar el rol desde la base de datos", error);
          }
        }
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
    // SEC-004: 7 dias (antes 30, el valor por defecto de NextAuth). Las acciones de administrador
    // ya no dependen del rol del token (ver lib/security/admin-session.ts); esto acota ademas cuanto
    // vive un token robado y cuanto tarda la interfaz en reflejar un cambio de rol.
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
    error: "/auth/error", // Redirects back to origin page with error param
  },
};
