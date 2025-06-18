import ChainedBackend from "i18next-chained-backend"
import HttpBackend from "i18next-http-backend"
import LocalStorageBackend from "i18next-localstorage-backend"
import type { Ni18nOptions } from "ni18n"

const isBrowser = typeof window !== "undefined"

export const ni18nConfig: Ni18nOptions = {
  supportedLngs: ["tr", "en", "de"],
  fallbackLng: {
    dev: ["tr", "en"],
  },
  react: {
    useSuspense: false,
  },
  ns: ["common", "zod", "components", "dashboard", "settings", "notifications"],
  use: isBrowser ? [ChainedBackend] : undefined,
  backend: isBrowser
    ? {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          expirationTime: 24 * 60 * 60 * 1000,
          defaultVersion: "v1",
          versions: {
            en: "v5",
            tr: "v5",
            de: "v5",
          },
        },
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
      ],
    }
    : undefined,
}
