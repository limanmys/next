import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { IRole } from "@/types/role"
import { DivergentColumn } from "@/types/table"
import { compareNumericString } from "@/lib/utils"
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

export default function RoleSettingsPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IRole[]>([])

  const emitter = useEmitter()

  const columns: DivergentColumn<IRole, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rol Adı" />
      ),
      title: "Rol Adı",
    },
    {
      accessorKey: "updated_at",
      accessorFn: (row) => {
        return new Date(row.updated_at).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Güncellenme Tarihi" />
      ),
      title: "Güncellenme Tarihi",
      sortingFn: compareNumericString,
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/roles`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    emitter.on("REFETCH_ROLES", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_ROLES")
  }, [])

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Roller</h2>
            <p className="text-muted-foreground">
              Kullanıcıların erişim yetki seviyelerini detaylı şekilde gruplar
              ve kişiler bazında düzenleyebilirsiniz.
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
        <CreateRole />
      </DataTable>
    </>
  )
}

const formSchema = z.object({
  name: z.string().nonempty("Rol adı boş bırakılamaz."),
})

function CreateRole() {
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
      .post(`/settings/roles`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Rol başarıyla oluşturuldu.",
          })
          emitter.emit("REFETCH_ROLES")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Rol oluştulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Rol oluştulurken bir hata oluştu.",
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
          <DialogTitle>Rol Oluştur</DialogTitle>
          <DialogDescription>
            Bu işlem sonucu sisteminizde bir rol oluşturulacaktır ve düzenleme
            sayfasına yönlendirileceksiniz.
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
                    Rol Adı
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" placeholder="root" {...field} />
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
