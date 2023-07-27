import Head from "next/head"

export default function PageHeader({
  title,
  description,
  rightSide,
}: {
  title: string
  description: string
  rightSide?: React.ReactNode
}) {
  return (
    <div className="flex-1 flex-col p-8 md:flex">
      <Head>
        <title>{`${title} | Liman`}</title>
      </Head>

      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {rightSide && <div className="flex items-center">{rightSide}</div>}
      </div>
    </div>
  )
}
