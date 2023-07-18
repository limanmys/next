import { useEffect, useState } from "react"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import { apiService } from "@/services"

import { IServer } from "@/types/server"

import { Skeleton } from "../ui/skeleton"
import ServerCard from "./server-card"

export default function FavoriteServers() {
  const [loading, setLoading] = useState<Boolean>(true)
  const [data, setData] = useState<IServer[]>([])

  const sidebarCtx = useSidebarContext()

  useEffect(() => {
    apiService
      .getInstance()
      .get<IServer[]>("/dashboard/favorite_servers")
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <h3 className="p-8 pb-3 text-lg font-semibold">Favori Sunucular</h3>

      <div className="grid grid-cols-2 gap-6 p-8 pt-3">
        {!loading &&
          data.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() =>
                  sidebarCtx[SIDEBARCTX_STATES.setSelected](item.id)
                }
              >
                <ServerCard item={item} />
              </div>
            )
          })}

        {loading &&
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full h-[146px]" />
          ))}
      </div>
    </>
  )
}
