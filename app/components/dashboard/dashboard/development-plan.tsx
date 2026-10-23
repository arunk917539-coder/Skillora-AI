import React from "react";
import type { DevelopmentAction } from "@/app/lib/workplace/development-plans";
import { CheckCircle2, Target } from "lucide-react";

export function DevelopmentPlan({ items }: { items: DevelopmentAction[] }) {
  const safeItems = Array.isArray(items)
    ? items.filter(
        (item) =>
          Boolean(
            item &&
              typeof item.label === "string" &&
              typeof item.score === "number" &&
              typeof item.reason === "string" &&
              Array.isArray(item.actions) &&
              item.actions.every((action) => typeof action === "string")
          )
      )
    : [];

  if (!safeItems.length) return null;

  return (
    <section className="space-y-3 rounded-xl border border-white/10 bg-slate-800/40 p-4" aria-labelledby="development-plan-heading">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-violet-400" />
        <div>
          <h4 id="development-plan-heading" className="text-sm font-bold text-white tracking-tight">
            Targeted Development Plan
          </h4>
          <p className="text-[11px] text-slate-400">
            Formative recommendations prioritised for highest skill development impact.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {safeItems.slice(0, 2).map((item) => (
          <article
            key={item.competency}
            className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
              <h5 className="font-semibold text-xs text-white tracking-tight">{item.label}</h5>
              <span className="text-xs font-mono font-bold text-violet-300 bg-violet-950/60 border border-violet-500/20 px-2 py-0.5 rounded-full">
                {item.score} / 100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
            <div className="pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Suggested Actions:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {item.actions.map((action, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
