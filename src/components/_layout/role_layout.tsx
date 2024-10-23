import { http } from "@/services"
import {
  ChevronLeft,
  Eye,
  FunctionSquare,
  Server,
  Text,
  ToyBrick,
  Users2,
} from "lucide-react"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import RoleCard from "@/components/settings/role-card"
import { Icons } from "@/components/ui/icons"
import { useEmitter } from "@/hooks/useEmitter"
import { IRole } from "@/types/role"

export default function RoleLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")
  const roles = [
    {
      id: "users",
      icon: Users2,
      title: t("roles.users.title"),
      description: t("roles.users.description"),
      href: `/settings/roles/${router.query.role_id}/users`,
    },
    {
      id: "liman",
      icon: Icons.dugumluLogo,
      title: t("roles.liman.title"),
      description: t("roles.liman.description"),
      href: `/settings/roles/${router.query.role_id}/liman`,
    },
    {
      id: "servers",
      icon: Server,
      title: t("roles.servers.title"),
      description: t("roles.servers.description"),
      href: `/settings/roles/${router.query.role_id}/servers`,
    },
    {
      id: "extensions",
      icon: ToyBrick,
      title: t("roles.extensions.title"),
      description: t("roles.extensions.description"),
      href: `/settings/roles/${router.query.role_id}/extensions`,
    },
    {
      id: "functions",
      icon: FunctionSquare,
      title: t("roles.functions.title"),
      description: t("roles.functions.description"),
      href: `/settings/roles/${router.query.role_id}/functions`,
    },
    {
      id: "views",
      icon: Eye,
      title: t("roles.views.title"),
      description: t("roles.views.description"),
      href: `/settings/roles/${router.query.role_id}/views`,
    },
    {
      id: "variables",
      icon: Text,
      title: t("roles.variables.title"),
      description: t("roles.variables.description"),
      href: `/settings/roles/${router.query.role_id}/variables`,
    },
  ]
  const [role, setRole] = useState<IRole>()
  const fetchData = (id?: string) => {
    http
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
        <div className="flex items-center border-b px-8 py-6 pt-7 text-2xl font-bold">
          <ChevronLeft
            onClick={() => router.push("/settings/roles")}
            className="mr-2 size-6 cursor-pointer"
          />
          {role && role.name} {t("roles.role")}
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
