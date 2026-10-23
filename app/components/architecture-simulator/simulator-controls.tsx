"use client";

import React from "react";
import { SimulationScenario } from "./simulator-types";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sliders,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface SimulatorControlsProps {
  scenarios: SimulationScenario[];
  activeScenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export function SimulatorControls({
  scenarios,
  activeScenario,
  onSelectScenario,
  currentStepIndex,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onReset,
  presentationMode,
  onTogglePresentationMode,
  playbackSpeed,
  onChangeSpeed,
}: SimulatorControlsProps) {
  const steps = activeScenario.steps;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="space-y-4">
      {/* 1. Workflow Scenario Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-violet-400" />
          <span>Workflows:</span>
        </span>
        {scenarios.map((sc) => {
          const isSelected = sc.id === activeScenario.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 border border-violet-400/40 font-semibold"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5"
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                isSelected ? "bg-white text-violet-900" : "bg-slate-800 text-slate-400"
              }`}>
                {sc.number}
              </span>
              <span>{sc.shortTitle}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected ? "bg-violet-800 text-violet-200" : "bg-slate-800/80 text-slate-400"
              }`}>
                {sc.totalSteps} steps
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Playback Toolbar & Timeline */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-md">
        {/* Playback Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            title="Reset to Step 1"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={isFirstStep}
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            title="Previous Step"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 h-9 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isLastStep}
            onClick={() => onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
            title="Next Step"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Speed Selector */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-white/10 text-xs text-slate-400">
            <span>Speed:</span>
            {[
              { label: "1x", val: 3500 },
              { label: "1.5x", val: 2000 },
              { label: "0.7x", val: 5000 },
            ].map((spd) => (
              <button
                key={spd.label}
                type="button"
                onClick={() => onChangeSpeed(spd.val)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                  playbackSpeed === spd.val
                    ? "bg-violet-600 text-white font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Breadcrumb Numbers */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => onStepChange(idx)}
                className={`relative flex items-center justify-center h-8 min-w-[2rem] px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-violet-600 text-white ring-2 ring-violet-400 shadow-md scale-105"
                    : isPassed
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-white/5"
                }`}
                title={`Step ${step.stepNumber}: ${step.title}`}
              >
                {step.stepNumber}
              </button>
            );
          })}
        </div>

        {/* Presentation Mode Toggle */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onTogglePresentationMode}
            className={`flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              presentationMode
                ? "bg-violet-950 border-violet-500/50 text-violet-200"
                : "bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {presentationMode ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Exit Presentation</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Presentation Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
