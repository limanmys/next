import { ToastProvider } from "@radix-ui/react-toast"
import { useTranslation } from "react-i18next"

import {
  Notification,
  NotificationClose,
  NotificationViewport,
} from "@/components/ui/notification"
import { INotification } from "@/types/notification"

import StatusBadge, { Status } from "./status-badge"
import { useNotification } from "./use-notification"

export function NotificationCreator() {
  const { toasts } = useNotification()
  const { i18n } = useTranslation()

  return (
    <ToastProvider>
      {Array.from(new Map(toasts.map(toast => [toast.notification_id, toast])).values()).map(function (props: INotification) {
        return (
          <Notification key={props.notification_id}>
            <div className="relative flex w-full flex-col gap-1">
              <h3 className="text-[15px] font-semibold tracking-tight">
                {props.title}
              </h3>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {props.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-700 dark:text-slate-400">
                  {new Date(props.send_at).toLocaleDateString(i18n.language, {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <span className="text-xs text-slate-500">
                  <StatusBadge status={props.level as Status} />{" "}
                  {props.send_at_humanized}
                </span>
              </div>
            </div>
            <NotificationClose />
          </Notification>
        )
      })}
      <NotificationViewport />
    </ToastProvider>
  )
}
