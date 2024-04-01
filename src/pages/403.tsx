import { AlertTriangle } from "lucide-react"

export default function AccessDenied() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: "var(--container-height)",
      }}
    >
      <h2 className="border-r p-[24px] text-3xl font-bold tracking-tight">
        <AlertTriangle className="inline-block size-12" />
      </h2>
      <h2 className="p-[24px] text-xl tracking-tight">
        Bu sayfaya erişim izniniz bulunmamaktadır.
      </h2>
    </div>
  )
}
