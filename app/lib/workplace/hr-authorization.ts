import { prisma } from "@/prisma/prisma";

/**
 * Validates whether a user has HR authorization.
 * An account is authorized if:
 * 1. Their email is included in the optional HR_EMAILS environment variable, OR
 * 2. Their database User.role is explicitly set to "hr"
 */
export async function isAuthorizedHr(userId?: string | null, email?: string | null): Promise<boolean> {
  const configuredHrEmails = (process.env.HR_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (email && configuredHrEmails.includes(email.trim().toLowerCase())) {
    return true;
  }

  if (!userId) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true },
    });
    if (!user) return false;
    if (user.role?.toLowerCase() === "hr") return true;
    if (user.email && configuredHrEmails.includes(user.email.trim().toLowerCase())) return true;
    return false;
  } catch {
    return false;
  }
}
