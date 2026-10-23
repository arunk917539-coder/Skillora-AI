import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string | null;
    password?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
  }
}



