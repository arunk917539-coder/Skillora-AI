"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function InterviewProgressChart({
  completed = 0,
  inProgress = 0,
  CompletedInterviews,
}: {
  completed?: number;
  inProgress: number;
  CompletedInterviews?: number;
}) {
  const completedCount = completed || CompletedInterviews || 0;
  const inProgressCount = Math.max(0, inProgress);
  const total = completedCount + inProgressCount;
  const percentCompleted = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const data = [
    { name: "Completed", value: completedCount, color: "#10b981" },
    { name: "In Progress", value: inProgressCount, color: "#818cf8" },
  ];

  // If no data exists yet, show placeholder segment
  const displayData = total === 0 ? [{ name: "No data", value: 1, color: "#334155" }] : data;

  return (
    <Card className="flex flex-col border border-white/10 bg-slate-900/70 rounded-2xl p-6 backdrop-blur-md shadow-lg h-[380px] justify-between">
      <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-white tracking-tight">
            Assessment Progress Summary
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Completion ratio across created workplace scenarios
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5">
          {percentCompleted}% Done
        </span>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col items-center justify-center relative">
        <div className="w-full h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="rounded-lg border border-white/10 bg-slate-900/95 px-3 py-1.5 shadow-xl text-xs text-white">
                        <span className="font-semibold">{item.name}:</span> {item.value}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={displayData}
                innerRadius={65}
                outerRadius={88}
                paddingAngle={total > 0 ? 4 : 0}
                dataKey="value"
                stroke="none"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text in donut hole */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {percentCompleted}%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Completed
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full pt-3 flex items-center justify-center gap-6 border-t border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Completed: <strong className="font-mono text-white">{completedCount}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
            <span>In Progress: <strong className="font-mono text-white">{inProgressCount}</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
