import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareHash, getUserByEmail } from "../lib/users";

export default {
  providers: [
    Credentials({
      name: "Email and password",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await getUserByEmail(String(credentials.email));
          if (!user?.password) return null;
          const valid = await compareHash(user.password, String(credentials.password));
          return valid ? user : null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
