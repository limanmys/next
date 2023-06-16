import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { FunctionSquare, Server, Text, ToyBrick, Users2 } from "lucide-react"

import { IRole } from "@/types/role"
import { Icons } from "@/components/ui/icons"
import RoleCard from "@/components/settings/role-card"

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const roles = [
    {
      icon: Users2,
      title: "Kullanıcılar",
      description: "Bu role hangi kullanıcıların sahip olacağını belirleyin.",
      href: `/settings/roles/${router.query.role_id}/users`,
    },
    {
      icon: Icons.logo,
      title: "Liman İzinleri",
      description: "Liman üzerinde gerçekleştirilen fonksiyonlara yetki verin.",
      href: `/settings/roles/${router.query.role_id}/liman`,
    },
    {
      icon: Server,
      title: "Sunucu İzinleri",
      description:
        "Bu rolün hangi sunuculara erişim sağlayabileceğini belirleyin.",
      href: `/settings/roles/${router.query.role_id}/servers`,
    },
    {
      icon: ToyBrick,
      title: "Eklenti İzinleri",
      description:
        "Bu rolün hangi eklentilere erişim sağlayabileceğini belirleyin.",
      href: `/settings/roles/${router.query.role_id}/extensions`,
    },
    {
      icon: FunctionSquare,
      title: "Fonksiyon İzinleri",
      description: "Eklentilerin iç kullanım kısıtlarını belirleyin.",
      href: `/settings/roles/${router.query.role_id}/functions`,
    },
    {
      icon: Text,
      title: "Özel Veriler",
      description: "Bu rolün eklentiye paylaşacağı özel verileri ayarlayın.",
      href: `/settings/roles/${router.query.role_id}/variables`,
    },
  ]
  const [role, setRole] = useState<IRole>({} as IRole)
  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/roles/${router.query.role_id}`)
      .then((response) => {
        setRole(response.data)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  return (
    <div
      className="grid grid-cols-4"
      style={{
        height: "var(--container-height)",
      }}
    >
      <div className="col-span-1 border-r">
        <div className="border-b p-8 text-2xl font-bold">{role.name}</div>
        {roles.map((role, index) => (
          <RoleCard
            title={role.title}
            description={role.description}
            icon={role.icon}
            href={role.href}
            key={index}
          />
        ))}
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  )
}
