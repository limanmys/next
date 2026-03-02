import * as React from "react"

import { http } from "@/services"

export interface FeatureFlags {
  // Languages
  lang_tr: boolean
  lang_en: boolean
  lang_de: boolean

  // Settings page sections (system settings)
  settings_vault: boolean
  settings_tokens: boolean
  settings_extensions: boolean
  settings_users: boolean
  settings_roles: boolean
  settings_email: boolean
  settings_external_notifications: boolean
  settings_subscriptions: boolean
  settings_health: boolean

  // Server sidebar features
  server_services: boolean
  server_packages: boolean
  server_updates: boolean
  server_user_management: boolean
  server_open_ports: boolean
  server_access_logs: boolean

  // Dashboard widgets
  dashboard_most_used_extensions: boolean
  dashboard_favorite_servers: boolean
  dashboard_auth_logs: boolean
}

export const DEFAULT_FEATURES: FeatureFlags = {
  lang_tr: true,
  lang_en: true,
  lang_de: true,
  settings_vault: true,
  settings_tokens: true,
  settings_extensions: true,
  settings_users: true,
  settings_roles: true,
  settings_email: true,
  settings_external_notifications: true,
  settings_subscriptions: true,
  settings_health: true,
  server_services: true,
  server_packages: true,
  server_updates: true,
  server_user_management: true,
  server_open_ports: true,
  server_access_logs: true,
  dashboard_most_used_extensions: true,
  dashboard_favorite_servers: true,
  dashboard_auth_logs: true,
}

interface FeatureContextType {
  features: FeatureFlags
  setFeature: (key: keyof FeatureFlags, value: boolean) => void
  setFeatures: (features: FeatureFlags) => void
  isEnabled: (key: keyof FeatureFlags) => boolean
  resetFeatures: () => void
  saveFeatures: () => Promise<void>
  loading: boolean
  enabledLanguages: string[]
}

const FeatureContext = React.createContext<FeatureContextType | undefined>(
  undefined
)

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeaturesState] =
    React.useState<FeatureFlags>(DEFAULT_FEATURES)
  const [loading, setLoading] = React.useState(true)

  // Fetch feature flags from backend on mount
  React.useEffect(() => {
    http
      .get("/settings/advanced/feature_flags")
      .then((res) => {
        setFeaturesState({ ...DEFAULT_FEATURES, ...res.data })
      })
      .catch(() => {
        setFeaturesState(DEFAULT_FEATURES)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const setFeature = React.useCallback(
    (key: keyof FeatureFlags, value: boolean) => {
      setFeaturesState((prev) => {
        // Prevent disabling all languages
        if (key.startsWith("lang_") && !value) {
          const langKeys = Object.keys(prev).filter(
            (k) => k.startsWith("lang_") && k !== key
          ) as (keyof FeatureFlags)[]
          const hasOtherLang = langKeys.some((k) => prev[k])
          if (!hasOtherLang) return prev
        }

        return { ...prev, [key]: value }
      })
    },
    []
  )

  const setFeatures = React.useCallback((newFeatures: FeatureFlags) => {
    setFeaturesState(newFeatures)
  }, [])

  const saveFeatures = React.useCallback(async () => {
    await http.post("/settings/advanced/feature_flags", features)
  }, [features])

  const isEnabled = React.useCallback(
    (key: keyof FeatureFlags) => features[key],
    [features]
  )

  const resetFeatures = React.useCallback(() => {
    setFeaturesState(DEFAULT_FEATURES)
  }, [])

  const enabledLanguages = React.useMemo(() => {
    const langs: string[] = []
    if (features.lang_tr) langs.push("tr")
    if (features.lang_en) langs.push("en")
    if (features.lang_de) langs.push("de")
    return langs
  }, [features.lang_tr, features.lang_en, features.lang_de])

  const contextValue = React.useMemo(
    () => ({
      features,
      setFeature,
      setFeatures,
      isEnabled,
      resetFeatures,
      saveFeatures,
      loading,
      enabledLanguages,
    }),
    [
      features,
      setFeature,
      setFeatures,
      isEnabled,
      resetFeatures,
      saveFeatures,
      loading,
      enabledLanguages,
    ]
  )

  return (
    <FeatureContext value={contextValue}>
      {children}
    </FeatureContext>
  )
}

export function useFeature() {
  const context = React.useContext(FeatureContext)
  if (context === undefined) {
    throw new Error("useFeature must be used within a FeatureProvider")
  }
  return context
}
