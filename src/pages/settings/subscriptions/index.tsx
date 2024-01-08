import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { CheckCircle, Plus, PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IExtension } from "@/types/extension"
import { ILimanSubscription } from "@/types/subscription"
import { useEmitter } from "@/hooks/useEmitter"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import SubscriptionCard from "@/components/settings/subscription-card"

export default function SubscriptionPage() {
  const { t } = useTranslation("settings")
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<IExtension[]>([])
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(false)
  const [limanSubscription, setLimanSubscription] =
    useState<ILimanSubscription>({} as ILimanSubscription)
  const [open, setOpen] = useState<boolean>(false)
  const emitter = useEmitter()

  const fetchLimanSubscription = () => {
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
  }

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
    fetchLimanSubscription()

    emitter.on("LIMAN_SUBSCRIPTION_REFRESH", () => {
      fetchLimanSubscription()
    })

    return () => {
      emitter.off("LIMAN_SUBSCRIPTION_REFRESH")
    }
  }, [])

  const getPercentageOfUsedDays = () => {
    const totalDays =
      (limanSubscription.coverage_end - limanSubscription.coverage_start) /
      (1000 * 60 * 60 * 24)
    const usedDays =
      (Date.now() - limanSubscription.coverage_start) / (1000 * 60 * 60 * 24)

    // Calculate how much days spent
    return 100 - (usedDays / totalDays) * 100
  }

  return (
    <>
      <PageHeader
        title={t("subscriptions.title")}
        description={t("subscriptions.description")}
      />
      <div className="h-full flex-1 flex-col p-8 pt-0 md:flex">
        <h3 className="mb-5 text-xl font-bold tracking-tight">
          {t("subscriptions.liman")}
        </h3>

        <Card className="mb-10">
          {subscriptionStatus && getPercentageOfUsedDays() > 0 && (
            <div className="flex items-center gap-16">
              <div className="flex flex-col gap-5 p-6">
                <div className="item">
                  <h4 className="text-2xl font-bold tracking-tight">
                    {t("subscriptions.issued_no")}
                  </h4>
                  <span className="text-foreground/70">
                    {limanSubscription.issued_no}
                  </span>
                </div>
                <div className="item">
                  <h4 className="text-2xl font-bold tracking-tight">
                    {t("subscriptions.issued")}
                  </h4>
                  <span className="text-foreground/70">
                    {limanSubscription.issued}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5 p-6">
                <div className="item">
                  <h4 className="text-2xl font-bold tracking-tight">
                    {t("subscriptions.package_type")}
                  </h4>
                  <span className="text-foreground/70">
                    {limanSubscription.package_type}
                  </span>
                </div>
                <div className="item">
                  <h4 className="text-2xl font-bold tracking-tight">
                    {t("subscriptions.start_time")}
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
                    {t("subscriptions.support")}
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
                    {t("subscriptions.remaining")}
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
          {(!subscriptionStatus || getPercentageOfUsedDays() < 0) && (
            <div className="my-16 flex flex-col items-center justify-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h5 className="mb-1 font-semibold tracking-tight">
                {t("subscriptions.open_source_warning")}
              </h5>
              <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />{" "}
                {t("subscriptions.add_license")}
              </Button>
              <LimanLicense open={open} setOpen={setOpen} />
            </div>
          )}
        </Card>

        {data.length > 0 && (
          <h3 className="mb-5 text-xl font-bold tracking-tight">
            {t("subscriptions.extension")}
          </h3>
        )}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading && <Skeleton />}
          {!loading &&
            data.map((extension) => (
              <SubscriptionCard key={extension.id} extension={extension} />
            ))}
        </div>
      </div>
    </>
  )
}

function LimanLicense({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { t } = useTranslation("settings")
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string>("")
  const emitter = useEmitter()

  const handleCreate = () => {
    setLoading(true)

    apiService
      .getInstance()
      .post(`/settings/subscriptions/liman`, {
        license: data,
      })
      .then(() => {
        emitter.emit("LIMAN_SUBSCRIPTION_REFRESH")
        toast({
          title: t("success"),
          description: t("subscriptions.license_dialog.success"),
        })
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("subscriptions.license_dialog.error"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("subscriptions.license_dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("subscriptions.license_dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="license">
            {t("subscriptions.license_dialog.license")}
          </Label>
          <Textarea
            id="license"
            onChange={(e) => setData(e.target.value)}
            maxLength={750}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            {t("subscriptions.license_dialog.cancel")}
          </Button>
          <Button disabled={loading} onClick={() => handleCreate()}>
            {!loading ? (
              <PlusCircle className="mr-2 h-4 w-4" />
            ) : (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("subscriptions.license_dialog.ok")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
