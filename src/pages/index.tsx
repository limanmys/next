import dynamic from "next/dynamic"
import { useTranslation } from "react-i18next"

import DashboardCards from "@/components/dashboard/cards"
import FavoriteServers from "@/components/dashboard/favorite-servers"
import LatestLoggedInUsers from "@/components/dashboard/latest-logged-in-users"
import MostUsedExtensions from "@/components/dashboard/most-used-extensions"

const DateTimeView = dynamic(() => import("@/components/dashboard/date-time"), {
  ssr: false,
})

export default function IndexPage() {
  const { t } = useTranslation("dashboard")

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
        <div className="w-full lg:w-1/3">
          <MostUsedExtensions />
        </div>
        <div className="w-full lg:w-1/3">
          <LatestLoggedInUsers />
        </div>
        <div className="w-full lg:w-1/3">
          <FavoriteServers />
        </div>
      </div>
    </div>
  )
}
