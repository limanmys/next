import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { Router, useRouter } from "next/router"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import Cookies from "js-cookie"
import nProgress from "nprogress"
import { useTranslation } from "react-i18next"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/navigation/sidebar"
import { SiteHeader } from "@/components/navigation/site-header"

import GradientSvg from "../bg/gradient"

const Layout = ({ Component, pageProps }: any) => {
  const router = useRouter()
  const sidebarCtx = useSidebarContext()
  const { t } = useTranslation("common")

  Router.events.on("routeChangeStart", () => nProgress.start())
  Router.events.on("routeChangeComplete", () => {
    sidebarCtx[SIDEBARCTX_STATES.setCollapsed](true)
    nProgress.done()
  })
  Router.events.on("routeChangeError", () => nProgress.done())

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    let authChecker = setInterval(() => {
      let currentUser = Cookies.get("currentUser")
      if (currentUser) {
        currentUser = JSON.parse(currentUser)
      }

      if (currentUser && currentUser.expired_at) {
        // expired_at is unix epoch milliseconds time
        // check if expired_at is less than current time
        // if it is, then logout
        if (currentUser.expired_at < Date.now()) {
          setOpen(true)
          Cookies.remove("currentUser")
        }
      } else {
        clearInterval(authChecker)
      }
    }, 30000)

    return () => {
      clearInterval(authChecker)
    }
  }, [])

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
                <div className="gradient ml-[-100%] w-full flex-none blur-[1px]"></div>
                <div className="gradient ml-[-100%] w-full flex-none blur-sm"></div>
                <div className="gradient ml-[-100%] w-full flex-none blur-[1px]"></div>
              </div>
              <GradientSvg className="-mt-18 pointer-events-none absolute top-0 z-0 h-auto w-full rotate-180 opacity-30 dark:opacity-60" />
            </main>
          </ScrollArea>
        </div>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("logout_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("logout_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href={`/auth/login?redirect=${router.asPath}`}>
              <AlertDialogAction>{t("logout")}</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Layout
