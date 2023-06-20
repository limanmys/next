import { useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { PlusCircle } from "lucide-react"

import { IExtension } from "@/types/extension"
import { IMiniFunction } from "@/types/function"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
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
import { Label } from "../ui/label"
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
import { useToast } from "../ui/use-toast"

export default function AssignFunction() {
  const router = useRouter()
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IMiniFunction[]>([])
  const [extensions, setExtensions] = useState<IExtension[]>([])
  const [selectedExtension, setSelectedExtension] = useState<string>()
  const [selected, setSelected] = useState<IMiniFunction[]>([])

  const fetchExtensionList = () => {
    setLoading(true)

    apiService
      .getInstance()
      .get(`/settings/roles/${router.query.role_id}/extensions`)
      .then((res) => {
        setExtensions(res.data.selected)
      })
      .finally(() => {
        setLoading(false)
        setSelected([])
      })
  }

  const fetchFunctionList = (extension: string) => {
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
        <DataTableColumnHeader column={column} title="İzin" />
      ),
      title: "İzin",
    },
  ]

  const handleAddPermission = () => {
    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/functions`, {
        functions: selected.map((item) => item.name),
        extension_id: selectedExtension,
      })
      .then((res) => {
        toast({
          title: "Başarılı",
          description: "İzinler başarıyla eklendi.",
        })
        emitter.emit("REFETCH_FUNCTIONS", router.query.role_id)
        emitter.emit("REFETCH_ROLE", router.query.role_id)
      })
      .catch((err) => {
        toast({
          title: "Hata",
          description: "İzinler eklenirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
          onClick={fetchExtensionList}
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
        <div className="mt-5 flex flex-col gap-3">
          <Label>Eklenti Seçimi</Label>
          <Select onValueChange={(value) => fetchFunctionList(value)}>
            <SelectTrigger className="mb-3 h-8 w-full ">
              <SelectValue placeholder="Fonksiyonları görmek için seçim yapınız..." />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-48">
                <SelectGroup>
                  <SelectLabel>Eklentiler</SelectLabel>
                  {extensions.map((extension) => (
                    <SelectItem key={extension.id} value={extension.id}>
                      {extension.display_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
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
              <PlusCircle className="mr-2 h-4 w-4" /> Ekle
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
