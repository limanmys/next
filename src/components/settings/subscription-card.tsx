import { useEffect, useState } from "react"
import { apiService } from "@/services"
import { MoreHorizontal, PlusCircle, Send, Server, XCircle } from "lucide-react"

import { IExtension } from "@/types/extension"
import { IServer } from "@/types/server"
import { ISubscription } from "@/types/subscription"

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
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ISubscription>({} as ISubscription)
  const [licenseDialog, setLicenseDialog] = useState<boolean>(false)
  const [servers, setServers] = useState<IServer[]>()
  const [selectedServer, setSelectedServer] = useState<string>("")
  const [serverLoading, setServerLoading] = useState<boolean>(true)

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
                  <SelectTrigger className="w-[200px] h-18">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Sunucu seçiniz..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Seçilebilir sunucular</SelectLabel>
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
            <Skeleton className="w-[200px] h-18 rounded-full" />
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
                <span className="sr-only">Abonelik Seçenekleri</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Abonelik Seçenekleri</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  window.open("mailto:aciklab@havelsan.com.tr", "_blank")
                }
              >
                <Send className="mr-2 h-4 w-4" /> Aboneliği Yenile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLicenseDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Lisans Ekle
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
                  Kalan Gün Sayısı
                </h5>
                <div className="flex items-center gap-5">
                  <Skeleton className="h-20 w-20 rounded-full" />

                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </span>
                    <small className="text-foreground/60">gün kaldı</small>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="part">
                  <h5 className="mb-1 font-semibold tracking-tight">
                    Lisanslayan
                  </h5>
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div>

                <div className="part">
                  <h5 className="mb-1 font-semibold tracking-tight">
                    İzin Verilen Cihaz Sayısı
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
                      Kalan Gün Sayısı
                    </h5>
                    <div className="flex items-center gap-5">
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

                      <div className="flex flex-col">
                        <span className="text-3xl font-bold">
                          {calculateRemainingDays(data.timestamp)}
                        </span>
                        <small className="text-foreground/60">gün kaldı</small>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="part">
                      <h5 className="mb-1 font-semibold tracking-tight">
                        Lisanslayan
                      </h5>
                      {data.owner}
                    </div>

                    <div className="part">
                      <h5 className="mb-1 font-semibold tracking-tight">
                        İzin Verilen Cihaz Sayısı
                      </h5>
                      {data.client_count}
                    </div>
                  </div>
                </div>
              )}
              {!data.valid && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <XCircle className="h-12 w-12 text-red-500" />
                  <h5 className="mb-1 font-semibold tracking-tight">
                    Aboneliğiniz bulunamadı.
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
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string>("")

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
          title: "Başarılı",
          description: "Lisans başarıyla eklendi.",
        })
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Lisans eklenirken hata oluştu.",
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
          <DialogTitle>Lisans Ekle</DialogTitle>
          <DialogDescription>
            Eklentiniz için size HAVELSAN A.Ş. tarafından verilen lisansı bu
            kısma giriniz.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="license">Lisans Bilgisi</Label>
          <Textarea id="license" onChange={(e) => setData(e.target.value)} />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            İptal
          </Button>
          <Button disabled={loading} onClick={() => handleCreate()}>
            {!loading ? (
              <PlusCircle className="mr-2 h-4 w-4" />
            ) : (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Ekle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
