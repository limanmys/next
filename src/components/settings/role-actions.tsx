import { useState } from "react"
import { useRouter } from "next/router"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { IRole } from "@/types/role"
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

export function RoleRowActions({ row }: { row: Row<IRole> }) {
  const role = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const router = useRouter()

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
        <DropdownMenuContent className="w-[160px]">
          <DropdownMenuItem
            onClick={() => router.push(`/settings/roles/${role.id}/users`)}
          >
            <Edit className="mr-2 h-3.5 w-3.5" />
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 h-3.5 w-3.5" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteRole open={deleteDialog} setOpen={setDeleteDialog} role={role} />
    </>
  )
}

function DeleteRole({
  open,
  setOpen,
  role,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  role: IRole
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/settings/roles/${role.id}`)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Rol başarıyla silindi.",
        })
        emitter.emit("REFETCH_ROLES")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: "Hata",
          description: "Rol silinirken hata oluştu.",
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
            Seçilen rol <b className="font-semibold">({role.name})</b> Liman
            sisteminden tamamen kaldırılacaktır. şDevam etmek istiyor musunuz?
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
