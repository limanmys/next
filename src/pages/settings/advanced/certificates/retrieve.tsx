import { useState } from "react"
import { useRouter } from "next/router"
import { http } from "@/services"
import { DownloadCloudIcon, Save } from "lucide-react"
import { useTranslation } from "react-i18next"

import { ICertificateDetails } from "@/types/certificate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

    http
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

    http
      .post<ICertificateDetails>(`/settings/advanced/certificates`, {
        hostname: ipAddress,
        port: port,
      })
      .then(() => {
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
          description: t("advanced.certificates.retrieve.error"),
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
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Connection Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("advanced.certificates.retrieve.client_details")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">
                    {t("advanced.certificates.retrieve.ip_address")}
                  </Label>
                  <Input
                    id="ip-address"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="443"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={fetchDetails}
                  disabled={loading || !ipAddress || !port}
                  className="w-full md:w-auto"
                >
                  <DownloadCloudIcon className="mr-2 size-4" />
                  {t("advanced.certificates.retrieve.fetch_details")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Information Section */}
          {data && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("advanced.certificates.retrieve.details")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Validity Section */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-muted-foreground">
                    {t("advanced.certificates.retrieve.validity")}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        {t("advanced.certificates.retrieve.valid_from")}
                      </Label>
                      <Input value={data.valid_from} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("advanced.certificates.retrieve.valid_to")}
                      </Label>
                      <Input value={data.valid_to} disabled />
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-muted-foreground">
                    {t("advanced.certificates.retrieve.details")}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        {t("advanced.certificates.retrieve.issuer_cn")}
                      </Label>
                      <Input value={data.issuer_cn} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("advanced.certificates.retrieve.issuer_dc")}
                      </Label>
                      <Input value={data.issuer_dc} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t(
                          "advanced.certificates.retrieve.subject_key_identifier"
                        )}
                      </Label>
                      <Input value={data.subject_key_identifier} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t(
                          "advanced.certificates.retrieve.authority_key_identifier"
                        )}
                      </Label>
                      <Input value={data.authority_key_identifier} disabled />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={createCertificate}
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    <Save className="mr-2 size-4" />
                    {t("advanced.certificates.retrieve.save")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!data && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <DownloadCloudIcon className="mb-4 size-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {t("advanced.certificates.retrieve.empty_state")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
