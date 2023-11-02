import { SidebarProvider } from "@/providers/sidebar-provider"
import { ThemeProvider } from "@/providers/theme-provider"

import "@/styles/fontawesome.css"
import "@/styles/globals.css"
import "@/styles/nprogress.css"
import "@/styles/radial-progress.css"
import { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import { AppProps, AppType } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import { appWithI18Next, useSyncLanguage } from "ni18n"
import { ni18nConfig } from "ni18n.config"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { makeZodI18nMap } from "zod-i18n-map"

import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { NotificationCreator } from "@/components/ui/notificationcreator"
import { Toaster } from "@/components/ui/toaster"

import Layout from "../components/_layout/app_layout"

const isBrowser = () => {
  return typeof window !== "undefined"
}

const RootLayout: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()

  const locale = isBrowser() && window.localStorage.getItem("LANGUAGE")
  const user = useCurrentUser()

  if (isBrowser()) {
    window.localStorage.setItem("LANGUAGE", locale || user.locale || "tr")
  }

  useSyncLanguage(locale || user.locale || "tr")

  const { t, ready } = useTranslation("common")
  const { t: tfull } = useTranslation()
  z.setErrorMap(makeZodI18nMap({ t: tfull, ns: "zod" }))

  return (
    <>
      <Head>
        <title>{t("page_title", "Liman Merkezi Yönetim Sistemi")}</title>
        <link rel="icon" type="image/png" href="/favicon.png"></link>
      </Head>

      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <div className={cn("font-inter h-screen bg-background antialiased")}>
          {!router.asPath.includes("/auth") ? (
            <SidebarProvider>
              {ready && <Layout Component={Component} pageProps={pageProps} />}
            </SidebarProvider>
          ) : (
            <Component {...pageProps} key={router.route} />
          )}
        </div>
        <Toaster />
        <NotificationCreator />
      </ThemeProvider>
    </>
  )
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default appWithI18Next(RootLayout, ni18nConfig)
