import { useEffect, useState } from "react"
import { apiService } from "@/services"
import Cookies from "js-cookie"

import { DivergentColumn } from "@/types/table"
import { IVault } from "@/types/vault"
import { useEmitter } from "@/hooks/useEmitter"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { SelectUser } from "@/components/selectbox/user-select"
import CreateVaultKey from "@/components/settings/create-vault-key"
import CreateVaultSetting from "@/components/settings/create-vault-setting"
import { VaultRowActions } from "@/components/settings/vault-actions"

export default function VaultPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IVault[]>([])
  const [user, setUser] = useState<string>("")

  const emitter = useEmitter()

  const columns: DivergentColumn<IVault, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Veri Adı" />
      ),
      title: "Veri Adı",
    },
    {
      accessorKey: "server_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sunucu Adı" />
      ),
      title: "Sunucu Adı",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <VaultRowActions row={row} />
        </div>
      ),
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/vault?user_id=${user}`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [user])

  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser).user.id)
    }

    emitter.on("REFETCH_VAULT", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_VAULT")
  }, [])

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kasa</h2>
            <p className="text-muted-foreground">
              Sunucular üzerindeki eklenti ayarlarını, şifrelerinizi ve
              yöneticiyseniz diğer kullanıcıların girdiği değerleri
              değiştirebilirsiniz.
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
        <div className="flex gap-3">
          <SelectUser
            onValueChange={(value: string) => setUser(value)}
            defaultValue={user}
          />

          <CreateVaultSetting userId={user} />
          <CreateVaultKey userId={user} />
        </div>
      </DataTable>
    </>
  )
}
