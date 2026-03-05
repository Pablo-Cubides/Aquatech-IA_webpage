import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

type DbUserWithPassword = {
  password?: string | null;
  role?: string | null;
};

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        const typedUser = user as (typeof user & DbUserWithPassword) | null;

        if (!typedUser || !typedUser.password) {
          throw new Error("Usuario no encontrado");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          typedUser.password,
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
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

      // Update token if session is updated manually
      if (trigger === "update" && session) {
        token.role = session.user.role;
        if (session.user.name) token.name = session.user.name;
        if (session.user.image) token.picture = session.user.image;
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/auth/error", // Redirects back to origin page with error param
  },
};
