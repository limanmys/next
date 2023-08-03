"use client"

import { useEffect } from "react"
import Link from "next/link"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ArrowUp, ChevronLeft, ChevronRight, Server, Star } from "lucide-react"

import { IServer } from "@/types/server"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Icons } from "../ui/icons"
import { Skeleton } from "../ui/skeleton"
import SidebarSelected from "./sidebar-selected"
import SidebarSettings from "./sidebar-settings"

export function Sidebar({ className }: { className?: string }) {
  const [selected, setSelected] = useSidebarContext()
  const sidebarCtx = useSidebarContext()
  const [parent] = useAutoAnimate()
  const [sub] = useAutoAnimate()

  useEffect(() => {
    sidebarCtx[SIDEBARCTX_STATES.refreshServers]()
  }, [])

  return (
    <div
      className={cn(
        "fixed z-30 w-full shrink-0 overflow-y-auto bg-background md:sticky md:block",
        sidebarCtx[SIDEBARCTX_STATES.collapsed] && "hidden border-r"
      )}
    >
      <ScrollArea
        style={{
          height: "calc(var(--container-height) - 65px)",
        }}
      >
        <div className="space-y-4 py-4">
          <div className="px-4 py-2" ref={parent}>
            <div></div>
            {sidebarCtx[SIDEBARCTX_STATES.settingsActive] ? (
              <SidebarSettings />
            ) : (
              <>
                {!selected ? (
                  <>
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                      Sunucular
                    </h2>
                    <div className="space-y-1" ref={sub}>
                      {sidebarCtx[SIDEBARCTX_STATES.serversLoading] ? (
                        <div className="space-y-1 p-2">
                          {[...Array(12)].map((_, i) => (
                            <Skeleton
                              className="h-9 w-full rounded-full"
                              key={i}
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          {sidebarCtx[SIDEBARCTX_STATES.servers].map(
                            (server: IServer) => (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => setSelected(server.id)}
                                key={server.id}
                              >
                                {server.os === "linux" ? (
                                  <Icons.linux className="mr-2 h-4 w-4" />
                                ) : (
                                  <Icons.windows className="mr-2 h-4 w-4" />
                                )}
                                {server.name}
                                <div className="ml-auto flex">
                                  {server.is_favorite && (
                                    <Star className="mr-1 h-4 w-4" />
                                  )}
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </Button>
                            )
                          )}
                          {sidebarCtx[SIDEBARCTX_STATES.servers].length > 0 ? (
                            <Link href="/servers">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 w-full justify-start"
                              >
                                <Server className="mr-2 h-4 w-4" />
                                Tüm sunucuları gör
                              </Button>
                            </Link>
                          ) : (
                            <>
                              <Link href="/servers/create">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-1 w-full justify-start mb-4"
                                >
                                  <Server className="mr-2 h-4 w-4" />
                                  Yeni sunucu ekle
                                </Button>
                              </Link>

                              <ArrowUp className="h-8 w-8 mx-auto animate-bounce block" />

                              <span className="text-sm font-medium p-3 block">
                                Liman'ı aktif şekilde kullanmaya başlamak için
                                yukarıdan sunucu ekleyin.
                              </span>
                            </>
                          )}
                        </>
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
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Sunucular
                    </Button>

                    <SidebarSelected />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </ScrollArea>
      <div className="aciklab flex items-center justify-center border-t py-4">
        <Icons.aciklab className="h-[2rem] w-[12rem] opacity-80" />
      </div>
    </div>
  )
}
