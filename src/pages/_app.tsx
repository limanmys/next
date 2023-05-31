import "@/styles/globals.css"
import { AppType } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import Script from "next/script"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/navigation/sidebar"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

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
          {router.asPath !== "/" && <SiteHeader />}
          {router.asPath !== "/" ? (
            <div className="grid grid-cols-6">
              <Sidebar />
              <ScrollArea
                className="col-span-5"
                style={{
                  height: "calc(100vh - 4rem - 1px)",
                }}
              >
                <main>
                  <Component {...pageProps} key={router.route} />
                </main>
              </ScrollArea>
            </div>
          ) : (
            <Component {...pageProps} key={router.route} />
          )}
        </div>
        <TailwindIndicator />
      </ThemeProvider>
    </>
  )
}

export default RootLayout
