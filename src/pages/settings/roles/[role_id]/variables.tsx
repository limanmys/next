import { ReactElement, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { MinusCircle, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { IFunction } from "@/types/function"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormField, FormMessage } from "@/components/form/form"

import RoleLayout from "./_layout"

const RoleVariablesList: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IFunction[]>([])
  const [selected, setSelected] = useState<IFunction[]>([])
  const tableRef = useRef<any>()
  const { toast } = useToast()

  const router = useRouter()
  const emitter = useEmitter()

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
      accessorKey: "key",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Adı" />
      ),
      title: "Adı",
    },
    {
      accessorKey: "value",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Değeri" />
      ),
      title: "Değeri",
    },
  ]

  const fetchData = (id?: string) => {
    apiService
      .getInstance()
      .get(`/settings/roles/${id ? id : router.query.role_id}/variables`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!router.query.role_id) return

    fetchData()
  }, [router.query.role_id])

  useEffect(() => {
    emitter.on("REFETCH_VARIABLES", (id) => {
      fetchData(id as string)
    })
    return () => emitter.off("REFETCH_VARIABLES")
  }, [])

  const deleteSelected = () => {
    if (!selected?.length) return

    apiService
      .getInstance()
      .delete(`/settings/roles/${router.query.role_id}/functions`, {
        data: {
          permission_ids: selected.map((s) => s.id),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Özel veriler başarıyla silindi.",
          })
          fetchData()
          emitter.emit("REFETCH_ROLE", router.query.role_id)
          tableRef.current?.resetRowSelection()
          setSelected([])
        } else {
          toast({
            title: "Hata",
            description: "Özel veriler silinirken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Özel veriler silinirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title="Özel Veriler"
        description="Bu rolün eklentiye paylaşacağı özel verileri ayarlayın."
      />

      <DataTable
        tableRef={tableRef}
        columns={columns}
        data={data}
        loading={loading}
        selectable={true}
        onSelectedRowsChange={(rows) => setSelected(rows)}
      >
        <div className="flex gap-2">
          <CreateVariable />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto h-8 lg:flex"
                size="sm"
                disabled={!selected?.length}
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Seçilen yetkili kullanıcılar sunucudan
                  kaldırılacaktır, devam etmek istiyor musunuz?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSelected()}>
                  Onayla
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DataTable>
    </>
  )
}

const formSchema = z.object({
  key: z.string().nonempty("Bu alan boş bırakılamaz."),
  value: z.string().nonempty("Bu alan boş bırakılamaz."),
})

function CreateVariable() {
  const router = useRouter()
  const { toast } = useToast()
  const emitter = useEmitter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
      value: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/variables`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Özel veriler başarıyla oluşturuldu.",
          })
          emitter.emit("REFETCH_VARIABLES", router.query.role_id)
          emitter.emit("REFETCH_ROLE", router.query.role_id)
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Özel veriler oluşturulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Özel veriler oluşturulurken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Özel Veri Oluştur</DialogTitle>
          <DialogDescription>
            Bu işlem sonucu rol üzerinde bir özel veri oluşturulacaktır.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="key" className="text-right">
                    Adı
                  </Label>
                  <div className="col-span-3">
                    <Input id="key" {...field} />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Değeri
                  </Label>
                  <div className="col-span-3">
                    <Input id="value" {...field} />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Oluştur
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

RoleVariablesList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleVariablesList
