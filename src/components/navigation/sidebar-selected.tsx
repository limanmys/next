import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { apiService } from "@/services"
import {
  CircleDot,
  FileClock,
  PackageOpen,
  PackageSearch,
  ServerCog,
  ToyBrick,
  TrendingUp,
} from "lucide-react"

import { IExtension } from "@/types/extension"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import Loading from "../ui/loading"
import ExtensionItem from "./extension-item"

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
          <div className="space-y-1">
            <Link href={`/servers/${selected}`}>
              <Button
                variant={
                  router.asPath === `/servers/${selected}`
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="mb-1 w-full justify-start"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Sistem Durumu
              </Button>
            </Link>

            <Link href={`/servers/${selected}/extensions`}>
              <Button
                variant={
                  router.asPath === `/servers/${selected}/extensions`
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="mb-1 w-full justify-start"
              >
                <ToyBrick className="mr-2 h-4 w-4" />
                Eklentiler
              </Button>
            </Link>
            <Link href={`/servers/${selected}/services`}>
              <Button
                variant={
                  router.asPath === `/servers/${selected}/services`
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="mb-1 w-full justify-start"
              >
                <ServerCog className="mr-2 h-4 w-4" />
                Servisler
              </Button>
            </Link>
            <Link href={`/servers/${selected}/packages`}>
              <Button
                variant={
                  router.asPath === `/servers/${selected}/packages`
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="mb-1 w-full justify-start"
              >
                <PackageOpen className="mr-2 h-4 w-4" />
                Paketler
              </Button>
            </Link>
            <Link href={`/servers/${selected}/updates`}>
              <Button
                variant={
                  router.asPath === `/servers/${selected}/updates`
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="mb-1 w-full justify-start"
              >
                <PackageSearch className="mr-2 h-4 w-4" />
                Güncellemeler
              </Button>
            </Link>
            <Link href={`/servers/${selected}/access_logs`}>
              <Button
                variant={
                  router.asPath === `/servers/${selected}/access_logs`
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="w-full justify-start"
              >
                <FileClock className="mr-2 h-4 w-4" />
                Erişim Kayıtları
              </Button>
            </Link>
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
