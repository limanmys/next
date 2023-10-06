import ChainedBackend from "i18next-chained-backend"
import HttpBackend from "i18next-http-backend"
// import LocalStorageBackend from "i18next-localstorage-backend"
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
  ns: ["common", "zod", "components", "dashboard", "settings"],
  use: isBrowser ? [ChainedBackend] : undefined,
  backend: isBrowser
    ? {
        backends: [HttpBackend],
        backendOptions: [
          {},
          {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          },
        ],
      }
    : undefined,
}
