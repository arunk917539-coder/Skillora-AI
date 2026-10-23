import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parseStoredArray, parseStoredNumberRecord } from "@/app/lib/workplace/safe-json";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }
  try {
    const interviews = await prisma.interview.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        type: true,
        role: true,
        difficultyLevel: true,
        isCompleted: true,
        createdAt: true,
        feedBack: { select: { feedBack: true, problemSolving: true, systemDesign: true, communicationSkills: true, technicalAccuracy: true, behavioralResponses: true, answers: true, competencyScores: true, recommendations: true, rubricVersion: true } },
      },
    });

    return NextResponse.json(interviews.map((interview) => ({
      ...interview,
      feedBack: interview.feedBack?.feedBack ?? null,
      competencyScores: parseStoredNumberRecord(interview.feedBack?.competencyScores),
      recommendations: parseStoredArray(interview.feedBack?.recommendations, (item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object" && !Array.isArray(item) &&
          typeof (item as Record<string, unknown>).label === "string" &&
          typeof (item as Record<string, unknown>).score === "number" &&
          Array.isArray((item as Record<string, unknown>).actions))
      ),
      overallScore: interview.feedBack
        ? (() => {
            const evaluatedAnswers = parseStoredArray(interview.feedBack.answers, (item): item is Record<string, unknown> =>
              Boolean(item && typeof item === "object" && !Array.isArray(item) && typeof (item as Record<string, unknown>).score === "number" && Number.isFinite((item as Record<string, unknown>).score)));
            if (evaluatedAnswers.length) return Math.round(evaluatedAnswers.reduce((sum, item) => sum + Number(item.score), 0) / evaluatedAnswers.length);
            const scores = parseStoredNumberRecord(interview.feedBack.competencyScores);
            if (scores) {
              const values = (["communication", "problemSolving", "collaboration", "accountability", "planning"] as const).map((key) => scores[key]).filter((value) => typeof value === "number" && value >= 0 && value <= 100) as number[];
              if (values.length) return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
            }
            // Compatibility for historical records written before versioned workplace scores.
            return Math.round((interview.feedBack.problemSolving + interview.feedBack.systemDesign + interview.feedBack.communicationSkills + interview.feedBack.technicalAccuracy + interview.feedBack.behavioralResponses) / 5);
          })()
        : null,
      rubricVersion: interview.feedBack?.rubricVersion ?? null,
    })));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
