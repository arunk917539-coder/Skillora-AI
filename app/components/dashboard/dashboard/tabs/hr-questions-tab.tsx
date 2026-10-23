import React from "react";
import { auth } from "@/app/(auth-pages)/auth";
import { isAuthorizedHr } from "@/app/lib/workplace/hr-authorization";
import { getHrQuestions } from "@/app/lib/workplace/hr-questions";
import HrQuestionsClient from "./hr-questions-client";
import { LockKeyhole, Sparkles, ShieldCheck } from "lucide-react";

export default async function HrQuestionsTab() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email;
  const isHr = await isAuthorizedHr(userId, email);

  if (!isHr) {
    return (
      <div className="mt-4 mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Scenario Administration Authorization
            </h3>
            <p className="text-xs text-slate-400">
              Restricted to authorized organization administrators and HR personnel.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 text-xs text-slate-300 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Active Account:</span>
            <span className="font-mono text-slate-200">{email || "Anonymous"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Authorization Level:</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
              Standard User
            </span>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed">
            To enable custom scenario authoring for this organization, request HR administrative access from your system administrator or configure your email in the authorized HR access list.
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          <span>Role-based access control enforced per tenant and user boundaries.</span>
        </div>
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
          Question Bank Management
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Manage Questions
        </h2>
        <p className="text-xs text-slate-400">
          Create, edit, publish, and maintain reusable workplace questions and authoritative evaluation criteria for assignments.
        </p>
      </div>
      <HrQuestionsClient initialQuestions={questions} />
    </div>
  );
}
