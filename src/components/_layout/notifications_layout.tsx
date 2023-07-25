import { BellPlus, Mails } from "lucide-react"

import AccessCard from "../settings/access-card"

export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const access = [
    {
      id: "external",
      icon: BellPlus,
      title: "Dış Bildirimler",
      description:
        "Eklenti sunucularının ve dış uygulamaların Liman'a bildirim göndermesini sağlayabilirsiniz.",
      href: `/settings/notifications/external`,
      enabled: true,
    },
    {
      id: "mail",
      icon: Mails,
      title: "Mail Bildirimleri",
      description:
        "Zamanlanmış mail bildirimi ayarlarını bu sayfa aracılığı ile yapabilirsiniz.",
      href: `/settings/notifications/mail`,
      enabled: true,
    },
  ]

  return (
    <div
      className="grid grid-cols-4"
      style={{
        height: "var(--container-height)",
      }}
    >
      <div className="col-span-1 border-r">
        <div className="flex items-center border-b p-8 text-2xl font-bold">
          Bildirimler
        </div>
        {access.map((r) => (
          <AccessCard
            title={r.title}
            description={r.description}
            icon={r.icon}
            href={r.href}
            key={r.id}
            enabled={r.enabled}
          />
        ))}
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  )
}
