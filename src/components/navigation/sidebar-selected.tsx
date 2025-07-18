import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import axios, { CancelTokenSource } from "axios"
import {
  ChevronRight,
  CircleDot,
  ContainerIcon,
  FileClock,
  Network,
  PackageOpen,
  PackageSearch,
  ServerCog,
  Star,
  ToyBrick,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { cn } from "@/lib/utils"
import { IExtension } from "@/types/extension"
import { IServer } from "@/types/server"

import TypeIcon from "../type-icon"
import { Button } from "../ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { Skeleton } from "../ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import ExtensionItem from "./extension-item"
import ServerItem from "./server-item"

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

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isUserCollapsed, setIsUserCollapsed] = useState(true)

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

  const elementIsActive = useCallback((): boolean => {
    return !(selectedData.is_online && selectedData.can_run_command)
  }, [selectedData])

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
    localStorage.setItem("serverSettingsCollapsed", (!isCollapsed).toString())
  }

  // Toggle user operations
  const toggleUserCollapsed = () => {
    setIsUserCollapsed(!isUserCollapsed)
  }

  useEffect(() => {
    setIsCollapsed(localStorage.getItem("serverSettingsCollapsed") == "true")
  }, [])

  const collapsibleUserData = [
    {
      link: `/servers/${selected}/users/local`,
      name: t("sidebar.user_management.local_users"),
      exact: true,
    },
    {
      link: `/servers/${selected}/users/groups`,
      name: t("sidebar.user_management.local_groups"),
      exact: true,
    },
    {
      link: `/servers/${selected}/users/sudoers`,
      name: t("sidebar.user_management.sudoers"),
      exact: true,
      disabled: selectedData.os === "windows",
    },
  ]

  return (
    <>
      {selectedLoading ? (
        <div>
          <div className="relative mb-3 flex px-2">
            <Skeleton className="size-8 rounded" />
            <div className="pl-3">
              <h2 className="text-lg font-semibold tracking-tight">
                <Skeleton className="h-6 w-36 rounded" />
              </h2>
              <span className="text-xs text-slate-500">
                <Skeleton className="mt-1 h-3 w-24 rounded" />
              </span>
            </div>
            <Skeleton className="absolute right-0 top-0 size-4 rounded-full" />
          </div>
          <div className="space-y-1 p-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton className="h-9 w-full rounded-full" key={i} />
            ))}
          </div>
          <h2 className="mb-2 mt-5 px-2 text-lg font-semibold tracking-tight">
            {t("sidebar.extensions")}
          </h2>
          <div className="space-y-1 p-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton className="h-9 w-full rounded-full" key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-3 flex px-2">
            <TypeIcon type={selectedData.os} className="size-8" />
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
                "absolute right-0 top-px size-4",
                selectedData.is_online ? "text-green-500" : "text-red-500"
              )}
            />
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Star
                    className={cn(
                      "absolute right-0 top-6 size-4",
                      selectedData.is_favorite
                        ? "text-yellow-500"
                        : "text-gray-500"
                    )}
                    onClick={() => toggleFavorite(selectedData.id)}
                  />
                </TooltipTrigger>
                <TooltipContent>{t("sidebar.favorite")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            {user.permissions.server_details && (
              <>
                {selectedData.os === "kubernetes" ? (
                  <ServerItem
                    link={`/servers/${selected}/container`}
                    exact={true}
                    disabled={!selectedData.is_online}
                  >
                    <ContainerIcon className="mr-2 size-4" />
                    {t("sidebar.container_status")}
                  </ServerItem>
                ) : <ServerItem
                  link={`/servers/${selected}`}
                  exact={true}
                  disabled={elementIsActive()}
                >
                  <TrendingUp className="mr-2 size-4" />
                  {t("sidebar.system_status")}
                </ServerItem>}

                <ServerItem
                  link={`/servers/${selected}/extensions`}
                  exact={true}
                  disabled={!selectedData.is_online}
                >
                  <ToyBrick className="mr-2 size-4" />
                  {t("sidebar.extensions")}
                </ServerItem>
                {user.permissions.view_logs && selectedData.os === "kubernetes" && (
                  <ServerItem
                    link={`/servers/${selected}/access_logs`}
                    disabled={!selectedData.is_online}
                  >
                    <FileClock className="mr-2 size-4" />
                    {t("sidebar.access_logs")}
                  </ServerItem>
                )}
              </>
            )}

            {(user.permissions.server_services ||
              user.permissions.server_details ||
              user.permissions.view_logs) && selectedData.os !== "kubernetes" && (
                <Collapsible open={!isCollapsed}>
                  <CollapsibleTrigger
                    className="mt-3 w-full px-2 text-left"
                    onClick={toggleCollapsed}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold tracking-tight">
                        {t("sidebar.management")}
                      </h2>
                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform",
                          !isCollapsed && "rotate-90"
                        )}
                      />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="animated-collapsible mt-3">
                    {user.permissions.server_services && (
                      <ServerItem
                        link={`/servers/${selected}/services`}
                        disabled={elementIsActive()}
                      >
                        <ServerCog className="mr-2 size-4" />
                        {t("sidebar.services")}
                      </ServerItem>
                    )}
                    {user.permissions.server_details && (
                      <>
                        <ServerItem
                          link={`/servers/${selected}/packages`}
                          disabled={
                            elementIsActive() || selectedData.os === "windows"
                          }
                        >
                          <PackageOpen className="mr-2 size-4" />
                          {t("sidebar.packages")}
                        </ServerItem>
                        <ServerItem
                          link={`/servers/${selected}/updates`}
                          disabled={
                            elementIsActive() || selectedData.os === "windows"
                          }
                        >
                          <PackageSearch className="mr-2 size-4" />
                          {t("sidebar.updates")}
                        </ServerItem>
                        <div className="mb-1">
                          <Collapsible
                            open={!isUserCollapsed}
                            onOpenChange={toggleUserCollapsed}
                            disabled={elementIsActive()}
                          >
                            <CollapsibleTrigger className="w-full">
                              <Button
                                variant={isUserCollapsed ? "ghost" : "secondary"}
                                size="sm"
                                className="relative flex w-full justify-between"
                                onClick={toggleUserCollapsed}
                                disabled={elementIsActive()}
                                as={!elementIsActive() ? "div" : "button"}
                              >
                                <div className="flex items-center">
                                  <Users className="mr-2 size-4" />
                                  {t("sidebar.user_management.title")}
                                </div>
                                <ChevronRight
                                  className={cn(
                                    "size-4 transition-transform",
                                    !isUserCollapsed && "rotate-90"
                                  )}
                                />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="animated-collapsible">
                              <div className="my-1 flex flex-col gap-y-[3px] rounded-md border p-1">
                                {collapsibleUserData.map((item) => (
                                  <Link href={item.link} key={item.link}>
                                    <Button
                                      variant={
                                        item.exact
                                          ? item.link === window.location.pathname
                                            ? "secondary"
                                            : "ghost"
                                          : window.location.pathname.includes(
                                            item.link
                                          )
                                            ? "secondary"
                                            : "ghost"
                                      }
                                      size="sm"
                                      className="w-full justify-start"
                                      disabled={item.disabled}
                                    >
                                      {item.name}
                                    </Button>
                                  </Link>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                        <ServerItem
                          link={`/servers/${selected}/open_ports`}
                          disabled={
                            elementIsActive() || selectedData.os === "windows"
                          }
                        >
                          <Network className="mr-2 size-4" />
                          {t("sidebar.open_ports")}
                        </ServerItem>
                      </>
                    )}

                    {user.permissions.view_logs && (
                      <ServerItem
                        link={`/servers/${selected}/access_logs`}
                        disabled={!selectedData.is_online}
                      >
                        <FileClock className="mr-2 size-4" />
                        {t("sidebar.access_logs")}
                      </ServerItem>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}
          </div>

          {selectedData.extensions && selectedData.extensions.length > 0 && (
            <>
              <h2 className="mb-2 mt-5 px-2 text-lg font-semibold tracking-tight">
                {t("sidebar.extensions")}
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
