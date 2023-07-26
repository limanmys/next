import dynamic from "next/dynamic"

const Renderer = dynamic(() => import("@/components/extension/renderer"), {
  ssr: false,
})

export default function ExtensionPage() {
  return <Renderer />
}
