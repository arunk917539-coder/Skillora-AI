import { SortingState, PaginationState, useReactTable, getFilteredRowModel, getCoreRowModel, getSortedRowModel, getPaginationRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '../ui/table';
import Loader from '../ui/loader';
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown, Link } from 'lucide-react';
import { FeedBackDialog } from './feedback-dialog';
import { UseQueryResult } from '@tanstack/react-query';
import type { DevelopmentAction } from '@/app/lib/workplace/development-plans';

export type InterviewHistoryType = {
  id: string;
  name: string;
  createdAt: string | Date;
  role: string;
  type: string;
  difficultyLevel: string;
  isCompleted?: boolean | null;
  feedBack?: string;
  overallScore?: number | null;
  recommendations?: DevelopmentAction[] | null;
};

type InterviewHistoryTableProps = {
  globalFilterValue: string,
  query: UseQueryResult<any, Error>;
};

export const columns: ColumnDef<InterviewHistoryType>[] = [
  {
    accessorKey: "id",
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableHiding: true,
  }
  ,
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const handleSort = () => column.toggleSorting(isSorted === "asc");

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          className="flex items-center gap-1"
          aria-label={`Sort by CreatedAt ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          Name
          {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
          {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
    size: 100
  }
  ,
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const handleSort = () => column.toggleSorting(isSorted === "asc");

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          className="flex items-center gap-1"
          aria-label={`Sort by CreatedAt ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          Created Date
          {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
          {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ row }) => <div className="lowercase">{(new Date(row.getValue<Date | string>("createdAt"))).toLocaleDateString()}</div>,
    size: 100

  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        "Assessment Area"
      )
    },
    cell: ({ row }) => <div>{row.getValue<string>("role") || "Workplace Behaviour"}</div>,
    size: 100

  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        "Scenario Category"
      )
    },
    cell: ({ row }) => <div>{row.getValue<string>("type") || "General"}</div>,
    size: 100

  },
  {
    accessorKey: "difficultyLevel",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      const handleSort = () => column.toggleSorting(isSorted === "asc");

      return (
        <Button
          variant="ghost"
          onClick={handleSort}
          className="flex items-center gap-1"
          aria-label={`Sort by CreatedAt ${isSorted === "asc" ? "descending" : "ascending"}`}
        >
          Difficulty Level
          {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
          {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          {!isSorted && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue<string>("difficultyLevel");
      return (
        <div className={`flex rounded-4xl max-w-[120px] justify-center items-center text-center ${type == "Easy" ? "bg-[#46c6c2]" : type == "Medium" ? "bg-[#ffb700]" : type == "Mixed" ? "bg-slate-200" : "bg-[#f63737]"}`}>
          <span className="text-center p-2 ">{row.getValue("difficultyLevel")}</span>
        </div>
      )
    },
    enableSorting: true,
    enableResizing: true,
    size: 100,
    maxSize: 100,
  },
  {
    accessorKey: "feedBack",
    header: () => "Feedback",
    cell: ({ row }) => <FeedBackDialog interviewtitle={row.getValue<string>("name")} feedBack={row.original.feedBack ?? "No feedback available yet."} score={row.original.overallScore} recommendations={row.original.recommendations} />,
  }
]

export function InterviewHistoryTable({ globalFilterValue, query }: InterviewHistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  useEffect(() => {
    setGlobalFilter(globalFilterValue.trim() || "");
  }, [globalFilterValue]);


  const table = useReactTable({
    columns,
    data: query.data || [],
    state: {
      sorting,
      globalFilter,
      pagination
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

  return (
    <div className="space-y-4 bg-white min-h-[465px] flex flex-col justify-between px-10 py-4 rounded-4xl z-50">
      {query.isFetching ? (
        <div className="flex justify-center items-center min-h-[400px]" role="status" aria-live="polite">
          <Loader />
        </div>
      ) : query.isError ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center" role="alert">
          <p className="font-semibold">We couldn’t load your assessment history.</p>
          <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
          <Button variant="outline" onClick={() => void query.refetch()}>Try again</Button>
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
          <p className="font-semibold">{globalFilter ? "No assessments match your search." : "No assessments yet."}</p>
          <p className="text-sm text-muted-foreground">{globalFilter ? "Try another search or clear the filter." : "Create a workplace scenario assessment to get your first feedback report."}</p>
          {globalFilter ? <Button variant="outline" onClick={() => setGlobalFilter("")}>Clear search</Button> : null}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
          <Table className="w-full h-full overflow-auto">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: header.getSize() }} className="p-2 bg-transparent text-left border-b-2  border-gray-400 border-dotted">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="h-full">
              {table.getRowModel().rows.map((row) => (
                <TableRow className="p-4 border-none rounded-[45px] hover:bg-[#e7e9fb]" key={row.id}>
                  {row.getVisibleCells().map((cell, i) => {
                    const isFirst = i === 0;
                    const isLast = i === row.getVisibleCells().length - 1;

                    return (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`p-4 ${isFirst ? 'rounded-l-[45px]' : ''} ${isLast ? 'rounded-r-[45px]' : ''}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
            </div>
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


