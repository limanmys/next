import { useTranslation } from "react-i18next"

import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"

export default function Summary({ data }: { data: any }) {
  const { t } = useTranslation("servers")

  return (
    <>
      <div className="border-b border-border/10 pb-8">
        <h3 className="text-xl font-medium text-foreground">
          {t("create.steps.summary.name")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("create.steps.summary.description")}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Server Name */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.general_settings.sname.label")}
          </Label>
          <div className="sm:col-span-2 sm:text-base">{data.name}</div>
        </div>

        {/* IP Address */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.connection_information.ip_address.label")}
          </Label>
          <div className="sm:col-span-2 sm:text-base">{data.ip_address}</div>
        </div>

        {/* OS Type */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.general_settings.os_type.label")}
          </Label>
          <div className="sm:col-span-2 sm:text-base">
            {data.os_type === "linux" ? (
              <div className="flex items-center gap-2">
                <Icons.linux className="h-4 w-4" />
                <span>GNU/Linux</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icons.windows className="h-4 w-4" />
                <span>Windows</span>
              </div>
            )}
          </div>
        </div>

        {/* Port */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.connection_information.port.label")}
          </Label>
          <div className="sm:col-span-2 sm:text-base">{data.port}</div>
        </div>

        {/* Key Type */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.key_selection.key_type.label")}
          </Label>
          <div className="sm:col-span-2 sm:text-base">{t(data.key_type)}</div>
        </div>

        {/* Shared Key */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.summary.shared_key")}
          </Label>
          <div className="sm:col-span-2 sm:text-base">
            {data.shared === "true" ? t("yes") : t("no")}
          </div>
        </div>
      </div>
    </>
  )
}