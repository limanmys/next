import { useEffect, useState } from "react"
import Link from "next/link"
import { http } from "@/services"
import { Server } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IServer } from "@/types/server"
import { DivergentColumn } from "@/types/table"
import { compareNumericString } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { useEmitter } from "@/hooks/useEmitter"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import { ServerRowActions } from "@/components/settings/server-actions"
import { ServerConnectionStatus } from "@/components/settings/server-connection-status"
import TypeIcon from "@/components/type-icon"

export default function Servers() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IServer[]>([])
  const [error, setError] = useState(false)
  const [revision, setRevision] = useState(0)
  const user = useCurrentUser()
  const emitter = useEmitter()
  const { t } = useTranslation("servers")
  const { t: tSettings } = useTranslation("settings")

  const columns: DivergentColumn<IServer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("index.table.name")} />
      ),
      title: t("index.table.name"),
      enableSorting: true,
      enableHiding: true,
      cell: ({ row }) => {
        return (
          <>
            <TypeIcon
              type={row.original.os}
              className="inline-block mr-2 size-4"
            />
            {row.original.name}
          </>
        )
      },
    },
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("index.table.ip_address")}
        />
      ),
      title: t("index.table.ip_address"),
    },
    {
      accessorKey: "control_port",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("index.table.port")} />
      ),
      title: t("index.table.port"),
    },
    {
      id: "connection_status",
      header: tSettings("servers.connection.title"),
      title: tSettings("servers.connection.title"),
      enableSorting: false,
      cell: ({ row }) =>
        row.original.connection_status ? (
          <ServerConnectionStatus status={row.original.connection_status} />
        ) : (
          <span className="text-muted-foreground">
            {tSettings("servers.connection.unknown")}
          </span>
        ),
    },
    {
      accessorKey: "extension_count",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("index.table.extension_count")}
        />
      ),
      title: t("index.table.extension_count"),
      sortingFn: compareNumericString,
      filterFn: "weakEquals",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ServerRowActions row={row} />
        </div>
      ),
    },
  ]

  useEffect(() => {
    let active = true
    let controller: AbortController | undefined
    const fetchServers = () => {
      controller?.abort()
      controller = new AbortController()
      const signal = controller.signal
      setError(false)
      http
        .get<IServer[]>("/servers", { signal })
        .then((res) => {
          if (active && !signal.aborted) setData(res.data)
        })
        .catch(() => {
          if (active && !signal.aborted) setError(true)
        })
        .finally(() => {
          if (active && !signal.aborted) setLoading(false)
        })
    }
    fetchServers()
    emitter.on("REFETCH_SERVERS", fetchServers)
    return () => {
      active = false
      controller?.abort()
      emitter.off("REFETCH_SERVERS", fetchServers)
    }
  }, [emitter, revision])

  return (
    <>
      <PageHeader
        title={t("index.title")}
        description={t("index.description")}
        rightSide={
          user.permissions.add_server && (
            <Link href="/servers/create">
              <Button className="rounded-full">
                <Server className="mr-2 size-4" />
                {t("index.create")}
              </Button>
            </Link>
          )
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            {tSettings("servers.connection.list_error")}
            <Button
              variant="outline"
              onClick={() => setRevision((value) => value + 1)}
            >
              {tSettings("servers.actions.ssh_host_key.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <DataTable columns={columns} data={data} loading={loading} />
    </>
  )
}
