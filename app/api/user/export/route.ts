import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { logSecurityEvent } from "@/app/lib/security/audit-logger";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        interviews: {
          include: {
            feedBack: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "USER_DATA_EXPORT_REQUESTED",
      actorUserId: userId,
    });

    return new NextResponse(JSON.stringify(user, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="skillora-data-export-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error("Data export failed", error instanceof Error ? error.message : "Internal error");
    return NextResponse.json({ error: "Could not export user data." }, { status: 500 });
  }
}
