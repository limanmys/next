import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import Echo from "laravel-echo"
import { Bell, Eye } from "lucide-react"
import Pusher from "pusher-js"

import { IUser } from "@/types/user"
import { buttonVariants } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export default function Notifications() {
  const router = useRouter()

  const [user, setUser] = useState({} as IUser)
  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser).user)
    }

    const echo = new Echo({
      broadcaster: "pusher",
      key: "liman-key",
      cluster: "eu",
      wsHost: "liman.io",
      wssPort: 443,
      disableStats: true,
      encrypted: true,
      enabledTransports: ["ws", "wss"],
      disabledTransports: ["sockjs", "xhr_polling", "xhr_streaming"],

      authEndpoint: "/api/broadcasting/auth",

      auth: {
        headers: {
          Authorization: "Bearer " + JSON.parse(currentUser).access_token,
          Accept: "application/json",
        },
      },

      pusher: Pusher,
    })

    echo
      .private(`App.User.${JSON.parse(currentUser).user.id}`)
      .notification((notification: any) => {
        console.log(notification)
      })
  }, [])

  return (
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
          <Eye className="float-left mr-2 mt-[2px] h-4 w-4" /> Tümünü Okundu
          İşaretle
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
