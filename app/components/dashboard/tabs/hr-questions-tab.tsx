import React from "react";
import { auth } from "@/app/(auth-pages)/auth";
import { isAuthorizedHr } from "@/app/lib/workplace/hr-authorization";
import { getHrQuestions } from "@/app/lib/workplace/hr-questions";
import HrQuestionsClient from "./hr-questions-client";

export default async function HrQuestionsTab() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email;
  const isHr = await isAuthorizedHr(userId, email);

  if (!isHr) {
    return (
      <div className="w-full rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center text-amber-950">
        <h3 className="text-xl font-semibold mb-2">HR Scenario Management</h3>
        <p className="max-w-lg mx-auto text-sm text-amber-900">
          This section is restricted to authorized HR team members. To enable access, set your user role to <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">hr</code> in the database or configure your email address in the <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">HR_EMAILS</code> environment variable.
        </p>
      </div>
    );
  }

  let questions: Awaited<ReturnType<typeof getHrQuestions>> = [];
  try {
    questions = await getHrQuestions();
  } catch (error) {
    console.error("Failed to fetch HR questions in tab", error);
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">HR Scenario Management</h2>
        <p className="text-sm text-muted-foreground">
          Create, edit, and maintain custom workplace scenarios and authoritative expected answers.
        </p>
      </div>
      <HrQuestionsClient initialQuestions={questions} />
    </div>
  );
}
