import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"

import ExtensionRender from "@/components/extension/extension-render"

export default function ExtensionPage() {
  const [content, setContent] = useState("")
  const router = useRouter()
  useEffect(() => {
    if (!router.query.extension_id || !router.query.server_id) return
    setContent("")

    apiService
      .getInstance()
      .post(
        `/servers/${router.query.server_id}/extensions/${router.query.extension_id}`
      )
      .then((res) => {
        setContent(res.data.html)
      })
  }, [router.query.extension_id, router.query.server_id])

  return (
    <>
      <ExtensionRender c={content} />
    </>
  )
}
