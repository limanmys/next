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
      <Card className="hover:scale-[102%] ease-in duration-100">
        <CardContent className="pt-6">
          <div className="flex gap-6">
            <div className="icon bg-secondary dark:bg-secondary/10 self-start rounded-md p-3">
              <props.icon className="text-secondary-foreground/70 h-6 w-6 dark:text-white/70" />
            </div>
            <div className="content">
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
