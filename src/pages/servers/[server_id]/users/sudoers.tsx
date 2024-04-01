import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { MinusCircle, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { ISudoers } from "@/types/server_user"
import { DivergentColumn } from "@/types/table"
import { setFormErrors } from "@/lib/utils"
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

export default function Sudoers() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ISudoers[]>([])
  const [selected, setSelected] = useState<ISudoers[]>([])
  const tableRef = useRef<any>()
  const { toast } = useToast()
  const { t } = useTranslation("servers")

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
        <DataTableColumnHeader
          column={column}
          title={t("users.sudoers.accessor_name_title")}
        />
      ),
      title: t("users.sudoers.accessor_name_title"),
    },
    {
      accessorKey: "access",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.sudoers.accessor_access_title")}
        />
      ),
      title: t("users.sudoers.accessor_access_title"),
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
            title: t("users.sudoers.toasts.success.title"),
            description: t("users.sudoers.toasts.success.description"),
          })
          fetchData()
          tableRef.current?.resetRowSelection()
          setSelected([])
        } else {
          toast({
            title: t("users.sudoers.toasts.fail.title"),
            description: t("users.sudoers.toasts.fail.description"),
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: t("users.sudoers.toasts.fail.title"),
          description: t("users.sudoers.toasts.fail.description"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("users.sudoers.page_header.title")}
        description={t("users.sudoers.page_header.description")}
      />

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
                <MinusCircle className="mr-2 size-4" />
                {t("users.sudoers.alert_dialog.delete_btn")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {" "}
                  {t("users.sudoers.alert_dialog.title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("users.sudoers.alert_dialog.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {" "}
                  {t("users.sudoers.alert_dialog.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSelected()}>
                  {t("users.sudoers.alert_dialog.confirm")}
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
  const { t } = useTranslation("servers")

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: t("users.sudoers.form_message.min"),
      })
      .max(50, {
        message: t("users.sudoers.form_message.max"),
      }),
  })

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
            title: t("users.sudoers.toasts.add.success.title"),
            description: t("users.sudoers.toasts.add.success.description"),
          })
          emitter.emit("REFETCH_SUDOERS")
          setOpen(false)
          form.reset()
        } else {
          toast({
            title: t("users.sudoers.toasts.add.fail.title"),
            description: t("users.sudoers.toasts.add.fail.description"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("users.sudoers.toasts.add.fail.title"),
            description: t("users.sudoers.toasts.add.fail.description"),
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
          {t("users.sudoers.dialog.add_btn")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("users.sudoers.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("users.sudoers.dialog.description")}
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
                    {t("users.sudoers.dialog.form.username")}
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
                <PlusCircle className="mr-2 size-4" />
                {t("users.sudoers.dialog.form.create_btn")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
