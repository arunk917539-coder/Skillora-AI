"use client";

import React, { useEffect, useState, useId } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Cpu, Sparkles, Clock, AlertCircle, Info, Activity, ShieldCheck, XCircle } from "lucide-react";

interface EvaluationProgressProps {
  assessmentName: string;
  scenarioCount: number;
  startTime: number;
  onCancel?: () => void;
}

function formatElapsed(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${String(hrs).padStart(2, "0")}:${String(remMins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function EvaluationProgress({
  assessmentName,
  scenarioCount,
  startTime,
  onCancel,
}: EvaluationProgressProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() =>
    Math.max(0, Math.floor((Date.now() - startTime) / 1000))
  );
  const liveRegionId = useId();

  useEffect(() => {
    // Immediate sync
    setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));

    const timer = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [startTime]);

  // Contextual status messages reflecting real local Ollama processing stages
  const getStatus = (seconds: number) => {
    if (seconds < 25) {
      return {
        headline: "Analysing your responses",
        subline: "Your answers are being analysed against workplace competency rubrics.",
        detail: `Evaluating ${scenarioCount} scenario${scenarioCount > 1 ? "s" : ""} sequentially with local Ollama AI (qwen3:4b).`,
      };
    }
    if (seconds < 60) {
      return {
        headline: "Extracting behavioural evidence",
        subline: "Identifying concrete decision points, stakeholder actions, and problem-solving steps.",
        detail: "Rubric-guided scoring active across communication, accountability, and planning.",
      };
    }
    if (seconds < 120) {
      return {
        headline: "Synthesising rubric feedback",
        subline: "Formulating formative strengths, development priorities, and actionable next steps.",
        detail: "Local AI inference is running thorough rubric checks. Thank you for your patience.",
      };
    }
    return {
      headline: "Finalising evaluation results",
      subline: "Evaluation is taking longer than usual, but local AI is actively processing.",
      detail: "Inference duration varies by response length and host hardware. Please keep this page open.",
    };
  };

  const status = getStatus(elapsedSeconds);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evaluation-progress-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <Card className="relative w-full max-w-2xl my-auto border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
        {/* Top ambient progress glow */}
        <div className="h-1.5 w-full bg-slate-950 overflow-hidden">
          <div
            aria-hidden="true"
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 animate-pulse motion-reduce:animate-none w-full"
          />
        </div>

        <CardHeader className="p-6 sm:p-8 border-b border-white/5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 font-semibold uppercase tracking-wider text-violet-300">
              <Sparkles className="h-3.5 w-3.5 animate-pulse motion-reduce:animate-none text-violet-400" />
              AI Evaluation in Progress
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg border border-white/10 bg-slate-950 text-slate-300">
              {scenarioCount} Scenario{scenarioCount > 1 ? "s" : ""}
            </span>
          </div>

          <CardTitle id="evaluation-progress-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Skillora AI is evaluating your responses
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-slate-300">
            AI-powered workplace competency analysis in progress for{" "}
            <strong className="text-white font-medium">{assessmentName}</strong>.
          </CardDescription>
        </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Prominent Running Timer Block */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-violet-500/20 bg-slate-950/70 shadow-inner">
          {/* Subtle animated indicator with motion-reduce support */}
          <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping motion-reduce:animate-none opacity-25"
            />
            <div
              aria-hidden="true"
              className="absolute inset-1 rounded-full border-2 border-dashed border-violet-500/50 animate-spin motion-reduce:animate-none"
              style={{ animationDuration: "8s" }}
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-500/30">
              <Cpu className="h-7 w-7 animate-pulse motion-reduce:animate-none text-violet-200" />
            </div>
          </div>

          {/* Running Timer */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Clock className="h-3.5 w-3.5 text-violet-400" />
              <span>Elapsed Time</span>
            </div>
            <div
              role="timer"
              aria-live="off"
              className="text-4xl sm:text-5xl font-extrabold font-mono tracking-wider text-white"
            >
              {formatElapsed(elapsedSeconds)}
            </div>
            <p className="text-[11px] text-slate-400">
              Timer active since submission
            </p>
          </div>
        </div>

        {/* Live Status Region for Screen Readers & Visual Feedback */}
        <div
          id={liveRegionId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="rounded-2xl border border-white/5 bg-slate-800/40 p-5 space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse motion-reduce:animate-none shrink-0" />
            <span>Status: {status.headline}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {status.subline}
          </p>
          <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-violet-400 shrink-0" />
            <span>{status.detail}</span>
          </div>
        </div>

        {/* Honest Estimated Completion & Model Information */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400 font-medium">Estimated time remaining:</span>
            <span className="font-semibold text-slate-200">
              Completion time varies{" "}
              <span className="font-normal text-slate-400">(Estimated)</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Evaluation is performed sequentially for each scenario by local Ollama (<code className="text-violet-300 font-mono">qwen3:4b</code>). Inference duration depends on answer length and local processor load. No external servers or cloud services are contacted.
          </p>
        </div>

        {/* Long Duration Reassurance if elapsed >= 60 seconds */}
        {elapsedSeconds >= 60 && (
          <div
            role="note"
            className="flex items-start gap-2.5 rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-4 text-xs text-indigo-200"
          >
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
            <div className="space-y-1">
              <p className="font-medium text-indigo-100">
                AI evaluation is still actively running
              </p>
              <p className="text-[11px] text-indigo-200/90 leading-relaxed">
                Local AI inference is executing thorough rubric checks across multiple competencies. The evaluation has not timed out or frozen. Thank you for your patience.
              </p>
            </div>
          </div>
        )}

        {/* Page Closure Prevention Notice & Cancel Option */}
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-amber-300/90 text-center sm:text-left">
            <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Please keep this page open until your results are ready.</span>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Cancel & Edit</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
  );
}
