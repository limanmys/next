import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { User2, UserCog2 } from "lucide-react"

import { DivergentColumn } from "@/types/table"
import { IUser } from "@/types/user"
import { useEmitter } from "@/hooks/useEmitter"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
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
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kullanıcılar</h2>
            <p className="text-muted-foreground">
              Bu sayfa aracılığıyla kullanıcılara roller ekleyebilir, kullanıcı
              profillerini düzenleyebilir ve yenilerini ekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <CreateUser />
      </DataTable>
    </>
  )
}
