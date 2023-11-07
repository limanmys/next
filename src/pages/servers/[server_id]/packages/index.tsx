import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { UploadCloud } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IPackage } from "@/types/package"
import { DivergentColumn } from "@/types/table"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"

export default function ServerExtensionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IPackage[]>([])
  const { t } = useTranslation("servers")

  const columns: DivergentColumn<IPackage, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("packages.accessor_name_title")}
        />
      ),
      title: t("packages.accessor_name_title"),
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("packages.accessor_version_title")}
        />
      ),
      title: t("packages.accessor_version_title"),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("packages.accessor_type_title")}
        />
      ),
      title: t("packages.accessor_type_title"),
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
        title={t("packages.page_header.title")}
        description={t("packages.page_header.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
          onClick={() => router.push(`${router.asPath}/install`)}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {t("packages.upload")}
        </Button>
      </DataTable>
    </>
  )
}
