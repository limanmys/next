import { NextPageWithLayout } from "@/pages/_app"
import { http } from "@/services"
import { MinusCircle } from "lucide-react"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import RoleLayout from "@/components/_layout/role_layout"
import AssignFunction from "@/components/settings/assign-function"
import { FunctionExtensionActions } from "@/components/settings/function-extension-actions"
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
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import { useEmitter } from "@/hooks/useEmitter"
import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"

const RoleFunctionsList: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])
  const tableRef = useRef<any>(undefined)
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const router = useRouter()
  const emitter = useEmitter()

  const [extensions, setExtensions] = useState<IExtension[]>([])

  useEffect(() => {
    if (!router.query.role_id) return

    http
      .get(`/settings/roles/${router.query.role_id}/extensions`)
      .then((res) => {
        setExtensions(res.data.selected)
      })
  }, [router.query.role_id])

  const columns: DivergentColumn<IExtension, string>[] = [
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
      accessorKey: "display_name",
      header: ({ column }) => (
        <FunctionExtensionActions
          column={column}
          title={t("roles.functions.display_name")}
          extensions={extensions}
        />
      ),
      title: t("roles.functions.display_name"),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.functions.function_name")}
        />
      ),
      title: t("roles.functions.function_name"),
    },
  ]

  const fetchData = (id?: string) => {
    http
      .get(`/settings/roles/${id ? id : router.query.role_id}/functions`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!router.query.role_id) return

    fetchData()
  }, [router.query.role_id])

  useEffect(() => {
    emitter.on("REFETCH_FUNCTIONS", (id) => {
      fetchData(id as string)
    })
    return () => emitter.off("REFETCH_FUNCTIONS")
  }, [])

  const deleteSelected = () => {
    if (!selected?.length) return

    http
      .delete(`/settings/roles/${router.query.role_id}/functions`, {
        data: {
          permission_ids: selected.map((s) => s.id),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: t("success"),
            description: t("roles.functions.delete_success"),
          })
          fetchData()
          tableRef.current?.resetRowSelection()
          emitter.emit("REFETCH_ROLE", router.query.role_id)
          setSelected([])
        } else {
          toast({
            title: t("error"),
            description: t("roles.functions.delete_error"),
            variant: "destructive",
          })
        }
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.functions.delete_error"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("roles.functions.title")}
        description={t("roles.functions.description")}
      />

      <DataTable
        tableRef={tableRef}
        columns={columns}
        data={data}
        loading={loading}
        selectable={true}
        onSelectedRowsChange={(rows) => setSelected(rows)}
      >
        <div className="flex gap-2">
          <AssignFunction />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto h-8 lg:flex"
                size="sm"
                disabled={!selected?.length}
              >
                <MinusCircle className="mr-2 size-4" />
                {t("roles.functions.delete")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("roles.functions.delete_dialog.title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("roles.functions.delete_dialog.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("roles.functions.delete_dialog.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSelected()}>
                  {t("roles.functions.delete_dialog.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DataTable>
    </>
  )
}

RoleFunctionsList.getLayout = function getLayout(page: ReactElement<any>) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleFunctionsList
