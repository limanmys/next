import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { ChevronLeft, Download } from "lucide-react"

import { IRole } from "@/types/role"
import { DivergentColumn } from "@/types/table"
import { useDownloadFile } from "@/hooks/useDownloadFile"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useToast } from "@/components/ui/use-toast"

export default function RoleDetailsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IRole[]>([])

  const columns: DivergentColumn<IRole, string>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kullanıcı Adı" />
      ),
      title: "Kullanıcı Adı",
    },
    {
      accessorKey: "role_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rol Adı" />
      ),
      title: "Rol Adı",
    },
    {
      accessorKey: "perm_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="İzin Türü"
          filterPresets={[
            {
              key: "Liman",
              value: "Liman",
            },
            {
              key: "Sunucu",
              value: "Sunucu",
            },
            {
              key: "Eklenti",
              value: "Eklenti",
            },
            {
              key: "Fonksiyon",
              value: "Fonksiyon",
            },
          ]}
        />
      ),
      title: "İzin Türü",
    },
    {
      accessorKey: "perm_value",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="İzin Değeri" />
      ),
      title: "İzin Değeri",
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/roles/details`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const { ref, url, download, name } = useDownloadFile({
    apiDefinition: () => {
      return apiService.getInstance().get(`/settings/roles/details/csv`, {
        responseType: "blob",
      })
    },
    preDownloading: () =>
      toast({
        title: "Bilgi",
        description: "İndirme başladı.",
      }),
    postDownloading: () =>
      toast({
        title: "Bilgi",
        description: "İndirme tamamlandı.",
      }),
    onError: () => {
      toast({
        title: "Hata",
        description: "Eklenti indirilirken bir hata oluştu.",
      })
    },
    getFileName: () => {
      return `detailed_roles_list_${Date.now()}.csv`
    },
  })

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Detaylı Rol Listesi
            </h2>
            <p className="text-muted-foreground">
              Veritabanı üzerinde oluşturulmuş tüm rol ve izinleri detaylı
              filtrelemeler yaparak görüntüleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={() => router.push("/settings/roles")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Rollere geri dön
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={download}
          >
            <Download className="mr-2 h-4 w-4" />
            Rapor oluştur
          </Button>

          <a href={url} download={name} className="hidden" ref={ref} />
        </div>
      </DataTable>
    </>
  )
}
