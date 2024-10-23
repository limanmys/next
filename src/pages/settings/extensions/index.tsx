import { http } from "@/services"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { ExtensionRowActions } from "@/components/settings/extension-actions"
import UploadExtension from "@/components/settings/upload-extension"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import { useEmitter } from "@/hooks/useEmitter"
import { compareNumericString } from "@/lib/utils"
import { IExtension } from "@/types/extension"
import { DivergentColumn } from "@/types/table"

export default function ExtensionSettingsPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const { t, i18n } = useTranslation("settings")
  const emitter = useEmitter()

  const columns: DivergentColumn<IExtension, string>[] = [
    {
      accessorKey: "display_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.display_name")}
        />
      ),
      title: t("extensions.display_name"),
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.version")}
        />
      ),
      title: t("extensions.version"),
    },
    {
      accessorKey: "licensed",
      accessorFn: (row) => {
        return row.licensed === "licensed" ? "1" : "0"
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.license")}
          filterPresets={[
            {
              key: t("extensions.licensed"),
              value: "1",
            },
            {
              key: t("extensions.not_licensed"),
              value: "0",
            },
          ]}
        />
      ),
      title: t("extensions.license"),
      cell: ({ row }) => (
        <>
          {row.original.licensed === "licensed" ? (
            <div className="flex items-center">
              <Check className="size-5 text-green-500" />
              <Badge className="ml-2" variant="success">
                {t("extensions.licensed")}
              </Badge>
            </div>
          ) : row.original.licensed === "not_licensed" ? (
            <div className="flex items-center">
              <X className="size-5 text-red-500" />
              <Badge className="ml-2" variant="outline">
                {t("extensions.not_licensed")}
              </Badge>
            </div>
          ) : (
            <Badge variant="outline">{t("extensions.non_commercial")}</Badge>
          )}
        </>
      ),
    },
    {
      accessorKey: "updated",
      accessorFn: (row) => {
        return new Date(row.updated).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("extensions.updated_at")}
        />
      ),
      title: t("extensions.updated_at"),
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
    http
      .get(`/settings/extensions`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    emitter.on("REFETCH_EXTENSIONS", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_EXTENSIONS")
  }, [])

  return (
    <>
      <PageHeader
        title={t("extensions.title")}
        description={t("extensions.description")}
      />

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
