"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { Layers, CheckCircle2, Clock } from "lucide-react";

type DashboardHeaderProps = {
  completedInterViews: number;
  totalInterViews: number;
  userName?: string | null;
};

const DashboardTabHeader = (props: DashboardHeaderProps) => {
  const session = useSession();

  const total = Math.max(0, props.totalInterViews);
  const completed = Math.min(total, Math.max(0, props.completedInterViews));
  const inProgress = total - completed;

  // Use server-provided name first to prevent hydration mismatch
  const displayName = props.userName ?? session.data?.user?.name;

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const metrics = [
    {
      label: "Total assessments",
      value: formatNumber(total),
      description: "All assessments created",
      icon: Layers,
      accent: "text-cyan-400 border-cyan-500/30 bg-cyan-950/30",
      glow: "from-cyan-500/10 to-transparent",
    },
    {
      label: "Completed",
      value: formatNumber(completed),
      description: "Evaluated with AI",
      icon: CheckCircle2,
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30",
      glow: "from-emerald-500/10 to-transparent",
    },
    {
      label: "In progress",
      value: formatNumber(inProgress),
      description: "Scenarios awaiting completion",
      icon: Clock,
      accent: "text-violet-400 border-violet-500/30 bg-violet-950/30",
      glow: "from-violet-500/10 to-transparent",
    },
  ];

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300 w-fit">
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
          Skillora AI Workspace
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Welcome back{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="text-sm text-slate-400 md:text-base">
          Track your workplace behavioural assessment activity, rubric signals, and competency development.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-white/20 hover:bg-slate-900/90 hover:-translate-y-0.5"
            >
              {/* Subtle accent glow */}
              <div
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${metric.glow} blur-xl`}
              />

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {metric.label}
                </span>
                <div className={`p-2 rounded-xl border ${metric.accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white mb-1">
                {metric.value}
              </div>

              <p className="text-xs text-slate-400">{metric.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardTabHeader;
