import { http } from "@/services"
import {
  ExternalLink,
  Lock,
  Network,
  RefreshCw,
  ServerCrash,
  User2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Loading from "@/components/ui/loading"
import PageHeader from "@/components/ui/page-header"
import { useToast } from "@/components/ui/use-toast"
import { IHealthCheck } from "@/types/health"

function HealthStatus({ status }: { status: boolean }) {
  const { t } = useTranslation("settings")

  return (
    <div className="ml-2 flex items-center">
      <span
        className={`mr-2 size-2 rounded-full ${status ? "bg-green-500" : "bg-orange-500"
          }`}
      ></span>
      <span className="text-muted-foreground">
        {status ? t("ok") : t("warning")}
      </span>
    </div>
  )
}

export default function HealthPage() {
  const { t } = useTranslation("settings")

  const [data, setData] = useState<IHealthCheck>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    http
      .get("/settings/health")
      .then((response) => {
        setData(response.data)
      })
      .catch(() => {
        //
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const { toast } = useToast()

  const manualSync = () => {
    http
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
                    <User2 className="size-6" />{" "}
                    {t("health.admin_account_title")}{" "}
                    <HealthStatus status={data.admin_account} />
                  </div>
                  <Link href="/settings/users">
                    <Button size="sm">
                      <ExternalLink className="mr-2 size-4" />{" "}
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
                    <Network className="size-6" /> {t("health.dns_check_title")}{" "}
                    <HealthStatus status={data.dns_check} />
                  </div>
                  <Link href="/settings/advanced/dns">
                    <Button size="sm">
                      <ExternalLink className="mr-2 size-4" />{" "}
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
                  <Lock className="size-6" /> {t("health.ssl_check_title")}{" "}
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
                  <Lock className="size-6" /> {t("health.ssl_self_title")}{" "}
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
                    <ServerCrash className="size-6" />{" "}
                    {t("health.high_availability_service_title")}{" "}
                    <HealthStatus status={data.high_availability_service} />
                  </div>

                  <Button size="sm" onClick={() => manualSync()}>
                    <RefreshCw className="mr-2 size-4" />{" "}
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
