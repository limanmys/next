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
import { IExtension } from "@/types/extension"

const RoleExtensionList: NextPageWithLayout = () => {
  const router = useRouter()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const [extensions, setExtensions] = useState<IExtension[]>([])
  const [selected, setSelected] = useState<IExtension[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = () => {
    http
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

    http
      .post(`/settings/roles/${router.query.role_id}/extensions`, data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("roles.extensions.success"),
        })
        emitter.emit("REFETCH_ROLE", router.query.role_id)
        fetchData()
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.extensions.error"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("roles.extensions.title")}
        description={t("roles.extensions.description")}
      />

      <div className="p-8 pt-0">
        <TransferList
          items={extensions}
          selected={selected}
          loading={loading}
          leftTitle={t("roles.extensions.left")}
          rightTitle={t("roles.extensions.right")}
          onSave={onSave}
          renderName="display_name"
        />
      </div>
    </>
  )
}

RoleExtensionList.getLayout = function getLayout(page: ReactElement<any>) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleExtensionList
