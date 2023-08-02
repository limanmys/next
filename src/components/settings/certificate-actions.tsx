import { useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { Info, MoreHorizontal, Trash } from "lucide-react"

import { ICertificate } from "@/types/certificate"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../ui/icons"
import { useToast } from "../ui/use-toast"

export function CertificateActions({ row }: { row: Row<ICertificate> }) {
  const router = useRouter()
  const certificate = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)

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
          <DropdownMenuItem
            onClick={() =>
              router.push(`/settings/advanced/certificates/${row.original.id}`)
            }
          >
            <Info className="mr-2 h-3.5 w-3.5" />
            Detaylar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 h-3.5 w-3.5" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        certificate={certificate}
      />
    </>
  )
}

function DeleteDialog({
  open,
  setOpen,
  certificate,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  certificate: ICertificate
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/settings/advanced/certificates/${certificate.id}`)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Sertifika başarıyla silindi.",
        })
        emitter.emit("REFETCH_CERTIFICATES")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Sertifika silinirken hata oluştu.",
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
            Seçilen sertifika{" "}
            <b className="font-semibold">({certificate.server_hostname})</b>{" "}
            Liman sisteminden tamamen silinecektir. Bu işlem sonucunda
            eklentilere erişimde kesinti yaşanabilir. Devam etmek istiyor
            musunuz?
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
