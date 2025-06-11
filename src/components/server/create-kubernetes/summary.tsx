import { useTranslation } from "react-i18next"

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
        {/* Namespace */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            Namespace
          </Label>
          <div className="sm:col-span-2 sm:text-base text-foreground">
            {data?.namespace || '-'}
          </div>
        </div>

        {/* Deployment */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            Deployment
          </Label>
          <div className="sm:col-span-2 sm:text-base text-foreground">
            {data?.deployment || '-'}
          </div>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.connection_information.ip_address.label")}
          </Label>
          <div className="sm:col-span-2 sm:text-base text-foreground">
            {data?.address || '-'}
          </div>
        </div>

        {/* Port */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          <Label className="text-sm font-medium text-foreground/80">
            {t("create.steps.connection_information.port.label")}
          </Label>
          <div className="sm:col-span-2 sm:text-base text-foreground">
            {data?.port || '-'}
          </div>
        </div>
      </div>
    </>
  )
}