import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { ICertificateDetails } from "@/types/certificate"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"

export default function CertificateInformation() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState<boolean>(true)
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
          title: "Hata",
          description: "Sertifika detayları getirilirken bir hata oluştu.",
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
        title="Sertifika Detayları"
        description="Seçtiğiniz sertifikaya ait detaylı bilgileri görüntüleyebilirsiniz."
      />

      <div className="p-8 pt-0">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="mb-3 w-full border-b text-lg font-semibold">
              İstemci Detayları
            </h2>
            <Label>IP Adresi</Label>
            <Input value={data?.ip_address} disabled />
          </div>
          <div className="space-y-2 pt-[40px]">
            <Label>Port</Label>
            <Input value={data?.port} disabled />
          </div>

          <div className="space-y-2">
            <h2 className="mb-3 w-full border-b text-lg font-semibold">
              Geçerlilik Süresi
            </h2>
            <Label>Başlangıç</Label>
            <Input value={data?.valid_from} disabled />
          </div>

          <div className="space-y-2 pt-[40px]">
            <Label>Bitiş</Label>
            <Input value={data?.valid_to} disabled />
          </div>

          <div className="space-y-2">
            <h2 className="mb-3 w-full border-b text-lg font-semibold">
              Genel Detaylar
            </h2>
            <Label>İstemci</Label>
            <Input value={data?.issuer_cn} disabled />
          </div>

          <div className="space-y-2 pt-[40px]">
            <Label>Otorite</Label>
            <Input value={data?.issuer_dc} disabled />
          </div>

          <div className="space-y-2">
            <Label>İstemci Parmak İzi</Label>
            <Input value={data?.subject_key_identifier} disabled />
          </div>

          <div className="space-y-2">
            <Label>Otorite Parmak İzi</Label>
            <Input value={data?.authority_key_identifier} disabled />
          </div>
        </div>
      </div>
    </>
  )
}
