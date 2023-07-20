import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { CheckCircle } from "lucide-react"

import { IExtension } from "@/types/extension"
import { ILimanSubscription } from "@/types/subscription"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import SubscriptionCard from "@/components/settings/subscription-card"

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(false)
  const [limanSubscription, setLimanSubscription] =
    useState<ILimanSubscription>({} as ILimanSubscription)

  const fetchData = () => {
    setLoading(true)

    apiService
      .getInstance()
      .get("/settings/subscriptions")
      .then((response) => {
        if (response.status === 200) {
          setData(response.data)
        }
      })
      .catch((err) => {
        if (err.response.status === 404) setSubscriptionStatus(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()

    apiService
      .getInstance()
      .get("/settings/subscriptions/liman")
      .then((response) => {
        setLimanSubscription(response.data)
        setSubscriptionStatus(true)
      })
      .catch((err) => {
        // Do nothing
      })
  }, [])

  const getPercentageOfUsedDays = () => {
    const totalDays =
      (limanSubscription.coverage_end - limanSubscription.coverage_start) /
      (1000 * 60 * 60 * 24)
    const usedDays =
      (Date.now() - limanSubscription.coverage_start) / (1000 * 60 * 60 * 24)
    return (totalDays / (totalDays - usedDays)) * 100
  }

  return (
    <div className="h-full flex-1 flex-col p-8 md:flex">
      <div className="mb-8 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Abonelikler</h2>
          <p className="text-muted-foreground">
            Sistem ve eklenti aboneliklerinizi, yenilemelerinizi bu sayfa
            aracılığıyla gözlemleyebilirsiniz.
          </p>
        </div>
      </div>

      <h3 className="mb-5 text-xl font-bold tracking-tight">
        Liman Destek Aboneliği
      </h3>

      <Card className="mb-10">
        {subscriptionStatus && (
          <div className="flex items-center gap-16">
            <div className="flex flex-col gap-5 p-6">
              <div className="item">
                <h4 className="text-2xl font-bold tracking-tight">
                  Üye Numarası
                </h4>
                <span className="text-foreground/70">
                  {limanSubscription.issued_no}
                </span>
              </div>
              <div className="item">
                <h4 className="text-2xl font-bold tracking-tight">Üye</h4>
                <span className="text-foreground/70">
                  {limanSubscription.issued}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5 p-6">
              <div className="item">
                <h4 className="text-2xl font-bold tracking-tight">
                  Üyelik Türü
                </h4>
                <span className="text-foreground/70">
                  {limanSubscription.package_type}
                </span>
              </div>
              <div className="item">
                <h4 className="text-2xl font-bold tracking-tight">
                  Üyelik Başlangıç Tarihi
                </h4>
                <span className="text-foreground/70">
                  {new Date(
                    limanSubscription.membership_start_time
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="radial min-w-[180px] border-l py-3 pl-6">
              <div
                className="radial-progress min-w-[180px]"
                style={
                  {
                    "--value": getPercentageOfUsedDays(),
                    color: getPercentageOfUsedDays() < 6 && "red",
                    "--size": "180px",
                  } as any
                }
              >
                <b className="font-semibold">
                  {Math.floor(getPercentageOfUsedDays())}%
                </b>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-6">
              <div className="item">
                <h4 className="text-2xl font-bold tracking-tight">
                  Destek Süresi
                </h4>
                <span className="text-foreground/70">
                  {new Date(
                    limanSubscription.coverage_start
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(
                    limanSubscription.coverage_end
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="item">
                <h4 className="text-2xl font-bold tracking-tight">
                  Kalan Gün Sayısı
                </h4>
                <span className="text-foreground/70">
                  {Math.floor(
                    (limanSubscription.coverage_end - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
        {!subscriptionStatus && (
          <div className="my-16 flex flex-col items-center justify-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h5 className="mb-1 font-semibold tracking-tight">
              Açık kaynak destek paketini kullanıyorsunuz.
            </h5>
          </div>
        )}
      </Card>

      <h3 className="mb-5 text-xl font-bold tracking-tight">
        Eklenti Abonelikleri
      </h3>
      <div className="grid grid-cols-2 gap-8">
        {loading && <Skeleton />}
        {!loading &&
          data.map((extension) => (
            <SubscriptionCard key={extension.id} extension={extension} />
          ))}
      </div>
    </div>
  )
}
