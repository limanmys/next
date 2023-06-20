import { ArrowRight, Cog, Server, ToyBrick, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardCards() {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sunucu Sayısı</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">28</div>
          <p className="text-xs text-muted-foreground">
            Tüm sunucuları gör <ArrowRight className="inline-block h-4 w-4" />
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eklenti Sayısı</CardTitle>
          <ToyBrick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">
            Tüm eklentileri gör <ArrowRight className="inline-block h-4 w-4" />
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kullanıcı Sayısı
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">19</div>
          <p className="text-xs text-muted-foreground">
            Tüm kullanıcıları gör{" "}
            <ArrowRight className="inline-block h-4 w-4" />
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Liman Versiyonu</CardTitle>
          <Cog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.0</div>
          <p className="text-xs text-muted-foreground">Build: 1000</p>
        </CardContent>
      </Card>
    </div>
  )
}
