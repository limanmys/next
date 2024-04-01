import { useState } from "react"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { Download, MoreHorizontal, PlusCircle, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

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

import { SelectServer } from "../selectbox/server-select"
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

export function ExtensionRowActions({ row }: { row: Row<IExtension> }) {
  const extension = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [licenseDialog, setLicenseDialog] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation("settings")

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
        title: t("information"),
        description: t("extensions.actions.download_start"),
      }),
    postDownloading: () =>
      toast({
        title: t("information"),
        description: t("extensions.actions.download_success"),
      }),
    onError: () => {
      toast({
        title: t("error"),
        description: t("extensions.actions.download_error"),
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
            className="flex size-5 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setLicenseDialog(true)}>
            <PlusCircle className="mr-2 size-3.5" />
            {t("extensions.actions.add_license")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={download}>
            <Download className="mr-2 size-3.5" />
            {t("extensions.actions.download")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 size-3.5" />
            {t("extensions.actions.delete")}
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
  const [server, setServer] = useState<string>("")
  const { t } = useTranslation("settings")

  const handleCreate = () => {
    setLoading(true)

    apiService
      .getInstance()
      .post(`/settings/extensions/${extension.id}/license`, {
        license: data,
        server_id: server,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("extensions.actions.license.success_msg"),
        })
        emitter.emit("REFETCH_EXTENSIONS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("extensions.actions.license.error_msg"),
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
          <DialogTitle>{t("extensions.actions.license.title")}</DialogTitle>
          <DialogDescription>
            {t("extensions.actions.license.description")}
          </DialogDescription>
        </DialogHeader>

        {extension.license_type === "golang_standard" && (
          <SelectServer
            defaultValue=""
            onValueChange={(value) => setServer(value)}
          />
        )}
        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="license">
            {t("extensions.actions.license.form.license")}
          </Label>
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
            {t("extensions.actions.license.form.cancel")}
          </Button>
          <Button disabled={loading} onClick={() => handleCreate()}>
            {!loading ? (
              <PlusCircle className="mr-2 size-4" />
            ) : (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t("extensions.actions.license.form.submit")}
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
  const { t } = useTranslation("settings")

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/settings/extensions/${extension.id}`)
      .then(() => {
        toast({
          title: t("success"),
          description: t("extensions.actions.delete_dialog.success_msg"),
        })
        emitter.emit("REFETCH_EXTENSIONS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("extensions.actions.delete_dialog.success_msg"),
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
            {t("extensions.actions.delete_dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("extensions.actions.delete_dialog.description", {
                  extension: extension.display_name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("extensions.actions.delete_dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="size-4 animate-spin" />}
            {t("extensions.actions.delete_dialog.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
