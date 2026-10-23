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
import { ArrowDown, ArrowUp, ArrowUpDown, ClipboardList, RefreshCw } from "lucide-react";
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

export const difficultyLevelLevels: Record<string, string> = {
  Easy: "Easy",
  Medium: "Medium",
  Hard: "Hard",
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
          className="flex items-center gap-1"
          aria-label={`Sort by name ${sorted === "asc" ? "descending" : "ascending"}`}
        >
          Name
          {sorted === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    size: 180,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="flex items-center gap-1"
          aria-label={`Sort by creation date ${sorted === "asc" ? "descending" : "ascending"}`}
        >
          Created Date
          {sorted === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ row }) => {
      const value = row.getValue<Date | string>("createdAt");
      const date = new Date(value);
      return (
        <div>
          {Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}
        </div>
      );
    },
    size: 140,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.getValue<string>("role")}</div>,
    size: 140,
  },
  {
    accessorKey: "type",
    header: "Category",
    cell: ({ row }) => <div className="capitalize">{row.getValue<string>("type")}</div>,
    size: 140,
  },
  {
    accessorKey: "difficultyLevel",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="flex items-center gap-1"
          aria-label={`Sort by difficulty ${sorted === "asc" ? "descending" : "ascending"}`}
        >
          Difficulty
          {sorted === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.getValue<string>("difficultyLevel") || "Unknown";
      const color =
        level === "Easy"
          ? "bg-teal-100 text-teal-800"
          : level === "Medium"
            ? "bg-amber-100 text-amber-800"
            : level === "Mixed"
              ? "bg-slate-100 text-slate-700"
              : level === "Hard"
                ? "bg-red-100 text-red-800"
                : "bg-slate-100 text-slate-700";

      return (
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${color}`}>
          {level}
        </span>
      );
    },
    enableSorting: true,
    size: 140,
  },
  {
    accessorKey: "isCompleted",
    header: "Action",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.isCompleted;
      if (status === true) {
        return <span className="text-sm text-slate-500">Completed</span>;
      }

      return (
        <Link
          href={`/interview/${row.original.id}`}
          className="inline-flex items-center rounded-full bg-[#1d243c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          Continue assessment
        </Link>
      );
    },
    size: 190,
  },
];

type InterviewTableProps = {
  globalFilterValue: string;
  query: UseQueryResult<MockInterviewType[], Error>;
};

export function MockInterviewTable({
  globalFilterValue,
  query,
}: InterviewTableProps) {
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
    <div className="flex min-h-[400px] flex-col justify-between space-y-4 rounded-3xl bg-white px-4 py-5 sm:px-8">
      {query.isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <Loader />
        </div>
      ) : query.isError ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <RefreshCw className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Couldn&apos;t load assessments
          </h3>
          <p className="max-w-md text-sm text-slate-600">
            {query.error?.message || "Something went wrong while loading your assessments."}
          </p>
          <Button onClick={() => void query.refetch()} disabled={query.isFetching}>
            {query.isFetching ? "Retrying..." : "Try again"}
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="rounded-full bg-indigo-50 p-4 text-indigo-700">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">
            You&apos;re all caught up
          </h3>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            You have no assessments waiting to be completed. Create a new workplace assessment to continue practising your skills.
          </p>
          <Link
            href="/dashboard?tab=create_interview"
            className="inline-flex items-center justify-center rounded-full bg-[#1d243c] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            Create assessment
          </Link>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No matching assessments
          </h3>
          <p className="text-sm text-slate-600">
            Try another search term or clear the search field.
          </p>
          <Button variant="outline" onClick={() => {
            setGlobalFilter("");
          }}>
            Clear search
          </Button>
        </div>
      ) : (
        <>
          {query.isFetching && (
            <p className="text-xs text-slate-500">Refreshing assessments…</p>
          )}
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id}>
                    {group.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="border-b-2 border-dotted border-gray-300 bg-transparent p-3 text-left"
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
                  <TableRow key={row.id} className="border-none hover:bg-[#e7e9fb]">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Page {pagination.pageIndex + 1} of {Math.max(pageCount, 1)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
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
