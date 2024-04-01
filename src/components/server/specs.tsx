import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { Cpu, MemoryStick, PackageSearch, Server } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IServerSpecs } from "@/types/server"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export default function ServerSpecs({ loader = false }: { loader?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IServerSpecs>()
  const { t } = useTranslation("servers")

  useEffect(() => {
    if (loader) return
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
        {t("system_status.specs")}
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
                    {t("system_status.cpu")}
                    <Cpu className="ml-2 inline-block size-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.cpu}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    {t("system_status.ram_size")}
                    <MemoryStick className="ml-2 inline-block size-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.ram}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    {t("system_status.vendor")}
                    <PackageSearch className="ml-2 inline-block size-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{data?.manufacturer}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    {t("system_status.model")}
                    <Server className="ml-2 inline-block size-4" />
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
