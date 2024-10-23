import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"

interface ISettingsItemProps {
  href: string
  exact?: boolean
  title: string
  icon: LucideIcon
  classNames?: string
}

export default function SettingsItem(props: ISettingsItemProps) {
  const router = useRouter()
  return (
    <Link href={props.href}>
      <Button
        variant={
          (
            props.exact
              ? router.asPath === props.href
              : router.asPath.includes(props.href)
          )
            ? "secondary"
            : "ghost"
        }
        size="sm"
        className={cn("mb-1 w-full justify-start gap-2", props.classNames)}
      >
        <props.icon className="size-4" />
        {props.title}
      </Button>
    </Link>
  )
}
