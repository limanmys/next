import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { CircleDot } from "lucide-react"

import { IServer } from "@/types/server"
import { cn } from "@/lib/utils"

import { Card, CardContent } from "../ui/card"
import { Icons } from "../ui/icons"
import { Skeleton } from "../ui/skeleton"

export default function ServerCard({ item }: { item: IServer }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IServer>()

  useEffect(() => {
    apiService
      .getInstance()
      .get<IServer>(`/menu/servers/${item.id}`)
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <Card className="duration-100 ease-in hover:scale-[102%] active:scale-100 cursor-pointer relative">
      <CardContent className="mt-6">
        <div className="flex">
          <div className="icon self-start rounded-md bg-secondary p-3 dark:bg-secondary/10">
            {item.os === "linux" ? (
              <Icons.linux className="h-6 w-6 text-secondary-foreground/70 dark:text-white/70" />
            ) : (
              <Icons.windows className="h-6 w-6 text-secondary-foreground/70 dark:text-white/70" />
            )}
          </div>
        </div>
        <h5 className="mt-4 font-medium">{item.name}</h5>
        <span className="text-muted-foreground text-xs">{item.ip_address}</span>

        <div className="absolute right-6 top-6 ">
          {loading && <Skeleton className="h-4 w-4 rounded-full" />}
          {!loading && (
            <CircleDot
              className={cn(
                "absolute right-0 top-[1px] h-4 w-4",
                data?.is_online ? "text-green-500" : "text-red-500"
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
