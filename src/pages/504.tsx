import { Unlink } from "lucide-react"

export default function ServerOffline() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: "var(--container-height)",
      }}
    >
      <h2 className="border-r p-[24px] text-3xl font-bold tracking-tight">
        <Unlink className="inline-block size-12" />
      </h2>
      <h2 className="p-[24px] text-xl tracking-tight">
        Sunucuya erişilemiyor.
      </h2>
    </div>
  )
}
