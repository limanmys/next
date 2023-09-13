import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { Footprints, User2, UserCog2 } from "lucide-react"

import { DivergentColumn } from "@/types/table"
import { IAuthLog, IUser } from "@/types/user"
import { useEmitter } from "@/hooks/useEmitter"
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
import CreateUser from "@/components/settings/create-user"
import { UserRowActions } from "@/components/settings/user-actions"

const getType = (type: string) => {
  switch (type) {
    case "local":
      return "Liman"
    case "keycloak":
      return "Keycloak"
    case "ldap":
      return "LDAP"
    default:
      return "Liman"
  }
}

export default function UserSettingsPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IUser[]>([])
  const router = useRouter()
  const emitter = useEmitter()

  const columns: DivergentColumn<IUser, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="İsim Soyisim" />
      ),
      title: "İsim Soyisim",
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kullanıcı Adı" />
      ),
      title: "Kullanıcı Adı",
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-Posta" />
      ),
      title: "E-Posta",
    },
    {
      accessorKey: "status",
      accessorFn: (row) => {
        return row.status ? "1" : "0"
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Yetki Seviyesi"
          filterPresets={[
            {
              key: "Yönetici",
              value: "1",
            },
            {
              key: "Kullanıcı",
              value: "0",
            },
          ]}
        />
      ),
      title: "Yetki Seviyesi",
      cell: ({ row }) => (
        <>
          {row.original.status === 1 ? (
            <div className="flex items-center">
              <UserCog2 className="h-5 w-5" />
              <Badge className="ml-2" variant="outline">
                Yönetici
              </Badge>
            </div>
          ) : (
            <div className="flex items-center">
              <User2 className="h-5 w-5" />
              <Badge className="ml-2" variant="outline">
                Kullanıcı
              </Badge>
            </div>
          )}
        </>
      ),
    },
    {
      accessorKey: "auth_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Giriş Türü"
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
              key: "LDAP",
              value: "ldap",
            },
          ]}
        />
      ),
      title: "Giriş Türü",
      cell: ({ row }) => <>{getType(row.original.auth_type)}</>,
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
    apiService
      .getInstance()
      .get(`/settings/users`)
      .then((res) => {
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
        title="Kullanıcılar"
        description="Bu sayfa aracılığıyla kullanıcılara roller ekleyebilir, kullanıcı profillerini düzenleyebilir ve yenilerini ekleyebilirsiniz."
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <div className="flex gap-3">
          <CreateUser />
          <AuthLogDialog />
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={() => router.push("/settings/users/auth_logs")}
          >
            <Footprints className="mr-2 h-4 w-4" />
            Giriş kayıtları
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

  const columns: DivergentColumn<IAuthLog, string>[] = [
    {
      accessorKey: "ip_address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giriş Yapan IP Adresi" />
      ),
      title: "Giriş Yapan IP Adresi",
    },
    {
      accessorKey: "user_agent",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tarayıcı Bilgileri" />
      ),
      title: "Tarayıcı Bilgileri",
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
        <DataTableColumnHeader column={column} title="Giriş Tarihi" />
      ),
      title: "Giriş Tarihi",
      cell: ({ row }) => (
        <>
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Bilinmiyor"}
        </>
      ),
    },
  ]

  emitter.on("AUTH_LOG_DIALOG", (user_id) => {
    setLoading(true)
    setOpen(true)

    apiService
      .getInstance()
      .get(`/settings/users/auth_logs/${user_id}`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[75vw] p-0">
        <div className="grid grid-cols-4">
          <div className="rounded-lg rounded-r-none bg-foreground/5 p-5">
            <h3 className="font-semibold">Giriş Kayıtları</h3>
            <p className="mt-5 text-sm text-muted-foreground">
              Kullanıcıya ait giriş kayıtlarını detaylı şekilde
              görüntüleyebilirsiniz.
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
