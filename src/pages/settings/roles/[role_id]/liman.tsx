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

const RoleLimanList: NextPageWithLayout = () => {
  const router = useRouter()
  const emitter = useEmitter()
  const { toast } = useToast()
  const [limanPermissions, setExtensions] = useState<IUser[]>([])
  const [selected, setSelected] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/roles/${router.query.role_id}/liman`)
      .then((res) => {
        setExtensions(res.data.permissions)
        setSelected(res.data.selected)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  const onSave = (selected: IUser[]) => {
    const data = {
      limanPermissions: selected.map((item) => item.id),
    }

    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/liman`, data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Liman izinleri başarıyla güncellendi.",
        })
        emitter.emit("REFETCH_ROLE", router.query.role_id)
        fetchData()
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Liman izinleri güncellenirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title="Liman İzinleri"
        description="Liman üzerinde gerçekleştirilen fonksiyonlara yetki verin."
      />

      <div className="p-8 pt-0">
        <TransferList
          items={limanPermissions}
          selected={selected}
          loading={loading}
          leftTitle="Tüm izinler"
          rightTitle="Verilmiş izinler"
          onSave={onSave}
        />
      </div>
    </>
  )
}

RoleLimanList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleLimanList
