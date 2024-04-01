"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Table } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DivergentColumn } from "@/types/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData, TValue> {
  table: Table<TData>
  columns: DivergentColumn<TData, TValue>[]
}

export function DataTableViewOptions<TData, TValue>({
  table,
  columns,
}: DataTableViewOptionsProps<TData, TValue>) {
  const { t } = useTranslation("components")

  const visibleColumnCount = table.getAllColumns().filter((column) => {
    return column.getIsVisible()
  }).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <SlidersHorizontal className="mr-2 size-4" />
          {t("table.toolbar.view")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{t("table.toolbar.columns")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                disabled={visibleColumnCount === 2 && column.getIsVisible()}
              >
                {
                  columns.find((c: any) => {
                    return c.accessorKey?.replace(".", "_") === column.id
                  })?.title
                }
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
