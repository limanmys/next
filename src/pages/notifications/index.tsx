import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { BellOff } from "lucide-react"

import { INotification } from "@/types/notification"
import PageHeader from "@/components/ui/page-header"
import StatusBadge, { Status } from "@/components/ui/status-badge"

export default function NotificationsPage() {
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
        title="Bildirimler"
        description="Geçmişe dönük okuduğunuz tüm bildirimleri bu sayfa aracılığı ile görüntüleyebilirsiniz."
      />
      <div className="pt-2 p-8 ml-3">
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
  return (
    <li
      className="mb-10 ml-6"
      id={`notification-${notification.notification_id}`}
    >
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
      <time className="text-sm font-normal leading-none text-muted-foreground">
        {new Date(notification.send_at).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
      <div className="items-end justify-between p-4 bg-background border rounded-lg shadow-sm sm:flex mt-4">
        <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
          <StatusBadge status={notification.level as Status} />{" "}
          {notification.send_at_humanized}
        </time>
        <div className="">
          <h3 className="font-semibold tracking-tight mb-2">
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
