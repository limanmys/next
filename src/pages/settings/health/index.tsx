import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import {
  ExternalLink,
  Lock,
  Network,
  RefreshCw,
  ServerCrash,
  User2,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { IHealthCheck } from "@/types/health"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Loading from "@/components/ui/loading"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"

function HealthStatus({ status }: { status: boolean }) {
  const { t } = useTranslation("settings")

  return (
    <div className="ml-2 flex items-center">
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          status ? "bg-green-500" : "bg-orange-500"
        }`}
      ></span>
      <span className="text-muted-foreground">
        {status ? t("ok") : t("warning")}
      </span>
    </div>
  )
}

export default function HealthPage() {
  const router = useRouter()
  const { t } = useTranslation("settings")

  const [data, setData] = useState<IHealthCheck>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/health")
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        //
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const { toast } = useToast()

  const manualSync = () => {
    apiService
      .getInstance()
      .post("/settings/health/manual_high_availability_sync")
      .then(() => {
        toast({
          title: t("success"),
          description: t("health.manual_sync_success"),
        })
      })
  }

  return (
    <>
      <PageHeader
        title={t("health.title")}
        description={t("health.description")}
      />

      {loading && <Loading />}
      {!loading && data && (
        <section className="flex flex-col gap-5 p-8 pt-3">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User2 className="h-6 w-6" />{" "}
                    {t("health.admin_account_title")}{" "}
                    <HealthStatus status={data.admin_account} />
                  </div>
                  <Link href="/settings/users">
                    <Button size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />{" "}
                      {t("health.go_to_user_settings")}
                    </Button>
                  </Link>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>{t("health.admin_account_description")}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Network className="h-6 w-6" />{" "}
                    {t("health.dns_check_title")}{" "}
                    <HealthStatus status={data.dns_check} />
                  </div>
                  <Link href="/settings/advanced/dns">
                    <Button size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />{" "}
                      {t("health.go_to_dns_settings")}
                    </Button>
                  </Link>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>{t("health.dns_check_description")}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6" /> {t("health.ssl_check_title")}{" "}
                  <HealthStatus status={data.ssl_check} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>{t("health.ssl_check_description")}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6" /> {t("health.ssl_self_title")}{" "}
                  <HealthStatus status={data.self_signed} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>{t("health.ssl_self_description")}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ServerCrash className="h-6 w-6" />{" "}
                    {t("health.high_availability_service_title")}{" "}
                    <HealthStatus status={data.high_availability_service} />
                  </div>

                  <Button size="sm" onClick={() => manualSync()}>
                    <RefreshCw className="mr-2 h-4 w-4" />{" "}
                    {t("health.manual_sync")}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {t("health.high_availability_service_description")}
            </CardContent>
          </Card>
        </section>
      )}
    </>
  )
}
