import { http } from "@/services"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import { ICertificateDetails } from "@/types/certificate"

export default function CertificateInformation() {
  const router = useRouter()
  const { t } = useTranslation("settings")
  const { toast } = useToast()

  const [_, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ICertificateDetails>()

  useEffect(() => {
    if (!router.query.id) return

    http
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
        <div className="mx-auto max-w-4xl">
          {data ? (
            <div className="space-y-8">
              {/* Connection Information */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("advanced.certificates.retrieve.client_details")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("advanced.certificates.retrieve.ip_address")}</Label>
                      <Input value={data.ip_address} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input value={data.port} disabled className="bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Validity */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("advanced.certificates.retrieve.validity")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("advanced.certificates.retrieve.valid_from")}</Label>
                      <Input value={data.valid_from} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("advanced.certificates.retrieve.valid_to")}</Label>
                      <Input value={data.valid_to} disabled className="bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Details */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("advanced.certificates.retrieve.details")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("advanced.certificates.retrieve.issuer_cn")}</Label>
                      <Input value={data.issuer_cn} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("advanced.certificates.retrieve.issuer_dc")}</Label>
                      <Input value={data.issuer_dc} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("advanced.certificates.retrieve.subject_key_identifier")}
                      </Label>
                      <Input 
                        value={data.subject_key_identifier} 
                        disabled 
                        className="bg-muted font-mono text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("advanced.certificates.retrieve.authority_key_identifier")}
                      </Label>
                      <Input 
                        value={data.authority_key_identifier} 
                        disabled 
                        className="bg-muted font-mono text-sm" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Loading State */
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-48 rounded bg-muted"></div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-muted"></div>
                        <div className="h-10 rounded bg-muted"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-16 rounded bg-muted"></div>
                        <div className="h-10 rounded bg-muted"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-32 rounded bg-muted"></div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="h-4 w-20 rounded bg-muted"></div>
                        <div className="h-10 rounded bg-muted"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 rounded bg-muted"></div>
                        <div className="h-10 rounded bg-muted"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-40 rounded bg-muted"></div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 w-32 rounded bg-muted"></div>
                          <div className="h-10 rounded bg-muted"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
