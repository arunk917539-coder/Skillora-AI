import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { RUBRIC_VERSION, type CompetencyKey, type CompetencyScores } from "@/app/lib/workplace/scoring";
import { evaluateWorkplaceAnswer } from "@/app/lib/workplace/evaluation-service";
import { buildDevelopmentPlan } from "@/app/lib/workplace/development-plans";
import { checkRateLimit } from "@/app/lib/security/rate-limiter";
import { logSecurityEvent } from "@/app/lib/security/audit-logger";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  // Rate limit expensive local AI evaluation to 6 requests per minute per user
  const rateLimit = checkRateLimit(`eval:${userId}`, 6, 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many assessment evaluation requests. Please wait a moment before submitting again." },
      { status: 429 }
    );
  }

  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    const { id, answers, consentAcknowledged } = body as { id?: unknown; answers?: unknown; consentAcknowledged?: unknown };
    if (typeof id !== "string" || !id.trim() || !Array.isArray(answers) || answers.length === 0 || answers.length > 3) {
      return NextResponse.json({ error: "A valid assessment ID and 1–3 answers are required." }, { status: 400 });
    }
    if (consentAcknowledged !== undefined && consentAcknowledged !== true) {
      return NextResponse.json({ error: "Affirmative acknowledgment of AI evaluation terms is required." }, { status: 400 });
    }
    const normalizedAnswers = answers.map((item: unknown) => {
      if (!item || typeof item !== "object") return null;
      const value = item as { question?: unknown; answer?: unknown };
      if (typeof value.question !== "string" || typeof value.answer !== "string") return null;
      return { question: value.question.trim().slice(0, 1000), answer: value.answer.trim().slice(0, 5000) };
    });
    if (normalizedAnswers.some((answer) => !answer || !answer.question || !answer.answer)) {
      return NextResponse.json({ error: "Every scenario must have a question and a non-empty response." }, { status: 400 });
    }
    const assessment = await prisma.interview.findFirst({
      where: { id: id.trim(), userId },
      select: { id: true, isCompleted: true, questions: true, noOfQuestions: true, expectedAnswers: true },
    });
    if (!assessment) return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
    if (assessment.isCompleted) return NextResponse.json({ error: "This assessment is already completed." }, { status: 409 });
    const expectedQuestions = assessment.questions;
    if (expectedQuestions.length !== assessment.noOfQuestions || normalizedAnswers.length !== expectedQuestions.length) {
      return NextResponse.json({ error: `Please answer all ${expectedQuestions.length} scenarios before submitting.` }, { status: 400 });
    }
    if (!expectedQuestions.every((question, index) => question.trim() === normalizedAnswers[index]!.question)) {
      return NextResponse.json({ error: "Submitted scenarios do not match this assessment. Reload the assessment and try again." }, { status: 400 });
    }

    // Evaluate sequentially with Ollama and the stored scenario rubric.
    // Sequential execution prevents local Ollama queue contention and aborts.
    type SemanticRow = {
      question: string;
      answer: string;
      expectedAnswer: string;
      wordCount: number;
    } & Awaited<ReturnType<typeof evaluateWorkplaceAnswer>>;

    const semanticRows: SemanticRow[] = [];
    for (let i = 0; i < normalizedAnswers.length; i++) {
      const answer = normalizedAnswers[i]!;
      const expectedAnswerFallback = Array.isArray(assessment.expectedAnswers) && assessment.expectedAnswers[i]
        ? assessment.expectedAnswers[i]
        : undefined;
      const evaluation = await evaluateWorkplaceAnswer(answer.question, answer.answer, expectedAnswerFallback);
      semanticRows.push({
        question: answer.question,
        answer: answer.answer,
        expectedAnswer: evaluation.exampleStrongResponse || expectedAnswerFallback || "",
        ...evaluation,
        wordCount: answer.answer.split(/\s+/).filter(Boolean).length,
      });
    }
    const competencyKeys: CompetencyKey[] = ["communication", "problemSolving", "collaboration", "accountability", "planning"];
    const competencies = Object.fromEntries(competencyKeys.map((key) => {
      const applicable = semanticRows.map((row) => row.competencies[key]).filter((value): value is number => typeof value === "number");
      return [key, applicable.length ? Math.round(applicable.reduce((sum, value) => sum + value, 0) / applicable.length) : 0];
    })) as CompetencyScores;
    const average = Math.round(semanticRows.reduce((sum, row) => sum + row.score, 0) / semanticRows.length);
    const assessedCompetencies = competencyKeys.filter((key) => semanticRows.some((row) => typeof row.competencies[key] === "number"));
    const recommendations = buildDevelopmentPlan(competencies).filter((item) => assessedCompetencies.includes(item.competency));
    const strengths = [...new Set(semanticRows.flatMap((row) => row.strengths))].slice(0, 3);
    const focusAreas = [...new Set(semanticRows.flatMap((row) => row.improvements))].slice(0, 2);
    const feedback = `${average >= 75 ? "Your responses demonstrate several strong, practical workplace behaviours." : average >= 55 ? "You have a foundation to build on. Focus on making your decisions, owners and follow-through more explicit." : "Focus on clarifying the situation, considering affected people, explaining your decision and agreeing a concrete next step."}${strengths.length ? ` Strengths: ${strengths.join("; ")}.` : ""}${focusAreas.length ? ` Next focus: ${focusAreas.join("; ")}.` : ""} This is AI-assisted practice feedback, not a validated psychological or employment assessment.`;
    const evaluated = semanticRows.map((row) => ({
      ...row,
      question: row.question,
      answer: row.answer,
      expectedAnswer: row.expectedAnswer,
      competencies: row.competencies,
      score: row.score,
      evidence: row.evidence,
      strengths: row.strengths,
      improvements: row.improvements,
      criterionEvaluations: row.criterionEvaluations,
    }));

    const feedbackData = {
      userId,
      feedBack: feedback,
      problemSolving: competencies.problemSolving,
      systemDesign: competencies.planning,
      communicationSkills: competencies.communication,
      technicalAccuracy: competencies.accountability,
      behavioralResponses: competencies.collaboration,
      timeManagement: competencies.planning,
      answers: JSON.stringify(evaluated),
      competencyScores: JSON.stringify(Object.fromEntries(assessedCompetencies.map((key) => [key, competencies[key]]))),
      recommendations: JSON.stringify(recommendations),
      rubricVersion: RUBRIC_VERSION,
    };

    // Claim completion atomically so two concurrent submissions cannot overwrite each other.
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.interview.updateMany({
        where: { id: assessment.id, userId, OR: [{ isCompleted: false }, { isCompleted: null }] },
        data: { isCompleted: true },
      });
      if (claimed.count !== 1) {
        throw new Error("ASSESSMENT_ALREADY_COMPLETED");
      }
      await tx.interviewFeedback.create({
        data: { interviewId: assessment.id, ...feedbackData },
      });
    });

    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "ASSESSMENT_SUBMITTED",
      actorUserId: userId,
      targetId: assessment.id,
      details: {
        scoreAverage: average,
        scenarioCount: normalizedAnswers.length,
      },
    });

    return NextResponse.json({ success: true, average, scores: evaluated, competencies: Object.fromEntries(assessedCompetencies.map((key) => [key, competencies[key]])), assessedCompetencies, recommendations, feedback, evaluator: "ollama-workplace-evaluator-v1", rubricVersion: RUBRIC_VERSION });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "ASSESSMENT_ALREADY_COMPLETED") {
      return NextResponse.json({ error: "This assessment has already been completed." }, { status: 409 });
    }
    console.error("Assessment completion failed:", error instanceof Error ? error.message : "Internal evaluation error");
    const message = error instanceof Error ? error.message : "Could not evaluate this assessment.";
    if (/Ollama|model|evaluation|scenario rubric|timed out|schema validation/i.test(message)) {
      return NextResponse.json({ error: `${message} Start Ollama and ensure the configured model is available, then try again. No score was saved.` }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not save assessment results." }, { status: 500 });
  }
}
