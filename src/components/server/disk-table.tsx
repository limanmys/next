import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

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
      <TableCaption>Sisteme mount edilmiş disk kullanım durumları</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-6">Disk</TableHead>
          <TableHead>Boyut</TableHead>
          <TableHead>Dolu</TableHead>
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
