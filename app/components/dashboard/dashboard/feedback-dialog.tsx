import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DevelopmentPlan } from "./development-plan";
import type { DevelopmentAction } from "@/app/lib/workplace/development-plans";
import { FileText, Sparkles } from "lucide-react";

export function FeedBackDialog({
  feedBack,
  interviewtitle,
  score,
  recommendations,
}: {
  feedBack: string;
  interviewtitle: string;
  score?: number | null;
  recommendations?: DevelopmentAction[] | null;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-semibold text-violet-300 shadow-sm transition-all hover:bg-violet-500/20 hover:text-white cursor-pointer">
          <FileText className="h-3 w-3" />
          <span>View Report</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl rounded-2xl border border-white/10 bg-slate-900/95 p-6 backdrop-blur-xl text-white shadow-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Evaluation Feedback
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            {interviewtitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            {score != null ? (
              <span className="font-semibold text-emerald-400 font-mono text-sm">
                Overall score: {score} / 100 ({score}%)
              </span>
            ) : (
              "Assessment feedback report"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-white/5 bg-slate-800/50 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {feedBack}
          </div>

          <DevelopmentPlan items={recommendations ?? []} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-white/5">
            <span>Ollama AI feedback is rubric-based and formative, designed for deliberate workplace practice rather than formal employee evaluations.</span>
            <a href="/privacy" className="text-violet-400 hover:underline shrink-0 font-medium">Request Review</a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
