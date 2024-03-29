import { useTranslation } from "react-i18next"

import { Settings } from "@/lib/settings"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import PageHeader from "@/components/ui/page-header"
import SettingCard from "@/components/settings/setting-card"

export default function SettingsPage() {
  const user = useCurrentUser()
  const { t } = useTranslation("settings")

  return (
    <>
      <PageHeader title={t("title")} description={t("description")} />

      <div className="h-full flex-1 flex-col p-8 pt-2 md:flex">
        <h2 className="mb-3 text-xl font-bold tracking-tight">
          {t("user_settings")}
        </h2>
        <div className="mb-8 grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {Settings.user.map((setting) => (
            <SettingCard
              href={setting.href}
              icon={setting.icon}
              title={t(`${setting.id}.title`)}
              description={t(`${setting.id}.description`)}
              key={setting.href}
            />
          ))}
        </div>
        {user.status === 1 && (
          <>
            <h2 className="mb-3 text-xl font-bold tracking-tight">
              {t("system_settings")}
            </h2>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {Settings.system.map((setting) => (
                <SettingCard
                  href={setting.href}
                  icon={setting.icon}
                  title={t(`${setting.id}.title`)}
                  description={t(`${setting.id}.description`)}
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
