import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@ia-next/database";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "disabled-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "disabled-google-client-secret",
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user && user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.credits = user.credits;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
