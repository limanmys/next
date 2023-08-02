import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import { ICertificate } from "@/types/certificate"

export default function CertificateInformation() {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ICertificate>()

  useEffect(() => {
    if (!router.query.id) return

    apiService
      .getInstance()
      .get<ICertificate>(
        `/settings/advanced/certificates/${router.query.id}/information`
      )
      .then((res) => {
        setData(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router.query.id])

  return <>{JSON.stringify(data)}</>
}
