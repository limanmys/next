import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import md5 from "blueimp-md5"
import Cookies from "js-cookie"
import { ChevronDown, LogOut, User } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IUser } from "@/types/user"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/auth/useLogout"
import { Button, buttonVariants } from "@/components/ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export default function ProfileDropdown() {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")

  const [user, setUser] = useState({} as IUser)
  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser).user)
    }
  }, [])

  const { logout } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            buttonVariants({
              size: "sm",
              variant: "ghost",
            }),
            "h-9 flex items-center gap-2"
          )}
        >
          <Avatar className="size-6">
            <AvatarImage
              src={`https://gravatar.com/avatar/${md5(user.email)}?d=404`}
              alt={user.name}
            />
            <AvatarFallback className="text-xs">
              {Object.keys(user).length > 0 &&
                (user.name ?? "")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
            </AvatarFallback>
          </Avatar>
          {user.name || ""}
          <ChevronDown className="size-3 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-[420px]">
        {Object.keys(user).length > 0 && (
          <>
            <DropdownMenuLabel>
              {user.name}
              <br />
              <span className="text-xs text-slate-400">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex">
              <div className="avatar mr-2 p-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://gravatar.com/avatar/${md5(user.email)}?d=404`}
                    alt={user.name}
                  />
                  <AvatarFallback>{user && user.name[0]}</AvatarFallback>
                </Avatar>
              </div>

              <div className="my-2 flex flex-col gap-[6px]">
                <div className="text-sm">
                  <span className="font-semibold">
                    {t("profile_dropdown.last_login_at")}:{" "}
                  </span>{" "}
                  {new Date(user.last_login_at).toLocaleDateString(
                    i18n.language,
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
                    {t("profile_dropdown.last_login_ip")}:{" "}
                  </span>{" "}
                  {user.last_login_ip}
                </div>
              </div>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        <div className="flex gap-1">
          <Button
            className="w-full"
            variant="ghost"
            onClick={() => router.push("/settings/profile")}
          >
            <User className="mr-2 h-4 w-4" /> {t("profile_dropdown.profile")}
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => {
              logout().then(() => {
                router.replace("/auth/login?redirect=" + router.asPath)
              })
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> {t("profile_dropdown.logout")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
