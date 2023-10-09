import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { ILocalUser } from "@/types/server_user"
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
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormField, FormMessage } from "@/components/form/form"

export default function LocalUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ILocalUser[]>([])
  const { t } = useTranslation("servers")

  const emitter = useEmitter()

  const columns: DivergentColumn<ILocalUser, string>[] = [
    {
      accessorKey: "user",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.local.accessor_user_title")}
        />
      ),
      title: t("users.local.accessor_user_title"),
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/users/local`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  useEffect(() => {
    emitter.on("REFETCH_LOCAL_USERS", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_LOCAL_USERS")
  }, [])

  return (
    <>
      <PageHeader
        title={t("users.local.page_header.title")}
        description={t("users.local.page_header.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <CreateLocalUser />
      </DataTable>
    </>
  )
}

function CreateLocalUser() {
  const router = useRouter()
  const { toast } = useToast()
  const emitter = useEmitter()
  const { t } = useTranslation("servers")

  const formSchema = z
    .object({
      username: z
        .string()
        .min(2, {
          message: t("users.local.form_message.username.min"),
        })
        .max(50, {
          message: t("users.local.form_message.username.max"),
        }),
      password: z
        .string()
        .min(8, {
          message: t("users.local.form_message.password.min"),
        })
        .max(50, {
          message: t("users.local.form_message.password.min"),
        }),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("users.local.form_message.error_message"),
      path: ["password_confirmation"],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      password_confirmation: "",
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const handleCreate = (values: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post(`/servers/${router.query.server_id}/users/local`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("users.local.toasts.success.title"),
            description: t("users.local.toasts.success.description"),
          })
          emitter.emit("REFETCH_LOCAL_USERS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("users.local.toasts.fail.title"),
            description: t("users.local.toasts.fail.description"),
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: t("users.local.toasts.fail.title"),
          description: t("users.local.toasts.fail.description"),
          variant: "destructive",
        })
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("users.local.dialog.add_btn")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle> {t("users.local.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("users.local.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    {t("users.local.dialog.form_labels.username")}
                  </Label>
                  <div className="col-span-3">
                    <Input id="username" {...field} />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    {t("users.local.dialog.form_labels.password")}
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="password"
                      {...field}
                      className="col-span-3"
                      type="password"
                    />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password_confirmation" className="text-right">
                    {t("users.local.dialog.form_labels.confirm_passsword")}
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="password_confirmation"
                      {...field}
                      className="col-span-3"
                      type="password"
                    />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("users.local.dialog.create_btn")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
