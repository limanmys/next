import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import { Menu, Settings } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

import { Icons } from "../ui/icons"
import CommandMenu from "./command-menu"
import FullScreenToggle from "./full-screen-toggle"
import LanguageSelector from "./language-selector"
import ProfileDropdown from "./profile-dropdown"

const Notifications = dynamic(import("./notifications"), { ssr: false })

export function SiteHeader() {
  const router = useRouter()
  const sidebarCtx = useSidebarContext()

  return (
    <header className="top-0 z-40 w-full border-b bg-background print:hidden">
      <div className="flex h-16 items-center space-x-4 px-6 sm:justify-between sm:space-x-0">
        <div className="flex">
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="mr-3 p-0"
              onClick={() => sidebarCtx[SIDEBARCTX_STATES.toggleSidebar]()}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => sidebarCtx[SIDEBARCTX_STATES.setSelected]("")}
          >
            <Icons.dugumluLogo className="w-18 h-8 dark:fill-white" />
          </Link>
        </div>

        <div className="flex">
          <CommandMenu />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <FullScreenToggle />

            <ThemeToggle />

            <LanguageSelector />

            <Notifications />

            <Link href="/settings">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: router.asPath.includes("/settings")
                    ? "secondary"
                    : "ghost",
                })}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </div>
            </Link>

            <ProfileDropdown />
          </nav>
        </div>
      </div>
    </header>
  )
}
