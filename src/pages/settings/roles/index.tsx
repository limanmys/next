import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Footprints, Link2, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { IRole } from "@/types/role"
import { DivergentColumn } from "@/types/table"
import { compareNumericString, setFormErrors } from "@/lib/utils"
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
import { RoleRowActions } from "@/components/settings/role-actions"

export default function RoleSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IRole[]>([])
  const { t, i18n } = useTranslation("settings")

  const emitter = useEmitter()

  const columns: DivergentColumn<IRole, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("roles.name")} />
      ),
      title: t("roles.name"),
      cell: ({ row }) => (
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() =>
            router.push(`/settings/roles/${row.original.id}/users`)
          }
        >
          {row.original.name} <Link2 className="size-4"></Link2>
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      accessorFn: (row) => {
        return new Date(row.updated_at).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("roles.updated_at")} />
      ),
      title: t("roles.updated_at"),
      sortingFn: compareNumericString,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RoleRowActions row={row} />
        </div>
      ),
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
      <PageHeader
        title={t("roles.title")}
        description={t("roles.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <div className="flex gap-3">
          <CreateRole />
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={() => router.push("/settings/roles/details")}
          >
            <Footprints className="mr-2 size-4" />
            {t("roles.detailed_view")}
          </Button>
        </div>
      </DataTable>
    </>
  )
}

function CreateRole() {
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    name: z.string().min(1, t("roles.validation.name")),
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
      .post(`/settings/roles`, values)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("roles.create.success"),
          })
          setOpen(false)
          form.reset()

          router.push(`/settings/roles/${res.data.id}/users`)
        } else {
          toast({
            title: t("error"),
            description: t("roles.create.error"),
            variant: "destructive",
          })
        }
      })
      .catch((e) => {
        if (!setFormErrors(e, form)) {
          toast({
            title: t("error"),
            description: t("roles.create.error"),
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
          {t("roles.create.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("roles.create.title")}</DialogTitle>
          <DialogDescription>{t("roles.create.description")}</DialogDescription>
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
                    {t("roles.create.name")}
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
                {t("roles.create.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
