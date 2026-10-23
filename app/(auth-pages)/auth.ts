import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as { role?: string | null }).role ?? "user";
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session && token?.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string | null) ?? "user";
      }
      return session;
    },
  },
});
