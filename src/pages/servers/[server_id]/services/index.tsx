import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { t } from "i18next"
import {
  CheckCircle,
  ListRestart,
  PlayCircle,
  ScrollText,
  StopCircle,
  X,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { IService } from "@/types/service"
import { DivergentColumn } from "@/types/table"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PageHeader from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IService[]>([])
  const [selected, setSelected] = useState<IService[]>([])
  const tableRef = useRef<any>()
  const { toast } = useToast()
  const { t } = useTranslation("settings")

  const columns: DivergentColumn<IService, string>[] = [
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
          title={t("services.name.title")}
        />
      ),
      title: t("services.name"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ServiceStatusWindow name={row.original.name} />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("services.description.title")}
        />
      ),
      title: t("services.description.title"),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("services.status.title")}
        />
      ),
      title: t("services.status.title"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge
            variant={
              row.original.status.running === "running"
                ? "success"
                : "destructive"
            }
          >
            {row.original.status.running === "running"
              ? t("services.status.running.yes")
              : t("services.status.running.no")}
          </Badge>

          <Badge variant={row.original.status.active ? "default" : "secondary"}>
            {row.original.status.active
              ? t("services.status.active.yes")
              : t("services.status.active.no")}
          </Badge>
        </div>
      ),
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/services`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  const serviceOperation = (action: string) => {
    if (!selected.length) return

    const services = selected.map((service) => service.name)

    apiService
      .getInstance()
      .post(`/servers/${router.query.server_id}/services/${action}`, {
        services,
      })
      .then(() => {
        toast({
          title: t("services.toast.title"),
          description: t("services.toast.description"),
        })
        tableRef.current?.resetRowSelection()
        setSelected([])
        fetchData()
      })
  }

  return (
    <>
      <PageHeader
        title={t("services.page_header.title")}
        description={t("services.page_header.description")}
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
          <ServiceAlertWindow onAction={() => serviceOperation("start")}>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-8 lg:flex"
              disabled={!selected.length}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              {t("services.start")}
            </Button>
          </ServiceAlertWindow>
          <ServiceAlertWindow onAction={() => serviceOperation("stop")}>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-8 lg:flex"
              disabled={!selected.length}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              {t("services.stop")}
            </Button>
          </ServiceAlertWindow>
          <ServiceAlertWindow onAction={() => serviceOperation("restart")}>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-8 lg:flex"
              disabled={!selected.length}
            >
              <ListRestart className="mr-2 h-4 w-4" />
              {t("services.restart")}
            </Button>
          </ServiceAlertWindow>
          <ServiceAlertWindow onAction={() => serviceOperation("enable")}>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-8 lg:flex"
              disabled={!selected.length}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("services.activate")}
            </Button>
          </ServiceAlertWindow>
          <ServiceAlertWindow onAction={() => serviceOperation("disable")}>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-8 lg:flex"
              disabled={!selected.length}
            >
              <X className="mr-2 h-4 w-4" />
              {t("services.deactivate")}
            </Button>
          </ServiceAlertWindow>
        </div>
      </DataTable>
    </>
  )
}

function ServiceAlertWindow({
  children,
  onAction,
}: {
  children: React.ReactNode
  onAction: () => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("services.alert_dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("services.alert_dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("services.alert_dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onAction()}>
            {t("services.alert_dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ServiceStatusWindow({ name }: { name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<string>("")

  const fetchStatus = () => {
    setLoading(true)
    apiService
      .getInstance()
      .post(`/servers/${router.query.server_id}/services/status`, {
        service_name: name,
      })
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ScrollText
          className="h-4 w-4 cursor-pointer"
          onClick={() => fetchStatus()}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>
            {name} {t("services.dialog_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="relative grid gap-4 py-4">
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <pre className="max-h-[300px] overflow-x-scroll rounded-md bg-black p-5 text-green-500">
              {data}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
