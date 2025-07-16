import { Column } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDown,
  EyeOff,
  ListFilter,
} from "lucide-react"
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
    <div className={cn("flex items-center space-x-2 py-2", className)}>
      <span>{title}</span>

      {/* Sort Button */}
      <Button
        variant="ghost"
        className="h-4 p-0"
        onClick={() => column.toggleSorting()}
      >
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="size-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="size-4" />
        ) : (
          <ChevronsUpDown className="size-4" />
        )}
      </Button>

      {/* Filter Dropdown */}
      {column.getCanFilter() && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 p-0">
              <ListFilter
                className={cn(
                  "size-4",
                  column.getFilterValue() ? "text-cyan-500" : ""
                )}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {!filterPresets && (
              <Input
                className="h-8"
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(e) => column.setFilterValue(e.target.value)}
              />
            )}
            {filterPresets && (
              <>
                {showFilterAsSelect ? (
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
                ) : (
                  <div className="flex gap-2">
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
                  </div>
                )}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 size-3.5" />
              {t("table.column.hide")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
