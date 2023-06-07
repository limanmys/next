import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { IServer, IServerDetails } from "@/types/server"
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
        <>
          <ServerDetails loading={loading} data={data} />
        </>
        <div className="col-span-4 flex flex-col">
          <ServerSpecs />
          {data.server && data.server.os === "linux" && <ResourceUsage />}
          <div className="flex flex-[2] divide-x border-t">
            <div className="w-1/3">
              <h2 className="p-[24px] text-xl font-bold tracking-tight">
                CPU Kullanımı
              </h2>
              <CpuTable />
            </div>
            <div className="w-1/3">
              <h2 className="p-[24px] text-xl font-bold tracking-tight">
                Bellek Kullanımı
              </h2>
              <RamTable />
            </div>
            <div className="w-1/3">
              <h2 className="p-[24px] text-xl font-bold tracking-tight">
                Disk Durumu
              </h2>
              <DiskTable />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
