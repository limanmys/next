import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import {
  ChevronLeft,
  FunctionSquare,
  Server,
  Text,
  ToyBrick,
  Users2,
} from "lucide-react"

import { IRole } from "@/types/role"
import { useEmitter } from "@/hooks/useEmitter"
import { Icons } from "@/components/ui/icons"
import RoleCard from "@/components/settings/role-card"

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const emitter = useEmitter()
  const roles = [
    {
      id: "users",
      icon: Users2,
      title: "Kullanıcılar",
      description: "Bu role hangi kullanıcıların sahip olacağını belirleyin.",
      href: `/settings/roles/${router.query.role_id}/users`,
    },
    {
      id: "liman",
      icon: Icons.dugumluLogo,
      title: "Liman İzinleri",
      description: "Liman üzerinde gerçekleştirilen fonksiyonlara yetki verin.",
      href: `/settings/roles/${router.query.role_id}/liman`,
    },
    {
      id: "servers",
      icon: Server,
      title: "Sunucu İzinleri",
      description:
        "Bu rolün hangi sunuculara erişim sağlayabileceğini belirleyin.",
      href: `/settings/roles/${router.query.role_id}/servers`,
    },
    {
      id: "extensions",
      icon: ToyBrick,
      title: "Eklenti İzinleri",
      description:
        "Bu rolün hangi eklentilere erişim sağlayabileceğini belirleyin.",
      href: `/settings/roles/${router.query.role_id}/extensions`,
    },
    {
      id: "functions",
      icon: FunctionSquare,
      title: "Fonksiyon İzinleri",
      description:
        "Eklentilerin iç izinlerini detaylı şekilde bu sayfa aracılığıyla yönetebilirsiniz.",
      href: `/settings/roles/${router.query.role_id}/functions`,
    },
    {
      id: "variables",
      icon: Text,
      title: "Özel Veriler",
      description: "Bu rolün eklentiye paylaşacağı özel verileri ayarlayın.",
      href: `/settings/roles/${router.query.role_id}/variables`,
    },
  ]
  const [role, setRole] = useState<IRole>()
  const fetchData = (id?: string) => {
    apiService
      .getInstance()
      .get(`/settings/roles/${id ? id : router.query.role_id}`)
      .then((response) => {
        setRole(response.data)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  useEffect(() => {
    emitter.on("REFETCH_ROLE", (id) => {
      fetchData(id as string)
    })
    return () => emitter.off("REFETCH_ROLE")
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
          <ChevronLeft
            onClick={() => router.push("/settings/roles")}
            className="mr-2 h-6 w-6 cursor-pointer"
          />
          {role && role.name} rolü
        </div>
        {roles.map((r) => (
          <RoleCard
            title={r.title}
            description={r.description}
            icon={r.icon}
            href={r.href}
            key={r.id}
            count={role ? role.counts[r.id as keyof typeof role.counts] : 0}
          />
        ))}
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  )
}
