import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { useTranslation } from "react-i18next"

import { ICertificateDetails } from "@/types/certificate"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"

export default function CertificateInformation() {
  const router = useRouter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const [_, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ICertificateDetails>()

  useEffect(() => {
    if (!router.query.id) return

    apiService
      .getInstance()
      .get<ICertificateDetails>(
        `/settings/advanced/certificates/${router.query.id}/information`
      )
      .then((res) => {
        setData(res.data)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("advanced.certificates.retrieve.fetch_error"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router.query.id])

  return (
    <>
      <PageHeader
        title={t("advanced.certificates.details.title")}
        description={t("advanced.certificates.details.description")}
      />

      <div className="p-8 pt-0">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="mb-3 w-full border-b text-lg font-semibold">
              {t("advanced.certificates.retrieve.client_details")}
            </h2>
            <Label>{t("advanced.certificates.retrieve.ip_address")}</Label>
            <Input value={data?.ip_address} disabled />
          </div>
          <div className="space-y-2 pt-[40px]">
            <Label>Port</Label>
            <Input value={data?.port} disabled />
          </div>

          <div className="space-y-2">
            <h2 className="mb-3 w-full border-b text-lg font-semibold">
              {t("advanced.certificates.retrieve.validity")}
            </h2>
            <Label>{t("advanced.certificates.retrieve.valid_from")}</Label>
            <Input value={data?.valid_from} disabled />
          </div>

          <div className="space-y-2 pt-[40px]">
            <Label>{t("advanced.certificates.retrieve.valid_to")}</Label>
            <Input value={data?.valid_to} disabled />
          </div>

          <div className="space-y-2">
            <h2 className="mb-3 w-full border-b text-lg font-semibold">
              {t("advanced.certificates.retrieve.details")}
            </h2>
            <Label>{t("advanced.certificates.retrieve.issuer_cn")}</Label>
            <Input value={data?.issuer_cn} disabled />
          </div>

          <div className="space-y-2 pt-[40px]">
            <Label>{t("advanced.certificates.retrieve.issuer_dc")}</Label>
            <Input value={data?.issuer_dc} disabled />
          </div>

          <div className="space-y-2">
            <Label>
              {t("advanced.certificates.retrieve.subject_key_identifier")}
            </Label>
            <Input value={data?.subject_key_identifier} disabled />
          </div>

          <div className="space-y-2">
            <Label>
              {t("advanced.certificates.retrieve.authority_key_identifier")}
            </Label>
            <Input value={data?.authority_key_identifier} disabled />
          </div>
        </div>
      </div>
    </>
  )
}
