import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronLeft, ChevronRight, MoveDown, MoveUp, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageChange: (pageIndex: number, pageSize: number) => void
  searchFields?: (keyof TData)[]
  searchPlaceholder?: string
  search?: string
  onSearchChange?: (value: string) => void
  onSortingChange?: (sorting: SortingState) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  searchFields,
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Internal fallback state in case the parent does not manage `search`
  const [internalSearch, setInternalSearch] = useState(search ?? "")

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      setSorting(next)
      onSortingChange?.(next)
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
      onPageChange(next.pageIndex, next.pageSize)
    },
    manualPagination: true, // server-side pagination
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  // Use the parent-controlled value if onSearchChange is provided,
  // otherwise fall back to the internal state so typing always works.
  const searchValue = onSearchChange ? (search ?? "") : internalSearch

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    setInternalSearch(val) // always update internal state
    onSearchChange?.(val) // also notify parent if callback exists
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {searchFields && (
        <div className="relative w-full sm:max-w-sm">
          {/* pointer-events-none prevents the icon from blocking clicks/focus on the input */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-linear-to-r from-yellow-600 to-yellow-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold select-none whitespace-nowrap"
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() &&
                          ({
                            asc: <MoveUp className="ml-2 w-3 h-3" />,
                            desc: <MoveDown className="ml-2 w-3 h-3" />,
                            false: <ArrowUpDown className="ml-2 w-3 h-3" />,
                          }[header.column.getIsSorted() as string] ??
                            null)}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
