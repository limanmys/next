import { ReactNode } from "react"
import { Router, useRouter } from "next/router"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import nProgress from "nprogress"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/navigation/sidebar"
import { SiteHeader } from "@/components/navigation/site-header"

const Layout = ({ Component, pageProps }: any) => {
  const router = useRouter()
  const sidebarCtx = useSidebarContext()

  Router.events.on("routeChangeStart", () => nProgress.start())
  Router.events.on("routeChangeComplete", () => {
    sidebarCtx[SIDEBARCTX_STATES.setCollapsed](true)
    nProgress.done()
  })
  Router.events.on("routeChangeError", () => nProgress.done())

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page)

  return (
    <>
      <SiteHeader />
      <div className="flex-1">
        <div className="flex-1 items-start md:grid md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
          <Sidebar />
          <ScrollArea
            className="relative"
            style={{
              height: "var(--container-height)",
            }}
          >
            <main>
              {getLayout(<Component {...pageProps} key={router.route} />)}
            </main>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

export default Layout
