import { useTranslation } from "react-i18next"

import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"

export default function Summary({ data }: { data: any }) {
  const { t } = useTranslation("servers")

  return (
    <div className="space-y-8 divide-y divide-foreground/10 sm:space-y-5">
      <div>
        <div>
          <h3 className="text-lg font-medium leading-6 text-foreground">
            {t("create.steps.summary.name")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-foreground/60">
            {t("create.steps.summary.description")}
          </p>
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">
          {t("create.steps.general_settings.sname.label")}
        </Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">{data.name}</div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">
          {t("create.steps.connection_information.ip_address.label")}
        </Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">{data.ip_address}</div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">
          {t("create.steps.general_settings.os_type.label")}
        </Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          {data.os_type === "linux" ? (
            <div className="flex items-center gap-2">
              <Icons.linux className="size-4" />
              GNU/Linux
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Icons.windows className="size-4" />
              Windows
            </div>
          )}
        </div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">
          {t("create.steps.connection_information.port.label")}
        </Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">{data.port}</div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">
          {t("create.steps.key_selection.key_type.label")}
        </Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">{t(data.key_type)}</div>
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
        <Label className="mt-[5px]">
          {t("create.steps.summary.shared_key")}
        </Label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          {data.shared === "true" ? t("yes") : t("no")}
        </div>
      </div>
    </div>
  )
}
