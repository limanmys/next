import { Award, CloudCog, Cog, ScrollText } from "lucide-react"

import AccessCard from "../settings/access-card"

export default function AdvancedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const advanced = [
    {
      id: "certificates",
      icon: Award,
      title: "Sertifikalar",
      description:
        "Liman sunucusunun kabul edeceği sertifikaları buradan ekleyebilirsiniz.",
      href: `/settings/advanced/certificates`,
      enabled: true,
    },
    {
      id: "dns",
      icon: CloudCog,
      title: "DNS Ayarları",
      description:
        "Liman'ın bağlanacağı uçları ve aktif dizin sunucuları çözmesini sağlayan DNS ayarlarını buradan yapabilirsiniz.",
      href: `/settings/advanced/dns`,
      enabled: true,
    },
    {
      id: "log_rotation",
      icon: ScrollText,
      title: "Log Yönlendirme",
      description:
        "Liman'ın önemli sistem loglarını ve mesajlarını rsyslog aracılığı ile yönlendirmenizi sağlar.",
      href: `/settings/advanced/log_rotation`,
      enabled: true,
    },
    {
      id: "tweaks",
      icon: Cog,
      title: "İnce Ayarlar",
      description:
        "Liman ile ilgili ince ayarları bu sayfadan değiştirebilirsiniz.",
      href: `/settings/advanced/tweaks`,
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
          Gelişmiş Ayarlar
        </div>
        {advanced.map((r) => (
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
