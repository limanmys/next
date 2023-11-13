import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { BellOff } from "lucide-react"
import { useTranslation } from "react-i18next"

import { INotification } from "@/types/notification"
import PageHeader from "@/components/ui/page-header"
import StatusBadge, { Status } from "@/components/ui/status-badge"

export default function NotificationsPage() {
  const { t } = useTranslation("common")
  const [notifications, setNotifications] = useState<INotification[]>([])

  useEffect(() => {
    apiService
      .getInstance()
      .get<INotification[]>("/notifications")
      .then((response) => {
        setNotifications(response.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("notifications.title")}
        description={t("notifications.description")}
      />
      <div className="ml-3 p-8 pt-2">
        <ol className="relative border-l">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.notification_id}
              notification={notification}
            />
          ))}
        </ol>

        {notifications.length === 0 && (
          <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-3">
            <BellOff className="h-10 w-10 text-muted-foreground" />
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-semibold text-muted-foreground">
                Bildirim yok
              </h5>
              <span className="text-sm font-medium text-muted-foreground">
                Sistemde yeni bildirim bulunamadı.
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function NotificationItem({ notification }: { notification: INotification }) {
  const { i18n } = useTranslation()

  return (
    <li
      className="mb-10 ml-6"
      id={`notification-${notification.notification_id}`}
    >
      <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white dark:bg-blue-900 dark:ring-gray-900"></span>
      <time className="text-sm font-normal leading-none text-muted-foreground">
        {new Date(notification.send_at).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
      <div className="mt-4 items-end justify-between rounded-lg border bg-background p-4 shadow-sm sm:flex">
        <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
          <StatusBadge status={notification.level as Status} />{" "}
          {notification.send_at_humanized}
        </time>
        <div className="">
          <h3 className="mb-2 font-semibold tracking-tight">
            {notification.title}
          </h3>

          <p className="text-sm font-medium text-muted-foreground">
            {notification.content}
          </p>
        </div>
      </div>
    </li>
  )
}
