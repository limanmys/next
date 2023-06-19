export default function NotFound() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: "var(--container-height)",
      }}
    >
      <h2 className="border-r p-[24px] text-3xl font-bold tracking-tight">
        404
      </h2>
      <h2 className="p-[24px] text-xl tracking-tight">Sayfa bulunamadı</h2>
    </div>
  )
}
