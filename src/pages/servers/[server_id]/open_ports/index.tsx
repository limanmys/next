import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { IPort } from "@/types/port"
import { DivergentColumn } from "@/types/table"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IPort[]>([])

  const columns: DivergentColumn<IPort, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Program Adı" />
      ),
      title: "Program Adı",
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kullanıcı" />
      ),
      title: "Kullanıcı",
    },
    {
      accessorKey: "ip_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IP Türü" />
      ),
      title: "IP Türü",
    },
    {
      accessorKey: "packet_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paket Türü" />
      ),
      title: "Paket Türü",
    },
    {
      accessorKey: "port",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Port" />
      ),
      title: "Port",
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
        title="Açık Portlar"
        description="Sunucunuzda aktif yayın yapan portları ve o portu yöneten aktif işlemi görüntüleyebilirsiniz."
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
