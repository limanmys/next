import ChainedBackend from "i18next-chained-backend"
import HttpBackend from "i18next-http-backend"
import type { Ni18nOptions } from "ni18n"

//import LocalStorageBackend from "i18next-localstorage-backend"

const isBrowser = typeof window !== "undefined"

export const ni18nConfig: Ni18nOptions = {
  supportedLngs: ["tr", "en", "de"],
  ns: ["common", "zod"],
  use: isBrowser ? [ChainedBackend] : undefined,
  backend: isBrowser
    ? {
        backends: [
          //LocalStorageBackend,
          HttpBackend,
        ],
        backendOptions: [
          {
            // expirationTime: 24 * 60 * 60 * 1000,
          },
          {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          },
        ],
      }
    : undefined,
}
