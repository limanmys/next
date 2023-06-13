import { useState } from "react"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { AxiosResponse } from "axios"
import { Download, MoreHorizontal, PlusCircle, Trash } from "lucide-react"

import { IExtension } from "@/types/extension"
import { useDownloadFile } from "@/hooks/useDownloadFile"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

export function ExtensionRowActions({ row }: { row: Row<IExtension> }) {
  const extension = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [licenseDialog, setLicenseDialog] = useState(false)
  const { toast } = useToast()

  const { ref, url, download, name } = useDownloadFile({
    apiDefinition: () => {
      return apiService
        .getInstance()
        .get(`/settings/extensions/${extension.id}/download`, {
          responseType: "blob",
        })
    },
    preDownloading: () =>
      toast({
        title: "Bilgi",
        description: "İndirme başladı.",
      }),
    postDownloading: () =>
      toast({
        title: "Bilgi",
        description: "İndirme tamamlandı.",
      }),
    onError: () => {
      toast({
        title: "Hata",
        description: "Eklenti indirilirken bir hata oluştu.",
      })
    },
    getFileName: () => {
      return `${extension.name}-${extension.version}.lmne`
    },
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-5 w-5 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setLicenseDialog(true)}>
            <PlusCircle className="mr-2 h-3.5 w-3.5" />
            Lisans Ekle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={download}>
            <Download className="mr-2 h-3.5 w-3.5" />
            İndir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 h-3.5 w-3.5" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <a href={url} download={name} className="hidden" ref={ref} />
      <DeleteExtension
        open={deleteDialog}
        setOpen={setDeleteDialog}
        extension={extension}
      />
      <License
        open={licenseDialog}
        setOpen={setLicenseDialog}
        extension={extension}
      />
    </>
  )
}

function License({
  open,
  setOpen,
  extension,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  extension: IExtension
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string>("")

  const handleCreate = () => {
    setLoading(true)

    apiService
      .getInstance()
      .post(`/settings/extensions/${extension.id}/license`, { license: data })
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Lisans başarıyla eklendi.",
        })
        emitter.emit("REFETCH_EXTENSIONS")
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

function DeleteExtension({
  open,
  setOpen,
  extension,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  extension: IExtension
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/settings/extensions/${extension.id}`)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Eklenti başarıyla silindi.",
        })
        emitter.emit("REFETCH_EXTENSIONS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Eklenti silinirken hata oluştu.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Seçilen eklenti{" "}
            <b className="font-semibold">({extension.display_name})</b> Liman
            sisteminden tamamen kaldırılacaktır. Bu işlem sonucunda kasa
            verilerinizde ve eklenti izinlerinde kayıp olabilir. Devam etmek
            istiyor musunuz?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="h-4 w-4 animate-spin" />}
            Onayla
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
