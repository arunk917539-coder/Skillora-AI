import { redirect } from "next/navigation";
import { auth } from "@/app/(auth-pages)/auth";
import { prisma } from "@/prisma/prisma";
import InterviewContent from "@/app/components/interview/interview-content";

export default async function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const assessment = await prisma.interview.findFirst({ where: { id, userId: session.user.id }, include: { feedBack: true } });
  if (!assessment) redirect("/dashboard");

  const safeAssessment = JSON.parse(JSON.stringify(assessment));
  // Security guardrail: Do not expose reference/expected answers to candidates before completion
  if (!safeAssessment.isCompleted) {
    safeAssessment.expectedAnswers = [];
  }

  return <InterviewContent assessment={safeAssessment} />;
}
