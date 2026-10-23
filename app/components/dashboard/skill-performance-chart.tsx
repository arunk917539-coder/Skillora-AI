"use client";

import React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Target } from "lucide-react";

type CompetencyPoint = { type: string; value: number };
type Props = { ChartData?: CompetencyPoint[] };

export function SkillsPerformanceChart({ ChartData = [] }: Props) {
  const hasResults = ChartData.some((item) => item.value > 0);

  return (
    <Card className="flex flex-col border border-white/10 bg-slate-900/70 rounded-2xl p-6 backdrop-blur-md shadow-lg h-[380px] justify-between">
      <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-white tracking-tight">
            Workplace Competencies
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Average rubric scores across 5 core competency dimensions
          </p>
        </div>
        <div className="p-2 rounded-xl border border-violet-500/30 bg-violet-950/30 text-violet-400">
          <Target className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex items-center justify-center">
        {hasResults ? (
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={ChartData} outerRadius="75%">
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="type"
                  tick={{ fill: "#cbd5e1", fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      return (
                        <div className="rounded-lg border border-white/10 bg-slate-900/95 px-3 py-1.5 shadow-xl text-xs text-white">
                          <span className="font-semibold">{item.name}:</span> {item.value} / 100
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Radar
                  name="Average Score"
                  dataKey="value"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
            <p className="text-sm font-medium text-slate-300">
              No competency scores recorded yet
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              Complete your first workplace scenario assessment to generate your multi-dimensional competency radar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
