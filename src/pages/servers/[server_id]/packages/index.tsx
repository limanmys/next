import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { UploadCloud } from "lucide-react"

import { IPackage } from "@/types/package"
import { DivergentColumn } from "@/types/table"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

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
        <DataTableColumnHeader column={column} title="Versiyon" />
      ),
      title: "Versiyon",
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mimari Uyumluluğu" />
      ),
      title: "Mimari Uyumluluğu",
    },
  ]

  const fetchData = () => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/packages`)
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
            <h2 className="text-2xl font-bold tracking-tight">Paketler</h2>
            <p className="text-muted-foreground">
              Sunucunuzda yüklü olan paketleri bu sayfa aracılığı ile
              yönetebilir, yeni paketler ekleyebilirsiniz.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-full">
              <UploadCloud className="mr-2 h-4 w-4" />
              Paket Yükle
            </Button>
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
