import { useState } from "react"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Trash } from "lucide-react"

import { IUser } from "@/types/user"
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

export function UserRowActions({ row }: { row: Row<IUser> }) {
  const user = row.original
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
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 h-3.5 w-3.5" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog open={deleteDialog} setOpen={setDeleteDialog} user={user} />
    </>
  )
}

function DeleteDialog({
  open,
  setOpen,
  user,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  user: IUser
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/settings/users/${user.id}`)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Kullanıcı başarıyla silindi.",
        })
        emitter.emit("REFETCH_USERS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Kullanıcı silinirken hata oluştu.",
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
            Seçilen kullanıcı <b className="font-semibold">({user.name})</b>{" "}
            Liman sisteminden tamamen silinecektir. Bu işlem sonucunda kasa
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
