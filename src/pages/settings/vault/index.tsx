import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { DivergentColumn } from "@/types/table"
import { IVault } from "@/types/vault"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { useEmitter } from "@/hooks/useEmitter"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import { SelectUser } from "@/components/selectbox/user-select"
import CreateVaultKey from "@/components/settings/create-vault-key"
import CreateVaultSetting from "@/components/settings/create-vault-setting"
import { VaultRowActions } from "@/components/settings/vault-actions"

export default function VaultPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IVault[]>([])
  const [user, setUser] = useState<string>("")
  const currentUser = useCurrentUser()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")

  const columns: DivergentColumn<IVault, string>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("vault.data_name")} />
      ),
      title: t("vault.data_name"),
    },
    {
      accessorKey: "server_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("vault.server_name")} />
      ),
      title: t("vault.server_name"),
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
    if (currentUser.status === 1 && currentUser.id !== undefined) {
      setUser(currentUser.id)
    }

    emitter.on("REFETCH_VAULT", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_VAULT")
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (currentUser.status === 1 && currentUser.id !== undefined) {
        setUser(currentUser.id)
      }
    }, 1000)
  }, [currentUser])

  return (
    <>
      <PageHeader
        title={t("vault.title")}
        description={t("vault.description")}
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <div className="flex gap-3">
          {currentUser.status === 1 && currentUser.id !== undefined && (
            <SelectUser
              onValueChange={(value: string) => setUser(value)}
              defaultValue={user}
            />
          )}

          <CreateVaultSetting userId={user} />
          <CreateVaultKey userId={user} />
        </div>
      </DataTable>
    </>
  )
}
