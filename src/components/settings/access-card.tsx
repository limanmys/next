import Link from "next/link"
import { useRouter } from "next/router"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface IAccessCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export default function AccessCard(props: IAccessCardProps) {
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
          <props.icon className="h-5 w-5 text-secondary-foreground/70 dark:text-white/70" />
        </div>
        <div className="content">
          <h3 className="font-semibold tracking-tight">{props.title}</h3>
          <p className="text-sm text-gray-500">{props.description}</p>
        </div>
      </div>
    </Link>
  )
}
