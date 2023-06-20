import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  SIDEBARCTX_STATES,
  useSidebarContext,
} from "@/providers/sidebar-provider"
import Cookies from "js-cookie"
import { Bell, Eye, Globe2, LogOut, Menu, Settings, User } from "lucide-react"

import { IUser } from "@/types/user"
import { useLogout } from "@/hooks/auth/useLogout"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Icons } from "../ui/icons"
import CommandMenu from "./command-menu"

export function SiteHeader() {
  const router = useRouter()
  const sidebarCtx = useSidebarContext()

  const [user, setUser] = useState({} as IUser)
  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser).user)
    }
  }, [])

  const { logout } = useLogout()

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
          <Link href="/" className="flex items-center space-x-2">
            <Icons.dugumluLogo className="w-18 h-8 dark:fill-white" />
          </Link>
        </div>

        <div className="flex">
          <CommandMenu />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Globe2 className="h-5 w-5" />
                  <span className="sr-only">Localization</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Dil Seçimi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={true}>
                  Türkçe
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>İngilizce</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Almanca</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {Object.keys(user).length > 0 && user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-5 w-[420px]">
                {Object.keys(user).length > 0 && (
                  <>
                    <DropdownMenuLabel>
                      {user.name}
                      <br />
                      <span className="text-xs text-slate-400">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="flex">
                      <div className="avatar mr-2 p-2">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {user && user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="my-2 flex flex-col gap-[6px]">
                        <div className="text-sm">
                          <span className="font-semibold">
                            Son Giriş Tarihi:{" "}
                          </span>{" "}
                          {new Date(user.last_login_at).toLocaleDateString(
                            "tr-TR",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>

                        <div className="text-sm">
                          <span className="font-semibold">
                            Giriş Yapılan Son IP:{" "}
                          </span>{" "}
                          {user.last_login_ip}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <DropdownMenuSeparator />
                <div className="flex gap-1">
                  <Button className="w-full" variant="ghost">
                    <User className="mr-2 h-4 w-4" /> Profil
                  </Button>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => {
                      logout()
                      router.replace("/auth/login")
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
