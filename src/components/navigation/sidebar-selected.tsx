import { useEffect } from "react"
import Link from "next/link"
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

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import Loading from "../ui/loading"
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
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loading />
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
            <ServerItem link={`/servers/${selected}`} exact={true}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Sistem Durumu
            </ServerItem>
            <ServerItem link={`/servers/${selected}/extensions`} exact={true}>
              <ToyBrick className="mr-2 h-4 w-4" />
              Eklentiler
            </ServerItem>
            <ServerItem link={`/servers/${selected}/services`}>
              <ServerCog className="mr-2 h-4 w-4" />
              Servisler
            </ServerItem>
            <ServerItem link={`/servers/${selected}/packages`}>
              <PackageOpen className="mr-2 h-4 w-4" />
              Paketler
            </ServerItem>
            <ServerItem link={`/servers/${selected}/updates`}>
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
              >
                <Users className="mr-2 h-4 w-4" />
                Kullanıcı İşlemleri
              </DropdownServerItem>
            </div>
            <ServerItem link={`/servers/${selected}/open_ports`}>
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
