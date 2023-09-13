import { Settings } from "@/lib/settings"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import PageHeader from "@/components/ui/page-header"
import SettingCard from "@/components/settings/setting-card"

export default function SettingsPage() {
  const user = useCurrentUser()

  return (
    <>
      <PageHeader
        title="Ayarlar"
        description="Bu sayfa aracılığıyla kişisel ayarlarınızı ve Liman MYS'nin sistem ayarlarını yapabilirsiniz."
      />

      <div className="h-full flex-1 flex-col p-8 pt-2 md:flex">
        <h2 className="mb-3 text-xl font-bold tracking-tight">
          Kullanıcı Ayarları
        </h2>
        <div className="mb-8 grid grid-cols-3 gap-8">
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
        {user.status === 1 && (
          <>
            <h2 className="mb-3 text-xl font-bold tracking-tight">
              Sistem Ayarları
            </h2>
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
          </>
        )}
      </div>
    </>
  )
}
