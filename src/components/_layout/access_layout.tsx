import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { BookKey, FolderGit2, ScanFace } from "lucide-react"

import AccessCard from "../settings/access-card"

export default function AccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [enabled, setEnabled] = useState(false)

  const access = [
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
      className="grid grid-cols-4"
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
      <div className="col-span-3">{children}</div>
    </div>
  )
}
