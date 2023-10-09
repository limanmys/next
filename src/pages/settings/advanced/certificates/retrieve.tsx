import { useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { DownloadCloudIcon, Save } from "lucide-react"
import { useTranslation } from "react-i18next"

import { ICertificateDetails } from "@/types/certificate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"

export default function CertificateInformation() {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<ICertificateDetails>()
  const [ipAddress, setIpAddress] = useState<string>("")
  const [port, setPort] = useState<string>("")

  const fetchDetails = async () => {
    setLoading(true)

    apiService
      .getInstance()
      .post<ICertificateDetails>(`/settings/advanced/certificates/retrieve`, {
        hostname: ipAddress,
        port: port,
      })
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
  }

  const createCertificate = async () => {
    setLoading(true)

    apiService
      .getInstance()
      .post<ICertificateDetails>(`/settings/advanced/certificates`, {
        hostname: ipAddress,
        port: port,
      })
      .then((res) => {
        toast({
          title: t("success"),
          description: t("advanced.certificates.retrieve.success"),
        })
        setTimeout(() => {
          router.push("/settings/advanced/certificates")
        }, 1000)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("advanced.certificates.retrieve.success"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <PageHeader
        title={t("advanced.certificates.retrieve.title")}
        description={t("advanced.certificates.retrieve.description")}
      />

      <div className="p-8 pt-0">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="mb-3 w-full border-b text-lg font-semibold">
              {t("advanced.certificates.retrieve.client_details")}
            </h2>
            <Label>{t("advanced.certificates.retrieve.ip_address")}</Label>
            <Input
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <Button onClick={fetchDetails} className="mb-10" disabled={loading}>
              <DownloadCloudIcon className="mr-2 h-4 w-4" />{" "}
              {t("advanced.certificates.retrieve.fetch_details")}
            </Button>
          </div>
          <div className="space-y-2 pt-[40px]">
            <Label>Port</Label>
            <Input value={port} onChange={(e) => setPort(e.target.value)} />
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

            <Button
              onClick={createCertificate}
              className="mb-10"
              disabled={loading || !data || Object.keys(data).length == 0}
            >
              <Save className="mr-2 h-4 w-4" />{" "}
              {t("advanced.certificates.retrieve.save")}
            </Button>
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
