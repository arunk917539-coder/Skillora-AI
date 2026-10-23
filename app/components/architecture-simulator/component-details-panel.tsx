"use client";

import React from "react";
import { TechComponent } from "./simulator-types";
import {
  X,
  Layers,
  FileCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
} from "lucide-react";

interface ComponentDetailsPanelProps {
  component: TechComponent | null;
  onClose: () => void;
}

export function ComponentDetailsPanel({
  component,
  onClose,
}: ComponentDetailsPanelProps) {
  if (!component) return null;

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-2xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Component Inspector
            </span>
            <span
              className={`text-[10px] uppercase px-2 py-0.5 rounded font-mono font-semibold ${
                component.status === "runtime_verified"
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                  : component.status === "implemented"
                  ? "bg-sky-950/80 text-sky-300 border border-sky-500/30"
                  : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
              }`}
            >
              {component.status === "runtime_verified" ? "Runtime Verified" : component.status}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            {component.name}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-400 mr-1">Stack:</span>
        {component.techStack.map((tech) => (
          <span
            key={tech}
            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-cyan-300 font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Source File Location */}
      <div className="p-3.5 rounded-2xl border border-white/5 bg-slate-950/70 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <FileCode className="h-3.5 w-3.5 text-cyan-400" />
          <span>Source File in Repository:</span>
        </div>
        <div className="text-xs font-mono text-white break-all">
          {component.filePath}
        </div>
      </div>

      {/* Responsibility & Summary */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Core Responsibility
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed">
          {component.responsibility}
        </p>
      </div>

      {/* I/O Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Inputs Accepted:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {component.inputDescription}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Outputs Produced:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {component.outputDescription}
          </p>
        </div>
      </div>

      {/* Dependencies */}
      <div className="space-y-1.5 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Key Dependencies
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {component.dependencies.map((dep, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/5 text-slate-400"
            >
              {dep}
            </span>
          ))}
        </div>
      </div>

      {/* Code Snippet (if available) */}
      {component.sampleSnippet && (
        <div className="space-y-1.5 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span>Implementation Pattern:</span>
          </h4>
          <div className="p-3 rounded-xl bg-black/70 border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
            <pre>{component.sampleSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
