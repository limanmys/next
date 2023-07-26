import { ReactElement, useEffect, useState } from "react"
import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileWarning, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { IExternalNotification } from "@/types/notification"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import NotificationLayout from "@/components/_layout/notifications_layout"
import { Form, FormField, FormMessage } from "@/components/form/form"
import { ExternalNotificationActions } from "@/components/settings/external-notification-actions"

const ExternalNotificationPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExternalNotification[]>([])

  const emitter = useEmitter()

  const columns: DivergentColumn<IExternalNotification, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="İsim" />
      ),
      title: "İsim",
    },
    {
      accessorKey: "ip",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="İzin Verilen IP Adresi" />
      ),
      title: "İzin Verilen IP Adresi",
    },
    {
      accessorKey: "last_used",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Son Erişim Tarihi" />
      ),
      title: "Son Erişim Tarihi",
      cell: ({ row }) => (
        <>
          {row.original.last_used
            ? new Date(row.original.last_used).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Bilinmiyor"}
        </>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ExternalNotificationActions row={row} />
        </div>
      ),
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get<IExternalNotification[]>(`/settings/notifications/external`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    emitter.on("REFETCH_EXTERNAL_NOTIFICATIONS", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_EXTERNAL_NOTIFICATIONS")
  }, [])

  return (
    <>
      <Head>
        <title>Dış Bildirimler | Liman</title>
      </Head>

      <PageHeader
        title="Dış Bildirimler"
        description="Eklenti sunucularının ve dış uygulamaların Liman'a bildirim göndermesini sağlayabilirsiniz."
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <CreateExternalNotification />
      </DataTable>
    </>
  )
}

const formSchema = z.object({
  name: z.string().nonempty("Dış bildirim adı boş bırakılamaz."),
  ip: z.string().nonempty("İzin verilen IP adresi boş bırakılamaz."),
})

function CreateExternalNotification() {
  const { toast } = useToast()
  const emitter = useEmitter()
  const [token, setToken] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ip: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post<{
        status: boolean
        token: string
      }>(`/settings/notifications/external`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Başarılı",
            description: "Dış bildirim başarıyla oluşturuldu.",
          })
          setToken(res.data.token)
          emitter.emit("REFETCH_EXTERNAL_NOTIFICATIONS")
          form.reset()
        } else {
          toast({
            title: "Hata",
            description: "Dış bildirim oluştulurken bir hata oluştu.",
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Dış bildirim oluştulurken bir hata oluştu.",
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
          <DialogTitle>Dış Bildirim Oluştur</DialogTitle>
          <DialogDescription>
            Bu işlem sonucu sisteminizde bir dış bildirim oluşturulacaktır.
          </DialogDescription>
        </DialogHeader>
        {token && (
          <Alert>
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Dış Uygulama Tokeniniz</AlertTitle>
            <AlertDescription>
              Bu tokeni güvenmediğiniz kimse ile paylaşmayınız. Dış
              uygulamalarınız bu tokeni kullanarak Liman&apos;a bildirim
              gönderebilir.
              <br />
              <br />
              <b>{token}</b>
            </AlertDescription>
          </Alert>
        )}

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
                    Dış Bildirim Adı
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" {...field} />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="ip"
              render={({ field }) => (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ip" className="text-right">
                      IP Adresi
                    </Label>
                    <div className="col-span-3">
                      <Input id="ip" {...field} />

                      <FormMessage className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4">
                    <div></div>
                    <div className="col-span-3">
                      <small className="text-sm text-muted-foreground">
                        Bu bölüme izin vermek istediğiniz bir subnet adresini ya
                        da IP adresini yazarak erişimi kısıtlayabilirsiniz.
                        <br />
                        <b>Örneğin: 192.168.1.0/24</b>
                      </small>
                    </div>
                  </div>
                </>
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

ExternalNotificationPage.getLayout = function getLayout(page: ReactElement) {
  return <NotificationLayout>{page}</NotificationLayout>
}

export default ExternalNotificationPage
