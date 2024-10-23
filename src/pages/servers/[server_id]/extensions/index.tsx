import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import { Link2, MinusCircle, Sliders, UploadCloud } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import AssignExtension from "@/components/server/assign-extension"
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
import { compareNumericString } from "@/lib/utils"
import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])
  const tableRef = useRef<any>()
  const sidebarCtx = useSidebarContext()
  const { toast } = useToast()
  const { t, i18n } = useTranslation("servers")

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
        <DataTableColumnHeader column={column} title={t("extensions.name")} />
      ),
      title: t("extensions.name"),
      cell: ({ row }) => (
        <>
          <Link
            href={`/servers/${sidebarCtx.selected}/extensions/${row.original.id}`}
          >
            {row.original.display_name}
            <Link2 className="ml-2 inline-block size-4" />
          </Link>
          <Link
            href={`/servers/${sidebarCtx.selected}/settings/${row.original.id}`}
          >
            <Sliders className="ml-2 inline-block size-4" />
          </Link>
        </>
      ),
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.version")}
        />
      ),
      title: t("extensions.version"),
    },
    {
      accessorKey: "updated",
      accessorFn: (row) => {
        return new Date(row.updated).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.updated_at")}
        />
      ),
      title: t("extensions.updated_at"),
      sortingFn: compareNumericString,
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    http
      .get(`/servers/${router.query.server_id}/extensions`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  const onAssignExtension = (extensions: IExtension[]) => {
    const values = extensions.map((i) => i.id)

    http
      .post(`extensions/assign`, {
        server_id: router.query.server_id,
        extensions: values,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("extensions.toasts.assign"),
        })
        sidebarCtx.refreshSelected()
        fetchData()
      })
  }

  const onUnassignExtension = (extensions: IExtension[]) => {
    const values = extensions.map((i) => i.id)

    http
      .post(`extensions/unassign`, {
        server_id: router.query.server_id,
        extensions: values,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("extensions.toasts.unassign"),
        })
        setSelected([])
        tableRef.current?.resetRowSelection()
        sidebarCtx.refreshSelected()
        fetchData()
      })
  }

  return (
    <>
      <PageHeader
        title={t("extensions.title")}
        description={t("extensions.description")}
        rightSide={
          <Link href="/settings/extensions">
            <Button className="rounded-full">
              <UploadCloud className="mr-2 size-4" />
              {t("extensions.upload")}
            </Button>
          </Link>
        }
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
          <AssignExtension
            serverId={router.query.server_id as string}
            onAssign={onAssignExtension}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto h-8 lg:flex"
                disabled={selected.length === 0}
              >
                <MinusCircle className="mr-2 size-4" />
                {t("extensions.remove")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("extensions.unassign.title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("extensions.unassign.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("extensions.unassign.no")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onUnassignExtension(selected)}
                >
                  {t("extensions.unassign.yes")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DataTable>
    </>
  )
}
