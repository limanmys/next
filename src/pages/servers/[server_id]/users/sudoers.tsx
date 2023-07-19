import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { MinusCircle, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { ISudoers } from "@/types/server_user"
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
import { useToast } from "@/components/ui/use-toast"
import { Form, FormField, FormMessage } from "@/components/form/form"

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Kullanıcı adı en az 2 karakter olmalıdır.",
    })
    .max(50, {
      message: "Kullanıcı adı en fazla 50 karakter olmalıdır.",
    }),
})

export default function Sudoers() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ISudoers[]>([])
  const [selected, setSelected] = useState<ISudoers[]>([])
  const tableRef = useRef<any>()
  const { toast } = useToast()

  const emitter = useEmitter()

  const columns: DivergentColumn<ISudoers, string>[] = [
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
        <DataTableColumnHeader column={column} title="Kural Adı" />
      ),
      title: "Kural Adı",
    },
    {
      accessorKey: "access",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Erişim Yetkileri" />
      ),
      title: "Erişim Yetkileri",
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/users/sudoers`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  useEffect(() => {
    emitter.on("REFETCH_SUDOERS", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_SUDOERS")
  }, [])

  const deleteSelected = () => {
    if (!selected?.length) return

    apiService
      .getInstance()
      .delete(`/servers/${router.query.server_id}/users/sudoers`, {
        data: {
          names: selected.map((s) => s.name),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Yetkili kullanıcı başarıyla silindi.",
          })
          fetchData()
          tableRef.current?.resetRowSelection()
          setSelected([])
        } else {
          toast({
            title: "Hata",
            description: "Yetkili kullanıcı silinirken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Yetkili kullanıcı silinirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Yetkili Kullanıcılar
            </h2>
            <p className="text-muted-foreground">
              Sunucunuzda mevcut bulunan yetkili kullanıcı izinlerini
              görüntüleyebilir ve ekleme, çıkartma işlemleri yapabilirsiniz.
            </p>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={true}
        onSelectedRowsChange={(rows) => setSelected(rows)}
        tableRef={tableRef}
      >
        <div className="flex gap-2">
          <CreateSudoers />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto h-8 lg:flex"
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

function CreateSudoers() {
  const router = useRouter()
  const { toast } = useToast()
  const emitter = useEmitter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/servers/${router.query.server_id}/users/sudoers`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Yetkili kullanıcı başarıyla oluşturuldu.",
          })
          emitter.emit("REFETCH_SUDOERS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Yetkili kullanıcı oluşturulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Yetkili kullanıcı oluşturulurken bir hata oluştu.",
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
          <DialogTitle>Yetkili Kullanıcı Oluştur</DialogTitle>
          <DialogDescription>
            Bu işlem sonucu sisteminizde yetkili bir kullanıcı oluşturulacaktır.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Kullanıcı Adı
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" {...field} />
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
