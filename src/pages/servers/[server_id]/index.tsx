import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { IServer, IServerDetails } from "@/types/server"
import Loading from "@/components/ui/loading"
import CpuTable from "@/components/server/cpu-table"
import ServerDetails from "@/components/server/details"
import DiskTable from "@/components/server/disk-table"
import RamTable from "@/components/server/ram-table"
import ResourceUsage from "@/components/server/resource-usage"
import ServerSpecs from "@/components/server/specs"

interface IDetails {
  server: IServer
  details: IServerDetails
}

export default function ServerStatus() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IDetails>({} as IDetails)
  const { t } = useTranslation("servers")

  useEffect(() => {
    setLoading(true)
    if (!router.query.server_id) return

    apiService
      .getInstance()
      .get(`/servers/${router.query.server_id}`)
      .then((res) => {
        setLoading(false)
        setData(res.data)
      })
  }, [router.query.server_id])

  return (
    <>
      <div className="grid grid-cols-5">
        <ServerDetails loading={loading} data={data} />
        {data && data.server && data.server.os === "linux" ? (
          <div className="col-span-4 flex flex-col">
            <ServerSpecs />
            {data.server && data.server.os === "linux" && <ResourceUsage />}
            <div className="flex flex-[2] divide-x border-t">
              <div className="w-1/3 pb-[24px]">
                <h2 className="p-[24px] text-xl font-bold tracking-tight">
                  {t("system_status.cpu_usage")}
                </h2>
                <CpuTable />
              </div>
              <div className="w-1/3 pb-[24px]">
                <h2 className="p-[24px] text-xl font-bold tracking-tight">
                  {t("system_status.ram_usage")}
                </h2>
                <RamTable />
              </div>
              <div className="w-1/3 pb-[24px]">
                <h2 className="p-[24px] text-xl font-bold tracking-tight">
                  {t("system_status.disk_status")}
                </h2>
                <DiskTable />
              </div>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="col-span-4 flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <div className="col-span-4 flex items-center justify-center">
                <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                    {t("warning")}
                  </h1>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    {t("not_supported")}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
