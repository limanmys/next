import { useEffect, useState } from "react"
import Link from "next/link"
import { apiService } from "@/services"
import { ArrowRight, Cog, Server, ToyBrick, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Skeleton } from "../ui/skeleton"

interface IDashboardInformation {
  server_count: number
  user_count: number
  extension_count: number
  version: string
  version_code: number
}

export default function DashboardCards() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IDashboardInformation>()
  const user = useCurrentUser()

  useEffect(() => {
    apiService
      .getInstance()
      .get<IDashboardInformation>("/dashboard/information")
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
  }, [])

  return (
    <div
      className={cn(
        "grid divide-x border-y",
        user.status === 1
          ? "md:grid-cols-2 lg:grid-cols-4"
          : "md:grid-cols-1 lg:grid-cols-3"
      )}
    >
      <div className="p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            Sunucu Sayısı
          </CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {loading ? (
              <Skeleton className="mb-2 h-6 w-16" />
            ) : (
              data?.server_count
            )}
          </div>
          <Link
            href="/servers"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3"
          >
            Tüm sunucuları gör <ArrowRight className="inline-block h-4 w-4" />
          </Link>
        </CardContent>
      </div>
      {user.status === 1 && (
        <div className="p-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-70">
              Eklenti Sayısı
            </CardTitle>
            <ToyBrick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {loading ? (
                <Skeleton className="mb-2 h-6 w-16" />
              ) : (
                data?.extension_count
              )}
            </div>
            <Link
              className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3"
              href="/settings/extensions"
            >
              Tüm eklentileri gör{" "}
              <ArrowRight className="inline-block h-4 w-4" />
            </Link>
          </CardContent>
        </div>
      )}
      <div className="p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            Kullanıcı Sayısı
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {loading ? (
              <Skeleton className="mb-2 h-6 w-16" />
            ) : (
              data?.user_count
            )}
          </div>
          {user.status === 1 ? (
            <Link
              href="/settings/users"
              className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3"
            >
              Tüm kullanıcıları gör{" "}
              <ArrowRight className="inline-block h-4 w-4" />
            </Link>
          ) : (
            <p className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3">
              adet Liman kullanıcısı
            </p>
          )}
        </CardContent>
      </div>
      <div className="p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            Liman Versiyonu
          </CardTitle>
          <Cog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {loading ? <Skeleton className="mb-2 h-6 w-16" /> : data?.version}
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3">
            Build: {data?.version_code}
          </p>
        </CardContent>
      </div>
    </div>
  )
}
