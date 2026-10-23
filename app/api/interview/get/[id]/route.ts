import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing assessment ID." }, { status: 400 });
  try {
    const assessment = await prisma.interview.findFirst({ where: { id, userId }, include: { feedBack: true } });
    if (!assessment) return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Assessment lookup failed", error);
    return NextResponse.json({ error: "Failed to fetch assessment." }, { status: 500 });
  }
}
