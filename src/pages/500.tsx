export default function InternalServerError() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: "var(--container-height)",
      }}
    >
      <h2 className="border-r p-[24px] text-3xl font-bold tracking-tight">
        500
      </h2>
      <h2 className="p-[24px] text-xl tracking-tight">Sunucu Hatası</h2>
    </div>
  )
}
