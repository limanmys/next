import Link from "next/link"
import { useRouter } from "next/router"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import { Bell, Eye, Menu, Settings } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Icons } from "../ui/icons"
import CommandMenu from "./command-menu"
import LanguageSelector from "./language-selector"
import ProfileDropdown from "./profile-dropdown"

export function SiteHeader() {
  const router = useRouter()
  const sidebarCtx = useSidebarContext()

  return (
    <header className="top-0 z-40 w-full border-b bg-background">
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
            <ThemeToggle />

            <LanguageSelector />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-5 w-[300px]">
                <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <h3 className="font-semibold">Yeni sunucu eklendi.</h3>
                  <span className="text-sm text-slate-500">6 gün önce</span>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <h3 className="font-semibold">Yeni sunucu eklendi.</h3>
                  <span className="text-sm text-slate-500">6 gün önce</span>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <h3 className="font-semibold">Yeni sunucu eklendi.</h3>
                  <span className="text-sm text-slate-500">6 gün önce</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <Eye className="float-left mr-2 mt-[2px] h-4 w-4" /> Tümünü
                  Okundu İşaretle
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>

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
