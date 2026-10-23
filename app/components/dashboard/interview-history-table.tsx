"use client";

import React, { useState, useEffect } from "react";
import {
  SortingState,
  PaginationState,
  useReactTable,
  getFilteredRowModel,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import Loader from "../ui/loader";
import { ArrowUp, ArrowDown, ArrowUpDown, History, RefreshCw, ArrowRight } from "lucide-react";
import { FeedBackDialog } from "./feedback-dialog";
import { UseQueryResult } from "@tanstack/react-query";
import type { DevelopmentAction } from "@/app/lib/workplace/development-plans";
import Link from "next/link";

export type InterviewHistoryType = {
  id: string;
  name: string;
  createdAt: string | Date;
  role: string;
  type: string;
  difficultyLevel: string;
  isCompleted?: boolean | null;
  feedBack?: string | null;
  overallScore?: number | null;
  recommendations?: DevelopmentAction[] | null;
};

type InterviewHistoryTableProps = {
  globalFilterValue: string;
  query: UseQueryResult<InterviewHistoryType[], Error>;
};

export const columns: ColumnDef<InterviewHistoryType>[] = [
  {
    accessorKey: "id",
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white p-0 hover:bg-transparent"
        >
          Assessment Title
          {isSorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium text-white">{row.getValue("name")}</div>,
    size: 180,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white p-0 hover:bg-transparent"
        >
          Completion Date
          {isSorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue<Date | string>("createdAt"));
      return (
        <div className="text-xs text-slate-400 font-mono">
          {Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}
        </div>
      );
    },
    size: 130,
  },
  {
    accessorKey: "type",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Competency Focus
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-xs font-medium text-violet-300 bg-violet-950/40 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
        {row.getValue<string>("type") || "General"}
      </span>
    ),
    size: 150,
  },
  {
    accessorKey: "difficultyLevel",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white p-0 hover:bg-transparent"
        >
          Difficulty
          {isSorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue<string>("difficultyLevel") || "Medium";
      const color =
        type === "Easy"
          ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-300"
          : type === "Medium"
          ? "bg-amber-950/60 border-amber-500/30 text-amber-300"
          : type === "Hard"
          ? "bg-rose-950/60 border-rose-500/30 text-rose-300"
          : "bg-slate-800 border-white/10 text-slate-300";

      return (
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}>
          {type}
        </span>
      );
    },
    enableSorting: true,
    size: 110,
  },
  {
    accessorKey: "overallScore",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white p-0 hover:bg-transparent"
        >
          Overall Score
          {isSorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const score = row.original.overallScore;
      if (score == null) return <span className="text-xs text-slate-500">—</span>;
      return (
        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          {score} / 100
        </span>
      );
    },
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "feedBack",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Report
      </span>
    ),
    cell: ({ row }) => (
      <FeedBackDialog
        interviewtitle={row.getValue<string>("name")}
        feedBack={row.original.feedBack ?? "No feedback recorded yet."}
        score={row.original.overallScore}
        recommendations={row.original.recommendations}
      />
    ),
    size: 130,
  },
];

export function InterviewHistoryTable({ globalFilterValue, query }: InterviewHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    setGlobalFilter(globalFilterValue.trim() || "");
    setpagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilterValue]);

  const data = query.data || [];

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    initialState: { columnVisibility: { id: false } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setpagination,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div className="flex min-h-[380px] flex-col justify-between space-y-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md">
      {query.isFetching && !data.length ? (
        <div className="flex justify-center items-center min-h-[300px]" role="status" aria-live="polite">
          <Loader />
        </div>
      ) : query.isError ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center" role="alert">
          <div className="rounded-full bg-rose-950/40 border border-rose-800/40 p-3 text-rose-400">
            <RefreshCw className="h-6 w-6" />
          </div>
          <p className="font-semibold text-white">We couldn’t load your assessment history.</p>
          <p className="text-xs text-slate-400">
            {query.error?.message || "Check your local server connection or Ollama service and try again."}
          </p>
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-xs text-white"
            onClick={() => void query.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="rounded-full bg-violet-950/40 border border-violet-500/30 p-3.5 text-violet-400">
            <History className="h-7 w-7" />
          </div>
          <p className="font-bold text-lg text-white tracking-tight">No completed assessments yet</p>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Complete your first workplace scenario assessment to review multi-dimensional rubric scores, verified answer evidence, and development plans.
          </p>
          <Link
            href="/dashboard?tab=create_interview"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/20 hover:brightness-110 transition-all"
          >
            <span>Start an Assessment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
          <p className="font-semibold text-white">No assessments match your search.</p>
          <p className="text-xs text-slate-400">Try another search keyword or clear the filter.</p>
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-xs text-white"
            onClick={() => setGlobalFilter("")}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id} className="border-b border-white/10 hover:bg-transparent">
                    {group.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="bg-transparent p-3 text-left"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-3.5 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-3">
            <p className="text-xs text-slate-400">
              Page {pagination.pageIndex + 1} of {Math.max(pageCount, 1)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 text-xs border-white/10 bg-slate-800/60 hover:bg-slate-800 text-slate-300"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 text-xs border-white/10 bg-slate-800/60 hover:bg-slate-800 text-slate-300"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
