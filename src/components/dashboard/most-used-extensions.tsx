import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { apiService } from "@/services"
import { FolderX } from "lucide-react"

import { IMostUsedExtension } from "@/types/dashboard"

import { Skeleton } from "../ui/skeleton"
import ExtensionCard from "./extension-card"

export default function MostUsedExtensions() {
  const router = useRouter()

  const [loading, setLoading] = useState<Boolean>(true)
  const [data, setData] = useState<IMostUsedExtension[]>([])

  const sidebarCtx = useSidebarContext()

  useEffect(() => {
    apiService
      .getInstance()
      .get<IMostUsedExtension[]>("/dashboard/most_used_extensions")
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <h3 className="p-8 pb-3 text-lg font-semibold">
        Sık Kullanılan Eklentiler
      </h3>

      <div className="grid grid-cols-2 gap-6 p-8 pt-3">
        {!loading &&
          data.length > 0 &&
          data.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() =>
                  router.push(
                    `/servers/${item.server.id}/extensions/${item.extension.id}`
                  )
                }
              >
                <ExtensionCard item={item} />
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
            <h5 className="font-semibold text-muted-foreground">Eklenti yok</h5>
            <span className="text-sm font-medium text-muted-foreground">
              Daha önce hiç eklenti kullanmamışsınız.
            </span>
          </div>
        </div>
      )}
    </>
  )
}
