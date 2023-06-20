import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"

import { IExtension } from "@/types/extension"
import { useEmitter } from "@/hooks/useEmitter"
import PageHeader from "@/components/ui/page-header"
import TransferList from "@/components/ui/transfer-list"
import { useToast } from "@/components/ui/use-toast"

import RoleLayout from "../../../../components/_layout/role_layout"

const RoleExtensionList: NextPageWithLayout = () => {
  const router = useRouter()
  const emitter = useEmitter()
  const { toast } = useToast()
  const [extensions, setExtensions] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/roles/${router.query.role_id}/extensions`)
      .then((res) => {
        setExtensions(res.data.extensions)
        setSelected(res.data.selected)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  const onSave = (selected: IExtension[]) => {
    const data = {
      extensions: selected.map((item) => item.id),
    }

    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/extensions`, data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Eklentiler başarıyla güncellendi.",
        })
        emitter.emit("REFETCH_ROLE", router.query.role_id)
        fetchData()
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Eklentiler güncellenirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title="Eklenti İzinleri"
        description="Bu rolün hangi eklentilere erişim sağlayabileceğini belirtin."
      />

      <div className="p-8 pt-0">
        <TransferList
          items={extensions}
          selected={selected}
          loading={loading}
          leftTitle="Kullanılabilir eklentiler"
          rightTitle="İzin verilen eklentiler"
          onSave={onSave}
          renderName="display_name"
        />
      </div>
    </>
  )
}

RoleExtensionList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleExtensionList
