import { useState } from "react"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IVault } from "@/types/vault"
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
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

export function VaultRowActions({ row }: { row: Row<IVault> }) {
  const vault = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const { t } = useTranslation("settings")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-5 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => setEditDialog(true)}
            disabled={vault.type == "key"}
          >
            <Edit className="mr-2 size-3.5" />
            {t("vault.actions.edit.button")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 size-3.5" />
            {t("vault.actions.delete.button")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        vault={vault}
      />
      <EditVaultKey open={editDialog} setOpen={setEditDialog} vault={vault} />
    </>
  )
}

function DeleteDialog({
  open,
  setOpen,
  vault,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  vault: IVault
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const { t } = useTranslation("settings")
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/settings/vault`, {
        data: {
          type: vault.type,
          id: vault.id,
        },
      })
      .then(() => {
        toast({
          title: t("vault.actions.delete.success"),
          description: t("vault.actions.delete.success_msg"),
        })
        emitter.emit("REFETCH_VAULT")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("vault.actions.delete.error"),
          description: t("vault.actions.delete.error_msg"),
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
          <AlertDialogTitle>
            {t("vault.actions.delete.confirm")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("vault.actions.delete.confirm_msg")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("vault.actions.delete.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="size-4 animate-spin" />}
            {t("vault.actions.delete.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function EditVaultKey({
  open,
  setOpen,
  vault,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  vault: IVault
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation("settings")
  const [data, setData] = useState<string>("")

  const handleCreate = () => {
    setLoading(true)

    apiService
      .getInstance()
      .patch(`/settings/vault`, { value: data, setting_id: vault.id })
      .then(() => {
        toast({
          title: t("vault.actions.edit.success"),
          description: t("vault.actions.edit.success_msg"),
        })
        emitter.emit("REFETCH_VAULT")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("vault.actions.edit.error"),
          description: t("vault.actions.edit.error_msg"),
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
          <DialogTitle>{t("vault.actions.edit.confirm")}</DialogTitle>
          <DialogDescription>
            {t("vault.actions.edit.confirm_msg")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="license">{t("vault.actions.edit.data")}</Label>
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
            {t("vault.actions.edit.cancel")}
          </Button>
          <Button disabled={loading} onClick={() => handleCreate()}>
            {!loading ? (
              <Edit className="mr-2 size-4" />
            ) : (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t("vault.actions.edit.edit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
