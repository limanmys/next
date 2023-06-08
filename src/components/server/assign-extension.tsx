import { useState } from "react"
import { apiService } from "@/services"
import { PlusCircle } from "lucide-react"

import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"
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
import DataTable from "../ui/data-table/data-table"
import { DataTableColumnHeader } from "../ui/data-table/data-table-column-header"

export default function AssignExtension({
  serverId,
  onAssign,
}: {
  serverId: string
  onAssign: (extensions: IExtension[]) => void
}) {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])

  const fetchData = () => {
    setLoading(true)

    apiService
      .getInstance()
      .get(`/extensions?server_id=${serverId}`)
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
        setSelected([])
      })
  }

  const columns: DivergentColumn<IExtension, string>[] = [
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
          className="ml-auto hidden h-8 lg:flex"
          onClick={fetchData}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ekle
        </Button>
      </SheetTrigger>
      <SheetContent position="right" size="lg">
        <SheetHeader>
          <SheetTitle>Eklenti Ekle</SheetTitle>
          <SheetDescription>
            Bu pencereyi kullanarak sunucunuza eklenti ekleyebilirsiniz.
          </SheetDescription>
        </SheetHeader>
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
            <Button
              onClick={() => onAssign(selected)}
              type="submit"
              className="rounded-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Ekle
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
