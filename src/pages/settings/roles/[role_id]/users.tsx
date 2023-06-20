import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"

import { IUser } from "@/types/user"
import { useEmitter } from "@/hooks/useEmitter"
import PageHeader from "@/components/ui/page-header"
import TransferList from "@/components/ui/transfer-list"
import { useToast } from "@/components/ui/use-toast"

import RoleLayout from "../../../../components/_layout/role_layout"

const RoleUserList: NextPageWithLayout = () => {
  const router = useRouter()
  const emitter = useEmitter()
  const { toast } = useToast()
  const [users, setUsers] = useState<IUser[]>([])
  const [selected, setSelected] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = () => {
    apiService
      .getInstance()
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

    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/users`, data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Kullanıcılar başarıyla güncellendi.",
        })
        emitter.emit("REFETCH_ROLE", router.query.role_id)
        fetchData()
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Kullanıcılar güncellenirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title="Kullanıcılar"
        description="Bu role hangi kullanıcıların sahip olacağını belirleyin."
      />

      <div className="p-8 pt-0">
        <TransferList
          items={users}
          selected={selected}
          loading={loading}
          leftTitle="Bu role sahip olmayan kullanıcılar"
          rightTitle="Bu role sahip kullanıcılar"
          onSave={onSave}
        />
      </div>
    </>
  )
}

RoleUserList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleUserList
