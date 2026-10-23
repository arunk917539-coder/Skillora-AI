"use client";

import * as React from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ClipboardList, RefreshCw, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Loader from "../ui/loader";
import { UseQueryResult } from "@tanstack/react-query";
import Link from "next/link";

export type MockInterviewType = {
  id: string;
  name: string;
  isCompleted: boolean | null;
  createdAt: Date;
  role: string;
  type: string;
  difficultyLevel: string;
};

export const columns: ColumnDef<MockInterviewType>[] = [
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
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white p-0 hover:bg-transparent"
        >
          Assessment Title
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium text-white">{row.getValue("name")}</div>,
    size: 200,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white p-0 hover:bg-transparent"
        >
          Date Created
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.getValue<Date | string>("createdAt");
      const date = new Date(value);
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
        Competency Area
      </span>
    ),
    cell: ({ row }) => {
      const type = row.getValue<string>("type") || "General";
      const isHr = type === "HR Questions";
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${
            isHr
              ? "bg-gradient-to-r from-violet-950/80 to-indigo-950/80 border-violet-400/40 text-violet-200 shadow-sm"
              : "text-violet-300 bg-violet-950/40 border-violet-500/20"
          }`}
        >
          {type}
        </span>
      );
    },
    size: 150,
  },
  {
    accessorKey: "difficultyLevel",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white p-0 hover:bg-transparent"
        >
          Difficulty
          {sorted === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-violet-400" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.getValue<string>("difficultyLevel") || "Medium";
      const color =
        level === "Easy"
          ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-300"
          : level === "Medium"
          ? "bg-amber-950/60 border-amber-500/30 text-amber-300"
          : level === "Hard"
          ? "bg-rose-950/60 border-rose-500/30 text-rose-300"
          : "bg-slate-800/60 border-white/10 text-slate-300";

      return (
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}>
          {level}
        </span>
      );
    },
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "isCompleted",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Action
      </span>
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.isCompleted;
      if (status === true) {
        return <span className="text-xs text-slate-500">Completed</span>;
      }

      return (
        <Link
          href={`/interview/${row.original.id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <span>Continue</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      );
    },
    size: 140,
  },
];

type InterviewTableProps = {
  globalFilterValue: string;
  query: UseQueryResult<MockInterviewType[], Error>;
};

export function MockInterviewTable({ globalFilterValue, query }: InterviewTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    setGlobalFilter(globalFilterValue.trim());
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  }, [globalFilterValue]);

  const data = query.data ?? [];

  const table = useReactTable({
    columns,
    data,
    state: { sorting, globalFilter, pagination },
    initialState: { columnVisibility: { id: false } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const pageCount = table.getPageCount();

  return (
    <div className="flex min-h-[380px] flex-col justify-between space-y-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md">
      {query.isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : query.isError ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
          <div className="rounded-full bg-rose-950/40 border border-rose-800/40 p-3 text-rose-400">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">Couldn&apos;t load assessments</h3>
          <p className="max-w-md text-xs text-slate-400">
            {query.error?.message || "Something went wrong while loading your assessments."}
          </p>
          <Button
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-xs text-white"
          >
            {query.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="rounded-full bg-violet-950/40 border border-violet-500/30 p-3.5 text-violet-400">
            <ClipboardList className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">You&apos;re all caught up</h3>
          <p className="max-w-md text-xs text-slate-400 leading-relaxed">
            You have no active assessments waiting to be completed. Create a new workplace scenario to continue developing your behavioural skills.
          </p>
          <Link
            href="/dashboard?tab=create_interview"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/20 hover:brightness-110 transition-all"
          >
            <span>Create Assessment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
          <h3 className="text-base font-semibold text-white">No matching assessments</h3>
          <p className="text-xs text-slate-400">
            Try another search term or clear the search field.
          </p>
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
