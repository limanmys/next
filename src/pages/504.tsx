import { Unlink } from "lucide-react"

export default function ServerOffline() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: "var(--container-height)",
      }}
    >
      <h2 className="text-3xl font-bold tracking-tight border-r p-[24px]">
        <Unlink className="inline-block w-12 h-12" />
      </h2>
      <h2 className="text-xl tracking-tight p-[24px]">
        Sunucuya erişilemiyor.
      </h2>
    </div>
  )
}
