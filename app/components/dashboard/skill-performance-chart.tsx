"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CompetencyPoint = { type: string; value: number };
type Props = { ChartData?: CompetencyPoint[] };

const chartConfig = {
  value: { label: "Average rubric score", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export function SkillsPerformanceChart({ ChartData = [] }: Props) {
  const hasResults = ChartData.some((item) => item.value > 0);
  return (
    <Card className="min-w-3xs p-0 m-0 z-10 gap-0 flex justify-center items-center h-fit bg-white/60 rounded-4xl">
      <CardHeader className="h-full w-full"><CardTitle className="p-3 pt-5">Workplace Competencies</CardTitle></CardHeader>
      <CardContent className="px-5 w-full">
        {hasResults ? (
          <ChartContainer config={chartConfig} className="w-[280px] md:w-[500px] aspect-square flex justify-center max-h-[320px]">
            <RadarChart data={ChartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="type" />
              <PolarGrid />
              <Radar dataKey="value" name="Average score" fill="var(--color-value)" fillOpacity={0.65} />
            </RadarChart>
          </ChartContainer>
        ) : <p className="px-3 pb-5 text-sm text-muted-foreground">Complete an assessment to see your competency averages.</p>}
      </CardContent>
    </Card>
  );
}
