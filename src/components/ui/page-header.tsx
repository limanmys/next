export default function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex-1 flex-col p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
