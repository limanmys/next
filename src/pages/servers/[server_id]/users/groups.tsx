import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { ILocalGroup } from "@/types/server_user"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
import { Button } from "@/components/ui/button"
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
  group_name: z
    .string()
    .min(2, {
      message: "Grup adı en az 2 karakter olmalıdır.",
    })
    .max(50, {
      message: "Grup adı en fazla 50 karakter olmalıdır.",
    }),
})

export default function LocalGroups() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ILocalGroup[]>([])

  const emitter = useEmitter()

  const columns: DivergentColumn<ILocalGroup, string>[] = [
    {
      accessorKey: "group",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Grup Adı" />
      ),
      title: "Grup Adı",
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/users/groups`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  emitter.on("REFETCH_LOCAL_GROUPS", () => {
    fetchData()
  })

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Yerel Gruplar</h2>
            <p className="text-muted-foreground">
              Sunucunuzda mevcut bulunan yerel grupları görüntüleyebilir, bu
              sayfa aracılığı ile yenisini ekleyebilir ve gruplara yeni üyeler
              dahil edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <CreateLocalGroup />
      </DataTable>
    </>
  )
}

function CreateLocalGroup() {
  const router = useRouter()
  const { toast } = useToast()
  const emitter = useEmitter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_name: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/servers/${router.query.server_id}/users/groups`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Yerel grup başarıyla oluşturuldu.",
          })
          emitter.emit("REFETCH_LOCAL_GROUPS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Yerel grup oluşturulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Yerel grup oluşturulurken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Yerel Grup Oluştur</DialogTitle>
          <DialogDescription>
            Bu işlem sonucu sisteminizde yerel bir grup oluşturulacaktır.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="group_name"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="group_name" className="text-right">
                    Grup Adı
                  </Label>
                  <div className="col-span-3">
                    <Input id="group_name" placeholder="root" {...field} />
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
