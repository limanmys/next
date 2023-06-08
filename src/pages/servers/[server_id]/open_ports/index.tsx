import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { UploadCloud } from "lucide-react"

import { IPort } from "@/types/port"
import { DivergentColumn } from "@/types/table"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

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
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Açık Portlar</h2>
            <p className="text-muted-foreground">
              Sunucunuzda aktif yayın yapan portları ve o portu yöneten aktif
              işlemi görüntüleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      />
    </>
  )
}
