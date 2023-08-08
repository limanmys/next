import { useRouter } from "next/router"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import PageHeader from "@/components/ui/page-header"

export default function TokensPage() {
  const router = useRouter()

  return (
    <>
      <PageHeader
        title="Kişisel Erişim Anahtarları"
        description="Kişisel erişim anahtarları oluşturarak Liman MYS'nin sağladığı dış API uçlarını kullanabilirsiniz."
      />

      <div
        className="container mx-auto flex items-center px-6 py-12"
        style={{ height: "calc(var(--container-height) - 30vh)" }}
      >
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <Icons.dugumluLogo className="w-18 mb-10 h-12" />
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Bir hata oluştu
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Bu sayfa henüz geliştirilmedi.
          </p>
          <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
            <Button onClick={() => router.back()} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri dön
            </Button>
            <Button
              onClick={() => router.push("/")}
              size="sm"
              className="px-4"
              variant="secondary"
            >
              Panoya git
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
