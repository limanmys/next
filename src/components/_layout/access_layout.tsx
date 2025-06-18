import { http } from "@/services"
import { BookKey, FolderGit2, ScanFace, ScrollText } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import AccessCard from "../settings/access-card"

export default function AccessLayout({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const { t } = useTranslation("settings")

  const access = [
    {
      id: "audit",
      icon: ScrollText,
      title: t("access.audit.title"),
      description: t("access.audit.description"),
      href: `/settings/access/audit`,
      enabled: true,
    },
    {
      id: "ldap",
      icon: FolderGit2,
      title: t("access.ldap.page_header.title"),
      description: t("access.ldap.page_header.description"),
      href: `/settings/access/ldap`,
      enabled: true,
    },
    {
      id: "permissions_ldap",
      icon: ScanFace,
      title: t("access.permissions.title"),
      description: t("access.permissions.description"),
      href: `/settings/access/permissions_ldap`,
      enabled: enabled,
    },
    {
      id: "keycloak",
      icon: BookKey,
      title: t("access.keycloak.page_header.title"),
      description: t("access.keycloak.page_header.description"),
      href: `/settings/access/keycloak`,
      enabled: true,
    },
    {
      id: "oidc",
      icon: BookKey,
      title: t("access.oidc.page_header.title"),
      description: t("access.oidc.page_header.description"),
      href: `/settings/access/oidc`,
      enabled: true,
    },
  ]

  useEffect(() => {
    http
      .get("/settings/access/ldap/configuration")
      .then((res) => {
        if (res.data.active) {
          setEnabled(true)
        }
      })
  }, [])

  return (
    <div
      className="grid grid-cols-7"
      style={{
        height: "var(--container-height)",
      }}
    >
      <div className="col-span-2 border-r">
        <div className="flex items-center border-b p-8 text-2xl font-bold">
          {t("access.title")}
        </div>
        {access.map((r) => (
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
      <div className="col-span-5">{children}</div>
    </div>
  )
}
