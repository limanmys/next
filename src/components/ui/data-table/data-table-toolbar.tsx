import { useEffect, useState } from "react"
import { Table } from "@tanstack/react-table"
import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DivergentColumn } from "@/types/table"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>
  columns: DivergentColumn<TData, TValue>[]
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

export function DataTableToolbar<TData, TValue>({
  table,
  columns,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData, TValue>) {
  const { t } = useTranslation("components")

  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  useEffect(() => {
    setIsFiltered(
      table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length
    )
  }, [
    table.getPreFilteredRowModel().rows.length,
    table.getFilteredRowModel().rows.length,
  ])

  return (
    <div className="flex items-center justify-between px-8">
      <div></div>
      <div className="flex space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          {isFiltered && (
            <Button
              variant="outline"
              onClick={() => {
                table.resetColumnFilters()
                table.resetGlobalFilter()
              }}
              className="h-8 px-2 lg:px-3"
            >
              {t("table.toolbar.clear_filters")}
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}

          <div className="relative">
            <Input
              placeholder={t("table.toolbar.search_placeholder")}
              value={globalFilter ?? ""}
              onChange={(e) => {
                setGlobalFilter(String(e.target.value))
              }}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <Search className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <DataTableViewOptions table={table} columns={columns} />
      </div>
    </div>
  )
}
