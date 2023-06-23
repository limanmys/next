import { useState } from "react"

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  return (
    <div className="h-full flex-1 flex-col p-8 md:flex">
      <div className="mb-8 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Abonelikler</h2>
          <p className="text-muted-foreground">
            Sistem ve eklenti aboneliklerinizi, yenilemelerinizi bu sayfa
            aracılığıyla gözlemleyebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
