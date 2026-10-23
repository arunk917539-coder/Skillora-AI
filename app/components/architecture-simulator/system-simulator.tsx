"use client";

import React, { useState, useEffect, useRef } from "react";
import { SIMULATION_SCENARIOS, ARCHITECTURE_COMPONENTS } from "./simulator-data";
import { SimulationScenario, TechComponent } from "./simulator-types";
import { SimulatorControls } from "./simulator-controls";
import { ArchitectureDiagram } from "./architecture-diagram";
import { StepNarrativeCard } from "./step-narrative-card";
import { ComponentDetailsPanel } from "./component-details-panel";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Award,
  HelpCircle,
  ExternalLink,
  Lock,
  Zap,
  Info,
} from "lucide-react";

export function SystemSimulator() {
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>(SIMULATION_SCENARIOS[3]); // Start with Scenario 4 (Flagship AI Pipeline)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3500);
  const [selectedComponent, setSelectedComponent] = useState<TechComponent | null>(null);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = activeScenario.steps[currentStepIndex];

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < activeScenario.steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, playbackSpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeScenario, playbackSpeed]);

  const handleSelectScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className={`w-full transition-all ${presentationMode ? "fixed inset-0 z-50 bg-[#07090e] overflow-y-auto p-4 sm:p-8" : "space-y-10"}`}>
      {/* Simulator Hero & Hackathon Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-600/20 text-violet-300 border border-violet-500/30">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Technical Architecture Visualizer
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300">
              Ollama Engine: <code className="text-violet-300">qwen3:4b</code> (Local On-Device)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Skillora AI — System Architecture Simulator
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Interactive, judge-ready walkthrough demonstrating how Skillora AI solves workplace behavioural screening through local privacy-preserving LLM evaluation, schema defense, evidence verification, and bounded rubric scoring.
          </p>
        </div>

        {/* Quick Pitch & Legend Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowPitchModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-violet-500/25 transition-all cursor-pointer"
          >
            <Award className="h-4 w-4" />
            <span>Judge Pitch Highlights</span>
          </button>
        </div>
      </div>

      {/* Simulator Controls & Scenario Selector */}
      <SimulatorControls
        scenarios={SIMULATION_SCENARIOS}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        currentStepIndex={currentStepIndex}
        onStepChange={setCurrentStepIndex}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={handleReset}
        presentationMode={presentationMode}
        onTogglePresentationMode={() => setPresentationMode(!presentationMode)}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
      />

      {/* Main Split Grid: Narrative Card & Architecture Diagram */}
      <div className="space-y-8">
        {/* Active Step Narrative Card */}
        {currentStep && (
          <StepNarrativeCard
            scenario={activeScenario}
            step={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={activeScenario.steps.length}
          />
        )}

        {/* Component Inspector Modal / Drawer (if user clicked a component) */}
        {selectedComponent && (
          <ComponentDetailsPanel
            component={selectedComponent}
            onClose={() => setSelectedComponent(null)}
          />
        )}

        {/* Layered Block Diagram */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-violet-400" />
              <span>Full Stack Component Topology</span>
            </h2>
            <span className="text-xs text-slate-400">
              Click any component to inspect its implementation dossier
            </span>
          </div>

          <ArchitectureDiagram
            activeStep={currentStep}
            selectedComponent={selectedComponent}
            onSelectComponent={(comp) => setSelectedComponent(comp)}
            presentationMode={presentationMode}
          />
        </div>
      </div>

      {/* Architecture Status Legend & Tenancy Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Verification Status Legend</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span><strong>Runtime Verified:</strong> Executed & proven by test suite or live run.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span><strong>Source Confirmed:</strong> Verified directly from inspected codebase.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span><strong>Proposed:</strong> Planned enhancement, clearly marked.</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white">
            <Cpu className="h-4 w-4 text-violet-400" />
            <span>Zero-Cloud AI Privacy Guarantee</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Candidate responses never leave the host machine. The AI pipeline runs strictly on local Ollama (<code className="text-violet-300 font-mono">qwen3:4b</code>) at <code className="text-slate-400 font-mono">127.0.0.1:11434</code>.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>Bounded Scoring & Defense</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Strict contradiction detection prevents hallucinated inflated scores. Non-responsive answers (e.g. "all is well") are strictly penalized to &le; 15/100.
          </p>
        </div>
      </div>

      {/* Judge Pitch Highlights Modal */}
      {showPitchModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl my-auto rounded-3xl border border-violet-500/30 bg-slate-900/95 p-6 sm:p-8 space-y-6 shadow-2xl text-left">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-violet-400 font-bold flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  <span>Hackathon Pitch Card</span>
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Why Skillora AI's Architecture Wins
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPitchModal(false)}
                className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-slate-800 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-200 leading-relaxed">
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 space-y-1">
                <h4 className="font-bold text-emerald-300 text-sm">1. 100% Local Privacy & Compliance</h4>
                <p className="text-slate-300 text-[11px]">
                  Traditional recruitment screening sends sensitive candidate essays to third-party proprietary APIs (e.g. OpenAI). Skillora AI runs self-hosted Ollama with local Qwen3:4b. No candidate reflections or company rubrics ever leave the firewall.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-violet-500/30 bg-violet-950/30 space-y-1">
                <h4 className="font-bold text-violet-300 text-sm">2. Defense-in-Depth Schema & Evidence Verification</h4>
                <p className="text-slate-300 text-[11px]">
                  We never trust raw LLM output. Our pipeline strips reasoning tags, validates typed JSON schemas with single-retry recovery, verifies that cited evidence quotes exist word-for-word in candidate text, and strictly bounds scores (0–100).
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 space-y-1">
                <h4 className="font-bold text-cyan-300 text-sm">3. Zero Data Loss & Fault-Tolerant Pre-Persistence</h4>
                <p className="text-slate-300 text-[11px]">
                  Before launching multi-second local LLM evaluation, preliminary candidate answers are immediately persisted to PostgreSQL. If inference is interrupted, answers remain safely stored. Atomic transactions prevent duplicate submissions.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/30 space-y-1">
                <h4 className="font-bold text-amber-300 text-sm">4. Live Evaluation UX & Honest Estimation</h4>
                <p className="text-slate-300 text-[11px]">
                  Candidate anxiety is eliminated via a fixed z-[100] modal overlay featuring an accurate running wall-clock timer starting at 00:00, real stage messaging, and honest time estimation without fake progress percentages.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPitchModal(false)}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Got It, Return to Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
