import { useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { DownloadCloudIcon, Save } from "lucide-react"

import { ICertificateDetails } from "@/types/certificate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"

export default function CertificateInformation() {
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
          title: "Hata",
          description: "Sertifika detayları getirilirken bir hata oluştu.",
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
          title: "Başarılı",
          description: "Sertifika başarıyla oluşturuldu.",
        })
        setTimeout(() => {
          router.push("/settings/advanced/certificates")
        }, 1000)
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Sertifika oluşturulurken bir hata oluştu.",
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
        title="Sertifika Ekle"
        description="Hostname ve port bilgisini sağladığınız sunucunun sertifikası Liman sistemine aktarılacaktır."
      />

      <div className="p-8 pt-0">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="border-b w-full font-semibold text-lg mb-3">
              İstemci Detayları
            </h2>
            <Label>IP Adresi</Label>
            <Input
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <Button onClick={fetchDetails} className="mb-10" disabled={loading}>
              <DownloadCloudIcon className="h-4 w-4 mr-2" /> Sertifika
              Detaylarını Getir
            </Button>
          </div>
          <div className="space-y-2 pt-[40px]">
            <Label>Port</Label>
            <Input value={port} onChange={(e) => setPort(e.target.value)} />
          </div>

          <div className="space-y-2">
            <h2 className="border-b w-full font-semibold text-lg mb-3">
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
            <h2 className="border-b w-full font-semibold text-lg mb-3">
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

            <Button
              onClick={createCertificate}
              className="mb-10"
              disabled={loading || !data || Object.keys(data).length == 0}
            >
              <Save className="h-4 w-4 mr-2" /> Kaydet
            </Button>
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
