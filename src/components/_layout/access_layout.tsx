import { useRouter } from "next/router"
import { BookKey, FolderGit2 } from "lucide-react"

import AccessCard from "../settings/access-card"

export default function AccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const access = [
    {
      id: "ldap",
      icon: FolderGit2,
      title: "LDAP Bağlantısı",
      description:
        "Liman'a giriş yaparken LDAP bağlantısı kullanabilir ve detaylı şekilde erişim yetkilerini konfigüre edebilirsiniz.",
      href: `/settings/access/ldap`,
    },
    {
      id: "keycloak",
      icon: BookKey,
      title: "Keycloak",
      description:
        "Keycloak auth gatewayini kullanarak Liman üzerine kullanıcı girişi yapılmasını sağlayabilirsiniz.",
      href: `/settings/access/keycloak`,
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
          Erişim
        </div>
        {access.map((r) => (
          <AccessCard
            title={r.title}
            description={r.description}
            icon={r.icon}
            href={r.href}
            key={r.id}
          />
        ))}
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  )
}
