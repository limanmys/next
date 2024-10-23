import { useState } from "react"
import { useRouter } from "next/router"
import { http } from "@/services"
import { Row } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../ui/icons"
import { useToast } from "../ui/use-toast"

export function RoleRowActions({ row }: { row: Row<IRole> }) {
  const role = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const router = useRouter()
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
        <DropdownMenuContent className="w-[160px]">
          <DropdownMenuItem
            onClick={() => router.push(`/settings/roles/${role.id}/users`)}
          >
            <Edit className="mr-2 size-3.5" />
            {t("roles.actions.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 size-3.5" />
            {t("roles.actions.delete")}
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
  const { t } = useTranslation("settings")

  const handleDelete = () => {
    setLoading(true)

    http
      .delete(`/settings/roles/${role.id}`)
      .then(() => {
        toast({
          title: t("success"),
          description: t("roles.actions.success"),
        })
        emitter.emit("REFETCH_ROLES")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("roles.actions.error"),
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
          <AlertDialogTitle>{t("roles.actions.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("roles.actions.subtext", {
                  role_name: role.name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("roles.actions.no")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="size-4 animate-spin" />}
            {t("roles.actions.yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
