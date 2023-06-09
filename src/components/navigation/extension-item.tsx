import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChevronDown, ChevronRight, MonitorSmartphone } from "lucide-react"

import { IExtension } from "@/types/extension"
import { IMenu } from "@/types/server"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"

export default function ExtensionItem({
  extension,
  server_id,
}: {
  extension: IExtension
  server_id: string
}) {
  const router = useRouter()
  const [hash, setHash] = useState<string>("")
  useEffect(() => {
    if (window) {
      window.addEventListener("hashchange", () => {
        setHash(window.location.hash)
      })
    }

    return () => {
      if (window) {
        window.removeEventListener("hashchange", () => {
          setHash(window.location.hash)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (router.asPath.includes(extension.id)) {
      setHash(window.location.hash)
    }
  }, [extension.id, router.asPath])

  return (
    <Collapsible open={router.asPath.includes(extension.id)}>
      <CollapsibleTrigger className="w-full">
        {!router.asPath.includes(extension.id) ||
        !router.asPath.includes(server_id) ? (
          <Link
            href={`/servers/${server_id}/extensions/${extension.id}${
              extension.menus && extension.menus.length > 0
                ? extension.menus[0].url
                : ""
            }`}
            onClick={() => setHash("")}
          >
            <Button
              variant={
                router.asPath.includes(extension.id) &&
                router.asPath.includes(server_id)
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
              className="w-full justify-start"
            >
              {extension.display_name}

              {extension.menus && extension.menus.length > 0 && (
                <ChevronRight className="absolute right-6 h-4 w-4" />
              )}
            </Button>
          </Link>
        ) : (
          <a href="#">
            <Button
              variant={
                router.asPath.includes(extension.id) ? "secondary" : "ghost"
              }
              size="sm"
              className={cn(
                "w-full justify-start",
                extension.menus && extension.menus.length > 0 && "mb-1"
              )}
            >
              {extension.display_name}
              {extension.menus && extension.menus.length > 0 && (
                <ChevronDown className="absolute right-6 h-4 w-4" />
              )}
            </Button>
          </a>
        )}
      </CollapsibleTrigger>
      {router.asPath.includes(extension.id) &&
        router.asPath.includes(server_id) &&
        extension.menus &&
        extension.menus.length > 0 && (
          <>
            <CollapsibleContent className="mb-1 rounded-md border p-1">
              {extension.menus.map((menu: IMenu) => (
                <a href={menu.url} key={menu.url}>
                  <Button
                    variant={hash.includes(menu.url) ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    {menu.name}
                  </Button>
                </a>
              ))}
            </CollapsibleContent>
          </>
        )}
    </Collapsible>
  )
}
