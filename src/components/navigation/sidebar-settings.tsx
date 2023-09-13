import { useAutoAnimate } from "@formkit/auto-animate/react"

import { Settings } from "@/lib/settings"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"

import SettingsItem from "./settings-item"

export default function SidebarSettings() {
  const user = useCurrentUser()
  const [parent] = useAutoAnimate()

  return (
    <>
      <h2 className="mb-5 px-2 text-lg font-semibold tracking-tight">
        Ayarlar
      </h2>
      <h3 className="mb-2 px-2 text-base font-semibold tracking-tight">
        Kullanıcı Ayarları
      </h3>
      <div className="space-y-1">
        {Settings.user.map((setting) => (
          <SettingsItem {...setting} key={setting.href} />
        ))}
      </div>
      {user.status === 1 && (
        <div ref={parent}>
          <h3 className="mb-2 mt-6 px-2 text-base font-semibold tracking-tight">
            Sistem Ayarları
          </h3>
          <div className="space-y-1">
            {Settings.system.map((setting) => (
              <SettingsItem {...setting} key={setting.href} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
