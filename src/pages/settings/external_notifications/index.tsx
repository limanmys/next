import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileWarning, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
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
import { Form, FormField, FormMessage } from "@/components/form/form"
import { ExternalNotificationActions } from "@/components/settings/external-notification-actions"

export default function ExternalNotificationPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExternalNotification[]>([])
  const { t, i18n } = useTranslation("settings")

  const emitter = useEmitter()

  const columns: DivergentColumn<IExternalNotification, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("external_notifications.name")}
        />
      ),
      title: t("external_notifications.name"),
    },
    {
      accessorKey: "ip",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("external_notifications.ip_address")}
        />
      ),
      title: t("external_notifications.ip_address"),
    },
    {
      accessorKey: "last_used",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("external_notifications.last_used")}
        />
      ),
      title: t("external_notifications.last_used"),
      cell: ({ row }) => (
        <>
          {row.original.last_used
            ? new Date(row.original.last_used).toLocaleDateString(
                i18n.language,
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : t("external_notifications.unknown")}
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
      <PageHeader
        title={t("external_notifications.title")}
        description={t("external_notifications.description")}
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

function CreateExternalNotification() {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const emitter = useEmitter()
  const [token, setToken] = useState<string>("")

  const formSchema = z.object({
    name: z
      .string()
      .min(1, t("external_notifications.validation.name"))
      .max(50, t("external_notifications.validation.name")),
    ip: z.string().ip({
      version: "v4",
      message: t("external_notifications.validation.ip"),
    }),
  })

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
            title: t("success"),
            description: t("external_notifications.toasts.success"),
          })
          setToken(res.data.token)
          emitter.emit("REFETCH_EXTERNAL_NOTIFICATIONS")
          form.reset()
        } else {
          toast({
            title: t("error"),
            description: t("external_notifications.toasts.error"),
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("external_notifications.toasts.error"),
          variant: "destructive",
        })
      })
  }

  useEffect(() => {
    if (open) {
      setToken("")
    }
  }, [open])

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("external_notifications.create.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("external_notifications.create.title")}</DialogTitle>
          <DialogDescription>
            {t("external_notifications.create.description")}
          </DialogDescription>
        </DialogHeader>
        {token && (
          <Alert>
            <FileWarning className="h-4 w-4" />
            <AlertTitle>
              {t("external_notifications.create.alert_title")}
            </AlertTitle>
            <AlertDescription>
              {t("external_notifications.create.alert_description")}
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
                    {t("external_notifications.create.name")}
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" {...field} maxLength={50} />
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
                      {t("external_notifications.create.ip")}
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
                        <span
                          dangerouslySetInnerHTML={{
                            // TODO: Localization
                            // Couldn't find a better way to use tags with localized strings
                            // If i find any i'll change it.
                            __html: t("external_notifications.create.subtext"),
                          }}
                        />
                      </small>
                    </div>
                  </div>
                </>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("external_notifications.create.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
