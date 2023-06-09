import { User } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ayarlar</h2>
          <p className="text-muted-foreground">
            Bu sayfa aracılığıyla kişisel ayarlarınızı ve Liman MYS&apos;nin
            sistem ayarlarını yapabilirsiniz.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight">Kullanıcı Ayarları</h2>
      <div className="grid grid-cols-3 gap-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-6">
              <div className="icon self-start rounded-md bg-secondary p-3 dark:bg-secondary/10">
                <User className="h-6 w-6 text-secondary-foreground/70 dark:text-white/70" />
              </div>
              <div className="content">
                <h3 className="text-lg font-semibold tracking-tight">Profil</h3>
                <p className="text-gray-500">
                  Kullanıcı adınızı, e-posta adresinizi ve şifrenizi
                  değiştirebilir ve en son giriş yaptığınız tarih ve IP adresi
                  gibi detayları görüntüleyebilirsiniz.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-xl font-bold tracking-tight">Sistem Ayarları</h2>
    </div>
  )
}
