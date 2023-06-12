import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { apiService } from "@/services"
import {
  CircleDot,
  FileClock,
  Network,
  PackageOpen,
  PackageSearch,
  ServerCog,
  ToyBrick,
  TrendingUp,
  Users,
} from "lucide-react"

import { IExtension } from "@/types/extension"
import { cn } from "@/lib/utils"

import { Icons } from "../ui/icons"
import Loading from "../ui/loading"
import { Skeleton } from "../ui/skeleton"
import ExtensionItem from "./extension-item"
import ServerItem, { DropdownServerItem } from "./server-item"

export default function SidebarSelected() {
  const router = useRouter()
  const [
    selected,
    setSelected,
    selectedData,
    setSelectedData,
    selectedLoading,
    setSelectedLoading,
  ] = useSidebarContext()

  useEffect(() => {
    setSelectedLoading(true)
    apiService
      .getInstance()
      .get(`/menu/servers/${selected}`)
      .then((res) => {
        setSelectedData(res.data)
        setSelectedLoading(false)
      })
  }, [selected])

  return (
    <>
      {selectedLoading ? (
        <div>
          <div className="relative mb-3 flex px-2">
            <Skeleton className="w-8 h-8 rounded" />
            <div className="pl-3">
              <h2 className="text-lg font-semibold tracking-tight">
                <Skeleton className="w-36 h-6 rounded" />
              </h2>
              <span className="text-xs text-slate-500">
                <Skeleton className="w-24 h-3 rounded mt-1" />
              </span>
            </div>
            <Skeleton className="absolute right-0 top-0 w-4 h-4 rounded-full" />
          </div>
          <div className="p-2 space-y-1">
            {[...Array(8)].map((_, i) => (
              <Skeleton className="rounded-full h-9 w-full" key={i} />
            ))}
          </div>
          <h2 className="mb-2 mt-5 px-2 text-lg font-semibold tracking-tight">
            Eklentiler
          </h2>
          <div className="p-2 space-y-1">
            {[...Array(3)].map((_, i) => (
              <Skeleton className="rounded-full h-9 w-full" key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-3 flex px-2">
            {selectedData.os === "linux" ? (
              <Icons.linux className="h-8 w-8" />
            ) : (
              <Icons.windows className="h-8 w-8" />
            )}
            <div className="pl-3">
              <h2 className="-my-1 text-lg font-semibold tracking-tight">
                {selectedData.name}
              </h2>
              <span className="text-xs text-slate-500">
                {selectedData.ip_address}
              </span>
            </div>
            <CircleDot
              className={cn(
                "absolute right-0 top-[1px] h-4 w-4",
                selectedData.is_online ? "text-green-500" : "text-red-500"
              )}
            />
          </div>
          <div>
            <ServerItem
              link={`/servers/${selected}`}
              exact={true}
              disabled={!selectedData.is_online}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Sistem Durumu
            </ServerItem>
            <ServerItem link={`/servers/${selected}/extensions`} exact={true}>
              <ToyBrick className="mr-2 h-4 w-4" />
              Eklentiler
            </ServerItem>
            <ServerItem
              link={`/servers/${selected}/services`}
              disabled={!selectedData.is_online}
            >
              <ServerCog className="mr-2 h-4 w-4" />
              Servisler
            </ServerItem>
            <ServerItem
              link={`/servers/${selected}/packages`}
              disabled={!selectedData.is_online}
            >
              <PackageOpen className="mr-2 h-4 w-4" />
              Paketler
            </ServerItem>
            <ServerItem
              link={`/servers/${selected}/updates`}
              disabled={!selectedData.is_online}
            >
              <PackageSearch className="mr-2 h-4 w-4" />
              Güncellemeler
            </ServerItem>
            <div className="mb-1">
              <DropdownServerItem
                items={[
                  {
                    link: `/servers/${selected}/users/local`,
                    name: "Yerel Kullanıcılar",
                    exact: true,
                  },
                  {
                    link: `/servers/${selected}/users/groups`,
                    name: "Yerel Gruplar",
                    exact: true,
                  },
                  {
                    link: `/servers/${selected}/users/sudoers`,
                    name: "Yetkili Kullanıcılar",
                    exact: true,
                  },
                ]}
                disabled={!selectedData.is_online}
              >
                <Users className="mr-2 h-4 w-4" />
                Kullanıcı İşlemleri
              </DropdownServerItem>
            </div>
            <ServerItem
              link={`/servers/${selected}/open_ports`}
              disabled={!selectedData.is_online}
            >
              <Network className="mr-2 h-4 w-4" />
              Açık Portlar
            </ServerItem>
            <ServerItem link={`/servers/${selected}/access_logs`}>
              <FileClock className="mr-2 h-4 w-4" />
              Erişim Kayıtları
            </ServerItem>
          </div>

          {selectedData.extensions && selectedData.extensions.length > 0 && (
            <>
              <h2 className="mb-2 mt-5 px-2 text-lg font-semibold tracking-tight">
                Eklentiler
              </h2>
              <div className="space-y-1">
                {selectedData.extensions.map((extension: IExtension) => (
                  <ExtensionItem
                    key={extension.id}
                    extension={extension}
                    server_id={selected}
                    disabled={!selectedData.is_online}
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
