import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import Cookies from "js-cookie"
import Echo from "laravel-echo"
import { Bell, BellOff, CheckCheck } from "lucide-react"
import Pusher from "pusher-js"

import { INotification } from "@/types/notification"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import { Badge } from "../ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import StatusBadge, { Status } from "../ui/status-badge"
import { useNotification } from "../ui/use-notification"

export default function Notifications() {
  const router = useRouter()
  const { sendNotification } = useNotification()

  const snd = new Audio("/assets/sound/notification.mp3")
  function beep() {
    snd.play()
  }

  const [notifications, setNotifications] = useState<INotification[]>([])
  const getNotSeenNotificationCount = () => {
    return notifications.filter((notification) => !notification.seen_at).length
  }

  const markAsSeen = async (notifications: INotification[]) => {
    setTimeout(() => {
      notifications.forEach((notification) => {
        if (!notification.seen_at) {
          apiService.getInstance().post("/notifications/seen", {
            notification_id: notification.notification_id,
          })
        }
      })
    }, 1000)
  }

  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    let tempNotifications: INotification[] = []

    apiService
      .getInstance()
      .get<INotification[]>("/notifications/unread")
      .then((response) => {
        tempNotifications = response.data
        setNotifications(response.data)

        JSON.parse(JSON.stringify(tempNotifications))
          .reverse()
          .forEach((notification: INotification) => {
            if (!notification.seen_at) {
              sendNotification(notification)
            }
          })

        markAsSeen(tempNotifications)
      })

    const echo = new Echo({
      broadcaster: "pusher",
      key: "liman-key",
      cluster: "eu",
      wsHost: "10.151.43.11",
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
      .notification((notification: INotification) => {
        markAsSeen([notification])

        setNotifications([notification, ...tempNotifications])

        tempNotifications = JSON.parse(
          JSON.stringify([notification, ...tempNotifications])
        )

        beep()

        sendNotification(notification)
      })

    return () => {
      echo.leave(`App.User.${JSON.parse(currentUser).user.id}`)
      echo.disconnect()
    }
  }, [])

  const handleMarkAsRead = () => {
    apiService
      .getInstance()
      .post("/notifications/read")
      .then(() => {
        setNotifications([])
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            buttonVariants({
              size: "sm",
              variant: "ghost",
            }),
            "relative"
          )}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <Badge className="px-[4px] py-[2px] rounded-full text-[11px] leading-[11px] absolute top-0 right-0">
            {getNotSeenNotificationCount()}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-[500px]">
        <div className="flex items-center justify-between p-4">
          <h3 className="tracking-tight font-semibold text-lg">
            Bildirimleriniz
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-blue-500 -mr-2"
            disabled={notifications.length === 0}
            onClick={() => handleMarkAsRead()}
          >
            <CheckCheck className="h-5 w-5 mr-2" /> Tümünü Okundu Olarak
            İşaretle
          </Button>
        </div>
        <div className="p-2 flex flex-col gap-3">
          {notifications.map((notification) => (
            <Link
              href={`/notifications#notification-${notification.notification_id}`}
              key={notification.notification_id}
            >
              <div className="p-2 hover:bg-accent/50 hover:text-accent-foreground transition-all rounded gap-1 flex flex-col relative">
                <h3 className="font-semibold text-[15px] tracking-tight">
                  {notification.title}
                </h3>

                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {notification.content}
                </p>

                <div className="absolute top-1 right-2">
                  <StatusBadge status={notification.level as Status} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-700 dark:text-slate-400">
                    {new Date(notification.send_at).toLocaleDateString(
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

                  <span className="text-xs text-slate-500">
                    {notification.send_at_humanized}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {notifications.length === 0 && (
          <>
            <div className="p-2 py-8 items-center justify-center flex flex-col">
              <BellOff className="h-8 w-8 text-slate-800 dark:text-slate-300 mb-5" />

              <h3 className="font-semibold text-md tracking-tight mb-1">
                Bildirim Yok
              </h3>

              <p className="text-sm text-slate-700 dark:text-slate-300 mb-[3px]">
                Bildirimleriniz burada görünecektir.
              </p>
            </div>
          </>
        )}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-3 flex items-center justify-between">
              <Link href="/settings/notifications">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground -ml-1"
                >
                  Bildirimleri Yönet
                </Button>
              </Link>
              <Link href="/notifications">
                <Button size="sm" className="rounded-[8px]">
                  Tüm Bildirimleri Görüntüle
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
