"use server";

import { z } from "zod";
import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { isAuthorizedHr } from "./hr-authorization";
import type { CompetencyKey } from "./scenarios";
import { logSecurityEvent } from "@/app/lib/security/audit-logger";
import {
  parseHrScenarioCriteria,
  serializeHrScenarioCriteria,
  type HrScenarioCriteria,
} from "./hr-criteria";

export { parseHrScenarioCriteria, serializeHrScenarioCriteria, type HrScenarioCriteria };

const VALID_COMPETENCIES: CompetencyKey[] = [
  "communication",
  "problemSolving",
  "collaboration",
  "accountability",
  "planning",
];

function parseDelimitedList(input: unknown): string[] {
  if (typeof input !== "string") return [];
  return input
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const hrQuestionSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(100, "Title cannot exceed 100 characters."),
  category: z.string().trim().min(2, "Category must be at least 2 characters.").max(50, "Category cannot exceed 50 characters."),
  difficulty: z.enum(["Easy", "Medium", "Hard"], { message: "Difficulty must be Easy, Medium, or Hard." }),
  question: z.string().trim().min(10, "Question prompt must be at least 10 characters.").max(1000, "Question prompt cannot exceed 1000 characters."),
  expectedAnswer: z.string().trim().min(10, "Expected answer must be at least 10 characters.").max(5000, "Expected answer cannot exceed 5000 characters."),
  competencies: z.array(z.enum(["communication", "problemSolving", "collaboration", "accountability", "planning"])).min(1, "Select at least one competency."),
  contextInstructions: z.string().max(1000).optional(),
  requiredConcepts: z.array(z.string()).default([]),
  acceptableAlternatives: z.array(z.string()).default([]),
  criticalErrors: z.array(z.string()).default([]),
  scoringGuidance: z.string().max(1000).optional(),
});

export type HrQuestionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  questionId?: string;
};

/** Retrieves HR-managed questions scoped to authorized user */
export async function getHrQuestions() {
  const session = await auth();
  const userId = session?.user?.id;
  const isHr = await isAuthorizedHr(userId, session?.user?.email);
  if (!isHr || !userId) {
    throw new Error("Unauthorized: HR access required.");
  }

  return prisma.hrQuestion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
}

/** Retrieves custom questions safe for assessment creation (omits expectedAnswer, filters out archived) */
export async function getAvailableCustomQuestions() {
  try {
    const list = await prisma.hrQuestion.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        question: true,
        expectedAnswer: true,
        competencies: true,
      },
    });

    return list
      .filter((q) => !parseHrScenarioCriteria(q.expectedAnswer).isArchived)
      .map(({ expectedAnswer: _ignored, ...rest }) => rest);
  } catch (error) {
    console.error("Failed to fetch custom HR questions", error);
    return [];
  }
}

/** Server action to create a new HR-managed scenario question */
export async function createHrQuestionAction(
  _prevState: HrQuestionState,
  formData: FormData
): Promise<HrQuestionState> {
  const session = await auth();
  const userId = session?.user?.id;
  const isHr = await isAuthorizedHr(userId, session?.user?.email);
  if (!userId || !isHr) {
    return { success: false, errors: { general: "Unauthorized: You must be an authorized HR user to create questions." } };
  }

  const rawCompetencies = formData.getAll("competencies");
  const competencies = rawCompetencies.length > 0
    ? rawCompetencies.map(String)
    : [String(formData.get("competency") || "")].filter(Boolean);

  const parseResult = hrQuestionSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    difficulty: formData.get("difficulty"),
    question: formData.get("question"),
    expectedAnswer: formData.get("expectedAnswer"),
    competencies,
    contextInstructions: formData.get("contextInstructions") || undefined,
    requiredConcepts: parseDelimitedList(formData.get("requiredConcepts")),
    acceptableAlternatives: parseDelimitedList(formData.get("acceptableAlternatives")),
    criticalErrors: parseDelimitedList(formData.get("criticalErrors")),
    scoringGuidance: formData.get("scoringGuidance") || undefined,
  });

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [key, issues] of Object.entries(parseResult.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) {
        fieldErrors[key] = issues[0];
      }
    }
    return { success: false, errors: fieldErrors };
  }

  try {
    const criteriaEnvelope = serializeHrScenarioCriteria({
      version: 1,
      expectedAnswer: parseResult.data.expectedAnswer,
      contextInstructions: parseResult.data.contextInstructions,
      requiredConcepts: parseResult.data.requiredConcepts,
      acceptableAlternatives: parseResult.data.acceptableAlternatives,
      criticalErrors: parseResult.data.criticalErrors,
      scoringGuidance: parseResult.data.scoringGuidance,
      isArchived: false,
    });

    const created = await prisma.hrQuestion.create({
      data: {
        userId,
        title: parseResult.data.title,
        category: parseResult.data.category,
        difficulty: parseResult.data.difficulty,
        question: parseResult.data.question,
        expectedAnswer: criteriaEnvelope,
        competencies: parseResult.data.competencies,
      },
      select: { id: true },
    });

    revalidatePath("/dashboard");
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "HR_SCENARIO_CREATED",
      actorUserId: userId,
      targetId: created.id,
      details: { category: parseResult.data.category, difficulty: parseResult.data.difficulty },
    });
    return { success: true, message: "Custom scenario created successfully.", questionId: created.id };
  } catch (error) {
    console.error("Failed to create HR question", error);
    return { success: false, errors: { general: "Database error: Could not save the custom question." } };
  }
}

/** Server action to update an existing HR-managed scenario question with versioning */
export async function updateHrQuestionAction(
  id: string,
  _prevState: HrQuestionState,
  formData: FormData
): Promise<HrQuestionState> {
  const session = await auth();
  const userId = session?.user?.id;
  const isHr = await isAuthorizedHr(userId, session?.user?.email);
  if (!userId || !isHr) {
    return { success: false, errors: { general: "Unauthorized: You must be an authorized HR user to edit questions." } };
  }

  if (!id || typeof id !== "string") {
    return { success: false, errors: { general: "Question ID is required." } };
  }

  // Authorization: Enforce that the user owns the scenario
  const existing = await prisma.hrQuestion.findUnique({
    where: { id },
    select: { id: true, userId: true, expectedAnswer: true },
  });

  if (!existing) {
    return { success: false, errors: { general: "Scenario not found." } };
  }

  if (existing.userId !== userId) {
    return { success: false, errors: { general: "Unauthorized: You do not have permission to modify another organization's scenario." } };
  }

  const rawCompetencies = formData.getAll("competencies");
  const competencies = rawCompetencies.length > 0
    ? rawCompetencies.map(String)
    : [String(formData.get("competency") || "")].filter(Boolean);

  const parseResult = hrQuestionSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    difficulty: formData.get("difficulty"),
    question: formData.get("question"),
    expectedAnswer: formData.get("expectedAnswer"),
    competencies,
    contextInstructions: formData.get("contextInstructions") || undefined,
    requiredConcepts: parseDelimitedList(formData.get("requiredConcepts")),
    acceptableAlternatives: parseDelimitedList(formData.get("acceptableAlternatives")),
    criticalErrors: parseDelimitedList(formData.get("criticalErrors")),
    scoringGuidance: formData.get("scoringGuidance") || undefined,
  });

  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [key, issues] of Object.entries(parseResult.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) {
        fieldErrors[key] = issues[0];
      }
    }
    return { success: false, errors: fieldErrors };
  }

  try {
    const prevCriteria = parseHrScenarioCriteria(existing.expectedAnswer);
    const updatedEnvelope = serializeHrScenarioCriteria({
      version: (prevCriteria.version || 1) + 1,
      expectedAnswer: parseResult.data.expectedAnswer,
      contextInstructions: parseResult.data.contextInstructions,
      requiredConcepts: parseResult.data.requiredConcepts,
      acceptableAlternatives: parseResult.data.acceptableAlternatives,
      criticalErrors: parseResult.data.criticalErrors,
      scoringGuidance: parseResult.data.scoringGuidance,
      isArchived: prevCriteria.isArchived,
    });

    await prisma.hrQuestion.update({
      where: { id },
      data: {
        title: parseResult.data.title,
        category: parseResult.data.category,
        difficulty: parseResult.data.difficulty,
        question: parseResult.data.question,
        expectedAnswer: updatedEnvelope,
        competencies: parseResult.data.competencies,
      },
    });

    revalidatePath("/dashboard");
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "HR_SCENARIO_UPDATED",
      actorUserId: userId,
      targetId: id,
      details: { category: parseResult.data.category, difficulty: parseResult.data.difficulty, version: (prevCriteria.version || 1) + 1 },
    });
    return { success: true, message: "Custom scenario updated successfully." };
  } catch (error) {
    console.error("Failed to update HR question", error);
    return { success: false, errors: { general: "Database error: Could not update the question." } };
  }
}

/** Server action to archive/unarchive an HR-managed scenario question */
export async function archiveHrQuestionAction(id: string): Promise<{ success: boolean; isArchived?: boolean; error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  const isHr = await isAuthorizedHr(userId, session?.user?.email);
  if (!userId || !isHr) {
    return { success: false, error: "Unauthorized: HR access required." };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Question ID is required." };
  }

  const existing = await prisma.hrQuestion.findUnique({
    where: { id },
    select: { id: true, userId: true, expectedAnswer: true },
  });

  if (!existing) {
    return { success: false, error: "Scenario not found." };
  }

  if (existing.userId !== userId) {
    return { success: false, error: "Unauthorized: You do not have permission to archive this scenario." };
  }

  try {
    const criteria = parseHrScenarioCriteria(existing.expectedAnswer);
    const newArchivedState = !criteria.isArchived;
    const updatedEnvelope = serializeHrScenarioCriteria({
      ...criteria,
      isArchived: newArchivedState,
    });

    await prisma.hrQuestion.update({
      where: { id },
      data: { expectedAnswer: updatedEnvelope },
    });

    revalidatePath("/dashboard");
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: newArchivedState ? "HR_SCENARIO_ARCHIVED" : "HR_SCENARIO_UNARCHIVED",
      actorUserId: userId,
      targetId: id,
    });
    return { success: true, isArchived: newArchivedState };
  } catch (error) {
    console.error("Failed to archive HR question", error);
    return { success: false, error: "Database error: Could not update archive status." };
  }
}

/** Server action to delete or safely archive an HR-managed scenario question */
export async function deleteHrQuestionAction(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  const userId = session?.user?.id;
  const isHr = await isAuthorizedHr(userId, session?.user?.email);
  if (!userId || !isHr) {
    return { success: false, error: "Unauthorized: HR access required." };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Question ID is required." };
  }

  const existing = await prisma.hrQuestion.findUnique({
    where: { id },
    select: { id: true, userId: true, question: true, expectedAnswer: true },
  });

  if (!existing) {
    return { success: false, error: "Scenario not found." };
  }

  if (existing.userId !== userId) {
    return { success: false, error: "Unauthorized: You do not have permission to delete this scenario." };
  }

  try {
    // Check if referenced by existing interviews to preserve historical integrity
    const referencedCount = await prisma.interview.count({
      where: { questions: { has: existing.question } },
    });

    if (referencedCount > 0) {
      // Soft-archive to preserve historical assessments
      const criteria = parseHrScenarioCriteria(existing.expectedAnswer);
      await prisma.hrQuestion.update({
        where: { id },
        data: {
          expectedAnswer: serializeHrScenarioCriteria({ ...criteria, isArchived: true }),
        },
      });
      revalidatePath("/dashboard");
      return { success: true };
    }

    await prisma.hrQuestion.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "HR_SCENARIO_DELETED",
      actorUserId: userId,
      targetId: id,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete HR question", error);
    return { success: false, error: "Database error: Could not delete the question." };
  }
}
