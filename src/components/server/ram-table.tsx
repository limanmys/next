import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { IServerCpuUsage } from "@/types/server"

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

export default function RamTable() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IServerCpuUsage[]>([])

  useEffect(() => {
    setLoading(true)
    if (!router.query.server_id) return

    const f = () =>
      apiService
        .getInstance()
        .get(`/servers/${router.query.server_id}/stats/ram`)
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
      <TableCaption>En çok bellek kullanan 5 işlem</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-6">Kullanıcı</TableHead>
          <TableHead>İşlem</TableHead>
          <TableHead>Kullanım (%)</TableHead>
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
              </TableRow>
            ))}
          </>
        ) : (
          <>
            {data.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">{item.user}</TableCell>
                <TableCell>{item.cmd}</TableCell>
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
