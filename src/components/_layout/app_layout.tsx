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

import GradientSvg from "../bg/gradient"

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
              <div className="relative z-10">
                {getLayout(<Component {...pageProps} key={router.route} />)}
              </div>
              <div className="pointer-events-none absolute top-0 z-10 -ml-48 mt-40 flex h-[2px] w-96 rotate-90">
                <div className="gradient w-full flex-none blur-sm"></div>
                <div className="gradient -ml-[100%] w-full flex-none blur-[1px]"></div>
                <div className="gradient -ml-[100%] w-full flex-none blur-sm"></div>
                <div className="gradient -ml-[100%] w-full flex-none blur-[1px]"></div>
              </div>
              <GradientSvg className="-mt-18 pointer-events-none absolute top-0 z-0 h-auto w-full rotate-180 opacity-30 dark:opacity-60" />
            </main>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

export default Layout
