import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { DivergentColumn } from "@/types/table"
import { IAuthLog } from "@/types/user"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export default function AuthLog() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IAuthLog[]>([])
  const { i18n } = useTranslation()
  const { t } = useTranslation("settings")

  const columns: DivergentColumn<IAuthLog, string>[] = [
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("profile.auth_log.ip_address")}
        />
      ),
      title: t("profile.auth_log.ip_address"),
    },
    {
      accessorKey: "user_agent",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("profile.auth_log.browser")}
        />
      ),
      title: t("profile.auth_log.browser"),
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
          title={t("profile.auth_log.date")}
        />
      ),
      title: t("profile.auth_log.date"),
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
      .get<IAuthLog[]>(`/profile/auth_logs`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      selectable={false}
    ></DataTable>
  )
}
