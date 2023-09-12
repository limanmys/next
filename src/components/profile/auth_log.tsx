import { useEffect, useState } from "react"
import { apiService } from "@/services"

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

  const columns: DivergentColumn<IAuthLog, string>[] = [
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giriş Yapan IP Adresi" />
      ),
      title: "Giriş Yapan IP Adresi",
    },
    {
      accessorKey: "user_agent",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tarayıcı Bilgileri" />
      ),
      title: "Tarayıcı Bilgileri",
      cell: ({ row }) => (
        <TooltipProvider>
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
        <DataTableColumnHeader column={column} title="Giriş Tarihi" />
      ),
      title: "Giriş Tarihi",
      cell: ({ row }) => (
        <>
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Bilinmiyor"}
        </>
      ),
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
    <>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      ></DataTable>
    </>
  )
}
