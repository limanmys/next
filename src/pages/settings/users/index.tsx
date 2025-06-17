import { http } from "@/services"
import { Check, Footprints, User2, UserCog2, X } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import CreateUser from "@/components/settings/create-user"
import EditUser from "@/components/settings/edit-user"
import { UserRowActions } from "@/components/settings/user-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import PageHeader from "@/components/ui/page-header"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEmitter } from "@/hooks/useEmitter"
import { getRelativeTimeString } from "@/lib/utils"
import { DivergentColumn } from "@/types/table"
import { IAuthLog, IUser } from "@/types/user"

const getType = (type: string) => {
  switch (type) {
    case "local":
      return "Liman"
    case "keycloak":
      return "Keycloak"
    case "ldap":
      return "LDAP"
    case "oidc":
      return "OIDC"
    default:
      return "Liman"
  }
}

export default function UserSettingsPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IUser[]>([])
  const router = useRouter()
  const emitter = useEmitter()
  const { t, i18n } = useTranslation("settings")

  const columns: DivergentColumn<IUser, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("users.name")} />
      ),
      title: t("users.name"),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("users.username")} />
      ),
      title: t("users.username"),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("users.email")} />
      ),
      title: t("users.email"),
    },
    {
      accessorKey: "status",
      accessorFn: (row) => {
        return row.status ? "1" : "0"
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.status")}
          filterPresets={[
            {
              key: t("users.admin"),
              value: "1",
            },
            {
              key: t("users.user"),
              value: "0",
            },
          ]}
        />
      ),
      title: t("users.status"),
      cell: ({ row }) => (
        <>
          {row.original.status === 1 ? (
            <div className="flex items-center">
              <UserCog2 className="size-5" />
              <Badge className="ml-2" variant="outline">
                {t("users.admin")}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center">
              <User2 className="size-5" />
              <Badge className="ml-2" variant="outline">
                {t("users.user")}
              </Badge>
            </div>
          )}
        </>
      ),
    },
    {
      accessorKey: "last_login_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.last_login_at")}
        />
      ),
      title: t("users.last_login_at"),
      cell: ({ row }) => (
        <>
          {row.original.last_login_at
            ? getRelativeTimeString(row.original.last_login_at, i18n.language)
            : t("users.never")}
        </>
      ),
    },
    {
      accessorKey: "auth_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_type")}
          filterPresets={[
            {
              key: "Liman",
              value: "local",
            },
            {
              key: "Keycloak",
              value: "keycloak",
            },
            {
              key: "OIDC",
              value: "oidc",
            },
            {
              key: "LDAP",
              value: "ldap",
            },
          ]}
        />
      ),
      title: t("users.auth_type"),
      cell: ({ row }) => <>{getType(row.original.auth_type)}</>,
    },
    {
      accessorKey: "otp_enabled",
      accessorFn: (row) => {
        return row.otp_enabled
          ? 0 + t("users.otp_enabled")
          : t("users.otp_disabled")
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.otp")}
          filterPresets={[
            {
              key: t("users.otp_enabled"),
              value: 0 + t("users.otp_enabled"),
            },
            {
              key: t("users.otp_disabled"),
              value: t("users.otp_disabled"),
            },
          ]}
        />
      ),
      title: t("users.otp"),
      cell: ({ row }) => (
        <>
          {row.original.otp_enabled ? (
            <div className="flex items-center">
              <Check className="size-5 text-green-500" />
              <Badge className="ml-2" variant="success">
                {t("users.otp_enabled")}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center">
              <X className="size-5 text-red-500" />
              <Badge className="ml-2" variant="outline">
                {t("users.otp_disabled")}
              </Badge>
            </div>
          )}
        </>
      ),
      meta: {
        hidden: true,
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <UserRowActions row={row} />
        </div>
      ),
    },
  ]

  const fetchData = () => {
    http.get(`/settings/users`).then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    emitter.on("REFETCH_USERS", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_USERS")
  }, [])

  return (
    <>
      <PageHeader
        title={t("users.title")}
        description={t("users.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <div className="flex gap-3">
          <CreateUser />
          <EditUser />
          <AuthLogDialog />
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={() => router.push("/settings/users/logs")}
          >
            <Footprints className="mr-2 size-4" />
            {t("users.auth_log.title")}
          </Button>
        </div>
      </DataTable>
    </>
  )
}

function AuthLogDialog() {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IAuthLog[]>([])
  const emitter = useEmitter()
  const { t, i18n } = useTranslation("settings")

  const columns: DivergentColumn<IAuthLog, string>[] = [
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_log.ip_address")}
        />
      ),
      title: t("users.auth_log.ip_address"),
    },
    {
      accessorKey: "user_agent",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_log.browser")}
        />
      ),
      title: t("users.auth_log.browser"),
      cell: ({ row }) => (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <span className="cursor-pointer text-blue-500">
                {row.original.user_agent.substring(0, 30) + "..."}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.user_agent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("users.auth_log.created_at")}
        />
      ),
      title: t("users.auth_log.created_at"),
      accessorFn: (row) =>
        new Date(row.created_at).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      cell: ({ row }) => (
        <>
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString(
              i18n.language,
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )
            : t("users.auth_log.unknown")}
        </>
      ),
    },
  ]

  emitter.on("AUTH_LOG_DIALOG", (user_id) => {
    setLoading(true)
    setOpen(true)

    http.get(`/settings/users/auth_logs/${user_id}`).then((res) => {
      setData(res.data)
      setLoading(false)
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 !max-w-[75vw]">
        <div className="grid grid-cols-4">
          <div className="rounded-lg rounded-r-none bg-foreground/5 p-5">
            <h3 className="font-semibold">{t("users.auth_log.title")}</h3>
            <p className="mt-5 text-sm text-muted-foreground">
              {t("users.auth_log.desc2")}
            </p>
          </div>
          <div className="col-span-3 py-5">
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              selectable={false}
            ></DataTable>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
