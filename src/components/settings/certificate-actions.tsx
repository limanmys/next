import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { Info, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/router"
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
import { ICertificate } from "@/types/certificate"

import { Icons } from "../ui/icons"
import { useToast } from "../ui/use-toast"

export function CertificateActions({ row }: { row: Row<ICertificate> }) {
  const { t } = useTranslation("settings")
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
            {t("advanced.certificates.actions.details")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 h-3.5 w-3.5" />
            {t("advanced.certificates.actions.delete.button")}
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
  const { t } = useTranslation("settings")
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
          title: t("success"),
          description: t("advanced.certificates.actions.delete.success"),
        })
        emitter.emit("REFETCH_CERTIFICATES")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("advanced.certificates.actions.delete.error"),
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
            {t("advanced.certificates.actions.delete.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("advanced.certificates.actions.delete.description", {
                  name: certificate.server_hostname,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("advanced.certificates.actions.delete.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="h-4 w-4 animate-spin" />}
            {t("advanced.certificates.actions.delete.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
