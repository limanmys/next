import Link from "next/link"
import { ArrowRight, Cog, Server, ToyBrick, Users } from "lucide-react"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardCards() {
  return (
    <div className="grid divide-x border-y md:grid-cols-2 lg:grid-cols-4">
      <div className="p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            Sunucu Sayısı
          </CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">28</div>
          <Link
            href="/servers"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3"
          >
            Tüm sunucuları gör <ArrowRight className="inline-block h-4 w-4" />
          </Link>
        </CardContent>
      </div>
      <div className="p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            Eklenti Sayısı
          </CardTitle>
          <ToyBrick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">24</div>
          <Link
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3"
            href="/settings/extensions"
          >
            Tüm eklentileri gör <ArrowRight className="inline-block h-4 w-4" />
          </Link>
        </CardContent>
      </div>
      <div className="p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            Kullanıcı Sayısı
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">19</div>
          <Link
            href="/settings/users"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3"
          >
            Tüm kullanıcıları gör{" "}
            <ArrowRight className="inline-block h-4 w-4" />
          </Link>
        </CardContent>
      </div>
      <div className="p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            Liman Versiyonu
          </CardTitle>
          <Cog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">2.0</div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground transition-all hover:gap-3">
            Build: 1000
          </p>
        </CardContent>
      </div>
    </div>
  )
}
