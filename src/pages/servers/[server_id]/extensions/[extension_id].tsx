import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import ExtensionRender from "@/components/extension/extension-render"

export default function ExtensionPage() {
  const [content, setContent] = useState("")
  const router = useRouter()
  useEffect(() => {
    if (!router.query.extension_id || !router.query.server_id) return
    fetch(
      `https://liman.io/api/servers/${router.query.server_id}/extensions/${router.query.extension_id}`,
      {
        headers: {
          "liman-token":
            "P53xvcLDByZeEf9Tb7Ksjfd2COrYTxK8JfCtct2UPOTSTMRKaTOIMoOlxJUceQYj",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setContent(res.html)
      })
  }, [router.query.extension_id, router.query.server_id])

  return (
    <>
      <ExtensionRender c={content} />
    </>
  )
}
