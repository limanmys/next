import { useState } from "react"
import { apiService } from "@/services"
import { PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation("servers")

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
      accessorKey: "display_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.assign.name")}
        />
      ),
      title: t("extensions.assign.name"),
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.assign.version")}
        />
      ),
      title: t("extensions.assign.version"),
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
          {t("extensions.assign.button")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:w-[800px] sm:max-w-full">
        <SheetHeader>
          <SheetTitle>{t("extensions.assign.title")}</SheetTitle>
          <SheetDescription>
            {t("extensions.assign.description")}
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
