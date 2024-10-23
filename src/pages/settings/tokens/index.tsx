import { http } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileWarning, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form, FormField, FormMessage } from "@/components/form/form"
import { TokenActions } from "@/components/settings/token-actions"
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
import { useEmitter } from "@/hooks/useEmitter"
import { setFormErrors } from "@/lib/utils"
import { DivergentColumn } from "@/types/table"
import { IToken } from "@/types/token"

export default function TokensPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IToken[]>([])
  const { t, i18n } = useTranslation("settings")

  const emitter = useEmitter()

  const columns: DivergentColumn<IToken, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("tokens.name")} />
      ),
      title: t("tokens.name"),
    },
    {
      accessorKey: "ip_range",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("tokens.ip_range")} />
      ),
      title: t("tokens.ip_range"),
    },
    {
      accessorKey: "last_used_ip",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("tokens.last_used_ip")}
        />
      ),
      title: t("tokens.last_used_ip"),
    },
    {
      accessorKey: "last_used_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("tokens.last_used_at")}
        />
      ),
      title: t("tokens.last_used_at"),
      cell: ({ row }) => (
        <>
          {row.original.last_used_at
            ? new Date(row.original.last_used_at).toLocaleDateString(
              i18n.language,
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )
            : t("tokens.unknown")}
        </>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <TokenActions row={row} />
        </div>
      ),
    },
  ]

  const fetchData = () => {
    http
      .get<IToken[]>(`/settings/tokens`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    emitter.on("REFETCH_TOKENS", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_TOKENS")
  }, [])

  return (
    <>
      <PageHeader
        title={t("tokens.title")}
        description={t("tokens.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <CreateAccessToken />
      </DataTable>
    </>
  )
}

function CreateAccessToken() {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const emitter = useEmitter()
  const [token, setToken] = useState<string>("")

  const formSchema = z.object({
    name: z
      .string()
      .min(1, t("tokens.validation.name"))
      .max(75, t("tokens.validation.name")),
    ip_range: z.string().ip({
      version: "v4",
      message: t("external_notifications.validation.ip"),
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ip_range: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  useEffect(() => {
    if (open) {
      setToken("")
    }
  }, [open])

  const handleCreate = (values: z.infer<typeof formSchema>) => {
    http
      .post<{
        status: boolean
        token: string
      }>(`/settings/tokens`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("tokens.toasts.create_success"),
          })
          setToken(res.data.token)
          emitter.emit("REFETCH_TOKENS")
          form.reset()
        } else {
          toast({
            title: t("error"),
            description: t("tokens.toasts.create_error"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("tokens.toasts.create_error"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 size-4" />
          {t("tokens.create.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("tokens.create.title")}</DialogTitle>
          <DialogDescription>
            {t("tokens.create.description")}
          </DialogDescription>
        </DialogHeader>
        {token && (
          <Alert>
            <FileWarning className="size-4" />
            <AlertTitle>{t("tokens.create.alert_title")}</AlertTitle>
            <AlertDescription>
              {t("tokens.create.alert_description")}
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
                    {t("tokens.create.form.name")}
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" {...field} maxLength={75} />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="ip_range"
              render={({ field }) => (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ip" className="text-right">
                      {t("tokens.create.form.ip_range")}
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
                        {t("tokens.create.subtext")}
                      </small>
                    </div>
                  </div>
                </>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 size-4" />
                {t("tokens.create.form.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
