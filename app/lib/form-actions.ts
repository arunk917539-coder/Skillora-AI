"use server";

import { z } from "zod";
type CreateAssessmentState = {
  success: boolean;
  errors?: Record<string, string>;
  assessmentId?: string;
};import { auth } from "../(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

import { CATEGORIES, selectScenarios } from "@/app/lib/workplace/scenarios";

export async function handleCreateInterviewFormAction(
  _prevState: CreateAssessmentState,
  formData: FormData
): Promise<CreateAssessmentState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, errors: { general: "Please sign in to create an assessment." } };
    const customQuestionId = formData.get("customQuestionId");
    if (typeof customQuestionId === "string" && customQuestionId.trim()) {
      const customQ = await prisma.hrQuestion.findUnique({
        where: { id: customQuestionId.trim() },
      });
      if (!customQ) {
        return { success: false, errors: { general: "Selected custom scenario question was not found." } };
      }
      const rawTitle = formData.get("name");
      const title = typeof rawTitle === "string" && rawTitle.trim().length >= 2
        ? rawTitle.trim()
        : customQ.title;

      const assessment = await prisma.interview.create({
        data: {
          name: title,
          userId,
          type: customQ.category,
          techStack: ["Communication", "Teamwork", "Problem solving", "Professional judgement"],
          role: "Workplace Behaviour",
          experience: "All levels",
          difficultyLevel: customQ.difficulty,
          noOfQuestions: 1,
          questions: [customQ.question],
          expectedAnswers: [customQ.expectedAnswer],
          isCompleted: false,
        },
        select: { id: true },
      });
      revalidatePath("/dashboard");
      return { success: true, assessmentId: assessment.id };
    }

    const parsed = z.object({
      name: z.string().trim().min(2).max(100),
      type: z.enum(CATEGORIES),
      difficultyLevel: z.enum(["Easy", "Medium", "Hard"]),
      numberOfQuestions: z.coerce.number().int().min(1).max(3),
    }).parse({
      name: formData.get("name"),
      type: formData.get("type"),
      difficultyLevel: formData.get("difficultyLevel"),
      numberOfQuestions: formData.get("numberOfQuestions"),
    });
    const category = parsed.type;
    const selectedScenarios = selectScenarios(category, parsed.numberOfQuestions, parsed.difficultyLevel);
    if (selectedScenarios.length !== parsed.numberOfQuestions) {
      return { success: false, errors: { general: "Not enough scenarios are available for this category." } };
    }
    const questions = selectedScenarios.map((scenario) => scenario.prompt);
    const expectedAnswers = selectedScenarios.map((scenario) => scenario.exampleStrongResponse);
    const storedDifficulty = selectedScenarios.every((scenario) => scenario.difficulty === selectedScenarios[0].difficulty)
      ? selectedScenarios[0].difficulty
      : "Mixed";
    const assessment = await prisma.interview.create({
      data: {
        name: parsed.name,
        userId,
        type: category,
        techStack: ["Communication", "Teamwork", "Problem solving", "Professional judgement"],
        role: "Workplace Behaviour",
        experience: "All levels",
        difficultyLevel: storedDifficulty,
        noOfQuestions: questions.length,
        questions,
        expectedAnswers,
        isCompleted: false,
      },
      select: { id: true },
    });
    revalidatePath("/dashboard");
    return { success: true, assessmentId: assessment.id };
  } catch (error) {
    console.error("Assessment creation failed", error);
    return { success: false, errors: { general: "Could not create assessment. Please check your inputs and try again." } };
  }
}

