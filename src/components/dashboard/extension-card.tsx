import { ToyBrick } from "lucide-react"

import { IMostUsedExtension } from "@/types/dashboard"

import { Card, CardContent } from "../ui/card"
import { Icons } from "../ui/icons"

export default function ExtensionCard({ item }: { item: IMostUsedExtension }) {
  return (
    <Card className="relative cursor-pointer duration-100 ease-in hover:scale-[102%] active:scale-100">
      <CardContent className="mt-6">
        <div className="flex">
          <div className="icon self-start rounded-md bg-secondary p-3 dark:bg-secondary/10">
            {item.extension.icon ? (
              <i
                className={`fa-solid fa-${item.extension.icon} fa-fw fa-lg text-secondary-foreground/70 dark:text-white/70`}
              ></i>
            ) : (
              <ToyBrick className="h-6 w-6 text-secondary-foreground/70 dark:text-white/70" />
            )}
          </div>
        </div>
        <h5 className="mt-4 font-medium">{item.extension.display_name}</h5>
        <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          {item.server.os === "linux" ? (
            <Icons.linux className="h-4 w-4 text-secondary-foreground/70 dark:text-white/70" />
          ) : (
            <Icons.windows className="h-4 w-4 text-secondary-foreground/70 dark:text-white/70" />
          )}{" "}
          {item.server.name}
        </span>
      </CardContent>
    </Card>
  )
}
