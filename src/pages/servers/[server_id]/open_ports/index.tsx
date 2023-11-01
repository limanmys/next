import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { IPort } from "@/types/port"
import { DivergentColumn } from "@/types/table"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IPort[]>([])
  const { t } = useTranslation("servers")

  const columns: DivergentColumn<IPort, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("open_ports.accessor_name_title")}
        />
      ),
      title: t("open_ports.accessor_name_title"),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("open_ports.accessor_username_title")}
        />
      ),
      title: t("open_ports.accessor_username_title"),
    },
    {
      accessorKey: "ip_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("open_ports.accessor_ip_type_title")}
          showFilterAsSelect
          filterPresets={[
            { key: "ipv4", value: "IPv4" },
            { key: "ipv6", value: "IPv6" },
          ]}
        />
      ),
      title: t("open_ports.accessor_ip_type_title"),
    },
    {
      accessorKey: "packet_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("open_ports.accessor_packet_type_title")}
          showFilterAsSelect
          filterPresets={[
            { key: "tcp", value: "TCP" },
            { key: "udp", value: "UDP" },
          ]}
        />
      ),
      title: t("open_ports.accessor_packet_type_title"),
    },
    {
      accessorKey: "port",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("open_ports.accessor_port_title")}
        />
      ),
      title: t("open_ports.accessor_port_title"),
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/ports`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [router.query.server_id])

  return (
    <>
      <PageHeader
        title={t("open_ports.page_header.title")}
        description={t("open_ports.page_header.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      />
    </>
  )
}
