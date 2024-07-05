import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { useDebounce } from "@/lib/debounce"

import { SelectRole } from "../selectbox/role-select"
import { Card } from "../ui/card"
import { useToast } from "../ui/use-toast"
import AsyncTransferList from "./async-transfer-list"

export default function LdapRoleMapping(props: {
  username: string
  password: string
}) {
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const { username, password } = props

  const [roleListLoading, setRoleListLoading] = useState<boolean>(true)
  const [roleList, setRoleList] = useState<any>([])
  const [selectedRoleList, setSelectedRoleList] = useState<any>([])
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [searchValue, setSearchValue] = useState<string>("")

  const fetchRoleMappingList = useDebounce((param?: string) => {
    setRoleListLoading(true)
    apiService
      .getInstance()
      .get("settings/access/ldap/permissions/role_mappings", {
        params: {
          username: username,
          password: password,
          search_query: param,
          role_id: selectedRole,
        },
      })
      .then((res) => {
        setRoleList(
          res.data.items.map((it: string) => {
            return {
              id: it,
              name: it,
            }
          })
        )
        setSelectedRoleList(
          res.data.selected.map((it: string) => {
            return {
              id: it,
              name: it,
            }
          })
        )
      })
      .finally(() => {
        setRoleListLoading(false)
        setKey((prev) => prev + 1)
        setSearchValue(param || "")
      })
  }, 300)

  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!username || !password) return
    if (!selectedRole) return
    fetchRoleMappingList()
  }, [selectedRole, username, password])

  const handleRoleMappingSave = (groups: any[]) => {
    apiService
      .getInstance()
      .post("settings/access/ldap/permissions/role_mappings", {
        role_id: selectedRole,
        groups: groups.map((it) => it.id),
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("access.permissions.group_success"),
        })
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("access.permissions.group_error"),
          variant: "destructive",
        })
      })
  }

  return (
    <div className="mt-5 flex w-full flex-col gap-6">
      <SelectRole defaultValue="" onValueChange={setSelectedRole} />
      {!selectedRole && (
        <Card className="flex h-64 items-center justify-center font-medium">
          İşlem yapabilmek için üst kısımdan bir rol seçiniz.
        </Card>
      )}
      {selectedRole && (
        <AsyncTransferList
          loading={roleListLoading}
          leftTitle="Seçilebilir Gruplar"
          rightTitle="Atanacak Gruplar"
          items={roleList}
          selected={selectedRoleList}
          onSave={handleRoleMappingSave}
          onSearch={(v: string) => fetchRoleMappingList(v)}
          key={key}
          defaultSearch={searchValue}
        />
      )}
    </div>
  )
}
