import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import axios, { CancelTokenSource } from "axios"
import {
  CircleDot,
  ContainerIcon,
  FileClock,
  PackageOpen,
  Plus,
  Star,
  ToyBrick,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { type ReactNode, useCallback, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { cn } from "@/lib/utils"
import { useFeature } from "@/providers/feature-provider"
import { IExtension } from "@/types/extension"
import { IServer } from "@/types/server"

import { Button } from "../ui/button"
import TypeIcon from "../type-icon"
import { Skeleton } from "../ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import ExtensionItem from "./extension-item"

export default function SidebarSelected() {
  const {
    selected,
    selectedData,
    setSelectedData,
    selectedLoading,
    setSelectedLoading,
  } = useSidebarContext()
  const user = useCurrentUser()
  const { t } = useTranslation("common")
  const { isEnabled } = useFeature()
  const router = useRouter()

  const cancelToken = useRef<CancelTokenSource | undefined>(undefined)

  useEffect(() => {
    if (cancelToken.current) {
      cancelToken.current.cancel()
    }

    cancelToken.current = axios.CancelToken.source()

    setSelectedLoading(true)
    http
      .get(`/menu/servers/${selected}`, {
        cancelToken: cancelToken.current.token,
      })
      .then((res) => {
        setSelectedData(res.data)
        setSelectedLoading(false)
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error(err)
        }
      })

    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel()
      }
    }
  }, [selected, setSelectedData, setSelectedLoading])

  const toggleFavorite = useCallback(
    (id: string) => {
      http
        .post(`/servers/${id}/favorites`)
        .then(() => {
          setSelectedData((prev: IServer) => ({
            ...prev,
            is_favorite: !prev.is_favorite,
          }))
        })
    },
    [setSelectedData]
  )

  const hasExtensions =
    selectedData.extensions && selectedData.extensions.length > 0
  const showAccessLogs =
    user.permissions.view_logs && isEnabled("server_access_logs")
  const showContainerStatus =
    user.permissions.server_details && selectedData.os === "kubernetes"

  const isActive = (link: string, exact?: boolean) =>
    exact ? router.asPath === link : router.asPath.includes(link)

  return (
    <>
      {selectedLoading ? (
        <div>
          <div className="mb-3 flex items-center px-2">
            <Skeleton className="size-8 shrink-0 rounded" />
            <div className="min-w-0 flex-1 pl-3">
              <Skeleton className="h-5 w-28 rounded" />
              <Skeleton className="mt-1 h-3 w-20 rounded" />
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-1 pl-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton className="size-4 rounded-full" key={i} />
              ))}
            </div>
          </div>
          <div className="space-y-1 p-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton className="h-9 w-full rounded-full" key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center px-2">
            <TypeIcon
              type={selectedData.os}
              className="size-8 shrink-0"
            />
            <div className="min-w-0 flex-1 pl-3">
              <h2 className="truncate text-lg font-semibold tracking-tight">
                {selectedData.name}
              </h2>
              <span className="text-xs text-muted-foreground">
                {selectedData.ip_address}
              </span>
            </div>
            <div className="grid shrink-0 grid-cols-[auto_auto] gap-x-1 gap-y-1 pl-2">
              <div className="flex items-center gap-0.5">
                {showContainerStatus && (
                  <HeaderIcon
                    href={`/servers/${selected}/container`}
                    label={t("sidebar.container_status")}
                    active={isActive(
                      `/servers/${selected}/container`,
                      true
                    )}
                    disabled={!selectedData.is_online}
                  >
                    <ContainerIcon className="size-3.5" />
                  </HeaderIcon>
                )}
                <div className="flex size-6 items-center justify-center">
                  <CircleDot
                    className={cn(
                      "size-3.5",
                      selectedData.is_online
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <button
                        className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-accent"
                        onClick={() => toggleFavorite(selectedData.id)}
                      >
                        <Star
                          className={cn(
                            "size-3.5",
                            selectedData.is_favorite
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("sidebar.favorite")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center">
                {user.permissions.server_details && (
                  <HeaderIcon
                    href={`/servers/${selected}/extensions`}
                    label={t("sidebar.manage_extensions")}
                    active={isActive(
                      `/servers/${selected}/extensions`,
                      true
                    )}
                  >
                    <ToyBrick className="size-3.5" />
                  </HeaderIcon>
                )}
              </div>
              <div className="flex items-center justify-end">
                {showAccessLogs && (
                  <HeaderIcon
                    href={`/servers/${selected}/access_logs`}
                    label={t("sidebar.access_logs")}
                    active={isActive(`/servers/${selected}/access_logs`)}
                    disabled={!selectedData.is_online}
                  >
                    <FileClock className="size-3.5" />
                  </HeaderIcon>
                )}
              </div>
            </div>
          </div>

          {hasExtensions ? (
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
          ) : user.permissions.server_details ? (
            <div className="mx-1 flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 text-center">
              <PackageOpen className="size-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {t("sidebar.no_extensions")}
              </p>
              <Link href={`/servers/${selected}/extensions`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                >
                  <Plus className="size-3" />
                  {t("sidebar.add_extension")}
                </Button>
              </Link>
            </div>
          ) : null}
        </>
      )}
    </>
  )
}

function HeaderIcon({
  href,
  label,
  active,
  disabled,
  children,
}: {
  href: string
  label: string
  active: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex size-6 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
