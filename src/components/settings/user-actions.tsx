import { http } from "@/services"
import { Row } from "@tanstack/react-table"
import { Edit2, Footprints, MoreHorizontal, Trash } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

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
import { useEmitter } from "@/hooks/useEmitter"
import { IUser } from "@/types/user"

import { Icons } from "../ui/icons"
import { useToast } from "../ui/use-toast"

export function UserRowActions({ row }: { row: Row<IUser> }) {
  const user = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const emitter = useEmitter()
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
          <DropdownMenuItem onClick={() => emitter.emit("EDIT_USER", user)}>
            <Edit2 className="mr-2 size-3.5" />
            {t("roles.actions.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => emitter.emit("AUTH_LOG_DIALOG", user.id)}
          >
            <Footprints className="mr-2 size-3.5" />
            {t("users.auth_log.title")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialog(true)} disabled={user.auth_type != 'local'}>
            <Trash className="mr-2 size-3.5" />
            {t("delete")}
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
  const { t } = useTranslation("settings")

  const handleDelete = () => {
    setLoading(true)

    http
      .delete(`/settings/users/${user.id}`)
      .then(() => {
        toast({
          title: t("success"),
          description: t("users.delete.success"),
        })
        emitter.emit("REFETCH_USERS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("users.delete.error"),
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
          <AlertDialogTitle>{t("users.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("users.delete.subtext", {
                  username: user.name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("users.delete.no")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="size-4 animate-spin" />}
            {t("users.delete.yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
