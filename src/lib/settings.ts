import {
  Activity,
  Bell,
  Cog,
  Coins,
  FileInput,
  FileLock2,
  KeySquare,
  Mail,
  SquareAsterisk,
  ToyBrick,
  User,
  Users2,
} from "lucide-react"

export const Settings = {
  user: [
    {
      title: "Profil",
      description:
        "Kullanıcı adınızı, e-posta adresinizi ve şifrenizi değiştirebilir ve en son giriş yaptığınız tarih ve IP adresi gibi detayları görüntüleyebilirsiniz.",
      icon: User,
      href: "/settings/profile",
    },
    {
      title: "Kasa",
      description:
        "Sunucular üzerindeki eklenti ayarlarını, şifrelerinizi ve yöneticiyseniz diğer kullanıcıların girdiği değerleri değiştirebilirsiniz.",
      icon: FileLock2,
      href: "/settings/vault",
    },
    {
      title: "Kişisel Erişim Anahtarları",
      description:
        "Kişisel erişim anahtarları oluşturarak Liman MYS'nin sağladığı dış API uçlarını kullanabilirsiniz.",
      icon: KeySquare,
      href: "/settings/access_tokens",
    },
  ],
  system: [
    {
      title: "Eklentiler",
      description:
        "Bu sayfa aracılığıyla sisteminizdeki eklentileri yönetebilir, sürümlerini güncelleyebilir ve yeni eklentiler yükleyebilirsiniz.",
      icon: ToyBrick,
      href: "/settings/extensions",
    },
    {
      title: "Kullanıcılar",
      description:
        "Bu sayfa aracılığıyla kullanıcılara roller ekleyebilir, kullanıcı profillerini düzenleyebilir ve yenilerini ekleyebilirsiniz.",
      icon: Users2,
      href: "/settings/users",
    },
    {
      title: "Roller",
      description:
        "Kullanıcıların erişim yetki seviyelerini detaylı şekilde gruplar ve kişiler bazında düzenleyebilirsiniz.",
      icon: FileInput,
      href: "/settings/roles",
    },
    {
      title: "E-Posta",
      description:
        "Sistemin e-posta gönderim ayarlarını bu sayfa üzerinden detaylı şekilde ayarlayabilir ve test edebilirsiniz.",
      icon: Mail,
      href: "/settings/mail",
    },
    {
      title: "Bildirimler",
      description:
        "Sisteme gönderilen bildirimlerin kaynaklarını ve gönderim zamanlamalarını bu sayfa üzerinden düzenleyebilirsiniz.",
      icon: Bell,
      href: "/settings/notifications",
    },
    {
      title: "Abonelikler",
      description:
        "Sistem ve eklenti aboneliklerinizi, yenilemelerinizi bu sayfa aracılığıyla gözlemleyebilirsiniz.",
      icon: Coins,
      href: "/settings/subscriptions",
    },
    {
      title: "Erişim",
      description:
        "Giriş yapılabilecek auth gatewayleri ayarlamanızı sağlar. Keycloak ve LDAP gibi auth gatewayleri bu sayfa üzerinden ayarlayabilirsiniz.",
      icon: SquareAsterisk,
      href: "/settings/auth_gateway",
    },
    {
      title: "Sağlık Durumu",
      description:
        "Liman Merkezi Yönetim Sistemi'nin sağlık durumunu görüntüleyebilir, güvenlik geliştirme önerilerini kolayca uygulayabilirsiniz.",
      icon: Activity,
      href: "/settings/health",
    },
    {
      title: "Gelişmiş Ayarlar",
      description:
        "Sistemin DNS ayarlarını, sertifika kurulumları ve log yönlendirme gibi değişiklikleri bu sayfa üzerinden yapabilirsiniz.",
      icon: Cog,
      href: "/settings/advanced",
    },
  ],
}
