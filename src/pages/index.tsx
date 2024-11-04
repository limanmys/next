import dynamic from "next/dynamic"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

import DashboardCards from "@/components/dashboard/cards"
import FavoriteServers from "@/components/dashboard/favorite-servers"
import LatestLoggedInUsers from "@/components/dashboard/latest-logged-in-users"
import MostUsedExtensions from "@/components/dashboard/most-used-extensions"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { cn } from "@/lib/utils"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { DashboardEnum } from "@/types/user"

const DateTimeView = dynamic(() => import("@/components/dashboard/date-time"), {
  ssr: false,
})

export default function IndexPage() {
  const { t } = useTranslation("dashboard")
  const user = useCurrentUser()
  const { redirectNow } = useSidebarContext()

  const viewPermissions = user.permissions.view

  const dashboardItems: DashboardEnum[] = [
    "most_used_extensions",
    "auth_logs",
    "most_used_servers",
  ]

  useEffect(() => {
    if (viewPermissions.redirect) {
      redirectNow(viewPermissions.redirect)
    }
  }, [viewPermissions])

  const dashboardGridItems = useMemo(() => {
    return viewPermissions.dashboard
      .filter((item) => dashboardItems.includes(item))
      .sort((a, b) => dashboardItems.indexOf(a) - dashboardItems.indexOf(b))
  }, [viewPermissions.dashboard, dashboardItems])

  const dashboardGridItemWidthClassName = useMemo(() => {
    const dashboardGridItemsLength = dashboardGridItems.length
    return dashboardGridItemsLength === 1
      ? ""
      : `xl:w-1/${dashboardGridItemsLength}`
  }, [dashboardGridItems])

  const renderDashboardItemsWithPermissions = useMemo(() => {
    return dashboardGridItems.map((item) => (
      <div key={item} className={cn("w-full", dashboardGridItemWidthClassName)}>
        {item === "most_used_extensions" && <MostUsedExtensions />}
        {item === "most_used_servers" && <FavoriteServers />}
        {item === "auth_logs" && <LatestLoggedInUsers />}
      </div>
    ))
  }, [dashboardGridItems, dashboardGridItemWidthClassName])

  return (
    <div
      className="flex flex-col"
      style={{ height: "var(--container-height)" }}
    >
      <div className="title flex items-center justify-between gap-3 overflow-hidden p-8">
        <h2 className="text-2xl font-semibold">{t("title", "Pano")}</h2>
        <span className="font-medium text-muted-foreground">
          <DateTimeView />
        </span>
      </div>

      <DashboardCards />

      <div className="flex w-full flex-[2] flex-col divide-x xl:flex-row">
        {renderDashboardItemsWithPermissions}
      </div>
    </div>
  )
}
