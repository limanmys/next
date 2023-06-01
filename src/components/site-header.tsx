import Link from "next/link"
import { Bell, Eye, Globe2, Key, LogOut } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

import CommandMenu from "./navigation/command-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Icons } from "./ui/icons"

export function SiteHeader() {
  return (
    <header className="top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center space-x-4 px-6 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Icons.logo className="w-18 h-6 dark:fill-white" />
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/dogukanoksuz.png" />
                    <AvatarFallback>DÖ</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-5 w-[420px]">
                <DropdownMenuLabel>
                  Doğukan Öksüz
                  <br />
                  <span className="text-xs text-slate-400">
                    doksuz@havelsan.com.tr
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex">
                  <div className="avatar mr-2 p-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://github.com/dogukanoksuz.png" />
                      <AvatarFallback>DÖ</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="my-2 flex flex-col gap-[6px]">
                    <div className="text-sm">
                      <span className="font-semibold">Son Giriş Tarihi: </span>{" "}
                      23 Haziran 2023 14:00:15
                    </div>

                    <div className="text-sm">
                      <span className="font-semibold">
                        Giriş Yapılan Son IP:{" "}
                      </span>{" "}
                      127.0.0.1
                    </div>

                    <div className="text-sm">
                      <span className="font-semibold">Bağlı Liman: </span>{" "}
                      limanmys
                    </div>

                    <div className="text-sm">
                      <span className="font-semibold">Liman ID: </span>{" "}
                      20c46b6f850f2e08446eabf939b33c14
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="flex gap-1">
                  <Button className="w-full" variant="ghost">
                    <Key className="mr-2 h-4 w-4" /> Yetki Talepleri
                  </Button>
                  <Button className="w-full" variant="secondary">
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
