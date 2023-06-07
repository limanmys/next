import { SidebarProvider } from "@/providers/sidebar-provider"
import { ThemeProvider } from "@/providers/theme-provider"

import "@/styles/globals.css"
import "@/styles/nprogress.css"
import { AppType } from "next/app"
import { Router, useRouter } from "next/router"
import NProgress from "nprogress"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/navigation/sidebar"
import { SiteHeader } from "@/components/navigation/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const RootLayout: AppType = ({ Component, pageProps }) => {
  const router = useRouter()

  Router.events.on("routeChangeStart", () => NProgress.start())
  Router.events.on("routeChangeComplete", () => {
    NProgress.done()
  })
  Router.events.on("routeChangeError", () => NProgress.done())

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div
          className={cn(
            "h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {!router.asPath.includes("/auth/login") && <SiteHeader />}
          {!router.asPath.includes("/auth/login") ? (
            <SidebarProvider>
              <div className="grid grid-cols-6">
                <Sidebar />
                <ScrollArea
                  className="col-span-5"
                  style={{
                    height: "var(--container-height)",
                  }}
                >
                  <main>
                    <Component {...pageProps} key={router.route} />
                  </main>
                </ScrollArea>
              </div>
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
