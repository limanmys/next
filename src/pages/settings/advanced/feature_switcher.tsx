import { NextPageWithLayout } from "@/pages/_app"
import { RotateCcw, Save, ToggleLeft } from "lucide-react"
import { ReactElement } from "react"
import { useTranslation } from "react-i18next"

import AdvancedLayout from "@/components/_layout/advanced_layout"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/page-header"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  useFeature,
  FeatureFlags,
  DEFAULT_FEATURES,
} from "@/providers/feature-provider"

interface FeatureGroup {
  titleKey: string
  descriptionKey: string
  features: {
    key: keyof FeatureFlags
    labelKey: string
    descriptionKey: string
  }[]
}

const FeatureSwitcherPage: NextPageWithLayout = () => {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const { features, setFeature, setFeatures, saveFeatures, enabledLanguages } =
    useFeature()

  const featureGroups: FeatureGroup[] = [
    {
      titleKey: "advanced.feature_switcher.groups.languages.title",
      descriptionKey: "advanced.feature_switcher.groups.languages.description",
      features: [
        {
          key: "lang_tr",
          labelKey: "advanced.feature_switcher.features.lang_tr.label",
          descriptionKey:
            "advanced.feature_switcher.features.lang_tr.description",
        },
        {
          key: "lang_en",
          labelKey: "advanced.feature_switcher.features.lang_en.label",
          descriptionKey:
            "advanced.feature_switcher.features.lang_en.description",
        },
        {
          key: "lang_de",
          labelKey: "advanced.feature_switcher.features.lang_de.label",
          descriptionKey:
            "advanced.feature_switcher.features.lang_de.description",
        },
      ],
    },
    {
      titleKey: "advanced.feature_switcher.groups.settings.title",
      descriptionKey: "advanced.feature_switcher.groups.settings.description",
      features: [
        {
          key: "settings_vault",
          labelKey: "advanced.feature_switcher.features.settings_vault.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_vault.description",
        },
        {
          key: "settings_tokens",
          labelKey: "advanced.feature_switcher.features.settings_tokens.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_tokens.description",
        },
        {
          key: "settings_extensions",
          labelKey:
            "advanced.feature_switcher.features.settings_extensions.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_extensions.description",
        },
        {
          key: "settings_users",
          labelKey: "advanced.feature_switcher.features.settings_users.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_users.description",
        },
        {
          key: "settings_roles",
          labelKey: "advanced.feature_switcher.features.settings_roles.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_roles.description",
        },
        {
          key: "settings_email",
          labelKey: "advanced.feature_switcher.features.settings_email.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_email.description",
        },
        {
          key: "settings_external_notifications",
          labelKey:
            "advanced.feature_switcher.features.settings_external_notifications.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_external_notifications.description",
        },
        {
          key: "settings_subscriptions",
          labelKey:
            "advanced.feature_switcher.features.settings_subscriptions.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_subscriptions.description",
        },
        {
          key: "settings_health",
          labelKey: "advanced.feature_switcher.features.settings_health.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_health.description",
        },
      ],
    },
    {
      titleKey: "advanced.feature_switcher.groups.server.title",
      descriptionKey: "advanced.feature_switcher.groups.server.description",
      features: [
        {
          key: "server_services",
          labelKey:
            "advanced.feature_switcher.features.server_services.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_services.description",
        },
        {
          key: "server_packages",
          labelKey:
            "advanced.feature_switcher.features.server_packages.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_packages.description",
        },
        {
          key: "server_updates",
          labelKey:
            "advanced.feature_switcher.features.server_updates.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_updates.description",
        },
        {
          key: "server_user_management",
          labelKey:
            "advanced.feature_switcher.features.server_user_management.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_user_management.description",
        },
        {
          key: "server_open_ports",
          labelKey:
            "advanced.feature_switcher.features.server_open_ports.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_open_ports.description",
        },
        {
          key: "server_access_logs",
          labelKey:
            "advanced.feature_switcher.features.server_access_logs.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_access_logs.description",
        },
      ],
    },
    {
      titleKey: "advanced.feature_switcher.groups.dashboard.title",
      descriptionKey: "advanced.feature_switcher.groups.dashboard.description",
      features: [
        {
          key: "dashboard_most_used_extensions",
          labelKey:
            "advanced.feature_switcher.features.dashboard_most_used_extensions.label",
          descriptionKey:
            "advanced.feature_switcher.features.dashboard_most_used_extensions.description",
        },
        {
          key: "dashboard_favorite_servers",
          labelKey:
            "advanced.feature_switcher.features.dashboard_favorite_servers.label",
          descriptionKey:
            "advanced.feature_switcher.features.dashboard_favorite_servers.description",
        },
        {
          key: "dashboard_auth_logs",
          labelKey:
            "advanced.feature_switcher.features.dashboard_auth_logs.label",
          descriptionKey:
            "advanced.feature_switcher.features.dashboard_auth_logs.description",
        },
      ],
    },
  ]

  const isLangToggleDisabled = (key: keyof FeatureFlags) => {
    if (!key.startsWith("lang_")) return false
    if (!features[key]) return false
    return enabledLanguages.length <= 1
  }

  const handleSave = () => {
    saveFeatures()
      .then(() => {
        toast({
          title: t("success"),
          description: t("advanced.feature_switcher.save_success"),
        })
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("advanced.feature_switcher.save_error"),
          variant: "destructive",
        })
      })
  }

  const handleReset = () => {
    setFeatures(DEFAULT_FEATURES)
  }

  return (
    <>
      <PageHeader
        title={t("advanced.feature_switcher.title")}
        description={t("advanced.feature_switcher.description")}
      />

      <div className="px-8 pb-10">
        <div className="mb-6 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 size-4" />
            {t("advanced.feature_switcher.reset")}
          </Button>
        </div>

        <div className="space-y-8">
          {featureGroups.map((group) => (
            <div key={group.titleKey}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight">
                  {t(group.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(group.descriptionKey)}
                </p>
              </div>

              <div className="space-y-3">
                {group.features.map((feature) => (
                  <div
                    key={feature.key}
                    className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs"
                  >
                    <div className="flex space-x-3">
                      <ToggleLeft className="size-6 text-muted-foreground" />
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-sm font-medium leading-none">
                          {t(feature.labelKey)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {t(feature.descriptionKey)}
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={features[feature.key]}
                      onCheckedChange={(checked) =>
                        setFeature(feature.key, checked)
                      }
                      disabled={isLangToggleDisabled(feature.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 size-4" />
            {t("advanced.feature_switcher.save")}
          </Button>
        </div>
      </div>
    </>
  )
}

FeatureSwitcherPage.getLayout = function getLayout(page: ReactElement<any>) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default FeatureSwitcherPage
