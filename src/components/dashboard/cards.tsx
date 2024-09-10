import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { apiService } from "@/services"
import { ArrowRight, Cog, Server, ToyBrick, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DashboardEnum } from "@/types/user"
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
  const { t } = useTranslation("dashboard")

  const viewPermissions = user.permissions.view
  const cardItems: DashboardEnum[] = [
    "servers",
    "extensions",
    "users",
    "version",
  ]

  useEffect(() => {
    apiService
      .getInstance()
      .get<IDashboardInformation>("/dashboard/information")
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
  }, [])

  const cardGridItems = useMemo(() => {
    return viewPermissions.dashboard
      .filter((item) => cardItems.includes(item))
      .sort((a, b) => cardItems.indexOf(a) - cardItems.indexOf(b))
  }, [viewPermissions.dashboard, cardItems])

  const cardGridItemGridColumnClassName = useMemo(() => {
    const cardGridItemsLength = cardGridItems.length
    return `md:grid-cols-${cardGridItemsLength} lg:grid-cols-${cardGridItemsLength}`
  }, [cardGridItems])

  if (cardGridItems.length === 0) return null

  const renderCardsWithPermissions = () => {
    return (
      <div
        className={cn(
          "grid divide-x border-y",
          cardGridItemGridColumnClassName
        )}
      >
        {cardGridItems.map((item, idx) => {
          return (
            <div key={`dashboard_cards_${idx}`}>
              {item === "servers" && (
                <div className="p-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-70">
                      {t("cards.server_count")}
                    </CardTitle>
                    <Server className="size-4 text-muted-foreground" />
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
                      {t("cards.show_all_servers")}{" "}
                      <ArrowRight className="inline-block size-4" />
                    </Link>
                  </CardContent>
                  {/* Hacky way to make sure compiler adds the classes */}
                  <div className="hidden md:grid-cols-4 lg:grid-cols-4"></div>
                  <div className="hidden md:grid-cols-3 lg:grid-cols-3"></div>
                  <div className="hidden md:grid-cols-2 lg:grid-cols-2"></div>
                  <div className="hidden md:grid-cols-1 lg:grid-cols-1"></div>
                </div>
              )}

              {item === "extensions" && (
                <div className="p-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-70">
                      {t("cards.extension_count")}
                    </CardTitle>
                    <ToyBrick className="size-4 text-muted-foreground" />
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
                      {t("cards.show_all_extensions")}{" "}
                      <ArrowRight className="inline-block size-4" />
                    </Link>
                  </CardContent>
                </div>
              )}

              {item === "users" && (
                <div className="p-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-70">
                      {t("cards.user_count")}
                    </CardTitle>
                    <Users className="size-4 text-muted-foreground" />
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
                        {t("cards.show_all_users")}{" "}
                        <ArrowRight className="inline-block size-4" />
                      </Link>
                    ) : (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3">
                        {t("cards.total_user_count")}
                      </p>
                    )}
                  </CardContent>
                </div>
              )}

              {item === "version" && (
                <div className="p-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-70">
                      {t("cards.version")}
                    </CardTitle>
                    <Cog className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">
                      {loading ? (
                        <Skeleton className="mb-2 h-6 w-16" />
                      ) : (
                        data?.version
                      )}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3">
                      Build: {data?.version_code}
                    </p>
                  </CardContent>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return <>{renderCardsWithPermissions()}</>
}
