import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { BookKey, FolderGit2, ScanFace, ScrollText } from "lucide-react"
import { useTranslation } from "react-i18next"

import AccessCard from "../settings/access-card"

export default function AccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      title: "LDAP Bağlantısı",
      description:
        "Liman'a giriş yaparken LDAP bağlantısı kullanabilir ve detaylı şekilde erişim yetkilerini konfigüre edebilirsiniz.",
      href: `/settings/access/ldap`,
      enabled: true,
    },
    {
      id: "permissions_ldap",
      icon: ScanFace,
      title: "LDAP Erişim İzinleri",
      description:
        "Hangi LDAP gruplarının ve kullanıcılarının Liman'a giriş yapabileceğini veya yapamayacağını bu sayfa aracılığıyla detaylı şekilde ayarlayabilirsiniz.",
      href: `/settings/access/permissions_ldap`,
      enabled: enabled,
    },
    {
      id: "keycloak",
      icon: BookKey,
      title: "Keycloak",
      description:
        "Keycloak auth gatewayini kullanarak Liman üzerine kullanıcı girişi yapılmasını sağlayabilirsiniz.",
      href: `/settings/access/keycloak`,
      enabled: true,
    },
  ]

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/access/ldap/configuration")
      .then((res) => {
        if (res.data.active) {
          setEnabled(true)
        }
      })
  }, [])

  return (
    <div
      className="grid grid-cols-5"
      style={{
        height: "var(--container-height)",
      }}
    >
      <div className="col-span-1 border-r">
        <div className="flex items-center border-b p-8 text-2xl font-bold">
          Erişim
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
      <div className="col-span-4">{children}</div>
    </div>
  )
}
