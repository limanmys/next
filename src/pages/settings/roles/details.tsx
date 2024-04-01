import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { ChevronLeft, Download } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IRole } from "@/types/role"
import { DivergentColumn } from "@/types/table"
import { useDownloadFile } from "@/hooks/useDownloadFile"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"

export default function RoleDetailsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IRole[]>([])
  const { t } = useTranslation("settings")

  const columns: DivergentColumn<IRole, string>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.details.username")}
        />
      ),
      title: t("roles.details.username"),
    },
    {
      accessorKey: "role_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.details.role_name")}
        />
      ),
      title: t("roles.details.role_name"),
    },
    {
      accessorKey: "perm_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.details.perm_type")}
          filterPresets={[
            {
              key: t("roles.details.liman"),
              value: t("roles.details.liman"),
            },
            {
              key: t("roles.details.server"),
              value: t("roles.details.server"),
            },
            {
              key: t("roles.details.extension"),
              value: t("roles.details.extension"),
            },
            {
              key: t("roles.details.function"),
              value: t("roles.details.function"),
            },
          ]}
        />
      ),
      title: t("roles.details.perm_type"),
    },
    {
      accessorKey: "perm_value",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("roles.details.perm_value")}
        />
      ),
      title: t("roles.details.perm_value"),
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
        title: t("information"),
        description: t("roles.details.download_start"),
      }),
    postDownloading: () =>
      toast({
        title: t("information"),
        description: t("roles.details.download_success"),
      }),
    onError: () => {
      toast({
        title: t("error"),
        description: t("roles.details.download_error"),
      })
    },
    getFileName: () => {
      return `detailed_roles_list_${Date.now()}.csv`
    },
  })

  return (
    <>
      <PageHeader
        title={t("roles.details.title")}
        description={t("roles.details.description")}
      />

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
            <ChevronLeft className="mr-2 size-4" />
            {t("roles.details.back_to_roles")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={download}
          >
            <Download className="mr-2 size-4" />
            {t("roles.details.create_report")}
          </Button>

          <a href={url} download={name} className="hidden" ref={ref} />
        </div>
      </DataTable>
    </>
  )
}
