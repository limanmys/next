import { NextPageWithLayout } from "@/pages/_app"
import { http } from "@/services"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import RoleLayout from "@/components/_layout/role_layout"
import PageHeader from "@/components/ui/page-header"
import TransferList from "@/components/ui/transfer-list"
import { useToast } from "@/components/ui/use-toast"
import { useEmitter } from "@/hooks/useEmitter"
import { IUser } from "@/types/user"

const RoleUserList: NextPageWithLayout = () => {
  const router = useRouter()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const [users, setUsers] = useState<IUser[]>([])
  const [selected, setSelected] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = () => {
    http
      .get(`/settings/roles/${router.query.role_id}/users`)
      .then((res) => {
        setUsers(res.data.users)
        setSelected(res.data.selected)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  const onSave = (selected: IUser[]) => {
    const data = {
      users: selected.map((item) => item.id),
    }

    http
      .post(`/settings/roles/${router.query.role_id}/users`, data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("roles.users.success"),
        })
        emitter.emit("REFETCH_ROLE", router.query.role_id)
        fetchData()
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.users.error"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("roles.users.title")}
        description={t("roles.users.description")}
      />

      <div className="p-8 pt-0">
        <TransferList
          items={users}
          selected={selected}
          loading={loading}
          leftTitle={t("roles.users.left")}
          rightTitle={t("roles.users.right")}
          onSave={onSave}
        />
      </div>
    </>
  )
}

RoleUserList.getLayout = function getLayout(page: ReactElement<any>) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleUserList
