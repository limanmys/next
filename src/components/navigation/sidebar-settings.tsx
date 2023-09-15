import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useTranslation } from "react-i18next"

import { Settings } from "@/lib/settings"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"

import SettingsItem from "./settings-item"

export default function SidebarSettings() {
  const user = useCurrentUser()
  const [parent] = useAutoAnimate()
  const { t } = useTranslation("common")

  return (
    <>
      <h2 className="mb-5 px-2 text-lg font-semibold tracking-tight">
        {t("sidebar.settings.title")}
      </h2>
      <h3 className="mb-2 px-2 text-base font-semibold tracking-tight">
        {t("sidebar.settings.user")}
      </h3>
      <div className="space-y-1">
        {Settings.user.map((setting) => (
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
            {Settings.system.map((setting) => (
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
