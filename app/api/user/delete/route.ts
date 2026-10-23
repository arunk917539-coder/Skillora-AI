import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { logSecurityEvent } from "@/app/lib/security/audit-logger";

export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    // Delete user; cascade deletes interviews, feedback, and hr questions
    await prisma.user.delete({
      where: { id: userId },
    });

    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "USER_ACCOUNT_DELETION_REQUESTED",
      actorUserId: userId,
    });

    return NextResponse.json({
      success: true,
      message: "Account and associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Account deletion failed", error instanceof Error ? error.message : "Internal error");
    return NextResponse.json({ error: "Could not delete account. Please try again." }, { status: 500 });
  }
}
