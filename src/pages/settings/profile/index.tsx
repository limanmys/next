import { Settings } from "@/lib/settings"
import SettingCard from "@/components/settings/setting-card"

export default function SettingsPage() {
  return (
    <div className="hidden h-full flex-1 flex-col p-8 md:flex">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ayarlar</h2>
          <p className="text-muted-foreground">
            Bu sayfa aracılığıyla kişisel ayarlarınızı ve Liman MYS&apos;nin
            sistem ayarlarını yapabilirsiniz.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight mb-3">
        Kullanıcı Ayarları
      </h2>
      <div className="grid grid-cols-3 gap-8 mb-8">
        {Settings.user.map((setting) => (
          <SettingCard
            href={setting.href}
            icon={setting.icon}
            title={setting.title}
            description={setting.description}
            key={setting.href}
          />
        ))}
      </div>
      <h2 className="text-xl font-bold tracking-tight mb-3">Sistem Ayarları</h2>
      <div className="grid grid-cols-3 gap-8">
        {Settings.system.map((setting) => (
          <SettingCard
            href={setting.href}
            icon={setting.icon}
            title={setting.title}
            description={setting.description}
            key={setting.href}
          />
        ))}
      </div>
    </div>
  )
}
