import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { IUser } from "@/types/user"
import { useEmitter } from "@/hooks/useEmitter"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import RoleLayout from "@/components/_layout/role_layout"

const RoleViewList: NextPageWithLayout = () => {
  const router = useRouter()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const [views, setViews] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = () => {
    apiService
      .getInstance()
      .get(`/settings/roles/${router.query.role_id}/views`)
      .then((res) => {
        setViews(res.data.views)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  const onSave = () => {
    apiService
      .getInstance()
      .post(`/settings/roles/${router.query.role_id}/views`, {
        views,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("roles.views.success"),
        })
        emitter.emit("REFETCH_ROLE", router.query.role_id)
        fetchData()
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.views.error"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("roles.views.title")}
        description={t("roles.views.description")}
      />

      <div className="p-8 pt-0">Will be implemented.</div>
    </>
  )
}

RoleViewList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleViewList
