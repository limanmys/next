import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { Check, X } from "lucide-react"

import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"
import { compareNumericString } from "@/lib/utils"
import { useEmitter } from "@/hooks/useEmitter"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { ExtensionRowActions } from "@/components/settings/extension-actions"
import UploadExtension from "@/components/settings/upload-extension"

export default function ExtensionSettingsPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])

  const emitter = useEmitter()

  const columns: DivergentColumn<IExtension, string>[] = [
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
      accessorKey: "licensed",
      accessorFn: (row) => {
        return row.licensed ? "lisanslı" : "lisanslanmamış"
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Lisanslanmış"
          filterPresets={[
            {
              key: "Lisanslı",
              value: "lisanslı",
            },
            {
              key: "Lisanslanmamış",
              value: "lisanslanmamış",
            },
          ]}
        />
      ),
      title: "Lisanslanmış",
      cell: ({ row }) => (
        <>
          {row.original.licensed ? (
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500" />
              <Badge className="ml-2" variant="success">
                Lisanslı
              </Badge>
            </div>
          ) : (
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-500" />
              <Badge className="ml-2" variant="outline">
                Lisanslanmamış
              </Badge>
            </div>
          )}
        </>
      ),
    },
    {
      accessorKey: "updated",
      accessorFn: (row) => {
        return new Date(row.updated).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Güncellenme Tarihi" />
      ),
      title: "Güncellenme Tarihi",
      sortingFn: compareNumericString,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ExtensionRowActions row={row} />
        </div>
      ),
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/extensions`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  emitter.on("REFETCH_EXTENSIONS", () => {
    fetchData()
  })

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Eklentiler</h2>
            <p className="text-muted-foreground">
              Bu sayfa aracılığıyla sisteminizdeki eklentileri yönetebilir,
              sürümlerini güncelleyebilir ve yeni eklentiler yükleyebilirsiniz.
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
        <UploadExtension />
      </DataTable>
    </>
  )
}
