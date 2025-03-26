"use client"

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { FolderOpen } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DivergentColumn } from "@/types/table"

import { Skeleton } from "../skeleton"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: DivergentColumn<TData, TValue>[]
  data: TData[]
  loading: boolean
  selectable?: boolean
  onSelectedRowsChange?: (rows: TData[]) => void
  children?: React.ReactNode
  tableRef?: any
}

const DataTable = <TData, TValue>({
  columns,
  data,
  loading,
  selectable,
  onSelectedRowsChange,
  children,
  tableRef,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState<string>("")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { t } = useTranslation("components")

  const table = useReactTable({
    data,
    //@ts-ignore
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: selectable,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
  })
  if (tableRef) {
    tableRef.current = table
  }

  React.useEffect(() => {
    if (onSelectedRowsChange) {
      onSelectedRowsChange(
        table.getSelectedRowModel().flatRows.map((row) => row.original)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])

  React.useEffect(() => {
    const newColumnVisibility = { ...columnVisibility };

    columns.forEach((column: any) => {
      const meta = column.meta;
      if (meta && meta.hidden) {
        newColumnVisibility[column.accessorKey] = false;
      }
    });

    setColumnVisibility(newColumnVisibility);
  }, [columns]);

  return (
    <div className="data-table space-y-4">
      <div className="flex items-center justify-between">
        <div className="pl-8">{children}</div>
        <DataTableToolbar
          table={table}
          columns={columns}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      <div className="border-y">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && (
              <>
                {[...Array(10)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(columns.length)].map((_, t) => (
                      <TableCell key={t}>
                        <Skeleton className="h-[20px] w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
            {!loading && (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-72 text-center"
                    >
                      <FolderOpen className="mx-auto mb-2 size-12 text-black/50 dark:text-white/80" />
                      {t("table.no_records")}
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} selectable={selectable} />
    </div>
  )
}

export default DataTable
