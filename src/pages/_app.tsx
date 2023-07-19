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

import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

import Layout from "../components/_layout/app_layout"

const RootLayout: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Liman Merkezi Yönetim Sistemi</title>
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
