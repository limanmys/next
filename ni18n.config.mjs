import ChainedBackend from "i18next-chained-backend"
import HttpBackend from "i18next-http-backend"

//import LocalStorageBackend from "i18next-localstorage-backend"

const isBrowser = typeof window !== "undefined"

export const ni18nConfig = {
  supportedLngs: ["tr", "en", "de"],
  ns: ["common"],
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
