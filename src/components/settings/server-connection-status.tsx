import { KeyRound, Share2, ShieldAlert } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IServerConnectionStatus } from "@/types/server"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/** Availability metadata, not a claim that remote authentication succeeded. */
export function ServerConnectionStatus({
  status,
}: {
  status: IServerConnectionStatus
}) {
  const { t } = useTranslation("settings")
  const Icon =
    status.source === "missing"
      ? ShieldAlert
      : status.source === "shared"
        ? Share2
        : KeyRound
  return (
    <div className="space-y-1.5">
      <Badge variant="outline">
        {t(
          `servers.connection.${status.shared_enabled ? "sharing_on" : "sharing_off"}`
        )}
      </Badge>
      <p
        className={cn(
          "flex items-start gap-1.5 text-xs",
          status.source === "missing"
            ? "text-destructive"
            : "text-muted-foreground"
        )}
      >
        <Icon className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
        {t(`servers.connection.source.${status.source}`)}
      </p>
    </div>
  )
}
