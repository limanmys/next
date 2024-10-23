import { Award, CloudCog, Cog, ScrollText } from "lucide-react"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import AccessCard from "../settings/access-card"

export default function AdvancedLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation("settings")

  const advanced = [
    {
      id: "certificates",
      icon: Award,
      title: t("advanced.certificates.title"),
      description: t("advanced.certificates.description"),
      href: `/settings/advanced/certificates`,
      enabled: true,
    },
    {
      id: "dns",
      icon: CloudCog,
      title: t("advanced.dns.title"),
      description: t("advanced.dns.description"),
      href: `/settings/advanced/dns`,
      enabled: true,
    },
    {
      id: "log_rotation",
      icon: ScrollText,
      title: t("advanced.logrotation.title"),
      description: t("advanced.logrotation.description"),
      href: `/settings/advanced/log_rotation`,
      enabled: true,
    },
    {
      id: "tweaks",
      icon: Cog,
      title: t("advanced.tweaks.title"),
      description: t("advanced.tweaks.description"),
      href: `/settings/advanced/tweaks`,
      enabled: true,
    },
  ]

  return (
    <div
      className="grid grid-cols-4"
      style={{
        height: "var(--container-height)",
      }}
    >
      <div className="col-span-1 border-r">
        <div className="flex items-center border-b p-8 text-2xl font-bold">
          {t("advanced.title")}
        </div>
        {advanced.map((r) => (
          <AccessCard
            title={r.title}
            description={r.description}
            icon={r.icon}
            href={r.href}
            key={r.id}
            enabled={r.enabled}
          />
        ))}
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  )
}
