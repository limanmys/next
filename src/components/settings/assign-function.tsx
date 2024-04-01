import { useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IMiniFunction } from "@/types/function"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Label } from "@/components/ui/label"
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
import { useToast } from "@/components/ui/use-toast"

import { SelectExtension } from "../selectbox/extension-select"

export default function AssignFunction() {
  const router = useRouter()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IMiniFunction[]>([])
  const [selectedExtension, setSelectedExtension] = useState<string>()
  const [selected, setSelected] = useState<IMiniFunction[]>([])

  const fetchFunctionList = (extension: string) => {
    if (!extension) return

    setLoading(true)
    setSelectedExtension(extension)

    apiService
      .getInstance()
      .get(`/settings/extensions/${extension}/functions`)
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
        setSelected([])
      })
  }

  const columns: DivergentColumn<IMiniFunction, string>[] = [
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.functions.assign.permission")}
        />
      ),
      title: t("roles.functions.assign.permission"),
    },
  ]

  const handleAddPermission = () => {
    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/functions`, {
        functions: selected.map((item) => item.name),
        extension_id: selectedExtension,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("roles.functions.assign.success"),
        })
        emitter.emit("REFETCH_FUNCTIONS", router.query.role_id)
        emitter.emit("REFETCH_ROLE", router.query.role_id)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.functions.assign.error"),
          variant: "destructive",
        })
      })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 size-4" />
          {t("roles.functions.assign.add")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:w-[800px] sm:max-w-full">
        <SheetHeader>
          <SheetTitle>{t("roles.functions.assign.title")}</SheetTitle>
          <SheetDescription>
            {t("roles.functions.assign.description")}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-5 flex flex-col gap-3">
          <Label>{t("roles.functions.assign.extension_selection")}</Label>
          <SelectExtension
            onValueChange={(value) => fetchFunctionList(value)}
            endpoint={`/settings/roles/${router.query.role_id}/extensions`}
          />
        </div>

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
              type="submit"
              className="rounded-full"
              onClick={() => handleAddPermission()}
            >
              <PlusCircle className="mr-2 size-4" />{" "}
              {t("roles.functions.assign.add")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
