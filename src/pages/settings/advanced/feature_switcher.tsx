import { ReactElement } from "react"
import { NextPageWithLayout } from "@/pages/_app"
import {
  DEFAULT_FEATURES,
  FeatureFlags,
  useFeature,
} from "@/providers/feature-provider"
import {
  BellRing,
  Download,
  Globe,
  HeartPulse,
  KeyRound,
  Lock,
  LucideIcon,
  Mail,
  Network,
  Package,
  Puzzle,
  RotateCcw,
  Rss,
  Save,
  ScrollText,
  Server,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import PageHeader from "@/components/ui/page-header"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import AdvancedLayout from "@/components/_layout/advanced_layout"

interface FeatureGroup {
  titleKey: string
  descriptionKey: string
  features: {
    key: keyof FeatureFlags
    labelKey: string
    descriptionKey: string
    icon: LucideIcon
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
          icon: Globe,
        },
        {
          key: "lang_en",
          labelKey: "advanced.feature_switcher.features.lang_en.label",
          descriptionKey:
            "advanced.feature_switcher.features.lang_en.description",
          icon: Globe,
        },
        {
          key: "lang_de",
          labelKey: "advanced.feature_switcher.features.lang_de.label",
          descriptionKey:
            "advanced.feature_switcher.features.lang_de.description",
          icon: Globe,
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
          icon: Lock,
        },
        {
          key: "settings_tokens",
          labelKey: "advanced.feature_switcher.features.settings_tokens.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_tokens.description",
          icon: KeyRound,
        },
        {
          key: "settings_extensions",
          labelKey:
            "advanced.feature_switcher.features.settings_extensions.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_extensions.description",
          icon: Puzzle,
        },
        {
          key: "settings_users",
          labelKey: "advanced.feature_switcher.features.settings_users.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_users.description",
          icon: Users,
        },
        {
          key: "settings_roles",
          labelKey: "advanced.feature_switcher.features.settings_roles.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_roles.description",
          icon: ShieldCheck,
        },
        {
          key: "settings_email",
          labelKey: "advanced.feature_switcher.features.settings_email.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_email.description",
          icon: Mail,
        },
        {
          key: "settings_external_notifications",
          labelKey:
            "advanced.feature_switcher.features.settings_external_notifications.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_external_notifications.description",
          icon: BellRing,
        },
        {
          key: "settings_subscriptions",
          labelKey:
            "advanced.feature_switcher.features.settings_subscriptions.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_subscriptions.description",
          icon: Rss,
        },
        {
          key: "settings_health",
          labelKey: "advanced.feature_switcher.features.settings_health.label",
          descriptionKey:
            "advanced.feature_switcher.features.settings_health.description",
          icon: HeartPulse,
        },
      ],
    },
    {
      titleKey: "advanced.feature_switcher.groups.server.title",
      descriptionKey: "advanced.feature_switcher.groups.server.description",
      features: [
        {
          key: "server_services",
          labelKey: "advanced.feature_switcher.features.server_services.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_services.description",
          icon: Server,
        },
        {
          key: "server_packages",
          labelKey: "advanced.feature_switcher.features.server_packages.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_packages.description",
          icon: Package,
        },
        {
          key: "server_updates",
          labelKey: "advanced.feature_switcher.features.server_updates.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_updates.description",
          icon: Download,
        },
        {
          key: "server_user_management",
          labelKey:
            "advanced.feature_switcher.features.server_user_management.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_user_management.description",
          icon: UserCog,
        },
        {
          key: "server_open_ports",
          labelKey:
            "advanced.feature_switcher.features.server_open_ports.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_open_ports.description",
          icon: Network,
        },
        {
          key: "server_access_logs",
          labelKey:
            "advanced.feature_switcher.features.server_access_logs.label",
          descriptionKey:
            "advanced.feature_switcher.features.server_access_logs.description",
          icon: ScrollText,
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
          icon: TrendingUp,
        },
        {
          key: "dashboard_favorite_servers",
          labelKey:
            "advanced.feature_switcher.features.dashboard_favorite_servers.label",
          descriptionKey:
            "advanced.feature_switcher.features.dashboard_favorite_servers.description",
          icon: Star,
        },
        {
          key: "dashboard_auth_logs",
          labelKey:
            "advanced.feature_switcher.features.dashboard_auth_logs.label",
          descriptionKey:
            "advanced.feature_switcher.features.dashboard_auth_logs.description",
          icon: ScrollText,
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
        rightSide={
          <div className="mb-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 size-4" />
              {t("advanced.feature_switcher.reset")}
            </Button>
          </div>
        }
      />

      <div className="px-8 pb-24">
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
                      <feature.icon className="size-6 text-muted-foreground" />
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
      </div>

      <div className="sticky bottom-0 border-t bg-background px-8 py-4 flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 size-4" />
          {t("advanced.feature_switcher.save")}
        </Button>
      </div>
    </>
  )
}

FeatureSwitcherPage.getLayout = function getLayout(page: ReactElement<any>) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default FeatureSwitcherPage
