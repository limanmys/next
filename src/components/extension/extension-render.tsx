import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import Iframe from "./iframe"

interface IExtensionRenderProps {
  c: string
}

export default function ExtensionRender({ c }: IExtensionRenderProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  useEffect(() => {
    setContent(c)
  }, [c])

  return (
    <>
      <Iframe content={content} key={content + router.asPath} />
    </>
  )
}
