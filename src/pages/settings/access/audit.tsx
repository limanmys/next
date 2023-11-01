import { ReactElement, useEffect, useState } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { ScrollText } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IAuditLog } from "@/types/audit_log"
import { DivergentColumn } from "@/types/table"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PageHeader from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import AccessLayout from "@/components/_layout/access_layout"

const AccessAuditLogsPage: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IAuditLog[]>([])
  const { t, i18n } = useTranslation("settings")

  const columns: DivergentColumn<IAuditLog, string>[] = [
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access.audit.username")}
        />
      ),
      title: t("access.audit.username"),
    },
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access.audit.ip_address")}
        />
      ),
      title: t("access.audit.ip_address"),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("access.audit.type")} />
      ),
      title: t("access.audit.type"),
      accessorFn: (row) => {
        return t(`access.audit.types.${row.type}`) as string
      },
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access.audit.action")}
          filterPresets={[
            {
              key: "delete",
              value: t(`access.audit.actions.delete`) as string,
            },
            {
              key: "upload",
              value: t(`access.audit.actions.upload`) as string,
            },
            {
              key: "users",
              value: t(`access.audit.actions.users`) as string,
            },
            {
              key: "assign",
              value: t(`access.audit.actions.assign`) as string,
            },
            {
              key: "unassign",
              value: t(`access.audit.actions.unassign`) as string,
            },
            {
              key: "update",
              value: t(`access.audit.actions.update`) as string,
            },
            {
              key: "create",
              value: t(`access.audit.actions.create`) as string,
            },
          ]}
          showFilterAsSelect={true}
        />
      ),
      title: t("access.audit.action"),
      accessorFn: (row) => {
        return t(`access.audit.actions.${row.action}`) as string
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {t(`access.audit.actions.${row.original.action}`)}{" "}
          <AuditLogDetails id={row.original.id} />
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access.audit.message")}
        />
      ),
      title: t("access.audit.message"),
      cell: ({ row }) => (
        <>
          {row.original.message
            ? t(
                `access.audit.messages.${row.original.message}`,
                row.original.details
              )
            : "-"}
        </>
      ),
      accessorFn: (row) => {
        return t(`access.audit.messages.${row.message}`, row.details) as string
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("access.audit.timestamp")}
        />
      ),
      title: t("access.audit.timestamp"),
      accessorFn: (row) =>
        new Date(row.created_at).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get<IAuditLog[]>(`/settings/access/audit`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <PageHeader
        title={t("access.audit.title")}
        description={t("access.audit.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      ></DataTable>

      <div className="mb-5"></div>
    </>
  )
}

function AuditLogDetails({ id }: { id: string }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>("")

  const fetchStatus = () => {
    setLoading(true)
    apiService
      .getInstance()
      .get<any>(`/settings/access/audit/${id}`)
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ScrollText
          className="h-4 w-4 cursor-pointer"
          onClick={() => fetchStatus()}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Erişim Kaydı Detayları</DialogTitle>
        </DialogHeader>
        <div className="relative grid gap-4 py-4">
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <pre className="max-h-[300px] overflow-x-scroll rounded-md bg-black p-5 text-green-500">
              {JSON.stringify(data.request, null, "\t")}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

AccessAuditLogsPage.getLayout = function getLayout(page: ReactElement) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessAuditLogsPage
