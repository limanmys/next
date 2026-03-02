import { useTranslation } from "react-i18next"

import SettingCard from "@/components/settings/setting-card"
import PageHeader from "@/components/ui/page-header"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { Settings } from "@/lib/settings"
import { FeatureFlags, useFeature } from "@/providers/feature-provider"

const settingsFeatureMap: Record<string, keyof FeatureFlags> = {
  vault: "settings_vault",
  tokens: "settings_tokens",
  extensions: "settings_extensions",
  users: "settings_users",
  roles: "settings_roles",
  email: "settings_email",
  external_notifications: "settings_external_notifications",
  subscriptions: "settings_subscriptions",
  health: "settings_health",
}

export default function SettingsPage() {
  const user = useCurrentUser()
  const { t } = useTranslation("settings")
  const { isEnabled } = useFeature()

  const filteredUserSettings = Settings.user.filter((setting) => {
    const featureKey = settingsFeatureMap[setting.id]
    return !featureKey || isEnabled(featureKey)
  })

  const filteredSystemSettings = Settings.system.filter((setting) => {
    const featureKey = settingsFeatureMap[setting.id]
    return !featureKey || isEnabled(featureKey)
  })

  return (
    <>
      <PageHeader title={t("title")} description={t("description")} />

      <div className="h-full flex-1 flex-col p-8 pt-2 md:flex">
        <h2 className="mb-3 text-xl font-bold tracking-tight">
          {t("user_settings")}
        </h2>
        <div className="mb-8 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {filteredUserSettings.map((setting) => (
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
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {filteredSystemSettings.map((setting) => (
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
