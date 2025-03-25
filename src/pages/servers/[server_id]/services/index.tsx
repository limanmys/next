import { http } from "@/services"
import {
  CheckCircle,
  ListRestart,
  PlayCircle,
  ScrollText,
  StopCircle,
  X
} from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

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
import { IService } from "@/types/service"
import { DivergentColumn } from "@/types/table"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IService[]>([])
  const [selected, setSelected] = useState<IService[]>([])
  const tableRef = useRef<any>(undefined)
  const { toast } = useToast()
  const { t } = useTranslation("servers")

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
      title: t("services.name.title"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ServiceStatusWindow name={row.original.name} disabled={row.original.status.running !== "running"} />
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
      accessorKey: "running",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("services.status.running.title")}
          filterPresets={[
            {
              key: t("services.status.running.yes"),
              value: 0 + t("services.status.running.yes"),
            },
            {
              key: t("services.status.running.no"),
              value: 1 + t("services.status.running.no"),
            },
          ]}
        />
      ),
      title: t("services.status.running.title"),
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
        </div>
      ),
      accessorFn: (row) => {
        return `${row.status.running === "running"
          ? 0 + t("services.status.running.yes")
          : 1 + t("services.status.running.no")
          }`
      },
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("services.status.active.title")}
          filterPresets={[
            {
              key: t("services.status.active.yes"),
              value: 0 + t("services.status.active.yes"),
            },
            {
              key: t("services.status.active.no"),
              value: 1 + t("services.status.active.no"),
            },
          ]}
        />
      ),
      title: t("services.status.active.title"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.original.status.active ? "default" : "secondary"}>
            {row.original.status.active
              ? t("services.status.active.yes")
              : t("services.status.active.no")}
          </Badge>
        </div>
      ),
      accessorFn: (row) => {
        return `${row.status.active
          ? 0 + t("services.status.active.yes")
          : 1 + t("services.status.active.no")
          }`
      },
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    http
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

    http
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
              <PlayCircle className="mr-2 size-4" />
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
              <StopCircle className="mr-2 size-4" />
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
              <ListRestart className="mr-2 size-4" />
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
              <CheckCircle className="mr-2 size-4" />
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
              <X className="mr-2 size-4" />
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
  const { t } = useTranslation("servers")

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

function ServiceStatusWindow({ name, disabled = false }: { name: string; disabled: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<string>("")
  const { t } = useTranslation("servers")

  const fetchStatus = () => {
    if (disabled) return

    setLoading(true)
    http
      .post(`/servers/${router.query.server_id}/services/status`, {
        service_name: name,
      })
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
  }
  
  if (disabled) {
    return (
      <ScrollText
        className="size-4 text-muted-foreground cursor-not-allowed"
      />
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ScrollText
          className="size-4 cursor-pointer"
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
