import { useState } from "react"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IExternalNotification } from "@/types/notification"
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

export function ExternalNotificationActions({
  row,
}: {
  row: Row<IExternalNotification>
}) {
  const externalNotification = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const { t } = useTranslation("settings")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-5 w-5 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">
              {t("external_notifications.actions.open_menu")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 h-3.5 w-3.5" />
            {t("external_notifications.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        externalNotification={externalNotification}
      />
    </>
  )
}

function DeleteDialog({
  open,
  setOpen,
  externalNotification,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  externalNotification: IExternalNotification
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation("settings")

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/settings/notifications/external/${externalNotification.id}`)
      .then(() => {
        toast({
          title: t("external_notifications.actions.success"),
          description: t("external_notifications.actions.toasts.success"),
        })
        emitter.emit("REFETCH_EXTERNAL_NOTIFICATIONS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("external_notifications.actions.error"),
          description: t("external_notifications.actions.toasts.error"),
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
            {t("external_notifications.actions.confirm")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("external_notifications.actions.confirm_delete", {
                  external_notification: externalNotification.name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("external_notifications.actions.no")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="h-4 w-4 animate-spin" />}
            {t("external_notifications.actions.yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
