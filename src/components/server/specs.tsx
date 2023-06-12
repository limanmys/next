import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { Cpu, MemoryStick, PackageSearch, Server } from "lucide-react"

import { IServerSpecs } from "@/types/server"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export default function ServerSpecs() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IServerSpecs>()

  useEffect(() => {
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}/specs`)
      .then((response) => {
        setLoading(false)
        setData(response.data)
      })
  }, [router.query.server_id])

  return (
    <div className="border-b p-[24px]">
      <h2 className="mb-5 text-2xl font-bold tracking-tight">
        Sunucu Özellikleri
      </h2>
      <div className="grid grid-cols-4 gap-5">
        {loading ? (
          <>
            <Skeleton className="h-[174px] w-full" />
            <Skeleton className="h-[174px] w-full" />
            <Skeleton className="h-[174px] w-full" />
            <Skeleton className="h-[174px] w-full" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    CPU
                    <Cpu className="ml-2 inline-block h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.cpu}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    Bellek Boyutu
                    <MemoryStick className="ml-2 inline-block h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.ram} GB</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    Üretici
                    <PackageSearch className="ml-2 inline-block h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.manufacturer}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    Model
                    <Server className="ml-2 inline-block h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.model}</CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
