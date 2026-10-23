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
import { parseHrScenarioCriteria, serializeHrScenarioCriteria } from "@/app/lib/workplace/hr-criteria";

export async function handleCreateInterviewFormAction(
  _prevState: CreateAssessmentState,
  formData: FormData
): Promise<CreateAssessmentState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, errors: { general: "Please sign in to create an assessment." } };

    const rawSelectedIds = formData.getAll("selectedHrQuestionIds").map(String).filter(Boolean);
    const legacyCustomId = formData.get("customQuestionId");
    const candidateIds = rawSelectedIds.length > 0
      ? rawSelectedIds
      : (typeof legacyCustomId === "string" && legacyCustomId.trim() ? [legacyCustomId.trim()] : []);

    const assessmentSource = formData.get("assessmentSource");
    const isHrQuestions = assessmentSource === "custom" || assessmentSource === "hr_questions" || candidateIds.length > 0;

    if (isHrQuestions) {
      if (candidateIds.length === 0) {
        return { success: false, errors: { general: "Please select at least one published question for this assessment." } };
      }

      const uniqueIds = [...new Set(candidateIds)];
      if (uniqueIds.length > 5) {
        return { success: false, errors: { general: "You may select at most 5 questions per assessment." } };
      }

      const hrQuestions = await prisma.hrQuestion.findMany({
        where: { id: { in: uniqueIds } },
      });

      if (hrQuestions.length === 0) {
        return { success: false, errors: { general: "Selected questions were not found." } };
      }

      // Check each question is published and not archived
      const validQuestions = hrQuestions.filter((q) => {
        const criteria = parseHrScenarioCriteria(q.expectedAnswer);
        return criteria.status === "published" && !criteria.isArchived;
      });

      if (validQuestions.length !== uniqueIds.length) {
        return {
          success: false,
          errors: { general: "One or more selected questions are not published or have been archived." },
        };
      }

      // Maintain order of selection
      const orderedQuestions = uniqueIds.map((id) => validQuestions.find((q) => q.id === id)!);
      const rawTitle = formData.get("name");
      const title = typeof rawTitle === "string" && rawTitle.trim().length >= 2
        ? rawTitle.trim()
        : orderedQuestions.length === 1
        ? orderedQuestions[0].title
        : "HR Workplace Assessment";

      const storedDifficulty = orderedQuestions.every((q) => q.difficulty === orderedQuestions[0].difficulty)
        ? orderedQuestions[0].difficulty
        : "Mixed";

      const questions = orderedQuestions.map((q) => q.question);
      const expectedAnswers = orderedQuestions.map((q) => {
        const criteria = parseHrScenarioCriteria(q.expectedAnswer);
        return serializeHrScenarioCriteria({
          ...criteria,
          competencies: q.competencies,
        });
      });

      const assessment = await prisma.interview.create({
        data: {
          name: title,
          userId,
          type: "HR Questions",
          techStack: ["Communication", "Teamwork", "Problem solving", "Professional judgement"],
          role: "Workplace Behaviour",
          experience: "All levels",
          difficultyLevel: storedDifficulty,
          noOfQuestions: orderedQuestions.length,
          questions,
          expectedAnswers,
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
      numberOfQuestions: z.coerce.number().int().min(1).max(5),
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

