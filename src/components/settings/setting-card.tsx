import Link from "next/link"
import { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface ISettingCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export default function SettingCard(props: ISettingCardProps) {
  return (
    <Link href={props.href}>
      <Card className="h-full duration-100 ease-in hover:scale-[102%] active:scale-100">
        <CardContent className="pt-6">
          <div className="flex gap-6">
            <div className="icon self-start rounded-md bg-secondary p-3 dark:bg-secondary/10">
              <props.icon className="size-6 text-secondary-foreground/70 dark:text-white/70" />
            </div>
            <div className="content w-full">
              <h3 className="text-lg font-semibold tracking-tight">
                {props.title}
              </h3>
              <p className="text-gray-500">{props.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
