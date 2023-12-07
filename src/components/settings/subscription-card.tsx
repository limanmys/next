import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { MoreHorizontal, PlusCircle, Send, Server, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IExtension } from "@/types/extension"
import { IServer } from "@/types/server"
import { ISubscription } from "@/types/subscription"
import { useEmitter } from "@/hooks/useEmitter"

import { Button, buttonVariants } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Icons } from "../ui/icons"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

export default function SubscriptionCard({
  extension,
}: {
  extension: IExtension
}) {
  const { t } = useTranslation("settings")
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ISubscription>({} as ISubscription)
  const [licenseDialog, setLicenseDialog] = useState<boolean>(false)
  const [servers, setServers] = useState<IServer[]>()
  const [selectedServer, setSelectedServer] = useState<string>("")
  const [serverLoading, setServerLoading] = useState<boolean>(true)
  const emitter = useEmitter()

  const fetchData = (server_id: string) => {
    setLoading(true)

    apiService
      .getInstance()
      .get(`/settings/subscriptions/${extension.id}/${server_id}`)
      .then((response) => {
        setData(response.data)
      })
      .catch(() => {
        setData({} as ISubscription)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const calculateRemaining = (timestamp: number) => {
    // Gets the timestamp and finds the percentage of remaining year from now
    const now = new Date().getTime()
    const remaining = timestamp - now
    const percentage = remaining / 31536000000

    return 100 - percentage
  }

  const calculateRemainingDays = (timestamp: number) => {
    // Get timestamp and calculate remaining days from now
    const now = new Date().getTime()
    const remaining = timestamp - now
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))

    return days
  }

  useEffect(() => {
    setServerLoading(true)

    apiService
      .getInstance()
      .get<IServer[]>(`/settings/subscriptions/${extension.id}/servers`)
      .then((res) => {
        setServers(res.data)
        res.data[0] && setSelectedServer(res.data[0].id)
        if (!res.data[0]) {
          setData({ valid: false } as ISubscription)
          setLoading(false)
        }
        setTimeout(() => {
          setServerLoading(false)
        }, 500)
      })
      .catch(() => {
        setServers([])
      })
  }, [])

  useEffect(() => {
    if (extension && extension.id && selectedServer) {
      fetchData(selectedServer)
      emitter.on("SUBSCRIPTION_REFRESH_" + extension.id, () =>
        fetchData(selectedServer)
      )
    }

    return () => {
      emitter.off("SUBSCRIPTION_REFRESH_" + extension.id)
    }
  }, [extension, selectedServer])

  return (
    <Card>
      <CardHeader className="-mt-3 flex flex-row items-center justify-between">
        <CardTitle>{extension.display_name}</CardTitle>
        <div className="flex gap-5">
          {!serverLoading && (
            <>
              {servers && servers.length > 0 && (
                <Select
                  onValueChange={(value) => setSelectedServer(value)}
                  defaultValue={selectedServer}
                >
                  <SelectTrigger className="h-18 w-[200px]">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <SelectValue
                      placeholder={t(
                        "subscriptions.subcard.server.placeholder"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        {t("subscriptions.subcard.server.label")}
                      </SelectLabel>
                      {servers &&
                        servers.length > 0 &&
                        servers.map((server) => (
                          <SelectItem key={server.id} value={server.id}>
                            {server.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </>
          )}
          {serverLoading && (
            <Skeleton className="h-18 w-[200px] rounded-full" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger disabled={!selectedServer} asChild>
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">
                  {t("subscriptions.subcard.subscription_settings")}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                {t("subscriptions.subcard.subscription_settings")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  window.open("mailto:aciklab@havelsan.com.tr", "_blank")
                }
              >
                <Send className="mr-2 h-4 w-4" />{" "}
                {t("subscriptions.subcard.renew")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLicenseDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />{" "}
                {t("subscriptions.subcard.add_license")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <>
          {loading && (
            <div className="flex gap-12">
              <div className="part">
                <h5 className="mb-3 font-semibold tracking-tight">
                  {t("subscriptions.subcard.remaining")}
                </h5>
                <div className="flex items-center gap-5">
                  <Skeleton className="h-20 w-20 rounded-full" />

                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </span>
                    <small className="text-foreground/60">
                      {t("subscriptions.subcard.days_remaining")}
                    </small>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="part">
                  <h5 className="mb-1 font-semibold tracking-tight">
                    {t("subscriptions.subcard.issuer")}
                  </h5>
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div>

                <div className="part">
                  <h5 className="mb-1 font-semibold tracking-tight">
                    {t("subscriptions.subcard.allowed_device_count")}
                  </h5>
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
              </div>
            </div>
          )}
          {!loading && (
            <>
              {data.valid && (
                <div className="flex gap-12">
                  <div className="part">
                    <h5 className="mb-3 font-semibold tracking-tight">
                      {t("subscriptions.subcard.remaining")}
                    </h5>
                    <div className="flex items-center gap-5">
                      {data.type !== "php" && (
                        <div
                          className="radial-progress "
                          style={
                            {
                              "--value": calculateRemaining(data.timestamp),
                              color:
                                calculateRemaining(data.timestamp) < 6 &&
                                "red!important",
                            } as any
                          }
                        >
                          <b className="font-semibold">
                            {Math.floor(calculateRemaining(data.timestamp))}%
                          </b>
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-3xl font-bold">
                          {data.type != "php"
                            ? calculateRemainingDays(data.timestamp)
                            : data.timestamp}
                        </span>
                        <small className="text-foreground/60">
                          {t("subscriptions.subcard.days_remaining")}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="part">
                      <h5 className="mb-1 font-semibold tracking-tight">
                        {t("subscriptions.subcard.issuer")}
                      </h5>
                      {data.owner}
                    </div>

                    <div className="part">
                      <h5 className="mb-1 font-semibold tracking-tight">
                        {t("subscriptions.subcard.allowed_device_count")}
                      </h5>
                      {data.type === "php" ? data.functions : data.client_count}
                    </div>
                  </div>
                </div>
              )}
              {!data.valid && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <XCircle className="h-12 w-12 text-red-500" />
                  <h5 className="mb-1 font-semibold tracking-tight">
                    {t("subscriptions.subcard.no_sub")}
                  </h5>
                </div>
              )}
            </>
          )}
        </>
      </CardContent>
      <License
        open={licenseDialog}
        setOpen={setLicenseDialog}
        extension={extension}
        server={selectedServer}
      />
    </Card>
  )
}

function License({
  open,
  setOpen,
  extension,
  server,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  extension: IExtension
  server: string
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
      .post(`/settings/extensions/${extension.id}/license`, {
        license: data,
        server_id: server,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("subscriptions.subcard.success"),
        })
        emitter.emit("SUBSCRIPTION_REFRESH_" + extension.id)
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("subscriptions.subcard.error"),
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
