import { SidebarProvider } from "@/providers/sidebar-provider"
import { ThemeProvider } from "@/providers/theme-provider"

import "@/styles/globals.css"
import "@/styles/nprogress.css"
import { AppType } from "next/app"
import { useRouter } from "next/router"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { TailwindIndicator } from "@/components/tailwind-indicator"

import Layout from "./_layout"

const RootLayout: AppType = ({ Component, pageProps }) => {
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

export default RootLayout
