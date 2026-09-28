import { useRef, useState } from "react"
import { useSidebarContext } from "@/providers/sidebar-provider"
import { http } from "@/services"
import { Row } from "@tanstack/react-table"
import { Edit2, MoreHorizontal, ShieldCheck, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IServer } from "@/types/server"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
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
import { ServerKeySharing } from "@/components/settings/server-key-sharing"
import { SshHostKeyDialog } from "@/components/settings/ssh-host-key-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"

export function ServerRowActions({ row }: { row: Row<IServer> }) {
  const server = row.original
  const user = useCurrentUser()
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [hostKeyDialog, setHostKeyDialog] = useState(false)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation("settings")

  return (
    user.permissions.update_server && (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              ref={menuTrigger}
              variant="ghost"
              className="flex size-5 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">{t("servers.actions.menu")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-w-[calc(100vw-2rem)]">
            <DropdownMenuItem onClick={() => setEditDialog(true)}>
              <Edit2 className="mr-2 size-3.5" />
              {t("servers.actions.edit_btn")}
            </DropdownMenuItem>
            {["ssh", "ssh_certificate"].includes(server.type) && (
              <DropdownMenuItem onClick={() => setHostKeyDialog(true)}>
                <ShieldCheck className="mr-2 size-3.5" />
                {t("servers.actions.ssh_host_key.button")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
              <Trash className="mr-2 size-3.5" />
              {t("servers.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteServer
          open={deleteDialog}
          setOpen={setDeleteDialog}
          server={server}
        />
        <Edit open={editDialog} setOpen={setEditDialog} server={server} />
        <SshHostKeyDialog
          open={hostKeyDialog}
          setOpen={setHostKeyDialog}
          server={server}
          restoreFocus={() => menuTrigger.current?.focus()}
        />
      </>
    )
  )
}

function Edit({
  open,
  setOpen,
  server,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>(server.name)
  const [ipAddress, setIpAddress] = useState<string>(server.ip_address)
  const { t } = useTranslation("settings")
  const sidebarCtx = useSidebarContext()

  const handleEdit = () => {
    setLoading(true)

    http
      .patch(`/servers/${server.id}`, {
        name: name,
        ip_address: ipAddress,
      })
      .then(() => {
        toast({
          title: t("success"),
          description: t("servers.actions.edit.success_msg"),
        })
        emitter.emit("REFETCH_SERVERS")
        sidebarCtx.refreshServers()
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("servers.actions.edit.error_msg"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogContent
        className="max-h-[85dvh] overflow-y-auto sm:max-w-[525px]"
        closeLabel={t("servers.actions.edit.form.cancel")}
      >
        <DialogHeader>
          <DialogTitle>{t("servers.actions.edit.title")}</DialogTitle>
          <DialogDescription>
            {t("servers.actions.edit.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor={`server-name-${server.id}`}>
            {t("servers.actions.edit.form.name")}
          </Label>
          <Input
            id={`server-name-${server.id}`}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor={`server-address-${server.id}`}>
            {t("servers.actions.edit.form.ip_address")}
          </Label>
          <Input
            id={`server-address-${server.id}`}
            onChange={(e) => setIpAddress(e.target.value)}
            value={ipAddress}
          />
        </div>

        {open && <ServerKeySharing server={server} />}

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            {t("servers.actions.edit.form.cancel")}
          </Button>
          <Button disabled={loading} onClick={() => handleEdit()}>
            {!loading ? (
              <Edit2 className="mr-2 size-4" />
            ) : (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t("servers.actions.edit.form.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteServer({
  open,
  setOpen,
  server,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation("settings")
  const sidebarCtx = useSidebarContext()

  const handleDelete = () => {
    setLoading(true)

    http
      .delete(`/servers/${server.id}`)
      .then(() => {
        toast({
          title: t("success"),
          description: t("servers.actions.delete_dialog.success_msg"),
        })
        emitter.emit("REFETCH_SERVERS")
        sidebarCtx.refreshServers()
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("servers.actions.delete_dialog.error_msg"),
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
            {t("servers.actions.delete_dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("servers.actions.delete_dialog.description", {
                  server: server.name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("servers.actions.delete_dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="size-4 animate-spin" />}
            {t("servers.actions.delete_dialog.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
