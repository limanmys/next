import dynamic from "next/dynamic"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import DashboardCards from "@/components/dashboard/cards"
import FavoriteServers from "@/components/dashboard/favorite-servers"
import LatestLoggedInUsers from "@/components/dashboard/latest-logged-in-users"
import MostUsedExtensions from "@/components/dashboard/most-used-extensions"

const DateTimeView = dynamic(() => import("@/components/dashboard/date-time"), {
  ssr: false,
})

export default function IndexPage() {
  const { t } = useTranslation("dashboard")
  const user = useCurrentUser()

  return (
    <div
      className="flex flex-col"
      style={{
        height: "var(--container-height)",
      }}
    >
      <div className="title flex items-center justify-between gap-3 overflow-hidden p-8">
        <h2 className="text-2xl font-semibold">{t("title", "Pano")}</h2>
        <span className="font-medium text-muted-foreground">
          <DateTimeView />
        </span>
      </div>

      <DashboardCards />

      <div className="flex w-full flex-[2] flex-col divide-x xl:flex-row">
        <div
          className={cn("w-full", user.status === 1 ? "lg:w-1/3" : "lg:w-1/2")}
        >
          <MostUsedExtensions />
        </div>
        {user.status === 1 && (
          <div
            className={cn(
              "w-full",
              user.status === 1 ? "lg:w-1/3" : "lg:w-1/2"
            )}
          >
            <LatestLoggedInUsers />
          </div>
        )}
        <div
          className={cn("w-full", user.status === 1 ? "lg:w-1/3" : "lg:w-1/2")}
        >
          <FavoriteServers />
        </div>
      </div>
    </div>
  )
}
