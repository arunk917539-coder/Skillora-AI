"use client";

import React, { useState } from "react";
import { SimulationStep, SimulationScenario } from "./simulator-types";
import {
  HelpCircle,
  Code,
  CheckCircle2,
  FileCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StepNarrativeCardProps {
  scenario: SimulationScenario;
  step: SimulationStep;
  stepIndex: number;
  totalSteps: number;
}

export function StepNarrativeCard({
  scenario,
  step,
  stepIndex,
  totalSteps,
}: StepNarrativeCardProps) {
  const [showPayload, setShowPayload] = useState(true);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-5">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
              Step {step.stepNumber} of {totalSteps}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {scenario.title}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {step.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-lg font-mono font-semibold uppercase tracking-wider ${
              step.verifiedStatus === "runtime_verified"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                : step.verifiedStatus === "implemented"
                ? "bg-sky-950/80 text-sky-300 border border-sky-500/30"
                : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
            }`}
          >
            {step.verifiedStatus === "runtime_verified"
              ? "Runtime Verified"
              : step.verifiedStatus === "implemented"
              ? "Source Confirmed"
              : "Proposed"}
          </span>
        </div>
      </div>

      {/* Triad of Explanations: What, Why, Next */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. What is happening? */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-300">
            <Sparkles className="h-4 w-4 text-violet-400 shrink-0" />
            <span>1. What is happening?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {step.description}
          </p>
        </div>

        {/* 2. Why does this matter? */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <HelpCircle className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>2. Why this matters</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {step.whyItMatters}
          </p>
        </div>

        {/* 3. What happens next? */}
        <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>3. What happens next</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {step.whatHappensNext}
          </p>
        </div>
      </div>

      {/* Verified Repository Source Files */}
      <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileCode className="h-3.5 w-3.5 text-slate-400" />
            <span>Inspected Source Code References:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {step.sourceFiles.length} file{step.sourceFiles.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {step.sourceFiles.map((sf, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/90 text-xs font-mono text-slate-200"
            >
              <span className="text-violet-400 font-bold">{sf.path}</span>
              {sf.lines && (
                <span className="text-[11px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">
                  {sf.lines}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Synthetic Payload Inspector (if step contains sampleData) */}
      {step.samplePayload && (
        <div className="rounded-2xl border border-violet-500/20 bg-slate-950/80 overflow-hidden shadow-inner">
          <button
            type="button"
            onClick={() => setShowPayload(!showPayload)}
            className="w-full flex items-center justify-between p-3.5 bg-slate-900/90 hover:bg-slate-900 text-left text-xs font-medium text-slate-300 border-b border-white/5 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-violet-400" />
              <span className="font-bold text-white">{step.samplePayload.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950 border border-violet-500/30 text-violet-300">
                {step.samplePayload.type}
              </span>
            </div>
            {showPayload ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {showPayload && (
            <div className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-300 bg-black/60 leading-relaxed">
              <pre>{step.samplePayload.content}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
