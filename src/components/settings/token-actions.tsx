import { useState } from "react"
import { http } from "@/services"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IToken } from "@/types/token"
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

export function TokenActions({ row }: { row: Row<IToken> }) {
  const { t } = useTranslation("settings")

  const tokenObject = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)

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
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 size-3.5" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        tokenObject={tokenObject}
      />
    </>
  )
}

function DeleteDialog({
  open,
  setOpen,
  tokenObject,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  tokenObject: IToken
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const { t } = useTranslation("settings")
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setLoading(true)

    http
      .delete(`/settings/tokens/${tokenObject.id}`)
      .then(() => {
        toast({
          title: t("success"),
          description: t("tokens.toasts.delete_success"),
        })
        emitter.emit("REFETCH_TOKENS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("tokens.toasts.delete_error"),
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
          <AlertDialogTitle>{t("tokens.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("tokens.delete.description", {
                  token: tokenObject.name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("tokens.delete.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="size-4 animate-spin" />}
            {t("tokens.delete.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
