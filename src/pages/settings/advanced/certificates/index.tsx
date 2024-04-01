import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { ICertificate } from "@/types/certificate"
import { DivergentColumn } from "@/types/table"
import { compareNumericString } from "@/lib/utils"
import { useEmitter } from "@/hooks/useEmitter"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import AdvancedLayout from "@/components/_layout/advanced_layout"
import { CertificateActions } from "@/components/settings/certificate-actions"

const AdvancedCertificateSettingsPage: NextPageWithLayout = () => {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ICertificate[]>([])
  const { t, i18n } = useTranslation("settings")

  const emitter = useEmitter()

  const columns: DivergentColumn<ICertificate, string>[] = [
    {
      accessorKey: "server_hostname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hostname" />
      ),
      title: "Hostname",
    },
    {
      accessorKey: "origin",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Port" />
      ),
      title: "Port",
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("advanced.certificates.updated_at")}
        />
      ),
      title: t("advanced.certificates.updated_at"),
      accessorFn: (row) =>
        new Date(row.updated_at).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortingFn: compareNumericString,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <CertificateActions row={row} />
        </div>
      ),
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get<ICertificate[]>(`/settings/advanced/certificates`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    emitter.on("REFETCH_CERTIFICATES", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_CERTIFICATES")
  }, [])

  return (
    <>
      <PageHeader
        title={t("advanced.certificates.title")}
        description={t("advanced.certificates.description")}
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
          onClick={() =>
            router.push("/settings/advanced/certificates/retrieve")
          }
        >
          <PlusCircle className="mr-2 size-4" />
          {t("advanced.certificates.add")}
        </Button>
      </DataTable>
    </>
  )
}

AdvancedCertificateSettingsPage.getLayout = function getLayout(
  page: ReactElement
) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedCertificateSettingsPage
