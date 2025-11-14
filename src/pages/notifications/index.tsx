import { http } from "@/services"
import { addDays, format } from "date-fns"
import { de, enUS, tr } from "date-fns/locale"
import { BellOff, CalendarIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import PageHeader from "@/components/ui/page-header"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import StatusBadge, { Status } from "@/components/ui/status-badge"
import { INotification } from "@/types/notification"

export default function NotificationsPage() {
  const { t, i18n } = useTranslation(["common", "notifications"])
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [loading, setLoading] = useState(true)
  const [severity, setSeverity] = useState<string>("all_severities")
  const [date, setDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const localeMap = {
    tr,
    en: enUS,
    de,
  }

  const locale = localeMap[i18n.language as keyof typeof localeMap] || enUS

  const severityOptions: Status[] = ["critical", "high", "medium", "low", "trivial"]

  // Format date range for API query
  const formatDateForApi = (date: Date | undefined) => {
    if (!date) return undefined
    return format(date, "yyyy-MM-dd")
  }

  // Fetch notifications with filters
  useEffect(() => {
    setLoading(true)

    let queryParams = new URLSearchParams()

    if (severity && severity !== "all_severities") {
      queryParams.append("type", severity)
    }

    if (date.from) {
      queryParams.append("start_date", formatDateForApi(date.from)!)
    }

    if (date.to) {
      queryParams.append("end_date", formatDateForApi(date.to)!)
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

    http
      .get<INotification[]>(`/notifications${queryString}`)
      .then((response) => {
        setNotifications(response.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [severity, date.from, date.to])

  // Group notifications by day
  const notificationsByDay = useMemo(() => {
    const groups: Record<string, INotification[]> = {}

    notifications.forEach(notification => {
      const date = new Date(notification.send_at)
      const dateString = date.toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      if (!groups[dateString]) {
        groups[dateString] = []
      }

      groups[dateString].push(notification)
    })

    // Sort dates from newest to oldest
    return Object.entries(groups)
      .sort((a, b) => {
        return new Date(b[1][0].send_at).getTime() - new Date(a[1][0].send_at).getTime()
      })
  }, [notifications, i18n.language])

  return (
    <>
      <PageHeader
        title={t("notifications.title", { ns: "common" })}
        description={t("notifications.description", { ns: "common" })}
      />
      <div className="ml-3 p-5 pt-2">
        {/* Filter controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3 lg:w-1/4">
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder={t("notifications.filters.severity_placeholder", { ns: "notifications", defaultValue: "Filter by severity" })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_severities">
                  {t("all_severities", { ns: "notifications", defaultValue: "All severities" })}
                </SelectItem>
                {severityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center">
                      <StatusBadge status={option} />
                      <span className="ml-2">
                        {t(option, { ns: "notifications", defaultValue: option })}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/3 lg:w-1/4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  size="sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "PPP", { locale })} -{" "}
                        {format(date.to, "PPP", { locale })}
                      </>
                    ) : (
                      format(date.from, "PPP", { locale })
                    )
                  ) : (
                    <span>{t("date_range", { ns: "notifications", defaultValue: "Select date range" })}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  defaultMonth={date.from}
                  selected={{ from: date.from, to: date.to }}
                  onSelect={setDate as any}
                  numberOfMonths={2}
                  locale={locale}
                />
                <div className="flex items-center justify-between border-t p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDate({ from: undefined, to: undefined })}
                    disabled={!date.from && !date.to}
                  >
                    {t("clear", { ns: "notifications", defaultValue: "Clear" })}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDate({
                          from: today,
                          to: today,
                        })
                      }}
                    >
                      {t("today", { ns: "notifications", defaultValue: "Today" })}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDate({
                          from: addDays(today, -7),
                          to: today,
                        })
                      }}
                    >
                      {t("last_7_days", { ns: "notifications", defaultValue: "Last 7 days" })}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[30vh] w-full items-center justify-center">
            <Icons.spinner className="ml-2 size-12 shrink-0 animate-spin" />
          </div>
        ) : notificationsByDay.length > 0 ? (
          <div className="space-y-8">
            {notificationsByDay.map(([day, dayNotifications]) => (
              <Card key={day} className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-3">
                  <CardTitle className="text-base font-medium">{day}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ol className="relative">
                    {dayNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.notification_id}
                        notification={notification}
                      />
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-3">
            <BellOff className="size-10 text-muted-foreground" />
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-semibold text-muted-foreground">
                {t("notifications.empty.title", { ns: "notifications", defaultValue: "Bildirim yok" })}
              </h5>
              <span className="text-sm font-medium text-muted-foreground">
                {t("notifications.empty.description", { ns: "notifications", defaultValue: "Sistemde yeni bildirim bulunamadı." })}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function NotificationItem({ notification }: { notification: INotification }) {
  const { t, i18n } = useTranslation()

  return (
    <li
      className="py-4 px-6 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
      id={`notification-${notification.notification_id}`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <StatusBadge status={notification.level as Status} />
            <span className="text-xs font-medium text-muted-foreground">
              {t(notification.level, { ns: "notifications" })}
            </span>
          </div>

          <div className="flex flex-col mt-1">
            <h3 className="text-base font-medium tracking-tight">
              {notification.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.content}
            </p>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <time>
              {new Date(notification.send_at).toLocaleTimeString(i18n.language, {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </time>
          </div>
        </div>
      </div>
    </li>
  )
}
