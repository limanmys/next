import { http } from "@/services"
import Cookies from "js-cookie"
import Echo from "laravel-echo"
import { Bell, BellOff, CheckCheck } from "lucide-react"
import Link from "next/link"
import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button, buttonVariants } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { cn } from "@/lib/utils"
import { INotification } from "@/types/notification"

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
  const { sendNotification } = useNotification()
  const user = useCurrentUser()
  const { t, i18n } = useTranslation("common")

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
          http.post("/notifications/seen", {
            notification_id: notification.notification_id,
          })
        }
      })
    }, 1000)
  }

  useEffect(() => {
    const currentUser = Cookies.get("currentUser")
    let tempNotifications: INotification[] = []

    http
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
      wsHost: window.location.host,
      wssPort: 443,
      disableStats: true,
      encrypted: true,
      enabledTransports: ["ws", "wss"],
      disabledTransports: ["sockjs", "xhr_polling", "xhr_streaming"],

      authEndpoint: "/api/broadcasting/auth",

      auth: {
        headers: {
          Accept: "application/json",
        },
      },
      pusher: Pusher,
    })

    echo
      .private(`App.Models.User.${JSON.parse(currentUser).user.id}`)
      .notification((notification: INotification) => {
        setNotifications([notification, ...tempNotifications])

        tempNotifications = JSON.parse(
          JSON.stringify([notification, ...tempNotifications])
        )

        beep()

        sendNotification(notification)

        markAsSeen([notification])
      })

    return () => {
      echo.leave(`App.Models.User.${JSON.parse(currentUser).user.id}`)
      echo.disconnect()
    }
  }, [])

  const handleMarkAsRead = () => {
    http
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
          <Bell className="size-5" />
          <span className="sr-only">Notifications</span>
          {
            getNotSeenNotificationCount() > 0 &&
            <Badge className="absolute right-0 top-0 rounded-full px-[4px] py-[2px] text-[11px] leading-[11px]" >
              {getNotSeenNotificationCount()}
            </Badge>
          }
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-[500px]">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold tracking-tight">
            {t("notifications.title")}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="-mr-2 text-sm text-blue-500"
            disabled={notifications.length === 0}
            onClick={() => handleMarkAsRead()}
          >
            <CheckCheck className="mr-2 size-5" />{" "}
            {t("notifications.mark_all_as_read")}
          </Button>
        </div>
        <div className="flex flex-col gap-3 p-2">
          {notifications.map((notification) => (
            <Link
              href={`/notifications#notification-${notification.notification_id}`}
              key={notification.notification_id}
            >
              <div className="relative flex flex-col gap-1 rounded p-2 transition-all hover:bg-accent/50 hover:text-accent-foreground">
                <h3 className="text-[15px] font-semibold tracking-tight">
                  {notification.title}
                </h3>

                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {notification.content}
                </p>

                <div className="absolute right-2 top-1">
                  <StatusBadge status={notification.level as Status} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-700 dark:text-slate-400">
                    {new Date(notification.send_at).toLocaleDateString(
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
            <div className="flex flex-col items-center justify-center p-2 py-8">
              <BellOff className="mb-5 size-8 text-slate-800 dark:text-slate-300" />

              <h3 className="text-md mb-1 font-semibold tracking-tight">
                {t("notifications.empty")}
              </h3>

              <p className="mb-[3px] text-sm text-slate-700 dark:text-slate-300">
                {t("notifications.empty_message")}
              </p>
            </div>
          </>
        )}
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between p-3">
          {user.status === 1 ? (
            <Link href="/settings/external_notifications">
              <Button
                size="sm"
                variant="ghost"
                className="-ml-1 text-muted-foreground"
              >
                {t("notifications.manage")}
              </Button>
            </Link>
          ) : (
            <div></div>
          )}

          <Link href="/notifications">
            <Button size="sm" className="rounded-[8px]">
              {t("notifications.show_all")}
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
