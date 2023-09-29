import { Clock, Network, User } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IServer, IServerDetails } from "@/types/server"
import { Skeleton } from "@/components/ui/skeleton"

import { Icons } from "../ui/icons"

interface IDetails {
  server: IServer
  details: IServerDetails
}

export default function ServerDetails({
  loading,
  data,
}: {
  loading: boolean
  data: IDetails
}) {
  const { t } = useTranslation("servers")

  return (
    <div
      className="border-r"
      style={{
        minHeight: "var(--container-height)",
      }}
    >
      <h2 className="p-[24px] text-2xl font-bold tracking-tight">
        {t("system_status.details")}
      </h2>

      <div className="border-y p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.name")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <span className="text-sm">{data.server.name}</span>
          )}
        </div>
      </div>

      <div className="border-b p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.hostname")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <span className="text-sm">{data.details.hostname}</span>
          )}
        </div>
      </div>

      <div className="border-b p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.os")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <div className="flex items-center">
              {data.server.os === "linux" ? (
                <Icons.linux className="mr-2 h-4 w-4" />
              ) : (
                <Icons.windows className="mr-2 h-4 w-4" />
              )}
              <span className="text-sm">{data.details.os}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-b p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.ip_address")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <div className="flex items-center">
              <Network className="mr-2 h-4 w-4" />
              <span className="text-sm">{data.server.ip_address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-b p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.user")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span className="text-sm">{data.details.user}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-b p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.uptime")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="text-sm">{data.details.uptime}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-b p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.service_count")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <span className="text-sm">{data.details.services}</span>
          )}
        </div>
      </div>

      <div className="border-b p-[24px]">
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-semibold">
            {t("system_status.process_count")}
          </span>
          {loading ? (
            <Skeleton className="h-[20px] w-full" />
          ) : (
            <span className="text-sm">{data.details.processes}</span>
          )}
        </div>
      </div>
    </div>
  )
}
