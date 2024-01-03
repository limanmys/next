import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChevronDown, ChevronRight, ToyBrick } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IExtension } from "@/types/extension"
import { IMenu } from "@/types/server"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  const truncatedName = truncate(extension.display_name, 25)

  return (
    <Button
      variant={isCollapsed ? "ghost" : "secondary"}
      size="sm"
      className={cn("w-full justify-start", !isCollapsed && "mb-1")}
      disabled={disabled}
      onClick={() => onClick}
      asChild
    >
      <div>
        <div className="flex items-center gap-2">
          <div className="flex w-[18px] items-center justify-center">
            {extension.icon ? (
              <i className={`fa-solid fa-${extension.icon} fa-fw`}></i>
            ) : (
              <ToyBrick className="h-4 w-4" />
            )}
          </div>
          <span>{truncatedName}</span>
        </div>
        {extension.menus &&
          extension.menus.length > 0 &&
          (isCollapsed ? (
            <ChevronRight className="absolute right-6 h-4 w-4" />
          ) : (
            <ChevronDown className="absolute right-6 h-4 w-4" />
          ))}
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

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault()
    } else {
      setHash("")
    }
  }

  return (
    <Collapsible open={router.asPath.includes(extension.id)}>
      <CollapsibleTrigger className="w-full">
        {isCollapsed ? (
          <Link
            href={`/servers/${server_id}/extensions/${extension.id}${
              extension.menus && extension.menus.length > 0
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
        ) : (
          <ExtensionButton
            extension={extension}
            disabled={disabled}
            isCollapsed={isCollapsed}
            onClick={onClick}
          />
        )}
      </CollapsibleTrigger>
      {router.asPath.includes(extension.id) &&
        router.asPath.includes(server_id) &&
        !router.asPath.includes(`${server_id}/settings/${extension.id}`) &&
        extension.menus &&
        extension.menus.length > 0 && (
          <>
            <CollapsibleContent className="mb-1 flex flex-col gap-y-[3px] rounded-md border p-1">
              {extension.menus.map((menu: IMenu) => (
                <MenuButton menu={menu} hash={hash} key={menu.url} />
              ))}
            </CollapsibleContent>
          </>
        )}
    </Collapsible>
  )
}

interface IMenuButtonProps {
  menu: IMenu
  hash: string
}

const MenuButton: React.FC<IMenuButtonProps> = ({ menu, hash }) => {
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
            className="w-full justify-start"
          >
            {menu.icon && (
              <div className="flex w-[18px] items-center justify-center mr-1 fa-sm">
                <i className={`${menu.icon} fa-fw`}></i>
              </div>
            )}

            {menu.name instanceof String
              ? menu.name
              : menu.name[i18n.language as keyof typeof menu.name] || menu.name}
          </Button>
        </a>
      )}
      {menu.children && menu.children.length > 0 && (
        <Collapsible open={!isCollapsed}>
          <CollapsibleTrigger className="w-full">
            <Button
              variant={isCollapsed ? "ghost" : "secondary"}
              size="sm"
              className="flex w-full justify-between"
              onClick={toggleCollapsed}
            >
              <div className="flex">
                {menu.icon && (
                  <div className="flex w-[18px] items-center justify-center mr-1 fa-sm">
                    <i className={`${menu.icon} fa-fw`}></i>
                  </div>
                )}

                {menu.name instanceof String
                  ? menu.name
                  : menu.name[i18n.language as keyof typeof menu.name] ||
                    menu.name}
              </div>
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          {!isCollapsed && (
            <CollapsibleContent className="my-1 flex flex-col gap-y-[3px] rounded-md border p-1">
              {menu.children.map((childMenu: IMenu) => (
                <MenuButton menu={childMenu} hash={hash} key={childMenu.url} />
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      )}
    </div>
  )
}
