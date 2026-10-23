import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

import { CATEGORIES, selectScenarios } from "@/app/lib/workplace/scenarios";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const categoryInput = input.category ?? input.type ?? "Communication";
    if (typeof categoryInput !== "string" || !CATEGORIES.includes(categoryInput as (typeof CATEGORIES)[number])) {
      return NextResponse.json({ error: "Choose a valid workplace competency category." }, { status: 400 });
    }
    const category = categoryInput;
    const titleInput = input.name ?? "Workplace Behaviour Assessment";
    if (typeof titleInput !== "string") {
      return NextResponse.json({ error: "Assessment name must be text." }, { status: 400 });
    }
    const title = titleInput.trim().slice(0, 100);
    const rawCount = input.noOfQuestions ?? 3;
    const count = typeof rawCount === "number" ? rawCount : Number(rawCount);
    if (!Number.isInteger(count) || count < 1 || count > 3) {
      return NextResponse.json({ error: "Choose between 1 and 3 scenarios." }, { status: 400 });
    }
    const experience = typeof input.experience === "string" ? input.experience.slice(0, 80) : "All levels";
    const difficultyInput = input.difficultyLevel ?? "Medium";
    if (typeof difficultyInput !== "string" || !["Easy", "Medium", "Hard"].includes(difficultyInput)) {
      return NextResponse.json({ error: "Choose Easy, Medium or Hard difficulty." }, { status: 400 });
    }
    const difficultyLevel = difficultyInput;
    const selectedScenarios = selectScenarios(category, count, difficultyLevel);
    if (selectedScenarios.length !== count) {
      return NextResponse.json({ error: "Not enough scenarios are available for this category." }, { status: 400 });
    }
    const questions = selectedScenarios.map((scenario) => scenario.prompt);
    const storedDifficulty = selectedScenarios.every((scenario) => scenario.difficulty === selectedScenarios[0].difficulty)
      ? selectedScenarios[0].difficulty
      : "Mixed";
    const created = await prisma.interview.create({
      data: {
        name: title || "Workplace Behaviour Assessment",
        userId,
        type: category,
        techStack: ["Communication", "Teamwork", "Problem solving", "Professional judgement"],
        role: "Workplace Behaviour",
        experience,
        difficultyLevel: storedDifficulty,
        noOfQuestions: questions.length,
        isCompleted: false,
        questions,
      },
      select: { id: true },
    });
    return NextResponse.json({ success: true, id: created.id }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    console.error("Assessment creation failed", error);
    return NextResponse.json({ error: "Could not create assessment." }, { status: 500 });
  }
}
