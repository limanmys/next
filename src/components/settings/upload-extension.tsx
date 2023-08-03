import { useState } from "react"
import { apiService } from "@/services"
import { UploadCloud } from "lucide-react"

import { useEmitter } from "@/hooks/useEmitter"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function UploadExtension() {
  const { toast } = useToast()
  const emitter = useEmitter()

  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)

  const [alertOpen, setAlertOpen] = useState<boolean>(false)

  const upload = async (customRequest: any) => {
    return new Promise<number>(async (resolve, reject) => {
      setLoading(true)
      await apiService
        .getInstance()
        .post(
          `/settings/extensions/upload`,
          {
            extension: file,
            ...customRequest,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Başarılı",
              description: res.data.message,
            })
            emitter.emit("REFETCH_EXTENSIONS")
            setOpen(false)
            resolve(res.status)
          } else {
            if (res.status === 203) {
              reject(res.status)
            } else {
              toast({
                title: "Hata",
                description: JSON.stringify(res.data),
                variant: "destructive",
              })
              reject(res.status)
            }
          }
        })
        .catch((error) => {
          toast({
            title: "Hata",
            description: JSON.stringify(error.response.data),
            variant: "destructive",
          })
          reject(500)
        })
        .finally(() => setLoading(false))
    })
  }

  const handleCreate = () => {
    upload({})
      .then((status) => {
        if (status === 200) {
          setFile(null)
          setOpen(false)
        }
      })
      .catch((status) => {
        if (status === 203) {
          setAlertOpen(true)
        }
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="ml-auto h-8 lg:flex">
          <UploadCloud className="mr-2 h-4 w-4" />
          Yükle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Eklenti Yükle</DialogTitle>
          <DialogDescription>
            Güvenmediğiniz <b className="font-semibold">.zip</b> dosyalarını
            yüklemenizi tavsiye etmiyoruz.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="extension">Dosya</Label>
          <Input
            id="extension"
            type="file"
            accept=".zip,.signed,.lmne"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            İptal
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {!loading ? (
              <UploadCloud className="mr-2 h-4 w-4" />
            ) : (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Yükle
          </Button>
        </div>

        <AlertDialog
          open={alertOpen}
          onOpenChange={(open) => setAlertOpen(open)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu eklenti dosyası imzalanmamış görünüyor. Bu eklentiyi yüklemek
                istediğinize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Vazgeç</AlertDialogCancel>
              <AlertDialogAction onClick={() => upload({ force: true })}>
                Onayla
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
