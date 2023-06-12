export default function NotFound() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: "var(--container-height)",
      }}
    >
      <h2 className="text-3xl font-bold tracking-tight border-r p-[24px]">
        404
      </h2>
      <h2 className="text-xl tracking-tight p-[24px]">Sayfa bulunamadı</h2>
    </div>
  )
}
