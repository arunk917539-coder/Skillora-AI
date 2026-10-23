import { prisma } from "@/prisma/prisma";
import bcrypt from "bcrypt";

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  } catch (error) {
    console.error("User lookup failed:", error);
    return null;
  }
}

type NewUserData = { email: string; password: string; fullname: string };

export async function CreateNewUser(userData: NewUserData) {
  const email = userData.email.trim().toLowerCase();
  const name = userData.fullname.trim();
  const password = await hashPassword(userData.password);
  return prisma.user.create({ data: { email, name, password } });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function compareHash(hash: string, password: string) {
  return bcrypt.compare(password, hash);
}
