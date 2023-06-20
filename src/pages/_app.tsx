import { SidebarProvider } from "@/providers/sidebar-provider"
import { ThemeProvider } from "@/providers/theme-provider"

import "@/styles/globals.css"
import "@/styles/nprogress.css"
import { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import { AppProps, AppType } from "next/app"
import { useRouter } from "next/router"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"

import Layout from "../components/_layout/app_layout"

const RootLayout: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div
          className={cn(
            "h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {!router.asPath.includes("/auth/login") ? (
            <SidebarProvider>
              <Layout Component={Component} pageProps={pageProps} />
            </SidebarProvider>
          ) : (
            <Component {...pageProps} key={router.route} />
          )}
        </div>
        <Toaster />
        <TailwindIndicator />
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

export default RootLayout
