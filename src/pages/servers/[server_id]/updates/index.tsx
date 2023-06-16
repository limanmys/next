import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { IPackage } from "@/types/package"
import { DivergentColumn } from "@/types/table"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IPackage[]>([])

  const columns: DivergentColumn<IPackage, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eklenti Adı" />
      ),
      title: "Eklenti Adı",
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Güncellenecek Versiyon" />
      ),
      title: "Güncellenecek Versiyon",
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mimari Uyumluluğu" />
      ),
      title: "Mimari Uyumluluğu",
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Durum" />
      ),
      title: "Durum",
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/updates`)
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
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              Güncellemeler{" "}
              {loading ? (
                <Skeleton className="h-[22px] w-[40px]" />
              ) : (
                <Badge>{data.length}</Badge>
              )}
            </h2>
            <p className="text-muted-foreground">
              Sunucunuzdaki güncellemeleri bu sayfa aracılığı ile
              görüntüleyebilir ve güncelleme işlemlerini yapabilirsiniz.
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
