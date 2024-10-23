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
import { IServer } from "@/types/server"

const RoleServerList: NextPageWithLayout = () => {
  const router = useRouter()
  const emitter = useEmitter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const [servers, setServers] = useState<IServer[]>([])
  const [selected, setSelected] = useState<IServer[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = () => {
    http
      .get(`/settings/roles/${router.query.role_id}/servers`)
      .then((res) => {
        setServers(res.data.servers)
        setSelected(res.data.selected)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (router.query.role_id) fetchData()
  }, [router.query.role_id])

  const onSave = (selected: IServer[]) => {
    const data = {
      servers: selected.map((item) => item.id),
    }

    http
      .post(`/settings/roles/${router.query.role_id}/servers`, data)
      .then(() => {
        toast({
          title: t("success"),
          description: t("roles.servers.success"),
        })
        emitter.emit("REFETCH_ROLE", router.query.role_id)
        fetchData()
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.servers.error"),
          variant: "destructive",
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("roles.servers.title")}
        description={t("roles.servers.description")}
      />

      <div className="p-8 pt-0">
        <TransferList
          items={servers}
          selected={selected}
          loading={loading}
          leftTitle={t("roles.servers.left")}
          rightTitle={t("roles.servers.right")}
          onSave={onSave}
        />
      </div>
    </>
  )
}

RoleServerList.getLayout = function getLayout(page: ReactElement) {
  return <RoleLayout>{page}</RoleLayout>
}

export default RoleServerList
