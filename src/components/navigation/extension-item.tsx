import { ChevronRight, ToyBrick } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { MouseEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IExtension } from "@/types/extension"
import { IMenu } from "@/types/server"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str
}

function ExtensionButton({
  extension,
  disabled,
  isCollapsed,
  onClick,
}: {
  extension: IExtension
  disabled?: boolean
  isCollapsed: boolean
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void
}) {
  const truncatedName = truncate(extension.display_name, 25)

  return (
    <Button
      variant={isCollapsed ? "ghost" : "secondary"}
      size="sm"
      className={cn(
        "relative w-full justify-start",
        !isCollapsed && extension.menus.length > 0 && "mb-1"
      )}
      disabled={disabled}
      onClick={() => onClick}
      asChild
    >
      <div
        className={cn(
          disabled
            ? "pointer-events-none cursor-not-allowed opacity-50"
            : "opacity-100"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex w-[18px] items-center justify-center">
            {extension.icon ? (
              <i className={`fa-solid fa-${extension.icon} fa-fw`}></i>
            ) : (
              <ToyBrick className="size-4" />
            )}
          </div>
          <span>{truncatedName}</span>
        </div>
        {extension.menus && extension.menus.length > 0 && (
          <ChevronRight
            className={cn(
              "absolute right-3 size-4 transition-transform",
              !isCollapsed && "rotate-90"
            )}
          />
        )}
      </div>
    </Button>
  )
}

export default function ExtensionItem({
  extension,
  server_id,
  disabled,
}: {
  extension: IExtension
  server_id: string
  disabled?: boolean
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

  const isCollapsed =
    !router.asPath.includes(extension.id) ||
    !router.asPath.includes(server_id) ||
    router.asPath.includes(`${server_id}/settings/${extension.id}`)

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault()
    } else {
      setHash("")
    }
  }

  return (
    <Collapsible open={router.asPath.includes(extension.id)}>
      <CollapsibleTrigger className="w-full">
        <Link
          href={`/servers/${server_id}/extensions/${extension.id}${extension.menus && extension.menus.length > 0
            ? extension.menus[0].url
            : ""
            }`}
          onClick={onClick}
        >
          <ExtensionButton
            extension={extension}
            disabled={disabled}
            isCollapsed={isCollapsed}
            onClick={onClick}
          />
        </Link>
      </CollapsibleTrigger>

      <CollapsibleContent className="animated-collapsible">
        {router.asPath.includes(extension.id) &&
          router.asPath.includes(server_id) &&
          !router.asPath.includes(`${server_id}/settings/${extension.id}`) &&
          extension.menus &&
          extension.menus.length > 0 && (
            <div className="mb-1 flex flex-col gap-y-[3px] rounded-md border p-1">
              {extension.menus.map((menu: IMenu) => (
                <MenuButton menu={menu} hash={hash} key={menu.url} />
              ))}
            </div>
          )}
      </CollapsibleContent>
    </Collapsible>
  )
}

interface IMenuButtonProps {
  menu: IMenu
  hash: string
}

const MenuButton = ({ menu, hash }: IMenuButtonProps) => {
  const { i18n } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  useEffect(() => {
    setIsCollapsed(!hash.includes(menu.url))
  }, [hash, menu.url])

  return (
    <div>
      {!menu.children && (
        <a href={menu.url} key={menu.url}>
          <Button
            variant={hash.includes(menu.url) ? "secondary" : "ghost"}
            size="sm"
            className="relative w-full justify-start"
          >
            {menu.icon && (
              <div className="fa-sm mr-1 flex w-[18px] items-center justify-center">
                <i className={`${menu.icon} fa-fw`}></i>
              </div>
            )}

            {menu.name instanceof String
              ? menu.name
              : menu.name[i18n.language as keyof typeof menu.name] ||
              menu.name["tr" as keyof typeof menu.name] ||
              menu.name}
          </Button>
        </a>
      )}
      {menu.children && menu.children.length > 0 && (
        <Collapsible open={!isCollapsed}>
          <CollapsibleTrigger className="w-full">
            <Button
              variant={isCollapsed ? "ghost" : "secondary"}
              size="sm"
              className="relative flex w-full justify-between"
              onClick={toggleCollapsed}
            >
              <div className="flex">
                {menu.icon && (
                  <div className="fa-sm mr-1 flex w-[18px] items-center justify-center">
                    <i className={`${menu.icon} fa-fw`}></i>
                  </div>
                )}

                {menu.name instanceof String
                  ? menu.name
                  : menu.name[i18n.language as keyof typeof menu.name] ||
                  menu.name["tr" as keyof typeof menu.name] ||
                  menu.name}
              </div>
              <ChevronRight
                className={cn(
                  "size-4 transition-transform",
                  !isCollapsed && "rotate-90"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="animated-collapsible">
            <div className="my-1 flex flex-col gap-y-[3px] rounded-md border p-1">
              {menu.children.map((childMenu: IMenu) => (
                <MenuButton menu={childMenu} hash={hash} key={childMenu.url} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
