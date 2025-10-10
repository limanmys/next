import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { Menu, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import { Icons } from "../ui/icons"
import CommandMenu from "./command-menu"
import ProfileDropdown from "./profile-dropdown"
import SefWidget from "./sef"

const Notifications = dynamic(import("./notifications"), { ssr: false })

export function SiteHeader() {
  const router = useRouter()
  const sidebarCtx = useSidebarContext()

  return (
    <header className="top-0 z-40 w-full border-b bg-background print:hidden">
      <div className="flex h-16 items-center space-x-4 px-6 sm:justify-between sm:space-x-0 xl:grid xl:grid-cols-3">
        <div className="flex">
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="mr-3 p-0"
              onClick={() => sidebarCtx.toggleSidebar()}
            >
              <Menu className="size-6" />
            </Button>
          </div>
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => sidebarCtx.setSelected("")}
          >
            <Icons.dugumluLogo className="w-22 h-9 dark:fill-white" />
          </Link>
        </div>

        <div className="flex">
          <CommandMenu />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center gap-1">
            {process.env.NEXT_PUBLIC_SEF_URL && <SefWidget />}

            <Notifications />

            <Link href="/settings">
              <div
                className={cn(
                  "group",
                  buttonVariants({
                    size: "sm",
                    variant: router.asPath.includes("/settings")
                      ? "secondary"
                      : "ghost",
                  })
                )}
              >
                <Settings className="size-5 group-hover:rotate-90 transition-all" />
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
