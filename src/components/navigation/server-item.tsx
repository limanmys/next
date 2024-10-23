import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export default function ServerItem({
  link,
  exact,
  children,
  classNames,
  disabled,
}: {
  link: string
  exact?: boolean
  children: React.ReactNode
  classNames?: string
  disabled?: boolean
}) {
  const router = useRouter()
  return (
    <Link
      href={link}
      onClick={(e) => {
        disabled && e.preventDefault()
      }}
    >
      <Button
        variant={
          (exact ? router.asPath === link : router.asPath.includes(link))
            ? "secondary"
            : "ghost"
        }
        size="sm"
        className={cn("mb-1 w-full justify-start", classNames)}
        disabled={disabled}
      >
        {children}
      </Button>
    </Link>
  )
}

export function DropdownServerItem({
  exact,
  children,
  items,
  disabled,
}: {
  exact?: boolean
  children: React.ReactNode
  items: {
    link: string
    exact?: boolean
    name: string
    disabled?: boolean
  }[]
  disabled?: boolean
}) {
  const router = useRouter()

  const checkIfActive = () => {
    return items.some((item) => {
      if (exact || item.exact) {
        return router.asPath === item.link
      } else {
        return router.asPath.includes(item.link)
      }
    })
  }

  const checkIfActiveFromItemsProps = (link: string) => {
    return items.some((item) => {
      if (exact || item.exact) {
        return router.asPath === link
      } else {
        return router.asPath.includes(link)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={checkIfActive() ? "secondary" : "ghost"}
          size="sm"
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center">{children}</div>
          <ChevronRight className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem
              key={item.link}
              onClick={() => router.replace(item.link)}
              className={cn(
                "flex items-center justify-between",
                checkIfActiveFromItemsProps(item.link) && "bg-gray-100"
              )}
              disabled={item.disabled}
            >
              <span className="font-medium">{item.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
