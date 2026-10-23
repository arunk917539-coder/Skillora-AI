import React from "react";
import { compareProgress, type ProgressRecord } from "@/app/lib/workplace/progress";
import { TrendingUp, Award } from "lucide-react";

export function AssessmentImprovement({ records }: { records: ProgressRecord[] }) {
  const result = compareProgress(records);

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Progress Between Assessments
              {result.available ? (
                <span className="ml-2 text-xs font-normal px-2.5 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300">
                  {result.category}
                </span>
              ) : null}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare initial baseline with latest completed result within the same scenario category.
            </p>
          </div>
        </div>
      </div>

      {!result.available ? (
        <div className="rounded-xl border border-white/5 bg-slate-800/40 p-4 text-xs text-slate-400 text-center">
          {result.message}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {result.changes.map((item) => {
            const isPositive = item.change > 0;
            const isNegative = item.change < 0;

            return (
              <div
                key={item.competency}
                className="rounded-xl border border-white/5 bg-slate-800/60 p-4 space-y-1.5 transition-all hover:border-white/10"
              >
                <p className="text-xs font-medium capitalize text-slate-400">
                  {item.competency.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-2xl font-bold font-mono text-white">
                  {(item.latest / 10).toFixed(1)}
                  <span className="text-xs font-normal text-slate-500"> / 10</span>
                </p>
                <p
                  className={`text-xs font-medium ${
                    isPositive
                      ? "text-emerald-400"
                      : isNegative
                      ? "text-amber-400"
                      : "text-slate-500"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {(item.change / 10).toFixed(1)} pts / 10 vs baseline
                </p>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-slate-500">
        Progress comparisons are indicative formative signals and reflect differences between scenario prompts.
      </p>
    </section>
  );
}
