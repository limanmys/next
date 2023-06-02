import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import {
  CircleDot,
  FileClock,
  PackageOpen,
  PackageSearch,
  ServerCog,
  ToyBrick,
  TrendingUp,
} from "lucide-react"

import { IExtension, IServer } from "@/types/server"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import Loading from "../ui/loading"
import ExtensionItem from "./extension-item"

export default function SidebarSelected({ serverId }: { serverId: string }) {
  const router = useRouter()
  const [parent] = useAutoAnimate()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IServer>({} as IServer)
  const [selected, setSelected] = useState("")

  useEffect(() => {
    apiService
      .getInstance()
      .get(`/menu/servers/${serverId}`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }, [serverId])

  return (
    <>
      {loading ? (
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="relative mb-3 flex px-2">
            {data.os === "linux" ? (
              <Icons.linux className="h-8 w-8" />
            ) : (
              <Icons.windows className="h-8 w-8" />
            )}
            <div className="pl-3">
              <h2 className="-my-1 text-lg font-semibold tracking-tight">
                {data.name}
              </h2>
              <span className="text-xs text-slate-500">{data.ip_address}</span>
            </div>
            <CircleDot
              className={cn(
                "absolute right-0 top-[1px] h-4 w-4",
                data.is_online ? "text-green-500" : "text-red-500"
              )}
            />
          </div>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Sistem Durumu
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ToyBrick className="mr-2 h-4 w-4" />
              Eklentiler
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ServerCog className="mr-2 h-4 w-4" />
              Servisler
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <PackageOpen className="mr-2 h-4 w-4" />
              Paketler
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <PackageSearch className="mr-2 h-4 w-4" />
              Güncellemeler
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <FileClock className="mr-2 h-4 w-4" />
              Erişim Kayıtları
            </Button>
          </div>

          {data.extensions && data.extensions.length > 0 && (
            <>
              <h2 className="mb-2 mt-5 px-2 text-lg font-semibold tracking-tight">
                Eklentiler
              </h2>
              <div className="space-y-1">
                {data.extensions.map((extension: IExtension) => (
                  <ExtensionItem
                    key={extension.id}
                    extension={extension}
                    server_id={serverId}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
