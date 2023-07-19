import { useEffect, useState } from "react"
import Link from "next/link"
import { apiService } from "@/services"
import { Link2, Server } from "lucide-react"

import { IServer } from "@/types/server"
import { DivergentColumn } from "@/types/table"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

export default function Servers() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IServer[]>([])

  const columns: DivergentColumn<IServer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sunucu Adı" />
      ),
      title: "Sunucu Adı",
      enableSorting: true,
      enableHiding: true,
      cell: ({ row }) => (
        <Link href={`/servers/${row.original.id}`}>
          {row.original.name}
          <Link2 className="ml-2 inline-block h-4 w-4" />
        </Link>
      ),
    },
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IP Adresi" />
      ),
      title: "IP Adresi",
    },
    {
      accessorKey: "control_port",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kontrol Portu" />
      ),
      title: "Kontrol Portu",
    },
    {
      accessorKey: "extension_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eklenti Sayısı" />
      ),
      title: "Eklenti Sayısı",
    },
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
  }, [])

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sunucular</h2>
            <p className="text-muted-foreground">
              Liman Merkezi Yönetim Sistemine bağlı sunucularınızı bu sayfa
              üzerinden yönetebilirsiniz.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/servers/create">
              <Button className="rounded-full">
                <Server className="mr-2 h-4 w-4" />
                Sunucu Ekle
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
    </>
  )
}
