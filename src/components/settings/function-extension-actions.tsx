import { useRouter } from "next/router"
import { Column } from "@tanstack/react-table"
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from "lucide-react"

import { IExtension } from "@/types/extension"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ScrollArea } from "../ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface FunctionExtensionActionsProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function FunctionExtensionActions<TData, TValue>({
  column,
  title,
  className,
  extensions,
}: FunctionExtensionActionsProps<TData, TValue> & {
  extensions: IExtension[]
}) {
  const router = useRouter()

  return (
    <>
      <div className={cn("mt-1 flex items-center space-x-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex h-8 items-center justify-center data-[state=open]:bg-accent data-[state=open]:text-white">
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <SortDesc className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <SortAsc className="ml-2 h-4 w-4" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <SortAsc className="mr-2 h-3.5 w-3.5" />
              Artan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <SortDesc className="mr-2 h-3.5 w-3.5" />
              Azalan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 h-3.5 w-3.5" />
              Gizle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Select
        onValueChange={(value) => column.setFilterValue(value)}
        value={column.getFilterValue() as string}
        defaultValue=""
        key={column.getFilterValue() as string}
      >
        <SelectTrigger className="mb-3 h-8 w-full ">
          <SelectValue placeholder="Eklentiye göre filtrele..." />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-48">
            <SelectGroup>
              <SelectLabel>Eklentiler</SelectLabel>
              <SelectItem value="">Tümü</SelectItem>
              {extensions.map((extension) => (
                <SelectItem key={extension.id} value={extension.display_name}>
                  {extension.display_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </ScrollArea>
        </SelectContent>
      </Select>
    </>
  )
}
