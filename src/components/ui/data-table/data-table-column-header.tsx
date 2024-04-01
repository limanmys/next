import { Column } from "@tanstack/react-table"
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "../input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  filterPresets,
  showFilterAsSelect,
}: DataTableColumnHeaderProps<TData, TValue> & {
  filterPresets?: {
    key: string
    value: string
  }[]
  showFilterAsSelect?: boolean
}) {
  const { t } = useTranslation("components")

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <>
      <div className={cn("mt-1 flex items-center space-x-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex h-8 items-center justify-center data-[state=open]:bg-accent data-[state=open]:text-white">
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <SortDesc className="ml-2 size-4" />
              ) : column.getIsSorted() === "asc" ? (
                <SortAsc className="ml-2 size-4" />
              ) : (
                <ChevronsUpDown className="ml-2 size-4" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <SortAsc className="mr-2 size-3.5" />
              {t("table.column.asc")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <SortDesc className="mr-2 size-3.5" />
              {t("table.column.desc")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 size-3.5" />
              {t("table.column.hide")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!filterPresets && (
        <Input
          className="mb-3 h-8"
          value={(column.getFilterValue() as string) ?? ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
        />
      )}
      {filterPresets && (
        <div className="mb-3 flex gap-2">
          {showFilterAsSelect && (
            <>
              <Select
                defaultValue={(column.getFilterValue() as string) ?? ""}
                value={(column.getFilterValue() as string) ?? ""}
                onValueChange={(value) => column.setFilterValue(value)}
              >
                <SelectTrigger className="h-8 min-w-[165px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterPresets.map((preset) => (
                    <SelectItem key={preset.key} value={preset.value}>
                      {preset.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          {!showFilterAsSelect && (
            <>
              {filterPresets.map((preset) => (
                <Button
                  key={preset.key}
                  variant={
                    column.getFilterValue() === preset.value
                      ? "default"
                      : "outline"
                  }
                  onClick={() => column.setFilterValue(preset.value)}
                  className="h-8"
                >
                  {preset.key}
                </Button>
              ))}
            </>
          )}
        </div>
      )}
    </>
  )
}
