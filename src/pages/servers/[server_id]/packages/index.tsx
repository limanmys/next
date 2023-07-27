import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { IPackage } from "@/types/package"
import { DivergentColumn } from "@/types/table"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"

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
      <PageHeader
        title="Paketler"
        description="Sunucunuzda yüklü olan paketleri bu sayfa aracılığı ile yönetebilir, yeni paketler ekleyebilirsiniz."
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
