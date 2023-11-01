import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { ILocalGroup } from "@/types/server_user"
import { DivergentColumn } from "@/types/table"
import { setFormErrors } from "@/lib/utils"
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

export default function LocalGroups() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ILocalGroup[]>([])
  const { t } = useTranslation("servers")

  const emitter = useEmitter()

  const columns: DivergentColumn<ILocalGroup, string>[] = [
    {
      accessorKey: "group",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.groups.accessor_group_title")}
        />
      ),
      title: t("users.groups.accessor_group_title"),
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

  useEffect(() => {
    emitter.on("REFETCH_LOCAL_GROUPS", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_LOCAL_GROUPS")
  }, [])

  return (
    <>
      <PageHeader
        title={t("users.groups.page_header.title")}
        description={t("users.groups.page_header.description")}
      />

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
  const { t } = useTranslation("servers")

  const formSchema = z.object({
    group_name: z
      .string()
      .min(2, {
        message: t("users.groups.form_message.min"),
      })
      .max(50, {
        message: t("users.groups.form_message.max"),
      }),
  })

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
            title: t("users.groups.toasts.success.title"),
            description: t("users.groups.toasts.success.description"),
          })
          emitter.emit("REFETCH_LOCAL_GROUPS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("users.groups.toasts.fail.title"),
            description: t("users.groups.toasts.fail.description"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("users.groups.toasts.fail.title"),
            description: t("users.groups.toasts.fail.description"),
            variant: "destructive",
          })
        }
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("users.groups.dialog.add_btn")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("users.groups.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("users.groups.dialog.description")}
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
                    {t("users.groups.dialog.form_label")}
                  </Label>
                  <div className="col-span-3">
                    <Input id="group_name" {...field} />
                    <FormMessage className="mt-1" />
                  </div>
                </div>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("users.groups.dialog.create_btn")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
