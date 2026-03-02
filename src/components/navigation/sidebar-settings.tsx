import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useTranslation } from "react-i18next"

import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { Settings } from "@/lib/settings"

import { opacityAnimation } from "@/lib/anim"
import { FeatureFlags, useFeature } from "@/providers/feature-provider"
import SettingsItem from "./settings-item"

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

export default function SidebarSettings() {
  const user = useCurrentUser()
  const [parent] = useAutoAnimate(opacityAnimation)
  const { t } = useTranslation("common")
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
      <h2 className="mb-5 px-2 text-lg font-semibold tracking-tight">
        {t("sidebar.settings.title")}
      </h2>
      <h3 className="mb-2 px-2 text-base font-semibold tracking-tight">
        {t("sidebar.settings.user")}
      </h3>
      <div className="space-y-1">
        {filteredUserSettings.map((setting) => (
          <SettingsItem
            {...{ ...setting, title: t(`sidebar.settings.${setting.id}`) }}
            key={setting.href}
          />
        ))}
      </div>
      {user.status === 1 && (
        <div ref={parent}>
          <h3 className="mb-2 mt-6 px-2 text-base font-semibold tracking-tight">
            {t("sidebar.settings.system")}
          </h3>
          <div className="space-y-1">
            {filteredSystemSettings.map((setting) => (
              <SettingsItem
                {...{ ...setting, title: t(`sidebar.settings.${setting.id}`) }}
                key={setting.href}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
