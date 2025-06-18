import {
  Activity,
  Award,
  Bell,
  BookKey,
  CloudCog,
  Cog,
  Coins,
  FileInput,
  FileLock2,
  FolderGit2,
  KeySquare,
  Mail,
  ScanFace,
  ScrollText,
  SquareAsterisk,
  ToyBrick,
  User,
  Users2,
} from "lucide-react"

export const Settings = {
  user: [
    {
      id: "profile",
      title: "Profil",
      description:
        "Kullanıcı adınızı, e-posta adresinizi ve şifrenizi değiştirebilir ve en son giriş yaptığınız tarih ve IP adresi gibi detayları görüntüleyebilirsiniz.",
      icon: User,
      href: "/settings/profile",
    },
    {
      id: "vault",
      title: "Kasa",
      description:
        "Sunucular üzerindeki eklenti ayarlarını, şifrelerinizi ve yöneticiyseniz diğer kullanıcıların girdiği değerleri değiştirebilirsiniz.",
      icon: FileLock2,
      href: "/settings/vault",
    },
    {
      id: "tokens",
      title: "Kişisel Erişim Anahtarları",
      description:
        "Kişisel erişim anahtarları oluşturarak Liman MYS'nin sağladığı dış API uçlarını kullanabilirsiniz.",
      icon: KeySquare,
      href: "/settings/tokens",
    },
  ],
  system: [
    {
      id: "extensions",
      title: "Eklentiler",
      description:
        "Bu sayfa aracılığıyla sisteminizdeki eklentileri yönetebilir, sürümlerini güncelleyebilir ve yeni eklentiler yükleyebilirsiniz.",
      icon: ToyBrick,
      href: "/settings/extensions",
    },
    {
      id: "users",
      title: "Kullanıcılar",
      description:
        "Bu sayfa aracılığıyla kullanıcılara roller ekleyebilir, kullanıcı profillerini düzenleyebilir ve yenilerini ekleyebilirsiniz.",
      icon: Users2,
      href: "/settings/users",
    },
    {
      id: "roles",
      title: "Roller",
      description:
        "Kullanıcıların erişim yetki seviyelerini detaylı şekilde gruplar ve kişiler bazında düzenleyebilirsiniz.",
      icon: FileInput,
      href: "/settings/roles",
    },
    {
      id: "email",
      title: "E-Posta",
      description:
        "Sistemin e-posta gönderim ayarlarını bu sayfa üzerinden detaylı şekilde ayarlayabilir ve test edebilirsiniz.",
      icon: Mail,
      href: "/settings/mail",
    },
    {
      id: "external_notifications",
      title: "Dış Bildirimler",
      description:
        "Eklenti sunucularının ve dış uygulamaların Liman'a bildirim göndermesini IP kısıtı koyarak sağlayabilirsiniz.",
      icon: Bell,
      href: "/settings/external_notifications",
    },
    {
      id: "subscriptions",
      title: "Abonelikler",
      description:
        "Sistem ve eklenti aboneliklerinizi, yenilemelerinizi bu sayfa aracılığıyla gözlemleyebilirsiniz.",
      icon: Coins,
      href: "/settings/subscriptions",
    },
    {
      id: "access",
      title: "Erişim",
      description:
        "Giriş yapılabilecek giriş araçlarını ayarlamanızı sağlar. Keycloak ve LDAP girişlerini bu sayfa üzerinden ayarlayabilirsiniz.",
      icon: SquareAsterisk,
      href: "/settings/access/audit",
      children: [
        {
          id: "audit",
          title: "Audit",
          href: "/settings/access/audit",
          icon: ScrollText,
        },
        {
          id: "ldap",
          title: "LDAP",
          href: "/settings/access/ldap",
          icon: FolderGit2,
        },
        {
          id: "permissions_ldap",
          title: "Permissions",
          href: "/settings/access/permissions_ldap",
          icon: ScanFace,
          requiresLdap: true,
        },
        {
          id: "keycloak",
          title: "Keycloak",
          href: "/settings/access/keycloak",
          icon: BookKey,
        },
        {
          id: "oidc",
          title: "OIDC",
          href: "/settings/access/oidc",
          icon: BookKey,
        },
      ],
    },
    {
      id: "health",
      title: "Sağlık Durumu",
      description:
        "Liman Merkezi Yönetim Sistemi'nin sağlık durumunu görüntüleyebilir, güvenlik geliştirme önerilerini kolayca uygulayabilirsiniz.",
      icon: Activity,
      href: "/settings/health",
    },
    {
      id: "advanced",
      title: "Gelişmiş Ayarlar",
      description:
        "Sistemin DNS ayarlarını, sertifika kurulumları ve log yönlendirme gibi değişiklikleri bu sayfa üzerinden yapabilirsiniz.",
      icon: Cog,
      href: "/settings/advanced/certificates",
      children: [
        {
          id: "certificates",
          title: "Sertifikalar",
          href: "/settings/advanced/certificates",
          icon: Award,
        },
        {
          id: "dns",
          title: "DNS",
          href: "/settings/advanced/dns",
          icon: CloudCog,
        },
        {
          id: "log_rotation",
          title: "Log Rotasyonu",
          href: "/settings/advanced/log_rotation",
          icon: ScrollText,
        },
        {
          id: "tweaks",
          title: "Tweaks",
          href: "/settings/advanced/tweaks",
          icon: Cog,
        },
      ],
    },
  ],
}
