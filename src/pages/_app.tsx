import { SidebarProvider } from "@/providers/sidebar-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import Cookies from "js-cookie"

import "@/styles/fontawesome.css"
import "@/styles/globals.css"
import "@/styles/nprogress.css"
import "@/styles/radial-progress.css"
import { ReactElement, ReactNode, useEffect, useState } from "react"
import { NextPage } from "next"
import { AppProps, AppType } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import { appWithI18Next, useSyncLanguage } from "ni18n"
import { ni18nConfig } from "ni18n.config.mjs"
import { useTranslation } from "react-i18next"

import { IUser } from "@/types/user"
import { cn } from "@/lib/utils"
import { NotificationCreator } from "@/components/ui/notificationcreator"
import { Toaster } from "@/components/ui/toaster"

import Layout from "../components/_layout/app_layout"

const isBrowser = () => {
  return typeof window !== "undefined"
}

const RootLayout: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()

  const locale = isBrowser() && window.localStorage.getItem("LANGUAGE")
  const [user, setUser] = useState({} as IUser)
  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser).user)
    }
  }, [])

  if (isBrowser()) {
    window.localStorage.setItem("LANGUAGE", locale || user.locale || "tr")
  }
  useSyncLanguage(locale || user.locale || "tr")

  const { t } = useTranslation("common")

  return (
    <>
      <Head>
        <title>{t("page_title", "Liman Merkezi Yönetim Sistemi")}</title>
        <link rel="icon" type="image/png" href="/favicon.png"></link>
      </Head>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className={cn("font-inter h-screen bg-background antialiased")}>
          {!router.asPath.includes("/auth/login") ? (
            <SidebarProvider>
              <Layout Component={Component} pageProps={pageProps} />
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
