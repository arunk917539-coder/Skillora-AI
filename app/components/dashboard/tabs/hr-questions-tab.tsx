import React from "react";
import { auth } from "@/app/(auth-pages)/auth";
import { isAuthorizedHr } from "@/app/lib/workplace/hr-authorization";
import { getHrQuestions } from "@/app/lib/workplace/hr-questions";
import HrQuestionsClient from "./hr-questions-client";
import { ShieldAlert, Sparkles } from "lucide-react";

export default async function HrQuestionsTab() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email;
  const isHr = await isAuthorizedHr(userId, email);

  if (!isHr) {
    return (
      <div className="mt-4 w-full rounded-3xl border border-amber-500/25 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-400 mb-2">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          HR Scenario Management
        </h3>
        <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
          This section is restricted to authorized HR team members. To enable access, set your user role to{" "}
          <code className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded font-mono text-violet-300">
            hr
          </code>{" "}
          in the database or configure your email address in the{" "}
          <code className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded font-mono text-violet-300">
            HR_EMAILS
          </code>{" "}
          environment variable.
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
    <div className="w-full flex flex-col gap-6 pb-12 pt-4">
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300 w-fit">
          <Sparkles className="h-3.5 w-3.5" />
          Scenario Administration
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          HR Scenario Management
        </h2>
        <p className="text-xs text-slate-400">
          Create, edit, and maintain custom workplace scenarios and authoritative expected answers for your organization.
        </p>
      </div>
      <HrQuestionsClient initialQuestions={questions} />
    </div>
  );
}
