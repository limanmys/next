import Link from "next/link"
import { useRouter } from "next/router"

import { cn } from "@/lib/utils"

import { Badge } from "../ui/badge"

interface IRoleCardProps {
  title: string
  description: string
  icon: any
  href: string
  count: number
}

export default function RoleCard(props: IRoleCardProps) {
  const router = useRouter()

  return (
    <Link href={props.href}>
      <div
        className={cn(
          "flex w-full gap-6 border-b p-6",
          router.asPath.includes(props.href) &&
            "bg-secondary/50 dark:bg-secondary/5"
        )}
      >
        <div className="icon self-start rounded-md bg-secondary p-3 dark:bg-secondary/10">
          <props.icon className="size-5 text-secondary-foreground/70 dark:text-white/70" />
        </div>
        <div className="content w-full">
          <div className="mb-1 flex justify-between">
            <h3 className="font-semibold tracking-tight">{props.title}</h3>
            <Badge variant="secondary">{props.count}</Badge>
          </div>
          <p className="text-sm text-gray-500">{props.description}</p>
        </div>
      </div>
    </Link>
  )
}
