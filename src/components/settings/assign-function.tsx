import { useState } from "react"
import { apiService } from "@/services"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { IExtension } from "@/types/extension"
import { IFunction } from "@/types/function"
import { DivergentColumn } from "@/types/table"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command"
import DataTable from "../ui/data-table/data-table"
import { DataTableColumnHeader } from "../ui/data-table/data-table-column-header"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export default function AssignFunction() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IFunction[]>([])
  const [selected, setSelected] = useState<IFunction[]>([])

  const fetchData = () => {
    setLoading(true)

    apiService
      .getInstance()
      .get(`/extensions`)
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
        setSelected([])
      })
  }

  const columns: DivergentColumn<IFunction, string>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eklenti Adı" />
      ),
      title: "Eklenti Adı",
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Versiyon" />
      ),
      title: "Versiyon",
    },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
          onClick={fetchData}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ekle
        </Button>
      </SheetTrigger>
      <SheetContent position="right" size="lg">
        <SheetHeader>
          <SheetTitle>İzin Ekle</SheetTitle>
          <SheetDescription>
            Bu pencereyi kullanarak fonksiyon izinlerini ekleyebilirsiniz.
          </SheetDescription>
        </SheetHeader>
        <ComboboxDemo entries={data} />
        <div className="-mx-6 my-8">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            selectable={true}
            onSelectedRowsChange={(rows) => setSelected(rows)}
          ></DataTable>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="rounded-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Ekle
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function ComboboxDemo({ entries }: { entries: IExtension[] }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? entries.find((extension) => extension.id === value)?.display_name
            : "Select extension..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search extension..." />
          <CommandEmpty>No extension found.</CommandEmpty>
          <CommandGroup>
            {entries.map((extension) => (
              <CommandItem
                key={extension.id}
                onSelect={(currentValue) => {
                  setValue(currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === extension.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {extension.display_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
