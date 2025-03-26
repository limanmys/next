"use client"

import { useSidebarContext } from "@/providers/sidebar-provider"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import {
  AlertTriangle,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Server,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { cn } from "@/lib/utils"
import { IServer } from "@/types/server"

import { opacityAnimation } from "@/lib/anim"
import { Icons } from "../ui/icons"
import { Skeleton } from "../ui/skeleton"
import ExtensionItem from "./extension-item"
import SidebarSelected from "./sidebar-selected"
import SidebarSettings from "./sidebar-settings"

export function Sidebar({ className }: { className?: string }) {
  const {
    selected,
    setSelected,
    servers,
    serversLoading: isLoading,
    collapsed: isCollapsed,
    settingsActive,
    refreshServers,
    extensions,
    extensionsLoading: isExtensionsLoading,
    refreshExtensions,
  } = useSidebarContext()

  const [parent] = useAutoAnimate(opacityAnimation)
  const [sub] = useAutoAnimate(opacityAnimation)
  const user = useCurrentUser()
  const { t } = useTranslation("common")

  useEffect(() => {
    if (user.permissions.view.sidebar === "extensions") {
      refreshExtensions()
    } else {
      refreshServers()
    }
  }, [user.permissions.view.sidebar, refreshServers, refreshExtensions])

  // Extension Menu
  if (user.permissions.view.sidebar === "extensions") {
    return (
      <div
        className={cn(
          "fixed z-30 w-full shrink-0 overflow-y-auto bg-background md:sticky md:block print:hidden",
          isCollapsed && "hidden",
          !isCollapsed && "z-40",
          className
        )}
      >
        <ScrollArea
          style={{
            height: "calc(var(--container-height) - 65px)",
          }}
        >
          <div className="space-y-4 py-4">
            <div className="px-4 py-2" ref={parent}>
              {settingsActive ? (
                <SidebarSettings />
              ) : (
                <>
                  {!selected ? (
                    <>
                      <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                        {t("sidebar.extensions")}
                      </h2>
                      <div className="space-y-1" ref={sub}>
                        {isExtensionsLoading ? (
                          <div className="space-y-1 p-2">
                            {[...Array(12)].map((_, i) => (
                              <Skeleton
                                className="h-9 w-full rounded-full"
                                key={i}
                              />
                            ))}
                          </div>
                        ) : (
                          <div>
                            {extensions.map((extension: any) => (
                              <ExtensionItem
                                key={extension.id}
                                extension={extension}
                                server_id={extension.server_id}
                              />
                            ))}
                            {extensions.length == 0 && (
                              <>
                                <AlertTriangle className="mx-auto block size-8" />

                                <span className="block p-2 text-sm font-medium">
                                  {t("sidebar.user_message")}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mb-3 w-full justify-start"
                        onClick={() => setSelected("")}
                      >
                        <ChevronLeft className="mr-2 size-4" />
                        {t("sidebar.servers")}
                      </Button>

                      <SidebarSelected />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="aciklab flex items-center justify-center py-4 absolute bottom-0 w-full pointer-events-none">
          <Icons.aciklab className="h-8 w-48 z-1" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0 w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed z-30 w-full shrink-0 overflow-y-auto bg-background md:sticky md:block print:hidden",
        isCollapsed && "hidden",
        !isCollapsed && "z-40",
        className
      )}
    >
      <ScrollArea
        style={{
          height: "var(--container-height)",
        }}
      >
        <div className="space-y-4 py-4 pb-[60px]">
          <div className="px-4 py-2" ref={parent}>
            {settingsActive ? (
              <SidebarSettings />
            ) : (
              <>
                {!selected ? (
                  <>
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                      {t("sidebar.servers")}
                    </h2>
                    <div className="space-y-1" ref={sub}>
                      {isLoading ? (
                        <div className="space-y-1 p-2">
                          {[...Array(12)].map((_, i) => (
                            <Skeleton
                              className="h-9 w-full rounded-full"
                              key={i}
                            />
                          ))}
                        </div>
                      ) : (
                        <div>
                          {servers.map((server: IServer) => (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => setSelected(server.id)}
                              key={server.id}
                            >
                              {server.os === "linux" ? (
                                <Icons.linux className="mr-2 size-4" />
                              ) : (
                                <Icons.windows className="mr-2 size-4" />
                              )}
                              {server.name}
                              <div className="ml-auto flex">
                                {server.is_favorite && (
                                  <Star className="mr-1 size-4" />
                                )}
                                <ChevronRight className="size-4" />
                              </div>
                            </Button>
                          ))}
                          {servers.length > 0 ? (
                            <Link href="/servers">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 w-full justify-start"
                              >
                                <Server className="mr-2 size-4" />
                                {t("sidebar.all_servers")}
                              </Button>
                            </Link>
                          ) : (
                            <>
                              {user.status === 1 ? (
                                <>
                                  <Link href="/servers/create">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="mb-4 mt-1 w-full justify-start"
                                    >
                                      <Server className="mr-2 size-4" />
                                      {t("sidebar.add_server")}
                                    </Button>
                                  </Link>

                                  <ArrowUp className="mx-auto block size-8 animate-bounce" />

                                  <span className="block p-3 text-sm font-medium">
                                    {t("sidebar.admin_message")}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="mx-auto block size-8" />

                                  <span className="block p-2 text-sm font-medium">
                                    {t("sidebar.user_message")}
                                  </span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mb-3 w-full justify-start"
                      onClick={() => setSelected("")}
                    >
                      <ChevronLeft className="mr-2 size-4" />
                      {t("sidebar.servers")}
                    </Button>

                    <SidebarSelected />
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="aciklab flex items-center justify-center py-4 absolute bottom-0 w-full pointer-events-none">
          <Icons.aciklab className="h-8 w-48 z-1" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0 w-full"></div>
        </div>
      </ScrollArea>

    </div>
  )
}
