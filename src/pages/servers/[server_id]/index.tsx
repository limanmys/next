import { http } from "@/services"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import CpuTable from "@/components/server/cpu-table"
import ServerDetails from "@/components/server/details"
import DiskTable from "@/components/server/disk-table"
import RamTable from "@/components/server/ram-table"
import ResourceUsage from "@/components/server/resource-usage"
import ServerSpecs from "@/components/server/specs"
import { IServer, IServerDetails } from "@/types/server"

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

    http
      .get(`/servers/${router.query.server_id}`)
      .then((res) => {
        setLoading(false)
        setData(res.data)
      })
  }, [router.query.server_id])

  if (!router.query.server_id || loading) {
    return (
      <div className="grid grid-cols-5">
        <ServerDetails loading={loading} data={data} />
        <div className="col-span-4 flex flex-col">
          <ServerSpecs loader />
          <ResourceUsage loader />
          <div className="flex flex-2 divide-x border-t">
            <div className="w-1/3 pb-[24px]">
              <h2 className="p-[24px] text-xl font-bold tracking-tight">
                {t("system_status.cpu_usage")}
              </h2>
              <CpuTable loader />
            </div>
            <div className="w-1/3 pb-[24px]">
              <h2 className="p-[24px] text-xl font-bold tracking-tight">
                {t("system_status.ram_usage")}
              </h2>
              <RamTable loader />
            </div>
            <div className="w-1/3 pb-[24px]">
              <h2 className="p-[24px] text-xl font-bold tracking-tight">
                {t("system_status.disk_status")}
              </h2>
              <DiskTable loader />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (data.server?.os !== "linux") {
    return (
      <div className="grid grid-cols-5">
        <ServerDetails loading={loading} data={data} />
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
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5">
      <ServerDetails loading={loading} data={data} />
      <div className="col-span-4 flex flex-col">
        <div className="hidden">{JSON.stringify(loading)}</div>
        <ServerSpecs />
        <ResourceUsage />
        <div className="flex flex-2 divide-x border-t">
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
    </div>
  )
}
