import { NextPageWithLayout } from "@/pages/_app"
import { http } from "@/services"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import AdvancedLayout from "@/components/_layout/advanced_layout"
import { CertificateActions } from "@/components/settings/certificate-actions"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import { useEmitter } from "@/hooks/useEmitter"
import { compareNumericString } from "@/lib/utils"
import { ICertificate } from "@/types/certificate"
import { DivergentColumn } from "@/types/table"

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
      accessorKey: "valid_to",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bitiş Süresi" />
      ),
      title: "Bitiş Süresi",
      accessorFn: (row) =>
        new Date(row.valid_to).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      cell: ({ row, getValue }) => (
        <>
          {/* Add icons for validity time is near 1 month, is not valid and valid states */}
          <div className="flex items-center">
            {new Date(row.original.valid_to).getTime() - new Date().getTime() <
              0 ? (
              <div className="mr-2 size-3 rounded-full bg-red-500"></div>
            ) : new Date(row.original.valid_to).getTime() -
              new Date().getTime() <
              2592000000 ? (
              <div className="mr-2 size-3 rounded-full bg-yellow-500"></div>
            ) : (
              <div className="mr-2 size-3 rounded-full bg-green-500"></div>
            )}
            {getValue()}
          </div>
        </>
      ),
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
    http
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
  page: ReactElement<any>
) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedCertificateSettingsPage
