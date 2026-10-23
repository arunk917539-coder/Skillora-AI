"use server";

import { z } from "zod";
import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { isAuthorizedHr } from "./hr-authorization";
import type { CompetencyKey } from "./scenarios";

const VALID_COMPETENCIES: CompetencyKey[] = [
  "communication",
  "problemSolving",
  "collaboration",
  "accountability",
  "planning",
];

const hrQuestionSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(100, "Title cannot exceed 100 characters."),
  category: z.string().trim().min(2, "Category must be at least 2 characters.").max(50, "Category cannot exceed 50 characters."),
  difficulty: z.enum(["Easy", "Medium", "Hard"], { message: "Difficulty must be Easy, Medium, or Hard." }),
  question: z.string().trim().min(10, "Question prompt must be at least 10 characters.").max(1000, "Question prompt cannot exceed 1000 characters."),
  expectedAnswer: z.string().trim().min(10, "Expected answer must be at least 10 characters.").max(5000, "Expected answer cannot exceed 5000 characters."),
  competencies: z.array(z.enum(["communication", "problemSolving", "collaboration", "accountability", "planning"])).min(1, "Select at least one competency."),
});

export type HrQuestionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  questionId?: string;
};

/** Retrieves all HR-managed questions (restricted to authorized HR users) */
export async function getHrQuestions() {
  const session = await auth();
  const userId = session?.user?.id;
  const isHr = await isAuthorizedHr(userId, session?.user?.email);
  if (!isHr) {
    throw new Error("Unauthorized: HR access required.");
  }

  return prisma.hrQuestion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
}

/** Retrieves custom questions safe for assessment creation (omits expectedAnswer) */
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
        competencies: true,
      },
    });
    return list;
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
    const created = await prisma.hrQuestion.create({
      data: {
        userId,
        title: parseResult.data.title,
        category: parseResult.data.category,
        difficulty: parseResult.data.difficulty,
        question: parseResult.data.question,
        expectedAnswer: parseResult.data.expectedAnswer,
        competencies: parseResult.data.competencies,
      },
      select: { id: true },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Custom question created successfully.", questionId: created.id };
  } catch (error) {
    console.error("Failed to create HR question", error);
    return { success: false, errors: { general: "Database error: Could not save the custom question." } };
  }
}

/** Server action to update an existing HR-managed scenario question */
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
    await prisma.hrQuestion.update({
      where: { id },
      data: {
        title: parseResult.data.title,
        category: parseResult.data.category,
        difficulty: parseResult.data.difficulty,
        question: parseResult.data.question,
        expectedAnswer: parseResult.data.expectedAnswer,
        competencies: parseResult.data.competencies,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Custom question updated successfully." };
  } catch (error) {
    console.error("Failed to update HR question", error);
    return { success: false, errors: { general: "Database error: Could not update the question." } };
  }
}

/** Server action to delete an HR-managed scenario question */
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

  try {
    await prisma.hrQuestion.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete HR question", error);
    return { success: false, error: "Database error: Could not delete the question." };
  }
}
