"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import {
  Book,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  FileClock,
  MonitorSmartphone,
  Network,
  PackageOpen,
  PackageSearch,
  Search,
  ServerCog,
  ToyBrick,
  TrendingUp,
} from "lucide-react"

import { IServer } from "@/types/server"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Icons } from "../icons"
import { Input } from "../ui/input"
import Loading from "../ui/loading"
import SidebarSelected from "./sidebar-selected"

export function Sidebar({ className }: any) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [servers, setServers] = useState<IServer[]>([])

  const [selected, setSelected] = useState("")
  const [parent] = useAutoAnimate()
  const [sub] = useAutoAnimate()

  useEffect(() => {
    fetch("https://liman.io/api/servers", {
      headers: {
        "liman-token":
          "P53xvcLDByZeEf9Tb7Ksjfd2COrYTxK8JfCtct2UPOTSTMRKaTOIMoOlxJUceQYj",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setServers(res)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (router.query.server_id) {
      setSelected(router.query.server_id as string)
    } else {
      setSelected("")
    }
  }, [router.query.server_id])

  return (
    <ScrollArea
      className="border border-y-0 border-l-0"
      style={{
        height: "calc(100vh - 4rem - 1px)",
      }}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-2" ref={parent}>
          <div className="relative mb-6 px-2">
            <Input type="text" placeholder="Arama..." />
            <Search className="absolute right-5 top-3 h-4 w-4" />
          </div>
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
                  servers.map((server: IServer) => (
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
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                  ))
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
              <SidebarSelected serverId={selected} />
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}
