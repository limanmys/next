import { useEffect, useState } from "react"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import { apiService } from "@/services"
import { FolderX } from "lucide-react"

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
            <Skeleton key={i} className="h-[146px] w-full" />
          ))}
      </div>

      {!loading && data.length === 0 && (
        <div className="flex h-[50%] w-full flex-col items-center justify-center gap-3">
          <FolderX className="h-8 w-8 text-muted-foreground" />
          <div className="flex flex-col items-center justify-center gap-1">
            <h5 className="font-semibold text-muted-foreground">Sunucu yok</h5>
            <span className="text-sm font-medium text-muted-foreground">
              Henüz sunucu eklememişsiniz. Ekledikçe bu alan dolacaktır.
            </span>
          </div>
        </div>
      )}
    </>
  )
}
