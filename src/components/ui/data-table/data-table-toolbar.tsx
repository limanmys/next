import { Row, Table } from "@tanstack/react-table"
import { download, generateCsv, mkConfig } from "export-to-csv"
import { DownloadCloud, Search, X } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options"
import { Input } from "@/components/ui/input"
import { DivergentColumn } from "@/types/table"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip"

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

  const router = useRouter()

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: `${router.asPath}-${new Date()}`,
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  })

  const exportExcel = (rows: Row<any>[]) => {
    const rowData = rows.map((row) => row.original)
    const csv = generateCsv(csvConfig)(rowData)
    download(csvConfig)(csv)
  }

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
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-8 lg:flex cursor-pointer"
                  onClick={() => exportExcel(table.getFilteredRowModel().rows)}
                >
                  <DownloadCloud className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tabloyu dışa aktar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
              <X className="ml-2 size-4" />
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
            <Search className="absolute right-2 top-2 size-4 text-gray-400" />
          </div>
        </div>
        <DataTableViewOptions table={table} columns={columns} />
      </div>
    </div>
  )
}
