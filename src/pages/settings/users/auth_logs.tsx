import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { ChevronLeft } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DivergentColumn } from "@/types/table"
import { IAuthLog } from "@/types/user"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AuthLogsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IAuthLog[]>([])
  const { t, i18n } = useTranslation("settings")

  const columns: DivergentColumn<IAuthLog, string>[] = [
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_log.user")}
        />
      ),
      title: t("users.auth_log.user"),
      cell: ({ row }) => (
        <>
          {row.original.user.name} ({row.original.user.email})
        </>
      ),
    },
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_log.ip_address")}
        />
      ),
      title: t("users.auth_log.ip_address"),
    },
    {
      accessorKey: "user_agent",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_log.browser")}
        />
      ),
      title: t("users.auth_log.browser"),
      cell: ({ row }) => (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <span className="cursor-pointer text-blue-500">
                {row.original.user_agent.substring(0, 30) + "..."}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.user_agent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_log.created_at")}
        />
      ),
      title: t("users.auth_log.created_at"),
      cell: ({ row }) => (
        <>
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString(
                i18n.language,
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : t("users.auth_log.unknown")}
        </>
      ),
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get<IAuthLog[]>(`/settings/users/auth_logs`)
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
        title={t("users.auth_log.title")}
        description={t("users.auth_log.description")}
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
            onClick={() => router.push("/settings/users")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("users.auth_log.back_to_users")}
          </Button>
        </div>
      </DataTable>
    </>
  )
}
