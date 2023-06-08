"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { apiService } from "@/services"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { ChevronLeft, ChevronRight, Server, Star } from "lucide-react"

import { IServer } from "@/types/server"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Icons } from "../ui/icons"
import Loading from "../ui/loading"
import SidebarSelected from "./sidebar-selected"

export function Sidebar({ className }: { className?: string }) {
  const [loading, setLoading] = useState(true)
  const [servers, setServers] = useState<IServer[]>([])

  const [selected, setSelected] = useSidebarContext()
  const [parent] = useAutoAnimate()
  const [sub] = useAutoAnimate()

  useEffect(() => {
    apiService
      .getInstance()
      .get("/menu/servers")
      .then((res) => {
        setServers(res.data)
        setLoading(false)
      })
  }, [])

  return (
    <ScrollArea
      className="border border-y-0 border-l-0"
      style={{
        height: "var(--container-height)",
      }}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-2" ref={parent}>
          <div></div>
          {!selected ? (
            <>
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                Sunucular
              </h2>
              <div className="space-y-1" ref={sub}>
                {loading ? (
                  <div className="flex h-[50vh] w-full items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {servers.map((server: IServer) => (
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
                    ))}
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
        </div>
      </div>
    </ScrollArea>
  )
}
