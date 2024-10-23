import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import { FolderX } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { IServer } from "@/types/server"

import { Skeleton } from "../ui/skeleton"
import ServerCard from "./server-card"

export default function FavoriteServers() {
  const { t } = useTranslation("dashboard")
  const [loading, setLoading] = useState<Boolean>(true)
  const [data, setData] = useState<IServer[]>([])

  const sidebarCtx = useSidebarContext()

  useEffect(() => {
    http
      .get<IServer[]>("/dashboard/favorite_servers")
      .then((res) => {
        setData(res.data)
      })
      .catch(() => {
        // Do nothing
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <h3 className="p-8 pb-3 text-lg font-semibold">
        {t("favorite_servers.title")}
      </h3>

      <div className="grid grid-cols-2 gap-6 p-8 pt-3">
        {!loading &&
          data.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => sidebarCtx.setSelected(item.id)}
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
        <div className="flex h-1/2 w-full flex-col items-center justify-center gap-3">
          <FolderX className="size-8 text-muted-foreground" />
          <div className="flex flex-col items-center justify-center gap-1">
            <h5 className="font-semibold text-muted-foreground">
              {t("favorite_servers.empty_title")}
            </h5>
            <span className="text-sm font-medium text-muted-foreground">
              {t("favorite_servers.empty_description")}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
