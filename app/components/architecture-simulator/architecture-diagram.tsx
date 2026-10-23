"use client";

import React from "react";
import { ArchitectureLayerId, TechComponent, SimulationStep, DataConnection } from "./simulator-types";
import { ARCHITECTURE_LAYERS, ARCHITECTURE_COMPONENTS } from "./simulator-data";
import {
  Globe,
  ShieldCheck,
  Server,
  Cpu,
  Database,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  Layers,
  Lock,
} from "lucide-react";

interface ArchitectureDiagramProps {
  activeStep?: SimulationStep;
  selectedComponent: TechComponent | null;
  onSelectComponent: (component: TechComponent) => void;
  presentationMode?: boolean;
}

const LAYER_ICONS: Record<ArchitectureLayerId, React.ComponentType<{ className?: string }>> = {
  frontend: Globe,
  auth: ShieldCheck,
  backend: Server,
  ai_pipeline: Cpu,
  database: Database,
};

export function ArchitectureDiagram({
  activeStep,
  selectedComponent,
  onSelectComponent,
  presentationMode = false,
}: ArchitectureDiagramProps) {
  const activeComponentIds = activeStep?.activeComponentIds || [];
  const activeConnection = activeStep?.activeConnection;

  return (
    <div className="w-full space-y-6">
      {/* Active Data Connection Banner (if step has one) */}
      {activeConnection && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl border border-violet-500/30 bg-violet-950/30 backdrop-blur-md shadow-md animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="flex h-2.5 w-2.5 rounded-full bg-violet-400 animate-ping motion-reduce:animate-none" />
            <span className="font-semibold text-violet-200">Active Data Flow:</span>
            <span className="font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-white text-[11px]">
              {activeConnection.fromId}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-violet-400" />
            <span className="font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-white text-[11px]">
              {activeConnection.toId}
            </span>
          </div>
          <span className="text-[11px] font-mono font-medium text-violet-300 bg-violet-900/50 px-2.5 py-1 rounded-full border border-violet-500/20">
            {activeConnection.label}
          </span>
        </div>
      )}

      {/* Main Layered Architecture Diagram Grid */}
      <div className="space-y-6">
        {ARCHITECTURE_LAYERS.map((layer) => {
          const LayerIcon = LAYER_ICONS[layer.id];
          const componentsInLayer = ARCHITECTURE_COMPONENTS.filter((c) => c.layer === layer.id);

          return (
            <div
              key={layer.id}
              className={`rounded-3xl border ${layer.colorBorder} ${layer.colorBg} p-4 sm:p-6 backdrop-blur-xl transition-all shadow-xl`}
            >
              {/* Layer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80 border border-white/10 text-white shadow-sm">
                    <LayerIcon className={`h-4 w-4 ${layer.colorText}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{layer.name}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">{layer.description}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-slate-900/90 ${layer.colorText} font-medium self-start sm:self-auto`}>
                  {layer.badge}
                </span>
              </div>

              {/* Components in this Layer */}
              <div
                className={`grid gap-3 sm:gap-4 ${
                  presentationMode
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {componentsInLayer.map((comp) => {
                  const isActive = activeComponentIds.includes(comp.id);
                  const isSelected = selectedComponent?.id === comp.id;

                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => onSelectComponent(comp)}
                      aria-pressed={isSelected}
                      className={`relative group flex flex-col justify-between text-left p-4 rounded-2xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? "bg-slate-900/95 border-violet-400 ring-2 ring-violet-500/50 shadow-lg shadow-violet-500/20 scale-[1.02]"
                          : isSelected
                          ? "bg-slate-900/90 border-cyan-400 ring-2 ring-cyan-500/40"
                          : "bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/80"
                      }`}
                    >
                      {/* Active Pulse Glow Indicator */}
                      {isActive && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                          <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500 border-2 border-slate-950" />
                        </span>
                      )}

                      <div className="space-y-2 w-full">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                            {comp.name}
                          </span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 ${
                              comp.status === "runtime_verified"
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                                : comp.status === "implemented"
                                ? "bg-sky-950/80 text-sky-300 border border-sky-500/30"
                                : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {comp.status === "runtime_verified" ? "Verified" : comp.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {comp.summary}
                        </p>
                      </div>

                      {/* Footer: Tech badges & File indicator */}
                      <div className="pt-3 mt-3 border-t border-white/5 w-full flex flex-col gap-1.5">
                        <div className="flex flex-wrap gap-1">
                          {comp.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/5 text-slate-300 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          {comp.filePath.split(",")[0]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
