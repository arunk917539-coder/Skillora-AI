"use client";

import React, { useState } from "react";
import { MockInterviewTable } from "../mock-interview-table";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Input } from "../../ui/input";
import { useQuery } from "@tanstack/react-query";
import { FetchMockInterviews } from "@/hooks/react-query/functions";
import { QueryKeys } from "@/hooks/react-query/keys";
import { Search } from "lucide-react";

const MockInterviewTab = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const queryResult = useQuery({
    queryKey: [QueryKeys.fetch_interview],
    queryFn: FetchMockInterviews,
    staleTime: 15 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: false,
  });

  return (
    <Card className="mt-4 flex flex-col border border-white/10 bg-slate-900/75 p-4 sm:p-6 rounded-3xl backdrop-blur-xl shadow-2xl w-full gap-4">
      <CardHeader className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-0 gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Workplace Assessments</h2>
          <p className="text-xs text-slate-400">Manage and complete your active workplace scenarios.</p>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            className="h-10 pl-10 pr-4 rounded-full border border-white/10 bg-slate-800/80 text-sm text-white placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 w-full sm:w-72"
            placeholder="Search active scenarios…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="w-full p-0">
        <MockInterviewTable globalFilterValue={globalFilter} query={queryResult} />
      </CardContent>
    </Card>
  );
};

export default MockInterviewTab;
