import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { IServerDiskUsage } from "@/types/server"

import { Progress } from "../ui/progress"
import { Skeleton } from "../ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

export default function DiskTable() {
  const router = useRouter()
  const { t } = useTranslation("servers")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IServerDiskUsage[]>([])

  useEffect(() => {
    setLoading(true)
    if (!router.query.server_id) return

    const f = () =>
      apiService
        .getInstance()
        .get(`/servers/${router.query.server_id}/stats/disk`)
        .then((res) => {
          setLoading(false)
          setData(res.data)
        })

    f()
    const timer = setInterval(f, 20000)

    return () => clearInterval(timer)
  }, [router.query.server_id])

  return (
    <Table>
      <TableCaption>{t("system_status.disk_status_desc")}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-6">{t("system_status.disk")}</TableHead>
          <TableHead>{t("system_status.size")}</TableHead>
          <TableHead>{t("system_status.full")}</TableHead>
          <TableHead>{t("system_status.usage")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">
                  <Skeleton className="h-[20px] w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] w-full" />
                </TableCell>
              </TableRow>
            ))}
          </>
        ) : (
          <>
            {data.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">{item.source}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.used}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Number(item.percent)}
                      className="h-[10px]"
                    />
                    <span>%{item.percent}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  )
}
