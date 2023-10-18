import { apiService } from "@/services"
import { Link2, Server } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { ServerRowActions } from "@/components/settings/server-actions"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { useEmitter } from "@/hooks/useEmitter"
import { IServer } from "@/types/server"
import { DivergentColumn } from "@/types/table"

export default function Servers() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IServer[]>([])
  const user = useCurrentUser()
  const emitter = useEmitter()
  const { t } = useTranslation("servers")

  const columns: DivergentColumn<IServer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("index.table.name")} />
      ),
      title: t("index.table.name"),
      enableSorting: true,
      enableHiding: true,
      cell: ({ row }) => user.permissions.server_details ? (
        <Link href={`/servers/${row.original.id}`}>
          {row.original.name}
          <Link2 className="ml-2 inline-block h-4 w-4" />
        </Link>
      ) : row.original.name,
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
      accessorKey: "extension_count",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("index.table.extension_count")}
        />
      ),
      title: t("index.table.extension_count"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ServerRowActions row={row} />
        </div>
      ),
    }
  ]

  useEffect(() => {
    setLoading(true)

    apiService
      .getInstance()
      .get(`/servers`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })

    emitter.on("REFETCH_SERVERS", () => {
      setLoading(true)

      apiService
        .getInstance()
        .get(`/servers`)
        .then((res) => {
          setData(res.data)
          setLoading(false)
        })
    })

    return () => {
      emitter.off("REFETCH_SERVERS")
    }
  }, [])

  return (
    <>
      <PageHeader
        title={t("index.title")}
        description={t("index.description")}
        rightSide={
          user.permissions.add_server && (
            <Link href="/servers/create">
              <Button className="rounded-full">
                <Server className="mr-2 h-4 w-4" />
                {t("index.create")}
              </Button>
            </Link>
          )
        }
      />

      <DataTable columns={columns} data={data} loading={loading} />
    </>
  )
}
